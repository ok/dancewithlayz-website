"use client"
/* eslint-disable @next/next/no-img-element -- the still frame swaps between YouTube thumbnail sizes at runtime */

import { useState } from "react"
import { ytThumb } from "@/lib/media/catalog"
import { useCinema, useMedia } from "./media-provider"

/**
 * The fixed backdrop the YouTube player mounts into, plus the status bar shown
 * while a video plays. A still frame covers the video whenever it isn't playing,
 * so YouTube's own pause/buffering overlay never appears.
 */
export function Cinema() {
  const { state, current } = useMedia()
  const cinema = useCinema()
  const video = current?.kind === "video" ? current.video : null
  const [fallback, setFallback] = useState<string | null>(null)

  // Videos without an HD thumbnail return a 120px grey placeholder — fall back to hqdefault.
  const posterSrc = video ? (fallback === video.id ? ytThumb(video.id, "hqdefault") : ytThumb(video.id, "maxresdefault")) : undefined
  const showPoster = !video || !state.playing || state.loading
  const status = !video ? "Cinema" : `${state.loading ? "Tuning in" : state.playing ? "Now showing" : "Paused"} — ${video.title}`

  return (
    <>
      <div className="backdrop" aria-hidden="true">
        <div className="mount" ref={cinema.mountRef} />
        {posterSrc && (
          <img
            className={`poster${showPoster ? "" : " off"}`}
            src={posterSrc}
            alt=""
            onLoad={(e) => { if (video && e.currentTarget.naturalWidth <= 120) setFallback(video.id) }}
            onError={() => video && setFallback(video.id)}
          />
        )}
        <div className="lines" />
        <div className="shade" />
      </div>
      <div className="hud" role="status" aria-hidden={!cinema.active}>
        <i className="rec" />
        <span>{status}</span>
        <button data-cinema-control onClick={() => cinema.setFocus(!cinema.focus)} aria-pressed={cinema.focus} tabIndex={cinema.active ? 0 : -1}>
          {cinema.focus ? "Show page" : "Hide page"}
        </button>
        <button onClick={cinema.exit} tabIndex={cinema.active ? 0 : -1}>Exit ✕</button>
      </div>
    </>
  )
}
