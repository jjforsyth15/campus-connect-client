"use client";

// ============================================================
// NoteSharePanel.tsx — Updated: Save & Leave Logic
// ============================================================
// NEW handlers added:
//   handleSaveFolder   → POST   /api/note-share/folders/:id/save
//   handleUnsaveFolder → DELETE /api/note-share/folders/:id/save
//
// These are passed down to FolderCard so each card can render
// a Save bookmark button (on the Public Library tab) and an
// Unsave / Leave button (on the Saved Notes tab).
//
// Full API surface for this panel:
//   GET    /api/note-share/folders            – list public folders
//   GET    /api/note-share/folders?saved=true – list saved folders (auth)
//   POST   /api/note-share/folders            – create a folder
//   POST   /api/note-share/folders/:id/save   – save / bookmark a folder
//   DELETE /api/note-share/folders/:id/save   – unsave / leave a folder
//   POST   /api/note-share/items              – upload item to a folder
//   POST   /api/note-share/comments           – post a comment
// ============================================================

import * as React from "react";
import { Alert, Box, Button, Chip, InputAdornment, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import type { NoteComment, NoteFolder, NoteFolderItem } from "@/components/academics/shared/constants";

// BACKEND TODO: Remove mock imports once real API calls are wired up.
import { mockNoteComments, mockNoteFolderItems, mockNoteFolders } from "@/components/academics/shared/mockData";

import NoteView from "@/components/academics/NoteShare/NoteView";
import { FolderCard, FolderCreateModal, SubTabBar } from "@/components/academics/NoteShare/NoteSharePanel.components";
import { SUBJECT_CHIPS, TOPIC_TAGS } from "@/components/academics/NoteShare/NoteSharePanel.utils";

export default function NoteSharePanel() {
  // BACKEND TODO: Replace with SWR / React Query:
  //   const { data: folders, mutate } = useSWR('/api/note-share/folders');
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

  // BACKEND NOTE: publicFolders / savedFolders are filtered client-side for now.
  // Once the API is live, these come from separate endpoints:
  //   GET /api/note-share/folders              → public folders
  //   GET /api/note-share/folders?saved=true   → folders the current user has saved
  const publicFolders = folders.filter((f) => f.visibility === "public");
  const savedFolders = folders.filter((f) => !!f.savedByMe);

  // BACKEND NOTE: All filtering is client-side for now.
  // Move to server-side query params once the dataset grows:
  //   GET /api/note-share/folders?q=calculus&subject=MATH&tag=STEM
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
    if (activeSubject !== "All") list = list.filter((f) => f.subject === activeSubject);
    if (activeTag !== "All") {
      if (activeTag === "Private") list = list.filter((f) => f.visibility === "private");
      else if (activeTag === "Public") list = list.filter((f) => f.visibility === "public");
      else list = list.filter((f) => (f.tags ?? []).includes(activeTag));
    }

    // BACKEND NOTE: Replicate ORDER BY created_at DESC in the SQL query.
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [subTab, publicFolders, savedFolders, searchQuery, activeSubject, activeTag]);

  const openFolder = folders.find((f) => f.id === openFolderId) ?? null;
  const subTabCounts = [publicFolders.length, savedFolders.length];

  // ── handleCreateFolder ──────────────────────────────────────
  // BACKEND TODO: POST /api/note-share/folders
  //   Body: { topic, description, subject, courseNumber, visibility, invitedEmails, tags }
  //   Response: the persisted NoteFolder with DB-assigned id + createdAt
  //   On success: mutateFolders() to refresh the list via SWR.
  const handleCreateFolder = (folder: NoteFolder) => {
    setFolders((prev) => [folder, ...prev]);
    setToast("Folder created!");
  };

  // ── handleSaveFolder ────────────────────────────────────────
  // Bookmarks a public folder into the current user's Saved Notes tab.
  //
  // BACKEND TODO: POST /api/note-share/folders/:id/save
  //   Headers: Authorization: Bearer <csun_jwt>
  //   Body:    (none required — identity comes from the auth session)
  //   Response: 200 OK { savedByMe: true }
  //
  // DB write:
  //   INSERT INTO note_folder_saves (folder_id, user_email, saved_at)
  //   VALUES (:folderId, req.user.email, NOW())
  //   ON CONFLICT (folder_id, user_email) DO NOTHING
  //
  // The `savedByMe` boolean on the folder object returned by the API is
  // computed server-side:
  //   SELECT *, EXISTS(
  //     SELECT 1 FROM note_folder_saves
  //     WHERE folder_id = nf.id AND user_email = $currentUser
  //   ) AS saved_by_me
  //   FROM note_folders nf
  //
  // After success: optimistically flip folder.savedByMe = true in local state,
  // then revalidate via mutateFolders() to sync with the server.
  const handleSaveFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, savedByMe: true } : f))
    );
    setToast("Folder saved!");
    // BACKEND TODO: replace the above with:
    // await fetch(`/api/note-share/folders/${folderId}/save`, { method: 'POST' });
    // mutateFolders();
  };

  // ── handleUnsaveFolder ──────────────────────────────────────
  // Removes a folder from the current user's Saved Notes tab.
  // This does NOT delete the folder itself — it only removes the
  // user's personal bookmark/save record.
  //
  // BACKEND TODO: DELETE /api/note-share/folders/:id/save
  //   Headers: Authorization: Bearer <csun_jwt>
  //   Body:    (none — identity from auth session)
  //   Response: 200 OK { savedByMe: false }
  //
  // DB write:
  //   DELETE FROM note_folder_saves
  //   WHERE folder_id = :folderId AND user_email = req.user.email
  //
  // After success: flip folder.savedByMe = false in local state and
  // remove the folder from the "Saved Notes" tab display.
  // If the user is currently on the Saved Notes tab (subTab === 1),
  // the folder should disappear from the list immediately (optimistic update).
  //
  // Note: "Leave" and "Unsave" are the same action for this feature.
  // A student saving a folder is the equivalent of "joining" it as a reader.
  // There is no separate membership model for folders — just the save record.
  const handleUnsaveFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, savedByMe: false } : f))
    );
    setToast("Removed from saved folders.");
    // BACKEND TODO: replace the above with:
    // await fetch(`/api/note-share/folders/${folderId}/save`, { method: 'DELETE' });
    // mutateFolders();
  };

  // BACKEND NOTE: folderItemCount is computed in-memory for now.
  // Once the API returns an `itemCount` field on each folder object
  // (via a SQL COUNT subquery), this callback becomes unnecessary.
  const folderItemCount = React.useCallback(
    (folderId: string) => items.filter((i) => i.folderId === folderId).length,
    [items]
  );

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2.5 }}
      >
        <Box>
          <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.15rem", lineHeight: 1.2 }}>
            Note Share
          </Typography>
          {/* BACKEND: counts should come from a lightweight count API, not from the
              length of the locally loaded arrays. */}
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", mt: 0.25 }}>
            {publicFolders.length} public folders · {savedFolders.length} saved
          </Typography>
        </Box>
      </Stack>

      <SubTabBar active={subTab} counts={subTabCounts} onChange={setSubTab} onCreateFolder={() => setCreateFolderOpen(true)} />

      {/* Search + filter bar
          BACKEND: Debounce searchQuery (300ms) and pass as query param once paginated. */}
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

        {/* BACKEND: Fetch SUBJECT_CHIPS from GET /api/note-share/subjects */}
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

          {/* BACKEND: ?saved=true&visibility=private */}
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

          {/* BACKEND: Fetch TOPIC_TAGS from GET /api/note-share/tags. Pass as ?tag=STEM */}
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
          <Typography sx={{ color: "rgba(255,255,255,0.80)", fontWeight: 900, fontSize: "1rem" }}>No folders found.</Typography>
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
        // BACKEND TODO: Add pagination — GET /api/note-share/folders?page=1&limit=20
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {displayedFolders.map((f) => (
            <FolderCard
              key={f.id}
              folder={f}
              itemCount={folderItemCount(f.id)}
              isSaved={!!f.savedByMe}
              // onSave triggers POST /api/note-share/folders/:id/save
              onSave={() => handleSaveFolder(f.id)}
              // onUnsave triggers DELETE /api/note-share/folders/:id/save
              onUnsave={() => handleUnsaveFolder(f.id)}
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
          // BACKEND TODO: POST /api/note-share/items (multipart/form-data for file upload)
          onUploadItem={(newItem) => {
            setItems((prev) => [newItem, ...prev]);
            setToast("Upload added!");
          }}
          // BACKEND TODO: POST /api/note-share/comments
          onAddComment={(newComment) => {
            setComments((prev) => [newComment, ...prev]);
            setToast("Comment posted!");
          }}
        />
      )}

      {/* BACKEND: Surface actual API success/error messages here once live. */}
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
