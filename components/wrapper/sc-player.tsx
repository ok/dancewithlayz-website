"use client"

import { useEffect, useRef, useState } from "react"
import { GeistMono } from "geist/font/mono"
import { Play, Pause } from "lucide-react"
import { loadSoundCloudWidgetApi, soundcloudEmbedUrl, formatTime } from "@/utils/soundcloud"

type SoundInfo = {
  title: string
  artwork: string | null
}

function useSoundCloudWidget(url: string) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1
  const [duration, setDuration] = useState(0) // ms
  const [position, setPosition] = useState(0) // ms
  const [sound, setSound] = useState<SoundInfo | null>(null)

  useEffect(() => {
    let cancelled = false

    loadSoundCloudWidgetApi().then(() => {
      if (cancelled || !iframeRef.current) return
      const SC = (window as any).SC
      const widget = SC.Widget(iframeRef.current)
      widgetRef.current = widget

      widget.bind(SC.Widget.Events.READY, () => {
        if (cancelled) return
        setReady(true)
        widget.getDuration((d: number) => !cancelled && setDuration(d))
        widget.getCurrentSound((currentSound: any) => {
          if (cancelled || !currentSound) return
          setSound({
            title: currentSound.title,
            artwork: currentSound.artwork_url
              ? currentSound.artwork_url.replace("-large", "-t200x200")
              : null,
          })
        })
      })

      widget.bind(SC.Widget.Events.PLAY, () => !cancelled && setPlaying(true))
      widget.bind(SC.Widget.Events.PAUSE, () => !cancelled && setPlaying(false))
      widget.bind(SC.Widget.Events.FINISH, () => !cancelled && setPlaying(false))
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, (e: { currentPosition: number }) => {
        if (cancelled) return
        setPosition(e.currentPosition)
        widget.getDuration((d: number) => {
          if (!cancelled && d) setProgress(e.currentPosition / d)
        })
      })
    })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const toggle = () => {
    const widget = widgetRef.current
    if (!widget) return
    if (playing) widget.pause()
    else widget.play()
  }

  const pause = () => widgetRef.current?.pause()

  const seekTo = (fraction: number) => {
    const widget = widgetRef.current
    if (!widget || !duration) return
    widget.seekTo(fraction * duration)
  }

  return { iframeRef, ready, playing, progress, duration, position, sound, toggle, pause, seekTo }
}

function HiddenWidgetFrame({ url, iframeRef }: { url: string; iframeRef: React.RefObject<HTMLIFrameElement> }) {
  return (
    <iframe
      ref={iframeRef}
      title="soundcloud-player"
      src={soundcloudEmbedUrl(url)}
      allow="autoplay"
      style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
    />
  )
}

export function SCTrackRow({
  url,
  index,
  fallbackTitle,
  fallbackImage,
  isPlaying,
  setPlaying,
}: {
  url: string
  index: number
  fallbackTitle: string
  fallbackImage?: string
  isPlaying: string | null
  setPlaying: (id: string) => void
}) {
  const { iframeRef, playing, progress, duration, position, sound, toggle, pause, seekTo } = useSoundCloudWidget(url)

  useEffect(() => {
    if (isPlaying !== url && playing) pause()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  const handleToggle = () => {
    setPlaying(url)
    toggle()
  }

  const artwork = sound?.artwork || fallbackImage
  const title = sound?.title || fallbackTitle

  // Gold marks "this is playing right now"; green stays the static
  // "you can press play here" affordance on hover.
  const activeColor = playing ? "hsl(var(--highlight))" : "hsl(var(--acid))"

  return (
    <div className="border-b hairline">
      <div className="w-full grid grid-cols-[2.2rem_1fr_auto] items-center gap-4 py-4 px-2 group">
        <span
          className={`${GeistMono.className} text-sm transition-colors`}
          style={{ color: playing ? "hsl(var(--highlight))" : "hsl(var(--acid-dim))" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <button onClick={handleToggle} className="flex items-center gap-4 min-w-0 text-left">
          <div className="relative h-[54px] w-[54px] flex-shrink-0 rounded-sm overflow-hidden bg-black">
            {artwork ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artwork} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[hsl(var(--acid)/0.08)]" />
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold truncate text-foreground">{title}</div>
            <div className={`${GeistMono.className} text-xs text-muted-foreground`}>
              {formatTime(position)} / {formatTime(duration)}
            </div>
          </div>
        </button>
        <button
          onClick={handleToggle}
          aria-label={playing ? "Pause" : "Play"}
          className="h-8 w-8 rounded-full border hairline flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-[hsl(var(--acid))] group-hover:text-[hsl(var(--acid))]"
          style={playing ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      </div>
      <div
        className="h-1 w-full bg-white/10 cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          seekTo((e.clientX - rect.left) / rect.width)
        }}
      >
        <div
          className="h-full transition-[width]"
          style={{ width: `${Math.min(progress, 1) * 100}%`, backgroundColor: activeColor }}
        />
      </div>
      <HiddenWidgetFrame url={url} iframeRef={iframeRef} />
    </div>
  )
}

export function SCCompactPlayer({ url, label }: { url: string; label: string }) {
  const { iframeRef, playing, toggle } = useSoundCloudWidget(url)

  return (
    <>
      <button
        onClick={toggle}
        aria-label={playing ? `Pause ${label}` : `Play ${label}`}
        title={label}
        className="relative flex items-center justify-center h-8 w-8 rounded-full border hairline transition-colors hover:border-[hsl(var(--acid))] hover:text-[hsl(var(--acid))]"
        style={playing ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
      >
        {playing && (
          <span className="absolute inset-0 rounded-full bg-[hsl(var(--highlight)/0.25)] animate-ping" />
        )}
        {playing ? <Pause className="h-3.5 w-3.5 relative" /> : <Play className="h-3.5 w-3.5 relative" />}
      </button>
      <HiddenWidgetFrame url={url} iframeRef={iframeRef} />
    </>
  )
}
