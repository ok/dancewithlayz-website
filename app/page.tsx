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

// Define a type for our social media link configuration
type SocialLink = {
  name: string;
  icon: React.ElementType;
  url: string;
};

// Create a configuration array for social media links
const socialLinks: SocialLink[] = [
  {
    name: "Wavlake",
    icon: Music,
    url: "https://https://wavlake.com/lay-z",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://www.youtube.com/@dancewithlayz",
  },
  {
    name: "Spotify",
    icon: Music,
    url: "https://open.spotify.com/artist/5ei1vbjC4clbUxPECV7ZpM?si=8YIOzTkAS2C-L2MVyGk6qQ",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/dancewithlayz",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com/dancewithlayz",
  },
];

const albums = [
  { id: 1, title: "me are Lay'z", year: 2023, image: "/release-album-me_are_layz.png" },
  { id: 2, title: "Rise up", year: 2023, image: "/release-album-drop_it_down.webp" },
  { id: 3, title: "scky", year: 2023, image: "/release-album-scky.png" }
];

// Define an array of YouTube video configurations
const youtubeVideos = [
  {
    id: "OWTMsEaQ3Q4",
    title: "Lay'z - Echo",
    views: "1.2B views",
    uploadDate: "3 months ago"
  },
  {
    id: "NDeack15uas",
    title: "Lay'z - Handle it",
    views: "4.6B views",
    uploadDate: "11 years ago"
  },
  {
    id: "HnCdzcfZCQU",
    title: "Lay'z - Freedom to the Beat",
    views: "5.8B views",
    uploadDate: "6 years ago"
  },
  {
    id: "dS8tCeIl4Os",
    title: "Lay'z - Kryptonite",
    views: "8B views",
    uploadDate: "6 years ago"
  }
];

export default function ArtistPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentSection, setCurrentSection] = useState("Home")
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

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
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.url} passHref>
                <Button variant="ghost" size="icon">
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.name}</span>
                </Button>
              </Link>
            ))}
          </div>
          <h1 className="text-lg font-semibold">Dance with Lay'z</h1>
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
            src="/banner-layz.webp?height=1080&width=1920"
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
                  src="/release-handle_it.webp?height=300&width=300"
                  alt="Featured Song"
                  width={300}
                  height={300}
                  layout="responsive"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">Handle it</h3>
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
              {albums.map((album) => (
                <Card key={album.id} className="overflow-hidden">
                  <Image
                    src={`${album.image}?height=300&width=300`}
                    alt={album.title}
                    width={300}
                    height={300}
                    layout="responsive"
                  />
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{album.title}</h3>
                    <p className="text-sm text-muted-foreground">{album.year}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* YouTube Videos Section */}
          <section id="videos" className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {youtubeVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative pt-[56.25%]">
                    {playingVideo === video.id ? (
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <>
                        <Image
                          src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                          alt={video.title}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            onClick={() => setPlayingVideo(video.id)}
                          >
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    {/* <p className="text-sm text-muted-foreground">{video.views} • {video.uploadDate}</p> */}
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
          © {new Date().getFullYear()} Dance with Lay'z. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
