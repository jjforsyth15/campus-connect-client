// BACKEND TODO: Replace this client-side ID generator with
// the primary key returned from the database after a successful
// INSERT (e.g., UUID v4 from PostgreSQL, or a Firestore doc ID).
// Never trust a client-generated ID as the authoritative record key.
export function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

// BACKEND TODO: `formatRelative` is purely presentational — keep
// it client-side. However, the backend should always store and
// return timestamps in UTC ISO-8601 (e.g., createdAt from DB).
// Do NOT let the client set createdAt; derive it server-side
// (DEFAULT NOW() in SQL, or serverTimestamp() in Firestore).
export function formatRelative(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

// BACKEND TODO: This email domain check MUST be mirrored in the
// backend as authoritative validation. Do not rely solely on the
// frontend check — a user could bypass it via direct API calls.
// Recommended: add a server-side middleware/guard that validates
// req.body.email.endsWith("@my.csun.edu") before any DB write.
// Even better: tie this to CSUN SSO/OAuth so the email is pulled
// from the authenticated session rather than user input.
export function isCsunEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@my.csun.edu");
}

// BACKEND TODO: SUBJECT_CHIPS drives the subject filter UI.
// Long-term, fetch these dynamically from the backend so admins
// can add/remove subjects without a code deploy.
// Suggested API: GET /api/note-share/subjects → string[]
// Cache the response client-side (SWR / React Query) with a
// short TTL since subjects change infrequently.
export const SUBJECT_CHIPS = ["All", "COMP", "MATH", "ENGL", "PHYS", "BUS", "ART", "BIOL"];

// BACKEND TODO: TOPIC_TAGS is similarly hardcoded.
// Move to a DB table (e.g., `note_tags`) so tags can be managed
// dynamically and you can track usage counts per tag to surface
// popular ones first.
// Suggested API: GET /api/note-share/tags → { name: string; usageCount: number }[]
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
