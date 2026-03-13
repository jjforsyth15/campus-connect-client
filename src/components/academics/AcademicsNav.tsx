"use client";

import * as React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Fade,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SchoolIcon from "@mui/icons-material/School";

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = {
  label: string;
  index: number;
  isPill?: boolean;
  href?: string;
};

interface AcademicsNavProps {
  tab: number;
  setTab: (t: number) => void;
}

// ── Tab definitions ──────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { label: "My Classes", index: 0 },
  { label: "Due Dates", index: 1 },
  { label: "Study Groups", index: 3 },
  { label: "Note Share", index: 4 },

  { label: "UniCart", index: 2, isPill: true, href: "/academics/uni-cart" },
  { label: "Smart Planner", index: 5, isPill: true, href: "/academics/smart-planner" },
];

const PILL_TABS = TABS.filter((t) => t.isPill);
const MENU_TABS = TABS.filter((t) => !t.isPill);

// ── Component ────────────────────────────────────────────────────────────────

export default function AcademicsNav({ tab, setTab }: AcademicsNavProps) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeLabel = TABS.find((t) => t.index === tab)?.label ?? "My Classes";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        flexWrap: "wrap",
      }}
    >
      {/* ── Brand ─────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            bgcolor: "rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SchoolIcon sx={{ fontSize: 18, color: "#fff" }} />
        </Box>

        <Box>
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: "0.95rem",
              color: "#fff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Academic Hub
          </Typography>

          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.65rem",
              color: "rgba(255,255,255,0.55)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            CSUN · Academics
          </Typography>
        </Box>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          width: "1px",
          height: 28,
          bgcolor: "rgba(255,255,255,0.18)",
          mx: 0.5,
        }}
      />

      {/* Dropdown */}
      <Box ref={menuRef} sx={{ position: "relative" }}>
        <Box
          onClick={() => setOpen((p) => !p)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.65,
            borderRadius: "999px",
            border: "1.5px solid rgba(255,255,255,0.22)",
            bgcolor: open ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)",
            cursor: "pointer",
            transition: "all 0.18s ease",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: "0.82rem",
              color: "#fff",
            }}
          >
            {activeLabel}
          </Typography>

          <KeyboardArrowDownIcon
            sx={{
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </Box>

        <Fade in={open} timeout={160}>
          <Box
            sx={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              minWidth: 180,
              bgcolor: "rgba(20,4,10,0.92)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "14px",
              overflow: "hidden",
              zIndex: 1400,
              py: 0.75,
            }}
          >
            {MENU_TABS.map((t) => {
              const isActive = tab === t.index;

              return (
                <Box
                  key={t.index}
                  onClick={() => {
                    setTab(t.index);
                    setOpen(false);
                  }}
                  sx={{
                    px: 2,
                    py: 0.85,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    bgcolor: isActive ? "rgba(168,5,50,0.30)" : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: isActive ? "#ff5c87" : "transparent",
                      border: isActive
                        ? "none"
                        : "1.5px solid rgba(255,255,255,0.18)",
                    }}
                  />

                  <Typography
                    sx={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: isActive ? 700 : 500,
                      fontSize: "0.82rem",
                      color: isActive
                        ? "#fff"
                        : "rgba(255,255,255,0.72)",
                    }}
                  >
                    {t.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Fade>
      </Box>

      {/* ── UniCart + Smart Planner ─────────────────── */}
      {PILL_TABS.map((t) => {
        const isActive = tab === t.index;
        const isUniCart = t.index === 2;

        const button = (
          <Box
            onClick={() => setTab(t.index)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              px: 1.6,
              py: 0.6,
              borderRadius: "999px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              fontSize: "0.8rem",
              transition: "all 0.18s ease",
              ...(isActive
                ? {
                    bgcolor: isUniCart
                      ? "rgba(20,180,160,0.25)"
                      : "rgba(255,186,50,0.22)",
                    border: `1.5px solid ${
                      isUniCart
                        ? "rgba(20,180,160,0.65)"
                        : "rgba(255,186,50,0.60)"
                    }`,
                    color: isUniCart ? "#4ef0de" : "#ffd566",
                  }
                : {
                    bgcolor: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.18)",
                    color: "rgba(255,255,255,0.75)",
                  }),
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: isActive
                  ? isUniCart
                    ? "#4ef0de"
                    : "#ffd566"
                  : "rgba(255,255,255,0.30)",
              }}
            />

            {t.label}
          </Box>
        );

        return t.href ? (
          <Link key={t.index} href={t.href} style={{ textDecoration: "none" }}>
            {button}
          </Link>
        ) : (
          <React.Fragment key={t.index}>{button}</React.Fragment>
        );
      })}
    </Box>
  );
}