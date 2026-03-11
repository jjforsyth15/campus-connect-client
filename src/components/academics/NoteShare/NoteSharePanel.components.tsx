"use client";

// ============================================================
// NoteSharePanel.components.tsx — Updated: Save & Leave Logic
// ============================================================
// CHANGES IN THIS FILE:
//   FolderCard now accepts three new props:
//     isSaved   boolean       — whether the current user has saved this folder
//     onSave    () => void    — triggers POST /api/note-share/folders/:id/save
//     onUnsave  () => void    — triggers DELETE /api/note-share/folders/:id/save
//
//   A bookmark icon button is rendered in the card footer:
//     - On the Public Library tab (isSaved = false): shows a hollow bookmark → Save
//     - On the Saved Notes tab  (isSaved = true):  shows a filled bookmark → Unsave / Leave
//
// SubTabBar and FolderCreateModal are unchanged from the previous version.
// ============================================================

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CloseIcon from "@mui/icons-material/Close";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import type { NoteFolder } from "@/components/academics/shared/constants";
import { formatRelative, isCsunEmail, makeId } from "@/components/academics/NoteShare/NoteSharePanel.utils";

// ────────────────────────────────────────────────────────────
// FolderCard
// ────────────────────────────────────────────────────────────
// BACKEND NOTE: FolderCard is a display component.
// The `folder` prop should be the object returned by:
//   GET /api/note-share/folders
// which includes a server-computed `savedByMe` boolean field:
//   SELECT *, EXISTS(
//     SELECT 1 FROM note_folder_saves
//     WHERE folder_id = nf.id AND user_email = $currentUser
//   ) AS saved_by_me
//   FROM note_folders nf
//
// `itemCount` should be returned as a denormalized count field
// rather than computed on the client from a full items list.
export function FolderCard({
  folder,
  itemCount,
  isSaved,
  onSave,
  onUnsave,
  onOpen,
}: {
  folder: NoteFolder;
  itemCount: number;    // BACKEND: from `_count.items` (Prisma) or a SQL COUNT join
  isSaved: boolean;     // BACKEND: from `saved_by_me` field in the API response
  onSave: () => void;   // BACKEND: POST   /api/note-share/folders/:id/save
  onUnsave: () => void; // BACKEND: DELETE /api/note-share/folders/:id/save
  onOpen: () => void;
}) {
  const isPrivate = folder.visibility === "private";

  return (
    <Paper
      elevation={0}
      onClick={onOpen}
      sx={{
        borderRadius: 3.5,
        p: 2,
        bgcolor: "#fff",
        border: isSaved ? "1.5px solid #bbf7d0" : "1.5px solid rgba(0,0,0,0.07)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
        "&:hover": {
          boxShadow: "0 10px 34px rgba(168,5,50,0.12)",
          transform: "translateY(-2px)",
          borderColor: isSaved ? "#86efac" : "rgba(168,5,50,0.22)",
        },
      }}
    >
      {/* Folder tab decoration */}
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
          {/* BACKEND: folder.subject + folder.courseNumber → note_folders.subject + course_number */}
          <Chip
            label={folder.courseNumber ? `${folder.subject} ${folder.courseNumber}` : folder.subject}
            size="small"
            sx={{ bgcolor: "#A80532", color: "#fff", fontWeight: 900, fontSize: "0.68rem", height: 20 }}
          />
          {/* BACKEND: folder.visibility → note_folders.visibility ENUM('public','private').
              Private folders must never be returned by the API to unauthorized users. */}
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
          {/* Saved badge — shown when the current user has saved this folder */}
          {isSaved && (
            <Chip
              icon={<BookmarkRoundedIcon sx={{ fontSize: "10px !important" }} />}
              label="Saved"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.62rem",
                fontWeight: 900,
                bgcolor: "#f0fdf4",
                color: "#16a34a",
                "& .MuiChip-icon": { color: "#16a34a" },
              }}
            />
          )}
        </Stack>
        <Chip
          size="small"
          label={`${itemCount} item${itemCount === 1 ? "" : "s"}`}
          sx={{ height: 20, fontSize: "0.62rem", fontWeight: 900, bgcolor: "rgba(168,5,50,0.08)", color: "#A80532" }}
        />
      </Stack>

      {/* Folder title */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.2 }}>
        <FolderRoundedIcon sx={{ fontSize: 20, color: "rgba(168,5,50,0.85)" }} />
        {/* BACKEND: folder.topic → note_folders.topic VARCHAR(255) */}
        <Typography fontWeight={950} sx={{ fontSize: "0.95rem", lineHeight: 1.2, color: "#111" }}>
          {folder.topic}
        </Typography>
      </Stack>

      {/* Description */}
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
          {/* BACKEND: folder.description → note_folders.description TEXT */}
          {folder.description}
        </Typography>
      )}

      {/* Tags */}
      {/* BACKEND: folder.tags → note_folders.tags TEXT[] or a `folder_tags` join table */}
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

      {/* Card footer: creator info + save/unsave action */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={0.75} alignItems="center">
          {/* BACKEND: folder.createdByEmail → note_folders.created_by_email
              Derive from req.user.email on the server during folder creation.
              Never accept this as a user-supplied form field post-auth. */}
          <Avatar sx={{ width: 22, height: 22, fontSize: "0.60rem", bgcolor: "#A80532", fontWeight: 900 }}>
            {folder.createdByEmail?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: "0.70rem", fontWeight: 800, color: "rgba(0,0,0,0.70)", lineHeight: 1.1 }}>
              {folder.createdByEmail}
            </Typography>
            {/* BACKEND: folder.createdAt → note_folders.created_at TIMESTAMPTZ DEFAULT NOW() */}
            <Typography sx={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.38)" }}>{formatRelative(folder.createdAt)}</Typography>
          </Box>
        </Stack>

        {/* ── Save / Unsave (Leave) button ──────────────────────
            This is the primary new UI element for this update.
            The button stops click propagation so it doesn't open
            the folder dialog when tapped.

            SAVE action:
              Endpoint : POST /api/note-share/folders/:id/save
              Auth     : requires @my.csun.edu JWT/session
              DB write : INSERT INTO note_folder_saves
                           (folder_id, user_email, saved_at)
                         VALUES (:id, req.user.email, NOW())
                         ON CONFLICT DO NOTHING
              Response : 200 { savedByMe: true }
              Effect   : folder appears in the user's "Saved Notes" tab.

            UNSAVE / LEAVE action:
              Endpoint : DELETE /api/note-share/folders/:id/save
              Auth     : requires @my.csun.edu JWT/session
              DB write : DELETE FROM note_folder_saves
                         WHERE folder_id = :id AND user_email = req.user.email
              Response : 200 { savedByMe: false }
              Effect   : folder is removed from the user's "Saved Notes" tab.
                         The folder itself is NOT deleted — only the personal
                         save record is removed.

            Error cases the server must handle:
              401 — unauthenticated user tries to save
              404 — folderId does not exist
              403 — user tries to save a private folder they are not invited to
        ─────────────────────────────────────────────────────── */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          {isSaved ? (
            <Tooltip title="Remove from saved">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening the folder dialog
                  onUnsave();          // → DELETE /api/note-share/folders/:id/save
                }}
                sx={{
                  p: 0.6,
                  color: "#A80532",
                  "&:hover": { bgcolor: "rgba(168,5,50,0.08)" },
                }}
              >
                <BookmarkRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Save folder">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // prevent opening the folder dialog
                  onSave();            // → POST /api/note-share/folders/:id/save
                }}
                sx={{
                  p: 0.6,
                  color: "rgba(0,0,0,0.38)",
                  "&:hover": { color: "#A80532", bgcolor: "rgba(168,5,50,0.06)" },
                }}
              >
                <BookmarkBorderRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}
          <Typography sx={{ fontSize: "0.66rem", color: "rgba(0,0,0,0.45)", fontWeight: 800 }}>Open</Typography>
        </Stack>
      </Stack>

      {/* Private folder overlay tint */}
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

