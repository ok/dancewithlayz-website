import Provider from '@/app/provider'
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from 'next'
import './globals.css'
import './layz.css'
import { syne, jetbrainsMono } from '@/lib/fonts'
import { MediaProvider } from '@/components/site/media-provider'
import { Effects } from '@/components/site/effects'
import { Cinema } from '@/components/site/cinema'
import { PlayerBar } from '@/components/site/player-bar'
import { SiteFooter, SiteHeader } from '@/components/site/sections'

export const metadata: Metadata = {
  metadataBase: new URL("https://dancewithlayz.com"),
  title: {
    default: 'Dance with Lay\'z',
    template: `%s | Dance with Lay&apos;z`
  },
  description: 'Producer and DJ making House, Dance, and EDM.',
  // Link previews (WhatsApp, iMessage, Facebook, X, ...). JPG rather than WebP: several apps
  // won't render WebP previews. A new file name also makes the platforms fetch it fresh.
  openGraph: {
    type: 'website',
    siteName: 'Dance with Lay\'z',
    title: 'Dance with Lay\'z',
    description: 'Producer and DJ making House, Dance, and EDM.',
    images: [{ url: '/og-layz.jpg', width: 1200, height: 630, alt: 'LAY\'Z — House, Dance, EDM. Lay\'z lit by red, green and blue festival lights' }],
    url: 'https://dancewithlayz.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dance with Lay\'z',
    description: 'Producer and DJ making House, Dance, and EDM.',
    siteId: "",
    creator: "@dancewithlayz",
    creatorId: "",
    images: [{ url: '/og-layz.jpg', width: 1200, height: 630, alt: 'LAY\'Z — House, Dance, EDM. Lay\'z lit by red, green and blue festival lights' }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Provider>
          <MediaProvider>
            <Effects />
            {/* Fixed video backdrop for cinema mode — sits behind the page content. */}
            <Cinema />
            <SiteHeader />
            <main className="site-main">
              {children}
            </main>
            <SiteFooter />
            <PlayerBar />
            <Toaster />
          </MediaProvider>
        </Provider>
      </body>
    </html>
  )
}
