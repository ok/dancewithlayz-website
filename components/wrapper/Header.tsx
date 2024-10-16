"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Youtube, Instagram, Twitter, } from "lucide-react"
import Wavlake from "/app/icon-wavlake.svg";
import Spotify from "/app/icon-spotify.svg";

// Define a type for our social media link configuration
type SocialLink = {
    name: string;
    icon: React.ElementType | string;
    url: string;
  };
  
  // Create a configuration array for social media links
  const socialLinks: SocialLink[] = [
    {
      name: "Wavlake",
      icon: Wavlake,
      url: "https://wavlake.com/lay-z",
    },
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://www.youtube.com/@dancewithlayz",
    },
    {
      name: "Spotify",
      icon: Spotify,
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
  
  export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-background/20 backdrop-blur-sm">
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
        <h1 className="text-lg font-semibold hidden md:block">Dance with Lay&apos;z</h1>
        <nav className="hidden md:flex md:space-x-4">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/#songs" className="text-sm font-medium hover:text-primary">
            Songs
          </Link>
          <Link href="/#albums" className="text-sm font-medium hover:text-primary">
            Albums
          </Link>
          <Link href="/#videos" className="text-sm font-medium hover:text-primary">
            Videos
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="default" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900/80 backdrop-blur-md text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-4">
                <Link href="/" onClick={() => setIsOpen(false)} className="block text-lg text-white hover:text-gray-300">
                  Home
                </Link>
                <Link href="/#songs" onClick={() => setIsOpen(false)} className="block text-lg text-white hover:text-gray-300">
                  Songs
                </Link>
                <Link href="/#albums" onClick={() => setIsOpen(false)} className="block text-lg text-white hover:text-gray-300">
                  Albums
                </Link>
                <Link href="/#videos" onClick={() => setIsOpen(false)} className="block text-lg text-white hover:text-gray-300">
                  Videos
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
