// One "now playing" for the whole site, whether it's a SoundCloud track or a
// YouTube video.
//  - Audio: SoundCloud playlists through hidden Widget-API iframes.
//  - Video: the YouTube IFrame API with YouTube's own controls switched off,
//    mounted into whichever element the page provides (the cinema backdrop).
// UI components subscribe to immutable snapshots (see media-provider.tsx).
//
// Browser-only: create it from an effect, never during server rendering.

import { ALBUMS, VIDEOS, ytThumb, type AlbumDef, type VideoDef } from "./catalog"

// Note: the SoundCloud and YouTube APIs ship without types, so their objects are `any` here.

export type Track = { title: string; artwork: string | null; duration: number }
export type Video = VideoDef & { index: number; albumIndex: number }
export type Album = AlbumDef & { tracks: Track[]; artwork: string | null; ready: boolean; videos: Video[] }

export type MediaState = {
  mode: "audio" | "video"
  albumIndex: number | null
  trackIndex: number
  videoIndex: number | null
  playing: boolean
  loading: boolean
  position: number // ms
  duration: number // ms
  volume: number // 0..100
}

export type Current =
  | { kind: "audio"; title: string; sub: string; art: string; album: Album; track: Track | undefined }
  | { kind: "video"; title: string; sub: string; art: string; video: Video }
  | null

export type Snapshot = { state: MediaState; albums: Album[]; videos: Video[]; current: Current }

const INITIAL_STATE: MediaState = {
  mode: "audio", albumIndex: null, trackIndex: 0, videoIndex: null,
  playing: false, loading: false, position: 0, duration: 0, volume: 80,
}

function buildCatalog() {
  const albums: Album[] = ALBUMS.map((a) => ({ ...a, tracks: [], artwork: null, ready: false, videos: [] }))
  const videos: Video[] = VIDEOS.map((v, index) => ({ ...v, index, albumIndex: albums.findIndex((a) => a.id === v.album) }))
  albums.forEach((a, i) => (a.videos = videos.filter((v) => v.albumIndex === i)))
  return { albums, videos }
}

function currentOf(state: MediaState, albums: Album[], videos: Video[]): Current {
  if (state.mode === "video" && state.videoIndex !== null) {
    const v = videos[state.videoIndex]
    return { kind: "video", title: v.title, sub: `${v.kind} — ${v.sub}`, art: ytThumb(v.id, "mqdefault"), video: v }
  }
  if (state.albumIndex === null) return null
  const album = albums[state.albumIndex]
  const track = album.tracks[state.trackIndex]
  return { kind: "audio", title: track?.title || album.title, sub: `Lay'z — ${album.title}`, art: track?.artwork || album.artwork || album.fallbackArt, album, track }
}

/** What the server (and the first client render) sees before the engine exists. */
export const SERVER_SNAPSHOT: Snapshot = (() => {
  const { albums, videos } = buildCatalog()
  return { state: INITIAL_STATE, albums, videos, current: null }
})()

const scripts: Record<string, Promise<void>> = {}
function loadScript(src: string, isReady: () => boolean): Promise<void> {
  if (!scripts[src]) {
    scripts[src] = new Promise((resolve, reject) => {
      if (isReady()) return resolve()
      const s = document.createElement("script")
      s.src = src
      s.async = true
      s.onerror = reject
      if (src.includes("youtube")) {
        const w = window as any
        const prev = w.onYouTubeIframeAPIReady
        w.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
      } else s.onload = () => resolve()
      document.head.appendChild(s)
    })
  }
  return scripts[src]
}

function embedUrl(url: string) {
  const p = new URLSearchParams({
    url, auto_play: "false", hide_related: "true", show_comments: "false",
    show_user: "false", show_reposts: "false", show_teaser: "false", visual: "false",
  })
  return `https://w.soundcloud.com/player/?${p}`
}

