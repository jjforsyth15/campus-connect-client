"use client";

/**
 * UI-only container: owns draft, dialogs, filters. Data and mutations come from page/API.
 */

import * as React from "react";
import type { Attachment, ID, Message, Note, Thread, User } from "@/types/messages";
import MessagesShell from "./MessagesShell";

const RED = "#A80532";

type DraftState = { text: string; files: File[]; gifs: Attachment[] };
const emptyDraft = (): DraftState => ({ text: "", files: [], gifs: [] });

function formatAgo(nowMs: number, createdAt: number) {
  const diff = nowMs - createdAt;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function activityText(nowMs: number, lastActiveAt: number) {
  const diffM = Math.floor((nowMs - lastActiveAt) / 60000);
  if (diffM <= 2) return "Active now";
  if (diffM < 60) return `Active ${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `Active ${diffH}h ago`;
  return `Active ${Math.floor(diffH / 24)}d ago`;
}

function getLastMessage(all: Message[], threadId: ID) {
  const ms = all.filter((m) => m.threadId === threadId);
  if (!ms.length) return null;
  return ms.sort((a, b) => b.createdAt - a.createdAt)[0];
}

function isThreadUnreadForMe(all: Message[], threadId: ID, meId: ID) {
  const last = getLastMessage(all, threadId);
  if (!last) return false;
  if (last.fromUserId === meId) return false;
  const seen = new Set(last.seenByUserIds ?? []);
  return !seen.has(meId);
}

function safeJsonParse<T>(s: string | null, fallback: T): T {
  try {
    if (!s) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

export type MessagesContainerProps = {
  red: string;
  me: User;
  meId: ID;
  threads: Thread[];
  users: User[];
  notes: Note[];
  allMessages: Message[];
  threadMessages: Message[];
  selectedThreadId: ID | null;
  onSelectedThreadIdChange: (id: ID | null) => void;
  onSend: (threadId: string, text: string, attachmentUrls?: string[]) => Promise<void>;
  onUpdateNote: (text: string) => Promise<void>;
  onPickUser: (userId: ID) => Promise<void>;
  onRefresh: () => void;
};

export default function MessagesContainer({
  me,
  meId,
  threads,
  users,
  notes,
  allMessages,
  threadMessages,
  selectedThreadId,
  onSelectedThreadIdChange,
  onSend,
  onUpdateNote,
  onPickUser,
  onRefresh,
}: MessagesContainerProps) {
  const [activeTab, setActiveTab] = React.useState<"messages" | "requests">("messages");
  const [threadSearch, setThreadSearch] = React.useState("");
  const [blockedUserIds, setBlockedUserIds] = React.useState<Set<ID>>(new Set());
  const [reportedThreadIds, setReportedThreadIds] = React.useState<Set<ID>>(new Set());
  const [newMsgOpen, setNewMsgOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [gifOpen, setGifOpen] = React.useState(false);
  const [imgView, setImgView] = React.useState<{ open: boolean; url: string; name: string }>({
    open: false,
    url: "",
    name: "",
  });
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportDetails, setReportDetails] = React.useState("");
  const [gifFavorites, setGifFavorites] = React.useState<string[]>(() =>
    safeJsonParse(typeof window !== "undefined" ? localStorage.getItem("cc_gif_favs") : null, [])
  );
  const [draftByThreadId, setDraftByThreadId] = React.useState<Record<ID, DraftState>>({});
  const [nowMs, setNowMs] = React.useState<number | null>(typeof window !== "undefined" ? Date.now() : null);

  React.useEffect(() => {
    try {
      localStorage.setItem("cc_gif_favs", JSON.stringify(gifFavorites));
    } catch {}
  }, [gifFavorites]);

  React.useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u] as const)), [users]);
  if (!userById.has(meId)) userById.set(meId, me);

  const selectedThread = React.useMemo(
    () => (selectedThreadId ? threads.find((t) => t.id === selectedThreadId) ?? null : null),
    [threads, selectedThreadId]
  );
  const otherUser = React.useMemo(() => {
    if (!selectedThread) return null;
    const otherId = selectedThread.participantIds.find((id) => id !== meId);
    return otherId ? userById.get(otherId) ?? null : null;
  }, [selectedThread, userById, meId]);

  const myNoteObj = React.useMemo(() => notes.find((n) => n.userId === meId) ?? null, [notes, meId]);
  const myNoteText = myNoteObj?.text ?? "";
  const requestsCount = React.useMemo(() => threads.filter((t) => t.isRequest).length, [threads]);

  const visibleThreads = React.useMemo(() => {
    const q = threadSearch.trim().toLowerCase();
    const base = threads
      .filter((t) => (activeTab === "requests" ? !!t.isRequest : !t.isRequest))
      .filter((t) => !reportedThreadIds.has(t.id))
      .filter((t) => {
        const otherId = t.participantIds.find((id) => id !== meId);
        if (!otherId) return false;
        if (blockedUserIds.has(otherId)) return false;
        if (!q) return true;
        const other = userById.get(otherId);
        const who = other ? `${other.displayName} @${other.username}` : "";
        const recent = allMessages
          .filter((m) => m.threadId === t.id)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 25)
          .map((m) => m.text)
          .join(" ");
        return `${who} ${recent}`.toLowerCase().includes(q);
      });
    return base.sort((a, b) => {
      const aUnread = isThreadUnreadForMe(allMessages, a.id, meId) ? 1 : 0;
      const bUnread = isThreadUnreadForMe(allMessages, b.id, meId) ? 1 : 0;
      if (aUnread !== bUnread) return bUnread - aUnread;
      return b.updatedAt - a.updatedAt;
    });
  }, [threads, activeTab, reportedThreadIds, blockedUserIds, threadSearch, userById, allMessages, meId]);

  const selectedDraft = React.useMemo(() => {
    if (!selectedThreadId) return emptyDraft();
    return draftByThreadId[selectedThreadId] ?? emptyDraft();
  }, [draftByThreadId, selectedThreadId]);

  const setDraftForSelected = React.useCallback(
    (updater: (prev: DraftState) => DraftState) => {
      if (!selectedThreadId) return;
      setDraftByThreadId((prev) => ({
        ...prev,
        [selectedThreadId]: updater(prev[selectedThreadId] ?? emptyDraft()),
      }));
    },
    [selectedThreadId]
  );

  const addFiles = React.useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files);
      if (!arr.length) return;
      setDraftForSelected((prev) => ({ ...prev, files: [...prev.files, ...arr].slice(0, 12) }));
    },
    [setDraftForSelected]
  );

  const addGif = React.useCallback(
    (url: string) => {
      const att: Attachment = { id: `gif_${Date.now()}`, type: "image", name: "GIF", url };
      setDraftForSelected((prev) => ({ ...prev, gifs: [...prev.gifs, att].slice(0, 12) }));
    },
    [setDraftForSelected]
  );

  const toggleGifFav = React.useCallback((url: string) => {
    setGifFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(url)) set.delete(url);
      else set.add(url);
      return Array.from(set);
    });
  }, []);

  const handleSend = React.useCallback(async () => {
    if (!selectedThread || !selectedThreadId) return;
    const text = selectedDraft.text.trim();
    const attachmentUrls = selectedDraft.gifs.map((g) => g.url);
    if (!text && selectedDraft.files.length === 0 && attachmentUrls.length === 0) return;
    await onSend(selectedThread.id, text, attachmentUrls.length ? attachmentUrls : undefined);
    setDraftByThreadId((prev) => ({ ...prev, [selectedThreadId]: emptyDraft() }));
  }, [selectedThread, selectedThreadId, selectedDraft, onSend]);

  const openReport = React.useCallback(() => {
    setReportReason("");
    setReportDetails("");
    setReportOpen(true);
  }, []);

  const submitReport = React.useCallback(() => {
    if (!selectedThread) return;
    setReportedThreadIds((prev) => new Set([...prev, selectedThread.id]));
    onSelectedThreadIdChange(null);
    setReportOpen(false);
    onRefresh();
  }, [selectedThread, onSelectedThreadIdChange, onRefresh]);

  const handleBlock = React.useCallback(() => {
    if (!otherUser) return;
    setBlockedUserIds((prev) => new Set([...prev, otherUser.id]));
    onSelectedThreadIdChange(null);
    onRefresh();
  }, [otherUser, onSelectedThreadIdChange, onRefresh]);

  const acceptRequestThread = React.useCallback(
    (threadId: ID) => {
      onSelectedThreadIdChange(threadId);
      setActiveTab("messages");
      onRefresh();
    },
    [onSelectedThreadIdChange, onRefresh]
  );

  const deleteThread = React.useCallback(
    (threadId: ID) => {
      setDraftByThreadId((prev) => {
        const copy = { ...prev };
        delete copy[threadId];
        return copy;
      });
      if (selectedThreadId === threadId) onSelectedThreadIdChange(null);
      onRefresh();
    },
    [selectedThreadId, onSelectedThreadIdChange, onRefresh]
  );

  const updateMyNote = React.useCallback(
    (text: string) => {
      const val = text.slice(0, 60);
      onUpdateNote(val);
    },
    [onUpdateNote]
  );

  return (
    <MessagesShell
      drawerWidth={220}
      red={RED}
      me={me}
      meId={meId}
      nowMs={nowMs}
      activityText={activityText}
      formatAgo={formatAgo}
      users={users}
      userById={userById}
      notes={notes}
      threads={visibleThreads}
      allThreads={threads}
      allMessages={allMessages}
      threadMessages={threadMessages}
      selectedThread={selectedThread}
      otherUser={otherUser}
      activeTab={activeTab}
      requestsCount={requestsCount}
      threadSearch={threadSearch}
      selectedThreadId={selectedThreadId}
      selectedDraft={selectedDraft}
      myNoteText={myNoteText}
      blockedUserIds={blockedUserIds}
      gifFavorites={gifFavorites}
      dialogs={{
        newMsgOpen,
        noteOpen,
        gifOpen,
        imgView,
        reportOpen,
        reportReason,
        reportDetails,
      }}
      actions={{
        setActiveTab,
        setThreadSearch,
        setSelectedThreadId: onSelectedThreadIdChange,
        setNewMsgOpen: (v) => setNewMsgOpen(v),
        setNoteOpen: (v) => setNoteOpen(v),
        setGifOpen: (v) => setGifOpen(v),
        setImgView,
        setReportOpen: (v) => setReportOpen(v),
        setReportReason,
        setReportDetails,
        setDraftForSelected,
        addFiles,
        addGif,
        toggleGifFav,
        handlePickUser: onPickUser,
        acceptRequestThread,
        deleteThread,
        openReport,
        submitReport,
        handleBlock,
        handleSend,
        updateMyNote,
      }}
      uiFlags={{ showRequestActions: !!selectedThread?.isRequest }}
    />
  );
}
