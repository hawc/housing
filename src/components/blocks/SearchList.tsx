import slugify from 'slugify';
import { twMerge } from 'tailwind-merge';

import { sortAlphabetically } from '@/components/admin/tags/List';
import { InputGhost } from '@/components/blocks/form/Input';
import { Link } from '@/components/blocks/Link';
import { List, ListItem } from '@/components/blocks/List';

import { Location } from '@/pages/admin';

interface SearchListProps extends React.HTMLAttributes<HTMLElement> {
  items: { name: string; slug: string, location?: Location }[];
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
  onChange?: (event: any) => void;
}

export function removeSpaces(string: string) {
  return slugify(string.toLocaleLowerCase().replace(/\s/g, ''));
}

function getListOrNull(list: any[]) {
  return list.length > 0 ? list : null;
}


export function SearchInput({ className = '', searchTerm = '', placeholder = 'Suchbegriff eingeben.', loading = false, onChange = () => { return }, ...rest }: SearchInputProps): React.ReactElement {
  return (
    <InputGhost
      placeholder={placeholder}
      value={searchTerm}
      onChange={onChange}
      style={{ outlineOffset: '-2px' }}
      className={twMerge(`w-auto -mx-3 -mt-2 md:-mx-5 md:-mt-4 mb-4 px-5 py-4 font-normal border-0 border-b border-text border-solid ${loading ? 'pointer-events-none' : ''} ${className}`)}
      {...rest} />
  )
}

export function SearchList({ items, path, className = '', searchTerm = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  return (
    <div className={className} {...rest}>
      <List className='md:columns-2'>
        {getListOrNull(sortAlphabetically(items.filter(item => removeSpaces(item.name).includes(removeSpaces(searchTerm)))).map(item => (
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
        ))) ?? <span className='leading-relaxed'>Keine Suchergebnisse</span>}
      </List>
    </div>
  );
}

export function isSettlementFound(name: string, city: string, searchTerm: string) {
  return removeSpaces(name).includes(removeSpaces(searchTerm)) || removeSpaces(city).includes(removeSpaces(searchTerm));
}

export function SettlementsSearchList({ items, path, className = '', searchTerm = '', loading = false, ...rest }: SearchListProps): React.ReactElement {
  return (
    <div className={className} {...rest}>
      <List className='md:columns-2'>
        {getListOrNull(sortAlphabetically(items.filter(item => isSettlementFound(item.name, item.location?.city ?? '', searchTerm))).map(item => (
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
        ))) ?? <span className='leading-relaxed'>Keine Suchergebnisse</span>}
      </List>
    </div>
  );
}