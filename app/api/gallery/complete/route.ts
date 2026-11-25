import {
  checkUpload,
  failure,
  GalleryError,
  maxBytes,
  readBody,
  settings,
  verifyTicket,
} from "@/lib/gallery-server";
import { saveMemory, claimUpload } from "@/lib/gallery-database";
import { validAsset } from "@/lib/gallery-security";

export async function POST(request: Request) {
  try {
    checkUpload(request);
    const body = await readBody(request);
    const ticket = verifyTicket(body.ticket);
    if (body.resourceType !== "image" && body.resourceType !== "video")
      throw new GalleryError("Only photos and videos belong in this album.");
    if (!(await claimUpload(`complete:${ticket.publicId}`, 10)))
      throw new GalleryError(
        "Please wait an hour before retrying this upload.",
        429,
      );
    const c = settings();
    // Never trust client URLs, sizes or media metadata. Read the uploaded resource from Cloudinary.
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(c.cloud)}/resources/${body.resourceType}/upload/${encodeURIComponent(ticket.publicId)}`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${c.key}:${c.secret}`).toString("base64")}`,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(20_000),
      },
    );
    if (!response.ok)
      throw new GalleryError(
        "Your upload could not be verified yet. Try saving it again.",
        502,
      );
    const asset = await response.json();
    if (!validAsset(asset, ticket.publicId, body.resourceType, maxBytes()))
      throw new GalleryError(
        "This file cannot be displayed in the photo and video album.",
      );
    await saveMemory({
      album: ticket.album,
      guest_name: ticket.guest,
      caption: ticket.caption,
      public_id: ticket.publicId,
      resource_type: body.resourceType,
      format: asset.format,
      version: asset.version,
    });
    return Response.json({ saved: true });
  } catch (error) {
    return failure(error);
  }
}
