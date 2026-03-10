"use client";
// =============================================================================
// context/ThemeContext.tsx
// Provides theme (light / dark) throughout the social feed.
// Dark mode uses CSUN crimson (#A80532) accents on dark charcoal backgrounds.
// =============================================================================

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Theme } from "../types/feed.types";

interface ThemeCtx {
  theme: "light" | "dark";
  rawTheme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({
  theme: "light",
  rawTheme: "system",
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

// ── CSS custom properties ─────────────────────────────────────────────────────
// Light palette
const LIGHT_VARS: Record<string, string> = {
  "--csun-red":         "#A80532",
  "--csun-red-dark":    "#7B0124",
  "--csun-red-dim":     "rgba(168,5,50,0.08)",
  "--csun-red-glow":    "rgba(168,5,50,0.25)",
  "--bg-base":          "#F2F4F8",
  "--bg-surface":       "#FFFFFF",
  "--bg-elevated":      "#FFFFFF",
  "--bg-hover":         "#F5F7FA",
  "--bg-input":         "#F0F2F6",
  "--header-blur":      "rgba(242,244,248,0.85)",
  "--border-subtle":    "#E2E5EB",
  "--border-medium":    "#CDD1DA",
  "--text-primary":     "#0F1117",
  "--text-secondary":   "#525A6A",
  "--text-muted":       "#8C95A3",
  "--success":          "#0A9E6B",
  "--success-dim":      "rgba(10,158,107,0.10)",
  "--info":             "#1D6EE8",
  "--info-dim":         "rgba(29,110,232,0.10)",
  "--danger":           "#DC2626",
  "--danger-dim":       "rgba(220,38,38,0.10)",
  "--accent-gold":      "#D97706",
  "--accent-gold-dim":  "rgba(217,119,6,0.10)",
  "--shadow-sm":        "0 1px 2px rgba(0,0,0,0.04),0 1px 3px rgba(0,0,0,0.06)",
  "--shadow-card":      "0 2px 8px rgba(0,0,0,0.06),0 4px 20px rgba(0,0,0,0.08)",
  "--shadow-panel":     "0 4px 16px rgba(0,0,0,0.08),0 12px 40px rgba(0,0,0,0.10)",
  "--radius-sm":        "8px",
  "--radius-md":        "12px",
  "--radius-lg":        "18px",
  "--radius-xl":        "24px",
  "--transition-fast":  "150ms ease",
  "--transition-base":  "250ms ease",
  "--font-display":     "'Sora', system-ui, sans-serif",
  "--font-ui":          "'DM Sans', system-ui, sans-serif",
};

// Dark palette — charcoal backgrounds + CSUN crimson accents
const DARK_VARS: Record<string, string> = {
  "--csun-red":         "#CF1047",
  "--csun-red-dark":    "#A80532",
  "--csun-red-dim":     "rgba(207,16,71,0.15)",
  "--csun-red-glow":    "rgba(207,16,71,0.30)",
  "--bg-base":          "#1A1217",          // very dark charcoal with warm red tint
  "--bg-surface":       "#231820",          // card surface — deep warm dark
  "--bg-elevated":      "#2C1F25",          // elevated — slightly lighter
  "--bg-hover":         "#341E27",          // hover state — subtle crimson tint
  "--bg-input":         "#291A20",          // input background
  "--header-blur":      "rgba(26,18,23,0.88)",
  "--border-subtle":    "#3D2630",          // subtle border with red warmth
  "--border-medium":    "#4E2E3A",          // stronger border
  "--text-primary":     "#F5EFF1",          // off-white with warm tint
  "--text-secondary":   "#C2A8B2",          // warm grey
  "--text-muted":       "#7A5C66",          // muted warm grey
  "--success":          "#22C55E",
  "--success-dim":      "rgba(34,197,94,0.12)",
  "--info":             "#60A5FA",
  "--info-dim":         "rgba(96,165,250,0.12)",
  "--danger":           "#F87171",
  "--danger-dim":       "rgba(248,113,113,0.12)",
  "--accent-gold":      "#FBBF24",
  "--accent-gold-dim":  "rgba(251,191,36,0.12)",
  "--shadow-sm":        "0 1px 2px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.4)",
  "--shadow-card":      "0 2px 8px rgba(0,0,0,0.4),0 4px 20px rgba(0,0,0,0.5)",
  "--shadow-panel":     "0 4px 16px rgba(0,0,0,0.5),0 12px 40px rgba(0,0,0,0.6)",
  "--radius-sm":        "8px",
  "--radius-md":        "12px",
  "--radius-lg":        "18px",
  "--radius-xl":        "24px",
  "--transition-fast":  "150ms ease",
  "--transition-base":  "250ms ease",
  "--font-display":     "'Sora', system-ui, sans-serif",
  "--font-ui":          "'DM Sans', system-ui, sans-serif",
};

function applyVars(vars: Record<string, string>, isDark: boolean) {
  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  // Override the global background
  root.style.setProperty("--bg", vars["--bg-base"] ?? (isDark ? "#1A1217" : "#F2F4F8"));
  document.body.style.setProperty("background-color", vars["--bg-base"] ?? "", "important");
}

function resolveTheme(raw: Theme): "light" | "dark" {
  if (raw === "dark")  return "dark";
  if (raw === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [rawTheme, setRawTheme] = useState<Theme>("light");

  const resolved: "light" | "dark" = typeof window !== "undefined"
    ? resolveTheme(rawTheme)
    : "light";

  // Apply vars whenever theme changes
  useEffect(() => {
    const resolved = resolveTheme(rawTheme);
    const isDark = resolved === "dark";
    applyVars(isDark ? DARK_VARS : LIGHT_VARS, isDark);

    // Persist
    localStorage.setItem("cc_theme", rawTheme);
  }, [rawTheme]);

  // Restore from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cc_theme") as Theme | null;
    if (saved && ["light", "dark", "system"].includes(saved)) {
      setRawTheme(saved);
    }
  }, []);

  function toggleTheme() {
    setRawTheme(prev => (resolveTheme(prev) === "dark" ? "light" : "dark"));
  }

  const isDark = resolved === "dark";

  return (
    <Ctx.Provider value={{ theme: resolved, rawTheme, isDark, toggleTheme, setTheme: setRawTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export function useTheme() {
  return useContext(Ctx);
}
