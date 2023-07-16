import { UserProvider } from '@auth0/nextjs-auth0/client';
import { AppProps } from 'next/app';
import { Space_Mono } from 'next/font/google'

import '@/styles/globals.css';
const space_mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700']
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className={`${space_mono.variable} font-primary`}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </div>
  );
}

export default MyApp;
