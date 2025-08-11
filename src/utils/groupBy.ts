import { SearchableItem, SearchableItemsList } from '@/components/blocks/SearchList';

export function groupBy(arr: SearchableItemsList, groupKey: 'city' | 'state'): { [key: string]: SearchableItem[]; } {
  return arr.reduce(function (acc, item) {
    if (!acc[item.location?.[groupKey] ?? '(ohne)']) {
      acc[item.location?.[groupKey] ?? '(ohne)'] = [];
    }
    acc[item.location?.[groupKey] ?? '(ohne)'].push(item);

    return acc;
  }, {});
}
