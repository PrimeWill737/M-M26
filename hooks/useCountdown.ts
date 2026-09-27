"use client";
import { useEffect, useState } from "react";
export function remainingTime(target: number, now: number) {
  const total = Math.max(0, Math.floor((target - now) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
    finished: now >= target,
  };
}
export function useCountdown(target: number) {
  const [time, setTime] = useState<ReturnType<typeof remainingTime> | null>(
    null,
  );
  useEffect(() => {
    const update = () => setTime(remainingTime(target, Date.now()));
    const first = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, [target]);
  return time;
}
