// Everything the site plays or links to. Albums stream from SoundCloud playlists;
// videos from YouTube. `album` on a video links it to the release it belongs to.

export type AlbumDef = {
  id: string
  title: string
  url: string
  /** Shown until SoundCloud's artwork has loaded. */
  fallbackArt: string
}

export type VideoDef = {
  id: string
  title: string
  sub: string
  kind: "Music video" | "Visualizer" | "Live"
  album?: string
}

// Only these three photos are approved for the site.
export const PHOTOS = {
  rgbSplit: "/photos/layz-rgb-split.webp",
  tealOrange: "/photos/layz-teal-orange.webp",
  bokehWide: "/photos/layz-bokeh-wide.webp",
} as const

export const ALBUMS: AlbumDef[] = [
  { id: "aluminium-foil", title: "Aluminium Foil", url: "https://soundcloud.com/dancewithlayz/sets/aluminium-foil", fallbackArt: PHOTOS.rgbSplit },
  { id: "volt", title: "Volt", url: "https://soundcloud.com/dancewithlayz/sets/volt", fallbackArt: PHOTOS.tealOrange },
  { id: "drop-it-down", title: "Drop It Down", url: "https://soundcloud.com/dancewithlayz/sets/drop-it-down", fallbackArt: PHOTOS.bokehWide },
  { id: "echo", title: "Echo", url: "https://soundcloud.com/dancewithlayz/sets/echo", fallbackArt: PHOTOS.rgbSplit },
]

export const VIDEOS: VideoDef[] = [
  { id: "y822gySolaE", title: "Drop It Down", sub: "Lay'z x m3gatron", kind: "Music video", album: "drop-it-down" },
  { id: "9vFko2vCiL8", title: "Can't Stop", sub: "Lay'z x m3gatron", kind: "Music video" },
  { id: "OWTMsEaQ3Q4", title: "Echo", sub: "me are Lay'z", kind: "Visualizer", album: "echo" },
  { id: "e3z_dRIuZWY", title: "Live Session I", sub: "17. Dezember 2024", kind: "Live" },
  { id: "PLdt5FzhY2k", title: "Live Session II", sub: "17. Dezember 2024", kind: "Live" },
  { id: "PJVZ26frif8", title: "Live Session III", sub: "17. Dezember 2024", kind: "Live" },
  { id: "2G7mNjxGLbc", title: "Live Session IV", sub: "17. Dezember 2024", kind: "Live" },
]

export const SOCIALS = [
  { name: "Spotify", url: "https://open.spotify.com/artist/5ei1vbjC4clbUxPECV7ZpM?si=8YIOzTkAS2C-L2MVyGk6qQ" },
  { name: "SoundCloud", url: "https://on.soundcloud.com/VnwC6AKmZtTmvXRp6" },
  { name: "YouTube", url: "https://www.youtube.com/@dancewithlayz" },
  { name: "Instagram", url: "https://www.instagram.com/dancewithlayz" },
  { name: "TikTok", url: "https://tiktok.com/@dancewithlayz" },
  { name: "Twitter", url: "https://twitter.com/dancewithlayz" },
  { name: "Nostr", url: "https://primal.net/p/npub1vnhewgt6ep6f6xrsqm3kyup0ntfmdya3lctn2awx5r40fv7gvn4s45fm79" },
]

export const BIO =
  "After countless nights buried in the studio chasing the perfect groove, Lay'z decided one thing " +
  "wasn't up for debate: this music was going to move people. Nothing less than that would do. " +
  "To bring every feeling to the surface, Lay'z teams up with singers on select tracks while staying " +
  "hands-on with every beat, bassline, and drop. The mission is simple — turn the world into a " +
  "little more of a dance floor, one House, Dance, and EDM record at a time."

export const ytThumb = (id: string, quality: "mqdefault" | "hqdefault" | "maxresdefault" = "hqdefault") =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`

export function formatTime(ms: number) {
  if (!isFinite(ms) || ms < 0) return "0:00"
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
