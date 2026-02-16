import type { SxProps, Theme } from "@mui/material/styles";

export const CS_PLAN_URL =
  "https://www.csun.edu/current-students/degree-progress-report-and-planner-guide";

export const BG = `radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.10), transparent 55%),
linear-gradient(180deg, rgba(168,5,50,1) 0%, rgba(120,0,35,0.98) 55%, rgba(168,5,50,1) 100%)`;

export const LS_KEY = "academics.degreePlanner.v1";

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
  "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.55)", opacity: 1 },
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
