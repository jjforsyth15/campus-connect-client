"use client";

import * as React from "react";
import Slider from "react-slick";
import { Box, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ProgramCard from "./ProgramCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export type Slide = {
  title: string;
  blurb: string;
  imageSrc: string;
  onAddToEvents: () => void;
  onInvite: () => void;
};

type Role = "center" | "left" | "right" | "far-left" | "far-right" | "hidden";

const PrevArrow = (props: any) => (
  <IconButton
    aria-label="Previous"
    onClick={props.onClick}
    sx={{
      position: "absolute",
      left: { xs: 6, md: 12 },
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      bgcolor: "rgba(255,255,255,0.95)",
      border: "2px solid rgba(0,0,0,0.06)",
      "&:hover": { bgcolor: "#fff" },
    }}
  >
    <ChevronLeftIcon />
  </IconButton>
);

const NextArrow = (props: any) => (
  <IconButton
    aria-label="Next"
    onClick={props.onClick}
    sx={{
      position: "absolute",
      right: { xs: 6, md: 12 },
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      bgcolor: "rgba(255,255,255,0.95)",
      border: "2px solid rgba(0,0,0,0.06)",
      "&:hover": { bgcolor: "#fff" },
    }}
  >
    <ChevronRightIcon />
  </IconButton>
);

export default function Carousel({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = React.useState(0);
  const count = slides.length;

  const role = (i: number): Role => {
    const c = ((current % count) + count) % count;
    const left = (c - 1 + count) % count;
    const right = (c + 1) % count;
    const farLeft = (c - 2 + count) % count;
    const farRight = (c + 2) % count;
    if (i === c) return "center";
    if (i === left) return "left";
    if (i === right) return "right";
    if (i === farLeft) return "far-left";
    if (i === farRight) return "far-right";
    return "hidden";
  };

  const settings: any = {
    infinite: true,
    centerMode: true,
    centerPadding: "0px",
    slidesToShow: 5, 
    speed: 450,
    autoplay: true,
    autoplaySpeed: 3500,
    pauseOnHover: true,
    swipeToSlide: true,
    draggable: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    beforeChange: (_old: number, next: number) => setCurrent(next % count),
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3, centerMode: true, centerPadding: "0px" } },
      { breakpoint: 900, settings: { slidesToShow: 1, centerMode: true, centerPadding: "0px" } },
    ],
  };

  const baseCard = {
    position: "relative" as const,
    borderRadius: 8,
    willChange: "transform",
    transition:
      "transform .22s ease, box-shadow .22s ease, opacity .22s ease, z-index .22s ease",
  };

  const roleStyles: Record<Role, any> = {
    center: {
      zIndex: 6,
      transform: "scale(1.08)",                            // biggest middle card
      boxShadow: "0 18px 36px rgba(0,0,0,.24)",
      opacity: 1,
      pointerEvents: "auto",
      "&:hover": {
        transform: "translateY(-4px) scale(1.1)",
        boxShadow: "0 28px 52px rgba(0,0,0,.28)",
      },
    },
    left: {
      zIndex: 5,
      transform: "translateX(8px) scale(0.98)",            // normal-ish
      boxShadow: "0 12px 24px rgba(0,0,0,.18)",
      opacity: 0.98,
      pointerEvents: "auto",
      "&:hover": {
        transform: "translateX(8px) translateY(-2px) scale(1.0)",
        boxShadow: "0 18px 34px rgba(0,0,0,.24)",
      },
    },
    right: {
      zIndex: 5,
      transform: "translateX(-8px) scale(0.98)",           // normal-ish
      boxShadow: "0 12px 24px rgba(0,0,0,.18)",
      opacity: 0.98,
      pointerEvents: "auto",
      "&:hover": {
        transform: "translateX(-8px) translateY(-2px) scale(1.0)",
        boxShadow: "0 18px 34px rgba(0,0,0,.24)",
      },
    },
    "far-left": {
      zIndex: 4,
      transform: "translateX(12px) scale(0.92)",           // smaller outermost
      boxShadow: "0 10px 20px rgba(0,0,0,.16)",
      opacity: 0.92,
      pointerEvents: "none",                                // depth only
    },
    "far-right": {
      zIndex: 4,
      transform: "translateX(-12px) scale(0.92)",          // smaller outermost
      boxShadow: "0 10px 20px rgba(0,0,0,.16)",
      opacity: 0.92,
      pointerEvents: "none",
    },
    hidden: { zIndex: 1, opacity: 0, pointerEvents: "none" },
  };

  return (
    <Box
      sx={{
        position: "relative",
        pb: 6,
        overflowX: "clip",
        overflowY: "visible",
        "& .slick-list": { overflow: "visible", marginLeft: 0, marginRight: 0 },
        "& .slick-track": { marginLeft: 0, marginRight: 0 },
        "& .slick-slide > div": { px: { xs: 1, md: 1.25 } },
        "& .slick-prev, & .slick-next": { display: "none !important" },
      }}
    >
      <Slider {...settings}>
        {slides.map((s, i) => {
          const r = role(i);
          return (
            <Box key={s.title} sx={{ ...baseCard, ...roleStyles[r] }}>
              <ProgramCard
                white
                hideRSVP
                title={s.title}
                blurb={s.blurb}
                imageSrc={s.imageSrc}
                onAddToEvents={s.onAddToEvents}
                onInvite={s.onInvite}
              />
            </Box>
          );
        })}
      </Slider>
    </Box>
  );
}
