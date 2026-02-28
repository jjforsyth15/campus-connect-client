"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Club } from "./clubs.data";
import { CLUB_CATEGORIES } from "./clubs.data";
import { Box, Button, Chip, Divider, TextField, Typography } from "@mui/material";
import { btnGhost, btnPrimary } from "./ClubsStates";
import FlipClubCard from "./FlipClubCard";
import GlassPanel from "./GlassPanels";
import AuroraBackground from "./AuroraBackground";

type Props = { clubs: Club[]; mode: "hub" | "club"; club?: Club };

// ─── VERTICAL WORD ART ────────────────────────────────────────────────────────
function VerticalWordArt({ left = true, words }: { left?: boolean; words: string[] }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 50,
        bottom: 40,
        [left ? "left" : "right"]: { xs: -8, md: 4, lg: 12 },
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        justifyContent: "space-around",
        pointerEvents: "none",
        opacity: 0.28,
        zIndex: 0,
      }}
    >
      {words.map((w) => (
        <Typography
          key={w}
          sx={{
            color: "white",
            fontWeight: 900,
            fontSize: 52,
            letterSpacing: 6,
            writingMode: "vertical-rl",
            transform: left ? "rotate(180deg)" : "none",
            textTransform: "uppercase",
            userSelect: "none",
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            textShadow: "0 0 30px rgba(255,30,60,0.4)",
          }}
        >
          {w}
        </Typography>
      ))}
    </Box>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  STEM:        "rgba(59,130,246,0.80)",
  Business:    "rgba(16,185,129,0.80)",
  Arts:        "rgba(236,72,153,0.80)",
  Cultural:    "rgba(245,158,11,0.80)",
  Sports:      "rgba(239,68,68,0.80)",
  Literature:  "rgba(139,92,246,0.80)",
  Fraternity:  "rgba(20,184,166,0.80)",
  Sorority:    "rgba(244,114,182,0.80)",
};

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const accent = CATEGORY_COLORS[label];
  return (
    <Chip
      label={label}
      onClick={onClick}
      sx={{
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12,
        letterSpacing: 0.4,
        height: 30,
        transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "&:active": { transform: "scale(0.92)" },
        ...(active
          ? {
              bgcolor: accent ?? "rgba(255,255,255,0.92)",
              color: "white",
              border: `1px solid ${accent ?? "rgba(255,255,255,0.6)"}`,
              boxShadow: `0 4px 16px ${accent ?? "rgba(255,255,255,0.2)"}44`,
              "&:hover": { filter: "brightness(1.12)", transform: "translateY(-2px)" },
            }
          : {
              bgcolor: "rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(255,255,255,0.14)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.13)", transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" },
            }),
      }}
    />
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ClubsUI({ clubs, mode, club }: Props) {
  const [tab, setTab] = useState<"discover" | "mine">("discover");
  const [search, setSearch] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  // BACKEND: Replace with authenticated user's club memberships.
  // Example:
  //   const { data: rows } = await supabase
  //     .from('club_members').select('club_id').eq('user_id', session.user.id)
  //   const myClubIds = new Set(rows?.map(r => r.club_id))
  const myClubIds = useMemo(() => new Set<string>(["club-001", "club-002"]), []);

  function toggleCategory(cat: string) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return clubs
      .filter((c) => (tab === "mine" ? myClubIds.has(c.id) : true))
      .filter((c) => activeCategories.size === 0 ? true : activeCategories.has(c.category ?? ""))
      .filter((c) => {
        if (!q) return true;
        return [c.name, c.tagline, c.description, c.category, ...(c.tags ?? []), c.card?.headline, c.card?.blurb, ...(c.card?.chips ?? [])]
          .filter(Boolean).join(" ").toLowerCase().includes(q);
      });
  }, [clubs, tab, myClubIds, search, activeCategories]);

  if (mode === "club") {
    return (
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: "white", fontWeight: 900, fontSize: 28 }}>{club?.name ?? "Club"}</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1 }}>This view is handled by /clubs/[id].</Typography>
      </Box>
    );
  }

  return (
    <AuroraBackground>
      <Box sx={{ position: "relative", minHeight: "100vh" }}>
        <VerticalWordArt left words={["COMMUNITY", "CONNECT", "GROW"]} />
        <VerticalWordArt left={false} words={["BUILD", "CREATE", "JOIN"]} />

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <Box sx={{ px: { xs: 3, md: 8, lg: 14 }, pt: { xs: 5, md: 7 }, pb: 3, textAlign: "center", position: "relative", zIndex: 1 }}>
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: 52, md: 80 },
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -2,
              textShadow: "0 4px 40px rgba(220,20,40,0.55), 0 0 80px rgba(255,0,40,0.25)",
              fontFamily: "'Arial Black', 'Impact', sans-serif",
            }}
          >
            Club Connect
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.60)", mt: 2, fontSize: { xs: 15, md: 18 }, maxWidth: 540, mx: "auto", fontWeight: 400 }}>
            Discover communities, join clubs, find events, and build your network.
          </Typography>

          <Box sx={{ display: "flex", gap: 1.2, mt: 3.5, justifyContent: "center" }}>
            <Button onClick={() => setTab("discover")} sx={tab === "discover" ? { ...btnPrimary, px: 2.8 } : { ...btnGhost, px: 2.8 }}>
              Discover
            </Button>
            <Button onClick={() => setTab("mine")} sx={tab === "mine" ? { ...btnPrimary, px: 2.8 } : { ...btnGhost, px: 2.8 }}>
              My Clubs
            </Button>
          </Box>
        </Box>

        {/* ── SEARCH + FILTERS ──────────────────────────────────────────────── */}
        <Box sx={{ px: { xs: 2, md: 6, lg: 12 }, pb: 2, position: "relative", zIndex: 1 }}>
          <GlassPanel>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr auto" }, gap: 1.5, alignItems: "center" }}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search clubs, tags, keywords..."
                fullWidth
                variant="outlined"
                InputProps={{
                  sx: {
                    borderRadius: 999,
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                    color: "white",
                    px: 1.2,
                    "& input::placeholder": { color: "rgba(255,255,255,0.45)", opacity: 1 },
                    "& fieldset": { borderColor: "rgba(255, 255, 255, 0.89)" },
                    "&:hover fieldset": { borderColor: "rgb(255, 255, 255)" },
                    "&.Mui-focused fieldset": { borderColor: "rgba(220,20,40,0.70)" },
                  },
                }}
              />
              <Button onClick={() => { setSearch(""); setActiveCategories(new Set()); }} sx={{ ...btnGhost, whiteSpace: "nowrap", minWidth: 80 }}>
                Clear
              </Button>
            </Box>

            {/* Category filter chips */}
            <Box sx={{ display: "flex", gap: 0.9, flexWrap: "wrap", mt: 1.8 }}>
              <FilterChip label="All" active={activeCategories.size === 0} onClick={() => setActiveCategories(new Set())} />

              {/* BACKEND: CLUB_CATEGORIES can be replaced with a dynamic Supabase query:
                  SELECT DISTINCT category FROM clubs ORDER BY category */}
              {CLUB_CATEGORIES.map((cat) => (
                <FilterChip key={cat} label={cat} active={activeCategories.has(cat)} onClick={() => toggleCategory(cat)} />
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1.5 }}>
              <Typography sx={{ color: "rgba(255,255,255,0.55)", fontWeight: 700, fontSize: 13 }}>
                {filtered.length} club{filtered.length !== 1 ? "s" : ""}
              </Typography>
              <Typography sx={{ color: "rgba(255, 255, 255, 0.35)", fontWeight: 600, fontSize: 11 }}>
                Click a card to flip it
              </Typography>
            </Box>
          </GlassPanel>
        </Box>

        {/* ── GRID ──────────────────────────────────────────────────────────── */}
        <Box sx={{ px: { xs: 2, md: 6, lg: 12 }, pb: 8, position: "relative", zIndex: 1 }}>
          <Divider sx={{ borderColor: "rgba(255,255,255,0.07)", mb: 2.5 }} />

          {filtered.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography sx={{ color: "rgba(255, 0, 0, 0.4)", fontSize: 16 }}>No clubs match your search.</Typography>
              <Button onClick={() => { setSearch(""); setActiveCategories(new Set()); }} sx={{ ...btnGhost, mt: 2 }}>Clear filters</Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr", xl: "repeat(4, 1fr)" },
                gap: 2.5,
                alignItems: "stretch",
              }}
            >
              {/* BACKEND: clubs come from Supabase and are passed as props from a Server Component.
                  Example parent (page.tsx):
                    const clubs = await getClubs()  ← replaces static import
                    return <ClubsUI clubs={clubs} mode="hub" /> */}
              {filtered.map((c) => <FlipClubCard key={c.id} club={c} />)}
            </Box>
          )}
        </Box>
      </Box>
    </AuroraBackground>
  );
}
