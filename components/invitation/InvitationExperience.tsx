"use client";
import { useEffect, useRef, useState } from "react";
import { InvitationIntro } from "./InvitationIntro";
import { Navigation } from "../navigation/Navigation";
import { MusicToggle } from "./MusicToggle";
export function InvitationExperience({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!opened || document.querySelector("dialog[open]")) return;
    document.body.style.overflow = "";
  }, [opened]);
  useEffect(() => {
    if (!opened) return;
    const nodes = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((node) => {
      node.classList.add("reveal-ready");
      observer.observe(node);
    });
    const scroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current)
        progress.current.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
    };
    window.addEventListener("scroll", scroll, { passive: true });
    scroll();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
    };
  }, [opened]);
  function open() {
    setOpened(true);
    window.scrollTo(0, 0);
    requestAnimationFrame(() =>
      document.getElementById("hero-title")?.focus({ preventScroll: true }),
    );
  }
  return (
    <>
      {!opened && <InvitationIntro onOpen={open} />}
      <MusicToggle />
      <div
        inert={!opened}
        aria-hidden={!opened}
        className={opened ? "invitation invitation--open" : "invitation"}
      >
        <a className="skip-link" href="#wedding">
          Skip to wedding details
        </a>
        <div ref={progress} className="scroll-progress" aria-hidden="true" />
        {opened && (
          <>
            <Navigation />
          </>
        )}
        {children}
      </div>
      <noscript>
        <p className="noscript-message">
          Please enable JavaScript to open this interactive invitation.
        </p>
      </noscript>
    </>
  );
}
