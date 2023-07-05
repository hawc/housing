export function Headline({ children, type, tag = type, className = '' }: { children: string | JSX.Element, type: string, tag?: string, className?: string }) {
  const Tag = tag as keyof JSX.IntrinsicElements;
  const headlineStyles: { [key: string]: string } = {
    'h1': 'font-bold text-xl md:text-3xl leading-tighter mb-2',
    'h2': 'text-xl md:text-3xl',
    'h3': 'font-bold text-l md:text-xl mb-1',
    'h4': 'text-l md:text-xl',
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