"use client";

import * as React from "react";
import { Box, Button, Chip, Dialog, DialogContent, Divider, FormControl, IconButton, InputAdornment, MenuItem, Paper,
  Select, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageIcon from "@mui/icons-material/Image";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import LinkIcon from "@mui/icons-material/Link";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import type {
  NoteComment,
  NoteFolder,
  NoteFolderItem,
  NoteFolderItemType,
  NoteFolderVisibility,
} from "@/components/academics/shared/constants";

import NoteViewCommentsPanel from "@/components/academics/NoteShare/NoteViewCommentsPanel";
import { Stars } from "@/components/academics/NoteShare/NoteView.ui";

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

const TYPE_META: Record<NoteFolderItemType, { label: string; icon: React.ReactNode }> = {
  pdf: { label: "PDF", icon: <PictureAsPdfIcon sx={{ fontSize: 16 }} /> },
  doc: { label: "Doc", icon: <DescriptionIcon sx={{ fontSize: 16 }} /> },
  video: { label: "Video", icon: <VideoLibraryIcon sx={{ fontSize: 16 }} /> },
  image: { label: "Image", icon: <ImageIcon sx={{ fontSize: 16 }} /> },
  zip: { label: "ZIP", icon: <FolderZipIcon sx={{ fontSize: 16 }} /> },
  link: { label: "Link", icon: <LinkIcon sx={{ fontSize: 16 }} /> },
};

function calcAvgRating(comments: NoteComment[], itemId?: string) {
  const list = comments.filter((c) => (itemId ? c.itemId === itemId : true));
  if (list.length === 0) return 0;
  const sum = list.reduce((a, c) => a + c.rating, 0);
  return sum / list.length;
}

export default function NoteView({
  open,
  folder,
  items,
  comments,
  onClose,
  onUploadItem,
  onAddComment,
}: {
  open: boolean;
  folder: NoteFolder;
  items: NoteFolderItem[];
  comments: NoteComment[];
  onClose: () => void;
  onUploadItem: (item: NoteFolderItem) => void;
  onAddComment: (comment: NoteComment) => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [mode, setMode] = React.useState<"view" | "upload">("view");
  const [ratingFilter, setRatingFilter] = React.useState<"all" | "4plus" | "3plus" | "2plus">("all");
  const [typeFilter, setTypeFilter] = React.useState<"all" | NoteFolderItemType>("all");

  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  // upload state
  const [uploadTitle, setUploadTitle] = React.useState("");
  const [uploadDesc, setUploadDesc] = React.useState("");
  const [uploadUrl, setUploadUrl] = React.useState("");
  const [uploadFile, setUploadFile] = React.useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = React.useState("");
  const [uploadType, setUploadType] = React.useState<NoteFolderItemType>("pdf");
  const [uploadVisibility, setUploadVisibility] = React.useState<NoteFolderVisibility>("public");
  const [uploadInvitedEmail, setUploadInvitedEmail] = React.useState("");
  const [uploadInvited, setUploadInvited] = React.useState<string[]>([]);
  const [uploaderEmail, setUploaderEmail] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setMode("view");
    setHoveredItemId(null);
    setSelectedItemId(null);
    setRatingFilter("all");
    setTypeFilter("all");
  }, [open]);

  const folderItems = items
    .filter((i) => i.folderId === folder.id)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const filteredItems = folderItems.filter((i) => {
    if (typeFilter !== "all" && i.type !== typeFilter) return false;

    const avg = calcAvgRating(comments.filter((c) => c.itemId === i.id));
    if (ratingFilter === "4plus") return avg >= 4;
    if (ratingFilter === "3plus") return avg >= 3;
    if (ratingFilter === "2plus") return avg >= 2;
    return true;
  });

  const selectedItem = selectedItemId ? folderItems.find((x) => x.id === selectedItemId) ?? null : null;
  const selectedItemComments = comments
    .filter((c) => c.folderId === folder.id)
    .filter((c) => (selectedItem ? c.itemId === selectedItem.id : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const avgForSelected = selectedItem
    ? calcAvgRating(selectedItemComments, selectedItem.id)
    : calcAvgRating(selectedItemComments);

  const addUploadInvite = () => {
    const e = uploadInvitedEmail.trim().toLowerCase();
    if (!e) return;
    if (!isCsunEmail(e)) return;
    if (uploadInvited.includes(e)) return;
    setUploadInvited((prev) => [...prev, e]);
    setUploadInvitedEmail("");
  };

  const inferTypeFromName = (name: string): NoteFolderItemType => {
    const n = name.toLowerCase();
    if (n.endsWith(".pdf")) return "pdf";
    if (n.match(/\.(doc|docx)$/)) return "doc";
    if (n.match(/\.(png|jpg|jpeg|webp|gif)$/)) return "image";
    if (n.match(/\.(mp4|mov|avi|mkv)$/)) return "video";
    if (n.match(/\.(zip|rar|7z)$/)) return "zip";
    return "link";
  };

  const handlePickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;

    setUploadFile(f);
    setUploadFileName(f.name);
    setUploadType(inferTypeFromName(f.name));
    setUploadUrl("");
  };

  const canUpload = React.useMemo(() => {
    if (!uploadTitle.trim()) return false;
    if (!uploaderEmail.trim() || !isCsunEmail(uploaderEmail)) return false;
    if (uploadType === "link") {
      if (!uploadUrl.trim()) return false;
    } else {
      if (!uploadFileName.trim() && !uploadUrl.trim()) return false;
    }
    if (uploadVisibility === "private" && uploadInvited.length === 0) return false;
    return true;
  }, [
    uploadTitle,
    uploaderEmail,
    uploadType,
    uploadUrl,
    uploadFileName,
    uploadVisibility,
    uploadInvited.length,
  ]);

  const submitUpload = () => {
    if (!canUpload) return;

    const generatedUrl = uploadUrl.trim() || (uploadFile ? URL.createObjectURL(uploadFile) : undefined);

    const item: NoteFolderItem = {
      id: makeId(),
      folderId: folder.id,
      title: uploadTitle.trim(),
      description: uploadDesc.trim() || undefined,
      uploadedBy: uploaderEmail.trim().toLowerCase().split("@")[0],
      uploadedByEmail: uploaderEmail.trim().toLowerCase(),
      uploadedAt: new Date().toISOString(),
      type: uploadType,
      url: generatedUrl,
      fileName: uploadFileName || undefined,
      visibility: uploadVisibility,
    };

    onUploadItem(item);

    setUploadTitle("");
    setUploadDesc("");
    setUploadUrl("");
    setUploadFile(null);
    setUploadFileName("");
    setUploadType("pdf");
    setUploadVisibility("public");
    setUploadInvitedEmail("");
    setUploadInvited([]);
    setUploaderEmail("");

    setMode("view");
  };

  const isPrivateFolder = folder.visibility === "private";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 4, overflow: "hidden" } }}
      TransitionProps={{ timeout: 220 }}
    >
      <Box sx={{ bgcolor: "#A80532", px: 3, py: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.1rem" }}>
                {folder.topic}
              </Typography>
              <Chip
                size="small"
                icon={isPrivateFolder ? <LockRoundedIcon sx={{ fontSize: 14 }} /> : <PublicRoundedIcon sx={{ fontSize: 14 }} />}
                label={isPrivateFolder ? "Private" : "Public"}
                sx={{
                  height: 20,
                  fontSize: "0.66rem",
                  fontWeight: 900,
                  bgcolor: "rgba(255,255,255,0.20)",
                  color: "#fff",
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />
            </Stack>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", mt: 0.35 }}>
              {folder.subject}
              {folder.courseNumber ? ` ${folder.courseNumber}` : ""} · {folderItems.length} item
              {folderItems.length === 1 ? "" : "s"}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mr: 0.5 }}>
              <Button
                variant={mode === "upload" ? "contained" : "outlined"}
                onClick={() => setMode((m) => (m === "upload" ? "view" : "upload"))}
                startIcon={<CloudUploadIcon sx={{ fontSize: 16 }} />}
                sx={{
                  bgcolor: mode === "upload" ? "#fff" : "transparent",
                  color: mode === "upload" ? "#A80532" : "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.40)",
                  fontWeight: 950,
                  borderRadius: 999,
                  px: 2.25,
                  "&:hover": {
                    bgcolor: mode === "upload" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.70)",
                  },
                }}
              >
                {mode === "upload" ? "View" : "Upload"}
              </Button>
            </Stack>

            <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.85)" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: fullScreen ? "1fr" : "1.6fr 1fr",
            minHeight: fullScreen ? "auto" : 560,
          }}
        >
          {/* Main column */}
          <Box sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.02)" }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                transformStyle: "preserve-3d",
                perspective: "1200px",
                height: fullScreen ? "auto" : 520,
                minHeight: 520,
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  transition: "transform 420ms cubic-bezier(0.2,0.9,0.2,1)",
                  transform: mode === "upload" ? "rotateY(-180deg)" : "rotateY(0deg)",
                  transformOrigin: "center",
                  transformStyle: "preserve-3d",
                  height: "100%",
                }}
              >
                {/* Front: View */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 4,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 4,
                      bgcolor: "#fff",
                      border: "1.5px solid rgba(0,0,0,0.07)",
                      position: "relative",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 54px 54px 0",
                        borderColor: "transparent rgba(168,5,50,0.10) transparent transparent",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 36px 36px 0",
                        borderColor: "transparent rgba(255,255,255,0.9) transparent transparent",
                      }}
                    />

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.2}
                      alignItems={{ sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Typography sx={{ fontWeight: 950, fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>
                        Files in this folder
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>Type</Typography>
                        <FormControl size="small">
                          <Select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            sx={{
                              minWidth: 120,
                              borderRadius: 2,
                              bgcolor: "rgba(0,0,0,0.03)",
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.18)" },
                            }}
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="doc">Doc</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="image">Image</MenuItem>
                            <MenuItem value="zip">ZIP</MenuItem>
                            <MenuItem value="link">Link</MenuItem>
                          </Select>
                        </FormControl>

                        <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>Rating filter</Typography>
                        <FormControl size="small">
                          <Select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value as any)}
                            sx={{
                              minWidth: 140,
                              borderRadius: 2,
                              bgcolor: "rgba(0,0,0,0.03)",
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.18)" },
                            }}
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="4plus">4+</MenuItem>
                            <MenuItem value="3plus">3+</MenuItem>
                            <MenuItem value="2plus">2+</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.6 }} />

                    <Stack spacing={1.15} sx={{ overflow: "auto", pr: 0.5 }}>
                      {filteredItems.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 950, color: "rgba(0,0,0,0.55)" }}>No files match your filters</Typography>
                          <Typography sx={{ fontSize: "0.84rem", color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
                            Try switching filters to All, or upload a new file.
                          </Typography>
                        </Box>
                      ) : (
                        filteredItems.map((it) => {
                          const avg = calcAvgRating(comments.filter((c) => c.itemId === it.id));
                          const meta = TYPE_META[it.type];
                          return (
                            <Tooltip
                              key={it.id}
                              title={it.description ? it.description : ""}
                              arrow
                              placement="top"
                              disableHoverListener={!it.description}
                            >
                              <Paper
                                elevation={0}
                                onMouseEnter={() => setHoveredItemId(it.id)}
                                onMouseLeave={() => setHoveredItemId((prev) => (prev === it.id ? null : prev))}
                                onClick={() => setSelectedItemId(it.id)}
                                sx={{
                                  borderRadius: 3,
                                  p: 1.5,
                                  bgcolor: hoveredItemId === it.id ? "rgba(168,5,50,0.035)" : "rgba(0,0,0,0.015)",
                                  border:
                                    hoveredItemId === it.id
                                      ? "1px solid rgba(168,5,50,0.20)"
                                      : "1px solid rgba(0,0,0,0.06)",
                                  cursor: "pointer",
                                  transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s, background-color 0.18s",
                                  "&:hover": { transform: "translateY(-1px)", boxShadow: "0 10px 26px rgba(0,0,0,0.06)" },
                                }}
                              >
                                <Stack direction="row" spacing={1.2} alignItems="flex-start">
                                  <Box sx={{ mt: 0.2, color: "rgba(0,0,0,0.55)" }}>{meta.icon}</Box>
                                  <Stack spacing={0.45} flex={1}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                      <Typography sx={{ fontWeight: 950, fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>
                                        {it.title}
                                      </Typography>
                                      <Chip
                                        size="small"
                                        label={meta.label}
                                        sx={{
                                          height: 18,
                                          fontSize: "0.62rem",
                                          fontWeight: 900,
                                          bgcolor: "rgba(0,0,0,0.06)",
                                          color: "rgba(0,0,0,0.7)",
                                        }}
                                      />
                                    </Stack>

                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      alignItems="center"
                                      spacing={1}
                                      sx={{ flexWrap: "wrap" }}
                                    >
                                      <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.52)" }}>
                                        {it.uploadedBy} · {formatRelative(it.uploadedAt)}
                                      </Typography>

                                      <Stack direction="row" spacing={0.6} alignItems="center">
                                        <Chip
                                          size="small"
                                          icon={
                                            it.visibility === "private" ? (
                                              <LockRoundedIcon sx={{ fontSize: 14 }} />
                                            ) : (
                                              <PublicRoundedIcon sx={{ fontSize: 14 }} />
                                            )
                                          }
                                          label={it.visibility === "private" ? "Private" : "Public"}
                                          sx={{
                                            height: 18,
                                            fontSize: "0.62rem",
                                            fontWeight: 900,
                                            bgcolor: it.visibility === "private" ? "rgba(124,58,237,0.10)" : "rgba(22,163,74,0.10)",
                                            color: it.visibility === "private" ? "#7c3aed" : "#16a34a",
                                            "& .MuiChip-icon": { color: "inherit" },
                                          }}
                                        />
                                        <Box sx={{ minWidth: 74, display: "flex", justifyContent: "flex-end" }}>
                                          {avg > 0 ? (
                                            <Stars value={avg} size={14} />
                                          ) : (
                                            <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.35)", fontWeight: 800 }}>
                                              No ratings
                                            </Typography>
                                          )}
                                        </Box>
                                      </Stack>
                                    </Stack>

                                    {hoveredItemId === it.id && it.description && (
                                      <Box sx={{ mt: 0.9, pt: 0.9, borderTop: "1px dashed rgba(0,0,0,0.14)" }}>
                                        <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)" }}>{it.description}</Typography>
                                      </Box>
                                    )}

                                    <Stack direction="row" spacing={0.6} justifyContent="flex-end" sx={{ mt: 1.0 }}>
                                      {it.url && (
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(it.url, "_blank", "noopener,noreferrer");
                                          }}
                                          sx={{
                                            borderRadius: 999,
                                            fontWeight: 950,
                                            fontSize: "0.72rem",
                                            borderColor: "rgba(0,0,0,0.18)",
                                            color: "rgba(0,0,0,0.72)",
                                            "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
                                          }}
                                        >
                                          Open
                                        </Button>
                                      )}
                                      <Button
                                        size="small"
                                        variant="contained"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedItemId(it.id);
                                        }}
                                        sx={{
                                          bgcolor: "#A80532",
                                          "&:hover": { bgcolor: "#810326" },
                                          borderRadius: 999,
                                          fontWeight: 950,
                                          fontSize: "0.72rem",
                                        }}
                                      >
                                        Details
                                      </Button>
                                    </Stack>
                                  </Stack>
                                </Stack>
                              </Paper>
                            </Tooltip>
                          );
                        })
                      )}
                    </Stack>
                  </Paper>
                </Box>

                {/* Back: Upload */}
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    borderRadius: 4,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.25,
                      borderRadius: 4,
                      bgcolor: "#fff",
                      border: "1.5px solid rgba(0,0,0,0.07)",
                      position: "relative",
                      overflow: "hidden",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 54px 54px 0",
                        borderColor: "transparent rgba(168,5,50,0.10) transparent transparent",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: "0 36px 36px 0",
                        borderColor: "transparent rgba(255,255,255,0.9) transparent transparent",
                      }}
                    />

                    <Typography sx={{ fontWeight: 950, fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>Upload a file</Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.50)", mt: 0.4 }}>
                      Add notes, visuals, links, or resources for this folder.
                    </Typography>

                    <Divider sx={{ my: 1.6 }} />

                    <Stack spacing={1.2} sx={{ overflow: "auto", pr: 0.5 }}>
                      <TextField label="Title" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} fullWidth size="small" />
                      <TextField
                        label="Description (optional)"
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        fullWidth
                        size="small"
                      />

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                        <FormControl fullWidth size="small">
                          <Select value={uploadType} onChange={(e) => setUploadType(e.target.value as any)}>
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="doc">Doc</MenuItem>
                            <MenuItem value="video">Video</MenuItem>
                            <MenuItem value="image">Image</MenuItem>
                            <MenuItem value="zip">ZIP</MenuItem>
                            <MenuItem value="link">Link</MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl fullWidth size="small">
                          <Select value={uploadVisibility} onChange={(e) => setUploadVisibility(e.target.value as any)}>
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      <TextField
                        label="Your CSUN Email"
                        value={uploaderEmail}
                        onChange={(e) => setUploaderEmail(e.target.value)}
                        fullWidth
                        size="small"
                      />

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ sm: "center" }}>
                        <Button
                          variant="outlined"
                          onClick={() => fileRef.current?.click()}
                          startIcon={<CloudUploadIcon />}
                          sx={{ borderRadius: 999, fontWeight: 950 }}
                        >
                          Choose file
                        </Button>
                        <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.6)", fontWeight: 800 }}>
                          {uploadFileName ? uploadFileName : "No file selected"}
                        </Typography>
                        <input ref={fileRef} type="file" hidden onChange={handlePickFile} />
                      </Stack>

                      <TextField
                        label="Or paste a URL (optional)"
                        value={uploadUrl}
                        onChange={(e) => setUploadUrl(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LinkIcon sx={{ fontSize: 18 }} />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {uploadVisibility === "private" && (
                        <Box>
                          <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.6)", fontWeight: 900, mb: 0.7 }}>
                            Invite CSUN Emails
                          </Typography>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <TextField
                              value={uploadInvitedEmail}
                              onChange={(e) => setUploadInvitedEmail(e.target.value)}
                              fullWidth
                              size="small"
                              placeholder="someone@my.csun.edu"
                            />
                            <Button
                              variant="contained"
                              onClick={addUploadInvite}
                              sx={{ borderRadius: 999, fontWeight: 950, bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" } }}
                            >
                              Add
                            </Button>
                          </Stack>

                          <Stack direction="row" spacing={0.7} sx={{ mt: 1.0, flexWrap: "wrap" }}>
                            {uploadInvited.map((e) => (
                              <Chip
                                key={e}
                                label={e}
                                onDelete={() => setUploadInvited((prev) => prev.filter((x) => x !== e))}
                                sx={{ bgcolor: "rgba(168,5,50,0.08)", color: "#A80532", fontWeight: 900 }}
                              />
                            ))}
                          </Stack>
                        </Box>
                      )}

                      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
                        <Button
                          variant="contained"
                          disabled={!canUpload}
                          onClick={submitUpload}
                          sx={{
                            borderRadius: 999,
                            fontWeight: 950,
                            bgcolor: "#A80532",
                            "&:hover": { bgcolor: "#810326" },
                            px: 2.4,
                          }}
                        >
                          Upload
                        </Button>
                      </Box>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Comments column */}
          <Box sx={{ p: 2.5, borderLeft: fullScreen ? "none" : "1px solid rgba(0,0,0,0.06)" }}>
            <NoteViewCommentsPanel
              folder={folder}
              selectedItem={selectedItem}
              selectedItemComments={selectedItemComments}
              avgForSelected={avgForSelected}
              formatRelative={formatRelative}
              onAddComment={onAddComment}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
