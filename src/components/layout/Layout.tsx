import { ThemeProvider } from '@material-tailwind/react';
import * as React from 'react';

import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <>
      <ThemeProvider>
        <Header />
        {children}
      </ThemeProvider>
    </>
  );
}
