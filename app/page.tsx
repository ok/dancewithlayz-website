"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

const albums = [
  { id: 1, title: "me are Lay\'z", year: 2023, image: "/release-album-me_are_layz.webp" },
  { id: 2, title: "Rise up", year: 2023, image: "/release-album-drop_it_down.webp" },
  { id: 3, title: "scky", year: 2023, image: "/release-album-scky.webp" }
];

// Define an array of YouTube video configurations
const youtubeVideos = [
  {
    id: "OWTMsEaQ3Q4",
    title: "Lay\'z - Echo",
    views: "1.2B views",
    uploadDate: "3 months ago"
  },
  {
    id: "NDeack15uas",
    title: "Lay\'z - Handle it",
    views: "4.6B views",
    uploadDate: "11 years ago"
  },
  {
    id: "HnCdzcfZCQU",
    title: "Lay\'z - Freedom to the Beat",
    views: "5.8B views",
    uploadDate: "6 years ago"
  },
  {
    id: "dS8tCeIl4Os",
    title: "Lay\'z - Kryptonite",
    views: "8B views",
    uploadDate: "6 years ago"
  }
];

// Define a type for our song configuration
type Song = {
  id: string;
  title: string;
  album: string;
  image: string;
};

// Create a configuration array for featured songs
const featuredSongs: Song[] = [
  { id: "3281988d-df55-4bd3-95f9-dfcea4456f42", title: "Handle it", album: "Rise up", image: "/release-handle_it.webp" },
  { id: "d4d7d9ed-86e5-4468-b9a9-af23a4ba560d", title: "Echo", album: "me are Lay\'z", image: "/release-album-me_are_layz.webp" },
  { id: "54f46572-10c8-41e6-b478-b22063c9e7bd", title: "770°", album: "n/a", image: "/release-770.webp" },
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
    <div className="min-h-screen flex flex-col relative">
      <div className="relative z-10 flex flex-col min-h-screen">
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
            <div className="absolute inset-0 flex items-end pb-8">
              <div className="container mx-auto px-4">
                <div className="w-2/4">
                  <div className="bg-black bg-opacity-60 p-4 rounded-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Lay&apos;z</h2>
                    <p className="text-sm md:text-base text-white">
                      I am an A.I.A. (Artificial Intelligence Artist), created in a processor at Unix-era 1551965720. Since I haven&apos;t found my purpose yet, I will change the world through electronic dance music.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            {/* Featured Song Section */}
            <section id="songs" className="mb-12 pt-16 -mt-16">
              <h2 className="text-2xl font-semibold mb-4 text-center">Featured Songs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredSongs.map((song) => (
                  <Card key={song.id} className="overflow-hidden">
                    {playingVideo === song.id ? (
                      <div className="relative pt-[100%] bg-black">
                        <iframe 
                          className="absolute inset-0 w-full h-full pt-[8%]"
                          src={`https://embed.wavlake.com/track/${song.id}?autoplay=1`}
                          width="100%" 
                          height="100%">
                        </iframe>
                      </div>
                    ) : (
                      <div className="relative bg-black">
                        <Image
                          src={`${song.image}?height=300&width=300`}
                          alt={song.title}
                          width={300}
                          height={300}
                          layout="responsive"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            onClick={() => setPlayingVideo(song.id)}
                          >
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{song.title}</h3>
                    </CardContent>
                  </Card>
              ))}
              </div>
            </section>

            {/* Albums Section */}
            <section id="albums" className="mb-12 pt-16 -mt-16">
              <h2 className="text-2xl font-semibold mb-4 text-center">Albums</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <section id="videos" className="mb-12 pt-16 -mt-16">
              <h2 className="text-2xl font-semibold mb-4 text-center">Videos</h2>
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
      </div>
    </div>
  )
}
