import { Prisma, ProposalKind } from '@prisma/client';
import prisma from '../prisma';
import { dateInputValue } from '../calendarDate';
import { sameDetailScope } from '../detailScope';
import { detailDateFromDraft, resolveProposalDraft } from './proposalDraft';
import { canonicalUrl, hash, ProposalDraft, ResearchError } from './validation';
import { candidateFingerprint, ResearchResult } from './provider';
import { json, transaction } from './transaction';

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

export function isSourceResourceType(name: string) {
  return (
    /(website|webseite|quelle|artikel|text|link|literatur|dokument|pdf)/i.test(
      name,
    ) && !/(foto|bild|video)/i.test(name)
  );
}
