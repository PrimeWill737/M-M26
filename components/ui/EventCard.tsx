import { Ceremony, weddingConfig } from "@/config/wedding";
import {
  calendarUrl,
  displayDate,
  displayTime,
  displayWeekday,
} from "@/utils/calendar";
import { mapsUrl } from "@/utils/maps";
import { Botanical } from "./Botanical";
export function EventCard({
  event,
  warm = false,
}: {
  event: Ceremony;
  warm?: boolean;
}) {
  return (
    <section
      id={event.id}
      className={`ceremony section ${warm ? "ceremony--warm" : ""}`}
    >
      <div className="event-art" aria-hidden="true">
        <Botanical />
        <span className="art-monogram">{weddingConfig.brand.monogram}</span>
        <span className="art-caption">
          {warm ? "ROOTED IN LOVE & TRADITION" : "THE BEGINNING OF ALWAYS"}
        </span>
      </div>
      <div className="event-content reveal">
        <span className="eyebrow">
          {warm ? "02 / OUR HERITAGE, OUR JOY" : "01 / THE PROMISE"}
        </span>
        <h2>{event.label}</h2>
        <p className="event-date">
          {displayWeekday(event)}
          <br />
          {displayDate(event)}
        </p>
        <p className="event-time">
          {displayTime(event)} <span>WAT</span>
        </p>
        {!event.timeConfirmed && (
          <p className="small-note">Time to be confirmed</p>
        )}
        <div className="venue">
          <h3>{event.venue}</h3>
          <p>{event.address}</p>
        </div>
        <p className="eyebrow colors-label">Colors of the day</p>
        <p>{event.attire.join(" & ")}</p>
        <div className="mini-swatches" aria-hidden="true">
          {weddingConfig.colors[warm ? "traditional" : "wedding"].map((s) => (
            <i key={s.name} style={{ background: s.hex }} />
          ))}
        </div>
        <div className="event-actions">
          <a
            className="button"
            href={event.mapUrl ?? mapsUrl(event.mapQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Location <span aria-hidden="true">↗</span>
          </a>
          <a
            className="text-link"
            href={calendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">▦</span> Add to Calendar
          </a>
        </div>
      </div>
    </section>
  );
}
