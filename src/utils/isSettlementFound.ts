import { slugify } from '@/utils/slugify';

export function isSettlementFound(name: string, city = '', searchTerm: string) {
  return slugify(name).includes(slugify(searchTerm)) || slugify(city).includes(slugify(searchTerm));
}
