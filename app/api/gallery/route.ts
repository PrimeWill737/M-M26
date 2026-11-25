import { isAlbum } from "@/config/experience";
import {
  failure,
  GalleryError,
  maxBytes,
  settings,
} from "@/lib/gallery-server";
import { listMemories } from "@/lib/gallery-database";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const album = url.searchParams.get("album");
    if (!isAlbum(album)) throw new GalleryError("Choose an album.");
    const rawOffset = Number(url.searchParams.get("offset") || 0);
    const offset =
      Number.isSafeInteger(rawOffset) && rawOffset >= 0 && rawOffset <= 100_000
        ? rawOffset
        : 0;
    const rows = await listMemories(album, offset);
    return Response.json(
      {
        memories: rows.slice(0, 24),
        hasMore: rows.length > 24,
        cloud: settings().cloud,
        maxBytes: maxBytes(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
