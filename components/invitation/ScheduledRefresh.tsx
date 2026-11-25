"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ALBUM_LAUNCH } from "@/config/experience";

export function ScheduledRefresh({ serverNow }: { serverNow: number }) {
  const router = useRouter();
  useEffect(() => {
    const started = performance.now();
    let timer: ReturnType<typeof setTimeout>;
    function check() {
      const remaining =
        Date.parse(ALBUM_LAUNCH) - (serverNow + performance.now() - started);
      if (remaining <= 0) router.refresh();
      else timer = setTimeout(check, Math.min(remaining, 60_000));
    }
    check();
    const visible = () => {
      if (document.visibilityState === "visible") {
        clearTimeout(timer);
        check();
      }
    };
    document.addEventListener("visibilitychange", visible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [router, serverNow]);
  return null;
}