// ────────────────────────────────────────────────────────────
// SubTabBar — unchanged
// ────────────────────────────────────────────────────────────
// BACKEND NOTE: `counts` should come from a lightweight count
// endpoint rather than the full folder list length:
//   GET /api/note-share/folders/counts → { publicCount, savedCount }
export function SubTabBar({
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
    { label: "Public Library" },
    { label: "Saved Notes" },
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
            <span style={{ fontSize: "0.75rem" }}></span>
            {t.label}
            {counts[i] > 0 && (
              <Box
                sx={{
                  ml: 0.25,
                  bgcolor: active === i ? "#A80532" : "rgba(255,255,255,0.25)",
                  color: active === i ? "#fff" : "rgba(255,255,255,0.85)",
                  borderRadius: 999,
                  px: 0.75,
                  py: 0.1,
                  fontSize: "0.68rem",
                  fontWeight: 900,
                  lineHeight: 1.6,
                }}
              >
                {counts[i]}
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      {/* BACKEND: Gate this button behind auth — only show when a CSUN session exists.
          Triggers POST /api/note-share/folders on form submit. */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onCreateFolder}
        sx={{
          bgcolor: "#fff",
          color: "#A80532",
          fontWeight: 950,
          borderRadius: 999,
          fontSize: "0.80rem",
          "&:hover": { bgcolor: "rgba(255,255,255,0.90)" },
        }}
      >
        Upload Folder
      </Button>
    </Stack>
  );
}

// ────────────────────────────────────────────────────────────
// FolderCreateModal — unchanged
// ────────────────────────────────────────────────────────────
// BACKEND TODO: submit() → POST /api/note-share/folders
//   Body: { topic, description, subject, courseNumber,
//           visibility, invitedEmails, tags }
//   Server sets: id (UUID), createdAt (NOW()), createdByEmail (from auth session)
//   Remove the "Your CSUN Email" field once SSO auth is live.
export function FolderCreateModal({
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
  const [createdByEmail, setCreatedByEmail] = React.useState(""); // BACKEND: remove post-auth

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

    // BACKEND TODO: Replace with:
    //   const res = await fetch('/api/note-share/folders', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       topic, description, subject, courseNumber,
    //       visibility: isPublic ? 'public' : 'private',
    //       invitedEmails: isPublic ? [] : invited,
    //       tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    //     }),
    //   });
    //   const folder = await res.json();
    //   onCreate(folder);
    const folder: NoteFolder = {
      id: makeId(),                           // BACKEND: DB-returned UUID
      topic: topic.trim(),
      description: description.trim() || undefined,
      subject: subject.trim().toUpperCase(),
      courseNumber: courseNumber.trim() || undefined,
      createdAt: new Date().toISOString(),    // BACKEND: set server-side
      createdByEmail: createdByEmail.trim().toLowerCase(), // BACKEND: from auth session
      visibility: isPublic ? "public" : "private",
      invitedEmails: isPublic ? undefined : invited,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      savedByMe: true, // BACKEND: computed from note_folder_saves join
    };
    onCreate(folder);

    setTopic(""); setSubject(""); setCourseNumber(""); setDescription(""); setTags("");
    setIsPublic(true); setInviteEmail(""); setInvited([]); setCreatedByEmail("");
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
          {/* BACKEND: topic → note_folders.topic VARCHAR(255) NOT NULL */}
          <TextField
            size="small" label="Topic *" value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder='e.g. "Midterm Review Pack"'
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            {/* BACKEND: subject → note_folders.subject VARCHAR(20) */}
            <TextField size="small" label="Subject *" value={subject}
              onChange={(e) => setSubject(e.target.value)} placeholder="COMP"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            {/* BACKEND: courseNumber → note_folders.course_number VARCHAR(20) */}
            <TextField size="small" label="Course Number (optional)" value={courseNumber}
              onChange={(e) => setCourseNumber(e.target.value)} placeholder="333"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </Stack>

          {/* BACKEND: description → note_folders.description TEXT */}
          <TextField size="small" label="Short Description" value={description}
            onChange={(e) => setDescription(e.target.value)} multiline minRows={2}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* BACKEND: tags → note_folders.tags TEXT[] or a folder_tags join table */}
          <TextField size="small" label="Tags (comma-separated)" value={tags}
            onChange={(e) => setTags(e.target.value)} placeholder="STEM, Midterm, Practice"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* BACKEND: visibility → note_folders.visibility ENUM('public','private')
              Access control MUST be enforced server-side — this toggle is UX only. */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5, borderRadius: 2.5,
              bgcolor: isPublic ? "#f0fdf4" : "#f5f3ff",
              border: `1.5px solid ${isPublic ? "#bbf7d0" : "#ddd6fe"}`,
            }}
          >
            <FormControlLabel
              control={
                <Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#16a34a" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#16a34a" },
                  }}
                />
              }
              label={
                <Box>
                  <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, color: isPublic ? "#16a34a" : "#7c3aed" }}>
                    {isPublic ? "🌐 Public" : "🔒 Private"}
                  </Typography>
                  <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", mt: 0.2 }}>
                    {isPublic ? "Visible to all CSUN students" : "Only invited CSUN emails can view this folder"}
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
              {/* BACKEND: Each email → INSERT INTO folder_invites (folder_id, invited_email, invited_at)
                  Optionally send invitation email via SendGrid/CSUN SMTP on folder creation. */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  size="small" fullWidth value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addInvite(); } }}
                  placeholder="example@my.csun.edu"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Button onClick={addInvite} variant="outlined"
                  sx={{ borderColor: "rgba(0,0,0,0.20)", color: "rgba(0,0,0,0.80)", fontWeight: 950, borderRadius: 999, px: 2.25, "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" } }}>
                  Add
                </Button>
              </Stack>
              {invited.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 1 }}>
                  {invited.map((e) => (
                    <Chip key={e} label={e} size="small"
                      onDelete={() => setInvited((prev) => prev.filter((x) => x !== e))}
                      sx={{ fontWeight: 800, bgcolor: "rgba(124,58,237,0.10)", color: "#7c3aed" }}
                    />
                  ))}
                </Stack>
              )}
            </Box>
          )}

          {/* BACKEND: TEMPORARY — remove once CSUN SSO is live.
              createdByEmail will be derived from req.user.email in the session token. */}
          <TextField
            size="small" label="Your CSUN Email *" value={createdByEmail}
            onChange={(e) => setCreatedByEmail(e.target.value)} placeholder="you@my.csun.edu"
            error={!!createdByEmail && !isCsunEmail(createdByEmail)}
            helperText={!!createdByEmail && !isCsunEmail(createdByEmail) ? "Must end with @my.csun.edu" : ""}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* BACKEND: Disable + show spinner while POST is in-flight.
              Surface 409 (duplicate) or 403 (unauthorized) errors inline. */}
          <Button variant="contained" onClick={submit} disabled={!canSubmit}
            sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.25 }}>
            Create Folder
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
