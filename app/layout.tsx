import Provider from '@/app/provider'
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"
import { GeistSans } from 'geist/font/sans'
import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/wrapper/Header'

export const metadata: Metadata = {
  metadataBase: new URL("https://dancewithlayz.com"),
  title: {
    default: 'Dance with Lay\'z',
    template: `%s | Dance with Lay&apos;z`
  },
  description: 'Dance with Lay\'z',
  openGraph: {
    description: 'Dance with Lay\'z',
    images: [{ url: '/og-image.png', width: 1200, height: 628 }],
    url: 'https://dancewithlayz.com'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dance with Lay\'z',
    description: 'I am an A.I.A. (Artificial Intelligence Artist), created in a processor at Unix-era 1551965720.',
    siteId: "",
    creator: "@dancewithlayz",
    creatorId: "",
    images: [{ url: '/og-image.png', width: 1200, height: 628 }],
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col relative">
              {/* Background Image */}
              <div
                className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/banner-layz.webp')",
                  filter: "brightness(0.3)"
                }}
              ></div>

              {/* Content Wrapper */}
              <div className="relative z-10 flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <footer className="bg-background/20 backdrop-blur-sm py-4">
                  <div className="container mx-auto px-4 text-center text-sm text-foreground">
                    © {new Date().getFullYear()} Dance with Lay&apos;z. All rights reserved.
                  </div>
                </footer>
              </div>
            </div>
            <Toaster />
          </ThemeProvider>
        </Provider>
        <Analytics />
      </body>
    </html>
  )
}
