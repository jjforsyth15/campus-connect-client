"use client";

import * as React from "react";
import { Alert, Box, Button, Chip, InputAdornment, Paper, Snackbar, Stack, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

import type { NoteComment, NoteFolder, NoteFolderItem } from "@/components/academics/shared/constants";
import { mockNoteComments, mockNoteFolderItems, mockNoteFolders } from "@/components/academics/shared/mockData";
import NoteView from "@/components/academics/NoteShare/NoteView";

import { FolderCard, FolderCreateModal, SubTabBar } from "@/components/academics/NoteShare/NoteSharePanel.components";
import { SUBJECT_CHIPS, TOPIC_TAGS } from "@/components/academics/NoteShare/NoteSharePanel.utils";

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
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {displayedFolders.map((f) => (
            <FolderCard key={f.id} folder={f} itemCount={folderItemCount(f.id)} onOpen={() => setOpenFolderId(f.id)} />
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
