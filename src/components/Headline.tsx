import { twMerge } from 'tailwind-merge';

interface HeadlineProps {
  children: React.ReactNode;
  type: string;
  tag?: string;
  className?: string
}

export function Headline({ children, type, tag = type, className = '' }: HeadlineProps) {
  const Tag = tag as 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const headlineStyles: { [key: string]: string } = {
    'h1': 'text-2xl md:text-5xl font-bold leading-none tracking-tighter pb-3',
    'h2': 'text-2xl md:text-3xl leading-tight tracking-tighter pb-2',
    'h3': 'text-lg md:text-xl font-bold mb-1',
    'h4': 'text-lg md:text-xl',
    'h5': 'text-base font-bold',
    'h6': 'text-base font-bold',
  };
  const headlineClass = type in headlineStyles ? headlineStyles[type] : '';
  return (
    <Tag className={twMerge(`${headlineClass} ${className}`)}>
      {children}
    </Tag>
  );
}