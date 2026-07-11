"use client"

import { useEffect, useRef, useState } from "react"
import { GeistMono } from "geist/font/mono"
import { Play, Pause } from "lucide-react"

// Direct Icecast/AzuraCast mount for the 24/7 "Dance with Lay'z" radio,
// found via the public player at y0br0.gotdns.ch/public/dancewithlayz.
const STREAM_URL = "https://y0br0.gotdns.ch/listen/dancewithlayz/compatibility"

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlaying = () => {
      setPlaying(true)
      setLoading(false)
    }
    const onPause = () => setPlaying(false)
    const onWaiting = () => setLoading(true)
    audio.addEventListener("playing", onPlaying)
    audio.addEventListener("pause", onPause)
    audio.addEventListener("waiting", onWaiting)
    return () => {
      audio.removeEventListener("playing", onPlaying)
      audio.removeEventListener("pause", onPause)
      audio.removeEventListener("waiting", onWaiting)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      // Fully disconnect rather than just pausing, so the next play joins
      // the live stream at the current moment instead of a stale buffer.
      audio.pause()
      audio.removeAttribute("src")
      audio.load()
      setPlaying(false)
      setLoading(false)
    } else {
      setLoading(true)
      audio.src = STREAM_URL
      audio.play().catch(() => setLoading(false))
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-30">
      <div className="flex items-center gap-3 rounded-full border hairline bg-background/80 backdrop-blur-md pl-2.5 pr-4 py-2 shadow-lg transition-colors hover:border-[hsl(var(--acid))]">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause Lay'z Radio" : "Play Lay'z Radio"}
          className="relative flex items-center justify-center h-9 w-9 rounded-full border hairline flex-shrink-0 transition-colors"
          style={playing ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--highlight)/0.25)] animate-ping" />
          )}
          {loading ? (
            <span className="relative h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : playing ? (
            <Pause className="h-4 w-4 relative" />
          ) : (
            <Play className="h-4 w-4 relative" />
          )}
        </button>
        <div className="flex flex-col leading-tight">
          <span className={`${GeistMono.className} text-[0.65rem] uppercase tracking-[0.14em] text-foreground`}>
            Lay&apos;z Radio
          </span>
          <span className={`${GeistMono.className} flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground`}>
            <span
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: playing ? "hsl(var(--highlight))" : "hsl(var(--acid-dim))",
                boxShadow: playing ? "0 0 6px hsl(var(--highlight))" : undefined,
              }}
            />
            {loading ? "Connecting" : playing ? "On air" : "24/7 stream"}
          </span>
        </div>
        <audio ref={audioRef} preload="none" />
      </div>
    </div>
  )
}
