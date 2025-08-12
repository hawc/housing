export const LOCALE = 'de';

export function sortAlphabetically<T>(array: (T & { name: string })[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}
