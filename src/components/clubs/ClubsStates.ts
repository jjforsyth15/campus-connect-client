export const MAROON = "#7b001c";
export const MAROON_DARK = "#2a0010";

export function safeLower(s: string) {
  return (s ?? "").trim().toLowerCase();
}


export const chipGhost = {
  bgcolor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 700,
};

export const chipActive = {
  bgcolor: "rgba(255,255,255,0.92)",
  color: MAROON,
  fontWeight: 900,
};

export const chipLight = {
  bgcolor: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.10)",
  fontWeight: 700,
};

export const btnGhost = {
  borderRadius: 3,
  px: 2,
  py: 1,
  color: "white",
  border: "1px solid rgba(255,255,255,0.20)",
  bgcolor: "rgba(255,255,255,0.10)",
  fontWeight: 800,
  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
};

export const btnPrimary = {
  borderRadius: 3,
  px: 2.2,
  py: 1,
  bgcolor: "rgba(255,255,255,0.92)",
  color: MAROON,
  fontWeight: 900,
  "&:hover": { bgcolor: "rgba(255,255,255,0.96)" },
};

export const btnPrimaryWide = { ...btnPrimary, py: 1.35 };

export const btnMaroon = {
  borderRadius: 3,
  bgcolor: MAROON,
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "#650016" },
};

export const btnBlack = {
  borderRadius: 3,
  bgcolor: "black",
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
};

export const btnOutline = {
  borderRadius: 3,
  bgcolor: "white",
  color: MAROON_DARK,
  fontWeight: 900,
  px: 2.2,
  border: "1px solid rgba(0,0,0,0.12)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
};

export const inputSx = {
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& input::placeholder": { color: "rgba(255,255,255,0.55)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
};

export const selectSx = {
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
};
