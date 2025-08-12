import { Footer } from '@/components/common/Footer';
import { Header } from '@/components/common/Header';
import { PropsWithChildren, ReactNode } from 'react';

interface LayoutProps {
  breadcrumbs?: ReactNode;
  isHome?: boolean;
}

export function Layout({
  children,
  breadcrumbs,
  isHome = false,
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Header />
      <div className='container xl:max-w-full mx-auto px-1 md:px-3 items-center justify-between flex'>
        <div className='px-2'>{breadcrumbs}</div>
      </div>
      <div className={isHome ? 'main-wrapper' : ''}>
        <div className='container mx-auto px-3 md:px-5'>
          <main>{children}</main>
          <div id='credits'></div>
          <Footer />
        </div>
      </div>
    </>
  );
}
