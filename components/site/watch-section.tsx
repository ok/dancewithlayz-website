"use client"
/* eslint-disable @next/next/no-img-element -- YouTube thumbnails, loaded lazily */

import { ytThumb } from "@/lib/media/catalog"
import { useCinema, useMedia } from "./media-provider"
import { PlayIcon } from "./icons"

/** Every video plays in cinema mode: as the backdrop of the whole site. */
export function WatchSection() {
  const { engine, state, videos } = useMedia()
  const cinema = useCinema()

  return (
    <section className="section" id="videos">
      <div className="sec-head">
        <h2><span className="ch" data-t="Watch">Watch</span></h2>
        <div className="meta mono">Cinema mode<br />videos play behind the site</div>
      </div>
      <p className="watch-note reveal">
        Pick a video and the whole site becomes the screen: it plays behind everything while the player bar stays in control.
        Hide the page to just watch.
      </p>
      <div className="reel">
        {videos.map((v) => {
          const on = state.mode === "video" && state.videoIndex === v.index
          return (
            <button
              key={v.id}
              className={`reveal${on ? " on" : ""}`}
              aria-label={`Watch ${v.title}`}
              onClick={() => (on ? engine?.toggle() : cinema.watch(v.index))}
            >
              <span className="th">
                <img loading="lazy" src={ytThumb(v.id)} alt="" />
                <span className="pl"><i><PlayIcon /></i></span>
              </span>
              <span className="info">
                <span className="k mono">{v.kind}</span>
                <span className="t">{v.title}</span>
                <span className="s mono">{v.sub}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
