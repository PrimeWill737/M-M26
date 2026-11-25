export const ALBUM_LAUNCH = "2026-12-18T13:30:00+01:00";
export const albumIsLive = (now = Date.now()) =>
  now >= Date.parse(ALBUM_LAUNCH);
export type Album = "traditional" | "wedding";
export const isAlbum = (value: unknown): value is Album =>
  value === "traditional" || value === "wedding";
export interface Memory {
  id: string;
  album: Album;
  guest_name: string;
  caption: string;
  public_id: string;
  resource_type: "image" | "video";
  format: string;
  version: number;
  created_at: string;
}
