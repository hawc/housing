import { UpdateMap } from '@/app/updates/utils/groupUpdatesByDate';
import { mergeArrayObjects } from '@/lib/utils';

export function mergeAndSortUpdates(settlementUpdates: UpdateMap, architectUpdates: UpdateMap) {
   const allUpdates = mergeArrayObjects(
    settlementUpdates,
    architectUpdates
  );

  return Object.entries(allUpdates).sort(([d1], [d2]) => d2.localeCompare(d1));
}