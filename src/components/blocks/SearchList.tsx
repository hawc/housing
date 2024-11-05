import { twMerge } from 'tailwind-merge';

import type { Location } from '@/lib/types';
import { slugify, sortAlphabetically } from '@/lib/utils';

import { InputGhost } from '@/components/blocks/form/Input';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';
import { Headline } from '@/components/Headline';
import { Sorting } from '@/components/settlements/List';

type Item = { name: string; slug: string, location?: Location | null };

type ItemsList = Item[];
interface SearchListProps extends React.HTMLAttributes<HTMLElement> {
  items: ItemsList;
  sorting: Sorting;
  path: string;
  className?: string;
  searchTerm?: string;
  loading?: boolean;
}
interface SearchInputProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  searchTerm?: string;
  placeholder?: string;
  loading?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function SearchInput({ className = '', searchTerm = '', placeholder = 'Suchbegriff eingeben', loading = false, onChange = () => { return; }, ...rest }: SearchInputProps): React.ReactElement {
  return (
    <InputGhost
      placeholder={placeholder}
      value={searchTerm}
      onChange={onChange}
      style={{ outlineOffset: '-2px' }}
      className={twMerge(`w-auto -mx-3 -mt-2 md:-mx-5 md:-mt-4 mb-4 px-5 py-4 font-normal border-0 border-b border-text border-solid ${loading ? 'pointer-events-none' : ''} ${className}`)}
      {...rest} />
  );
}

export function SearchList({ items, path, className = '', searchTerm = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  const sortedList = sortAlphabetically(items.filter(item => slugify(item.name).includes(slugify(searchTerm))));

  if (sortedList.length === 0) {
    return (
      <span className='leading-relaxed'>Keine Suchergebnisse</span>
    );
  }

  return (
    <div className={className} {...rest}>
      <List className='md:columns-2'>
        {sortedList.map(item => (
          loading ? (
            <ListItem plain key={item.slug}>
              <Link href='#' className='pointer-events-none'>{item.name}</Link>
            </ListItem>
          ) : (
            <ListItem plain key={item.slug}>
              <Link className='inline-block mr-2' href={`${path}${item.slug}`}>
                {item.name}
              </Link>
            </ListItem>
          )
        ))}
      </List>
    </div>
  );
}

export function isSettlementFound(name: string, city = '', searchTerm: string) {
  return slugify(name).includes(slugify(searchTerm)) || slugify(city).includes(slugify(searchTerm));
}

function groupByCity(arr: ItemsList): { [key: string]: Item[] } {
  return arr.reduce(function (memo, x) {
    if (!memo[x.location?.city ?? '(ohne)']) {
      memo[x.location?.city ?? '(ohne)'] = [];
    }
    memo[x.location?.city ?? '(ohne)'].push(x);
    return memo;
  }, {});
}

function SettlementsList({ items, searchTerm, loading, path }: { items: ItemsList; searchTerm: string; loading: boolean; path: string }) {
  const sortedList = sortAlphabetically(items.filter(item => isSettlementFound(item.name, item.location?.city, searchTerm)));

  if (sortedList.length === 0) {
    return (
      <span className='leading-relaxed'>Keine Suchergebnisse</span>
    );
  }

  return (
    <List className='md:columns-2'>
      {sortedList.map(item => (
        loading ? (
          <ListItem plain key={item.slug}>
            <Link href='#' className='pointer-events-none'>{item.name}</Link>
          </ListItem>
        ) : (
          <ListItem plain key={item.slug}>
            <Link className='inline-block mr-2' href={`${path}${item.slug}`}>
              {item.name}
            </Link>{'location' in item && item.location && (
              <><span className='sr-only'>, </span><span className='font-thin tracking-wide'>{item.location.city}</span></>
            )}
          </ListItem>
        )
      ))}
    </List>
  );
}

function SettlementsListByCity({ items, searchTerm, loading, path }: { items: ItemsList; searchTerm: string; loading: boolean; path: string }) {
  const searchResults = items.filter(item => isSettlementFound(item.name, item.location?.city ?? '', searchTerm));

  if (searchResults.length === 0) {
    return (
      <span className='leading-relaxed'>Keine Suchergebnisse</span>
    );
  }

  const sortedList = groupByCity(searchResults);

  return (
    <div className='flex flex-col gap-4'>
      {Object.keys(sortedList).sort().map((key) => (
        <div key={key}>
          <Headline type='h3' tag='h2'>{key}</Headline>
          <List>
            {sortAlphabetically(sortedList[key]).map(item => (
              loading ? (
                <ListItem plain key={item.slug}>
                  <Link href='#' className='pointer-events-none'>{item.name}</Link>
                </ListItem>
              ) : (
                <ListItem plain key={item.slug}>
                  <Link className='inline-block mr-2 font-normal' href={`${path}${item.slug}`}>
                    {item.name}
                  </Link>
                </ListItem>
              )
            ))}
          </List>
        </div>
      ))}
    </div>
  );
}

export function SettlementsSearchList({ items, sorting, path, className = '', searchTerm = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  // if (sorting === 'state') {
  //   const searchResults = items.filter(item => isSettlementFound(item.name, item.location?.city ?? '', searchTerm));

  //   sortedList = sortByState(searchResults);
  // }

  return (
    <div className={className} {...rest}>
      {sorting === 'alphabetic' && (
        <SettlementsList items={items} searchTerm={searchTerm} loading={loading} path={path} />
      )}
      {sorting === 'city' && (
        <SettlementsListByCity items={items} searchTerm={searchTerm} loading={loading} path={path} />
      )}
    </div>
  );
}