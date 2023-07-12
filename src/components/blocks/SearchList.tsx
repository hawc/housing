import { useState } from 'react';
import slugify from 'slugify';

import { sortAlphabetically } from '@/components/admin/tags/List';
import { InputGhost } from '@/components/blocks/form/Input';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';

import { Location } from '@/pages/admin';

interface SearchListProps extends React.HTMLAttributes<HTMLElement> {
  items: { name: string; slug: string, location?: Location }[];
  path: string;
  className?: string;
  loading?: boolean;
}

function removeSpaces(string: string) {
  return slugify(string.toLocaleLowerCase().replace(/\s/g, ''));
}

export function SearchList({ items, path, className = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  const [filter, setFilter] = useState<string>('');
  return (
    <div className={className} {...rest}>
      <InputGhost placeholder='Suchbegriff eingeben' value='' onChange={event => setFilter(event.target.value)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' />
      <List className='md:columns-2'>
        {sortAlphabetically(items.filter(item => removeSpaces(item.name).includes(removeSpaces(filter)))).map(item => (
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

export function SettlementsSearchList({ items, path, className = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  const [filter, setFilter] = useState<string>('');
  return (
    <div className={className} {...rest}>
      <InputGhost placeholder='Nach Siedlung oder Stadt suchen' value='' onChange={event => setFilter(event.target.value)} className='mt-1 border-highlight border-solid border-2 mb-2 p-1' />
      <List className='md:columns-2'>
        {sortAlphabetically(items.filter(item => removeSpaces(item.name).includes(removeSpaces(filter)) || removeSpaces(item.location?.city ?? '').includes(removeSpaces(filter)))).map(item => (
          loading ? (
            <ListItem plain key={item.slug}>
              <Link href='#' className='pointer-events-none'>{item.name}</Link>
            </ListItem>
          ) : (
            <ListItem plain key={item.slug}>
              <Link className='inline-block mr-2' href={`${path}${item.slug}`}>
                {item.name}
              </Link>
              {'location' in item && (
                <span className='font-light tracking-wide'>{item.location?.city}</span>
              )}
            </ListItem>
          )
        ))}
      </List>
    </div>
  );
}