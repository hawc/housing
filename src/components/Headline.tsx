export function Headline({ children, type, tag = type, className = '' }: { children: string | JSX.Element, type: string, tag?: string, className?: string }) {
  const Tag = tag as keyof JSX.IntrinsicElements;
  const headlineStyles: { [key: string]: string } = {
    'h1': 'text-3xl leading-tighter',
    'h2': 'text-4xl',
    'h3': 'text-3xl',
    'h4': 'font-bold text-2xl',
    'h5': 'text-2xl',
    'h6': 'text-base font-bold',
  };
  const headlineClass = type in headlineStyles ? headlineStyles[type] : '';
  return (
    <Tag className={`${headlineClass} ${className}`}>
      {children}
    </Tag>
  );
}