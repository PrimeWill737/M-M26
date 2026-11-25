"use client";
import { useEffect, useRef } from "react";

export function CelebrationEffects({ preview = false }: { preview?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const root = canvasRef.current?.closest("main");
    let tilted: HTMLElement | null = null;
    const reset = () => {
      tilted?.style.removeProperty("--tilt-x");
      tilted?.style.removeProperty("--tilt-y");
      tilted = null;
    };
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches) return;
      const card = (event.target as HTMLElement).closest<HTMLElement>(
        ".album-hero-photo, .album-event, .memory-card",
      );
      if (tilted !== card) reset();
      if (!card) return;
      tilted = card;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty(
        "--tilt-x",
        `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 5}deg`,
      );
      card.style.setProperty(
        "--tilt-y",
        `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`,
      );
    };
    root?.addEventListener("pointermove", move);
    root?.addEventListener("pointerleave", reset);
    const cleanupTilt = () => {
      reset();
      root?.removeEventListener("pointermove", move);
      root?.removeEventListener("pointerleave", reset);
    };
    const key = preview ? "mm26-preview-welcome" : "mm26-forever-welcome";
    let seen = false;
    try {
      seen = localStorage.getItem(key) === "seen";
    } catch {
      /* Storage can be disabled. */
    }
    if (seen || reduced.matches) return cleanupTilt;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return cleanupTilt;
    let width = window.innerWidth,
      height = window.innerHeight;
    const resize = () => {
      width = innerWidth;
      height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      age: number;
      life: number;
      color: string;
      angle: number;
      spark: boolean;
    };
    const particles: Particle[] = [];
    const colors = ["#dfbd73", "#9474b4", "#77a88b", "#f8e4b4", "#c27c53"];
    const confetti = () => {
      for (let i = 0; i < 150; i++) {
        const left = i % 2 === 0;
        particles.push({
          x: left ? 0 : width,
          y: height * 0.65,
          vx: (left ? 1 : -1) * (100 + Math.random() * width * 0.7),
          vy: -300 - Math.random() * 450,
          age: 0,
          life: 4 + Math.random() * 2,
          color: colors[i % colors.length],
          angle: Math.random() * Math.PI,
          spark: false,
        });
      }
    };
    const burst = (x: number, y: number) => {
      for (let i = 0; i < 44; i++) {
        const angle = (i / 44) * Math.PI * 2;
        const speed = 45 + Math.random() * 130;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          age: 0,
          life: 1.7,
          color: colors[i % colors.length],
          angle,
          spark: true,
        });
      }
    };
    confetti();
    const start = performance.now();
    let last = start,
      frame = 0,
      launched = 0,
      marked = false;
    const tick = (now: number) => {
      if (reduced.matches || document.hidden || now - start > 6500) {
        context.clearRect(0, 0, width, height);
        return;
      }
      if (!marked) {
        try {
          localStorage.setItem(key, "seen");
        } catch {
          /* Storage is optional. */
        }
        marked = true;
      }
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (launched < 3 && now - start > 450 + launched * 850) {
        burst(
          width * [0.25, 0.75, 0.5][launched],
          height * [0.22, 0.3, 0.18][launched],
        );
        launched++;
      }
      context.clearRect(0, 0, width, height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age > p.life) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += (p.spark ? 35 : 250) * dt;
        p.angle += dt * 4;
        context.save();
        context.globalAlpha = Math.min(1, (p.life - p.age) * 1.5);
        context.fillStyle = p.color;
        context.translate(p.x, p.y);
        context.rotate(p.angle);
        if (p.spark) {
          context.beginPath();
          context.arc(0, 0, 2, 0, Math.PI * 2);
          context.fill();
        } else context.fillRect(-4, -2, 8, 5 * Math.cos(p.age * 7));
        context.restore();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      context.clearRect(0, 0, width, height);
      cleanupTilt();
    };
  }, [preview]);
  return (
    <canvas
      className="celebration-confetti"
      ref={canvasRef}
      aria-hidden="true"
    />
  );
}
