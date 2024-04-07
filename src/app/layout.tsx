import { UserProvider } from '@auth0/nextjs-auth0/client';
import PiwikProProvider from '@piwikpro/next-piwik-pro';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

const Bricolage = localFont({
  src: [
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-ExtraLight.ttf',
      weight: '100', // thin
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Regular.ttf',
      weight: '400', // normal
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-SemiBold.ttf',
      weight: '600', // semibold
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Bold.ttf',
      weight: '700', // bold
      style: 'normal'
    },
  ],
  display: 'swap',
  variable: '--font-bricolage'
});

export const metadata: Metadata = {
  title: {
    template: '%s | Großwohnsiedlungen',
    default: 'Großwohnsiedlungen'
  },
  description: 'Archiv deutscher Großwohnsiedlungen nach 1945.',
  keywords: ['Architektur', 'Großwohnsiedlungen', 'Plattenbau'],
  referrer: 'origin-when-cross-origin',
  robots: 'follow, index',
  authors: [{ name: 'Hendrik Wichern', url: 'https://hendrikwichern.de' }],
  creator: 'Hendrik Wichern',
  metadataBase: new URL(process.env.BASE_URL ?? ''),
  // openGraph: {
  //   images: '/og-image.png',
  // },
  openGraph: {
    title: {
      template: '%s | Großwohnsiedlungen',
      default: 'Großwohnsiedlungen'
    },
    description: 'Archiv deutscher Großwohnsiedlungen nach 1945.',
    url: new URL(process.env.BASE_URL ?? ''),
    siteName: 'Großwohnsiedlungen',
    // images: [
    //   {
    //     url: 'https://nextjs.org/og.png',
    //     width: 800,
    //     height: 600,
    //   },
    // ],
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProd = process.env.NODE_ENV === 'production';

  const content = (
    <div className={`${Bricolage.variable} font-primary`}>
      {children}
    </div>
  );

  return (
    <UserProvider>
      <html lang='en'>
        <body>
          {isProd ? (
            <PiwikProProvider
              containerUrl={process.env.NEXT_PUBLIC_CONTAINER_URL}
              containerId={process.env.NEXT_PUBLIC_CONTAINER_ID}
            >
              {content}
            </PiwikProProvider>
          ) : content}
        </body>
      </html>
    </UserProvider>
  );
}