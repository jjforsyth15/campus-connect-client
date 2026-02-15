import type { Message, Note, Thread, User } from "@/types/messages";

const BASE = "/api/messages";

export type ThreadsResponse = { threads: Thread[]; users: User[] };
export type NotesResponse = { notes: Note[] };
export type MessagesResponse = { messages: Message[] };

export async function fetchThreads(): Promise<ThreadsResponse> {
  const res = await fetch(BASE + "/threads");
  if (!res.ok) throw new Error(res.status === 501 ? "Backend not connected" : await res.text());
  return res.json();
}

export async function fetchNotes(): Promise<NotesResponse> {
  const res = await fetch(BASE + "/notes");
  if (!res.ok) throw new Error(res.status === 501 ? "Backend not connected" : await res.text());
  return res.json();
}

export async function fetchThreadMessages(threadId: string): Promise<MessagesResponse> {
  const res = await fetch(`${BASE}/threads/${encodeURIComponent(threadId)}/messages`);
  if (!res.ok) throw new Error(res.status === 501 ? "Backend not connected" : await res.text());
  return res.json();
}

export async function sendMessage(_payload: {
  threadId: string;
  text: string;
  attachmentUrls?: string[];
}): Promise<void> {
  const res = await fetch(BASE + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(_payload),
  });
  if (!res.ok && res.status !== 501) throw new Error(await res.text());
}

export async function updateNote(_text: string): Promise<void> {
  const res = await fetch(BASE + "/notes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: _text }),
  });
  if (!res.ok && res.status !== 501) throw new Error(await res.text());
}

/** Placeholder: create thread (new conversation). Backend returns thread. */
export async function createThread(_userId: string): Promise<Thread | null> {
  const res = await fetch(BASE + "/threads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: _userId }),
  });
  if (res.status === 501 || !res.ok) return null;
  const data = await res.json();
  return data.thread ?? null;
}
