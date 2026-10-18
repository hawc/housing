import { Prisma, PrismaClient, ProposalKind } from '@prisma/client';
import prisma from '../prisma';
import { detailDateFromDraft, resolveProposalDraft } from './proposalDraft';
import { requiresDetailDate } from '../settlementFormFields';
import { dateInputValue } from '../calendarDate';
import { sameDetailScope } from '../detailScope';
import {
  annotationWithYear,
  canonicalUrl,
  hash,
  parseDraft,
  parseSettlementIds,
  ProposalDraft,
  ResearchError,
  validateDetailValue,
  validateDetailScope,
} from './validation';
import {
  candidateFingerprint,
  researchConfigured,
  researchModel,
  ResearchResult,
} from './provider';

type Transaction = Prisma.TransactionClient;
const json = (value: unknown): Prisma.InputJsonValue =>
  JSON.parse(JSON.stringify(value));

export async function transaction<T>(
  db: PrismaClient,
  callback: (tx: Transaction) => Promise<T>,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await db.$transaction(callback, { timeout: 15000 });
    } catch (error) {
      if (
        attempt >= 3 ||
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== 'P2034'
      )
        throw error;
    }
  }
}

export function comparableUrl(url: string) {
  try {
    return canonicalUrl(url);
  } catch {
    return url;
  }
}

export const settlementResearchInclude = {
  location: true,
  details: { orderBy: { id: 'asc' as const } },
  resources: { orderBy: { id: 'asc' as const } },
} satisfies Prisma.SettlementsInclude;

export type ResearchSettlement = Prisma.SettlementsGetPayload<{
  include: typeof settlementResearchInclude;
}>;

export function baselineFor(
  settlement: ResearchSettlement,
  kind: ProposalKind,
  draft: ProposalDraft,
  url: string,
) {
  return json({
    published: settlement.published,
    identity: {
      name: settlement.name,
      city: settlement.location?.city ?? null,
      district: settlement.location?.district ?? null,
    },
    records:
      kind === 'DETAIL'
        ? settlement.details.filter(
            (item) => item.detailTypeId === draft.typeId,
          )
        : settlement.resources.filter(
            (item) => comparableUrl(item.url) === url,
          ),
  });
}

export async function startResearch(
  ids: unknown,
  createdBy: string,
  db = prisma,
) {
  const settlementIds = parseSettlementIds(ids);
  if (!researchConfigured())
    throw new ResearchError(
      'Für die Recherche fehlt OPENAI_API_KEY auf dem Server.',
      503,
    );
  return transaction(db, async (tx) => {
    const active = await tx.researchJob.count({
      where: { status: { in: ['QUEUED', 'RUNNING'] } },
    });
    if (active)
      throw new ResearchError(
        'Es läuft bereits eine Recherche. Bitte erst diesen Lauf abschließen.',
        409,
      );
    const pending = await tx.changeProposal.count({
      where: { status: 'PENDING' },
    });
    if (pending >= 100)
      throw new ResearchError(
        'Bitte zuerst die offenen Vorschläge reviewen (Limit: 100).',
        409,
      );
    const count = await tx.settlements.count({
      where: { id: { in: settlementIds }, published: true },
    });
    if (count !== settlementIds.length)
      throw new ResearchError(
        'Eine ausgewählte Siedlung ist nicht mehr verfügbar.',
        409,
      );
    return tx.researchRun.create({
      data: {
        createdBy,
        model: researchModel(),
        jobs: {
          create: settlementIds.map((settlementId) => ({ settlementId })),
        },
      },
      select: { id: true },
    });
  });
}

export async function cancelResearch(
  runId: string,
  reviewer: string,
  db = prisma,
) {
  const result = await db.researchJob.updateMany({
    where: { runId, status: { in: ['QUEUED', 'RUNNING'] } },
    data: {
      status: 'FAILED',
      error: `Manuell abgebrochen von ${reviewer}.`,
      finishedAt: new Date(),
      leaseToken: null,
      leaseUntil: null,
    },
  });
  return { cancelled: result.count };
}

