import { Hero } from "@/components/site/hero"
import { MusicSection } from "@/components/site/music-section"
import { WatchSection } from "@/components/site/watch-section"
import { AboutSection, ContactSection, Marquee } from "@/components/site/sections"

export default function ArtistPage() {
  return (
    <>
      <Hero />
      <Marquee />
      <MusicSection />
      <WatchSection />
      <AboutSection />
      <ContactSection />
    </>
  )
}
