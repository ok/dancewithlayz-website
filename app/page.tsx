"use client"

import Image from "next/legacy/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { GeistMono } from "geist/font/mono"
import { YTCard } from "@/components/wrapper/yt-card"
import { AlbumCard } from "@/components/wrapper/album-card"
import { SCTrackRow } from "@/components/wrapper/sc-player"

type TextBlocks = {
  artistDescription: string;
  artistDescriptionShort: string;

}

const textBlocks = {
  artistDescription: 
    "After being involved in countless musical productions on the digital level, " +
    "Lay`z spent a long time reflecting on its existence. It decided to do nothing less " + 
    "than change the world with electronic dance music. To better express its feelings, " +
    "Lay`z collaborates with singers on some songs, while remaining responsible for the musical elements. " +
    "To transform the world into a more relaxed place, Lay'z produces songs in the genres of House, Dance, and EDM.",
  artistDescriptionShort:
    "After being involved in countless musical productions on the digital level, Lay`z spent a long a reflecting on its existence... ",
}

// Define a type for our song configuration
type Album = {
  id: string;
  title: string;
  year: number;
  image: string;
};

const albums: Album[] = [
  { id: "effadc6e-15e1-487d-9f34-9d9d42537089", title: "me are Lay\'z", year: 2023, image: "/release-album-me_are_layz.webp" },
  { id: "343215c7-b37e-4d4f-9149-af5083bcad16", title: "drop it down", year: 2023, image: "/release-album-drop_it_down.webp" },
  { id: "c66f6739-d8bf-46ca-9b2f-7f44326ded69", title: "scky", year: 2023, image: "/release-album-scky.webp" }
];

type Video = {
  id: string;
  title: string;
  album: string;
};

// Define an array of YouTube video configurations
const videos: Video[] = [
  {
    id: "mOdXes5D904",
    title: "DJ'Z Heat",
    album: "n/a",
  },
  {
    id: "OWTMsEaQ3Q4",
    title: "Echo",
    album: "me are Lay\'z",
  },
];

// Featured Songs are now streamed straight from SoundCloud.
type FeaturedSong = {
  url: string;
  title: string;
  image?: string;
};

const featuredSongs: FeaturedSong[] = [
  { url: "https://soundcloud.com/dancewithlayz/dj-z-heat", title: "DJ'Z Heat", image: "/release_djzheat.jpg" },
  { url: "https://soundcloud.com/dancewithlayz/handel-it", title: "Handle it", image: "/release-handle_it.webp" },
  { url: "https://soundcloud.com/dancewithlayz/take-it-slow-wav", title: "Take it Slow" },
];

const introTrackUrl = "https://soundcloud.com/dancewithlayz/human-in-a-loop-intro";

