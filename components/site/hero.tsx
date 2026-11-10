"use client"
/* eslint-disable @next/next/no-img-element -- the hero photo needs the live SVG chroma filter, which next/image's wrapper gets in the way of */

import { useEffect, useRef } from "react"
import { PHOTOS } from "@/lib/media/catalog"
import { useMedia, prefersReducedMotion } from "./media-provider"
import { PauseIcon, PlayIcon } from "./icons"

const HUES: [number, number, number][] = [[255, 46, 99], [8, 247, 254], [255, 230, 0], [61, 255, 143], [255, 122, 47], [140, 110, 255]]

export function Hero() {
  const { engine, state, current } = useMedia()
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const slicesRef = useRef<HTMLDivElement[]>([])

  // Beat-reactive chroma split, glitch slices on kicks, and the neon light sculpture:
  // big V-shaped beams like the festival installation behind Lay'z. Each frame fades the
  // canvas towards transparent instead of clearing it, so beams leave light trails.
  useEffect(() => {
    if (!engine || prefersReducedMotion()) return
    const hero = heroRef.current!, cv = canvasRef.current!, ctx = cv.getContext("2d")!
    const R = document.getElementById("chR"), B = document.getElementById("chB")
    const liquid = document.getElementById("liquidMap")
    const liquidSoft = document.getElementById("liquidSoftMap")
    const beams = Array.from({ length: 8 }, (_, i) => ({ seed: i * 1.7, hue: HUES[i % HUES.length], width: 1.6 + (i % 3) * 2 }))
    let W = 0, H = 0, mx = 0.5, my = 0.5, lastKick = 0, visible = true, raf = 0

    const size = () => {
      const dpr = Math.min(devicePixelRatio, 1.5)
      W = cv.clientWidth; H = cv.clientHeight
      cv.width = W * dpr; cv.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const onMove = (e: PointerEvent) => { mx = e.clientX / innerWidth; my = e.clientY / innerHeight }
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting))
    size(); io.observe(hero)
    addEventListener("resize", size)
    addEventListener("pointermove", onMove)

    const beamPath = (seed: number, t: number) => {
      const ax = W * (0.62 + 0.3 * Math.sin(t * 0.00011 + seed) + (mx - 0.5) * 0.12)
      const ay = H * (0.55 + 0.3 * Math.cos(t * 0.00009 + seed * 1.3) + (my - 0.5) * 0.08)
      const spread = W * (0.45 + 0.25 * Math.sin(t * 0.00013 + seed * 2))
      const up = (seed % 2 > 1 ? -1 : 1) * H * 1.1
      return [[ax - spread, ay - up], [ax, ay], [ax + spread, ay - up]] as const
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      const e = engine.energy(t)
      const off = 3 + e * 16 + Math.abs(mx - 0.5) * 10
      R?.setAttribute("dx", (-off + (mx - 0.5) * 6).toFixed(1)); R?.setAttribute("dy", ((my - 0.5) * 4).toFixed(1))
      B?.setAttribute("dx", (off + (mx - 0.5) * 6).toFixed(1)); B?.setAttribute("dy", (-(my - 0.5) * 4).toFixed(1))
      liquid?.setAttribute("scale", (38 + e * 70).toFixed(0))
      liquidSoft?.setAttribute("scale", (7 + e * 10).toFixed(1))

      const slices = slicesRef.current
      if (e > 0.8 && t - lastKick > 380) {
        lastKick = t
        slices.forEach((s) => {
          const top = Math.random() * 90, h = 2 + Math.random() * 9
          s.style.clipPath = `inset(${top}% 0 ${100 - top - h}% 0)`
          s.style.transform = `translateX(${(Math.random() - 0.5) * 80}px)`
          s.style.opacity = "0.9"
        })
      } else if (t - lastKick > 90) slices.forEach((s) => (s.style.opacity = "0"))

      ctx.globalCompositeOperation = "destination-out"
      ctx.fillStyle = `rgba(0, 0, 0, ${0.17 - e * 0.06})`
      ctx.fillRect(0, 0, W, H)
      ctx.globalCompositeOperation = "lighter"
      ctx.lineJoin = "round"; ctx.lineCap = "round"
      for (const b of beams) {
        const pts = beamPath(b.seed, t), [r, g, bl] = b.hue
        const grad = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[2][0], pts[2][1])
        grad.addColorStop(0, `rgba(${r},${g},${bl},0)`)
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},${0.45 + e * 0.5})`)
        grad.addColorStop(1, `rgba(${bl},${r},${g},0)`)
        for (const [wMul, a] of [[6, 0.07], [2.4, 0.2], [1, 0.9]]) {
          ctx.globalAlpha = a; ctx.strokeStyle = grad; ctx.lineWidth = b.width * wMul * (1 + e * 0.8)
          ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.stroke()
        }
      }
      ctx.globalAlpha = 1
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf); io.disconnect()
      removeEventListener("resize", size); removeEventListener("pointermove", onMove)
    }
  }, [engine])

  // The hero button is for music only: during a video it offers to switch back to the
  // music instead of becoming a second pause button (that one lives in the player bar).
  const isVideo = current?.kind === "video"
  const audioPlaying = !isVideo && state.playing
  const onPlay = () => {
    if (!engine) return
    if (state.mode === "video") return engine.play(state.albumIndex ?? 0, state.albumIndex === null ? 0 : state.trackIndex)
    if (current) engine.toggle()
    else engine.play(0, 0)
  }

  return (
    <section className="hero" ref={heroRef} id="top">
      <div className="hero-photo">
        {/* Mirrored, upside-down "reflection" that fills the left side and melts into the photo. */}
        <div className="hero-mirror" aria-hidden="true">
          <img src={PHOTOS.rgbSplit} alt="" />
        </div>
        <img className="hero-main" src={PHOTOS.rgbSplit} alt="Lay'z, lit by festival lights in red, green and blue" fetchPriority="high" />
      </div>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="slice"
          aria-hidden="true"
          ref={(el) => { if (el) slicesRef.current[i] = el }}
          style={{ ["--img" as string]: `url(${PHOTOS.rgbSplit})` }}
        />
      ))}
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="hero-copy">
        <div className="eyebrow-line mono">House · Dance · EDM</div>
        <h1 className="hero-title" aria-label="Lay'z">
          <span>L</span><span>A</span><span>Y</span><span>&apos;Z</span>
        </h1>
        <p className="hero-tag">Turning the world into a little more of a <em>dance floor</em>, one record at a time.</p>
        <div className="cta">
          <button className="btn-play" onClick={onPlay} disabled={!engine}>
            <span className="disc">{audioPlaying ? <PauseIcon /> : <PlayIcon />}</span>
            <span>{isVideo ? "Back to the music" : audioPlaying ? "Pause" : current ? "Resume" : "Play Aluminium Foil"}</span>
          </button>
          <a className="btn-ghost mono" href="#music">All releases</a>
        </div>
      </div>
      <div className="scroll-cue mono" aria-hidden="true">SCROLL ↓</div>
    </section>
  )
}
