"use client"
/* eslint-disable @next/next/no-img-element -- covers come from SoundCloud's CDN at runtime */

import { useEffect, useRef, useState } from "react"
import { formatTime } from "@/lib/media/catalog"
import { useCinema, useMedia } from "./media-provider"
import { ChevronLeft, ChevronRight, PauseIcon, PlayIcon } from "./icons"

/** 3D album carousel with a glass tracklist panel for the album in focus. */
export function MusicSection() {
  const { engine, state, albums } = useMedia()
  const cinema = useCinema()
  const [focus, setFocus] = useState(0)
  const flowRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; moved: boolean } | null>(null)
  const n = albums.length
  const go = (i: number) => setFocus(((i % n) + n) % n)

  // ← / → move the carousel while it's on screen (Shift+arrows stay the player's next/prev).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.shiftKey || t.closest("input, textarea")) return
      const r = flowRef.current?.getBoundingClientRect()
      if (!r || r.top > innerHeight || r.bottom < 0) return
      if (e.key === "ArrowLeft") setFocus((f) => (f - 1 + n) % n)
      if (e.key === "ArrowRight") setFocus((f) => (f + 1) % n)
    }
    addEventListener("keydown", onKey)
    return () => removeEventListener("keydown", onKey)
  }, [n])

  const album = albums[focus]
  const here = state.mode === "audio" && state.albumIndex === focus
  const mins = Math.round(album.tracks.reduce((x, t) => x + t.duration, 0) / 60000)
  const video = album.videos[0]
  const videoHere = !!video && state.mode === "video" && state.videoIndex === video.index

  const onCardClick = (i: number) => {
    if (drag.current?.moved) return
    if (i !== focus) return go(i)
    if (!engine) return
    if (here) engine.toggle()
    else engine.play(i, 0)
  }
  // Pausing lives in the player bar only; while this album's video is on, the button just clears the page to watch.
  const onVideo = () => (videoHere ? cinema.setFocus(true) : video && cinema.watch(video.index))

  return (
    <section className="section" id="music">
      <div className="sec-head">
        <h2><span className="ch" data-t="Music">Music</span></h2>
        <div className="meta mono">0{n} releases · drag, swipe or ← →<br />streamed from SoundCloud</div>
      </div>

      <div
        className="flow"
        ref={flowRef}
        aria-roledescription="carousel"
        aria-label="Albums"
        onPointerDown={(e) => (drag.current = { x: e.clientX, moved: false })}
        onPointerUp={(e) => {
          const d = drag.current
          if (d && Math.abs(e.clientX - d.x) > 50) { d.moved = true; go(focus + (e.clientX < d.x ? 1 : -1)) }
        }}
      >
        {albums.map((a, i) => {
          const d = i - focus, ad = Math.abs(d)
          return (
            <div
              key={a.id}
              className={`card${d === 0 ? " focus" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={a.title}
              aria-hidden={d !== 0}
              onClick={() => onCardClick(i)}
              style={{
                transform: `translateX(${d * 62}%) translateZ(${-ad * 220}px) rotateY(${-Math.sign(d) * Math.min(ad, 1) * 48}deg)`,
                zIndex: 10 - ad,
                opacity: ad > 2 ? 0 : 1 - ad * 0.25,
                filter: ad ? `brightness(${1 - ad * 0.35}) blur(${ad}px)` : "none",
              }}
            >
              <img src={a.artwork || a.fallbackArt} alt={`${a.title} cover`} draggable={false} />
              {a.videos[0] && (
                <button className="chip mono" tabIndex={d === 0 ? 0 : -1} onClick={(e) => { e.stopPropagation(); cinema.watch(a.videos[0].index) }}>
                  ▶ {a.videos[0].kind}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="flow-nav">
        <button onClick={() => go(focus - 1)} aria-label="Previous album"><ChevronLeft /></button>
        <div className="dots" role="tablist" aria-label="Choose album">
          {albums.map((a, i) => (
            <button key={a.id} role="tab" aria-selected={i === focus} aria-label={a.title} onClick={() => go(i)} />
          ))}
        </div>
        <button onClick={() => go(focus + 1)} aria-label="Next album"><ChevronRight /></button>
      </div>

      <div className="panel reveal">
        <div className="panel-head">
          <div>
            <div className="meta mono">
              {String(focus + 1).padStart(2, "0")} / {String(n).padStart(2, "0")} · {album.ready ? `${album.tracks.length} tracks · ${mins} min` : "loading…"}
            </div>
            <h3>{album.title}</h3>
          </div>
          <div className="acts">
            <button className="btn-play" disabled={!engine} onClick={() => (here ? engine?.toggle() : engine?.play(focus, 0))}>
              <span className="disc">{here && state.playing ? <PauseIcon /> : <PlayIcon />}</span>
              {here && state.playing ? "Pause" : "Play album"}
            </button>
            {video && (
              <button className="btn-ghost mono" data-cinema-control onClick={onVideo}>
                {videoHere ? "● Now showing — hide page" : `▶ Watch ${video.kind.toLowerCase()}`}
              </button>
            )}
            <a className="btn-ghost mono" href={album.url} target="_blank" rel="noopener noreferrer">SoundCloud ↗</a>
          </div>
        </div>
        <ol className="tracks">
          {album.ready
            ? album.tracks.map((t, i) => {
                const on = here && state.trackIndex === i
                return (
                  <li key={i}>
                    <button className={`track${on ? " on" : ""}`} onClick={() => engine?.play(focus, i)} aria-label={`${on && state.playing ? "Pause" : "Play"} ${t.title}`}>
                      <span className="n mono">
                        {on && state.playing ? <span className="bars"><i /><i /><i /></span> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="t">{t.title}</span>
                      <span className="d mono">{formatTime(t.duration)}</span>
                      <span className="pp">{on && state.playing ? <PauseIcon /> : <PlayIcon />}</span>
                    </button>
                  </li>
                )
              })
            : Array.from({ length: 4 }, (_, i) => <li key={i} className="skeleton" />)}
        </ol>
      </div>
    </section>
  )
}
