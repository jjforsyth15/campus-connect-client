"use client";

import * as React from "react";
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogContent,Divider, FormControlLabel, IconButton,
  InputAdornment, Paper, Snackbar, Stack, Switch, TextField, Tooltip, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import type { NoteFolder, NoteFolderItem, NoteComment } from "../shared/constants";
import { mockNoteFolders, mockNoteFolderItems, mockNoteComments } from "../shared/mockData";
import NoteView from "./NoteView";

function makeId() {
  return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;
}

function formatRelative(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

function isCsunEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@my.csun.edu");
}

const SUBJECT_CHIPS = ["All", "COMP", "MATH", "ENGL", "PHYS", "BUS", "ART", "BIOL"];
const TOPIC_TAGS = [
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

function FolderCard({ folder, itemCount, onOpen }: { folder: NoteFolder; itemCount: number; onOpen: () => void }) {
  const isPrivate = folder.visibility === "private";

  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      sx={{
        borderRadius: 3.5,
        p: 2,
        bgcolor: "#fff",
        border: "1.5px solid rgba(0,0,0,0.07)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: "0 10px 34px rgba(168,5,50,0.12)",
          transform: "translateY(-2px)",
          borderColor: "rgba(168,5,50,0.22)",
        },
      }}
    >
      {/* folder tab */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 18,
          width: 86,
          height: 18,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          bgcolor: "rgba(168,5,50,0.10)",
          border: "1px solid rgba(168,5,50,0.14)",
          borderTop: "none",
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
          <Chip
            label={folder.courseNumber ? `${folder.subject} ${folder.courseNumber}` : folder.subject}
            size="small"
            sx={{ bgcolor: "#A80532", color: "#fff", fontWeight: 900, fontSize: "0.68rem", height: 20 }}
          />
          <Chip
            size="small"
            icon={isPrivate ? <LockRoundedIcon sx={{ fontSize: 14 }} /> : <PublicRoundedIcon sx={{ fontSize: 14 }} />}
            label={isPrivate ? "Private" : "Public"}
            sx={{
              height: 20,
              fontSize: "0.66rem",
              fontWeight: 900,
              bgcolor: isPrivate ? "rgba(124,58,237,0.10)" : "rgba(22,163,74,0.10)",
              color: isPrivate ? "#7c3aed" : "#16a34a",
              "& .MuiChip-icon": { color: "inherit" },
            }}
          />
        </Stack>
        <Chip
          size="small"
          label={`${itemCount} item${itemCount === 1 ? "" : "s"}`}
          sx={{ height: 20, fontSize: "0.62rem", fontWeight: 900, bgcolor: "rgba(168,5,50,0.08)", color: "#A80532" }}
        />
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.2 }}>
        <FolderRoundedIcon sx={{ fontSize: 20, color: "rgba(168,5,50,0.85)" }} />
        <Typography fontWeight={950} sx={{ fontSize: "0.95rem", lineHeight: 1.2, color: "#111" }}>
          {folder.topic}
        </Typography>
      </Stack>

      {folder.description && (
        <Typography
          sx={{
            fontSize: "0.79rem",
            color: "rgba(0,0,0,0.55)",
            lineHeight: 1.5,
            mt: 0.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {folder.description}
        </Typography>
      )}

      {(folder.tags ?? []).length > 0 && (
        <Stack direction="row" flexWrap="wrap" gap={0.4} sx={{ mt: 1 }}>
          {folder.tags!.slice(0, 3).map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              sx={{ height: 16, fontSize: "0.62rem", fontWeight: 700, bgcolor: "rgba(168,5,50,0.07)", color: "#A80532" }}
            />
          ))}
        </Stack>
      )}

      <Divider sx={{ my: 1.25 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Avatar sx={{ width: 22, height: 22, fontSize: "0.60rem", bgcolor: "#A80532", fontWeight: 900 }}>
            {folder.createdByEmail[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: "0.70rem", fontWeight: 800, color: "rgba(0,0,0,0.70)", lineHeight: 1.1 }}>
              {folder.createdByEmail}
            </Typography>
            <Typography sx={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.38)" }}>{formatRelative(folder.createdAt)}</Typography>
          </Box>
        </Stack>
        <Typography sx={{ fontSize: "0.66rem", color: "rgba(0,0,0,0.45)", fontWeight: 800 }}>
          Open
        </Typography>
      </Stack>

      {/* subtle private overlay */}
      {isPrivate && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(255,255,255,0) 55%)",
          }}
        />
      )}
    </Paper>
  );
}

