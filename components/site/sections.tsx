/* eslint-disable @next/next/no-img-element -- decorative photo with an SVG hover filter */
import { Fragment } from "react"
import Link from "next/link"
import { BIO, PHOTOS, SOCIALS } from "@/lib/media/catalog"
import { ContactForm } from "@/components/wrapper/contact-form"

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="logo" href="/#top">LAY&apos;Z</Link>
      <nav className="mono" aria-label="Main">
        <a href="/#music" className="keep">Music</a>
        <a href="/#videos" className="keep">Watch</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </nav>
    </header>
  )
}

const MARQUEE = ["Aluminium Foil", "Volt", "Drop It Down", "Echo", "Dance with Lay'z"]

export function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => (
          <Fragment key={i}>
            <span>{t}</span>
            <i>✦</i>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export function AboutSection() {
  return (
    <section className="section" id="about">
      <div className="about">
        <div className="porthole reveal">
          <img src={PHOTOS.tealOrange} alt="Lay'z in teal and orange light" loading="lazy" />
        </div>
        <div className="reveal">
          <div className="eyebrow-line mono">About</div>
          <p>{BIO}</p>
        </div>
      </div>
    </section>
  )
}

export function ContactSection() {
  return (
    <section className="section" id="contact">
      <div className="contact">
        <div className="big reveal">Bookings,<br />collabs &amp;<br />love letters.</div>
        <div className="reveal contact-card"><ContactForm /></div>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="site-footer mono">
      <span>&copy; {new Date().getFullYear()} Dance with Lay&apos;z</span>
      <div className="socials">
        {SOCIALS.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
        ))}
      </div>
    </footer>
  )
}