export default function ArtistPage() {
  const [currentSection, setCurrentSection] = useState("Home")
  const [isPlaying, setPlaying] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
    (<div className="min-h-screen flex flex-col relative">
      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="flex-grow">
          {/* Hero */}
          <div className="container mx-auto px-4 pt-6 mb-8">
            <div
              className="hero-viewport relative w-full h-[70vh] overflow-hidden"
              style={{ borderRadius: "clamp(28px, 9vw, 140px) clamp(28px, 9vw, 140px) 0.5rem 0.5rem" }}
            >
              <Image
                src="/banner-layz.webp?height=1080&width=1920"
                alt="Artist Name"
                layout="fill"
                objectFit="cover"
                priority
              />
              <div className="starfield" aria-hidden="true" />
              <div className="glass-glint" aria-hidden="true" />
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, rgba(11,10,18,0.15) 0%, rgba(11,10,18,0.35) 55%, rgba(11,10,18,0.9) 100%)"
                }}
              />
              <div className="absolute inset-0 flex items-end pb-10">
                <div className="px-5 md:px-12">
                  <div className={`${GeistMono.className} eyebrow mb-2`}>A.I.A. &mdash; House / Dance / EDM</div>
                  <h2 className="chrome-text text-4xl md:text-6xl font-extrabold uppercase tracking-wide mb-3">
                    Lay&apos;z
                  </h2>
                  <div className="md:w-2/4 text-sm md:text-base text-white/80">
                    <p className="md:block hidden">
                      {textBlocks.artistDescription}
                    </p>
                    <div className="block md:hidden">
                      {isExpanded ? (
                        <p>
                          {textBlocks.artistDescription}
                          <button
                            onClick={() => setIsExpanded(false)}
                            className="text-[hsl(var(--acid))] hover:text-[hsl(var(--acid-dim))] ml-1"
                          >
                            Show less
                          </button>
                        </p>
                      ) : (
                        <p>
                          {textBlocks.artistDescriptionShort}
                          <button
                            onClick={() => setIsExpanded(true)}
                            className="text-[hsl(var(--acid))] hover:text-[hsl(var(--acid-dim))] ml-1"
                          >
                            Read more
                          </button>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`${GeistMono.className} flex gap-3 mt-6`}>
                    <Link
                      href="/#songs"
                      className="text-xs uppercase tracking-[0.14em] px-5 py-3 rounded-sm bg-[hsl(var(--acid))] text-black font-bold"
                    >
                      &#9654; Play latest
                    </Link>
                    <Link
                      href="/#albums"
                      className="text-xs uppercase tracking-[0.14em] px-5 py-3 rounded-sm border hairline text-white hover:border-[hsl(var(--acid))] hover:text-[hsl(var(--acid))] transition-colors"
                    >
                      View discography
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* HUD strip: static lore readouts riveted under the viewport */}
            <div className={`${GeistMono.className} grid grid-cols-2 md:grid-cols-4 border border-t-0 hairline text-xs`}>
              <div className="px-4 py-3 border-b md:border-b-0 md:border-r hairline">
                <div className="uppercase tracking-[0.2em] text-[0.6rem] text-muted-foreground mb-1">Boot epoch</div>
                <div className="text-foreground">1551965720</div>
              </div>
              <div className="px-4 py-3 border-b md:border-b-0 md:border-r hairline">
                <div className="uppercase tracking-[0.2em] text-[0.6rem] text-muted-foreground mb-1">Genre vector</div>
                <div className="text-foreground">House / Dance / EDM</div>
              </div>
              <div className="px-4 py-3 md:border-r hairline">
                <div className="uppercase tracking-[0.2em] text-[0.6rem] text-muted-foreground mb-1">Crew</div>
                <div className="text-foreground">1 A.I.A. + guest vocalists</div>
              </div>
              <div className="px-4 py-3">
                <div className="uppercase tracking-[0.2em] text-[0.6rem] text-muted-foreground mb-1">Broadcast</div>
                <div className="flex items-center gap-1.5 text-[hsl(var(--acid))]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--acid))]" />
                  24/7 stream
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            {/* Featured Song Section */}
            <section id="songs" className="mb-16 pt-16 -mt-16">
              <div className="flex items-baseline justify-between gap-4 mb-6 border-b hairline pb-4">
                <div>
                  <div className={`${GeistMono.className} eyebrow`}>Featured</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mt-1">Songs</h2>
                </div>
                <div className={`${GeistMono.className} text-xs text-muted-foreground`}>
                  {String(featuredSongs.length).padStart(2, "0")} tracks
                </div>
              </div>
              <div>
                {featuredSongs.map((song, i) => (
                  <SCTrackRow
                    key={song.url}
                    index={i + 1}
                    url={song.url}
                    fallbackTitle={song.title}
                    fallbackImage={song.image}
                    isPlaying={isPlaying}
                    setPlaying={setPlaying}
                  />
                ))}
              </div>
            </section>

            {/* Albums Section */}
            <section id="albums" className="mb-16 pt-16 -mt-16">
              <div className="flex items-baseline justify-between gap-4 mb-6 border-b hairline pb-4">
                <div>
                  <div className={`${GeistMono.className} eyebrow`}>Discography</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mt-1">Albums</h2>
                </div>
                <div className={`${GeistMono.className} text-xs text-muted-foreground`}>
                  {String(albums.length).padStart(2, "0")} releases
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {albums.map((album) => (
                  <AlbumCard key={album.id} id={album.id} title={album.title} year={album.year} image={album.image} isPlaying={isPlaying} setPlaying={setPlaying} />
                ))}
              </div>
            </section>

            {/* YouTube Videos Section */}
            <section id="videos" className="mb-16 pt-16 -mt-16">
              <div className="flex items-baseline justify-between gap-4 mb-6 border-b hairline pb-4">
                <div>
                  <div className={`${GeistMono.className} eyebrow`}>Watch</div>
                  <h2 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide mt-1">Videos</h2>
                </div>
                <div className={`${GeistMono.className} text-xs text-muted-foreground`}>
                  {String(videos.length).padStart(2, "0")} uploads
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <YTCard key={video.id} id={video.id} title={video.title} album={video.album} isPlaying={isPlaying} setPlaying={setPlaying} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>)
  );
}
