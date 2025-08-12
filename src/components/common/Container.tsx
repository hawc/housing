import { clsxm } from '@/lib/clsxm';
import { HTMLAttributes, PropsWithChildren } from 'react';

export function Container({
  children,
  className = '',
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) {
  return (
    <div className={clsxm(`grid grid-cols-1 ${className}`)} {...rest}>
      {children}
    </div>
  );
}
