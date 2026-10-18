import { createHash } from 'node:crypto';
import type { ProposalDraft } from './proposalDraft';
import { detailValueError } from '../detailValue';
import { detailScopeError } from '../detailScope';
export type { ProposalDraft } from './proposalDraft';
export { annotationWithYear } from './proposalDraft';

export class ResearchError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ResearchError('Ungültige Eingabe.');
  }
  return value as Record<string, unknown>;
}

export function string(
  value: unknown,
  label: string,
  max: number,
  required = true,
): string {
  if (
    typeof value !== 'string' ||
    value.length > max ||
    (required && !value.trim())
  ) {
    throw new ResearchError(`${label} fehlt oder ist zu lang.`);
  }
  return value.trim();
}

export function uuid(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  ) {
    throw new ResearchError('Ungültige ID.');
  }
  return value;
}

export function parseSettlementIds(value: unknown): string[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 5) {
    throw new ResearchError('Bitte eine bis fünf Siedlungen auswählen.');
  }
  const ids = value.map(uuid);
  if (new Set(ids).size !== ids.length)
    throw new ResearchError('Siedlungen sind doppelt ausgewählt.');
  return ids;
}

export function parseDraft(
  value: unknown,
  kind?: 'DETAIL' | 'RESOURCE',
): ProposalDraft {
  const draft = object(value);
  const year = draft.referenceYear;
  if (
    year !== null &&
    (!Number.isInteger(year) ||
      Number(year) < 1800 ||
      Number(year) > new Date().getUTCFullYear())
  ) {
    throw new ResearchError('Ungültiges Bezugsjahr.');
  }
  const extra: Partial<ProposalDraft> = {};
  for (const key of ['source', 'url', 'license', 'copyright'] as const) {
    if (key in draft)
      extra[key] = string(
        draft[key],
        key,
        key === 'source' || key === 'url' ? 2000 : 1000,
        false,
      );
  }
  if ('detailDate' in draft) {
    const date = draft.detailDate;
    if (date === null || date === '') extra.detailDate = null;
    else {
      if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date))
        throw new ResearchError('Ungültiges Datum.');
      const parsed = new Date(`${date}T00:00:00.000Z`);
      if (
        Number.isNaN(parsed.getTime()) ||
        parsed.toISOString().slice(0, 10) !== date
      )
        throw new ResearchError('Ungültiges Datum.');
      extra.detailDate = date;
    }
  }
  if (extra.detailDate && year !== null)
    throw new ResearchError(
      'Bitte entweder ein genaues Datum oder nur ein Bezugsjahr angeben.',
    );
  return {
    name: string(draft.name, 'Name', 160),
    value: string(
      draft.value,
      'Wert / Beschreibung',
      2000,
      kind !== 'RESOURCE',
    ),
    typeId: uuid(draft.typeId),
    annotation: string(draft.annotation, 'Anmerkung', 1000, false),
    referenceYear: year as number | null,
    ...extra,
  };
}

export function validateDetailValue(draft: ProposalDraft, typeName: string) {
  const error = detailValueError(typeName, draft.value);
  if (error) throw new ResearchError(error);
}

export function validateDetailScope(draft: ProposalDraft, typeName: string) {
  const error = detailScopeError(typeName, draft.annotation);
  if (error) throw new ResearchError(error);
}

export function normalizeText(text: string) {
  return text.normalize('NFKC').replace(/\s+/g, ' ').trim();
}

export function hash(value: unknown): string {
  const sorted = (input: unknown): unknown => {
    if (input instanceof Date) return input.toISOString();
    if (Array.isArray(input)) return input.map(sorted);
    if (input && typeof input === 'object')
      return Object.fromEntries(
        Object.entries(input)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, item]) => [key, sorted(item)]),
      );
    return input;
  };
  return createHash('sha256')
    .update(JSON.stringify(sorted(value)))
    .digest('hex');
}

export function canonicalUrl(input: string): string {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new ResearchError('Ungültiger Quellenlink.');
  }
  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    (url.port && url.port !== '443')
  ) {
    throw new ResearchError('Quellen müssen öffentliche HTTPS-Links sein.');
  }
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  return url.toString();
}
