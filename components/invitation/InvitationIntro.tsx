"use client";
import { useEffect, useRef, useState } from "react";
import { weddingConfig as c } from "@/config/wedding";
import { dateStamp } from "@/utils/calendar";
import { Botanical } from "../ui/Botanical";
import { lockPageScroll } from "@/utils/scrollLock";
export function InvitationIntro({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const unlock = lockPageScroll();
    return () => {
      unlock();
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function open() {
    setOpening(true);
    timer.current = setTimeout(
      onOpen,
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900,
    );
  }
  return (
    <div
      className={`intro ${opening ? "intro--opening" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Your wedding invitation"
    >
      <div className="paper-panel paper-panel--left" />
      <div className="paper-panel paper-panel--right" />
      <div className="intro-frame">
        <Botanical className="intro-botanical" />
        <span className="eyebrow intro-kicker">
          Together with their families
        </span>
        <div className="intro-families">
          <span>Family of</span>
          <p>{c.families.bride}</p>
          <em>and</em>
          <p>{c.families.groom}</p>
        </div>
        <p className="intro-invite">
          joyfully invite you to celebrate the union of
        </p>
        <h1 className="intro-names">
          {c.brand.bride}
          <span>&</span>
          {c.brand.groom}
        </h1>
        <div className="intro-stamp">{dateStamp(c.wedding)}</div>
        <button
          className="seal-button"
          onClick={open}
          disabled={opening}
          aria-label="Open Invitation"
        >
          <span>{c.brand.monogram}</span>
          <span aria-hidden="true">↗</span>
        </button>
        <button className="intro-open" onClick={open} disabled={opening}>
          Open Invitation <span aria-hidden="true">→</span>
        </button>
        <span className="intro-footnote">
          A celebration of love, family & forever
        </span>
      </div>
    </div>
  );
}
