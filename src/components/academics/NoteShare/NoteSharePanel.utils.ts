export function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

export function formatRelative(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export function isCsunEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@my.csun.edu");
}

export const SUBJECT_CHIPS = ["All", "COMP", "MATH", "ENGL", "PHYS", "BUS", "ART", "BIOL"];

export const TOPIC_TAGS = [
  "AI",
  "STEM",
  "Computer Science",
  "Math",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Art",
  "Design",
  "Music",
  "Literature",
  "Writing",
  "History",
  "Psychology",
  "Business",
  "Economics",
  "Language",
  "Philosophy",
];
