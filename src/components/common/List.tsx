import { clsxm } from '@/lib/clsxm';
import { PropsWithChildren } from 'react';

interface ListItemProps {
  plain?: boolean;
}

interface ListProps {
  className?: string;
  numbered?: boolean;
}

export function ListItem({
  children,
  plain,
}: PropsWithChildren<ListItemProps>) {
  return (
    <li
      className={clsxm(
        `leading-relaxed ${
          plain ? 'list-none' : 'ml-5 pl-1 marker:text-highlight'
        }`
      )}
    >
      {children}
    </li>
  );
}

export function List({
  children,
  numbered = false,
  className = '',
}: PropsWithChildren<ListProps>) {
  if (numbered) {
    return (
      <ol className={clsxm(`list-decimal list-outside ml-5 ${className}`)}>
        {children}
      </ol>
    );
  }

  return (
    <ul className={clsxm(`list-disc list-outside ${className}`)}>{children}</ul>
  );
}
