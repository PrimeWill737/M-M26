import { Ceremony, weddingConfig } from "@/config/wedding";
export const eventInstant = (event: Ceremony) =>
  new Date(`${event.date}T${event.time}:00${event.utcOffset}`);
export const displayWeekday = (event: Ceremony) =>
  new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: event.timezone,
  }).format(eventInstant(event));
export const displayDate = (event: Ceremony) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: event.timezone,
  }).format(eventInstant(event));
export const displayTime = (event: Ceremony) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: event.timezone,
  }).format(eventInstant(event));
export const dateStamp = (event: Ceremony) =>
  event.date.split("-").reverse().join(" · ");
const stamp = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
export function calendarUrl(event: Ceremony) {
  const start = eventInstant(event);
  const title = `${weddingConfig.brand.brideFirst} & ${weddingConfig.brand.groomFirst} ${event.id === "wedding" ? "Wedding" : "Traditional Celebration"} — ${weddingConfig.brand.monogram}`;
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: "TEMPLATE", text: title, dates: `${stamp(start)}/${stamp(new Date(start.getTime() + event.durationHours * 3600000))}`, ctz: event.timezone, location: `${event.venue}, ${event.address}`, details: event.timeConfirmed ? "We look forward to celebrating with you." : "Traditional celebration time is provisional. Please confirm with the family." })}`;
}
