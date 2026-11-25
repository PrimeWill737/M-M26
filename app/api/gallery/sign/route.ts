import { createHmac, randomUUID } from "node:crypto";
import { isAlbum } from "@/config/experience";
import {
  checkUpload,
  cloudSignature,
  failure,
  GalleryError,
  maxBytes,
  readBody,
  settings,
  signTicket,
} from "@/lib/gallery-server";
import { claimUpload } from "@/lib/gallery-database";

export async function POST(request: Request) {
  try {
    checkUpload(request);
    const c = settings();
    const body = await readBody(request);
    if (
      !isAlbum(body.album) ||
      typeof body.size !== "number" ||
      !Number.isSafeInteger(body.size) ||
      body.size <= 0 ||
      body.size > maxBytes()
    )
      throw new GalleryError(
        `Choose a photo or video up to ${maxBytes() / 1024 / 1024} MB.`,
      );
    if (body.consent !== true)
      throw new GalleryError(
        "Please agree to share your files in the public album.",
      );
    const guest =
      typeof body.guest === "string" ? body.guest.trim().slice(0, 80) : "";
    const caption =
      typeof body.caption === "string" ? body.caption.trim().slice(0, 280) : "";
    // Use only a platform-verified IP header. Other hosts share the global bucket.
    const ip = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for") || "unknown"
      : "shared";
    const bucket = createHmac("sha256", c.secret).update(ip).digest("hex");
    const allowed =
      (await claimUpload("sign:global", 1000)) &&
      (await claimUpload(bucket, ip === "shared" ? 1000 : 100));
    if (!allowed)
      throw new GalleryError(
        "Lots of memories are arriving! Please try uploading again in an hour.",
        429,
      );
    const publicId = `mm26/${body.album}/${randomUUID()}`;
    const params = {
      public_id: publicId,
      timestamp: String(Math.floor(Date.now() / 1000)),
      overwrite: "false",
      upload_preset: c.preset,
    };
    return Response.json(
      {
        cloud: c.cloud,
        apiKey: c.key,
        params,
        signature: cloudSignature(params),
        ticket: signTicket({
          publicId,
          album: body.album,
          guest: guest || "A loved one",
          caption,
          expires: Date.now() + 3600_000,
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
