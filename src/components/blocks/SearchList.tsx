import { useState } from 'react';
import slugify from 'slugify';

import { sortAlphabetically } from '@/components/admin/tags/List';
import { InputGhost } from '@/components/blocks/form/Input';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';

interface SearchListProps extends React.HTMLAttributes<HTMLElement> {
  items: { name: string; slug: string }[];
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
      <List className='columns-3'>
        {sortAlphabetically(items.filter(item => removeSpaces(item.name).includes(removeSpaces(filter)))).map(item => (
          loading ? (
            <ListItem plain key={item.slug}>
              <Link href='#' className='pointer-events-none'>{item.name}</Link>
            </ListItem>
          ) : (
            <ListItem plain key={item.slug}>
              <Link href={`${path}${item.slug}`}>
                {item.name}
              </Link>
            </ListItem>
          )
        ))}
      </List>
    </div>
  );
}