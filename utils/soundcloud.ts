let apiPromise: Promise<void> | null = null

// Loads the SoundCloud Widget JS API once and shares the promise across
// every player instance on the page, so we only ever inject the script tag once.
export function loadSoundCloudWidgetApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve()
  if ((window as any).SC?.Widget) return Promise.resolve()
  if (apiPromise) return apiPromise

  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = reject
    document.body.appendChild(script)
  })

  return apiPromise
}

export function soundcloudEmbedUrl(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "false",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  })
  return `https://w.soundcloud.com/player/?${params.toString()}`
}

export function formatTime(ms: number) {
  if (!isFinite(ms) || ms < 0) return "0:00"
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}
