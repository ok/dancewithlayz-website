"use client"
/* eslint-disable @next/next/no-img-element -- artwork comes from SoundCloud / YouTube at runtime */

import { useState } from "react"
import { formatTime } from "@/lib/media/catalog"
import { useCinema, useMedia } from "./media-provider"
import { NextIcon, PauseIcon, PlayIcon, PrevIcon, SpinnerIcon, VolumeIcon } from "./icons"

/** The one place to play, pause, skip, seek and set the volume — for songs and videos alike. */
export function PlayerBar() {
  const { engine, state, current } = useMedia()
  const cinema = useCinema()
  const [scrub, setScrub] = useState<number | null>(null)

  const progress = state.duration ? state.position / state.duration : 0
  const shown = scrub ?? Math.round(progress * 1000)
  const isVideo = current?.kind === "video"

  return (
    <div className="player" aria-label="Player" role="region">
      <div className="mini-progress" style={{ ["--p" as string]: `${progress * 100}%` }} />
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
        <div className="bar mono">
          <span>{formatTime(scrub !== null ? (scrub / 1000) * state.duration : state.position)}</span>
          <input
            type="range" min={0} max={1000} value={shown} aria-label="Seek"
            style={{ ["--p" as string]: `${shown / 10}%` }}
            onChange={(e) => setScrub(+e.target.value)}
            onPointerUp={() => { if (scrub !== null) { engine?.seek(scrub / 1000); setScrub(null) } }}
            onKeyUp={() => { if (scrub !== null) { engine?.seek(scrub / 1000); setScrub(null) } }}
          />
          <span>{formatTime(state.duration)}</span>
        </div>
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
