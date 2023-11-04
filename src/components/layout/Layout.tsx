import * as React from 'react';

import { Footer } from '@/components/blocks/Footer';
import { Header } from '@/components/blocks/Header';

type LayoutProps = React.PropsWithChildren & {
  breadcrumbs?: React.ReactNode;
}

export default function Layout({ children, breadcrumbs }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="container xl:max-w-full mx-auto px-1 md:px-3 items-center justify-between flex">
        <div className='px-2'>
          {breadcrumbs}
        </div>
      </div>
      <div className="container mx-auto px-3 md:px-5">
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
