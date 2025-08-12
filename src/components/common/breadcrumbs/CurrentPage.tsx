'use client';
import { default as NextLink } from 'next/link';
import { usePathname } from 'next/navigation';

export function CurrentPage({ children }) {
  const pathname = usePathname();

  return <li aria-current="page"><NextLink href={pathname}><span className='underline underline-offset-4'>{children}</span></NextLink></li>;
}