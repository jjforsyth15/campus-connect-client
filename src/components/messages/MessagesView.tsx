"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { ID, Message, Note, Thread, User } from "@/types/messages";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
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
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import GifBoxIcon from "@mui/icons-material/GifBox";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import SearchIcon from "@mui/icons-material/Search";
import { RED, DRAWER_WIDTH } from "./constants";
import {
  panelScrollSx,
  scrollBarSx,
  formatAgo,
  activityText,
  getLastMessage,
  isThreadUnread,
  emptyDraft,
  type DraftState,
} from "./utils";
import MessagesDialogs from "./MessagesDialogs";

const DashboardSidebar = dynamic(() => import("@/components/dashboard/sidebar"), {
  ssr: false,
  loading: () => <Box sx={{ width: 220, flexShrink: 0, height: "100vh", borderRight: "1px solid rgba(0,0,0,0.08)", bgcolor: "white" }} />,
});

export type MessagesViewProps = {
  me: User;
  meId: ID;
  threads: Thread[];
  users: User[];
  notes: Note[];
  allMessages: Message[];
  threadMessages: Message[];
  selectedThreadId: ID | null;
  onSelectedThreadIdChange: (id: ID | null) => void;
  onSend: (threadId: string, text: string, attachmentUrls?: string[]) => void | Promise<void>;
  onUpdateNote: (text: string) => void | Promise<void>;
  onPickUser: (userId: ID) => void | Promise<void>;
  onRefresh: () => void;
};

