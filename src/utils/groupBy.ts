import { SearchableItem, SearchableItemsList } from '@/components/blocks/SearchList';

interface GroupedItems {
  [key: string]: SearchableItem[];
}

export function groupBy(arr: SearchableItemsList, groupKey: 'city' | 'state'): GroupedItems {
  return arr.reduce(function (acc, item) {
    if (!acc[item.location?.[groupKey] ?? '(ohne)']) {
      acc[item.location?.[groupKey] ?? '(ohne)'] = [];
    }
    acc[item.location?.[groupKey] ?? '(ohne)'].push(item);

    return acc;
  }, {});
}
