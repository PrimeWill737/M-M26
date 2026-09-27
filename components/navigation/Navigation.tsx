"use client";
import { useState } from "react";
import { Modal } from "../ui/Modal";
const links = [
  ["Home", "home"],
  ["Wedding", "wedding"],
  ["Traditional", "traditional"],
  ["Colors", "colors"],
  ["RSVP", "rsvp"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <nav className="desktop-nav" aria-label="Invitation navigation">
        {links.map(([name, id]) => (
          <a href={`#${id}`} key={id}>
            {name}
          </a>
        ))}
      </nav>
      <button
        className="menu-toggle"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span aria-hidden="true">☰</span> Explore
      </button>
      {open && (
        <Modal title="Our celebration" onClose={() => setOpen(false)}>
          <nav className="mobile-nav" aria-label="Invitation navigation">
            {links.map(([name, id], index) => (
              <a
                href={`#${id}`}
                key={id}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => {
                    const target = document.getElementById(id);
                    target?.setAttribute("tabindex", "-1");
                    target?.focus({ preventScroll: true });
                    target?.scrollIntoView({
                      behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)",
                      ).matches
                        ? "instant"
                        : "smooth",
                    });
                  }, 0);
                }}
              >
                <span>0{index + 1}</span>
                {name}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </Modal>
      )}
    </>
  );
}
