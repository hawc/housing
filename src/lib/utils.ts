import { default as slugifyFunction } from 'slugify';

const LOCALE = 'de';

export function sortAlphabetically(array) {
  return array.sort((a, b) => a.name.localeCompare(b.name, LOCALE));
}

export function sortByDate(array, type: string) {
  return array.sort((a, b) => new Date(a[type]).getTime() - new Date(b[type]).getTime());
}

export function slugify(string: string) {
  return slugifyFunction(string, { lower: true, locale: LOCALE });
}