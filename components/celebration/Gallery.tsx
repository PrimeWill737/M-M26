"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ALBUM_LAUNCH, type Album, type Memory } from "@/config/experience";

type UploadItem = {
  id: string;
  file: File;
  status: "waiting" | "uploading" | "saving" | "done" | "error";
  progress: number;
  error?: string;
  ticket?: string;
  resourceType?: string;
};
async function jsonRequest(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Please try again.");
  return data;
}
function uploadChunk(
  url: string,
  data: FormData,
  headers: Record<string, string>,
  progress: (loaded: number) => void,
): Promise<{ resource_type?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.timeout = 180_000;
    Object.entries(headers).forEach(([key, value]) =>
      xhr.setRequestHeader(key, value),
    );
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) progress(event.loaded / event.total);
    };
    xhr.onerror = () =>
      reject(new Error("Connection interrupted. Please retry this file."));
    xhr.ontimeout = () =>
      reject(
        new Error("Upload timed out. Please retry on a stronger connection."),
      );
    xhr.onload = () => {
      try {
        const result = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(result);
        else
          reject(
            new Error(
              result.error?.message ||
                "This format could not be uploaded. Try exporting it as JPG or MP4.",
            ),
          );
      } catch {
        reject(new Error("Upload failed. Please try again."));
      }
    };
    xhr.send(data);
  });
}
function assetUrl(memory: Memory, cloud: string, transform = "") {
  return `https://res.cloudinary.com/${encodeURIComponent(cloud)}/${memory.resource_type}/upload/${transform ? `${transform}/` : ""}v${memory.version}/${memory.public_id}.${transform.includes("f_jpg") ? "jpg" : transform.includes("f_mp4") ? "mp4" : memory.format}`;
}

