"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import { SectionHeading } from "../ui/SectionHeading";

export function PreweddingHighlights() {
  const [active, setActive] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const pauseOnScroll = () => videoRef.current?.pause();
    window.addEventListener("scroll", pauseOnScroll, {
      passive: true,
      capture: true,
    });
    return () => window.removeEventListener("scroll", pauseOnScroll, true);
  }, []);

  return (
    <section id="highlights" className="highlights section reveal">
      <SectionHeading eyebrow="Before we say I do">
        Our prewedding highlights
      </SectionHeading>
      <p>A few moments of us, on the way to forever.</p>
      <div className="highlights-grid">
        {weddingConfig.highlights.map((clip, index) => (
          <figure className="highlight" key={clip.id}>
            <div className="highlight-media">
              {active === clip.id ? (
                <video
                  ref={videoRef}
                  src={clip.src}
                  poster={clip.poster}
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  aria-label={clip.title}
                  onPlay={() => {
                    document
                      .querySelectorAll("audio")
                      .forEach((audio) => audio.pause());
                  }}
                >
                  Your browser does not support video playback.
                  <a href={clip.src}>Open {clip.title}</a>
                </video>
              ) : (
                <button
                  className="highlight-play"
                  onClick={() => setActive(clip.id)}
                  aria-label={`Play prewedding highlight: ${clip.title}`}
                >
                  <Image
                    src={clip.poster}
                    alt=""
                    fill
                    unoptimized
                    loading="lazy"
                    sizes="(min-width: 900px) 33vw, 100vw"
                  />
                  <span className="highlight-play-icon" aria-hidden="true">
                    ▶
                  </span>
                  <span className="highlight-play-label">Watch film</span>
                </button>
              )}
            </div>
            <figcaption>
              <span className="eyebrow">0{index + 1} / Prewedding</span>
              <h3>{clip.title}</h3>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
