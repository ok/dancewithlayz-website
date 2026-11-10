import type { MetadataRoute } from "next"

// Lets phones "Add to home screen" with the chroma icon and the site's dark colours.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dance with Lay'z",
    short_name: "Lay'z",
    description: "Producer and DJ making House, Dance, and EDM.",
    start_url: "/",
    display: "standalone",
    background_color: "#07060b",
    theme_color: "#07060b",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
