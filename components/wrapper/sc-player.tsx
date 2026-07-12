"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { GeistMono } from "geist/font/mono"
import { Play, Pause, Volume2 } from "lucide-react"
import { loadSoundCloudWidgetApi, soundcloudEmbedUrl, formatTime } from "@/utils/soundcloud"
import { useGlobalVolume } from "@/components/wrapper/volume-context"

type SoundInfo = {
  title: string
  artwork: string | null
}

function useSoundCloudWidget(url: string) {
  const { volume } = useGlobalVolume()
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
        widget.setVolume(volume)
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

  useEffect(() => {
    widgetRef.current?.setVolume(volume)
  }, [volume])

  const toggle = () => {
    const widget = widgetRef.current
    if (!widget) return
    if (playing) widget.pause()
    else widget.play()
  }

  const pause = () => widgetRef.current?.pause()

  // Also explicitly starts playback: SC's widget can emit a PLAY event on
  // seek without actually resuming audio, and seeking a row that isn't the
  // page's active track gets undone a tick later by the pause-on-mismatch
  // effect below — calling play() here (from the same click) guarantees the
  // seek always results in real, audible playback.
  const seekTo = (fraction: number) => {
    const widget = widgetRef.current
    if (!widget || !duration) return
    widget.seekTo(fraction * duration)
    widget.play()
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
      style={{
        position: "absolute",
        left: -9999,
        top: -9999,
        width: 300,
        height: 166,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  )
}

// One global slider drives every player's volume at once.
export function VolumeSlider({ className = "w-20" }: { className?: string }) {
  const { volume, setVolume } = useGlobalVolume()
  return (
    <div
      className="hidden sm:flex items-center gap-1.5 flex-shrink-0"
      onClick={(e) => e.stopPropagation()}
    >
      <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-label="Volume"
        className={`volume-slider accent-[hsl(var(--acid))] ${className}`}
      />
    </div>
  )
}

export function SCTrackRow({
  url,
  index,
  fallbackTitle,
  isPlaying,
  setPlaying,
}: {
  url: string
  index: number
  fallbackTitle: string
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

  // Waveform seeks need the row to also claim page-level "now playing"
  // status — otherwise the pause-on-mismatch effect above immediately
  // pauses this row again since `isPlaying` still points at a different url.
  const handleSeek = (fraction: number) => {
    setPlaying(url)
    seekTo(fraction)
  }

  const title = sound?.title || fallbackTitle

  return (
    <div className="border-b hairline">
      <div className="w-full grid grid-cols-[2.2rem_1fr_auto] items-center gap-4 py-2.5 px-2 group">
        <span
          className={`${GeistMono.className} text-sm transition-colors`}
          style={{ color: playing ? "hsl(var(--highlight))" : "hsl(var(--acid-dim))" }}
        >
          {String(index).padStart(2, "0")}
        </span>
        <button onClick={handleToggle} className="flex items-baseline gap-3 min-w-0 text-left">
          <span className="font-semibold truncate text-foreground">{title}</span>
          <span className={`${GeistMono.className} text-xs text-muted-foreground flex-shrink-0`}>
            {formatTime(position)} / {formatTime(duration)}
          </span>
        </button>
        <div className="flex items-center gap-3 flex-shrink-0">
          {playing && <VolumeSlider className="w-14" />}
          <button
            onClick={handleToggle}
            aria-label={playing ? "Pause" : "Play"}
            className="h-8 w-8 rounded-full border hairline flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-[hsl(var(--acid))] group-hover:text-[hsl(var(--acid))]"
            style={playing ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
      <Waveform seed={title} progress={progress} active={playing} onSeek={handleSeek} heightClassName="h-8" />
      <HiddenWidgetFrame url={url} iframeRef={iframeRef} />
    </div>
  )
}

type PlaylistSound = {
  id: number | string
  title: string
  artwork: string | null
  duration: number
}

function usePlaylistWidget(url: string) {
  const { volume } = useGlobalVolume()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const widgetRef = useRef<any>(null)
  const [sounds, setSounds] = useState<PlaylistSound[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1
  const [duration, setDuration] = useState(0) // ms
  const [position, setPosition] = useState(0) // ms

  useEffect(() => {
    let cancelled = false

    loadSoundCloudWidgetApi().then(() => {
      if (cancelled || !iframeRef.current) return
      const SC = (window as any).SC
      const widget = SC.Widget(iframeRef.current)
      widgetRef.current = widget

      widget.bind(SC.Widget.Events.READY, () => {
        if (cancelled) return
        widget.setVolume(volume)
        widget.getSounds((rawSounds: any[]) => {
          if (cancelled) return
          setSounds(
            (rawSounds || [])
              .filter((s) => s && s.title)
              .map((s, i) => ({
                id: s.id ?? s.permalink_url ?? i,
                title: s.title,
                artwork: s.artwork_url ? s.artwork_url.replace("-large", "-t200x200") : null,
                duration: s.duration || 0,
              }))
          )
        })
      })

      widget.bind(SC.Widget.Events.PLAY, () => {
        if (cancelled) return
        setPlaying(true)
        widget.getCurrentSoundIndex((i: number) => !cancelled && setCurrentIndex(i))
        widget.getDuration((d: number) => !cancelled && setDuration(d))
      })
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

  useEffect(() => {
    widgetRef.current?.setVolume(volume)
  }, [volume])

  const playIndex = (i: number) => {
    const widget = widgetRef.current
    if (!widget) return
    if (currentIndex === i) {
      if (playing) widget.pause()
      else widget.play()
      return
    }
    widget.skip(i)
    setCurrentIndex(i)
    setProgress(0)
    setPosition(0)
  }

  // Always restarts the track from 0, even if it's already the current one —
  // used by the track list, as opposed to playIndex's play/pause toggle.
  // SC's widget can resume a skipped-to track from wherever it last left off,
  // so seekTo(0) is forced both immediately and once the new sound has loaded.
  const playFromStart = (i: number) => {
    const widget = widgetRef.current
    if (!widget) return
    if (currentIndex !== i) {
      widget.skip(i)
      setCurrentIndex(i)
    }
    widget.seekTo(0)
    widget.play()
    setProgress(0)
    setPosition(0)
    setTimeout(() => {
      widget.seekTo(0)
    }, 150)
  }

  const seekTo = (fraction: number) => {
    const widget = widgetRef.current
    if (!widget || !duration) return
    widget.seekTo(fraction * duration)
  }

  return { iframeRef, sounds, currentIndex, playing, progress, duration, position, playIndex, playFromStart, seekTo }
}

// Deterministic pseudo-waveform so the bar heights are stable per track
// (SoundCloud's Widget API doesn't expose real peak data without extra fetches).
function generateWaveformBars(seed: string, count: number) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  let x = h || 1
  const bars: number[] = []
  for (let i = 0; i < count; i++) {
    x ^= x << 13
    x ^= x >>> 17
    x ^= x << 5
    x >>>= 0
    bars.push(0.22 + (x % 1000) / 1000 * 0.78)
  }
  return bars
}

// Sized generously so the fixed-width bars still fill the widest container
// (1400px max-width page container); excess is simply clipped on narrower ones.
const WAVEFORM_BAR_COUNT = 400

function WaveformBars({
  bars,
  top,
  bottom,
  fadeIn,
}: {
  bars: number[]
  top: string
  bottom: string
  fadeIn?: boolean
}) {
  return (
    <div className="flex items-end gap-px h-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-[3px]"
          style={{
            height: `${h * 100}%`,
            transformOrigin: "bottom",
            backgroundImage: `linear-gradient(to top, ${bottom}, ${top})`,
            ...(fadeIn
              ? {
                  animation: "waveform-bar-in 140ms ease-out both",
                  animationDelay: `${(i / bars.length) * 200}ms`,
                }
              : {}),
          }}
        />
      ))}
    </div>
  )
}

function Waveform({
  seed,
  progress,
  active,
  onSeek,
  heightClassName = "h-16",
}: {
  seed: string
  progress: number
  active: boolean
  onSeek: (fraction: number) => void
  heightClassName?: string
}) {
  const bars = useMemo(() => generateWaveformBars(seed, WAVEFORM_BAR_COUNT), [seed])
  const playedTop = active ? "hsl(var(--highlight))" : "hsl(var(--acid))"
  const playedBottom = active ? "hsl(var(--highlight) / 0.35)" : "hsl(var(--acid) / 0.35)"
  const clampedProgress = Math.min(Math.max(progress, 0), 1)

  return (
    <div
      className={`relative ${heightClassName} overflow-hidden cursor-pointer`}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        onSeek((e.clientX - rect.left) / rect.width)
      }}
    >
      {/* Base layer: dim, unplayed color, fades in left-to-right on track load */}
      <div key={seed} className="absolute inset-0">
        <WaveformBars bars={bars} top="hsl(var(--acid) / 0.22)" bottom="hsl(var(--acid) / 0.06)" fadeIn />
      </div>

      {/* Played overlay: clipped to progress, edge softened so the color blends
          into the base layer instead of switching abruptly at the playhead. */}
      {clampedProgress > 0 && (
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{
            width: `${clampedProgress * 100}%`,
            maskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
          }}
        >
          <div className="h-full" style={{ width: `${100 / clampedProgress}%` }}>
            <WaveformBars bars={bars} top={playedTop} bottom={playedBottom} />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-px" style={{ backgroundColor: "hsl(var(--acid) / 0.3)" }} />
    </div>
  )
}

export function SCPlaylistPlayer({ url }: { url: string }) {
  const { iframeRef, sounds, currentIndex, playing, progress, duration, position, playIndex, playFromStart, seekTo } =
    usePlaylistWidget(url)

  const activeIndex = currentIndex ?? 0
  const activeSound = sounds[activeIndex]
  const isActive = currentIndex !== null && playing

  return (
    <div>
      {sounds.length === 0 ? (
        <div className={`${GeistMono.className} py-8 text-center text-sm text-muted-foreground`}>
          Loading playlist&hellip;
        </div>
      ) : (
        <>
          <div className="border hairline rounded-sm bg-background/20 p-4 md:p-5 mb-2">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative h-16 w-16 flex-shrink-0 rounded-sm overflow-hidden bg-black">
                {activeSound?.artwork ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={activeSound.artwork} alt={activeSound.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-[hsl(var(--acid)/0.08)]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className={`${GeistMono.className} text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground mb-1`}>
                  {isActive ? "Now Playing" : "Up Next"}
                </div>
                <div className="font-semibold text-lg truncate text-foreground">{activeSound?.title}</div>
                <div className={`${GeistMono.className} text-xs text-muted-foreground`}>
                  {formatTime(position)} / {formatTime(duration || activeSound?.duration || 0)}
                </div>
              </div>
              {isActive && <VolumeSlider className="w-20" />}
              <button
                onClick={() => playIndex(activeIndex)}
                aria-label={isActive ? "Pause" : "Play"}
                className="h-11 w-11 rounded-full border hairline flex items-center justify-center flex-shrink-0 transition-colors hover:border-[hsl(var(--acid))] hover:text-[hsl(var(--acid))]"
                style={isActive ? { borderColor: "hsl(var(--highlight))", color: "hsl(var(--highlight))" } : undefined}
              >
                {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>

            {currentIndex !== null ? (
              <Waveform
                seed={activeSound?.title || url}
                progress={progress}
                active={isActive}
                onSeek={seekTo}
              />
            ) : (
              <div className="relative h-16 flex items-end">
                <div className="absolute inset-x-0 bottom-0 h-px" style={{ backgroundColor: "hsl(var(--acid) / 0.3)" }} />
              </div>
            )}
          </div>

          <div>
            {sounds.map((sound, i) => {
              const isRowActive = currentIndex === i && playing
              return (
                <button
                  key={sound.id}
                  onClick={() => playFromStart(i)}
                  className="w-full grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-2.5 px-2 border-b hairline text-left group transition-colors hover:bg-[hsl(var(--acid)/0.04)]"
                >
                  <span
                    className={`${GeistMono.className} text-xs`}
                    style={{ color: isRowActive ? "hsl(var(--highlight))" : "hsl(var(--acid-dim))" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`truncate text-sm ${isRowActive ? "font-semibold" : "text-foreground"}`}
                    style={isRowActive ? { color: "hsl(var(--highlight))" } : undefined}
                  >
                    {sound.title}
                  </span>
                  <span className={`${GeistMono.className} text-xs text-muted-foreground`}>
                    {formatTime(sound.duration)}
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}
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
