import { twMerge } from 'tailwind-merge';

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  ghost?: boolean;
  highlighted?: boolean;
}

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  cols?: string;
}

export function Box({ children, ghost = false, highlighted = false, ...rest }: BoxProps): React.ReactElement {
  return (
    <div {...rest} className={twMerge(`box ${ghost ? 'flex flex-col' : `flex flex-col overflow-hidden px-3 py-2 md:px-5 md:py-4 border border-text border-solid ${highlighted ? 'bg-highlight' : ''}`} ${rest.className}`)}>
      {children}
    </div>
  );
}

export function Container({ children, cols = 'grid-cols-1', ...rest }: ContainerProps): React.ReactElement {
  return (
    <div className={twMerge(`grid ${cols} ${rest.className}`)}>
      {children}
    </div>
  );
}