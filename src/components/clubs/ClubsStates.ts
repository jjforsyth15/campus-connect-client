// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Centralised style constants for the Clubs hub.
// BACKEND: Colors can be fetched from a `site_config` Supabase table if needed.

export const MAROON = "#B4002E";
export const MAROON_DARK = "#2A0010";
export const ORANGE_GLOW = "#FF4500";
export const RED_HOT = "#FF1A1A";

export function safeLower(s: string) {
  return (s ?? "").trim().toLowerCase();
}

// ─── CHIP VARIANTS ────────────────────────────────────────────────────────────

export const chipGhost = {
  bgcolor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 800,
  transition: "all 0.18s ease",
  "&:hover": { bgcolor: "rgba(255,255,255,0.16)" },
};

export const chipActive = {
  bgcolor: "rgba(255,255,255,0.92)",
  color: MAROON,
  fontWeight: 950,
  transition: "all 0.18s ease",
};

export const chipLight = {
  bgcolor: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.10)",
  fontWeight: 800,
};

// ─── BUTTON VARIANTS ──────────────────────────────────────────────────────────
// All buttons share animated hover/active states.

const btnBase = {
  borderRadius: 999,
  transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
  "&:active": { transform: "scale(0.95)" },
};

export const btnGhost = {
  ...btnBase,
  px: 2.2,
  py: 1,
  color: "white",
  border: "1px solid rgba(255,255,255,0.20)",
  bgcolor: "rgba(255,255,255,0.10)",
  fontWeight: 900,
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.16)",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
  },
};

export const btnPrimary = {
  ...btnBase,
  px: 2.6,
  py: 1,
  bgcolor: "rgba(255,255,255,0.92)",
  color: MAROON,
  fontWeight: 950,
  "&:hover": {
    bgcolor: "rgba(255,255,255,1)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 28px rgba(255,255,255,0.25)",
  },
};

export const btnPrimaryWide = {
  ...btnPrimary,
  py: 1.35,
};

export const btnMaroon = {
  ...btnBase,
  borderRadius: 999,
  bgcolor: MAROON,
  color: "white",
  fontWeight: 950,
  px: 2.6,
  "&:hover": {
    bgcolor: "#980026",
    transform: "translateY(-2px)",
    boxShadow: `0 8px 24px ${MAROON}66`,
  },
};

export const btnBlack = {
  ...btnBase,
  borderRadius: 999,
  bgcolor: "rgba(0,0,0,0.90)",
  color: "white",
  fontWeight: 950,
  px: 2.6,
  "&:hover": {
    bgcolor: "rgba(0,0,0,0.80)",
    transform: "translateY(-2px)",
  },
};

export const btnOutline = {
  ...btnBase,
  borderRadius: 999,
  bgcolor: "white",
  color: MAROON_DARK,
  fontWeight: 950,
  px: 2.6,
  border: "1px solid rgba(0,0,0,0.12)",
  "&:hover": {
    bgcolor: "rgba(255,255,255,0.92)",
    transform: "translateY(-2px)",
  },
};

// ─── INPUT STYLES ─────────────────────────────────────────────────────────────

export const inputSx = {
  borderRadius: 999,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& input::placeholder": { color: "rgba(255,255,255,0.55)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
};

export const selectSx = {
  borderRadius: 999,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
};
