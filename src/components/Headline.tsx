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
    'h1': 'font-light text-2xl md:text-5xl leading-normal tracking-tight',
    'h2': 'text-xl md:text-3xl',
    'h3': 'font-bold text-l md:text-xl mb-1',
    'h4': 'text-l md:text-xl',
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