"use client"

import Image from "next/legacy/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play } from "lucide-react"

export function YTCard({ id, title, album, isPlaying, setPlaying }: { id: string, title: string, album: string, isPlaying: string | null, setPlaying: (id: string) => void }) {
  return (
    <Card key={id} className="overflow-hidden">
    <div className="relative pt-[56.25%]">
      {isPlaying === id ? (
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
              onClick={() => setPlaying(id)}
              aria-label="Play"
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
        </>
      )}
    </div>
    <CardContent className="p-4">
      <h3 className="font-semibold">{title}</h3>
    </CardContent>
    </Card>
  )  
}