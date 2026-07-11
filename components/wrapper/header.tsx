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
import { GeistMono } from "geist/font/mono"
import { SCCompactPlayer } from "@/components/wrapper/sc-player"

const introTrackUrl = "https://soundcloud.com/dancewithlayz/human-in-a-loop-intro"

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
      name: "Nostr",
      icon: Icons.nostr_simple,
      url: "https://primal.net/p/npub1vnhewgt6ep6f6xrsqm3kyup0ntfmdya3lctn2awx5r40fv7gvn4s45fm79",
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
      name: "Soundcloud",
      icon: Icons.soundcloud,
      url: "https://on.soundcloud.com/VnwC6AKmZtTmvXRp6",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "Instagram",
      icon: Icons.insta,
      url: "https://www.instagram.com/dancewithlayz",
      iconProps: { className: "h-5 w-5 fill-white" },
    },
    {
      name: "TikTok",
      icon: Icons.tiktok,
      url: "https://tiktok.com/@dancewithlayz",
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
    <header className="sticky top-0 z-20 border-b hairline bg-background/70 backdrop-blur-md">
      <div className="container relative mx-auto px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center lg:space-x-2 md:space-x-0">
          {socialLinks.map((link) => (
            <Link key={link.name} href={link.url} passHref target="_blank">
              <Button className="p-2 bg-transparent hover:bg-transparent group" size="icon">
                <link.icon {...link.iconProps} className={`${link.iconProps?.className} transition-colors group-hover:fill-[hsl(var(--acid))]`} />
                <span className="sr-only">{link.name}</span>
              </Button>
            </Link>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3 absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--acid))] shadow-[0_0_10px_hsl(var(--acid)),0_0_20px_hsl(var(--acid))]" />
            <span className="chrome-text text-lg font-extrabold uppercase tracking-wide">
              Lay&apos;z
            </span>
          </Link>
          <SCCompactPlayer url={introTrackUrl} label="Intro" />
        </div>
        <nav className={`hidden md:flex md:space-x-6 ${GeistMono.className}`}>
          <Link href="/#songs" className="text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors">
            Songs
          </Link>
          <Link href="/#albums" className="text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors">
            Albums
          </Link>
          <Link href="/#videos" className="text-xs uppercase tracking-[0.14em] text-white/70 hover:text-white transition-colors">
            Videos
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="p-2 bg-transparent hover:bg-transparent" size="icon">
                <Menu className="h-6 w-6 stroke-white" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background/90 backdrop-blur-md text-white hairline">
              <SheetHeader>
                <SheetTitle className="pt-8 chrome-text uppercase tracking-wide">Lay&apos;z</SheetTitle>
              </SheetHeader>
              <div className={`mt-4 space-y-4 ${GeistMono.className}`}>
                <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-[0.14em] text-white hover:text-[hsl(var(--acid))]">
                  Home
                </Link>
                <Link href="/#songs" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-[0.14em] text-white hover:text-[hsl(var(--acid))]">
                  Songs
                </Link>
                <Link href="/#albums" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-[0.14em] text-white hover:text-[hsl(var(--acid))]">
                  Albums
                </Link>
                <Link href="/#videos" onClick={() => setIsOpen(false)} className="block text-sm uppercase tracking-[0.14em] text-white hover:text-[hsl(var(--acid))]">
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
