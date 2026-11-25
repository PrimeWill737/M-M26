import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { albumIsLive, isAlbum, type Album } from "@/config/experience";
import {
  GalleryError,
  assertUploadOrigin,
  readJsonBody,
} from "./gallery-security";
export { GalleryError } from "./gallery-security";
export function settings() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !key || !secret || !preset || !process.env.DATABASE_URL)
    throw new GalleryError(
      "The album is being prepared. Please try again soon.",
      503,
    );
  return { cloud, key, secret, preset };
}
export const maxBytes = () =>
  Math.min(500, Math.max(1, Number(process.env.GALLERY_MAX_UPLOAD_MB) || 100)) *
  1024 *
  1024;
export function checkUpload(request: Request) {
  assertUploadOrigin(
    request,
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_SITE_URL
      : undefined,
  );
  const earlyUploads =
    process.env.NODE_ENV !== "production" &&
    process.env.GALLERY_ALLOW_EARLY_UPLOADS === "true";
  if (!albumIsLive() && !earlyUploads)
    throw new GalleryError(
      "Guest uploads open on 18 December at 1:30 pm WAT.",
      403,
    );
}
export const readBody = readJsonBody;
export const cloudSignature = (params: Record<string, string>) =>
  createHash("sha1")
    .update(
      Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&") + settings().secret,
    )
    .digest("hex");
interface Ticket {
  publicId: string;
  album: Album;
  guest: string;
  caption: string;
  expires: number;
}
export function signTicket(ticket: Ticket) {
  const payload = Buffer.from(JSON.stringify(ticket)).toString("base64url");
  return `${payload}.${createHmac("sha256", settings().secret).update(payload).digest("base64url")}`;
}
export function verifyTicket(value: unknown): Ticket {
  if (
    typeof value !== "string" ||
    value.length > 4096 ||
    !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
  )
    throw new GalleryError("Missing upload receipt.");
  const [payload, signature] = value.split(".");
  const expected = createHmac("sha256", settings().secret)
    .update(payload)
    .digest();
  const actual = Buffer.from(signature || "", "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new GalleryError("Invalid upload receipt.", 403);
  const ticket = JSON.parse(
    Buffer.from(payload, "base64url").toString(),
  ) as Ticket;
  if (
    !Number.isSafeInteger(ticket.expires) ||
    ticket.expires <= Date.now() ||
    ticket.expires > Date.now() + 3600_000 ||
    !isAlbum(ticket.album) ||
    typeof ticket.publicId !== "string" ||
    !new RegExp(`^mm26/${ticket.album}/[a-f0-9-]{36}$`).test(ticket.publicId) ||
    typeof ticket.guest !== "string" ||
    ticket.guest.length > 80 ||
    typeof ticket.caption !== "string" ||
    ticket.caption.length > 280
  )
    throw new GalleryError(
      "This upload session expired. Please select your file again.",
      403,
    );
  return ticket;
}
export function failure(error: unknown) {
  return Response.json(
    {
      error:
        error instanceof GalleryError
          ? error.message
          : "Something went wrong. Please try again.",
    },
    {
      status: error instanceof GalleryError ? error.status : 500,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
