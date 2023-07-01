
export function Box({ children, dashed = false, highlighted = false }: { children: React.ReactElement[] | React.ReactElement | string, dashed?: boolean, highlighted?: boolean }): React.ReactElement {
  return (
    <div className={`flex flex-col overflow-hidden px-6 py-5 ${highlighted ? 'bg-highlight' : 'bg-content'}`}>
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