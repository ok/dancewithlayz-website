import Provider from '@/app/provider'
import { Toaster } from "@/components/ui/sonner"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/wrapper/header'
import { CircuitBackground } from '@/components/wrapper/circuit-background'
import { RadioPlayer } from '@/components/wrapper/radio-player'
import { VolumeProvider } from '@/components/wrapper/volume-context'
import { GeistMono } from 'geist/font/mono'

export const metadata: Metadata = {
  metadataBase: new URL("https://dancewithlayz.com"),
  title: {
    default: 'Dance with Lay\'z',
    template: `%s | Dance with Lay&apos;z`
  },
  description: 'Dance with Lay\'z',
  openGraph: {
    description: 'Dance with Lay\'z',
    images: [{ url: '/banner-layz.webp', width: 1200, height: 628 }],
    url: 'https://dancewithlayz.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dance with Lay\'z',
    description: 'Producer and DJ making House, Dance, and EDM.',
    siteId: "",
    creator: "@dancewithlayz",
    creatorId: "",
    images: [{ url: '/banner-layz.webp', width: 1200, height: 628 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <link
          rel="preload"
          href="https://utfs.io/f/31dba2ff-6c3b-4927-99cd-b928eaa54d5f-5w20ij.png"
          as="image"
        />
        <link
          rel="preload"
          href="https://utfs.io/f/69a12ab1-4d57-4913-90f9-38c6aca6c373-1txg2.png"
          as="image"
        /> */}
      </head>
      <body className={GeistSans.className}>
        <Provider>
          <VolumeProvider>
            <div className="min-h-screen flex flex-col relative">
              {/* Pulsating circuit-board background */}
              <CircuitBackground />

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <footer className="border-t hairline bg-background/20 backdrop-blur-sm py-5">
                  <div className={`${GeistMono.className} container mx-auto px-4 flex flex-col sm:flex-row justify-between gap-2 text-xs uppercase tracking-[0.1em] text-white/75`}>
                    <span>&copy; {new Date().getFullYear()} Dance with Lay&apos;z</span>
                    <span>All rights reserved</span>
                  </div>
                </footer>
              </div>
            </div>
            <RadioPlayer />
            <Toaster />
          </VolumeProvider>
        </Provider>
      </body>
    </html>
  )
}
