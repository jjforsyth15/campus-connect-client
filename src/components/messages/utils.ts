import type { Attachment, ID, Message } from "@/types/messages";

export const scrollBarSx = {
  "&::-webkit-scrollbar": { width: 10, height: 10 },
  "&::-webkit-scrollbar-track": { bgcolor: "rgba(0,0,0,0.05)", borderRadius: 8 },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "rgba(0,0,0,0.25)",
    borderRadius: 8,
    "&:hover": { bgcolor: "rgba(0,0,0,0.35)" },
  },
} as const;

export const panelScrollSx = {
  overflowY: "auto",
  overflowX: "hidden",
  minHeight: 0,
  overscrollBehavior: "contain",
  ...scrollBarSx,
} as const;

export type DraftState = { text: string; files: File[]; gifs: Attachment[] };

export function emptyDraft(): DraftState {
  return { text: "", files: [], gifs: [] };
}

export function formatAgo(nowMs: number, createdAt: number): string {
  const diff = nowMs - createdAt;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

export function activityText(nowMs: number, lastActiveAt: number): string {
  const diffM = Math.floor((nowMs - lastActiveAt) / 60000);
  if (diffM <= 2) return "Active now";
  if (diffM < 60) return `Active ${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `Active ${diffH}h ago`;
  return `Active ${Math.floor(diffH / 24)}d ago`;
}

export function getLastMessage(all: Message[], threadId: ID): Message | null {
  const ms = all.filter((m) => m.threadId === threadId);
  if (!ms.length) return null;
  return ms.sort((a, b) => b.createdAt - a.createdAt)[0];
}

export function isThreadUnread(all: Message[], threadId: ID, meId: ID): boolean {
  const last = getLastMessage(all, threadId);
  if (!last || last.fromUserId === meId) return false;
  return !new Set(last.seenByUserIds ?? []).has(meId);
}

export const GIF_LIST: { url: string; title: string }[] = [
  { url: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", title: "wow" },
  { url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", title: "lets go" },
  { url: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif", title: "nice" },
  { url: "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif", title: "typing" },
  { url: "https://media.giphy.com/media/xT0GqFhyNd0Wmfo6sM/giphy.gif", title: "omg" },
  { url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", title: "party" },
  { url: "https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif", title: "hype" },
  { url: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", title: "yay" },
  { url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", title: "nope" },
  { url: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif", title: "facepalm" },
  { url: "https://media.giphy.com/media/3o6ZsWwQGQWbFhJ6xO/giphy.gif", title: "fire" },
  { url: "https://media.giphy.com/media/l0HlMG1EX2H38cZeE/giphy.gif", title: "shocked" },
];
