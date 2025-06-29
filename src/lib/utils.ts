import { default as slugifyFunction } from 'slugify';

export const LOCALE = 'de';

export function sortAlphabetically<T>(array: (T & { name: string; })[]) {
  return array.sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}

export function sortByDate(array, type: string) {
  return array.sort((a, b) => new Date(a[type]).getTime() - new Date(b[type]).getTime());
}

export function slugify(string: string) {
  return slugifyFunction(string, { lower: true, locale: LOCALE });
}

export function getUniqueLabel(label: string, uuid: string) {
  return `${label}-${uuid}`;
}

export function dateIsValid(date) {
  return !Number.isNaN(new Date(date).getTime());
}
