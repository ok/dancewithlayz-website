"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  return (
    <header className="sticky top-0 z-20 border-b hairline bg-background/70 backdrop-blur-md">
      <div className="container relative mx-auto px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center lg:space-x-2 md:space-x-0 flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
        <div className="flex md:hidden items-center gap-2 flex-shrink-0 pl-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--acid))] shadow-[0_0_10px_hsl(var(--acid)),0_0_20px_hsl(var(--acid))]" />
            <span className="chrome-text text-base font-extrabold uppercase tracking-wide">
              Lay&apos;z
            </span>
          </Link>
          <SCCompactPlayer url={introTrackUrl} label="Intro" />
        </div>
      </div>
    </header>
  )
}
