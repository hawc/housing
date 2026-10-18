import { DetailFormValues, ResourceFormValues } from '../settlementFormFields';
import { annotationWithReferenceYear } from '../detailDateAnnotation';

// Optional fields keep existing queued proposals and approval logs readable.
export type ProposalDraft = {
  name: string;
  value: string;
  typeId: string;
  annotation: string;
  referenceYear: number | null;
  detailDate?: string | null;
  source?: string;
  url?: string;
  license?: string;
  copyright?: string;
};

export type ResolvedProposalDraft = Required<ProposalDraft>;
export type ProposalSource = { url: string; title: string };

export function resolveProposalDraft(
  draft: ProposalDraft,
  kind: 'DETAIL' | 'RESOURCE',
  source: ProposalSource,
): ResolvedProposalDraft {
  return {
    ...draft,
    name: draft.name.trim(),
    value: draft.value.trim(),
    annotation: draft.annotation.trim(),
    detailDate: draft.detailDate ?? null,
    source: (draft.source ?? (kind === 'DETAIL' ? source.url : '')).trim(),
    url: (draft.url ?? source.url).trim(),
    license: (draft.license ?? '').trim(),
    copyright: (draft.copyright ?? '').trim(),
  };
}

export function annotationWithYear(draft: ProposalDraft) {
  return annotationWithReferenceYear(draft.annotation, draft.referenceYear);
}

// Year-only evidence uses the archive's explicit year-end convention.
// The original precision stays in referenceYear and the saved annotation.
export function detailDateFromDraft(draft: ProposalDraft): string | null {
  return (
    draft.detailDate ??
    (draft.referenceYear ? `${draft.referenceYear}-12-31` : null)
  );
}

export function detailValuesFromDraft(
  draft: ResolvedProposalDraft,
  stored = false,
  savedDate?: string,
): DetailFormValues {
  return {
    detailTypeId: draft.typeId,
    name: draft.name,
    description: draft.value,
    annotation: stored ? annotationWithYear(draft) : draft.annotation,
    detailDate: savedDate ?? detailDateFromDraft(draft) ?? '',
    source: draft.source,
  };
}

export function resourceValuesFromDraft(
  draft: ResolvedProposalDraft,
): ResourceFormValues {
  return {
    resourceTypeId: draft.typeId,
    name: draft.name,
    description: draft.value,
    copyright: draft.copyright,
    license: draft.license,
    source: draft.source,
    url: draft.url,
  };
}