export async function persistResearch(
  jobId: string,
  leaseToken: string,
  settlement: ResearchSettlement,
  result: ResearchResult,
  db = prisma,
) {
  return transaction(db, async (tx) => {
    const claimed = await tx.researchJob.updateMany({
      where: {
        id: jobId,
        status: 'RUNNING',
        leaseToken,
        leaseUntil: { gt: new Date() },
      },
      data: {
        status: 'COMPLETED',
        finishedAt: new Date(),
        leaseToken: null,
        leaseUntil: null,
        notes: `${result.notes}\nAntworten: ${result.responseIds.join(', ')}`
          .trim()
          .slice(0, 16000),
        error: null,
      },
    });
    if (!claimed.count)
      throw new ResearchError(
        'Rechercheauftrag wurde inzwischen anderweitig übernommen.',
        409,
      );
    let created = 0;
    const fingerprints = new Set<string>();
    for (const candidate of result.candidates) {
      const { draft, kind, source } = candidate;
      if (
        kind === 'RESOURCE' &&
        settlement.resources.some(
          (item) => item.published && comparableUrl(item.url) === source.url,
        )
      )
        continue;
      if (
        kind === 'DETAIL' &&
        settlement.details.some(
          (item) =>
            item.published &&
            item.detailTypeId === draft.typeId &&
            item.description === draft.value &&
            sameDetailScope(item.annotation, draft.annotation) &&
            dateInputValue(item.detailDate) ===
              (detailDateFromDraft(draft) ?? ''),
        )
      )
        continue;
      const baseline = baselineFor(settlement, kind, draft, source.url);
      let fingerprint = candidateFingerprint(settlement.id, candidate);
      const previous = await tx.changeProposal.findUnique({
        where: { fingerprint },
        select: { id: true, status: true },
      });
      // A stale proposal may be researched again against the changed baseline.
      // Rejected and pending proposals remain suppressed for unchanged sources.
      if (previous?.status === 'STALE')
        fingerprint = hash([fingerprint, baseline]);
      else if (previous) continue;
      if (fingerprints.has(fingerprint)) continue;
      fingerprints.add(fingerprint);
      if (
        await tx.changeProposal.findUnique({
          where: { fingerprint },
          select: { id: true },
        })
      )
        continue;
      const savedSource = await tx.researchSource.upsert({
        where: { jobId_url: { jobId, url: source.url } },
        update: {},
        create: {
          jobId,
          url: source.url,
          title: source.title,
          contentHash: hash(source.text),
          retrievedAt: source.retrievedAt,
        },
      });
      await tx.changeProposal.create({
        data: {
          jobId,
          settlementId: settlement.id,
          sourceId: savedSource.id,
          kind,
          fingerprint,
          payload: json(resolveProposalDraft(draft, kind, source)),
          baseline,
          evidence: candidate.evidence,
          locator: candidate.locator,
          warnings: candidate.warnings,
        },
      });
      created++;
    }
    return created;
  });
}

