"use client"

import { useEffect } from "react"

/**
 * Site-wide visual layers: the RGB-split SVG filters (`#chroma` is animated by
 * the hero, `#chroma-static` is used on hover), film grain and scanlines, plus
 * the scroll-reveal observer for every `.reveal` element.
 */
export function Effects() {
  useEffect(() => {
    // Marks revealed elements with a data attribute rather than a class: React rewrites
    // `className` whenever a component re-renders (e.g. a video card turning "on"), which
    // would wipe a class added here and make the element fade out again.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.setAttribute("data-in", "")
        io.unobserve(e.target)
      }),
      { threshold: 0.15 },
    )
    const observe = () => document.querySelectorAll(".reveal:not([data-in])").forEach((el) => io.observe(el))
    observe()
    // Sections render client-side content after mount (tracklists, video reel).
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { io.disconnect(); mo.disconnect() }
  }, [])

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id="chroma" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset id="chR" in="r" dx="-4" dy="0" result="ro" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feOffset in="g" dx="0" dy="0" result="go" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset id="chB" in="b" dx="4" dy="0" result="bo" />
            <feBlend in="ro" in2="go" mode="screen" result="rg" />
            <feBlend in="rg" in2="bo" mode="screen" />
          </filter>
          {/* Slow liquid wobble for the hero's mirrored "reflection"; the hero pushes the
              displacement scale up on each kick. */}
          <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.02" numOctaves="2" seed="7" result="noise">
              <animate attributeName="baseFrequency" dur="22s" values="0.006 0.02;0.011 0.034;0.006 0.02" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap id="liquidMap" in="SourceGraphic" in2="noise" scale="38" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Much gentler version for the main hero photo. */}
          <filter id="liquid-soft" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves="2" seed="3" result="noise">
              <animate attributeName="baseFrequency" dur="28s" values="0.004 0.012;0.007 0.02;0.004 0.012" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap id="liquidSoftMap" in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="chroma-static" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx="-9" dy="2" result="ro" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx="9" dy="-2" result="bo" />
            <feBlend in="ro" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="bo" mode="screen" />
          </filter>
        </defs>
      </svg>
      <div className="grain" aria-hidden="true" />
      <div className="scan" aria-hidden="true" />
    </>
  )
}
