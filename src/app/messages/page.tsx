"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import type { Attachment, ID, Message, Note, Thread, User } from "./types";
import { ME_ID, messages as seedMessages, notes as seedNotes, threads as seedThreads, users } from "./mockData";

const RED = "#A80532";

function NotesRow({
    meId,
    notes,
    users,
    onClickUser,
  }: {
    meId: ID;
    notes: Note[];
    users: User[];
    onClickUser: (userId: ID) => void;
  }) {
    const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);
  
    const sorted = React.useMemo(
      () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
      [notes]
    );
  
    return (
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: "flex",
          gap: 2,
          overflowX: "auto",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": { background: "rgba(0,0,0,0.15)", borderRadius: 999 },
        }}
      >
        {sorted.map((n) => {
          const u = userById.get(n.userId);
          if (!u) return null;
  
          const isMe = n.userId === meId;
  
          return (
            <Box
              key={n.id}
              onClick={() => onClickUser(n.userId)}
              sx={{
                minWidth: 86,
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
              }}
            >
              
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  mx: "auto",
                  borderRadius: "50%",
                  p: "2px",
                  background: isMe
                    ? `linear-gradient(135deg, ${RED}, #ff3b6b, #ffb703)`
                    : "linear-gradient(135deg, rgba(0,0,0,0.18), rgba(0,0,0,0.06))",
                  animation: isMe ? "notePulse 2.4s ease-in-out infinite" : "none",
                  "@keyframes notePulse": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-2px)" },
                    "100%": { transform: "translateY(0px)" },
                  },
                }}
              >
                <Avatar
                  src={u.avatarUrl}
                  alt={u.displayName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "white",
                    border: "2px solid white",
                  }}
                />
              </Box>
  
              <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 800, color: "#111" }}>
                {isMe ? "Your note" : u.displayName.split(" ")[0]}
              </Typography>
  
              <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }} noWrap>
                {n.text}
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  }

  
/** small helper */
function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function formatAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

function activityText(lastActiveAt: number) {
  const diffM = Math.floor((Date.now() - lastActiveAt) / 60000);
  if (diffM <= 2) return "Active now";
  if (diffM < 60) return `Active ${diffM}m ago`;
  const diffH = Math.floor(diffM / 60);
  if (diffH < 24) return `Active ${diffH}h ago`;
  return `Active ${Math.floor(diffH / 24)}d ago`;
}

