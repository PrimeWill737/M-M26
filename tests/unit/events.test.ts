import { describe, expect, test } from "bun:test";
import { weddingConfig as c } from "../../config/wedding";
import { eventInstant, displayTime, calendarUrl } from "../../utils/calendar";
import { deviceUrl } from "../../utils/deviceRedirect";
import { remainingTime } from "../../hooks/useCountdown";
describe("Wedding dates and calendars", () => {
  test("Lagos wedding time is 09:00 UTC regardless of browser timezone", () => {
    expect(eventInstant(c.wedding).toISOString()).toBe(
      "2026-12-19T09:00:00.000Z",
    );
    expect(displayTime(c.wedding)).toBe("10:00 AM");
    expect(displayTime(c.traditional)).toBe("2:00 PM");
  });
  test("calendar uses the configured traditional time and includes provisional notice", () => {
    const url = new URL(calendarUrl({ ...c.traditional, time: "16:30" }));
    expect(url.searchParams.get("dates")).toBe(
      "20261219T153000Z/20261219T183000Z",
    );
    expect(url.searchParams.get("details")).toContain("provisional");
    expect(url.searchParams.get("ctz")).toBe("Africa/Lagos");
  });
  test("countdown handles day rollover and expires without negative values", () => {
    expect(remainingTime(90061000, 0)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      finished: false,
    });
    expect(remainingTime(1000, 1000).finished).toBe(true);
    expect(remainingTime(1000, 5000)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      finished: true,
    });
  });
});
describe("Joscity routing", () => {
  const links = {
    website: "https://example.com",
    android: "https://example.com/android",
    ios: "https://example.com/ios",
  };
  test("Android, iPhone, desktop-mode iPad and desktop destinations", () => {
    expect(deviceUrl(links, "Android")).toBe(links.android);
    expect(deviceUrl(links, "iPhone")).toBe(links.ios);
    expect(deviceUrl(links, "Macintosh", 5)).toBe(links.ios);
    expect(deviceUrl(links, "Macintosh", 0)).toBe(links.website);
    expect(deviceUrl(links, "Windows")).toBe(links.website);
  });
  test("missing store destinations fall back to website without inventing URLs", () => {
    expect(deviceUrl({ ...links, ios: "" }, "iPad")).toBe(links.website);
    expect(deviceUrl({ website: "", ios: "", android: "" }, "Android")).toBe(
      "",
    );
  });
});
