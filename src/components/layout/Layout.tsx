import { ThemeProvider } from '@material-tailwind/react';
import * as React from 'react';

import Header from '@/components/layout/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto">
      <ThemeProvider>
        <Header />
        {children}
      </ThemeProvider>
    </div>
  );
}
