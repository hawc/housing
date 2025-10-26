import { slugify } from '@/utils/slugify';

export function isSettlementFound(name: string, city = '', searchTerm: string) {
  const searchTermSlug = slugify(searchTerm);

  return (
    slugify(name).includes(searchTermSlug) ||
    slugify(city).includes(searchTermSlug)
  );
}
