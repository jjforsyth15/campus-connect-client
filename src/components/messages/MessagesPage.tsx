"use client";

import * as React from "react";
import type { Attachment, ID, Message, Note, Thread, User } from "@/types/messages";
import { ME_ID, messages as seedMessages, notes as seedNotes, threads as seedThreads, users } from "@/lib/mocks/messages";
import MessagesShell from "./MessagesShell";

const RED = "#A80532";

type DraftState = { text: string; files: File[]; gifs: Attachment[] };
const emptyDraft = (): DraftState => ({ text: "", files: [], gifs: [] });

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function safeJsonParse<T>(s: string | null, fallback: T): T {
  try {
    if (!s) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

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

export default function MessagesPage() {
  const [threads, setThreads] = React.useState<Thread[]>(seedThreads);
  const [messages, setMessages] = React.useState<Message[]>(seedMessages);
  const [notes, setNotes] = React.useState<Note[]>(seedNotes);

  const [activeTab, setActiveTab] = React.useState<"messages" | "requests">("messages");
  const [threadSearch, setThreadSearch] = React.useState("");

  const [selectedThreadId, setSelectedThreadId] = React.useState<ID | null>(() => {
    const first = seedThreads.find((t) => !t.isRequest);
    return first?.id ?? null;
  });

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

  const [gifFavorites, setGifFavorites] = React.useState<string[]>([]);
  React.useEffect(() => {
    setGifFavorites(safeJsonParse<string[]>(localStorage.getItem("cc_gif_favs"), []));
  }, []);
  React.useEffect(() => {
    localStorage.setItem("cc_gif_favs", JSON.stringify(gifFavorites));
  }, [gifFavorites]);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u] as const)), []);
  const me = userById.get(ME_ID)!;

  const [nowMs, setNowMs] = React.useState<number | null>(null);
  React.useEffect(() => {
    setNowMs(Date.now());
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

  const selectedThread = React.useMemo(
    () => (selectedThreadId ? threads.find((t) => t.id === selectedThreadId) ?? null : null),
    [threads, selectedThreadId]
  );

  const otherUser = React.useMemo(() => {
    if (!selectedThread) return null;
    const otherId = selectedThread.participantIds.find((id) => id !== ME_ID);
    return otherId ? userById.get(otherId) ?? null : null;
  }, [selectedThread, userById]);

  const threadMessages = React.useMemo(() => {
    if (!selectedThread) return [];
    return messages
      .filter((m) => m.threadId === selectedThread.id)
      .sort((a, b) => a.createdAt - b.createdAt);
  }, [messages, selectedThread]);

  const myNoteObj = React.useMemo(() => notes.find((n) => n.userId === ME_ID) ?? null, [notes]);
  const myNoteText = myNoteObj?.text ?? "";

  const requestsCount = React.useMemo(() => threads.filter((t) => t.isRequest).length, [threads]);

  const visibleThreads = React.useMemo(() => {
    const q = threadSearch.trim().toLowerCase();

    const base = threads
      .filter((t) => (activeTab === "requests" ? !!t.isRequest : !t.isRequest))
      .filter((t) => !reportedThreadIds.has(t.id))
      .filter((t) => {
        const otherId = t.participantIds.find((id) => id !== ME_ID);
        if (!otherId) return false;
        if (blockedUserIds.has(otherId)) return false;

        if (!q) return true;

        const other = userById.get(otherId);
        const who = other ? `${other.displayName} @${other.username}` : "";

        const recent = messages
          .filter((m) => m.threadId === t.id)
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 25)
          .map((m) => m.text)
          .join(" ");

        const hay = `${who} ${recent}`.toLowerCase();
        return hay.includes(q);
      });

    return base.sort((a, b) => {
      const aUnread = isThreadUnreadForMe(messages, a.id, ME_ID) ? 1 : 0;
      const bUnread = isThreadUnreadForMe(messages, b.id, ME_ID) ? 1 : 0;
      if (aUnread !== bUnread) return bUnread - aUnread;
      return b.updatedAt - a.updatedAt;
    });
  }, [threads, activeTab, reportedThreadIds, blockedUserIds, threadSearch, userById, messages]);

  const [draftByThreadId, setDraftByThreadId] = React.useState<Record<ID, DraftState>>({});
  const selectedDraft = React.useMemo(() => {
    if (!selectedThreadId) return emptyDraft();
    return draftByThreadId[selectedThreadId] ?? emptyDraft();
  }, [draftByThreadId, selectedThreadId]);

  function setDraftForSelected(updater: (prev: DraftState) => DraftState) {
    if (!selectedThreadId) return;
    setDraftByThreadId((prev) => ({
      ...prev,
      [selectedThreadId]: updater(prev[selectedThreadId] ?? emptyDraft()),
    }));
  }

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setDraftForSelected((prev) => ({ ...prev, files: [...prev.files, ...arr].slice(0, 12) }));
  }

  function addGif(url: string) {
    const att: Attachment = { id: makeId("gif"), type: "image", name: "GIF", url };
    setDraftForSelected((prev) => ({ ...prev, gifs: [...prev.gifs, att].slice(0, 12) }));
  }

  function toggleGifFav(url: string) {
    setGifFavorites((prev) => {
      const set = new Set(prev);
      if (set.has(url)) set.delete(url);
      else set.add(url);
      return Array.from(set);
    });
  }

  function handlePickUser(userId: ID) {
    if (userId === ME_ID) return;

    const existing = threads.find((t) => {
      const set = new Set(t.participantIds);
      return set.has(ME_ID) && set.has(userId);
    });

    if (existing) {
      setSelectedThreadId(existing.id);
      setActiveTab(existing.isRequest ? "requests" : "messages");
      return;
    }

    const newThread: Thread = {
      id: makeId("t"),
      participantIds: [ME_ID, userId],
      updatedAt: Date.now(),
      isRequest: false,
    };

    setThreads((prev) => [newThread, ...prev]);
    setSelectedThreadId(newThread.id);
    setActiveTab("messages");
  }

  function acceptRequestThread(threadId: ID) {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, isRequest: false, updatedAt: Date.now() } : t)));
    setActiveTab("messages");
    setSelectedThreadId(threadId);
  }

  function deleteThread(threadId: ID) {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    setMessages((prev) => prev.filter((m) => m.threadId !== threadId));
    setDraftByThreadId((prev) => {
      const copy = { ...prev };
      delete copy[threadId];
      return copy;
    });
    if (selectedThreadId === threadId) setSelectedThreadId(null);
  }

  function openReport() {
    setReportReason("");
    setReportDetails("");
    setReportOpen(true);
  }

  function submitReport() {
    if (!selectedThread) return;
    setReportedThreadIds((prev) => new Set([...prev, selectedThread.id]));
    setSelectedThreadId(null);
    setReportOpen(false);
  }

  function handleBlock() {
    if (!otherUser) return;
    setBlockedUserIds((prev) => new Set([...prev, otherUser.id]));
    setSelectedThreadId(null);
  }

  async function handleSend() {
    if (!selectedThread || !otherUser || !selectedThreadId) return;

    const text = selectedDraft.text.trim();
    if (!text && selectedDraft.files.length === 0 && selectedDraft.gifs.length === 0) return;

    const fileAttachments: Attachment[] = selectedDraft.files.map((f) => {
      const url = URL.createObjectURL(f);
      const isImg = f.type.startsWith("image/");
      const isAudio = f.type.startsWith("audio/");
      return {
        id: makeId("att"),
        type: isAudio ? "audio" : isImg ? "image" : "file",
        name: f.name,
        url,
        size: f.size,
      };
    });

    const attachments: Attachment[] = [...fileAttachments, ...selectedDraft.gifs];

    const newMsg: Message = {
      id: makeId("m"),
      threadId: selectedThread.id,
      fromUserId: ME_ID,
      text,
      createdAt: Date.now(),
      attachments: attachments.length ? attachments : undefined,
      seenByUserIds: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    setThreads((prev) => prev.map((t) => (t.id === selectedThread.id ? { ...t, updatedAt: Date.now() } : t)));
    setDraftByThreadId((prev) => ({ ...prev, [selectedThreadId]: emptyDraft() }));
  }

  const showRequestActions = !!selectedThread?.isRequest;

  return (
    <MessagesShell
      drawerWidth={220}
      red={RED}
      me={me}
      meId={ME_ID}
      nowMs={nowMs}
      activityText={activityText}
      formatAgo={formatAgo}
      users={users}
      userById={userById}
      notes={notes}
      threads={visibleThreads}
      allThreads={threads}
      allMessages={messages}
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
        setSelectedThreadId,
        setNewMsgOpen,
        setNoteOpen,
        setGifOpen,
        setImgView,
        setReportOpen,
        setReportReason,
        setReportDetails,
        setDraftForSelected,
        addFiles,
        addGif,
        toggleGifFav,
        handlePickUser,
        acceptRequestThread,
        deleteThread,
        openReport,
        submitReport,
        handleBlock,
        handleSend,
        updateMyNote: (text: string) => {
          const val = text.slice(0, 60);
          setNotes((prev) => {
            const withoutMe = prev.filter((n) => n.userId !== ME_ID);
            return [{ id: "n_me", userId: ME_ID, text: val, updatedAt: Date.now() }, ...withoutMe];
          });
        },
      }}
      uiFlags={{
        showRequestActions,
      }}
    />
  );
}
