
export function ListItem({ children, className, style }: { children: React.ReactElement[] | React.ReactElement | string, className?: string, style?: React.CSSProperties }) {
  return (
    <li className={`list-none ${className}`} style={style}>
      {children}
    </li>
  );
}

export function List({ children }: { children: React.ReactElement[] | React.ReactElement | string }) {
  return (
    <ul className='list-disc list-outside'>
      {children}
    </ul>
  ); 
}