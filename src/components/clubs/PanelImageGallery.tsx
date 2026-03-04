"use client";

import * as React from "react";
import { Box } from "@mui/material";

const DEFAULT_IMAGES = [
  "/images/clubs/20240905at-meet-the-clubs-004.jpg",
  "/images/clubs/20240905at-meet-the-clubs-005.jpg",
  "/images/clubs/20240905at-meet-the-clubs-007.jpg",
  "/images/clubs/20240905at-meet-the-clubs-015.jpg",
  "/images/clubs/602383742_1340951458076336_2830616914440893755_n.jpg",
  "/images/clubs/618824328_1340951591409656_6716731707385688937_n.jpg",
  "/images/clubs/619199250_1340095514828597_1780305293810035239_n.jpg",
  "/images/clubs/619521771_1340951504742998_4195533456574167438_n.jpg",
  "/images/clubs/619619754_1340951488076333_3054219931968396020_n.jpg",
  "/images/clubs/619680048_1340951541409661_1799761759153235588_n.jpg",
  "/images/clubs/622924132_1340951521409663_2934694975295881492_n.jpg",
  "/images/clubs/624359681_1340951438076338_7611979525615560769_n.jpg",
  "/images/clubs/MTC-1-1170x658.jpg",
  "/images/clubs/jr0ukOcMr5lQM0EgNtj1lwvBHSEuz1Wm0YDxrxqF.jpeg",
  "/images/clubs/rEfExmfdpd9MF8yJwy7WFoAILERiHgnV7ehKnooB.jpeg",
  "/images/clubs/0G1I5eu4uePT4mfWBBzNu8UWHF1gbaKmKi0zzmxE.jpeg",
  "/images/clubs/5NZN0CL9TSDDIj9sV7eB7ow3b5erp58bQaE0T0ES.jpeg",
  "/images/clubs/Kn24tyGLrGk7D8A8aCtxmGxFj24wq9FU1KmNE2bz.jpeg",
];

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

export default function PanelImageGallery({
  images = DEFAULT_IMAGES,
  height = 420,
}: PanelImageGalleryProps) {
  const distributed = React.useMemo(() => distributeImages(images, PANELS.length), [images]);
  const intervals = React.useMemo(
    () => PANELS.map((_, i) => BASE_INTERVAL_MS + i * 1300 + Math.floor(i * 700)),
    []
  );

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
