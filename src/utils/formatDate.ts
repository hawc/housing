const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
} as const;

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-de', DATE_OPTIONS);
}