function SubTabBar({
  active,
  counts,
  onChange,
  onCreateFolder,
}: {
  active: number;
  counts: number[];
  onChange: (i: number) => void;
  onCreateFolder: () => void;
}) {
  const tabs = [
    { label: "Public Library", emoji: "\ud83c\udf10" },
    { label: "Saved Notes", emoji: "\ud83d\udd16" },
  ];

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, flexWrap: "wrap", gap: 1 }}>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
        {tabs.map((t, i) => (
          <Box
            key={t.label}
            onClick={() => onChange(i)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              px: 1.5,
              py: 0.6,
              borderRadius: 999,
              cursor: "pointer",
              userSelect: "none",
              transition: "all 0.15s",
              bgcolor: active === i ? "#fff" : "rgba(255,255,255,0.10)",
              color: active === i ? "#A80532" : "rgba(255,255,255,0.75)",
              border: active === i ? "none" : "1px solid rgba(255,255,255,0.18)",
              fontWeight: 700,
              fontSize: "0.80rem",
              fontFamily: "'DM Sans', sans-serif",
              "&:hover": { bgcolor: active === i ? "#fff" : "rgba(255,255,255,0.18)" },
            }}
          >
            <span style={{ fontSize: "0.75rem" }}>{t.emoji}</span>
            {t.label}
            {counts[i] > 0 && (
              <Box
                sx={{
                  ml: 0.25,
                  px: 0.6,
                  py: 0.1,
                  borderRadius: 999,
                  fontSize: "0.60rem",
                  fontWeight: 900,
                  bgcolor: active === i ? "#A80532" : "rgba(255,255,255,0.22)",
                  color: active === i ? "#fff" : "rgba(255,255,255,0.85)",
                  lineHeight: 1.6,
                }}
              >
                {counts[i]}
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      <Button
        variant="contained"
        startIcon={<AddIcon sx={{ fontSize: "14px !important" }} />}
        onClick={onCreateFolder}
        sx={{
          bgcolor: "#fff",
          color: "#A80532",
          fontWeight: 950,
          borderRadius: 999,
          fontSize: "0.82rem",
          px: 2,
          "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
          flexShrink: 0,
        }}
      >
        Upload Folder
      </Button>
    </Stack>
  );
}

function FolderCreateModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (folder: NoteFolder) => void;
}) {
  const [topic, setTopic] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [courseNumber, setCourseNumber] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [invited, setInvited] = React.useState<string[]>([]);
  const [createdByEmail, setCreatedByEmail] = React.useState("");

  const canSubmit = React.useMemo(() => {
    if (!topic.trim()) return false;
    if (!subject.trim()) return false;
    if (!createdByEmail.trim() || !isCsunEmail(createdByEmail)) return false;
    if (!isPublic && invited.length === 0) return false;
    return true;
  }, [topic, subject, createdByEmail, isPublic, invited.length]);

  const addInvite = () => {
    const e = inviteEmail.trim().toLowerCase();
    if (!e) return;
    if (!isCsunEmail(e)) return;
    if (invited.includes(e)) return;
    setInvited((prev) => [...prev, e]);
    setInviteEmail("");
  };

  const submit = () => {
    if (!canSubmit) return;
    const folder: NoteFolder = {
      id: makeId(),
      topic: topic.trim(),
      description: description.trim() || undefined,
      subject: subject.trim().toUpperCase(),
      courseNumber: courseNumber.trim() || undefined,
      createdAt: new Date().toISOString(),
      createdByEmail: createdByEmail.trim().toLowerCase(),
      visibility: isPublic ? "public" : "private",
      invitedEmails: isPublic ? undefined : invited,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      savedByMe: true,
    };
    onCreate(folder);
    setTopic("");
    setSubject("");
    setCourseNumber("");
    setDescription("");
    setTags("");
    setIsPublic(true);
    setInviteEmail("");
    setInvited([]);
    setCreatedByEmail("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
      <Box sx={{ bgcolor: "#A80532", px: 3, py: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <FolderRoundedIcon sx={{ color: "#fff", fontSize: 22 }} />
            <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.1rem" }}>
              Upload Folder
            </Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.80)" }}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", mt: 0.4 }}>
          Create a subject folder, then upload files inside it.
        </Typography>
      </Box>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={1.6}>
          <TextField
            size="small"
            label="Topic *"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder='e.g. "Midterm Review Pack"'
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <TextField
              size="small"
              label="Subject *"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="COMP"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              size="small"
              label="Course Number (optional)"
              value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)}
              placeholder="333"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>
          <TextField
            size="small"
            label="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={2}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <TextField
            size="small"
            label="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="STEM, Midterm, Practice"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: 2.5,
              bgcolor: isPublic ? "#f0fdf4" : "#f5f3ff",
              border: `1.5px solid ${isPublic ? "#bbf7d0" : "#ddd6fe"}`,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#16a34a" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#16a34a" },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, color: isPublic ? "#16a34a" : "#7c3aed" }}>
                    {isPublic ? "\ud83c\udf10 Public" : "\ud83d\udd12 Private"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", mt: 0.2 }}>
                    {isPublic
                      ? "Visible to all CSUN students"
                      : "Only invited CSUN emails can view this folder"}
                  </Typography>
                </Box>
              }
            />
          </Paper>

          {!isPublic && (
            <Box>
              <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "rgba(0,0,0,0.50)", mb: 0.75, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Invited Emails (must end with @my.csun.edu)
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInvite();
                    }
                  }}
                  placeholder="example@my.csun.edu"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button
                  onClick={addInvite}
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(0,0,0,0.20)",
                    color: "rgba(0,0,0,0.80)",
                    fontWeight: 950,
                    borderRadius: 999,
                    px: 2.25,
                    "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  Add
                </Button>
              </Stack>
              {invited.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 1 }}>
                  {invited.map((e) => (
                    <Chip
                      key={e}
                      label={e}
                      size="small"
                      onDelete={() => setInvited((prev) => prev.filter((x) => x !== e))}
                      sx={{ fontWeight: 800, bgcolor: "rgba(124,58,237,0.10)", color: "#7c3aed" }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          <TextField
            size="small"
            label="Your CSUN Email *"
            value={createdByEmail}
            onChange={(e) => setCreatedByEmail(e.target.value)}
            placeholder="you@my.csun.edu"
            error={!!createdByEmail && !isCsunEmail(createdByEmail)}
            helperText={
              !!createdByEmail && !isCsunEmail(createdByEmail)
                ? "Must end with @my.csun.edu"
                : ""
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            variant="contained"
            onClick={submit}
            disabled={!canSubmit}
            sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.25 }}
          >
            Create Folder
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default function NoteSharePanel() {
  const [folders, setFolders] = React.useState<NoteFolder[]>(mockNoteFolders);
  const [items, setItems] = React.useState<NoteFolderItem[]>(mockNoteFolderItems);
  const [comments, setComments] = React.useState<NoteComment[]>(mockNoteComments);

  const [subTab, setSubTab] = React.useState(0);
  const [createFolderOpen, setCreateFolderOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeSubject, setActiveSubject] = React.useState("All");
  const [activeTag, setActiveTag] = React.useState<string>("All");
  const [toast, setToast] = React.useState<string | null>(null);

  const [openFolderId, setOpenFolderId] = React.useState<string | null>(null);

  const publicFolders = folders.filter((f) => f.visibility === "public");
  const savedFolders = folders.filter((f) => !!f.savedByMe);

  const displayedFolders = React.useMemo(() => {
    const base = subTab === 0 ? publicFolders : savedFolders;
    let list = [...base];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((f) => {
        const hay = `${f.topic} ${f.description ?? ""} ${f.subject} ${f.courseNumber ?? ""} ${(f.tags ?? []).join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (activeSubject !== "All") {
      list = list.filter((f) => f.subject === activeSubject);
    }

    if (activeTag !== "All") {
      if (activeTag === "Private") {
        list = list.filter((f) => f.visibility === "private");
      } else if (activeTag === "Public") {
        list = list.filter((f) => f.visibility === "public");
      } else {
        list = list.filter((f) => (f.tags ?? []).includes(activeTag));
      }
    }

    // newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [subTab, publicFolders, savedFolders, searchQuery, activeSubject, activeTag]);

  const openFolder = folders.find((f) => f.id === openFolderId) ?? null;

  const subTabCounts = [publicFolders.length, savedFolders.length];

  const handleCreateFolder = (folder: NoteFolder) => {
    setFolders((prev) => [folder, ...prev]);
    setToast("Folder created!");
  };

  const folderItemCount = React.useCallback(
    (folderId: string) => items.filter((i) => i.folderId === folderId).length,
    [items]
  );

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Box>
          <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.15rem", lineHeight: 1.2 }}>
            Note Share
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", mt: 0.25 }}>
            {publicFolders.length} public folders · {savedFolders.length} saved
          </Typography>
        </Box>
      </Stack>

      <SubTabBar active={subTab} counts={subTabCounts} onChange={setSubTab} onCreateFolder={() => setCreateFolderOpen(true)} />

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          p: 1.75,
          mb: 2.5,
          bgcolor: "rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ sm: "center" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search notes, courses, topics, authors…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.45)" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "#fff",
                borderRadius: 2,
                "& fieldset": { borderColor: "rgba(255,255,255,0.18)" },
              },
              "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.45)", opacity: 1 },
            }}
          />
        </Stack>

        {/* combined chip section: subjects + tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.65, mt: 1.25 }}>
          {SUBJECT_CHIPS.map((s) => (
            <Chip
              key={s}
              label={s}
              size="small"
              clickable
              onClick={() => setActiveSubject(s)}
              sx={{
                fontWeight: 900,
                fontSize: "0.68rem",
                bgcolor: activeSubject === s ? "#fff" : "rgba(255,255,255,0.10)",
                color: activeSubject === s ? "#A80532" : "rgba(255,255,255,0.72)",
                "&:hover": { bgcolor: activeSubject === s ? "#fff" : "rgba(255,255,255,0.18)" },
              }}
            />
          ))}

          {/* tag reset uses the built-in toggle (click an active tag to return to All) */}

          {subTab === 1 && (
            <Chip
              label="Private"
              size="small"
              clickable
              onClick={() => setActiveTag(activeTag === "Private" ? "All" : "Private")}
              sx={{
                fontWeight: 900,
                fontSize: "0.68rem",
                bgcolor: activeTag === "Private" ? "#fff" : "rgba(255,255,255,0.10)",
                color: activeTag === "Private" ? "#A80532" : "rgba(255,255,255,0.72)",
                "&:hover": { bgcolor: activeTag === "Private" ? "#fff" : "rgba(255,255,255,0.18)" },
              }}
            />
          )}

          {TOPIC_TAGS.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              clickable
              onClick={() => setActiveTag(activeTag === t ? "All" : t)}
              sx={{
                fontWeight: 900,
                fontSize: "0.68rem",
                bgcolor: activeTag === t ? "#fff" : "rgba(255,255,255,0.10)",
                color: activeTag === t ? "#A80532" : "rgba(255,255,255,0.72)",
                "&:hover": { bgcolor: activeTag === t ? "#fff" : "rgba(255,255,255,0.18)" },
              }}
            />
          ))}
        </Box>
      </Paper>

      {displayedFolders.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            textAlign: "center",
          }}
        >
          <FolderRoundedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.28)", mb: 1.5 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.80)", fontWeight: 900, fontSize: "1rem" }}>
            No folders found.
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.45)", mt: 0.5, fontSize: "0.88rem" }}>
            Try a different search or create a folder.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateFolderOpen(true)}
            sx={{ mt: 2, bgcolor: "#fff", color: "#A80532", fontWeight: 950, borderRadius: 999 }}
          >
            Upload Folder
          </Button>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {displayedFolders.map((f) => (
            <FolderCard
              key={f.id}
              folder={f}
              itemCount={folderItemCount(f.id)}
              onOpen={() => setOpenFolderId(f.id)}
            />
          ))}
        </Box>
      )}

      <FolderCreateModal open={createFolderOpen} onClose={() => setCreateFolderOpen(false)} onCreate={handleCreateFolder} />

      {openFolder && (
        <NoteView
          open
          folder={openFolder}
          items={items}
          comments={comments}
          onClose={() => setOpenFolderId(null)}
          onUploadItem={(newItem) => {
            setItems((prev) => [newItem, ...prev]);
            setToast("Upload added!");
          }}
          onAddComment={(newComment) => {
            setComments((prev) => [newComment, ...prev]);
            setToast("Comment posted!");
          }}
        />
      )}

      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
