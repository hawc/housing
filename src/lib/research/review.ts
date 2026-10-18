import { touchSettlement } from '../contentUpdates';
import { Prisma } from '@prisma/client';
import prisma from '../prisma';
import { requiresDetailDate } from '../settlementFormFields';
import { detailDateFromDraft, resolveProposalDraft } from './proposalDraft';
import {
  annotationWithYear,
  hash,
  parseDraft,
  ResearchError,
  validateDetailValue,
  validateDetailScope,
} from './validation';
import {
  baselineFor,
  isSourceResourceType,
  settlementResearchInclude,
} from './proposals';
import { json, transaction } from './transaction';

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
    await touchSettlement(tx, settlement.id, [
      proposal.kind === 'DETAIL' ? 'details' : 'links',
    ]);
    return { status, settlementId: settlement.id };
  });
}
