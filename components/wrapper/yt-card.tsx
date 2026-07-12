"use client"

import Image from "next/legacy/image"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { usePlayback } from "@/components/wrapper/playback-context"

export function YTCard({ id, title, album }: { id: string, title: string, album: string }) {
  const { activeId, requestPlay } = usePlayback()
  return (
    <div className="overflow-hidden rounded-sm border hairline bg-background/20 transition-colors hover:border-[hsl(var(--acid))]">
    <div className="relative pt-[56.25%]">
      {activeId === id ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <>
          <Image
            src={`https://img.youtube.com/vi/${id}/0.jpg`}
            alt={title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => requestPlay(id)}
              aria-label="Play"
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        </>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-foreground">{title}</h3>
    </div>
    </div>
  )
}
