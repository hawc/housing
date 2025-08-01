import { UpdateMap } from '@/app/updates/utils/groupUpdatesByDate';
import { SearchableItem, SearchableItemsList } from '@/components/blocks/SearchList';
import { default as slugifyFunction } from 'slugify';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

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

export function isSettlementFound(name: string, city = '', searchTerm: string) {
  return slugify(name).includes(slugify(searchTerm)) || slugify(city).includes(slugify(searchTerm));
}

export function groupBy(arr: SearchableItemsList, groupKey: 'city' | 'state'): { [key: string]: SearchableItem[]; } {
  return arr.reduce(function (acc, item) {
    if (!acc[item.location?.[groupKey] ?? '(ohne)']) {
      acc[item.location?.[groupKey] ?? '(ohne)'] = [];
    }
    acc[item.location?.[groupKey] ?? '(ohne)'].push(item);

    return acc;
  }, {});
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('de-de', DATE_OPTIONS);
}

export type ArrayMap<T = unknown> = Record<string, T[]>;

export function mergeArrayObjects<T = UpdateMap>(
  o1: ArrayMap<T>,
  o2: ArrayMap<T>,
  opts: { dedupe?: boolean } = {},
): ArrayMap<T> {
  const { dedupe = false } = opts;
  const out: ArrayMap<T> = { ...o1 };

  for (const [key, arr] of Object.entries(o2) as [string, T[]][]) {
    const merged = key in out ? [...out[key], ...arr] : [...arr];
    out[key] = dedupe ? [...new Set<T>(merged)] : merged;
  }

  return out;
}
