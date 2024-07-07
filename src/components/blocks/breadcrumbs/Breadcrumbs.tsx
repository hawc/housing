import type { Url } from 'next/dist/shared/lib/router/router';
import type { LinkProps } from 'next/link';
import { default as NextLink } from 'next/link';
import type { PropsWithChildren } from 'react';

import styles from './Breadcrumbs.module.css';

import { CurrentPage } from '@/components/blocks/breadcrumbs/CurrentPage';

type BreadcrumbsProps = PropsWithChildren;

type LinkWithChildren = Omit<LinkProps, 'href'> & PropsWithChildren;

interface BreadcrumbProps extends LinkWithChildren {
  href?: Url;
}

export function Breadcrumbs({ children }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb"><ol className='my-4 flex text-xs gap-2'>{children}</ol></nav>
  );
}

export function Breadcrumb({ children, href, ...rest }: BreadcrumbProps) {
  if (href) {
    return <li><NextLink className={styles['has-arrow']} href={href} {...rest}><span className='underline underline-offset-4'>{children}</span></NextLink></li>;
  }

  return <CurrentPage>{children}</CurrentPage>;
}