import type { Location } from '@/lib/types';

import { Link } from '@/components/common/Link';
import { List, ListItem } from '@/components/common/List';
import { Headline } from '@/components/Headline';
import { Sorting } from '@/components/settlements/List';
import { groupBy } from '@/utils/groupBy';
import { isSettlementFound } from '@/utils/isSettlementFound';
import { slugify } from '@/utils/slugify';
import { sortAlphabetically } from '@/utils/sortAlphabetically';
import { useMemo } from 'react';

export interface SearchableItem {
  name: string;
  slug: string;
  location?: Location | null;
}

export type SearchableItemsList = SearchableItem[];
interface SearchListProps {
  items: SearchableItemsList;
  path: string;
  sorting?: Sorting;
  className?: string;
  searchTerm?: string;
  loading?: boolean;
}

export function SearchList({
  items,
  path,
  className = '',
  searchTerm = '',
  loading = false,
}: SearchListProps) {
  const sortedList = useMemo(() => {
    const searchTermSlug = slugify(searchTerm);

    return sortAlphabetically(
      items.filter((item) => {
        return slugify(item.name).includes(searchTermSlug);
      })
    );
  }, [items, searchTerm]);

  if (sortedList.length === 0) {
    return <span className='leading-relaxed'>Keine Suchergebnisse</span>;
  }

  return (
    <div className={className}>
      <List className='md:columns-2'>
        {sortedList.map((item) =>
          loading ? (
            <ListItem plain key={item.slug}>
              <Link href='#' className='pointer-events-none'>
                {item.name}
              </Link>
            </ListItem>
          ) : (
            <ListItem plain key={item.slug}>
              <Link className='inline-block mr-2' href={`${path}${item.slug}`}>
                {item.name}
              </Link>
            </ListItem>
          )
        )}
      </List>
    </div>
  );
}

interface SettlementsListProps {
  items: SearchableItemsList;
  searchTerm: string;
  loading: boolean;
  path: string;
}

function SettlementsList({
  items,
  searchTerm,
  loading,
  path,
}: SettlementsListProps) {
  const sortedList = useMemo(() => {
    return sortAlphabetically(
      items.filter((item) =>
        isSettlementFound(item.name, item.location?.city, searchTerm)
      )
    );
  }, [items, searchTerm]);

  if (sortedList.length === 0) {
    return <span className='leading-relaxed'>Keine Suchergebnisse</span>;
  }

  return (
    <List className='md:columns-2'>
      {sortedList.map((item) =>
        loading ? (
          <ListItem plain key={item.slug}>
            <Link href='#' className='pointer-events-none'>
              {item.name}
            </Link>
          </ListItem>
        ) : (
          <ListItem plain key={item.slug}>
            <Link className='inline-block mr-2' href={`${path}${item.slug}`}>
              {item.name}
            </Link>
            {'location' in item && item.location && (
              <>
                <span className='sr-only'>, </span>
                <span className='font-thin tracking-wide'>
                  {item.location.city}
                </span>
              </>
            )}
          </ListItem>
        )
      )}
    </List>
  );
}

interface GroupedSettlementsListProps {
  items: SearchableItemsList;
  searchTerm: string;
  loading: boolean;
  path: string;
  sorting: Sorting;
}

function GroupedSettlementsList({
  items,
  searchTerm,
  loading,
  path,
  sorting,
}: GroupedSettlementsListProps) {
  const searchResults = useMemo(() => {
    return items.filter((item) =>
      isSettlementFound(item.name, item.location?.city ?? '', searchTerm)
    );
  }, [items, searchTerm]);

  if (searchResults.length === 0) {
    return <span className='leading-relaxed'>Keine Suchergebnisse</span>;
  }

  const isStateSorting = sorting === 'state';

  const sortedList = groupBy(searchResults, isStateSorting ? 'state' : 'city');

  return (
    <div className='flex flex-col gap-4'>
      {Object.keys(sortedList)
        .sort()
        .map((key) => (
          <div key={key}>
            <Headline type='h3' tag='h2'>
              {key}
            </Headline>
            <List>
              {sortAlphabetically(sortedList[key]).map((item) =>
                loading ? (
                  <ListItem plain key={item.slug}>
                    <Link href='#' className='pointer-events-none'>
                      {item.name}
                    </Link>
                  </ListItem>
                ) : (
                  <ListItem plain key={item.slug}>
                    <Link
                      className={`inline-block mr-2 ${
                        !isStateSorting && 'font-normal'
                      }`}
                      href={`${path}${item.slug}`}
                    >
                      {item.name}
                    </Link>
                    {isStateSorting &&
                      'location' in item &&
                      item.location &&
                      item.location.state !== item.location.city && (
                        <>
                          <span className='sr-only'>, </span>
                          <span className='font-thin tracking-wide'>
                            {item.location.city}
                          </span>
                        </>
                      )}
                  </ListItem>
                )
              )}
            </List>
          </div>
        ))}
    </div>
  );
}

export function SettlementsSearchList({
  items,
  sorting = 'alphabetic',
  path,
  className = '',
  searchTerm = '',
  loading = false,
}: SearchListProps) {
  return (
    <div className={className}>
      {!sorting ||
        (sorting === 'alphabetic' && (
          <SettlementsList
            items={items}
            searchTerm={searchTerm}
            loading={loading}
            path={path}
          />
        ))}
      {sorting && ['city', 'state'].includes(sorting) && (
        <GroupedSettlementsList
          items={items}
          searchTerm={searchTerm}
          loading={loading}
          path={path}
          sorting={sorting}
        />
      )}
    </div>
  );
}