export async function reviewProposal(
  id: string,
  revision: number,
  action: 'approve' | 'reject',
  reviewer: string,
  input: unknown,
  note: string,
  db = prisma,
) {
  return transaction(db, async (tx) => {
    const proposal = await tx.changeProposal.findUnique({
      where: { id },
      include: { source: true, changeLog: true },
    });
    if (!proposal) throw new ResearchError('Vorschlag nicht gefunden.', 404);
    // Network retries and double clicks are harmless, including after a committed transaction.
    if (action === 'approve' && proposal.status === 'APPLIED') {
      const applied = proposal.changeLog?.after as
        | { approvedDraft?: Prisma.JsonValue }
        | undefined;
      if (
        proposal.revision !== revision + 1 ||
        !applied?.approvedDraft ||
        hash(
          resolveProposalDraft(
            parseDraft(applied.approvedDraft, proposal.kind),
            proposal.kind,
            proposal.source,
          ),
        ) !==
          hash(
            resolveProposalDraft(
              parseDraft(input, proposal.kind),
              proposal.kind,
              proposal.source,
            ),
          )
      ) {
        throw new ResearchError(
          'Dieser Vorschlag wurde bereits mit anderen Werten freigegeben. Bitte neu laden.',
          409,
        );
      }
      return { status: proposal.status, settlementId: proposal.settlementId };
    }
    if (
      action === 'reject' &&
      proposal.status === 'REJECTED' &&
      proposal.revision === revision + 1 &&
      proposal.reviewNote === note
    ) {
      return { status: proposal.status, settlementId: proposal.settlementId };
    }
    if (proposal.status !== 'PENDING' || proposal.revision !== revision)
      throw new ResearchError(
        'Dieser Vorschlag wurde bereits verändert. Bitte neu laden.',
        409,
      );
    const original = resolveProposalDraft(
      parseDraft(proposal.payload, proposal.kind),
      proposal.kind,
      proposal.source,
    );
    const draft =
      action === 'approve'
        ? resolveProposalDraft(
            parseDraft(input, proposal.kind),
            proposal.kind,
            proposal.source,
          )
        : original;
    if (draft.typeId !== original.typeId)
      throw new ResearchError(
        'Der Typ eines Vorschlags kann nicht geändert werden. Bitte ablehnen und neu recherchieren.',
      );
    if (proposal.kind === 'RESOURCE' && draft.url !== proposal.source.url)
      throw new ResearchError(
        'Die URL ist an die recherchierte Quelle gebunden.',
      );
    const settlement = await tx.settlements.findUnique({
      where: { id: proposal.settlementId },
      include: settlementResearchInclude,
    });
    if (!settlement) throw new ResearchError('Siedlung nicht gefunden.', 404);
    const current = baselineFor(
      settlement,
      proposal.kind,
      original,
      proposal.source.url,
    );
    const isStale =
      action === 'approve' &&
      (!settlement.published || hash(current) !== hash(proposal.baseline));
    const status =
      action === 'reject' ? 'REJECTED' : isStale ? 'STALE' : 'APPLIED';
    const claimed = await tx.changeProposal.updateMany({
      where: { id, status: 'PENDING', revision },
      data: {
        status,
        revision: { increment: 1 },
        reviewedBy: reviewer,
        reviewedAt: new Date(),
        reviewNote: note,
      },
    });
    if (!claimed.count)
      throw new ResearchError(
        'Vorschlag wurde gleichzeitig bearbeitet. Bitte neu laden.',
        409,
      );
    if (status !== 'APPLIED') return { status, settlementId: settlement.id };

    let record: unknown;
    let resultId: string;
    if (proposal.kind === 'DETAIL') {
      const type = await tx.detailTypes.findFirst({
        where: { id: draft.typeId, published: true },
      });
      if (!type)
        throw new ResearchError('Detailtyp ist nicht mehr verfügbar.', 409);
      validateDetailValue(draft, type.name);
      validateDetailScope(draft, type.name);
      const detailDate = detailDateFromDraft(draft);
      if (requiresDetailDate(type.name) && !detailDate)
        throw new ResearchError(
          `Für ${type.name} ist ein Bezugsdatum oder Bezugsjahr erforderlich.`,
        );
      const detail = await tx.details.create({
        data: {
          settlementId: settlement.id,
          detailTypeId: draft.typeId,
          name: draft.name,
          description: draft.value,
          annotation: annotationWithYear(draft),
          source: draft.source,
          detailDate: detailDate
            ? new Date(`${detailDate}T00:00:00.000Z`)
            : null,
          published: true,
        },
      });
      record = detail;
      resultId = detail.id;
    } else {
      const type = await tx.resourceTypes.findFirst({
        where: { id: draft.typeId, published: true },
      });
      if (!type || !isSourceResourceType(type.name))
        throw new ResearchError('Quellentyp ist nicht mehr verfügbar.', 409);
      const resource = await tx.resources.create({
        data: {
          settlementId: settlement.id,
          resourceTypeId: draft.typeId,
          name: draft.name,
          description: draft.value,
          source: draft.source,
          url: draft.url,
          license: draft.license,
          copyright: draft.copyright,
          published: true,
        },
      });
      record = resource;
      resultId = resource.id;
    }
    await tx.changeLog.create({
      data: {
        proposalId: id,
        kind: proposal.kind,
        resultId,
        before: current,
        after: json({
          record,
          approvedDraft: draft,
          originalDraft: original,
          evidence: proposal.evidence,
          source: proposal.source,
          revision,
        }),
        reviewedBy: reviewer,
      },
    });
    await tx.settlements.update({
      where: { id: settlement.id },
      data: { updatedAt: new Date() },
    });
    return { status, settlementId: settlement.id };
  });
}

export function isSourceResourceType(name: string) {
  return (
    /(website|webseite|quelle|artikel|text|link|literatur|dokument|pdf)/i.test(
      name,
    ) && !/(foto|bild|video)/i.test(name)
  );
}

export async function getResearchDashboard(
  status: 'PENDING' | 'APPLIED' | 'REJECTED' | 'STALE' = 'PENDING',
  db = prisma,
) {
  const [
    settlements,
    detailTypes,
    resourceTypes,
    runs,
    proposals,
    worker,
    pendingCount,
  ] = await Promise.all([
    db.settlements.findMany({
      where: { published: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        location: { select: { city: true } },
        _count: { select: { details: { where: { published: true } } } },
      },
    }),
    db.detailTypes.findMany({
      select: { id: true, name: true },
    }),
    db.resourceTypes.findMany({ select: { id: true, name: true } }),
    db.researchRun.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        jobs: {
          include: {
            settlement: { select: { name: true } },
            _count: { select: { proposals: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    db.changeProposal.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: {
        source: true,
        settlement: { select: { name: true, slug: true } },
        changeLog: {
          select: {
            id: true,
            resultId: true,
            reviewedBy: true,
            createdAt: true,
            after: true,
          },
        },
      },
    }),
    db.researchWorker.findUnique({ where: { id: 'research' } }),
    db.changeProposal.count({ where: { status: 'PENDING' } }),
  ]);
  return {
    settlements,
    detailTypes,
    resourceTypes,
    runs,
    proposals,
    pendingCount,
    configured: researchConfigured(),
    workerOnline: Boolean(
      worker && Date.now() - worker.updatedAt.getTime() < 60000,
    ),
  };
}
