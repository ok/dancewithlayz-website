"use client"

import { createContext, useContext, useEffect, useState } from "react"

type VolumeContextValue = {
  volume: number
  setVolume: (v: number) => void
}

const VolumeContext = createContext<VolumeContextValue | null>(null)

const STORAGE_KEY = "dwl-volume"
const DEFAULT_VOLUME = 67

export function VolumeProvider({ children }: { children: React.ReactNode }) {
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== null) setVolumeState(Number(stored))
  }, [])

  const setVolume = (v: number) => {
    setVolumeState(v)
    window.localStorage.setItem(STORAGE_KEY, String(v))
  }

  return <VolumeContext.Provider value={{ volume, setVolume }}>{children}</VolumeContext.Provider>
}

// One slider anywhere on the page controls every player at once.
export function useGlobalVolume() {
  const ctx = useContext(VolumeContext)
  if (!ctx) throw new Error("useGlobalVolume must be used within a VolumeProvider")
  return ctx
}
