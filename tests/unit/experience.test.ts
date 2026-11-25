import { describe, expect, test } from "bun:test";
import { ALBUM_LAUNCH, albumIsLive, isAlbum } from "../../config/experience";

describe("forever album activation", () => {
  test("switches at precisely 13:30 WAT on December 18", () => {
    expect(new Date(ALBUM_LAUNCH).toISOString()).toBe(
      "2026-12-18T12:30:00.000Z",
    );
    expect(albumIsLive(Date.parse("2026-12-18T12:29:59.999Z"))).toBe(false);
    expect(albumIsLive(Date.parse("2026-12-18T12:30:00.000Z"))).toBe(true);
    expect(albumIsLive(Date.parse("2036-01-01T00:00:00Z"))).toBe(true);
  });
  test("only the two public albums are accepted", () => {
    expect(isAlbum("traditional")).toBe(true);
    expect(isAlbum("wedding")).toBe(true);
    expect(isAlbum("../private")).toBe(false);
    expect(isAlbum(null)).toBe(false);
  });
});
