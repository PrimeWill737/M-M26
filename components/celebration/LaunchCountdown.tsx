"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ALBUM_LAUNCH } from "@/config/experience";
import { weddingConfig as c } from "@/config/wedding";
import { ScheduledRefresh } from "@/components/invitation/ScheduledRefresh";

export function LaunchCountdown({ serverNow }: { serverNow: number }) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Date.parse(ALBUM_LAUNCH) - serverNow),
  );
  useEffect(() => {
    const start = performance.now();
    const tick = () =>
      setRemaining(
        Math.max(
          0,
          Date.parse(ALBUM_LAUNCH) - serverNow - (performance.now() - start),
        ),
      );
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [serverNow]);
  const seconds = Math.ceil(remaining / 1000);
  const units = [
    Math.floor(seconds / 86400),
    Math.floor(seconds / 3600) % 24,
    Math.floor(seconds / 60) % 60,
    seconds % 60,
  ];
  return (
    <main className="celebration launch-gate">
      <ScheduledRefresh serverNow={serverNow} />
      <Image
        src="/images/couple/portrait-4.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="launch-backdrop"
      />
      <div className="launch-orbit launch-orbit--one" aria-hidden="true" />
      <div className="launch-orbit launch-orbit--two" aria-hidden="true" />
      <nav className="launch-nav" aria-label="Invitation navigation">
        <span className="album-monogram">{c.brand.monogram}</span>
        <a href="/">Back to the invitation</a>
      </nav>
      <section className="launch-card" aria-labelledby="launch-title">
        <span className="album-kicker">SOMETHING BEAUTIFUL IS ALMOST HERE</span>
        <h1 id="launch-title">
          Our next chapter.
          <br />
          <em>Your front-row seat.</em>
        </h1>
        <p>
          The forever album opens with the celebration.
          <br />
          Your photos, your videos, our memories, all in one place.
        </p>
        <div
          className="launch-clock"
          role="timer"
          aria-label="Time until the forever album opens"
        >
          {units.map((value, index) => (
            <div className="launch-digit" key={index}>
              <strong>{String(value).padStart(2, "0")}</strong>
              <span>{["Days", "Hours", "Minutes", "Seconds"][index]}</span>
            </div>
          ))}
        </div>
        <p className="launch-date">
          18 December 2026 <span>·</span> 1:30 pm WAT
        </p>
        <p className="launch-hint" role="status">
          {remaining > 0
            ? "Stay a little. The doors will open automatically."
            : "Opening our forever album…"}
        </p>
        <a className="album-button" href="/">
          Revisit our invitation
        </a>
      </section>
      <footer className="launch-credit">
        Made with love ·{" "}
        <a href={c.links.developer} target="_blank" rel="noopener noreferrer">
          Developer William
        </a>
      </footer>
    </main>
  );
}
