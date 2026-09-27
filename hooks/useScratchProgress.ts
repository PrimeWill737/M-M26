"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { weddingConfig } from "@/config/wedding";
export function useScratchProgress() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [revision, setRevision] = useState(0);
  const active = useRef<number | null>(null);
  const previous = useRef<{ x: number; y: number } | null>(null);
  const lastSample = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    let initialized = false;
    const paint = () => {
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width) return;
      const backup = document.createElement("canvas");
      backup.width = canvas.width;
      backup.height = canvas.height;
      if (initialized) backup.getContext("2d")?.drawImage(canvas, 0, 0);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = bounds.width * dpr;
      canvas.height = bounds.height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (initialized) {
        context.drawImage(backup, 0, 0, bounds.width, bounds.height);
        return;
      }
      const gradient = context.createLinearGradient(
        0,
        0,
        bounds.width,
        bounds.height,
      );
      gradient.addColorStop(0, "#b7adbf");
      gradient.addColorStop(0.45, "#ddd2df");
      gradient.addColorStop(1, "#aca2b4");
      context.fillStyle = gradient;
      context.fillRect(0, 0, bounds.width, bounds.height);
      for (let i = 0; i < 8000; i++) {
        context.fillStyle = i % 2 ? "#ffffff18" : "#53435712";
        context.fillRect(
          Math.random() * bounds.width,
          Math.random() * bounds.height,
          1,
          1,
        );
      }
      context.strokeStyle = "#68556c66";
      context.strokeRect(14, 14, bounds.width - 28, bounds.height - 28);
      context.textAlign = "center";
      context.fillStyle = "#5e4e64";
      context.font = "italic 48px Georgia";
      context.fillText(
        weddingConfig.brand.monogram,
        bounds.width / 2,
        bounds.height / 2 - 24,
      );
      context.font = "12px Georgia";
      context.fillText(
        "S C R A T C H   T O   R E V E A L",
        bounds.width / 2,
        bounds.height / 2 + 26,
      );
      context.font = "italic 14px Georgia";
      context.fillText(
        "a little glimpse of forever",
        bounds.width / 2,
        bounds.height / 2 + 56,
      );
      initialized = true;
    };
    paint();
    const observer = new ResizeObserver(paint);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [revision]);
  const sample = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 128) clear++;
    }
    if (clear / total >= 0.5) setRevealed(true);
  }, []);
  function draw(e: PointerEvent<HTMLCanvasElement>) {
    if (active.current !== e.pointerId || revealed) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 48;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(previous.current?.x ?? point.x, previous.current?.y ?? point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(point.x, point.y, 24, 0, Math.PI * 2);
    ctx.fill();
    previous.current = point;
    if (performance.now() - lastSample.current > 160) {
      sample();
      lastSample.current = performance.now();
    }
  }
  return {
    canvasRef,
    revealed,
    reveal: () => setRevealed(true),
    reset: () => {
      active.current = null;
      previous.current = null;
      setRevealed(false);
      setRevision((v) => v + 1);
    },
    pointerDown: (e: PointerEvent<HTMLCanvasElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active.current = e.pointerId;
      previous.current = null;
      e.currentTarget.setPointerCapture(e.pointerId);
      draw(e);
    },
    pointerMove: draw,
    pointerUp: () => {
      active.current = null;
      previous.current = null;
      sample();
    },
  };
}
