export function Headline({ children, type, tag = type, className = '' }: { children: string | JSX.Element, type: string, tag?: string, className?: string }) {
  const Tag = tag as keyof JSX.IntrinsicElements;
  const headlineStyles: { [key: string]: string } = {
    'h1': 'font-bold text-2xl md:text-3xl leading-tighter',
    'h2': 'text-2xl',
    'h3': 'font-bold text-xl',
    'h4': 'text-xl',
    'h5': 'text-base font-bold',
    'h6': 'text-base font-bold',
  };
  const headlineClass = type in headlineStyles ? headlineStyles[type] : '';
  return (
    <Tag className={`${headlineClass} ${className}`}>
      {children}
    </Tag>
  );
}