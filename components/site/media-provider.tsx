"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react"
import { createMediaEngine, SERVER_SNAPSHOT, type MediaEngine, type Snapshot } from "@/lib/media/engine"

type Cinema = {
  /** True while a video plays as the page backdrop. */
  active: boolean
  /** True when the page content is hidden so only the video shows. */
  focus: boolean
  watch: (videoIndex: number) => void
  exit: () => void
  setFocus: (on: boolean) => void
  /** The cinema backdrop registers the element the YouTube player mounts into. */
  mountRef: React.MutableRefObject<HTMLDivElement | null>
}

type MediaContextValue = { engine: MediaEngine | null; cinema: Cinema }
const MediaContext = createContext<MediaContextValue | null>(null)

const noopSubscribe = () => () => {}

const AUTO_HIDE_MS = 4000
const WAKE_EVENTS = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"] as const

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function MediaProvider({ children }: { children: ReactNode }) {
  const [engine, setEngine] = useState<MediaEngine | null>(null)
  const [active, setActive] = useState(false)
  const [focus, setFocus] = useState(false)
  const mountRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const e = createMediaEngine()
    setEngine(e)
    return () => e.destroy()
  }, [])

  // Beat energy as a CSS variable (--e) that the whole design reacts to.
  useEffect(() => {
    if (!engine || prefersReducedMotion()) return
    let raf = 0
    const loop = (t: number) => {
      document.documentElement.style.setProperty("--e", engine.energy(t).toFixed(3))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [engine])

  const exit = useCallback(() => {
    setFocus(false)
    setActive(false)
    engine?.closeVideo()
  }, [engine])

  const watch = useCallback(
    (vi: number) => {
      if (!engine || !mountRef.current) return
      setActive(true)
      engine.playVideo(vi, mountRef.current)
    },
    [engine],
  )

  // Leave cinema as soon as something other than a video takes over playback.
  const [videoPlaying, setVideoPlaying] = useState(false)
  useEffect(() => {
    if (!engine) return
    return engine.subscribe(() => {
      const s = engine.getSnapshot().state
      if (s.mode !== "video") { setActive(false); setFocus(false) }
      setVideoPlaying(s.mode === "video" && s.playing)
    })
  }, [engine])

  // While a video plays, the page fades away after a few quiet seconds so only the video
  // shows; any scroll, click, tap or key brings it back (and restarts the countdown).
  // When the video is paused the page stays visible.
  useEffect(() => {
    if (!active) return
    if (!videoPlaying) setFocus(false)
    let timer: ReturnType<typeof setTimeout> | undefined
    const arm = () => {
      clearTimeout(timer)
      if (videoPlaying) timer = setTimeout(() => setFocus(true), AUTO_HIDE_MS)
    }
    const wake = (e: Event) => {
      // The hide/show-page buttons manage focus themselves; just restart the countdown.
      if ((e.target as Element | null)?.closest?.("[data-cinema-control]")) return arm()
      setFocus(false)
      arm()
    }
    const opts = { passive: true, capture: true }
    WAKE_EVENTS.forEach((ev) => addEventListener(ev, wake, opts))
    arm()
    return () => {
      clearTimeout(timer)
      WAKE_EVENTS.forEach((ev) => removeEventListener(ev, wake, opts))
    }
  }, [active, videoPlaying])

  useEffect(() => {
    document.body.classList.toggle("cinema", active)
    document.body.classList.toggle("focus-video", active && focus)
  }, [active, focus])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && exit()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active, exit])

  const value = useMemo<MediaContextValue>(
    () => ({ engine, cinema: { active, focus, watch, exit, setFocus, mountRef } }),
    [engine, active, focus, watch, exit],
  )
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>
}

function useMediaContext() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error("useMedia must be used inside <MediaProvider>")
  return ctx
}

/** Current playback snapshot plus the engine controls (null until mounted in the browser). */
export function useMedia(): Snapshot & { engine: MediaEngine | null } {
  const { engine } = useMediaContext()
  const snapshot = useSyncExternalStore(
    engine ? engine.subscribe : noopSubscribe,
    () => (engine ? engine.getSnapshot() : SERVER_SNAPSHOT),
    () => SERVER_SNAPSHOT,
  )
  return { ...snapshot, engine }
}

export function useCinema() {
  return useMediaContext().cinema
}
