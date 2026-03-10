import type { Category } from "./types";

export const RED = "#A80532";

export const CAT_COLORS: Record<Category, string> = {
  "Martial Arts": "#dc2626",
  Court:   "#2563eb",
  Field:   "#16a34a",
  Water:   "#0891b2",
  Dance:   "#9333ea",
  Strategy:    "#d97706",
  Fitness: "#ea580c",
  Other:   "#6b7280",
};

export const ALL_CATS = [
  "All",
  "Martial Arts",
  "Court",
  "Field",
  "Water",
  "Dance",
  "Strategy",
  "Fitness",
  "Other",
] as const;

export type CatFilter = (typeof ALL_CATS)[number];
