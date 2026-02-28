"use client";

import * as React from "react";
import { Box } from "@mui/material";

/**
 * AuroraBackground — pure animated red palette, no black or dark voids.
 * Uses layered radial gradients across the red spectrum:
 *   crimson · scarlet · ruby · wine · rose · coral-red
 * All shades remain within the red family so the background never goes dark.
 *
 * BACKEND: Colors can be sourced from a Supabase `site_config` table.
 */
export default function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",

        // ── BASE: deep ruby-red, still clearly red (not black) ──────────────
        bgcolor: "#3a0010",

        // ── Layer 1: Large slow-shifting aurora blobs ────────────────────────
        // All colors are red-family: vary hue between 340°–10° and saturation
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "-30%",
          zIndex: 0,
          background: [
            // Bright scarlet — top left
            "radial-gradient(ellipse 90% 65% at 10% 5%, rgba(230,20,50,0.90), transparent 55%)",
            // Deep crimson — top right
            "radial-gradient(ellipse 80% 60% at 90% 8%, rgba(180,0,40,0.85), transparent 55%)",
            // Rose-red — center
            "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(210,30,60,0.60), transparent 60%)",
            // Wine/burgundy — bottom left
            "radial-gradient(ellipse 75% 60% at 15% 90%, rgba(140,0,35,0.80), transparent 55%)",
            // Vivid red — bottom right
            "radial-gradient(ellipse 80% 65% at 85% 88%, rgba(200,10,40,0.75), transparent 55%)",
            // Coral-red streak — mid
            "radial-gradient(ellipse 60% 40% at 40% 30%, rgba(255,50,70,0.40), transparent 60%)",
          ].join(","),
          filter: "blur(55px) saturate(180%)",
          animation: "auroraShift 20s ease-in-out infinite alternate",
        },

        // ── Layer 2: Fast-moving highlights — lighter reds and rose pinks ───
        "&::after": {
          content: '""',
          position: "absolute",
          inset: "-20%",
          zIndex: 0,
          background: [
            // Hot coral sweep across top
            "radial-gradient(ellipse 140% 35% at 25% 15%, rgba(255,80,100,0.28), transparent 55%)",
            // Deep rose sweep across bottom
            "radial-gradient(ellipse 120% 30% at 75% 80%, rgba(200,20,55,0.22), transparent 55%)",
            // Ruby horizontal band — mid
            "radial-gradient(ellipse 160% 20% at 50% 55%, rgba(190,0,40,0.18), transparent 60%)",
          ].join(","),
          filter: "blur(40px) saturate(160%)",
          opacity: 1,
          animation: "auroraStreaks 26s ease-in-out infinite alternate-reverse",
          pointerEvents: "none",
        },

        // ── Layer 3: Grain texture overlay for depth ─────────────────────────
        // Pure CSS noise using a pseudo-element on the child wrapper
        "@keyframes auroraShift": {
          "0%":   { transform: "translate(-4%, -5%) scale(1.03) rotate(0deg)" },
          "25%":  { transform: "translate(5%, -3%) scale(1.08) rotate(0.5deg)" },
          "50%":  { transform: "translate(3%, 6%) scale(1.05) rotate(-0.5deg)" },
          "75%":  { transform: "translate(-5%, 4%) scale(1.07) rotate(0.3deg)" },
          "100%": { transform: "translate(-2%, -2%) scale(1.04) rotate(0deg)" },
        },

        "@keyframes auroraStreaks": {
          "0%":   { transform: "translate(4%, 3%) scale(1.04)" },
          "33%":  { transform: "translate(-5%, -4%) scale(1.09)" },
          "66%":  { transform: "translate(3%, -2%) scale(1.06)" },
          "100%": { transform: "translate(-3%, 5%) scale(1.05)" },
        },

        // ── Layer 4: Shimmer pulses ──────────────────────────────────────────
        "& > .aurora-shimmer": {
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: [
            "radial-gradient(ellipse 50% 30% at 70% 20%, rgba(255,100,120,0.15), transparent 60%)",
            "radial-gradient(ellipse 40% 25% at 30% 75%, rgba(220,40,70,0.12), transparent 60%)",
          ].join(","),
          animation: "shimmerPulse 8s ease-in-out infinite alternate",
          pointerEvents: "none",
        },

        "@keyframes shimmerPulse": {
          "0%":   { opacity: 0.4 },
          "50%":  { opacity: 1 },
          "100%": { opacity: 0.5 },
        },
      }}
    >
      {/* Extra shimmer layer */}
      <Box className="aurora-shimmer" />
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
}
