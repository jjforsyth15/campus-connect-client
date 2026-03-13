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

export function formatDateOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatTimeOnly(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function rmpSearchUrl(profName: string) { //todo: fix rate my professor quicklink vram attempted 
  return `https://www.ratemyprofessors.com/search/professors/1800?q=${encodeURIComponent(profName)}`;
}

export function daysUntil(iso: string): number {
  const now = new Date();
  const target = new Date(iso);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isPast(iso: string): boolean {
  return new Date(iso) < new Date();
}

/** Check if two time ranges on the same day conflict */
export function timesConflict(
  days1: string[], start1: string, end1: string,
  days2: string[], start2: string, end2: string
): boolean {
  if (!start1 || !end1 || !start2 || !end2) return false;
  const sharedDays = days1.filter((d) => days2.includes(d));
  if (!sharedDays.length) return false;
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const s1 = toMin(start1), e1 = toMin(end1);
  const s2 = toMin(start2), e2 = toMin(end2);
  return s1 < e2 && s2 < e1;
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

/** Format 24h time string to 12h display */
export function fmt12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/* Build CSUN catalog URL for a course */
export function catalogUrl(department: string, courseCode: string) {
  // Format: https://catalog.csun.edu/academics/{department}/courses/{section}
  // e.g. https://catalog.csun.edu/academics/comp/courses/comp-310/
  const dept = department.toLowerCase();
  const code = courseCode.toLowerCase().replace(/\s+/, "-");
  return `https://catalog.csun.edu/academics/${dept}/courses/${code}/`;
}
