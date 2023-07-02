import { default as NextLink } from 'next/link';

import styles from './Link.module.css';

export function Link({ children, href, arrow = false, back = false }: { children: string | JSX.Element, href: string, arrow?: boolean, back?: boolean }) {
  const isExternal = href.includes('http');
  const arrowIcon = <svg className='self-center' style={{ height: '0.66rem' }} viewBox="0 0 73.082 74.219" xmlns="http://www.w3.org/2000/svg"><g transform='rotate(180deg)' strokeWidth="0" fill="#000"><path d="M 73.082 37.109 L 35.973 74.219 L 26.811 65.128 L 48.153 43.786 L 0 43.786 L 0 30.433 L 48.153 30.433 L 26.811 9.126 L 35.973 0 L 73.082 37.109 Z" /></g></svg>;
  return (
    <NextLink target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener' : undefined} className={`font-bold flex self-start ${arrow && back && 'flex-row-reverse'}`} href={href}>
      <><span className={`${styles.link} ${arrow && back ? 'ml-1' : arrow ? 'mr-1' : ''} ${back ? styles.linkArrowBack : styles.linkArrow}`}>{children}</span>{arrow && arrowIcon}</>
    </NextLink>
  );  
}