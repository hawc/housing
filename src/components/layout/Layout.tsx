import * as React from 'react';

import { Footer } from '@/components/blocks/Footer';
import { Header } from '@/components/blocks/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-3 md:px-5">
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