export default function MessagesView(props: MessagesViewProps) {
  const router = useRouter();
  const {
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
  } = props;

  const [activeTab, setActiveTab] = React.useState<"messages" | "requests">("messages");
  const [threadSearch, setThreadSearch] = React.useState("");
  const [blockedUserIds, setBlockedUserIds] = React.useState<Set<ID>>(new Set());
  const [reportedThreadIds, setReportedThreadIds] = React.useState<Set<ID>>(new Set());
  const [newMsgOpen, setNewMsgOpen] = React.useState(false);
  const [noteOpen, setNoteOpen] = React.useState(false);
  const [gifOpen, setGifOpen] = React.useState(false);
  const [imgView, setImgView] = React.useState({ open: false, url: "", name: "" });
  const [reportOpen, setReportOpen] = React.useState(false);
  const [reportReason, setReportReason] = React.useState("");
  const [reportDetails, setReportDetails] = React.useState("");
  const [gifFavorites, setGifFavorites] = React.useState<string[]>([]);
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("cc_gif_favs");
      if (stored) setGifFavorites(JSON.parse(stored));
    } catch {}
  }, []);
  const [draftByThreadId, setDraftByThreadId] = React.useState<Record<ID, DraftState>>({});
  const [nowMs, setNowMs] = React.useState<number | null>(null);
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => { try { localStorage.setItem("cc_gif_favs", JSON.stringify(gifFavorites)); } catch {} }, [gifFavorites]);
  React.useEffect(() => {
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 30000);
    return () => window.clearInterval(id);
  }, []);
  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    if (scrollerRef.current && bottomRef.current) scrollerRef.current.scrollTo({ top: bottomRef.current.offsetTop, behavior });
  }, []);
  React.useEffect(() => scrollToBottom("auto"), [selectedThreadId, scrollToBottom]);
  React.useEffect(() => scrollToBottom("smooth"), [threadMessages.length, scrollToBottom]);

  const userById = React.useMemo(() => {
    const map = new Map<ID, User>(users.map((u) => [u.id, u]));
    if (!map.has(meId)) map.set(meId, me);
    return map;
  }, [users, meId, me]);

  const selectedThread = React.useMemo(() => (selectedThreadId ? threads.find((t) => t.id === selectedThreadId) ?? null : null), [threads, selectedThreadId]);
  const otherUser = React.useMemo(() => {
    if (!selectedThread) return null;
    const otherId = selectedThread.participantIds.find((id) => id !== meId);
    return otherId ? userById.get(otherId) ?? null : null;
  }, [selectedThread, userById, meId]);

  const myNoteText = notes.find((n) => n.userId === meId)?.text ?? "";
  const requestsCount = threads.filter((t) => t.isRequest).length;

  const visibleThreads = React.useMemo(() => {
    const q = threadSearch.trim().toLowerCase();
    const base = threads
      .filter((t) => (activeTab === "requests" ? !!t.isRequest : !t.isRequest))
      .filter((t) => !reportedThreadIds.has(t.id))
      .filter((t) => {
        const otherId = t.participantIds.find((id) => id !== meId);
        if (!otherId || blockedUserIds.has(otherId)) return false;
        if (!q) return true;
        const other = userById.get(otherId);
        const who = other ? `${other.displayName} @${other.username}` : "";
        const recent = allMessages.filter((m) => m.threadId === t.id).sort((a, b) => b.createdAt - a.createdAt).slice(0, 25).map((m) => m.text).join(" ");
        return `${who} ${recent}`.toLowerCase().includes(q);
      });
    return base.sort((a, b) => {
      const au = isThreadUnread(allMessages, a.id, meId) ? 1 : 0;
      const bu = isThreadUnread(allMessages, b.id, meId) ? 1 : 0;
      if (au !== bu) return bu - au;
      return b.updatedAt - a.updatedAt;
    });
  }, [threads, activeTab, reportedThreadIds, blockedUserIds, threadSearch, userById, allMessages, meId]);

  const selectedDraft = selectedThreadId ? draftByThreadId[selectedThreadId] ?? emptyDraft() : emptyDraft();
  const setDraft = React.useCallback((updater: (prev: DraftState) => DraftState) => {
    if (!selectedThreadId) return;
    setDraftByThreadId((prev) => ({ ...prev, [selectedThreadId]: updater(prev[selectedThreadId] ?? emptyDraft()) }));
  }, [selectedThreadId]);

  const addFiles = React.useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (!arr.length) return;
    setDraft((prev) => ({ ...prev, files: [...prev.files, ...arr].slice(0, 12) }));
  }, [setDraft]);

  const addGif = React.useCallback((url: string) => {
    setDraft((prev) => ({ ...prev, gifs: [...prev.gifs, { id: `gif_${Date.now()}`, type: "image" as const, name: "GIF", url }].slice(0, 12) }));
  }, [setDraft]);

  const handleSend = React.useCallback(async () => {
    if (!selectedThread || !selectedThreadId) return;
    const text = selectedDraft.text.trim();
    const urls = selectedDraft.gifs.map((g) => g.url);
    if (!text && selectedDraft.files.length === 0 && urls.length === 0) return;
    await onSend(selectedThread.id, text, urls.length ? urls : undefined);
    setDraftByThreadId((prev) => ({ ...prev, [selectedThreadId]: emptyDraft() }));
  }, [selectedThread, selectedThreadId, selectedDraft, onSend]);

  const openReport = () => { setReportReason(""); setReportDetails(""); setReportOpen(true); };
  const submitReport = () => {
    if (selectedThread) { setReportedThreadIds((prev) => new Set([...prev, selectedThread.id])); onSelectedThreadIdChange(null); setReportOpen(false); onRefresh(); }
  };
  const handleBlock = () => { if (otherUser) { setBlockedUserIds((prev) => new Set([...prev, otherUser.id])); onSelectedThreadIdChange(null); onRefresh(); } };
  const acceptRequest = (threadId: ID) => { onSelectedThreadIdChange(threadId); setActiveTab("messages"); onRefresh(); };
  const deleteThread = (threadId: ID) => {
    setDraftByThreadId((prev) => { const c = { ...prev }; delete c[threadId]; return c; });
    if (selectedThreadId === threadId) onSelectedThreadIdChange(null);
    onRefresh();
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#fafafb", height: "100vh", overflow: "hidden" }}>
      <DashboardSidebar drawerWidth={DRAWER_WIDTH} onLogout={() => router.push("/")} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, p: 3, height: "100vh", overflow: "hidden", display: "flex", minWidth: 0 }}>
        <Paper elevation={0} sx={{ width: "100%", height: "100%", minHeight: 0, borderRadius: 3, overflow: "hidden", bgcolor: "white", border: "1px solid rgba(0,0,0,0.08)", display: "grid", gridTemplateColumns: { xs: "1fr", md: "420px 1fr" } }}>
          {/* Sidebar */}
          <Box sx={{ borderRight: "1px solid rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", minHeight: 0, bgcolor: "white" }}>
            <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
                <Avatar src={me.avatarUrl} sx={{ width: 34, height: 34, bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)" }} />
                <Typography sx={{ fontWeight: 1000, fontSize: 16 }} noWrap>{me.username}</Typography>
              </Stack>
              <Tooltip title="New message"><IconButton onClick={() => setNewMsgOpen(true)} sx={{ borderRadius: 2 }}><ChatIcon /></IconButton></Tooltip>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <TextField value={threadSearch} onChange={(e) => setThreadSearch(e.target.value)} placeholder="Search conversations" fullWidth size="small" InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1, color: "rgba(0,0,0,0.45)" }} />, sx: { bgcolor: "rgba(0,0,0,0.04)", borderRadius: 999 } }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, px: 2, py: 1.25, overflowX: "auto" }}>
              {[...notes].sort((a, b) => b.updatedAt - a.updatedAt).map((n) => {
                const u = userById.get(n.userId);
                if (!u) return null;
                const isMe = n.userId === meId;
                return (
                  <Box key={n.id} onClick={() => (n.userId === meId ? setNoteOpen(true) : onPickUser(n.userId))} sx={{ minWidth: 84, cursor: "pointer", userSelect: "none", textAlign: "center" }}>
                    <Avatar src={u.avatarUrl} sx={{ width: 56, height: 56, mx: "auto", border: isMe ? `2px solid ${RED}` : "2px solid rgba(0,0,0,0.12)", bgcolor: "white" }} />
                    <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 700 }}>{isMe ? "Your note" : u.displayName.split(" ")[0]}</Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }} noWrap>{n.text}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ px: 2, pt: 0.25 }}>
              <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth" sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 900, minHeight: 40, fontSize: 13 }, "& .MuiTabs-indicator": { bgcolor: RED, height: 3, borderRadius: 999 } }}>
                <Tab value="messages" label="Messages" />
                <Tab value="requests" label={`Requests (${requestsCount})`} />
              </Tabs>
            </Box>
            <Divider />
            <Box sx={{ flex: 1, ...panelScrollSx }}>
              <List sx={{ px: 1.2, py: 1 }}>
                {visibleThreads.map((t) => {
                  const otherId = t.participantIds.find((id) => id !== meId);
                  const other = otherId ? userById.get(otherId) : null;
                  if (!other) return null;
                  const last = getLastMessage(allMessages, t.id);
                  const unread = isThreadUnread(allMessages, t.id, meId);
                  const lastText = last?.text || (last?.attachments?.length ? "Sent an attachment" : "Say hi");
                  return (
                    <Box key={t.id} sx={{ mb: 0.4 }}>
                      <ListItemButton selected={selectedThreadId === t.id} onClick={() => onSelectedThreadIdChange(t.id)} sx={{ borderRadius: 2.5, py: 1.0, "&.Mui-selected": { bgcolor: "rgba(0,0,0,0.06)" }, "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}>
                        <Badge variant="dot" invisible={!unread} overlap="circular" sx={{ mr: 1.5, "& .MuiBadge-badge": { bgcolor: "#1d4ed8", width: 10, height: 10, borderRadius: 999, border: "2px solid white" } }}>
                          <Avatar src={other.avatarUrl} sx={{ width: 44, height: 44, bgcolor: "white" }} />
                        </Badge>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontWeight: unread ? 1000 : 900 }} noWrap>{other.displayName}</Typography>
                            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{nowMs && last ? formatAgo(nowMs, last.createdAt) : ""}</Typography>
                          </Stack>
                          <Typography sx={{ fontSize: 13, color: unread ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.60)", fontWeight: unread ? 900 : 700 }} noWrap>{lastText}</Typography>
                        </Box>
                      </ListItemButton>
                      {t.isRequest && activeTab === "requests" && (
                        <Stack direction="row" spacing={1} sx={{ mt: 0.6, px: 1.2 }}>
                          <Button startIcon={<CheckCircleIcon />} onClick={() => acceptRequest(t.id)} variant="contained" sx={{ flex: 1, bgcolor: RED, fontWeight: 900, textTransform: "none", borderRadius: 999 }}>Respond</Button>
                          <Button startIcon={<DeleteIcon />} onClick={() => deleteThread(t.id)} variant="outlined" sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}>Delete</Button>
                          <Button startIcon={<ReportIcon />} onClick={() => { onSelectedThreadIdChange(t.id); openReport(); }} variant="outlined" sx={{ fontWeight: 900, textTransform: "none", borderRadius: 999 }}>Report</Button>
                        </Stack>
                      )}
                    </Box>
                  );
                })}
              </List>
            </Box>
          </Box>

          {/* Chat */}
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0, bgcolor: "white" }}>
            <Box sx={{ px: 2, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,0,0,0.08)", minHeight: 58 }}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <IconButton onClick={() => onSelectedThreadIdChange(null)} sx={{ display: { xs: "inline-flex", md: "none" } }}><ArrowBackIcon /></IconButton>
                {otherUser ? (
                  <>
                    <Avatar src={otherUser.avatarUrl} sx={{ bgcolor: "white" }} />
                    <Box>
                      <Typography sx={{ fontWeight: 1000, fontSize: 16 }}>{otherUser.displayName}</Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>{nowMs ? activityText(nowMs, otherUser.lastActiveAt) : ""}</Typography>
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
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}><MoreHorizIcon /></IconButton>
                  <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={() => setMenuAnchor(null)}>
                    <MenuItem onClick={() => { setMenuAnchor(null); openReport(); }}>Report</MenuItem>
                    <MenuItem onClick={() => { setMenuAnchor(null); handleBlock(); }} sx={{ color: "#b91c1c", fontWeight: 900 }}>Block</MenuItem>
                  </Menu>
                </>
              )}
            </Box>
            <Box ref={scrollerRef} sx={{ flex: 1, minHeight: 0, overflowY: "auto", overflowX: "hidden", px: 2.5, py: 2, ...scrollBarSx }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); if (selectedThread) addFiles(e.dataTransfer.files); }}>
              {!selectedThread || !otherUser ? (
                <Box sx={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center" }}>
                  <Box>
                    <Box sx={{ width: 84, height: 84, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.18)", display: "grid", placeItems: "center", mx: "auto", mb: 2 }}><SendIcon sx={{ fontSize: 38, color: "rgba(0,0,0,0.55)" }} /></Box>
                    <Typography sx={{ fontWeight: 1000, fontSize: 20 }}>Your messages</Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.60)", mt: 0.7 }}>Send a message to start a chat.</Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {selectedThread.isRequest && (
                    <Box sx={{ mb: 2, p: 1.4, borderRadius: 2, bgcolor: "rgba(168,5,50,0.07)", border: "1px solid rgba(168,5,50,0.18)" }}>
                      <Typography sx={{ fontWeight: 1000 }}>Message request</Typography>
                      <Typography sx={{ color: "rgba(0,0,0,0.65)", fontSize: 13 }}>You can respond, delete, or report this request.</Typography>
                    </Box>
                  )}
                  <Stack spacing={1.25}>
                    {threadMessages.map((m) => {
                      const mine = m.fromUserId === meId;
                      return (
                        <Box key={m.id} sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
                          <Box sx={{ maxWidth: "78%", px: 1.6, py: 1.1, borderRadius: 3, bgcolor: mine ? "rgba(168,5,50,0.10)" : "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.06)", whiteSpace: "pre-wrap", fontSize: 14 }}>
                            {!!m.text && <Box>{m.text}</Box>}
                            {!!m.attachments?.length && (
                              <Stack spacing={1} sx={{ mt: m.text ? 1 : 0 }}>
                                {m.attachments.map((a) => (
                                  <Box key={a.id}>
                                    {a.type === "image" ? <Box component="img" src={a.url} alt={a.name} onClick={() => setImgView({ open: true, url: a.url, name: a.name })} sx={{ width: 220, maxWidth: "100%", borderRadius: 2, border: "1px solid rgba(0,0,0,0.10)", cursor: "zoom-in" }} /> : a.type === "audio" ? <audio controls src={a.url} /> : <Chip label={a.name} icon={<AttachFileIcon />} variant="outlined" sx={{ fontWeight: 800 }} />}
                                  </Box>
                                ))}
                              </Stack>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                    <Box ref={bottomRef} />
                  </Stack>
                </Box>
              )}
            </Box>
            <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.08)", px: 2, py: 1.25, bgcolor: "white" }}>
              {(selectedDraft.files.length > 0 || selectedDraft.gifs.length > 0) && (
                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: "wrap" }}>
                  {selectedDraft.files.map((f, idx) => <Chip key={`${f.name}-${idx}`} label={f.name} onDelete={() => setDraft((p) => ({ ...p, files: p.files.filter((_, i) => i !== idx) }))} sx={{ fontWeight: 800 }} />)}
                  {selectedDraft.gifs.map((g, idx) => <Chip key={`${g.id}-${idx}`} label="GIF" onDelete={() => setDraft((p) => ({ ...p, gifs: p.gifs.filter((_, i) => i !== idx) }))} sx={{ fontWeight: 900 }} />)}
                </Stack>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton component="label" disabled={!selectedThread} title="Attach file"><AttachFileIcon /><input hidden type="file" multiple accept="image/*,audio/*,application/pdf" onChange={(e) => { if (e.target.files) { addFiles(e.target.files); e.currentTarget.value = ""; } }} /></IconButton>
                <IconButton disabled={!selectedThread} onClick={() => setGifOpen(true)} title="GIFs"><GifBoxIcon /></IconButton>
                <TextField value={selectedDraft.text} onChange={(e) => setDraft((p) => ({ ...p, text: e.target.value }))} placeholder={selectedThread ? "Message..." : "Select a conversation to message"} fullWidth size="small" disabled={!selectedThread} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} InputProps={{ sx: { borderRadius: 999, bgcolor: "rgba(0,0,0,0.03)", "& fieldset": { borderColor: "rgba(0,0,0,0.10)" } } }} />
                <IconButton onClick={handleSend} disabled={!selectedThread} title="Send"><SendIcon sx={{ color: selectedThread ? RED : "rgba(0,0,0,0.25)" }} /></IconButton>
              </Stack>
              <Typography sx={{ mt: 0.7, fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Tip: drag and drop files into the chat area to attach.</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <MessagesDialogs
        newMsgOpen={newMsgOpen}
        noteOpen={noteOpen}
        gifOpen={gifOpen}
        imgView={imgView}
        reportOpen={reportOpen}
        reportReason={reportReason}
        reportDetails={reportDetails}
        myNoteText={myNoteText}
        users={users}
        meId={meId}
        blockedUserIds={blockedUserIds}
        gifFavorites={gifFavorites}
        onCloseNewMsg={() => setNewMsgOpen(false)}
        onCloseNote={() => setNoteOpen(false)}
        onCloseGif={() => setGifOpen(false)}
        onCloseImgView={() => setImgView({ open: false, url: "", name: "" })}
        onCloseReport={() => setReportOpen(false)}
        onPickUser={(id) => { onPickUser(id); setNewMsgOpen(false); }}
        onSaveNote={(text) => { onUpdateNote(text.slice(0, 60)); setNoteOpen(false); }}
        onAddGif={addGif}
        onToggleGifFav={(url) => setGifFavorites((prev) => (prev.includes(url) ? prev.filter((x) => x !== url) : [...prev, url]))}
        onReportReason={setReportReason}
        onReportDetails={setReportDetails}
        onSubmitReport={submitReport}
      />
    </Box>
  );
}
