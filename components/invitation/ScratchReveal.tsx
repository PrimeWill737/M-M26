"use client";
import { useScratchProgress } from "@/hooks/useScratchProgress";
import { weddingConfig as c } from "@/config/wedding";
import { displayDate, displayTime } from "@/utils/calendar";
import { mapsUrl } from "@/utils/maps";
import { SectionHeading } from "../ui/SectionHeading";
export function ScratchReveal() {
  const {
    canvasRef,
    revealed,
    reveal,
    reset,
    pointerDown,
    pointerMove,
    pointerUp,
  } = useScratchProgress();
  return (
    <section className="scratch-section section reveal">
      <SectionHeading eyebrow="Just between us">
        A Little Secret Awaits
      </SectionHeading>
      <p>Scratch gently to reveal where forever begins.</p>
      <div className={`scratch-card ${revealed ? "is-revealed" : ""}`}>
        <div className="scratch-details" aria-hidden={!revealed}>
          <span className="eyebrow">Save the date</span>
          <h3>{displayDate(c.wedding)}</h3>
          <span className="little-flower" aria-hidden="true">
            ✳
          </span>
          <h4>{c.wedding.venue}</h4>
          <p>{c.wedding.address}</p>
          <p>{displayTime(c.wedding)}</p>
          <a
            className="text-link"
            tabIndex={revealed ? 0 : -1}
            href={mapsUrl(c.wedding.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Tap to view location ↗
          </a>
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          onLostPointerCapture={pointerUp}
          aria-hidden="true"
        />
      </div>
      <div className="scratch-controls">
        <span className="small-note" aria-live="polite">
          {revealed
            ? "The secret is yours. See you there."
            : "A little touch reveals a beautiful beginning."}
        </span>
        <button className="text-link" onClick={revealed ? reset : reveal}>
          {revealed ? "↻ Replay" : "Reveal Details"}
        </button>
      </div>
    </section>
  );
}
