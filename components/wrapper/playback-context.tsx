"use client"

import { createContext, useContext, useState } from "react"

type PlaybackContextValue = {
  activeId: string | null
  requestPlay: (id: string) => void
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null)

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <PlaybackContext.Provider value={{ activeId, requestPlay: setActiveId }}>
      {children}
    </PlaybackContext.Provider>
  )
}

// Site-wide: only one player (radio or any track/video) may be audible at
// once. Claiming playback here is what every player uses to pause everyone
// else — see the `isActive`/`activeId` checks in radio-player.tsx, sc-player.tsx,
// and yt-card.tsx.
export function usePlayback() {
  const ctx = useContext(PlaybackContext)
  if (!ctx) throw new Error("usePlayback must be used within a PlaybackProvider")
  return ctx
}