function readVolume() {
  try {
    const raw = localStorage.getItem("layz-volume")
    const v = Number(raw)
    return raw !== null && Number.isFinite(v) ? v : 80
  } catch {
    return 80
  }
}

export type MediaEngine = ReturnType<typeof createMediaEngine>

export function createMediaEngine() {
  const listeners = new Set<() => void>()
  const { albums, videos } = buildCatalog()
  const widgets: any[] = []
  const state: MediaState = { ...INITIAL_STATE, volume: readVolume() }
  let snapshot: Snapshot = SERVER_SNAPSHOT
  let destroyed = false

  const emit = () => {
    if (destroyed) return
    const albumsCopy = albums.map((a) => ({ ...a }))
    const s = { ...state }
    snapshot = { state: s, albums: albumsCopy, videos, current: currentOf(s, albumsCopy, videos) }
    listeners.forEach((fn) => fn())
  }
  const set = (patch: Partial<MediaState>) => { Object.assign(state, patch); emit() }

  /* ---------------- audio (SoundCloud) ---------------- */
  const host = document.createElement("div")
  host.setAttribute("aria-hidden", "true")
  host.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;left:-9999px"
  document.body.appendChild(host)

  const pauseAudio = () => widgets.forEach((w) => w?.pause())

  loadScript("https://w.soundcloud.com/player/api.js", () => !!(window as any).SC?.Widget).then(() => {
    if (destroyed) return
    const SC = (window as any).SC
    albums.forEach((album, ai) => {
      const iframe = document.createElement("iframe")
      iframe.allow = "autoplay"
      iframe.src = embedUrl(album.url)
      iframe.title = `${album.title} (SoundCloud)`
      host.appendChild(iframe)
      const w = SC.Widget(iframe)
      widgets[ai] = w

      const readSounds = (attempt = 0) =>
        w.getSounds((raw: any[]) => {
          const list = (raw || []).map((s) => ({
            title: s?.title || null,
            artwork: s?.artwork_url ? String(s.artwork_url).replace("-large", "-t500x500") : null,
            duration: s?.duration || 0,
          }))
          // SoundCloud fills in metadata past the first few tracks lazily.
          if (list.some((t) => !t.title) && attempt < 6) setTimeout(() => readSounds(attempt + 1), 900)
          album.tracks = list.map((t, i) => ({ ...t, title: t.title || `Track ${i + 1}` }))
          album.artwork = album.tracks.find((t) => t.artwork)?.artwork || null
          album.ready = true
          emit()
        })

      const isActive = () => state.mode === "audio" && state.albumIndex === ai
      w.bind(SC.Widget.Events.READY, () => { w.setVolume(state.volume); readSounds() })
      w.bind(SC.Widget.Events.PLAY, () => {
        if (state.mode === "video") pauseVideo()
        widgets.forEach((other, j) => j !== ai && other?.pause())
        // The widget resets to full volume when playback starts — re-apply.
        w.setVolume(state.volume)
        w.getCurrentSoundIndex((i: number) => set({ mode: "audio", albumIndex: ai, trackIndex: i, playing: true, loading: false }))
        w.getDuration((d: number) => set({ duration: d }))
      })
      w.bind(SC.Widget.Events.PAUSE, () => isActive() && set({ playing: false }))
      w.bind(SC.Widget.Events.FINISH, () => {
        if (!isActive()) return
        w.getCurrentSoundIndex((i: number) => { if (i >= album.tracks.length - 1) set({ playing: false }) })
      })
      w.bind(SC.Widget.Events.PLAY_PROGRESS, (e: { currentPosition: number }) => {
        if (!isActive()) return
        state.position = e.currentPosition
        w.getDuration((d: number) => { state.duration = d; emit() })
      })
    })
  })

  /* ---------------- video (YouTube) ---------------- */
  let yt: any = null
  let ytMount: HTMLElement | null = null
  let ytReady = false
  let pollTimer: ReturnType<typeof setInterval> | undefined

  function pauseVideo() { try { yt?.pauseVideo() } catch {} }
  function poll() {
    clearInterval(pollTimer)
    pollTimer = setInterval(() => {
      if (!yt || !ytReady || state.mode !== "video") return
      state.position = (yt.getCurrentTime() || 0) * 1000
      state.duration = (yt.getDuration() || 0) * 1000
      emit()
    }, 250)
  }

  async function playVideo(vi: number, container: HTMLElement) {
    const v = videos[vi]
    if (!v || !container) return
    pauseAudio()
    if (state.mode === "video" && state.videoIndex === vi && ytMount === container && yt) {
      return state.playing ? yt.pauseVideo() : yt.playVideo()
    }
    set({ mode: "video", videoIndex: vi, playing: false, loading: true, position: 0, duration: 0 })
    await loadScript("https://www.youtube.com/iframe_api", () => !!(window as any).YT?.Player)
    if (destroyed) return
    if (!document.body.contains(container)) return set({ mode: "audio", videoIndex: null, loading: false })
    if (state.videoIndex !== vi) return // superseded by a newer request
    if (yt && ytMount === container && ytReady) return yt.loadVideoById(v.id)
    try { yt?.destroy() } catch {}
    ytReady = false
    ytMount = container
    container.innerHTML = ""
    const el = document.createElement("div")
    container.appendChild(el)
    const YT = (window as any).YT
    yt = new YT.Player(el, {
      videoId: v.id, width: "100%", height: "100%",
      host: "https://www.youtube-nocookie.com",
      playerVars: { autoplay: 1, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3, disablekb: 1, fs: 0 },
      events: {
        onReady: () => { ytReady = true; yt.setVolume(state.volume); yt.playVideo(); poll() },
        onStateChange: (e: { data: number }) => {
          const S = YT.PlayerState
          if (e.data === S.PLAYING) { pauseAudio(); set({ mode: "video", playing: true, loading: false }) }
          else if (e.data === S.BUFFERING) set({ loading: true })
          else if (e.data === S.PAUSED) set({ playing: false, loading: false })
          else if (e.data === S.ENDED) set({ playing: false, loading: false, position: state.duration })
        },
      },
    })
  }

  function closeVideo() {
    pauseVideo()
    try { yt?.destroy() } catch {}
    yt = null
    ytReady = false
    if (ytMount) ytMount.innerHTML = ""
    ytMount = null
    clearInterval(pollTimer)
    set({ mode: "audio", videoIndex: null, playing: false, loading: false, position: 0, duration: 0 })
  }

  /* ---------------- controls ---------------- */
  /** Play track `ti` of album `ai`; toggles if it's already the current track. */
  function play(ai: number, ti = 0): void {
    const w = widgets[ai]
    if (!w) return
    if (state.mode === "audio" && state.albumIndex === ai && state.trackIndex === ti) return toggle()
    if (state.mode === "video") pauseVideo()
    widgets.forEach((other, j) => j !== ai && other?.pause())
    set({ mode: "audio", albumIndex: ai, trackIndex: ti, position: 0, loading: true, playing: false })
    w.skip(ti)
    w.seekTo(0)
    w.play()
    // The widget can resume a skipped-to track where it left off; force the start once it has loaded.
    setTimeout(() => w.seekTo(0), 350)
  }
  function toggle(): void {
    if (state.mode === "video" && yt) return state.playing ? yt.pauseVideo() : yt.playVideo()
    if (state.albumIndex === null) return play(0, 0)
    const w = widgets[state.albumIndex]
    if (state.playing) w?.pause()
    else w?.play()
  }
  function next() {
    if (state.mode === "video") {
      if (ytMount && state.videoIndex !== null) playVideo((state.videoIndex + 1) % videos.length, ytMount)
      return
    }
    if (state.albumIndex === null) return play(0, 0)
    const a = albums[state.albumIndex]
    if (state.trackIndex < a.tracks.length - 1) play(state.albumIndex, state.trackIndex + 1)
    else play((state.albumIndex + 1) % albums.length, 0)
  }
  function prev() {
    if (state.position > 3000) return seek(0)
    if (state.mode === "video") {
      if (ytMount && state.videoIndex !== null) playVideo((state.videoIndex - 1 + videos.length) % videos.length, ytMount)
      return
    }
    if (state.albumIndex === null) return
    if (state.trackIndex > 0) play(state.albumIndex, state.trackIndex - 1)
    else seek(0)
  }
  function seek(frac: number) {
    if (!state.duration) return
    if (state.mode === "video" && yt) {
      yt.seekTo((frac * state.duration) / 1000, true)
      yt.playVideo()
    } else if (state.albumIndex !== null) {
      const w = widgets[state.albumIndex]
      w?.seekTo(frac * state.duration)
      if (!state.playing) w?.play()
    } else return
    state.position = frac * state.duration
    emit()
  }
  function setVolume(v: number) {
    state.volume = Math.max(0, Math.min(100, v))
    try { localStorage.setItem("layz-volume", String(state.volume)) } catch {}
    widgets.forEach((w) => w?.setVolume(state.volume))
    try { yt?.setVolume(state.volume) } catch {}
    emit()
  }

  /**
   * Pseudo audio energy (0..1) for visuals. Neither iframe exposes audio data,
   * so this is a 124 BPM four-on-the-floor envelope locked to the playback
   * position — close enough to feel like the page is dancing.
   */
  let lastTick = performance.now()
  let lastPos = -1
  listeners.add(() => { if (state.position !== lastPos) { lastPos = state.position; lastTick = performance.now() } })
  function energy(now = performance.now()) {
    if (!state.playing) return 0
    const beat = 60000 / 124
    const t = ((state.position + (now - lastTick)) % beat) / beat
    const kick = Math.exp(-t * 6)
    const hat = 0.25 * Math.exp(-(((t + 0.5) % 1) * 10))
    return Math.min(1, kick * 0.85 + hat + 0.08 * Math.random())
  }

  // Keyboard: space toggles, shift+arrows skip — unless focus is on a control or field.
  const onKey = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement | null
    if (target?.closest?.("input, textarea, select, button, a, [contenteditable], [role=button]")) return
    if (e.code === "Space") { e.preventDefault(); toggle() }
    if (e.code === "ArrowRight" && e.shiftKey) next()
    if (e.code === "ArrowLeft" && e.shiftKey) prev()
  }
  window.addEventListener("keydown", onKey)

  // Lock-screen / hardware media keys.
  let lastMeta = ""
  if ("mediaSession" in navigator) {
    const ms = navigator.mediaSession
    listeners.add(() => {
      const cur = snapshot.current
      if (!cur) return
      const key = `${cur.kind}:${cur.title}`
      if (key === lastMeta) return
      lastMeta = key
      ms.metadata = new MediaMetadata({ title: cur.title, artist: "Lay'z", album: cur.kind === "audio" ? cur.album.title : "", artwork: [{ src: cur.art }] })
    })
    ms.setActionHandler("play", toggle)
    ms.setActionHandler("pause", toggle)
    ms.setActionHandler("nexttrack", next)
    ms.setActionHandler("previoustrack", prev)
  }

  emit()

  return {
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn) } },
    getSnapshot: () => snapshot,
    play, toggle, next, prev, seek, setVolume, playVideo, closeVideo, energy,
    destroy() {
      destroyed = true
      window.removeEventListener("keydown", onKey)
      clearInterval(pollTimer)
      try { yt?.destroy() } catch {}
      host.remove()
      if ("mediaSession" in navigator) {
        for (const a of ["play", "pause", "nexttrack", "previoustrack"] as const) navigator.mediaSession.setActionHandler(a, null)
      }
      listeners.clear()
    },
  }
}
