"use client";

/*
 * ============================================================================
 * NOTES for BACKEND 
 * ============================================================================
 *
 * PURPOSE
 * - This page is a fully client-side messaging UI prototype built for layout/UX.
 * - There is currently NO backend integration, NO database reads/writes, and NO real auth.
 *
 * CURRENT DATA MODEL (MOCKED)
 * - Seeds come from ./mockData.ts:
 *   - users, threads, messages, notes, ME_ID
 * - All updates happen in React state only:
 *   - threads/messages/notes are kept in useState and mutated locally.
 * - Minimal persistence:
 *   - localStorage: "tc_gif_favs" stores favorite GIF URLs.
 *   - Attachments use URL.createObjectURL(file) (temporary, browser-only URLs).
 *
 * CLIENT-ONLY CONCERNS
 * - This is a "use client" component and intentionally avoids SSR.
 * - Sidebar is dynamically imported with ssr:false to prevent hydration mismatches.
 * - Time-based labels (e.g., "Active 5m ago", "2h") are rendered only after nowMs is set on mount.
 *
 * WHAT BACKEND WILL EVENTUALLY REPLACE
 * - Threads:
 *   - list threads (inbox + requests), create thread, accept request, delete thread
 * - Messages:
 *   - list messages for a thread, send message, mark as seen/read
 * - Notes:
 *   - save/update note (status text)
 * - Moderation:
 *   - block user, report conversation
 * - Attachments:
 *   - upload + store files (images/audio/docs) and return permanent URLs
 *
 */


import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import GifBoxIcon from "@mui/icons-material/GifBox";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type { Attachment, ID, Message, Note, Thread, User } from "./types";
import {
  ME_ID,
  messages as seedMessages,
  notes as seedNotes,
  threads as seedThreads,
  users,
} from "./mockData";

import NotesBar from "./NotesBar";


const DashboardSidebar = dynamic(() => import("../../components/dashboard/sidebar"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "white",
      }}
    />
  ),
});

const drawerWidth = 220;
const RED = "#A80532";

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

function getLastMessage(messages: Message[], threadId: ID) {
  const ms = messages.filter((m) => m.threadId === threadId);
  if (!ms.length) return null;
  return ms.sort((a, b) => b.createdAt - a.createdAt)[0];
}

function isThreadUnreadForMe(messages: Message[], threadId: ID, meId: ID) {
  const last = getLastMessage(messages, threadId);
  if (!last) return false;
  if (last.fromUserId === meId) return false;
  const seen = new Set(last.seenByUserIds ?? []);
  return !seen.has(meId);
}

type DraftState = { text: string; files: File[]; gifs: Attachment[] };
const emptyDraft = (): DraftState => ({ text: "", files: [], gifs: [] });

function buildConversationSearchText(
  thread: Thread,
  meId: ID,
  userById: Map<ID, User>,
  messages: Message[]
) {
  const otherId = thread.participantIds.find((id) => id !== meId);
  const other = otherId ? userById.get(otherId) : null;

  const who = other ? `${other.displayName} @${other.username}` : "";

  const ms = messages
    .filter((m) => m.threadId === thread.id)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 25);

  const text = ms.map((m) => m.text).join(" ");
  return `${who} ${text}`.toLowerCase();
}

const scrollBarSx = {
  "&::-webkit-scrollbar": { width: 10, height: 10 },
  "&::-webkit-scrollbar-track": { bgcolor: "rgba(0,0,0,0.05)", borderRadius: 8 },
  "&::-webkit-scrollbar-thumb": {
    bgcolor: "rgba(0,0,0,0.25)",
    borderRadius: 8,
    "&:hover": { bgcolor: "rgba(0,0,0,0.35)" },
  },
} as const;

const panelScrollSx = {
  overflowY: "auto",
  overflowX: "hidden",
  minHeight: 0,
  overscrollBehavior: "contain",
  scrollbarGutter: "stable",
  WebkitOverflowScrolling: "touch",
  ...scrollBarSx,
} as const;

