import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { PropsWithChildren } from 'react';

import '@/styles/globals.css';

const Bricolage = localFont({
  src: [
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-ExtraLight.ttf',
      weight: '100', // thin
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Regular.ttf',
      weight: '400', // normal
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-SemiBold.ttf',
      weight: '600', // semibold
      style: 'normal',
    },
    {
      path: '../../public/fonts/BricolageGrotesque/BricolageGrotesque-Bold.ttf',
      weight: '700', // bold
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-bricolage',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Großwohnsiedlungen',
    default: 'Archiv deutscher Großwohnsiedlungen',
  },
  description: 'Archiv deutscher Großwohnsiedlungen nach 1945.',
  keywords: ['Architektur', 'Großwohnsiedlungen', 'Plattenbau', 'Großsiedlung'],
  referrer: 'origin-when-cross-origin',
  robots: 'follow, index',
  authors: [{ name: 'Hendrik Wichern', url: 'https://hendrikwichern.de' }],
  creator: 'Hendrik Wichern',
  metadataBase: new URL(process.env.BASE_URL ?? ''),
  openGraph: {
    title: {
      template: '%s | Großwohnsiedlungen',
      default: 'Archiv deutscher Großwohnsiedlungen',
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

export default function RootLayout({ children }: PropsWithChildren) {
  const isProd = process.env.NODE_ENV === 'production';

  return (
    <html lang='en'>
      <body>
        <div className={`${Bricolage.variable} font-primary`}>{children}</div>
        {isProd && (
          <SpeedInsights />
        )}
      </body>
    </html>
  );
}
