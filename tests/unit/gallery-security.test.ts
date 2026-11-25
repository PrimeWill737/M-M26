import { describe, expect, test } from "bun:test";
import {
  assertUploadOrigin,
  readJsonBody,
  validAsset,
} from "../../lib/gallery-security";

const request = (body: string, headers: Record<string, string> = {}) =>
  new Request("https://wedding.example/api/gallery/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body,
  });
describe("gallery request security", () => {
  test("allows same-origin uploads and rejects missing, malformed and cross-origin requests", () => {
    expect(() =>
      assertUploadOrigin(request("{}", { Origin: "https://wedding.example" })),
    ).not.toThrow();
    for (const origin of [
      "",
      "null",
      "not-a-url",
      "http://wedding.example",
      "https://evil.example",
    ])
      expect(() =>
        assertUploadOrigin(request("{}", { Origin: origin })),
      ).toThrow();
    expect(() =>
      assertUploadOrigin(
        request("{}", {
          Origin: "https://wedding.example",
          "Sec-Fetch-Site": "cross-site",
        }),
      ),
    ).toThrow();
    expect(() =>
      assertUploadOrigin(
        request("{}", { Origin: "https://evil.example", Host: "evil.example" }),
        "https://wedding.example",
      ),
    ).toThrow();
  });
  test("requires a JSON object and rejects other body types", async () => {
    expect(await readJsonBody(request('{"album":"wedding"}'))).toEqual({
      album: "wedding",
    });
    for (const body of ["null", "[]", '"text"', "true", "{bad"])
      await expect(readJsonBody(request(body))).rejects.toThrow(
        "Invalid request",
      );
    await expect(
      readJsonBody(request("{}", { "Content-Type": "text/plain" })),
    ).rejects.toThrow("JSON request");
  });
  test("enforces byte limits even without Content-Length", async () => {
    await expect(
      readJsonBody(request(JSON.stringify({ caption: "é".repeat(9000) }))),
    ).rejects.toThrow("too large");
    await expect(
      readJsonBody(request("{}", { "Content-Length": "20000" })),
    ).rejects.toThrow("too large");
  });
  test("verifies media identity, type, size and safe format", () => {
    const asset = {
      public_id: "mm26/wedding/id",
      resource_type: "image",
      type: "upload",
      width: 100,
      height: 100,
      bytes: 500,
      version: 1,
      format: "jpg",
    };
    expect(validAsset(asset, asset.public_id, "image", 1000)).toBe(true);
    for (const patch of [
      { bytes: undefined },
      { bytes: 0 },
      { bytes: 1001 },
      { format: "svg" },
      { format: "../jpg" },
      { resource_type: "raw" },
      { type: "private" },
      { width: 0 },
      { public_id: "other" },
      { version: -1 },
    ])
      expect(
        validAsset({ ...asset, ...patch }, asset.public_id, "image", 1000),
      ).toBe(false);
  });
});