const wheelIsolationProps = {
  onWheel: (e: React.WheelEvent) => e.stopPropagation(),
  onTouchMove: (e: React.TouchEvent) => e.stopPropagation(),
} as const;

// GIF's
const GIFS: { url: string; title: string }[] = [
  { url: "https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif", title: "wow" },
  { url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", title: "lets go" },
  { url: "https://media.giphy.com/media/3o7TKtnuHOHHUjR38Y/giphy.gif", title: "nice" },
  { url: "https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif", title: "typing" },
  { url: "https://media.giphy.com/media/xT0GqFhyNd0Wmfo6sM/giphy.gif", title: "omg" },
  { url: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", title: "clap" },
  { url: "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif", title: "ok" },
  { url: "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif", title: "party" },
  { url: "https://media.giphy.com/media/ASd0Ukj0y3qMM/giphy.gif", title: "laugh" },
  { url: "https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif", title: "mind blown" },
  { url: "https://media.giphy.com/media/3orieQxWzEndtoNSxi/giphy.gif", title: "bruh" },
  { url: "https://media.giphy.com/media/l4FGpPki5v2Bcd6Ss/giphy.gif", title: "wow2" },
  { url: "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", title: "yay" },
  { url: "https://media.giphy.com/media/5VKbvrjxpVJCM/giphy.gif", title: "yes" },
  { url: "https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", title: "nope" },
  { url: "https://media.giphy.com/media/l0HlQ7LRalQqdWfao/giphy.gif", title: "hype" },
  { url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif", title: "wow3" },
  { url: "https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif", title: "run" },
  { url: "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif", title: "thinking" },
  { url: "https://media.giphy.com/media/l0MYu5bng5uGkRRte/giphy.gif", title: "ok2" },
  { url: "https://media.giphy.com/media/3o6fJbnP0H2YpR0k0E/giphy.gif", title: "hello" },
  { url: "https://media.giphy.com/media/xT0Gqz2gq2pH6L7c5W/giphy.gif", title: "bye" },
  { url: "https://media.giphy.com/media/3o6ZsWwQGQWbFhJ6xO/giphy.gif", title: "fire" },
  { url: "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif", title: "coffee" },
  { url: "https://media.giphy.com/media/l0HlMG1EX2H38cZeE/giphy.gif", title: "shocked" },
  { url: "https://media.giphy.com/media/xT0xeuOy2Fcl9vDGiA/giphy.gif", title: "done" },
  { url: "https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif", title: "facepalm" },
  { url: "https://media.giphy.com/media/3o6Zt8MgUuvSbkZYWc/giphy.gif", title: "deal" },
  { url: "https://media.giphy.com/media/3o6ZsYMuMkxBN6vZp6/giphy.gif", title: "sweat" },
  { url: "https://media.giphy.com/media/26ufcVAp3AiJJsrIs/giphy.gif", title: "ok3" },
  { url: "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif", title: "wow4" },
  { url: "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif", title: "thumbs up" },
];

export default function MessagesPage() {
  const router = useRouter();

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
  const [gifQuery, setGifQuery] = React.useState("");

  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportDetails, setReportDetails] = React.useState("");

  const [imgView, setImgView] = React.useState<{ open: boolean; url: string; name: string }>({
    open: false,
    url: "",
    name: "",
  });

  const [recording, setRecording] = React.useState(false);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);

  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  
  const [gifFavorites, setGifFavorites] = React.useState<string[]>([]);
  React.useEffect(() => {
    const v = safeJsonParse<string[]>(localStorage.getItem("tc_gif_favs"), []);
    setGifFavorites(v);
  }, []);
  React.useEffect(() => {
    // only runs client-side
    localStorage.setItem("tc_gif_favs", JSON.stringify(gifFavorites));
  }, [gifFavorites]);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u])), []);
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
    return messages.filter((m) => m.threadId === selectedThread.id).sort((a, b) => a.createdAt - b.createdAt);
  }, [messages, selectedThread]);

  const myNoteObj = React.useMemo(() => notes.find((n) => n.userId === ME_ID) ?? null, [notes]);
  const myNote = myNoteObj?.text ?? "";

  const requestsCount = React.useMemo(() => threads.filter((t) => t.isRequest).length, [threads]);

  const chatScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const chatBottomRef = React.useRef<HTMLDivElement | null>(null);

  const scrollChatToBottom = React.useCallback((behavior: ScrollBehavior) => {
    const scroller = chatScrollerRef.current;
    const bottom = chatBottomRef.current;
    if (!scroller || !bottom) return;

    const targetTop = bottom.offsetTop;
    scroller.scrollTo({ top: targetTop, behavior });
  }, []);

  React.useEffect(() => {
    if (!selectedThreadId) return;
    requestAnimationFrame(() => scrollChatToBottom("auto"));
  }, [selectedThreadId, scrollChatToBottom]);

  React.useEffect(() => {
    if (!selectedThreadId) return;
    requestAnimationFrame(() => scrollChatToBottom("smooth"));
  }, [threadMessages.length, selectedThreadId, scrollChatToBottom]);

  React.useEffect(() => {
    if (!selectedThread) return;
    const last = [...threadMessages].at(-1);
    if (!last) return;

    if (last.fromUserId !== ME_ID) {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== last.id) return m;
          const seen = new Set(m.seenByUserIds ?? []);
          seen.add(ME_ID);
          return { ...m, seenByUserIds: [...seen] };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThreadId]);

  const convoSearchRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isFind = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f";
      if (!isFind) return;
      e.preventDefault();
      convoSearchRef.current?.focus();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
        const hay = buildConversationSearchText(t, ME_ID, userById, messages);
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
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, isRequest: false, updatedAt: Date.now() } : t))
    );
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
    setMenuAnchor(null);
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
    setMenuAnchor(null);
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

  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const preferredTypes = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"];
      const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t));
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      recorderRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());

        const type = rec.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type });

        const isMp4 = type.includes("mp4");
        const ext = isMp4 ? "m4a" : "webm";
        const fileType = isMp4 ? "audio/mp4" : "audio/webm";

        const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: fileType });
        addFiles([file]);
      };

      rec.start();
      setRecording(true);
    } catch {
      // ignore
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  const [newMsgQuery, setNewMsgQuery] = React.useState("");
  const filteredUsers = React.useMemo(() => {
    const q = newMsgQuery.trim().toLowerCase();
    return users
      .filter((u) => u.id !== ME_ID)
      .filter((u) => !blockedUserIds.has(u.id))
      .filter((u) => {
        if (!q) return true;
        return u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q);
      })
      .slice(0, 30);
  }, [newMsgQuery, blockedUserIds]);

  const gifList = React.useMemo(() => {
    const q = gifQuery.trim().toLowerCase();
    const favSet = new Set(gifFavorites);

    const favFirst = [
      ...gifFavorites.map((u) => GIFS.find((g) => g.url === u)).filter(Boolean) as { url: string; title: string }[],
      ...GIFS.filter((g) => !favSet.has(g.url)),
    ];

    if (!q) return favFirst;
    return favFirst.filter((g) => g.title.toLowerCase().includes(q) || g.url.toLowerCase().includes(q));
  }, [gifQuery, gifFavorites]);

  const showRequestActions = !!selectedThread?.isRequest;

  return (
    <Box sx={{ display: "flex", bgcolor: "#fafafb", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      <DashboardSidebar drawerWidth={drawerWidth} onLogout={() => router.push("/")} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: 3,
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 0,
            minWidth: 0,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "white",
            border: "1px solid rgba(0,0,0,0.08)",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "420px 1fr" },
          }}
        >
          {/* LEFT */}
          <Box
            sx={{
              borderRight: "1px solid rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              minWidth: 0,
              bgcolor: "white",
            }}
          >
            <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
                <Avatar
                  src={me.avatarUrl}
                  sx={{ width: 34, height: 34, bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)" }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 1000, fontSize: 16 }} noWrap>
                    {me.username}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }} noWrap>
                    
                  </Typography>
                </Box>
              </Stack>

              <Tooltip title="New message">
                <IconButton onClick={() => setNewMsgOpen(true)} sx={{ borderRadius: 2 }}>
                  <ChatIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ px: 2, pb: 1 }}>
              <TextField
                value={threadSearch}
                onChange={(e) => setThreadSearch(e.target.value)}
                placeholder="Search conversations"
                fullWidth
                size="small"
                inputRef={convoSearchRef}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "rgba(0,0,0,0.45)" }} />,
                  sx: { bgcolor: "rgba(0,0,0,0.04)", borderRadius: 999 },
                }}
              />
            </Box>

            <NotesBar
              meId={ME_ID}
              notes={notes}
              users={users}
              onClickUserAction={(id) => {
                if (id === ME_ID) setNoteOpen(true);
                else handlePickUser(id);
              }}
            />

            <Box sx={{ px: 2, pt: 0.25 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="fullWidth"
                sx={{
                  "& .MuiTab-root": { textTransform: "none", fontWeight: 900, minHeight: 40, fontSize: 13 },
                  "& .MuiTabs-indicator": { bgcolor: RED, height: 3, borderRadius: 999 },
                }}
              >
                <Tab value="messages" label="Messages" />
                <Tab value="requests" label={`Requests (${requestsCount})`} />
              </Tabs>
            </Box>

            <Divider />

            <Box sx={{ flex: 1, ...panelScrollSx }} {...wheelIsolationProps}>
              <List sx={{ px: 1.2, py: 1 }}>
                {visibleThreads.map((t) => {
                  const otherId = t.participantIds.find((id) => id !== ME_ID);
                  const other = otherId ? userById.get(otherId) ?? null : null;
                  if (!other) return null;

                  const last = getLastMessage(messages, t.id);
                  const lastText = last?.text || (last?.attachments?.length ? "Sent an attachment" : "Say hi");

                  const unread = isThreadUnreadForMe(messages, t.id, ME_ID);
                  const isSelected = selectedThreadId === t.id;

                  return (
                    <Box key={t.id} sx={{ mb: 0.4 }}>
                      <ListItemButton
                        selected={isSelected}
                        onClick={() => setSelectedThreadId(t.id)}
                        sx={{
                          borderRadius: 2.5,
                          py: 1.0,
                          "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.06)" },
                          "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                        }}
                      >
                        <Badge
                          variant="dot"
                          invisible={!unread}
                          overlap="circular"
                          sx={{
                            mr: 1.5,
                            "& .MuiBadge-badge": {
                              bgcolor: "#1d4ed8",
                              width: 10,
                              height: 10,
                              borderRadius: 999,
                              border: "2px solid white",
                            },
                          }}
                        >
                          <Avatar src={other.avatarUrl} sx={{ width: 44, height: 44, bgcolor: "white" }} />
                        </Badge>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                            <Typography sx={{ fontWeight: unread ? 1000 : 900 }} noWrap>
                              {other.displayName}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)", flexShrink: 0 }}>
                              {nowMs && last ? formatAgo(nowMs, last.createdAt) : ""}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 13,
                                color: unread ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.60)",
                                fontWeight: unread ? 900 : 700,
                              }}
                              noWrap
                            >
                              {lastText}
                            </Typography>

                            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", flexShrink: 0 }}>
                              {"-"} {nowMs ? activityText(nowMs, other.lastActiveAt) : ""}
                            </Typography>
                          </Stack>
                        </Box>
                      </ListItemButton>

                      {t.isRequest && activeTab === "requests" && (
                        <Stack direction="row" spacing={1} sx={{ mt: 0.8, px: 1.2 }}>
                          <Button
                            startIcon={<CheckCircleIcon />}
                            onClick={() => acceptRequestThread(t.id)}
                            variant="contained"
                            sx={{
                              flex: 1,
                              bgcolor: RED,
                              fontWeight: 900,
                              textTransform: "none",
                              borderRadius: 999,
                              "&:hover": { bgcolor: "#810326" },
                            }}
                          >
                            Respond
                          </Button>

                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => deleteThread(t.id)}
                            variant="outlined"
                            sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}
                          >
                            Delete
                          </Button>

                          <Button
                            startIcon={<ReportIcon />}
                            onClick={() => {
                              setSelectedThreadId(t.id);
                              openReport();
                            }}
                            variant="outlined"
                            sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}
                          >
                            Report
                          </Button>
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </List>
            </Box>
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, bgcolor: "white" }}>
            <Box
              sx={{
                px: 2,
                py: 1.25,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
                minHeight: 58,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <IconButton onClick={() => setSelectedThreadId(null)} sx={{ display: { xs: "inline-flex", md: "none" } }}>
                  <ArrowBackIcon />
                </IconButton>

                {otherUser ? (
                  <>
                    <Avatar src={otherUser.avatarUrl} sx={{ bgcolor: "white" }} />
                    <Box>
                      <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>{otherUser.displayName}</Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                        {nowMs ? activityText(nowMs, otherUser.lastActiveAt) : ""}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box>
                    <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>Your messages</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>Select a conversation.</Typography>
                  </Box>
                )}
              </Stack>

              {otherUser && (
                <>
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                    <MenuItem onClick={openReport}>Report</MenuItem>
                    <MenuItem onClick={handleBlock} sx={{ color: "#b91c1c", fontWeight: 900 }}>
                      Block
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>

            <Box
              ref={chatScrollerRef}
              sx={{
                flex: 1,
                minHeight: 0,
                minWidth: 0,
                overflowY: "auto",
                overflowX: "hidden",
                overscrollBehavior: "contain",
                scrollbarGutter: "stable",
                WebkitOverflowScrolling: "touch",
                px: 2.5,
                py: 2,
                bgcolor: "white",
                ...scrollBarSx,
              }}
              {...wheelIsolationProps}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (!selectedThread) return;
                addFiles(e.dataTransfer.files);
              }}
            >
              {!selectedThread || !otherUser ? (
                <Box sx={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center", px: 2 }}>
                  <Box>
                    <Box
                      sx={{
                        width: 84,
                        height: 84,
                        borderRadius: "50%",
                        border: "2px solid rgba(0,0,0,0.18)",
                        display: "grid",
                        placeItems: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <SendIcon sx={{ fontSize: 38, color: "rgba(0,0,0,0.55)" }} />
                    </Box>
                    <Typography sx={{ fontWeight: 1000, fontSize: 20 }}>Your messages</Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.60)", mt: 0.7 }}>Send a message to start a chat.</Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {showRequestActions && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.4,
                        borderRadius: 2,
                        bgcolor: "rgba(168,5,50,0.07)",
                        border: "1px solid rgba(168,5,50,0.18)",
                      }}
                    >
                      <Typography sx={{ fontWeight: 1000 }}>Message request</Typography>
                      <Typography sx={{ color: "rgba(0,0,0,0.65)", fontSize: 13 }}>
                        You can respond, delete, or report this request.
                      </Typography>
                    </Box>
                  )}

                  <Stack spacing={1.25}>
                    {threadMessages.map((m) => {
                      const mine = m.fromUserId === ME_ID;
                      return (
                        <Box key={m.id} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                          <Box
                            sx={{
                              maxWidth: "78%",
                              px: 1.6,
                              py: 1.1,
                              borderRadius: 3,
                              bgcolor: mine ? "rgba(168,5,50,0.10)" : "rgba(0,0,0,0.04)",
                              border: "1px solid rgba(0,0,0,0.06)",
                              whiteSpace: "pre-wrap",
                              fontSize: 14,
                            }}
                          >
                            {!!m.text && <Box>{m.text}</Box>}

                            {!!m.attachments?.length && (
                              <Stack spacing={1} sx={{ mt: m.text ? 1 : 0 }}>
                                {m.attachments.map((a) => (
                                  <Box key={a.id}>
                                    {a.type === "image" ? (
                                      <Box
                                        component="img"
                                        src={a.url}
                                        alt={a.name}
                                        onClick={() => setImgView({ open: true, url: a.url, name: a.name })}
                                        sx={{
                                          width: 220,
                                          maxWidth: "100%",
                                          borderRadius: 2,
                                          border: "1px solid rgba(0,0,0,0.10)",
                                          cursor: "zoom-in",
                                        }}
                                      />
                                    ) : a.type === "audio" ? (
                                      <audio controls src={a.url} />
                                    ) : (
                                      <Chip
                                        label={a.name}
                                        icon={<AttachFileIcon />}
                                        variant="outlined"
                                        sx={{ fontWeight: 800 }}
                                      />
                                    )}
                                  </Box>
                                ))}
                              </Stack>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                    <Box ref={chatBottomRef} />
                  </Stack>
                </Box>
              )}
            </Box>

            <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.08)", px: 2, py: 1.25, bgcolor: "white" }}>
              {!!selectedDraft.files.length && (
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                  {selectedDraft.files.map((f, idx) => (
                    <Chip
                      key={`${f.name}-${idx}`}
                      label={f.name}
                      onDelete={() =>
                        setDraftForSelected((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))
                      }
                      sx={{ fontWeight: 800 }}
                    />
                  ))}
                </Stack>
              )}

              {!!selectedDraft.gifs.length && (
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                  {selectedDraft.gifs.map((g, idx) => (
                    <Chip
                      key={`${g.id}-${idx}`}
                      label="GIF"
                      onDelete={() =>
                        setDraftForSelected((prev) => ({ ...prev, gifs: prev.gifs.filter((_, i) => i !== idx) }))
                      }
                      sx={{ fontWeight: 900 }}
                    />
                  ))}
                </Stack>
              )}

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton component="label" disabled={!selectedThread} title="Attach file">
                  <AttachFileIcon />
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="image/*,audio/*,application/pdf"
                    onChange={(e) => {
                      if (!e.target.files) return;
                      addFiles(e.target.files);
                      e.currentTarget.value = "";
                    }}
                  />
                </IconButton>

                <IconButton disabled={!selectedThread} onClick={() => setGifOpen(true)} title="GIFs">
                  <GifBoxIcon />
                </IconButton>

                <TextField
                  value={selectedDraft.text}
                  onChange={(e) => setDraftForSelected((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder={selectedThread ? "Message..." : "Select a conversation to message"}
                  fullWidth
                  size="small"
                  disabled={!selectedThread}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  InputProps={{
                    sx: {
                      borderRadius: 999,
                      bgcolor: "rgba(0,0,0,0.03)",
                      "& fieldset": { borderColor: "rgba(0,0,0,0.10)" },
                    },
                  }}
                />

                {!recording ? (
                  <IconButton onClick={startRecording} disabled={!selectedThread} title="Record voice message">
                    <MicIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={stopRecording} title="Stop recording">
                    <StopIcon sx={{ color: "#b91c1c" }} />
                  </IconButton>
                )}

                <IconButton onClick={handleSend} disabled={!selectedThread} title="Send">
                  <SendIcon sx={{ color: selectedThread ? RED : "rgba(0,0,0,0.25)" }} />
                </IconButton>
              </Stack>

              <Typography sx={{ mt: 0.7, fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
                Tip: drag and drop files into the chat area to attach.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* DIALOGS */}
      <Dialog open={newMsgOpen} onClose={() => setNewMsgOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 1000 }}>
          New message
          <IconButton onClick={() => setNewMsgOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(0,0,0,0.55)", mb: 1 }}>To</Typography>
          <TextField
            value={newMsgQuery}
            onChange={(e) => setNewMsgQuery(e.target.value)}
            placeholder="Search username or name"
            fullWidth
            size="small"
          />
          <Divider sx={{ my: 1.5 }} />
          <List sx={{ p: 0, maxHeight: 380, overflowY: "auto", ...scrollBarSx }}>
            {filteredUsers.map((u) => (
              <ListItemButton
                key={u.id}
                onClick={() => {
                  handlePickUser(u.id);
                  setNewMsgOpen(false);
                }}
                sx={{ borderRadius: 2 }}
              >
                <Avatar src={u.avatarUrl} sx={{ mr: 1.5, bgcolor: "white" }} />
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 900 }}>{u.displayName}</Typography>}
                  secondary={`@${u.username}`}
                />
                <Button
                  variant="contained"
                  sx={{
                    ml: 1,
                    borderRadius: 999,
                    fontWeight: 900,
                    textTransform: "none",
                    bgcolor: RED,
                    "&:hover": { bgcolor: "#810326" },
                  }}
                >
                  Chat
                </Button>
              </ListItemButton>
            ))}
            {!filteredUsers.length && (
              <Box sx={{ py: 5, textAlign: "center" }}>
                <Typography sx={{ fontWeight: 900 }}>No results</Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>Try a different search.</Typography>
              </Box>
            )}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 1000 }}>
          Create a note
          <IconButton onClick={() => setNoteOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(0,0,0,0.55)", mb: 1 }}>
            Keep it short (60 chars)
          </Typography>
          <TextField
            value={myNote}
            onChange={(e) => {
              const val = e.target.value.slice(0, 60);
              setNotes((prev) => {
                const withoutMe = prev.filter((n) => n.userId !== ME_ID);
                return [{ id: "n_me", userId: ME_ID, text: val, updatedAt: Date.now() }, ...withoutMe];
              });
            }}
            placeholder="What’s up?"
            fullWidth
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setNoteOpen(false)} sx={{ fontWeight: 900, textTransform: "none" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={imgView.open} onClose={() => setImgView({ open: false, url: "", name: "" })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 1000 }}>
          {imgView.name || "Image"}
          <IconButton
            onClick={() => setImgView({ open: false, url: "", name: "" })}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", placeItems: "center" }}>
        {imgView.url && (
        <Box
            component="img"
            src={imgView.url}
            alt={imgView.name || "Image"}
            sx={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 2,
            border: "1px solid rgba(0,0,0,0.10)",
            }}
        />
        )}

        </DialogContent>
      </Dialog>

      <Dialog open={gifOpen} onClose={() => setGifOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 1000 }}>
          GIFs
          <IconButton onClick={() => setGifOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TextField value={gifQuery} onChange={(e) => setGifQuery(e.target.value)} placeholder="Search" fullWidth size="small" />
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.25 }}>
            {gifList.slice(0, 45).map((g) => {
              const isFav = gifFavorites.includes(g.url);
              return (
                <Box key={g.url} sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={g.url}
                    alt={g.title}
                    onClick={() => {
                      if (!selectedThreadId) return;
                      addGif(g.url);
                      setGifOpen(false);
                    }}
                    sx={{
                      width: "100%",
                      height: 110,
                      objectFit: "cover",
                      borderRadius: 2,
                      border: "1px solid rgba(0,0,0,0.10)",
                      cursor: selectedThreadId ? "pointer" : "not-allowed",
                      opacity: selectedThreadId ? 1 : 0.6,
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGifFav(g.url);
                    }}
                    sx={{
                      position: "absolute",
                      right: 6,
                      top: 6,
                      bgcolor: "rgba(255,255,255,0.9)",
                      "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                    }}
                    size="small"
                    title={isFav ? "Unfavorite" : "Favorite"}
                  >
                    {isFav ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGifOpen(false)} sx={{ fontWeight: 900, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 1000 }}>
          Report
          <IconButton onClick={() => setReportOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 1000, mb: 1 }}>Why are you reporting this conversation?</Typography>

          {["Spam", "Harassment", "Hate", "Scam", "Other"].map((r) => (
            <ListItemButton
              key={r}
              onClick={() => setReportReason(r)}
              sx={{ borderRadius: 2, mb: 0.5, bgcolor: reportReason === r ? "rgba(168,5,50,0.08)" : "transparent" }}
            >
              <ListItemText primary={<Typography sx={{ fontWeight: 900 }}>{r}</Typography>} />
            </ListItemButton>
          ))}

          <TextField
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
            placeholder="Optional details"
            fullWidth
            size="small"
            multiline
            minRows={3}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setReportOpen(false)} sx={{ fontWeight: 900, textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={submitReport}
            disabled={!reportReason}
            variant="contained"
            sx={{
              fontWeight: 900,
              textTransform: "none",
              borderRadius: 999,
              bgcolor: RED,
              "&:hover": { bgcolor: "#810326" },
            }}
          >
            Submit report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
