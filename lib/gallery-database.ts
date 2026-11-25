import "server-only";
import postgres from "postgres";
import type { Album, Memory } from "@/config/experience";
import { GalleryError } from "./gallery-server";
import { supabaseCa } from "./supabase-ca";

// Reuse a small pool across requests and development hot reloads.
const globalDatabase = globalThis as typeof globalThis & {
  galleryVerifiedSql?: ReturnType<typeof postgres>;
};

function database() {
  const url = process.env.DATABASE_URL;
  if (!url)
    throw new GalleryError(
      "The album is being prepared. Please try again soon.",
      503,
    );
  globalDatabase.galleryVerifiedSql ??= postgres(url, {
    ssl: { rejectUnauthorized: true, ca: supabaseCa },
    max: 2,
    idle_timeout: 20,
    connect_timeout: 10,
    max_lifetime: 60 * 30,
    prepare: false,
    connection: { statement_timeout: 15000 },
  });
  return globalDatabase.galleryVerifiedSql;
}

async function query<T>(
  run: (sql: ReturnType<typeof postgres>) => PromiseLike<T>,
): Promise<T> {
  try {
    return await run(database());
  } catch (error) {
    if (error instanceof GalleryError) throw error;
    // Database errors can contain connection information or guest data.
    throw new GalleryError(
      "The album could not be reached. Please try again.",
      503,
    );
  }
}

export function listMemories(album: Album, offset: number) {
  return query(
    (sql) => sql<Memory[]>`
    select id, album, guest_name, caption, public_id, resource_type, format,
      version::double precision as version, created_at
    from public.memories
    where album = ${album} and hidden = false
    order by created_at desc, id desc
    limit 25 offset ${offset}
  `,
  );
}

export async function claimUpload(bucket: string, limit: number) {
  const rows = await query(
    (sql) => sql<{ allowed: boolean }[]>`
    select public.claim_gallery_upload(${bucket}, ${limit}) as allowed
  `,
  );
  return rows[0]?.allowed === true;
}

export async function saveMemory(memory: Omit<Memory, "id" | "created_at">) {
  await query(
    (sql) => sql`
    insert into public.memories
      (album, guest_name, caption, public_id, resource_type, format, version)
    values (${memory.album}, ${memory.guest_name}, ${memory.caption},
      ${memory.public_id}, ${memory.resource_type}, ${memory.format}, ${memory.version})
    on conflict (public_id) do nothing
  `,
  );
}