function safeJsonParse<T>(s: string | null, fallback: T): T {
  try {
    if (!s) return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

/** 30+ gifs (starter pack). Swap later with Tenor/Giphy search. */
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
  // ----------------------------
  // data (mock now)
  // ----------------------------
  const [threads, setThreads] = React.useState<Thread[]>(seedThreads);
  const [messages, setMessages] = React.useState<Message[]>(seedMessages);
  const [notes, setNotes] = React.useState<Note[]>(seedNotes);

  // ----------------------------
  // UI state
  // ----------------------------
  const [activeTab, setActiveTab] = React.useState<"messages" | "requests" | "notes">("messages");
  const [threadSearch, setThreadSearch] = React.useState("");
  const [selectedThreadId, setSelectedThreadId] = React.useState<ID | null>(() => {
    const first = seedThreads.find((t) => !t.isRequest);
    return first?.id ?? null;
  });

  const [blockedUserIds, setBlockedUserIds] = React.useState<Set<ID>>(new Set());
  const [reportedThreadIds, setReportedThreadIds] = React.useState<Set<ID>>(new Set());

  // dialogs
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

  // composer
  const [draftText, setDraftText] = React.useState("");
  const [pendingFiles, setPendingFiles] = React.useState<File[]>([]);
  const [pendingGifs, setPendingGifs] = React.useState<Attachment[]>([]);

  // voice recording
  const [recording, setRecording] = React.useState(false);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<BlobPart[]>([]);

  // menus
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);

  // gif favorites (local)
  const [gifFavorites, setGifFavorites] = React.useState<string[]>(() =>
    safeJsonParse<string[]>(typeof window !== "undefined" ? localStorage.getItem("tc_gif_favs") : null, [])
  );

  React.useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("tc_gif_favs", JSON.stringify(gifFavorites));
  }, [gifFavorites]);

  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u])), []);
  const me = userById.get(ME_ID)!;

  // ----------------------------
  // derived
  // ----------------------------
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
  const myNote = myNoteObj?.text ?? "";

  const requestsCount = React.useMemo(() => threads.filter((t) => t.isRequest).length, [threads]);

  const visibleThreads = React.useMemo(() => {
    const q = threadSearch.trim().toLowerCase();

    return threads
      .filter((t) => {
        if (activeTab === "requests") return !!t.isRequest;
        if (activeTab === "messages") return !t.isRequest;
        return !t.isRequest;
      })
      .filter((t) => !reportedThreadIds.has(t.id))
      .filter((t) => {
        const otherId = t.participantIds.find((id) => id !== ME_ID);
        if (!otherId) return false;
        if (blockedUserIds.has(otherId)) return false;

        const other = userById.get(otherId);
        if (!other) return false;

        if (!q) return true;
        return other.username.toLowerCase().includes(q) || other.displayName.toLowerCase().includes(q);
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [threads, threadSearch, activeTab, blockedUserIds, reportedThreadIds, userById]);

  // mark “seen” when opening a thread
  React.useEffect(() => {
    if (!selectedThread || !otherUser) return;

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

    // BACKEND TODO:
    // when user opens a thread, tell server "I saw the latest message"
    // POST /threads/:id/seen
  }, [selectedThreadId]); // only when switching threads

  // ----------------------------
  // actions
  // ----------------------------
  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    if (!arr.length) return;
    setPendingFiles((prev) => [...prev, ...arr].slice(0, 12));
  }

  function addGif(url: string) {
    const att: Attachment = { id: makeId("gif"), type: "image", name: "GIF", url };
    setPendingGifs((prev) => [...prev, att].slice(0, 12));
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

    // BACKEND TODO:
    // "Start chat" button should create or reuse a thread.
    // POST /threads { participantIds: [meId, userId] }
    // server can return an existing thread if it already exists
  }

  function acceptRequestThread(threadId: ID) {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, isRequest: false, updatedAt: Date.now() } : t)));
    setActiveTab("messages");
    setSelectedThreadId(threadId);

    // BACKEND TODO:
    // when user clicks Respond on a request, flip it to normal messages
    // POST /threads/:id/accept
  }

  function deleteThread(threadId: ID) {
    setThreads((prev) => prev.filter((t) => t.id !== threadId));
    setMessages((prev) => prev.filter((m) => m.threadId !== threadId));
    if (selectedThreadId === threadId) setSelectedThreadId(null);

    // BACKEND TODO:
    // delete the conversation for this user
    // DELETE /threads/:id
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

    // BACKEND TODO:
    // send report to server
    // POST /report { threadId, reason, details }
  }

  function handleBlock() {
    if (!otherUser) return;
    setBlockedUserIds((prev) => new Set([...prev, otherUser.id]));
    setSelectedThreadId(null);
    setMenuAnchor(null);

    // BACKEND TODO:
    // block a user so they cannot message you
    // POST /block { userId }
  }

  async function handleSend() {
    if (!selectedThread || !otherUser) return;

    const text = draftText.trim();
    if (!text && pendingFiles.length === 0 && pendingGifs.length === 0) return;

    // create local attachments for preview (object URLs for files)
    const fileAttachments: Attachment[] = pendingFiles.map((f) => {
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

    const attachments: Attachment[] = [...fileAttachments, ...pendingGifs];

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

    setDraftText("");
    setPendingFiles([]);
    setPendingGifs([]);

    // BACKEND TODO:
    // 1) upload any files first, get real URLs back
    // 2) send message with text + attachment URLs
    // POST /threads/:id/messages { text, attachments:[...] }
  }

  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Safari fix: try mp4 first, fallback to webm
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

  // ----------------------------
  // dialogs: new message
  // ----------------------------
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

  // ----------------------------
  // gifs
  // ----------------------------
  const gifList = React.useMemo(() => {
    const q = gifQuery.trim().toLowerCase();
    const all = GIFS;
    const favSet = new Set(gifFavorites);

    const favFirst = [
      ...gifFavorites.map((u) => all.find((g) => g.url === u)).filter(Boolean) as { url: string; title: string }[],
      ...all.filter((g) => !favSet.has(g.url)),
    ];

    if (!q) return favFirst;
    return favFirst.filter((g) => g.title.toLowerCase().includes(q) || g.url.toLowerCase().includes(q));
  }, [gifQuery, gifFavorites]);

  // ----------------------------
  // layout
  // ----------------------------
  const showRequestActions = !!selectedThread?.isRequest;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${RED} 0%, #7b001c 50%, #2a0010 100%)`,
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1180,
          mx: "auto",
          borderRadius: 4,
          overflow: "hidden",
          bgcolor: "white",
          border: "1px solid rgba(0,0,0,0.10)",
          height: { xs: "calc(100vh - 32px)", md: "calc(100vh - 48px)" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "380px 1fr" },
        }}
      >
        {/* LEFT */}
        <Box sx={{ borderRight: { md: "1px solid rgba(0,0,0,0.08)" }, display: "flex", flexDirection: "column" }}>
          
        <Box
        sx={{
            px: 2,
            py: 1.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            overflow: "hidden",       
        }}
        >
        {/* LEFT side content */}
        <Stack
            direction="row"
            alignItems="center"
            spacing={1.2}
            sx={{
            flex: 1,                
            minWidth: 0,            
            overflow: "hidden",
            }}
        >
            <Box
        sx={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            p: "3px",
            background: `linear-gradient(135deg, ${RED}, #ff3b6b, #ffb703)`,
            boxShadow: "0 10px 24px rgba(168,5,50,0.28)",
            flexShrink: 0,
        }}
        >
        <Avatar
            src="/ToroConnectLogoCircle.png"
            sx={{
            width: "100%",
            height: "100%",
            bgcolor: "white",
            border: "2px solid white",
            }}
        />
        </Box>


            {/* Profile + username + note bubble */}
            <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 0,            
                flexWrap: "wrap",     
            }}
            >
            <Avatar
                src={me.avatarUrl}
                sx={{
                width: 34,
                height: 34,
                bgcolor: "white",
                border: "1px solid rgba(0,0,0,0.12)",
                flexShrink: 0,
                }}
            />

            <Typography
                sx={{
                fontWeight: 1000,
                fontSize: 18,
                letterSpacing: -0.2,
                maxWidth: 140,         
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                }}
            >
                {me.username}
            </Typography>

            {/* Note bubble */}
            <Box
                onClick={() => setNoteOpen(true)}
                sx={{
                cursor: "pointer",
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                maxWidth: "100%",      
                minWidth: 0,
                px: 1.2,
                py: 0.6,
                borderRadius: 999,
                bgcolor: "rgba(0,0,0,0.04)",
                border: "1px solid rgba(0,0,0,0.10)",
                animation: "tcFloat 2.6s ease-in-out infinite",
                "@keyframes tcFloat": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-2px)" },
                    "100%": { transform: "translateY(0px)" },
                },
                "&:hover": { bgcolor: "rgba(0,0,0,0.06)" },
                }}
            >
                {/* tail */}
                <Box
                sx={{
                    position: "absolute",
                    left: -6,
                    bottom: 10,
                    width: 10,
                    height: 10,
                    transform: "rotate(45deg)",
                    bgcolor: "rgba(0,0,0,0.04)",
                    borderLeft: "1px solid rgba(0,0,0,0.10)",
                    borderBottom: "1px solid rgba(0,0,0,0.10)",
                }}
                />

                <Typography
                sx={{
                    fontSize: 12,
                    fontWeight: 900,
                    color: "#111",
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 180,        
                }}
                >
                {myNote ? myNote : "Add note"}
                </Typography>
            </Box>
            </Box>
        </Stack>

        {/* RIGHT side icons */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <Tooltip title="Edit note">
            <IconButton onClick={() => setNoteOpen(true)} sx={{ borderRadius: 2 }}>
                <EditIcon />
            </IconButton>
            </Tooltip>
            <Tooltip title="New message">
            <IconButton onClick={() => setNewMsgOpen(true)} sx={{ borderRadius: 2 }}>
                <ChatIcon />
            </IconButton>
            </Tooltip>
        </Stack>
        </Box>



          {/* Search */}
          <Box sx={{ px: 2, pb: 1.25 }}>
            <TextField
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              placeholder="Search"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "rgba(0,0,0,0.45)" }} />,
                sx: { bgcolor: "rgba(0,0,0,0.04)", borderRadius: 999 },
              }}
            />
          </Box>
          {/* IG-style notes row */}
            <NotesRow
            meId={ME_ID}
            notes={notes}
            users={users}
            onClickUser={(id) => {
                if (id === ME_ID) setNoteOpen(true);      // click your note opens note editor
                else handlePickUser(id);                 // click friend note opens chat
            }}
            />


          <Divider />

          {/* Tabs */}
          <Box sx={{ px: 2, pt: 0.5 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontWeight: 900, minHeight: 44 },
                "& .MuiTabs-indicator": { bgcolor: RED, height: 3, borderRadius: 999 },
              }}
            >
              <Tab value="messages" label="Messages" />
              <Tab value="requests" label={`Requests (${requestsCount})`} />
              <Tab value="notes" label="Notes" />
            </Tabs>
          </Box>

          {/* Thread list */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <List sx={{ px: 1.2, py: 1 }}>
              {visibleThreads.map((t) => {
                const otherId = t.participantIds.find((id) => id !== ME_ID);
                const other = otherId ? userById.get(otherId) ?? null : null;
                if (!other) return null;

                const last = getLastMessage(messages, t.id);
                const lastText =
                  last?.text || (last?.attachments?.length ? "Sent an attachment" : "Say hi 👋");

                const isSelected = selectedThreadId === t.id;
                const showRequestButtons = activeTab === "requests" || !!t.isRequest;

                return (
                  <Box key={t.id} sx={{ mb: 0.7 }}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => setSelectedThreadId(t.id)}
                      sx={{
                        borderRadius: 2.5,
                        "&.Mui-selected": { bgcolor: "rgba(168,5,50,0.08)" },
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                      }}
                    >
                      <Box
                sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    p: "2px",
                    background: "linear-gradient(135deg, rgba(0,0,0,0.18), rgba(0,0,0,0.06))",
                    animation: "avatarFloat 3.1s ease-in-out infinite",
                    "@keyframes avatarFloat": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-1.5px)" },
                    "100%": { transform: "translateY(0px)" },
                    },
                    flexShrink: 0,
                }}
                >
                <Avatar
                    src={other.avatarUrl}
                    sx={{ width: "100%", height: "100%", bgcolor: "white", border: "2px solid white" }}
                />
                </Box>

                      
                    </ListItemButton>

                    {/* Requests: Respond / Delete / Report row */}
                    {showRequestButtons && t.isRequest && (
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

              {!visibleThreads.length && (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography sx={{ fontWeight: 900 }}>No conversations</Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                    Try creating a new message.
                  </Typography>
                  <Button
                    onClick={() => setNewMsgOpen(true)}
                    variant="contained"
                    sx={{ mt: 1.5, bgcolor: RED, fontWeight: 900, borderRadius: 999, "&:hover": { bgcolor: "#810326" } }}
                  >
                    New message
                  </Button>
                </Box>
              )}
            </List>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* header */}
          <Box
            sx={{
              px: 2,
              py: 1.4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              minHeight: 64,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.2}>
              <IconButton
                onClick={() => setSelectedThreadId(null)}
                sx={{ display: { xs: "inline-flex", md: "none" } }}
              >
                <ArrowBackIcon />
              </IconButton>

              {otherUser ? (
                <>
                  <Avatar src={otherUser.avatarUrl} sx={{ bgcolor: "white" }} />
                  <Box>
                    <Typography sx={{ fontWeight: 1000, fontSize: 18 }}>{otherUser.displayName}</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                      {activityText(otherUser.lastActiveAt)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Box>
                  <Typography sx={{ fontWeight: 1000, fontSize: 18 }}>Your messages</Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                    Send private messages to students.
                  </Typography>
                </Box>
              )}
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
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
            </Stack>
          </Box>

          {/* chat area (scrolls), composer stays visible */}
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              px: { xs: 1.5, md: 2.5 },
              py: 2,
              bgcolor: "white",
            }}
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
                      width: 92,
                      height: 92,
                      borderRadius: "50%",
                      border: "2px solid rgba(0,0,0,0.18)",
                      display: "grid",
                      placeItems: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <SendIcon sx={{ fontSize: 42, color: "rgba(0,0,0,0.55)" }} />
                  </Box>
                  <Typography sx={{ fontWeight: 1000, fontSize: 22 }}>Your messages</Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.60)", mt: 0.7 }}>
                    Send a message to start a chat.
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                {/* if request thread, show banner */}
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
                    <Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
                      <Button
                        onClick={() => acceptRequestThread(selectedThread.id)}
                        variant="contained"
                        sx={{
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
                        onClick={() => deleteThread(selectedThread.id)}
                        variant="outlined"
                        sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={openReport}
                        variant="outlined"
                        sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}
                      >
                        Report
                      </Button>
                    </Stack>
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
                                    <Chip label={a.name} icon={<AttachFileIcon />} variant="outlined" sx={{ fontWeight: 800 }} />
                                  )}
                                </Box>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Box>

          {/* sticky composer (fixes the “going down” issue) */}
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              px: 2,
              py: 1.4,
              bgcolor: "white",
              zIndex: 5,
            }}
          >
            {!!pendingFiles.length && (
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                {pendingFiles.map((f, idx) => (
                  <Chip
                    key={`${f.name}-${idx}`}
                    label={f.name}
                    onDelete={() => setPendingFiles((p) => p.filter((_, i) => i !== idx))}
                    sx={{ fontWeight: 800 }}
                  />
                ))}
              </Stack>
            )}

            {!!pendingGifs.length && (
              <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                {pendingGifs.map((g, idx) => (
                  <Chip
                    key={`${g.id}-${idx}`}
                    label="GIF"
                    onDelete={() => setPendingGifs((p) => p.filter((_, i) => i !== idx))}
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
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
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

            <Typography sx={{ mt: 0.8, fontSize: 11, color: "rgba(0,0,0,0.45)" }}>
              Tip: drag & drop files anywhere in the chat area to attach.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ---------------- dialogs ---------------- */}

      {/* New message */}
      <Dialog open={newMsgOpen} onClose={() => setNewMsgOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>
          New message
          <IconButton onClick={() => setNewMsgOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.55)", mb: 1 }}>To</Typography>
          <TextField
            value={newMsgQuery}
            onChange={(e) => setNewMsgQuery(e.target.value)}
            placeholder="Search username or name"
            fullWidth
            size="small"
          />
          <Divider sx={{ my: 1.5 }} />
          <List sx={{ p: 0, maxHeight: 380, overflow: "auto" }}>
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

      {/* Note editor */}
      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>
          Add a note
          <IconButton onClick={() => setNoteOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.55)", mb: 1 }}>
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

      {/* Image viewer */}
      <Dialog open={imgView.open} onClose={() => setImgView({ open: false, url: "", name: "" })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>
          {imgView.name || "Image"}
          <IconButton onClick={() => setImgView({ open: false, url: "", name: "" })} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "grid", placeItems: "center" }}>
          <Box
            component="img"
            src={imgView.url}
            alt={imgView.name}
            sx={{ width: "100%", maxWidth: 900, borderRadius: 2, border: "1px solid rgba(0,0,0,0.10)" }}
          />
        </DialogContent>
      </Dialog>

      {/* GIF picker */}
      <Dialog open={gifOpen} onClose={() => setGifOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 900 }}>
          GIFs
          <IconButton onClick={() => setGifOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TextField
            value={gifQuery}
            onChange={(e) => setGifQuery(e.target.value)}
            placeholder="Search"
            fullWidth
            size="small"
          />

          <Typography sx={{ mt: 1.5, mb: 1, fontWeight: 900, fontSize: 13 }}>Favorites</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {!gifFavorites.length ? (
              <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>No favorites yet. Star a GIF.</Typography>
            ) : (
              gifFavorites.slice(0, 12).map((url) => (
                <Box
                  key={url}
                  component="img"
                  src={url}
                  alt="gif"
                  onClick={() => {
                    if (!selectedThreadId) return;
                    addGif(url);
                    setGifOpen(false);
                  }}
                  sx={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.10)",
                    cursor: "pointer",
                  }}
                />
              ))
            )}
          </Box>

          <Divider />

          <Typography sx={{ mt: 1.5, mb: 1, fontWeight: 900, fontSize: 13 }}>Browse</Typography>
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

          <Typography sx={{ mt: 2, fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
            BACKEND NOTE: replace this list with Tenor/Giphy search later, and store favorites per user.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGifOpen(false)} sx={{ fontWeight: 900, textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Report dialog */}
      <Dialog open={reportOpen} onClose={() => setReportOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 900 }}>
          Report
          <IconButton onClick={() => setReportOpen(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 900, mb: 1 }}>
            Why are you reporting this conversation?
          </Typography>

          {["Spam", "Harassment", "Hate", "Scam", "Other"].map((r) => (
            <ListItemButton
              key={r}
              onClick={() => setReportReason(r)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                bgcolor: reportReason === r ? "rgba(168,5,50,0.08)" : "transparent",
              }}
            >
              <ListItemText primary={<Typography sx={{ fontWeight: 800 }}>{r}</Typography>} />
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

          <Typography sx={{ mt: 1.2, fontSize: 11, color: "rgba(0,0,0,0.55)" }}>
            BACKEND NOTE: save reason + details with the report so admins can review it.
          </Typography>
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

function getLastMessage(messages: Message[], threadId: ID) {
  const ms = messages.filter((m) => m.threadId === threadId);
  if (!ms.length) return null;
  return ms.sort((a, b) => b.createdAt - a.createdAt)[0];
}

