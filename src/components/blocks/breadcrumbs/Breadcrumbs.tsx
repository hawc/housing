import { Url } from 'next/dist/shared/lib/router/router';
import { default as NextLink, LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

type BreadcrumbsProps = PropsWithChildren;

type LinkWithChildren = Omit<LinkProps, 'href'> & PropsWithChildren;

interface BreadcrumbProps extends LinkWithChildren {
  href?: Url;
}

export function Breadcrumbs({ children }: BreadcrumbsProps) {
  return (
    <div className='my-4 flex text-xs gap-2'>{children}</div>
  );
}

export function Breadcrumb({ children, href, ...rest }: BreadcrumbProps) {
  if (href) {
    return <><NextLink className='underline underline-offset-4' href={href} {...rest}>{children}</NextLink> ➔</>;
  }

  return <span>{children}</span>;
}