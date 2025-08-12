import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

type TagType = 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headlineStyles = {
  h1: 'text-2xl md:text-5xl font-bold leading-none tracking-tighter pb-3',
  h2: 'text-2xl md:text-3xl leading-tight tracking-tighter pb-2',
  h3: 'text-lg md:text-xl font-bold mb-1',
  h4: 'text-lg md:text-xl',
  h5: 'text-base font-bold',
  h6: 'text-base font-bold',
} as const;

interface HeadlineProps {
  type: TagType;
  tag?: TagType;
  className?: string;
}

export function Headline({
  children,
  type,
  className,
  tag = type as TagType,
}: PropsWithChildren<HeadlineProps>) {
  const Tag = tag;
  const headlineClass = type in headlineStyles ? headlineStyles[type] : '';

  return (
    <Tag className={twMerge(`${headlineClass} ${className}`)}>{children}</Tag>
  );
}
