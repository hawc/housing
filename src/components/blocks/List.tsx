import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface ListItemProps {
  plain?: boolean;
}

interface ListProps {
  className?: string;
  numbered?: boolean;
}

export function ListItem({ children, plain }: PropsWithChildren<ListItemProps>) {
  return (
    <li className={twMerge(`leading-relaxed ${plain ? 'list-none' : 'ml-5 pl-1 marker:text-highlight'}`)}>
      {children}
    </li>
  );
}

export function List({ children, numbered = false, className = '' }: PropsWithChildren<ListProps>) {
  if (numbered) {
    return (
      <ol className={twMerge(`list-decimal list-outside ml-5 ${className}`)}>
        {children}
      </ol>
    );
  }

  return (
    <ul className={twMerge(`list-disc list-outside ${className}`)}>
      {children}
    </ul>
  );
}