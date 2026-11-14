"use client";

import { useEffect, useRef } from "react";
import { weddingConfig } from "@/config/wedding";
import { SectionHeading } from "../ui/SectionHeading";

export function PreweddingHighlights() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const videos = sectionRef.current?.querySelectorAll("video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const video = entry.target as HTMLVideoElement;
          video.src = video.dataset.src!;
          video.poster = video.dataset.poster!;
          observer.unobserve(video);
        });
      },
      { rootMargin: "200px" },
    );
    videos?.forEach((video) => observer.observe(video));
    const pauseOnScroll = () => videos?.forEach((video) => video.pause());
    window.addEventListener("scroll", pauseOnScroll, {
      passive: true,
      capture: true,
    });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pauseOnScroll, true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="highlights"
      className="highlights section reveal"
    >
      <SectionHeading eyebrow="Before we say I do">
        Our prewedding highlights
      </SectionHeading>
      <p>A few moments of us, on the way to forever.</p>
      <div className="highlights-grid">
        {weddingConfig.highlights.map((clip, index) => (
          <figure className="highlight" key={clip.id}>
            <div className="highlight-media">
              <video
                data-src={clip.src}
                data-poster={clip.poster}
                controls
                playsInline
                preload="none"
                aria-label={clip.title}
                onPlay={(event) => {
                  const playingVideo = event.currentTarget;
                  sectionRef.current
                    ?.querySelectorAll("video")
                    .forEach((video) => {
                      if (video !== playingVideo) video.pause();
                    });
                  document
                    .querySelectorAll("audio")
                    .forEach((audio) => audio.pause());
                }}
              >
                Your browser does not support video playback.
                <a href={clip.src}>Open {clip.title}</a>
              </video>
            </div>
            <figcaption>
              <span className="eyebrow">0{index + 1} / Prewedding</span>
              <h3>{clip.title}</h3>
              <a
                className="highlight-download"
                href={clip.src}
                download={`${clip.id}.mp4`}
                aria-label={`Download ${clip.title}`}
              >
                Download video
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
