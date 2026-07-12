"use client"

import { useEffect, useRef, useState } from "react"
import { GeistMono } from "geist/font/mono"
import { Play, Pause, Volume2 } from "lucide-react"
import { useGlobalVolume } from "@/components/wrapper/volume-context"

// Direct Icecast/AzuraCast mount for the 24/7 "Dance with Lay'z" radio,
// found via the public player at y0br0.gotdns.ch/public/dancewithlayz.
const STREAM_URL = "https://y0br0.gotdns.ch/listen/dancewithlayz/compatibility"

export function RadioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hovering, setHovering] = useState(false)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { volume, setVolume } = useGlobalVolume()

  const showVolume = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setHovering(true)
  }

  // Grace period before hiding: the popup floats above the pill with a small
  // gap, so the cursor briefly leaves both elements while moving toward the
  // slider — without this delay that gap closes the popup before it's reached.
  const hideVolume = () => {
    hideTimeoutRef.current = setTimeout(() => setHovering(false), 350)
  }

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

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
    <div
      className="fixed bottom-6 right-6 z-30"
      onMouseEnter={showVolume}
      onMouseLeave={hideVolume}
    >
      <div
        className="absolute bottom-full right-0 mb-2 flex items-center gap-2 rounded-full border hairline bg-background/90 backdrop-blur-md px-4 py-2.5 shadow-lg transition-all origin-bottom-right"
        style={{
          opacity: hovering ? 1 : 0,
          transform: hovering ? "scale(1) translateY(0)" : "scale(0.95) translateY(4px)",
          pointerEvents: hovering ? "auto" : "none",
        }}
      >
        <Volume2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Radio volume"
          className="volume-slider w-24 accent-[hsl(var(--acid))]"
        />
      </div>
      <div
        className="flex items-center gap-4 rounded-full border hairline bg-background/80 backdrop-blur-md pl-3 pr-6 py-3 shadow-lg transition-colors hover:border-[hsl(var(--acid))]"
        style={playing ? { borderColor: "hsl(var(--highlight))", boxShadow: "0 0 30px -8px hsl(var(--highlight) / 0.5)" } : undefined}
      >
        <button
          onClick={toggle}
          aria-label={playing ? "Pause Lay'z Radio" : "Play Lay'z Radio"}
          className="relative flex items-center justify-center h-14 w-14 rounded-full border hairline flex-shrink-0 transition-colors"
          style={playing ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
        >
          {playing && (
            <span className="absolute inset-0 rounded-full bg-[hsl(var(--highlight)/0.25)] animate-ping" />
          )}
          {loading ? (
            <span className="relative h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : playing ? (
            <Pause className="h-6 w-6 relative" />
          ) : (
            <Play className="h-6 w-6 relative" />
          )}
        </button>
        <div className="flex flex-col leading-tight">
          <span className={`${GeistMono.className} text-sm uppercase tracking-[0.14em] text-foreground font-bold`}>
            Lay&apos;z Radio
          </span>
          <span className={`${GeistMono.className} flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-muted-foreground`}>
            <span
              className="h-2 w-2 rounded-full transition-colors"
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
