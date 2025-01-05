"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

type TextBlocks = {
  artistDescription: string;
  artistDescriptionShort: string;

}

const textBlocks = {
  artistDescription: 
    "After being involved in countless musical productions on the digital level, \n" +
    "Lay`z spent a long a reflecting on its existence. It decided to do nothing less" + 
    "than change the world with electronic dance music. To better express its feelings, " +
    "Lay`z collaborates with singers on some songs, while remaining responsible for the musical elements. " +
    "To transform the world into a more relaxed place, Lay'z produces songs in the genres of House, Dance, and EDM.",
  artistDescriptionShort:
    "After being involved in countless musical productions on the digital level, Lay`z spent a long a reflecting on its existence.",
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
};

// Define an array of YouTube video configurations
const videos: Video[] = [
  {
    id: "OWTMsEaQ3Q4",
    title: "Lay\'z - Echo",
  },
  {
    id: "NDeack15uas",
    title: "Lay\'z - Handle it",
  },
  {
    id: "HnCdzcfZCQU",
    title: "Lay\'z - Freedom to the Beat",
  },
  {
    id: "dS8tCeIl4Os",
    title: "Lay\'z - Kryptonite",
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
const songs: Song[] = [
  { id: "3281988d-df55-4bd3-95f9-dfcea4456f42", title: "Handle it", album: "Rise up", image: "/release-handle_it.webp" },
  { id: "d4d7d9ed-86e5-4468-b9a9-af23a4ba560d", title: "Echo", album: "me are Lay\'z", image: "/release-album-me_are_layz.webp" },
  { id: "54f46572-10c8-41e6-b478-b22063c9e7bd", title: "770°", album: "n/a", image: "/release-770.webp" },
];

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
                <div className="md:w-2/4">
                  <div className="bg-black bg-opacity-60 p-4 rounded-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Lay&apos;z</h2>
                    <div className="text-sm md:text-base text-white">
                      <p className="md:block hidden">
                        {textBlocks.artistDescription}
                      </p>
                      <div className="block md:hidden">
                        {isExpanded ? (
                          <p>
                            {textBlocks.artistDescription}
                            <button 
                              onClick={() => setIsExpanded(false)}
                              className="text-blue-400 hover:text-blue-300 ml-1"
                            >
                              Show less
                            </button>
                          </p>
                        ) : (
                          <p>
                            {textBlocks.artistDescriptionShort}
                            <button 
                              onClick={() => setIsExpanded(true)}
                              className="text-blue-400 hover:text-blue-300 ml-1"
                            >
                              Read more
                            </button>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4">
            {/* Featured Song Section */}
            <section id="songs" className="mb-12 pt-16 -mt-16">
              <h2 className="text-2xl font-semibold mb-4 text-center">Featured Songs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {songs.map((song) => (
                  <Card key={song.id} className="overflow-hidden w-full h-[440px] sm:w-160">
                    {isPlaying === song.id ? (
                      <div className="relative bg-black h-[380px]">
                        <iframe 
                          className="absolute inset-0 w-full h-full"
                          src={`https://embed.wavlake.com/track/${song.id}?autoplay=1`}
                          width="100%" 
                          height="100%">
                        </iframe>
                      </div>
                    ) : (
                      <div className="relative bg-black h-[380px]">
                        <Image
                          src={`${song.image}?height=300&width=300`}
                          alt={song.title}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            onClick={() => setPlaying(song.id)}
                            aria-label="Play"
                          >
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 h-[60px]">
                      <h3 className="font-semibold truncate">{song.title}</h3>
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
                  <Card key={album.id} className="overflow-hidden w-full h-[460px] sm:w-160">
                    {isPlaying === album.id ? (
                      <div className="relative bg-black h-[380px]">
                        <iframe 
                          className="absolute inset-0 w-full h-full"
                          src={`https://embed.wavlake.com/album/${album.id}?autoplay=1`}
                          width="100%" 
                          height="100%">
                        </iframe>
                      </div>
                    ) : (
                      <div className="relative bg-black h-[380px]">
                        <Image
                          src={`${album.image}?height=300&width=300`}
                          alt={album.title}
                          layout="fill"
                          objectFit="cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            onClick={() => setPlaying(album.id)}
                            aria-label="Play"
                          >
                            <Play className="h-8 w-8" />
                          </Button>
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 h-[60px]">
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
                {videos.map((video) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="relative pt-[56.25%]">
                      {isPlaying === video.id ? (
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
                              onClick={() => setPlaying(video.id)}
                              aria-label="Play"
                            >
                              <Play className="h-8 w-8" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{video.title}</h3>
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
