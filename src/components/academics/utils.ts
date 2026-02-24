import type { SemesterBucket } from "./constants";

export function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

export function norm(s: string) {
  return (s ?? "").trim();
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function rmpSearchUrl(profName: string) {
  return `https://www.ratemyprofessors.com/search/professors/1800?q=${encodeURIComponent(profName)}`;
}

export function loadState(key: string): { semesters: SemesterBucket[]; selectedSemesterId: string } | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (!Array.isArray(parsed.semesters)) return null;
    if (typeof parsed.selectedSemesterId !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(key: string, data: { semesters: SemesterBucket[]; selectedSemesterId: string }) {
  try {
    if (typeof window !== "undefined") localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}