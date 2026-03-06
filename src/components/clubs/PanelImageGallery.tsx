"use client";

import * as React from "react";
import { Box } from "@mui/material";

const DEFAULT_IMAGES = Array.from({ length: 18 }, (_, i) => `/images/clubs/ClubPanel${i + 1}.jpeg`);

const FALLBACK_COLORS = [
  "linear-gradient(135deg,#b4002e,#ff4040)",
  "linear-gradient(135deg,#7b0020,#e8003a)",
  "linear-gradient(135deg,#c0002e,#ff6060)",
  "linear-gradient(135deg,#900028,#d40038)",
  "linear-gradient(135deg,#a0001a,#ff2040)",
  "linear-gradient(135deg,#6a001a,#c0002e)",
  "linear-gradient(135deg,#800020,#e00030)",
  "linear-gradient(135deg,#b00028,#ff5050)",
  "linear-gradient(135deg,#700018,#cc0032)",
];

const GRID_AREAS = `
  "tl tr cc bl br"
  "tl tr cc bl br"
  "b1 b2 b3 b4 b5"
`;

const PANELS: { area: string; pos?: string }[] = [
  { area: "tl", pos: "center center" },
  { area: "tr", pos: "center center" },
  { area: "cc", pos: "center center" }, // big center
  { area: "bl", pos: "center center" },
  { area: "br", pos: "center center" },
  { area: "b1", pos: "center 30%" },
  { area: "b2", pos: "center 40%" },
  { area: "b3", pos: "center 35%" },
  { area: "b4", pos: "center 40%" },
  { area: "b5", pos: "center 30%" },
];

const BASE_INTERVAL_MS = 9000;

interface PanelImageGalleryProps {
  images?: string[];
  height?: number | string;
}

function FadePanel({
  images,
  interval,
  fallbackColor,
  bgPosition = "center center",
}: {
  images: string[];
  interval: number;
  fallbackColor: string;
  bgPosition?: string;
}) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [nextIdx, setNextIdx] = React.useState(1 % Math.max(images.length, 1));
  const [fading, setFading] = React.useState(false);

  React.useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => {
      const next = (currentIdx + 1) % images.length;
      setNextIdx(next);
      setFading(true);
      const snap = setTimeout(() => {
        setCurrentIdx(next);
        setFading(false);
      }, 1400);
      return () => clearTimeout(snap);
    }, interval);
    return () => clearInterval(timer);
  }, [currentIdx, images.length, interval]);

  const bgStyle = (src: string) =>
    src
      ? {
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: bgPosition,
        }
      : { background: fallbackColor };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100%", borderRadius: "14px", overflow: "hidden" }}>
      <Box sx={{ position: "absolute", inset: 0, borderRadius: "14px", ...bgStyle(images[currentIdx]) }} />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          borderRadius: "14px",
          ...bgStyle(images[nextIdx] ?? images[0]),
          opacity: fading ? 1 : 0,
          transition: fading ? "opacity 1.4s ease-in-out" : "none",
        }}
      />
    </Box>
  );
}

function distributeImages(all: string[], n: number): string[][] {
  const buckets: string[][] = Array.from({ length: n }, () => []);
  // Shuffle so each panel gets a varied starting image
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  shuffled.forEach((img, i) => buckets[i % n].push(img));
  buckets.forEach((b, i) => {
    while (b.length < 2) b.push(all[(i + b.length) % all.length]);
  });
  return buckets;
}

export default function PanelImageGallery({ images = DEFAULT_IMAGES, height = 420 }: PanelImageGalleryProps) {
  const distributed = React.useMemo(() => distributeImages(images, PANELS.length), [images]);
  const intervals = React.useMemo(() => PANELS.map((_, i) => BASE_INTERVAL_MS + i * 1300 + Math.floor(i * 700)), []);

  return (
    <Box
      sx={{
        width: "100%",
        height,
        display: "grid",
        gap: "8px",
        // 5 cols: flanking panels are equal, center is 2× wide
        gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr 1fr",
        gridTemplateAreas: GRID_AREAS,
      }}
    >
      {PANELS.map((panel, i) => (
        <Box
          key={panel.area}
          sx={{
            gridArea: panel.area,
            borderRadius: "14px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <FadePanel
            images={distributed[i]}
            interval={intervals[i]}
            fallbackColor={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
            bgPosition={panel.pos}
          />
        </Box>
      ))}
    </Box>
  );
}