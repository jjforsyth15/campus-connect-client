"use client";

import type { SxProps, Theme } from "@mui/material/styles";

// Constants

export const CS_PLAN_URL =
  "https://www.csun.edu/current-students/degree-progress-report-and-planner-guide";

export const BG = `radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.10), transparent 55%),
linear-gradient(180deg, rgba(168,5,50,1) 0%, rgba(120,0,35,0.98) 55%, rgba(168,5,50,1) 100%)`;

export const LS_KEY = "academics.degreePlanner.v1";

// Types

export type ToastType = "info" | "success" | "warning" | "error";

export type LectureNote = {
  id: string;
  author: string;
  topicTitle: string;
  body: string;
  createdAt: string;
};

export type ResourceItem = {
  id: string;
  label: string;
  url?: string;
  fileName?: string;
  createdAt: string; 
};

export type CourseItem = {
  id: string;
  subject: string;
  number: string;
  title?: string;
  professor?: string;
  description?: string;
  prerequisitesText?: string;
  notes: LectureNote[];
  resources: ResourceItem[];
};

export type SemesterBucket = {
  id: string;
  courses: CourseItem[];
};

export type MajorPlan = {
  plan_id: string;
  plan_title: string;
  plan_type?: string;
  academic_groups_id?: string;
  academic_groups_title?: string;
};

// Light helpers

export function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

export function norm(s: string) {
  return s.trim();
}

export function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function rmpSearchUrl(profName: string) {
  const q = encodeURIComponent(profName);
  return `https://www.ratemyprofessors.com/search/professors/1800?q=${q}`;
}

export function loadState(
  key: string
): { semesters: SemesterBucket[]; selectedSemesterId: string } | null {
  try {
    const raw = localStorage.getItem(key);
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

export function saveState(
  key: string,
  data: { semesters: SemesterBucket[]; selectedSemesterId: string }
) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
}

//Backend empty endpoints 

function baseApi() {
  
  return (process.env.NEXT_PUBLIC_API_URL ?? "").trim();
}

function apiUrl(path: string) {
  const base = baseApi();
  if (!base) return path; 
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiHydrateCourse(args: {
  subject: string;
  number: string;
  semesterLabel: string;
}): Promise<{
  title?: string;
  description?: string;
  prerequisitesText?: string;
  professor?: string;
}> {
  try {
    const params = new URLSearchParams({
      subject: args.subject,
      number: args.number,
      semesterLabel: args.semesterLabel,
    });

    // Empty endpoint – backend implements
    const res = await fetch(apiUrl(`/api/v1/academics/course?${params.toString()}`), {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) return {};
    const json = await res.json().catch(() => ({}));

    return {
      title: typeof json?.title === "string" ? json.title : undefined,
      description: typeof json?.description === "string" ? json.description : undefined,
      prerequisitesText: typeof json?.prerequisitesText === "string" ? json.prerequisitesText : undefined,
      professor: typeof json?.professor === "string" ? json.professor : undefined,
    };
  } catch {
    return {};
  }
}

export async function apiFetchMajors(): Promise<
  | { ok: true; data: MajorPlan[] }
  | { ok: false; error: string }
> {
  try {
    // Empty endpoint – backend implements
    const res = await fetch(apiUrl(`/api/v1/academics/majors`), { cache: "no-store" });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };

    const json = await res.json().catch(() => ([]));
    const list: any[] = Array.isArray(json) ? json : json?.items ?? json?.plans ?? [];

    // Light shape mapping only (no heavy logic)
    const mapped: MajorPlan[] = list
      .map((p) => ({
        plan_id: String(p?.plan_id ?? p?.id ?? ""),
        plan_title: String(p?.plan_title ?? p?.title ?? p?.name ?? ""),
        plan_type: typeof p?.plan_type === "string" ? p.plan_type : undefined,
        academic_groups_id: typeof p?.academic_groups_id === "string" ? p.academic_groups_id : undefined,
        academic_groups_title: typeof p?.academic_groups_title === "string" ? p.academic_groups_title : undefined,
      }))
      .filter((p) => p.plan_id && p.plan_title);

    return { ok: true, data: mapped };
  } catch {
    return { ok: false, error: "Network error / endpoint not available yet." };
  }
}

// Styling helpers

export const btnPrimary: SxProps<Theme> = {
  bgcolor: "#A80532",
  "&:hover": { bgcolor: "#810326" },
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
};

export const btnGhost: SxProps<Theme> = {
  borderColor: "rgba(255,255,255,0.40)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
  "&:hover": { borderColor: "rgba(255,255,255,0.70)", bgcolor: "rgba(255,255,255,0.06)" },
};

export const btnGhostDark: SxProps<Theme> = {
  borderColor: "rgba(0,0,0,0.20)",
  color: "rgba(0,0,0,0.80)",
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
  "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
};

export const btnDark: SxProps<Theme> = {
  bgcolor: "rgba(0,0,0,0.86)",
  "&:hover": { bgcolor: "rgba(0,0,0,0.95)" },
  fontWeight: 950,
  borderRadius: 999,
  px: 2.1,
};

export const btnOutlineRed: SxProps<Theme> = {
  borderColor: "#A80532",
  color: "#A80532",
  fontWeight: 950,
  borderRadius: 999,
  "&:hover": { borderColor: "#810326", color: "#810326", bgcolor: "rgba(168,5,50,0.04)" },
};

export const btnOutlineGray: SxProps<Theme> = {
  borderColor: "rgba(0,0,0,0.25)",
  color: "rgba(0,0,0,0.75)",
  fontWeight: 950,
  borderRadius: 999,
  "&:hover": { borderColor: "rgba(0,0,0,0.45)", bgcolor: "rgba(0,0,0,0.04)" },
};

export const fieldSx: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.08)",
    color: "#fff",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.20)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.32)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.55)" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.55)",
    opacity: 1,
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
};

export const selectSx: SxProps<Theme> = {
  bgcolor: "rgba(255,255,255,0.08)",
  color: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.20)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.32)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.55)" },
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
};
