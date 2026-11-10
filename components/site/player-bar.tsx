"use client"
/* eslint-disable @next/next/no-img-element -- artwork comes from SoundCloud / YouTube at runtime */

import { useEffect, useRef, useState } from "react"
import { formatTime } from "@/lib/media/catalog"
import type { MediaEngine } from "@/lib/media/engine"
import { useCinema, useMedia } from "./media-provider"
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, SpinnerIcon, VolumeIcon } from "./icons"

/**
 * Seek slider with timecodes. While dragging it only moves the thumb; the jump happens
 * on release via the native `change` event, which fires for mouse, keyboard and touch
 * alike (pointer/touch-end events are unreliable on mobile range inputs).
 */
function SeekBar({ engine, position, duration, className }: { engine: MediaEngine | null; position: number; duration: number; className: string }) {
  const [scrub, setScrub] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    const commit = () => { engine?.seek(+el.value / 1000); setScrub(null) }
    el.addEventListener("change", commit)
    return () => el.removeEventListener("change", commit)
  }, [engine])

  const progress = duration ? position / duration : 0
  const shown = scrub ?? Math.round(progress * 1000)
  return (
    <div className={`${className} mono`}>
      <span>{formatTime(scrub !== null ? (scrub / 1000) * duration : position)}</span>
      <input
        ref={inputRef}
        type="range" min={0} max={1000} step={1} value={shown} aria-label="Seek"
        disabled={!duration}
        style={{ ["--p" as string]: `${shown / 10}%` }}
        onChange={(e) => setScrub(+e.target.value)}
      />
      <span>{formatTime(duration)}</span>
    </div>
  )
}

/** The one place to play, pause, skip, seek and set the volume — for songs and videos alike. */
export function PlayerBar() {
  const { engine, state, current } = useMedia()
  const cinema = useCinema()
  const isVideo = current?.kind === "video"

  return (
    <div className="player" aria-label="Player" role="region">
      {/* Phones: full-width, finger-sized seek row across the top of the bar. */}
      <SeekBar className="mseek" engine={engine} position={state.position} duration={state.duration} />
      <div className="np">
        <div className="art">{current && <img src={current.art} alt="" />}</div>
        <div className="meta">
          <div className="tt">
            {isVideo && <span className="tag-video mono">VIDEO</span>}
            {current?.title || "Nothing playing"}
          </div>
          <div className="aa mono">
            <span>{current ? current.sub : "Pick a track — or press space"}</span>
            {isVideo && cinema.active && (
              <button className="jump mono" data-cinema-control onClick={() => cinema.setFocus(!cinema.focus)}>
                {cinema.focus ? "show page" : "hide page"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="ctrl">
        <div className="btns">
          <button className="side" onClick={() => engine?.prev()} aria-label="Previous"><PrevIcon /></button>
          <button className="main" onClick={() => engine?.toggle()} aria-label={state.playing ? "Pause" : "Play"} disabled={!engine}>
            {state.loading && !state.playing ? <SpinnerIcon /> : state.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="side" onClick={() => engine?.next()} aria-label="Next"><NextIcon /></button>
        </div>
        <SeekBar className="bar" engine={engine} position={state.position} duration={state.duration} />
      </div>

      <div className="vol">
        <VolumeIcon />
        <input
          type="range" min={0} max={100} value={state.volume} aria-label="Volume"
          style={{ ["--p" as string]: `${state.volume}%` }}
          onChange={(e) => engine?.setVolume(+e.target.value)}
        />
      </div>
    </div>
  )
}
