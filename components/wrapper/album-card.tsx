"use client"

import Image from "next/legacy/image"
import { GeistMono } from "geist/font/mono"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function AlbumCard({ id, title, year, image, isPlaying, setPlaying }: { id: string, title: string, year: number, image: string, isPlaying: string | null, setPlaying: (id: string) => void }) {
  return (
    <div className="overflow-hidden rounded-sm border hairline bg-background/20 transition-colors hover:border-[hsl(var(--acid))]">
    {isPlaying === id ? (
      <div className="relative bg-black h-[380px]">
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://embed.wavlake.com/album/${id}?autoplay=1`}
          width="100%"
          height="100%">
        </iframe>
      </div>
    ) : (
      <div className="relative bg-black h-[380px]">
        <Image
          src={`${image}?height=300&width=300`}
          alt={title}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 300px) 100vw"
        />
        <span
          className={`${GeistMono.className} absolute top-3 left-3 text-[0.65rem] tracking-[0.1em] px-2 py-1 rounded-sm border`}
          style={{ backgroundColor: "hsl(var(--info) / 0.35)", borderColor: "hsl(var(--info))", color: "hsl(var(--chrome-1))" }}
        >
          {year}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => setPlaying(id)}
            aria-label="Play"
          >
            <Play className="h-8 w-8" />
          </Button>
        </div>
      </div>
    )}
    <div className="p-4">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{year}</p>
    </div>
    </div>
)
}
