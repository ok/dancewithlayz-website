"use client"

import Image from "next/legacy/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export function WLCard({ id, title, album, image, isPlaying, setPlaying }: { id: string, title: string, album: string, image: string, isPlaying: string | null, setPlaying: (id: string) => void }) {
  return (
    <Card key={id} className="overflow-hidden w-full h-[440px] sm:w-160">
    {isPlaying === id ? (
      <div className="relative bg-black h-[380px]">
        <iframe 
          className="absolute inset-0 w-full h-full"
          src={`https://embed.wavlake.com/track/${id}?autoplay=1`}
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
    <CardContent className="p-4 h-[60px]">
      <h3 className="font-semibold truncate">{title}</h3>
    </CardContent>
    </Card>
  )  
}