interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement[] | React.ReactElement | string;
  ghost?: boolean;
  highlighted?: boolean;
}

export function Box({ children, ghost = false, highlighted = false, ...rest }: BoxProps): React.ReactElement {
  return (
    <div {...rest} className={`${ghost ? 'flex flex-col text-white' : `flex flex-col overflow-hidden px-6 py-5 ${highlighted ? 'bg-highlight' : 'bg-content'}`} ${rest.className}`}>
      {children}
    </div>
  );
}

export function Container({ children, cols = 'grid-cols-1' }: { children: React.ReactElement[] | React.ReactElement, cols?: string }): React.ReactElement {
  return (
    <div className={`grid gap-5 ${cols}`}>
      {children}
    </div>
  );
}