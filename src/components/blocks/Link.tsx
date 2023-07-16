import { default as NextLink } from 'next/link';
import { twMerge } from 'tailwind-merge';

import styles from './Link.module.css';

interface LinkProps extends React.HTMLAttributes<HTMLElement> {
  href: string;
  arrow?: boolean;
  back?: boolean;
}

export function Link({ children, href, arrow = false, back = false, ...rest }: LinkProps) {
  const isExternal = href.includes('http');
  return (
    <NextLink
      {...rest}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener' : undefined}
      className={twMerge(`font-bold flex place-content-start ${(arrow && back) ? 'flex-row-reverse' : ''} ${rest.className}`)}
      href={href}>
      <><span className={`${styles.link} ${back ? styles.linkArrowBack : isExternal ? `${styles.linkArrow} ${styles.externalLink}` : styles.linkArrow}`}>{children}</span>{(arrow || back) && (<span></span>)}</>
    </NextLink>
  );
}