export function Gallery({ preview }: { preview: boolean }) {
  const [album, setAlbum] = useState<Album>("traditional");
  const [uploadAlbum, setUploadAlbum] = useState<Album>("traditional");
  const [memories, setMemories] = useState<Memory[]>([]);
  const [cloud, setCloud] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maxSize, setMaxSize] = useState(100 * 1024 * 1024);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [guest, setGuest] = useState("");
  const [caption, setCaption] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const loadSequence = useRef(0);
  const busyRef = useRef(false);
  const load = useCallback(
    async (offset = 0) => {
      const sequence = ++loadSequence.current;
      setLoading(true);
      setError("");
      try {
        const data = await jsonRequest(
          `/api/gallery?album=${album}&offset=${offset}`,
        );
        if (sequence !== loadSequence.current) return;
        setMemories((current) =>
          offset
            ? [
                ...current,
                ...data.memories.filter(
                  (entry: Memory) => !current.some((m) => m.id === entry.id),
                ),
              ]
            : data.memories,
        );
        setCloud(data.cloud);
        setMaxSize(data.maxBytes);
        setHasMore(data.hasMore);
      } catch (err) {
        if (sequence === loadSequence.current)
          setError(
            err instanceof Error ? err.message : "The album could not load.",
          );
      } finally {
        if (sequence === loadSequence.current) setLoading(false);
      }
    },
    [album],
  );
  useEffect(() => {
    setMemories([]);
    setHasMore(false);
    void load();
    return () => {
      loadSequence.current++;
    };
  }, [load]);
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);
  useEffect(() => {
    if (selected) {
      dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    } else dialog.current?.close();
  }, [selected]);
  function addFiles(files: FileList | null) {
    if (!files) return;
    const additions = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: "waiting" as const,
      progress: 0,
    }));
    setItems((current) => [...current, ...additions].slice(0, 20));
  }
  function update(id: string, patch: Partial<UploadItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }
  async function sendFiles() {
    if (busyRef.current || !consent) return;
    busyRef.current = true;
    setBusy(true);
    try {
      for (const item of items.filter((item) => item.status !== "done")) {
        try {
          if (!item.file.size || item.file.size > maxSize)
            throw new Error(
              `Choose a file smaller than ${maxSize / 1024 / 1024} MB.`,
            );
          let ticket = item.ticket,
            resourceType = item.resourceType;
          if (!ticket || !resourceType) {
            update(item.id, {
              status: "uploading",
              error: undefined,
              progress: 0,
            });
            const signed = await jsonRequest("/api/gallery/sign", {
              album: uploadAlbum,
              size: item.file.size,
              guest,
              caption,
              consent,
            });
            const chunkSize = 6 * 1024 * 1024;
            const uploadId = crypto.randomUUID();
            for (let start = 0; start < item.file.size; start += chunkSize) {
              const end = Math.min(start + chunkSize, item.file.size);
              const form = new FormData();
              Object.entries(signed.params).forEach(([key, value]) =>
                form.append(key, String(value)),
              );
              form.append("api_key", signed.apiKey);
              form.append("signature", signed.signature);
              form.append("file", item.file.slice(start, end), item.file.name);
              const result = await uploadChunk(
                `https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloud)}/auto/upload`,
                form,
                item.file.size > chunkSize
                  ? {
                      "X-Unique-Upload-Id": uploadId,
                      "Content-Range": `bytes ${start}-${end - 1}/${item.file.size}`,
                    }
                  : {},
                (fraction) =>
                  update(item.id, {
                    progress: Math.round(
                      ((start + (end - start) * fraction) / item.file.size) *
                        100,
                    ),
                  }),
              );
              if (result.resource_type) resourceType = result.resource_type;
            }
            if (!resourceType)
              throw new Error("Upload did not finish. Please try again.");
            ticket = signed.ticket;
            update(item.id, { ticket, resourceType });
          }
          update(item.id, { status: "saving", progress: 100 });
          await jsonRequest("/api/gallery/complete", { ticket, resourceType });
          update(item.id, { status: "done", error: undefined });
        } catch (err) {
          update(item.id, {
            status: "error",
            error:
              err instanceof Error
                ? err.message
                : "Upload failed. Please retry.",
          });
        }
      }
      await load();
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  async function share() {
    const url = `${window.location.origin}/#memories`;
    try {
      if (navigator.share)
        await navigator.share({
          title: "Meda & Marrion · our forever album",
          url,
        });
      else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Album link copied.");
      }
    } catch {
      setShareMessage(
        "You can share this page’s address with family and friends.",
      );
    }
  }
  const pending = items.filter((item) => item.status !== "done").length;
  return (
    <section className="album-gallery" id="memories">
      <div className="album-section-heading">
        <span className="album-kicker">OUR DAYS, THROUGH YOUR EYES</span>
        <h2>
          The moments <em>we keep.</em>
        </h2>
        <p>
          The big feelings. The little details. The dance-floor legends.
          <br />
          Find your people, relive the joy, and leave a little love behind.
        </p>
      </div>
      <div className="album-gallery-toolbar">
        <div className="album-tabs" role="group" aria-label="Choose an album">
          {(["traditional", "wedding"] as Album[]).map((value) => (
            <button
              key={value}
              aria-pressed={album === value}
              disabled={busy}
              onClick={() => {
                setAlbum(value);
                if (!busy) setUploadAlbum(value);
              }}
            >
              {value === "traditional" ? "Traditional" : "Wedding"}
              <span>{value === "traditional" ? "18 DEC" : "19 DEC"}</span>
            </button>
          ))}
        </div>
        <div className="album-tools">
          <button onClick={() => void load()} disabled={loading}>
            Refresh album
          </button>
          <button onClick={() => void share()}>Share album</button>
        </div>
      </div>
      {shareMessage && <p role="status">{shareMessage}</p>}
      {error && (
        <div className="album-notice" role="status">
          <p>{error}</p>
          <button onClick={() => void load()}>Try again</button>
        </div>
      )}
      {!error && !loading && memories.length === 0 && (
        <div className="album-empty">
          <span aria-hidden="true">✧</span>
          <h3>Every memory starts with someone.</h3>
          <p>
            Be the first to share a moment from the{" "}
            {album === "traditional" ? "traditional celebration" : "wedding"}.
          </p>
          <a href="#upload" className="album-button">
            Add the first memory
          </a>
        </div>
      )}
      <div className="album-grid">
        {memories.map((memory) => (
          <article className="memory-card" key={memory.id}>
            <button
              className="memory-open"
              onClick={() => setSelected(memory)}
              aria-label={`Open ${memory.resource_type} by ${memory.guest_name}`}
            >
              {/* Cloudinary supplies transformed, browser-compatible previews. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                loading="lazy"
                src={assetUrl(memory, cloud, "c_limit,w_800,f_jpg,q_auto")}
                alt={
                  memory.caption ||
                  `A ${album} memory shared by ${memory.guest_name}`
                }
              />
              {memory.resource_type === "video" && (
                <span className="memory-play">
                  ▶ <span>Play video</span>
                </span>
              )}
            </button>
            <div className="memory-info">
              <p>{memory.caption || "A little piece of our forever."}</p>
              <span>With love, {memory.guest_name}</span>
              <a href={assetUrl(memory, cloud, "fl_attachment")} download>
                Download original
              </a>
            </div>
          </article>
        ))}
      </div>
      {loading && (
        <p className="album-loading" role="status">
          Gathering the memories…
        </p>
      )}
      {hasMore && (
        <button
          className="album-button album-load-more"
          onClick={() => void load(memories.length)}
          disabled={loading}
        >
          More memories
        </button>
      )}
      <div className="album-upload" id="upload">
        <div className="album-upload-intro">
          <span className="album-kicker">YOU WERE PART OF THE MAGIC</span>
          <h2>
            Got a moment?
            <br />
            <em>Give it a home.</em>
          </h2>
          <p>
            A candid smile. A perfect dance move. That one photo everyone needs
            to see. Add your photos and videos to our shared album.
          </p>
          <p className="album-upload-note">
            Originals stay available to download. Share only moments you’re
            happy for everyone to see.
          </p>
          {preview && (
            <p className="album-upload-note">
              Uploads open{" "}
              {new Date(ALBUM_LAUNCH).toLocaleDateString("en-GB", {
                timeZone: "Africa/Lagos",
                day: "numeric",
                month: "long",
              })}{" "}
              at 1:30 pm WAT.
            </p>
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendFiles();
          }}
        >
          <fieldset disabled={busy}>
            <legend className="sr-only">Share a memory</legend>
            <div className="album-form-row">
              <label>
                Your name <span>(optional)</span>
                <input
                  value={guest}
                  onChange={(event) => setGuest(event.target.value)}
                  maxLength={80}
                  placeholder="With love, from…"
                  autoComplete="name"
                />
              </label>
              <label>
                Add to
                <select
                  value={uploadAlbum}
                  onChange={(event) =>
                    setUploadAlbum(event.target.value as Album)
                  }
                >
                  <option value="traditional">Traditional celebration</option>
                  <option value="wedding">Wedding</option>
                </select>
              </label>
            </div>
            <label>
              A little note <span>(optional)</span>
              <textarea
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                maxLength={280}
                placeholder="The story behind this moment…"
                rows={2}
              />
            </label>
            <label
              className="album-drop"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (!busy) addFiles(event.dataTransfer.files);
              }}
            >
              <span aria-hidden="true">＋</span>
              <strong>Choose photos & videos</strong>
              <span>or drop them here</span>
              <small>
                Up to 20 files · {maxSize / 1024 / 1024} MB each
                <br />
                Image & video formats, including HEIC and MOV.
                <br />
                Unavailable formats will show a helpful error.
              </small>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.heic,.heif,.raw,.dng,.cr2,.nef,.arw,.mov,.mkv,.avi,.m4v,.mts,.m2ts"
                onChange={(event) => {
                  addFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            <p className="album-file-hint">
              For a photo, choose your camera from your phone’s file picker.
              Keep this page open while uploading.
            </p>
            <label className="album-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
              />
              <span>
                I have permission to share these files in this public,
                downloadable album.
              </span>
            </label>
          </fieldset>
          {items.length > 0 && (
            <ul className="upload-queue" aria-label="Selected files">
              {items.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.file.name}</strong>
                    <span>
                      {item.status === "done"
                        ? "Shared with love ✓"
                        : item.status === "uploading"
                          ? `Uploading ${item.progress}%`
                          : item.status === "saving"
                            ? "Adding to the album…"
                            : item.status === "error"
                              ? item.error
                              : "Ready to share"}
                    </span>
                    {item.status === "uploading" && (
                      <progress
                        value={item.progress}
                        max={100}
                        aria-label={`Uploading ${item.file.name}`}
                      />
                    )}
                  </div>
                  {!busy && (
                    <button
                      type="button"
                      onClick={() =>
                        setItems((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                      aria-label={`Remove ${item.file.name}`}
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="sr-only" role="status">
            {busy
              ? "Uploading your memories. Please keep this page open."
              : items.some((item) => item.status === "done")
                ? `${items.filter((item) => item.status === "done").length} memories shared.`
                : ""}
          </p>
          <button
            className="album-button"
            type="submit"
            disabled={busy || !pending || !consent}
          >
            {busy
              ? "Sharing your moments…"
              : items.some((item) => item.status === "error")
                ? "Retry remaining files"
                : "Share with love"}
          </button>
        </form>
      </div>
      <dialog
        ref={dialog}
        aria-label="Wedding memory viewer"
        className="memory-dialog"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelected(null);
        }}
      >
        <button
          className="memory-close"
          onClick={() => setSelected(null)}
          aria-label="Close memory"
        >
          ×
        </button>
        {selected && (
          <div className="memory-dialog-content">
            {selected.resource_type === "video" ? (
              <video
                key={selected.id}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={assetUrl(
                  selected,
                  cloud,
                  "c_limit,w_1200,f_jpg,q_auto",
                )}
                src={assetUrl(selected, cloud, "f_mp4,vc_h264,ac_aac")}
              >
                <track kind="captions" />
                Your browser cannot play this video. Please download the
                original.
              </video>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */ <img
                src={assetUrl(selected, cloud, "c_limit,w_2000,f_jpg,q_auto")}
                alt={selected.caption || `Memory by ${selected.guest_name}`}
              />
            )}
            <p>{selected.caption}</p>
            <span>With love, {selected.guest_name}</span>
            <a
              className="album-button"
              href={assetUrl(selected, cloud, "fl_attachment")}
              download
            >
              Download original
            </a>
          </div>
        )}
      </dialog>
    </section>
  );
}
