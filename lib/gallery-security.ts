export class GalleryError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export function assertUploadOrigin(
  request: Request,
  configuredOrigin?: string,
) {
  try {
    const raw = request.headers.get("origin");
    if (!raw || request.headers.get("sec-fetch-site") === "cross-site")
      throw new Error();
    const origin = new URL(raw);
    if (!["https:", "http:"].includes(origin.protocol) || origin.origin !== raw)
      throw new Error();
    if (configuredOrigin) {
      if (origin.origin !== new URL(configuredOrigin).origin) throw new Error();
    } else {
      const requestUrl = new URL(request.url);
      const host = request.headers.get("host") || requestUrl.host;
      if (origin.host !== host || origin.protocol !== requestUrl.protocol)
        throw new Error();
    }
  } catch {
    throw new GalleryError("Please upload from the wedding website.", 403);
  }
}

export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown>> {
  if (
    request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new GalleryError("Send a JSON request.", 415);
  const limit = 16_384;
  const declared = request.headers.get("content-length");
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > limit))
    throw new GalleryError("Request is too large.", 413);
  if (!request.body) throw new GalleryError("Invalid request.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new GalleryError("Request is too large.", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  try {
    const value: unknown = JSON.parse(
      new TextDecoder("utf-8", { fatal: true }).decode(bytes),
    );
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new GalleryError("Invalid request.");
  }
}

export function validAsset(
  asset: Record<string, unknown>,
  publicId: string,
  resourceType: string,
  limit: number,
) {
  return (
    asset.public_id === publicId &&
    asset.resource_type === resourceType &&
    asset.type === "upload" &&
    typeof asset.width === "number" &&
    Number.isFinite(asset.width) &&
    asset.width > 0 &&
    typeof asset.height === "number" &&
    Number.isFinite(asset.height) &&
    asset.height > 0 &&
    typeof asset.bytes === "number" &&
    Number.isSafeInteger(asset.bytes) &&
    asset.bytes > 0 &&
    asset.bytes <= limit &&
    typeof asset.version === "number" &&
    Number.isSafeInteger(asset.version) &&
    asset.version > 0 &&
    typeof asset.format === "string" &&
    /^[a-z0-9]{1,16}$/.test(asset.format) &&
    !["pdf", "eps", "ps", "svg"].includes(asset.format)
  );
}
