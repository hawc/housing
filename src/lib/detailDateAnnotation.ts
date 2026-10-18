import { dateInputValue } from './calendarDate';

const yearNote = /(^| · |\n)Stand: (\d{4}) \(Jahresangabe\)(?=$| · |\n)/g;

// Only remove our exact generated precision notes. Historical years and other
// source notes are ordinary authored content and must be preserved.
export function annotationWithReferenceYear(
  annotation: string,
  referenceYear: number | null,
): string {
  const rest = annotation
    .replace(yearNote, '')
    .replace(/^(?: · |\n)+|(?: · |\n)+$/g, '')
    .trim();
  return [
    rest,
    referenceYear === null ? '' : `Stand: ${referenceYear} (Jahresangabe)`,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function annotationForDetailDate(
  annotation: string | null | undefined,
  input: string | Date | null | undefined,
  previousDate?: Date | null,
): string {
  if (typeof input === 'string' && /^\d{4}$/.test(input.trim()))
    return annotationWithReferenceYear(annotation ?? '', Number(input.trim()));
  const day = dateInputValue(input);
  const matches = [...(annotation ?? '').matchAll(yearNote)];
  const preservedYear =
    previousDate &&
    day === dateInputValue(previousDate) &&
    day.endsWith('-12-31') &&
    matches.length > 0 &&
    matches.every((match) => match[2] === day.slice(0, 4))
      ? Number(day.slice(0, 4))
      : null;
  return annotationWithReferenceYear(annotation ?? '', preservedYear);
}
