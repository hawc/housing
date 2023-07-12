import { twMerge } from 'tailwind-merge';

interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  plain?: boolean;
}

interface ListProps extends React.HTMLAttributes<HTMLElement> {
  numbered?: boolean;
}

export function ListItem({ children, plain, className = '', ...rest }: ListItemProps) {
  return (
    <li className={twMerge(`leading-relaxed ${plain ? 'list-none' : 'ml-5 pl-1 marker:text-highlight'} ${className}`)} {...rest}>
      {children}
    </li>
  );
}

export function List({ children, numbered = false, className = '', ...rest }: ListProps) {
  if (numbered) {
    return (
      <ol className={twMerge(`list-decimal list-outside ml-5 ${className}`)} {...rest}>
        {children}
      </ol>
    );
  }
  return (
    <ul className={twMerge(`list-disc list-outside ${className}`)} {...rest}>
      {children}
    </ul>
  );
}