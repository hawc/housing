import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Space_Mono } from 'next/font/google';

import '@/styles/globals.css';

const space_mono = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-mono',
  weight: ['400', '700']
})

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
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