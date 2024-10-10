"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Music, Youtube, Instagram, Twitter, Menu, Play } from "lucide-react"

export default function ArtistPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState("Home")

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id.charAt(0).toUpperCase() + entry.target.id.slice(1))
        }
      })
    }, { threshold: 0.5 })

    const sections = document.querySelectorAll("section[id]")
    sections.forEach((section) => observer.observe(section))

    return () => sections.forEach((section) => observer.unobserve(section))
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Music className="h-5 w-5" />
                <span className="sr-only">Music Streaming</span>
              </Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-lg font-semibold">Artist Name</h1>
          <nav className="hidden md:flex space-x-4">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/impressum" className="text-sm font-medium hover:text-primary">
              Impressum
            </Link>
          </nav>
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <Link href="/" onClick={() => setIsOpen(false)} className="block text-lg">
                    Home
                  </Link>
                  <Link href="/about" onClick={() => setIsOpen(false)} className="block text-lg">
                    About
                  </Link>
                  <Link href="/impressum" onClick={() => setIsOpen(false)} className="block text-lg">
                    Impressum
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Full-width Artist Image */}
        <div className="relative w-full h-[70vh] mb-8">
          <Image
            src="/layz-banner.webp?height=1080&width=1920"
            alt="Artist Name"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white">Lay'z</h2>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Featured Song Section */}
          <section id="featured" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-center">Featured Song</h2>
            <div className="max-w-md mx-auto">
              <Card className="overflow-hidden">
                <Image
                  src="/placeholder.svg?height=300&width=300"
                  alt="Featured Song"
                  width={300}
                  height={300}
                  layout="responsive"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Featured Song Title</h3>
                  <p className="text-sm text-muted-foreground mb-4">Album Name</p>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" /> Play Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Albums Section */}
          <section id="albums" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((album) => (
                <Card key={album} className="overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=300`}
                    alt={`Album ${album}`}
                    width={300}
                    height={300}
                    layout="responsive"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Album Title {album}</h3>
                    <p className="text-sm text-muted-foreground">Year</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* YouTube Videos Section */}
          <section id="videos" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((video) => (
                <Card key={video} className="overflow-hidden">
                  <div className="relative pt-[56.25%]">
                    <Image
                      src={`/placeholder.svg?height=720&width=1280`}
                      alt={`Video ${video}`}
                      layout="fill"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button variant="secondary" size="icon">
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Video Title {video}</h3>
                    <p className="text-sm text-muted-foreground">1M views • 2 weeks ago</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Artist Name. All rights reserved.
        </div>
      </footer>
    </div>
  )
}