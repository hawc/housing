import { twMerge } from 'tailwind-merge';

interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement[] | React.ReactElement | string;
  ghost?: boolean;
  highlighted?: boolean;
}

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement[] | React.ReactElement | string;
  cols?: string;
}

export function Box({ children, ghost = false, highlighted = false, ...rest }: BoxProps): React.ReactElement {
  return (
    <div {...rest} className={twMerge(`${ghost ? 'flex flex-col text-white' : `flex flex-col overflow-hidden px-5 py-4 ${highlighted ? 'bg-highlight' : 'bg-content'}`} ${rest.className}`)}>
      {children}
    </div>
  );
}

export function Container({ children, cols = 'grid-cols-1', ...rest }: ContainerProps): React.ReactElement {
  return (
    <div className={twMerge(`grid gap-5 ${cols} ${rest.className}`)}>
      {children}
    </div>
  );
}