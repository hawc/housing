import { UserProvider } from '@auth0/nextjs-auth0/client';
import type { Metadata } from 'next';
import { Space_Mono } from 'next/font/google';

import '@/styles/globals.css';

const space_mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700']
})

export const metadata: Metadata = {
  title: {
    template: '%s | Großwohnsiedlungen',
    default: 'Großwohnsiedlungen'
  },
  description: 'Archiv deutscher Großwohnsiedlungen nach 1945.',
  keywords: ['Architektur', 'Großwohnsiedlungen', 'Plattenbau'],
  referrer: 'origin-when-cross-origin',
  robots: 'nofollow, noindex',
  authors: [{ name: 'Hendrik Wichern', url: 'https://hendrikwichern.de' }],
  creator: 'Hendrik Wichern',
  metadataBase: new URL('https://grosswohnsiedlungen.de'),
  // openGraph: {
  //   images: '/og-image.png',
  // },
  openGraph: {
    title: {
      template: '%s | Großwohnsiedlungen',
      default: 'Großwohnsiedlungen'
    },
    description: 'Archiv deutscher Großwohnsiedlungen nach 1945.',
    url: 'https://grosswohnsiedlungen.de',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link href='https://api.tiles.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css' rel='stylesheet' />
      </head>
      <body>
        <UserProvider>
          <div className={`${space_mono.variable} font-primary`}>
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  )
}