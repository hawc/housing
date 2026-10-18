// Domain dates describe calendar days, not instants in the viewer's timezone.
// Preserve ISO calendar dates and serialize database Dates in UTC. Legacy
// toDateString values remain readable until they have been saved again.
export function dateInputValue(
  value: string | Date | number | null | undefined,
): string {
  if (value === null || value === undefined || value === '') return '';
  if (value instanceof Date || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }
  if (/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) return value.slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function calendarYear(value: string): string {
  return dateInputValue(value).slice(0, 4);
}
