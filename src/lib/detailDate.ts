import { requiresDetailDate } from './settlementFormFields';

export class DetailDateError extends Error {}

export function normalizeDetailDate(
  typeName: string,
  input: unknown,
): Date | null {
  let date: Date | null = null;
  if (input !== null && input !== undefined && input !== '') {
    if (!(input instanceof Date) && typeof input !== 'string')
      throw new DetailDateError('Ungültiges Bezugsdatum.');
    const value = typeof input === 'string' ? input.trim() : input;
    const yearOnly = typeof value === 'string' && /^\d{4}$/.test(value);
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      const day = value.slice(0, 10);
      const calendar = new Date(`${day}T00:00:00.000Z`);
      if (
        Number.isNaN(calendar.getTime()) ||
        calendar.toISOString().slice(0, 10) !== day
      )
        throw new DetailDateError('Ungültiges Bezugsdatum.');
    }
    date = yearOnly
      ? new Date(`${value}-12-31T00:00:00.000Z`)
      : new Date(value);
    if (Number.isNaN(date.getTime()))
      throw new DetailDateError('Ungültiges Bezugsdatum.');
  }
  if (requiresDetailDate(typeName) && !date)
    throw new DetailDateError(
      `Für ${typeName} ist ein Bezugsdatum erforderlich. Eine reine Jahresangabe wird als 31.12. des Jahres eingetragen.`,
    );
  return date;
}
