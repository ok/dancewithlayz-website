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
import { Icons } from "@/components/Icons"

// Define a type for our social media link configuration
type SocialLink = {
    name: string;
    icon: React.ElementType | string;
    url: string;
    iconProps?: React.SVGProps<SVGSVGElement>;
  };
  
  // Create a configuration array for social media links
  const socialLinks: SocialLink[] = [
    {
      name: "Wavlake",
      icon: Icons.wavlake,
      url: "https://wavlake.com/lay-z",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "YouTube",
      icon: Icons.youtube,
      url: "https://www.youtube.com/@dancewithlayz",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "Spotify",
      icon: Icons.spotify,
      url: "https://open.spotify.com/artist/5ei1vbjC4clbUxPECV7ZpM?si=8YIOzTkAS2C-L2MVyGk6qQ",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "Instagram",
      icon: Icons.insta,
      url: "https://www.instagram.com/dancewithlayz",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "Twitter",
      icon: Icons.twitter,
      url: "https://twitter.com/dancewithlayz",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
  ];
  
export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 bg-background/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center md:space-x-4">
          {socialLinks.map((link) => (
            <Link key={link.name} href={link.url} passHref target="_blank">
              <Button variant="link" size="icon">
                <link.icon {...link.iconProps} />
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
              <Button variant="link" size="icon">
                <Menu className="h-6 w-6 stroke-white" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gray-900/40 backdrop-blur-md text-white">
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
