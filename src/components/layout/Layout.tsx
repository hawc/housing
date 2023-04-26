import { ThemeProvider } from '@material-tailwind/react';
import * as React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // Put Header or Footer Here
  return (
    <>
      test
      <ThemeProvider>{children}</ThemeProvider>
    </>
  );
}
