import type { Metadata } from "next";
import { Celebration } from "@/components/celebration/Celebration";
import { connection } from "next/server";
import { albumIsLive } from "@/config/experience";
import { LaunchCountdown } from "@/components/celebration/LaunchCountdown";
export const metadata: Metadata = {
  title: "Meda & Marrion | The forever album",
  robots: { index: false, follow: false },
};
export default async function AlbumPage({
  searchParams,
}: {
  searchParams: Promise<{ preview?: string }>;
}) {
  await connection();
  const now = Date.now();
  const preview =
    process.env.NODE_ENV === "development" &&
    (await searchParams).preview === "1";
  if (!albumIsLive(now) && !preview) return <LaunchCountdown serverNow={now} />;
  return <Celebration preview={preview} />;
}
