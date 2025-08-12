import { default as NextLink } from 'next/link';
import { twMerge } from 'tailwind-merge';

import styles from './Link.module.css';

interface LinkProps extends React.HTMLAttributes<HTMLElement> {
  href: string;
  arrow?: boolean;
  back?: boolean;
  highlight?: boolean;
}

export function Link({ href, children, arrow = false, back = false, highlight = false, ...rest }: LinkProps) {
  const isExternal = href.includes('http');

  let content = children;
  if (!children) {
    const matches = href.matchAll(/^(?:https?:\/\/)?(?:www\.)?([^:/\n?]+)/img);

    for (const match of matches) {
      if (match[1]) {
        content = match[1];
      }
    }
  }

  return (
    <NextLink
      {...rest}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener' : undefined}
      className={twMerge(`font-bold tracking-wide inline-flex place-content-start ${(arrow && back) ? 'flex-row-reverse' : ''} ${rest.className}`)}
      href={href}>
      <><span className={`${styles.link} ${highlight ? styles.highlight : ''} ${back ? styles.linkArrowBack : isExternal ? `${styles.linkArrow} ${styles.externalLink}` : styles.linkArrow}`}>{content}</span>{(arrow || back) && (<span></span>)}</>
    </NextLink>
  );
}