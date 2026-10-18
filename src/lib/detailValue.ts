export type DetailValueKind = 'integer' | 'area' | 'text';

export class DetailValueError extends Error {}

export function detailValueKind(typeName: string): DetailValueKind {
  if (/^Fläche\b/i.test(typeName.trim())) return 'area';
  if (
    /^(?:Einwohner(?:\*?innen|zahl|anzahl)?|Bewohner(?:\*?innen|zahl|anzahl)?|Bevölkerung(?:szahl)?|Wohneinheiten|Wohnungs(?:zahl|anzahl)|Wohnungen|Gebäude(?:zahl|anzahl)?)(?:\s*\([^)]*\))?$/i.test(
      typeName.trim(),
    )
  )
    return 'integer';
  return 'text';
}

// Shared by both editors and all persistence paths. Never guess whether a
// separator means a decimal point or a thousands separator.
export function detailValueError(
  typeName: string,
  value: unknown,
): string | null {
  const kind = detailValueKind(typeName);
  if (kind === 'text') return null;
  if (
    kind === 'integer' &&
    (typeof value !== 'string' ||
      !/^\d+$/.test(value) ||
      !Number.isSafeInteger(Number(value)) ||
      Number(value) < 1)
  )
    return 'Für diesen Typ muss der Wert eine positive ganze Zahl ohne Tausendertrennzeichen sein.';
  if (
    kind === 'area' &&
    (typeof value !== 'string' ||
      !/^\d+(\.\d+)?$/.test(value) ||
      !Number.isFinite(Number(value)) ||
      Number(value) <= 0)
  )
    return 'Flächen bitte als positive Zahl mit Dezimalpunkt eingeben; Einheit des Typs beachten.';
  return null;
}

export function validateDetailValue(typeName: string, value: unknown): void {
  const error = detailValueError(typeName, value);
  if (error) throw new DetailValueError(error);
}
