"use client";

// AuroraBackground — standalone animated wave background component
// Uses a canvas rendered at position:fixed so it NEVER affects
// position:sticky or scroll behaviour of any parent/sibling.
// Safe to use as a direct child of your layout — not as a wrapper.
//
// Usage:
//   <>
//     <AuroraBackground />   ← renders the fixed canvas
//     <YourPageContent />    ← scrolls normally, sticky works
//   </>

import { useEffect, useRef } from "react";

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Each wave: amp, horizontal freq, time speed, vertical position (0–1), fill color
    const waves = [
      { amp: 42, freq: 0.007, speed: 0.16, yOff: 0.28, color: "rgba(200,0,46,0.58)"  },
      { amp: 30, freq: 0.011, speed: 0.22, yOff: 0.44, color: "rgba(215,0,120,0.40)" },
      { amp: 24, freq: 0.015, speed: 0.13, yOff: 0.58, color: "rgba(185,0,46,0.50)"  },
      { amp: 20, freq: 0.009, speed: 0.28, yOff: 0.70, color: "rgba(255,75,15,0.30)" },
      { amp: 48, freq: 0.005, speed: 0.09, yOff: 0.84, color: "rgba(155,0,38,0.62)"  },
    ];

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      t += 0.005;

      // Dark crimson base
      ctx.fillStyle = "#180008";
      ctx.fillRect(0, 0, W, H);

      // Draw layered wave shapes
      waves.forEach((w, i) => {
        ctx.beginPath();
        const yBase = H * w.yOff;
        ctx.moveTo(0, H);
        for (let x = 0; x <= W; x += 4) {
          const y =
            yBase
            + Math.sin(x * w.freq + t * w.speed * 6.28 + i * 1.1) * w.amp
            + Math.sin(x * w.freq * 1.65 + t * w.speed * 4.0 + i * 2.3) * (w.amp * 0.42);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H);
        ctx.closePath();

        // Gradient: transparent crest → solid colour → dark base
        const grad = ctx.createLinearGradient(0, yBase - w.amp * 2.5, 0, H);
        if (i % 3 === 0) {
          grad.addColorStop(0,   "rgba(220,0,50,0.0)");
          grad.addColorStop(0.4, w.color);
          grad.addColorStop(1,   "rgba(110,0,18,0.88)");
        } else if (i % 3 === 1) {
          grad.addColorStop(0,   "rgba(220,0,120,0.0)");
          grad.addColorStop(0.4, w.color);
          grad.addColorStop(1,   "rgba(95,0,28,0.85)");
        } else {
          grad.addColorStop(0,   "rgba(255,80,0,0.0)");
          grad.addColorStop(0.4, w.color);
          grad.addColorStop(1,   "rgba(130,0,18,0.85)");
        }
        ctx.fillStyle = grad;
        ctx.fill();
      });

      // Subtle digital pixel-grid shimmer — cheap & GPU-friendly
      ctx.fillStyle = "rgba(255,30,60,0.016)";
      for (let gx = 0; gx < W; gx += 20) {
        for (let gy = 0; gy < H; gy += 20) {
          if (Math.sin(gx * 0.06 + t * 1.1) * Math.cos(gy * 0.08 + t * 0.75) > 0.72) {
            ctx.fillRect(gx, gy, 2, 2);
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,      // always behind page content
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
