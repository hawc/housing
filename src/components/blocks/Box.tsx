import { twMerge } from 'tailwind-merge';

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ghost?: boolean;
  highlighted?: boolean;
}

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Box({ children, ghost = false, highlighted = false, ...rest }: BoxProps) {
  return (
    <div
      {...rest}
      className={twMerge(`box flex flex-col ${ghost ? '' : `overflow-hidden px-3 py-2 md:px-5 md:py-4 border border-text border-solid ${highlighted ? 'bg-highlight' : ''}`} ${rest.className}`)}>
      {children}
    </div>
  );
}

export function Container({ children, className = '', ...rest }: ContainerProps) {
  return (
    <div className={twMerge(`grid grid-cols-1 ${className}`)} {...rest}>
      {children}
    </div>
  );
}