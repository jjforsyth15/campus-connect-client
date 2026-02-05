"use client";

import * as React from "react";

/**
 * Interactive aurora-style gradient background.
 * - No deps
 * - Mouse/touch parallax
 * - Red-themed palette tuned for SRC
 */
export default function SrcAuroraBg({
  opacity = 0.65,
  speed = 0.12,
}: {
  opacity?: number;
  speed?: number;
}) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  const raf = React.useRef<number | null>(null);
  const pointer = React.useRef({ x: 0.5, y: 0.5 });
  const t = React.useRef(0);

  const palette = React.useMemo(
    () => [
      { r: 168, g: 5, b: 50 },   // SRC red
      { r: 217, g: 33, b: 77 },  // lighter red
      { r: 130, g: 0, b: 34 },   // dark red
      { r: 255, g: 213, b: 79 }, // gold accent
    ],
    []
  );

  const resize = React.useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { innerWidth: w, innerHeight: h } = window;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    c.style.width = w + "px";
    c.style.height = h + "px";
    const ctx = c.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const draw = React.useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const w = c.clientWidth;
    const h = c.clientHeight;
    t.current += speed;

    // soft base fill to remove harsh banding
    ctx.clearRect(0, 0, w, h);
    const base = ctx.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, "rgba(168, 5, 50, 0.9)");
    base.addColorStop(0.5, "rgba(168, 5, 50, 0.75)");
    base.addColorStop(1, "rgba(168, 5, 50, 0.9)");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "lighter";

    // blob positions drift + follow pointer slightly
    const px = pointer.current.x * w;
    const py = pointer.current.y * h;

    const blobs = 5;
    for (let i = 0; i < blobs; i++) {
      const p = palette[i % palette.length];
      // wave paths
      const k = 0.8 + i * 0.17;
      const x =
        Math.sin((t.current * 0.008 + i) * k) * (w * 0.25) +
        w * (0.25 + 0.15 * i) +
        (px - w * 0.5) * 0.08;
      const y =
        Math.cos((t.current * 0.006 + i * 1.3) * k) * (h * 0.22) +
        h * (0.35 + 0.1 * (i % 2)) +
        (py - h * 0.5) * 0.08;

      const radius = Math.max(w, h) * (0.45 - i * 0.05);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${opacity})`);
      grad.addColorStop(0.55, `rgba(${p.r},${p.g},${p.b},${opacity * 0.28})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    raf.current = requestAnimationFrame(draw);
  }, [opacity, palette, speed]);

  React.useEffect(() => {
    resize();
    const onMove = (e: PointerEvent | MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = "clientX" in e ? e.clientX : 0;
      const y = "clientY" in e ? e.clientY : 0;
      pointer.current.x += (x / w - pointer.current.x) * 0.08;
      pointer.current.y += (y / h - pointer.current.y) * 0.08;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove as any);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [resize, draw]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
}
