import { default as slugifyFunction } from 'slugify';

const LOCALE = 'de';

export function slugify(string: string) {
  return slugifyFunction(string, { lower: true, locale: LOCALE });
}