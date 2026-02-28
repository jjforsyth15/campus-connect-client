"use client";

import * as React from "react";
import Link from "next/link";
import { Box, Button, Chip, Typography } from "@mui/material";
import type { Club } from "./clubs.data";
import { btnMaroon } from "./ClubsStates";

/**
 * FlipClubCard
 * Front: banner + logo avatar + name + tagline + category
 * Back:  headline + blurb + chips + "View club" CTA
 *
 * BACKEND:
 *   - club.bannerUrl / club.logoUrl → Supabase Storage URLs
 *   - club.card fields → editable by leadership via ClubEditPage
 *   - club.href → computed server-side as `/clubs/${club.id}`
 */
export default function FlipClubCard({ club }: { club: Club }) {
  const [flipped, setFlipped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

  const initials = React.useMemo(() => {
    const parts = (club.name ?? "").split(" ").filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }, [club.name]);

  const href = club.href ?? `/clubs/${club.id}`;

  // Category label background (subtle accent per category)
  const categoryColor: Record<string, string> = {
    STEM: "rgba(59,130,246,0.85)",
    Business: "rgba(16,185,129,0.85)",
    Arts: "rgba(236,72,153,0.85)",
    Cultural: "rgba(245,158,11,0.85)",
    Sports: "rgba(239,68,68,0.85)",
    Literature: "rgba(139,92,246,0.85)",
    Fraternity: "rgba(20,184,166,0.85)",
  };
  const catColor = categoryColor[club.category ?? ""] ?? "rgba(100,100,100,0.75)";

  return (
    <Box
      onClick={() => setFlipped((v) => !v)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        position: "relative",
        height: 300,
        perspective: "1200px",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {/* Wrapper that flips */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transition: "transform 540ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : hovered ? "rotateY(0deg) translateY(-4px)" : "rotateY(0deg)",
          borderRadius: "20px",
          boxShadow: hovered
            ? "0 22px 60px rgba(255,60,10,0.28), 0 8px 24px rgba(0,0,0,0.4)"
            : "0 10px 35px rgba(0,0,0,0.35)",
        }}
      >
        {/* ── FRONT ─────────────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: "20px",
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.95)",
          }}
        >
          {/* Banner */}
          <Box
            sx={{
              height: 120,
              backgroundImage: club.bannerUrl ? `url(${club.bannerUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
              bgcolor: club.bannerUrl ? undefined : "rgba(180,0,46,0.3)",
              position: "relative",
              filter: "saturate(110%) contrast(105%)",
            }}
          >
            {/* Category badge */}
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                px: 1.2,
                py: 0.5,
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: 0.5,
                color: "white",
                bgcolor: catColor,
                backdropFilter: "blur(8px)",
                textTransform: "uppercase",
              }}
            >
              {club.category ?? "Club"}
            </Box>

            {/* "Flip" hint pill */}
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                px: 1,
                py: 0.4,
                borderRadius: 99,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "rgba(255,255,255,0.85)",
                bgcolor: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              CLICK TO FLIP
            </Box>
          </Box>

          {/* Avatar — raised z-index so it always sits above banner */}
          <Box
            sx={{
              position: "absolute",
              top: 84,
              left: 16,
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "3px solid white",
              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              overflow: "hidden",
              bgcolor: "rgba(160,20,28,0.85)",
              display: "grid",
              placeItems: "center",
              zIndex: 10,
            }}
          >
            {club.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={club.logoUrl}
                alt={`${club.name} logo`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography sx={{ color: "white", fontWeight: 900, fontSize: 18 }}>
                {initials}
              </Typography>
            )}
          </Box>

          {/* Info */}
          <Box sx={{ pt: 7, px: 2.2, pb: 2 }}>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 900,
                color: "#1a0408",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {club.name}
            </Typography>
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "rgba(45,16,18,0.65)",
                lineHeight: 1.4,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {club.tagline ?? ""}
            </Typography>
          </Box>
        </Box>

        {/* ── BACK ──────────────────────────────────────────────────────────── */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: "20px",
            overflow: "hidden",
            bgcolor: "rgba(255,255,255,0.95)",
          }}
        >
          <Box
            sx={{
              p: 2.4,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography sx={{ fontSize: 17, fontWeight: 900, color: "#1a0408", lineHeight: 1.25 }}>
              {club.card?.headline ?? club.name}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: 13,
                color: "rgba(45,16,18,0.72)",
                lineHeight: 1.55,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              }}
            >
              {club.card?.blurb ?? club.description ?? "Click View club to learn more."}
            </Typography>

            {/* Chips */}
            {club.card?.chips && club.card.chips.length > 0 && (
              <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap", mt: 1.5 }}>
                {club.card.chips.map((chip) => (
                  <Chip
                    key={chip}
                    label={chip}
                    size="small"
                    sx={{
                      fontSize: 11,
                      fontWeight: 800,
                      bgcolor: "rgba(180,0,46,0.09)",
                      color: "#B4002E",
                      border: "1px solid rgba(180,0,46,0.18)",
                      height: 22,
                    }}
                  />
                ))}
              </Box>
            )}

            <Box sx={{ flex: 1 }} />

            <Box
              sx={{
                display: "flex",
                gap: 1.2,
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 11, color: "rgba(45,16,18,0.45)", fontWeight: 700 }}>
                Tap to flip back
              </Typography>

              <Button
                component={Link}
                href={href}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                  ...btnMaroon,
                  fontSize: 13,
                  py: 0.8,
                  px: 2,
                }}
              >
                View club →
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
