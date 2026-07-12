"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/Icons"
import { GeistMono } from "geist/font/mono"

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
      </div>
    </header>
  )
}
