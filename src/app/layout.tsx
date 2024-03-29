import { UserProvider } from '@auth0/nextjs-auth0/client';
import PiwikProProvider from '@piwikpro/next-piwik-pro';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

const Bricolage = localFont({
  src: [
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-ExtraLight.ttf',
      weight: '100',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Light.ttf',
      weight: '200',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Regular.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Medium.ttf',
      weight: '500',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-SemiBold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Bold.ttf',
      weight: '800',
      style: 'normal'
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-ExtraBold.ttf',
      weight: '900',
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
  return (
    <UserProvider>
      <html lang='en'>
        <head>
          <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
        </head>
        <body>
          <PiwikProProvider
            containerUrl={process.env.NEXT_PUBLIC_CONTAINER_URL}
            containerId={process.env.NEXT_PUBLIC_CONTAINER_ID}
          >
            <div className={`${Bricolage.variable} font-primary`}>
              {children}
            </div>
          </PiwikProProvider>
        </body>
      </html>
    </UserProvider>
  );
}