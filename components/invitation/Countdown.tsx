"use client";
import { useCountdown } from "@/hooks/useCountdown";
import { eventInstant } from "@/utils/calendar";
import { weddingConfig } from "@/config/wedding";
export function Countdown() {
  const time = useCountdown(eventInstant(weddingConfig.wedding).getTime());
  return (
    <section className="countdown section reveal">
      <span className="eyebrow">Every moment brings us closer</span>
      <h2>
        {time?.finished ? "Today, Forever Begins." : "Until Forever Begins"}
      </h2>
      {!time?.finished && (
        <div className="countdown-grid" aria-label="Time until the wedding">
          {(["days", "hours", "minutes", "seconds"] as const).map((unit) => (
            <div key={unit}>
              <span className="countdown-number">
                {time ? String(time[unit]).padStart(2, "0") : "—"}
              </span>
              <span className="eyebrow">{unit}</span>
            </div>
          ))}
        </div>
      )}
      <span className="countdown-note">A date written in our hearts.</span>
    </section>
  );
}
