"use client";

import * as React from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogContent, Divider, FormControl, IconButton, InputAdornment, MenuItem,
  Paper, Select, Stack, TextField, Tooltip, Typography, useMediaQuery, useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ImageIcon from "@mui/icons-material/Image";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import LinkIcon from "@mui/icons-material/Link";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

import type { NoteComment, NoteFolder, NoteFolderItem, NoteFolderItemType, NoteFolderVisibility } from "../shared/constants";

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

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <Stack direction="row" spacing={0.15} alignItems="center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return filled ? (
          <StarRoundedIcon key={i} sx={{ fontSize: size, color: "#A80532" }} />
        ) : (
          <StarBorderRoundedIcon key={i} sx={{ fontSize: size, color: "rgba(0,0,0,0.22)" }} />
        );
      })}
    </Stack>
  );
}

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
  const [uploadFileName, setUploadFileName] = React.useState("");
  const [uploadType, setUploadType] = React.useState<NoteFolderItemType>("pdf");
  const [uploadVisibility, setUploadVisibility] = React.useState<NoteFolderVisibility>("public");
  const [uploadInvitedEmail, setUploadInvitedEmail] = React.useState("");
  const [uploadInvited, setUploadInvited] = React.useState<string[]>([]);
  const [uploaderEmail, setUploaderEmail] = React.useState("");
  const fileRef = React.useRef<HTMLInputElement>(null);

  // comment state
  const [commentBody, setCommentBody] = React.useState("");
  const [commentRating, setCommentRating] = React.useState<1 | 2 | 3 | 4 | 5>(5);
  const [commentEmail, setCommentEmail] = React.useState("");

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

  const avgForSelected = selectedItem ? calcAvgRating(selectedItemComments, selectedItem.id) : calcAvgRating(selectedItemComments);

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
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadFileName(f.name);
    setUploadType(inferTypeFromName(f.name));
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
  }, [uploadTitle, uploaderEmail, uploadType, uploadUrl, uploadFileName, uploadVisibility, uploadInvited.length]);

  const submitUpload = () => {
    if (!canUpload) return;

    const item: NoteFolderItem = {
      id: makeId(),
      folderId: folder.id,
      title: uploadTitle.trim(),
      description: uploadDesc.trim() || undefined,
      uploadedBy: uploaderEmail.trim().toLowerCase().split("@")[0],
      uploadedByEmail: uploaderEmail.trim().toLowerCase(),
      uploadedAt: new Date().toISOString(),
      type: uploadType,
      url: uploadUrl.trim() || undefined,
      fileName: uploadFileName || undefined,
      visibility: uploadVisibility,
    };

    onUploadItem(item);

    setUploadTitle("");
    setUploadDesc("");
    setUploadUrl("");
    setUploadFileName("");
    setUploadType("pdf");
    setUploadVisibility("public");
    setUploadInvitedEmail("");
    setUploadInvited([]);
    setUploaderEmail("");

    setMode("view");
  };

  const canComment = React.useMemo(() => {
    if (!commentBody.trim()) return false;
    if (!commentEmail.trim() || !isCsunEmail(commentEmail)) return false;
    return true;
  }, [commentBody, commentEmail]);

  const submitComment = () => {
    if (!canComment) return;
    const c: NoteComment = {
      id: makeId(),
      folderId: folder.id,
      itemId: selectedItem ? selectedItem.id : undefined,
      author: commentEmail.trim().toLowerCase().split("@")[0],
      authorEmail: commentEmail.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
      rating: commentRating,
      body: commentBody.trim(),
    };
    onAddComment(c);
    setCommentBody("");
    setCommentRating(5);
    setCommentEmail("");
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
                  bgcolor: isPrivateFolder ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.20)",
                  color: "#fff",
                  "& .MuiChip-icon": { color: "#fff" },
                }}
              />
            </Stack>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", mt: 0.35 }}>
              {folder.subject}{folder.courseNumber ? ` ${folder.courseNumber}` : ""} · {folderItems.length} item{folderItems.length === 1 ? "" : "s"}
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
        <Box sx={{ display: "grid", gridTemplateColumns: fullScreen ? "1fr" : "1.6fr 1fr", minHeight: fullScreen ? "auto" : 560 }}>
          {/* Main paper */}
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
              {/* page flip container */}
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
                    {/* crimped edge */}
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

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems={{ sm: "center" }} justifyContent="space-between">
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
                              minWidth: 120,
                              borderRadius: 2,
                              bgcolor: "rgba(0,0,0,0.03)",
                              "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.18)" },
                            }}
                          >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="4plus">4+ stars</MenuItem>
                            <MenuItem value="3plus">3+ stars</MenuItem>
                            <MenuItem value="2plus">2+ stars</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={0.8} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
                      {filteredItems.length === 0 ? (
                        <Box sx={{ py: 3, textAlign: "center" }}>
                          <Typography sx={{ fontWeight: 900, color: "rgba(0,0,0,0.55)" }}>No items match your filter.</Typography>
                          <Typography sx={{ color: "rgba(0,0,0,0.45)", fontSize: "0.85rem", mt: 0.5 }}>
                            Try changing the rating filter or upload something new.
                          </Typography>
                        </Box>
                      ) : (
                        filteredItems.map((it) => {
                          const meta = TYPE_META[it.type];
                          const avg = calcAvgRating(comments.filter((c) => c.itemId === it.id), it.id);
                          return (
                            <Tooltip
                              key={it.id}
                              placement="right"
                              title={
                                it.description ? (
                                  <Box sx={{ maxWidth: 260 }}>
                                    <Typography sx={{ fontWeight: 900, fontSize: "0.78rem" }}>{it.title}</Typography>
                                    <Typography sx={{ fontSize: "0.74rem", mt: 0.3 }}>{it.description}</Typography>
                                  </Box>
                                ) : (
                                  ""
                                )
                              }
                              disableHoverListener={!it.description}
                            >
                              <Paper
                                elevation={0}
                                onMouseEnter={() => setHoveredItemId(it.id)}
                                onMouseLeave={() => setHoveredItemId(null)}
                                onClick={() => setSelectedItemId(it.id)}
                                sx={{
                                  p: 1.25,
                                  borderRadius: 2.5,
                                  border: "1px solid rgba(0,0,0,0.08)",
                                  cursor: "pointer",
                                  transition: "all 0.18s",
                                  bgcolor: selectedItemId === it.id ? "rgba(168,5,50,0.05)" : "rgba(0,0,0,0.02)",
                                  "&:hover": { bgcolor: "rgba(168,5,50,0.06)", borderColor: "rgba(168,5,50,0.18)" },
                                }}
                              >
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                  <Stack direction="row" spacing={1} alignItems="flex-start">
                                    <Box sx={{ color: "rgba(0,0,0,0.55)", mt: 0.1 }}>{meta.icon}</Box>
                                    <Box>
                                      <Typography sx={{ fontWeight: 950, fontSize: "0.86rem", color: "rgba(0,0,0,0.82)", lineHeight: 1.2 }}>
                                        {it.title}
                                      </Typography>
                                      <Typography sx={{ fontSize: "0.72rem", color: "rgba(0,0,0,0.50)", mt: 0.2 }}>
                                        {it.uploadedBy} · {formatRelative(it.uploadedAt)}
                                      </Typography>
                                      {it.fileName && (
                                        <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.42)", mt: 0.15 }}>
                                          {it.fileName}{it.fileSize ? ` · ${it.fileSize}` : ""}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Stack>

                                  <Stack direction="row" spacing={0.8} alignItems="center">
                                    <Chip
                                      size="small"
                                      label={meta.label}
                                      sx={{ height: 18, fontSize: "0.62rem", fontWeight: 900, bgcolor: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.60)" }}
                                    />
                                    <Chip
                                      size="small"
                                      icon={it.visibility === "private" ? <LockRoundedIcon sx={{ fontSize: 14 }} /> : <PublicRoundedIcon sx={{ fontSize: 14 }} />}
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
                                      {avg > 0 ? <Stars value={avg} size={14} /> : <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.35)", fontWeight: 800 }}>No ratings</Typography>}
                                    </Box>
                                  </Stack>
                                </Stack>

                                {hoveredItemId === it.id && it.description && (
                                  <Box sx={{ mt: 0.9, pt: 0.9, borderTop: "1px dashed rgba(0,0,0,0.14)" }}>
                                    <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)" }}>{it.description}</Typography>
                                  </Box>
                                )}

                                <Stack direction="row" spacing={0.6} justifyContent="flex-end" sx={{ mt: 1.0 }}>
                                  {(it.url || it.fileName) && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (it.url) window.open(it.url, "_blank", "noopener,noreferrer");
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
                                    sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, borderRadius: 999, fontWeight: 950, fontSize: "0.72rem" }}
                                  >
                                    Details
                                  </Button>
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
                    {/* crimped edge */}
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

                    <Typography sx={{ fontWeight: 950, fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>
                      Upload an item
                    </Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.50)", fontSize: "0.80rem", mt: 0.25 }}>
                      Upload any file type (or add a link). Backend can handle storage later.
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack spacing={1.25} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
                      <TextField
                        size="small"
                        label="Title *"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />

                      <TextField
                        size="small"
                        label="Short description"
                        value={uploadDesc}
                        onChange={(e) => setUploadDesc(e.target.value)}
                        multiline
                        minRows={2}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                          <Select
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value as NoteFolderItemType)}
                            sx={{ borderRadius: 2, bgcolor: "rgba(0,0,0,0.03)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.18)" } }}
                          >
                            {Object.entries(TYPE_META).map(([k, v]) => (
                              <MenuItem key={k} value={k}>
                                {v.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 180 }}>
                          <Select
                            value={uploadVisibility}
                            onChange={(e) => setUploadVisibility(e.target.value as NoteFolderVisibility)}
                            sx={{ borderRadius: 2, bgcolor: "rgba(0,0,0,0.03)", "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(0,0,0,0.18)" } }}
                          >
                            <MenuItem value="public">Public</MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      {uploadType === "link" ? (
                        <TextField
                          size="small"
                          label="Link URL *"
                          value={uploadUrl}
                          onChange={(e) => setUploadUrl(e.target.value)}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.45)" }} />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                        />
                      ) : (
                        <Box>
                          <Button
                            variant="outlined"
                            onClick={() => fileRef.current?.click()}
                            sx={{
                              borderRadius: 999,
                              fontWeight: 950,
                              borderColor: "rgba(0,0,0,0.20)",
                              color: "rgba(0,0,0,0.80)",
                              "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
                            }}
                          >
                            Choose file
                          </Button>
                          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={handlePickFile} />
                          {uploadFileName && (
                            <Typography sx={{ mt: 0.6, fontSize: "0.75rem", color: "rgba(0,0,0,0.55)", fontWeight: 800 }}>
                              Selected: {uploadFileName}
                            </Typography>
                          )}

                          <TextField
                            size="small"
                            label="(Optional) Direct URL"
                            value={uploadUrl}
                            onChange={(e) => setUploadUrl(e.target.value)}
                            sx={{ mt: 1.1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                          />
                        </Box>
                      )}

                      {uploadVisibility === "private" && (
                        <Box>
                          <Typography sx={{ fontSize: "0.76rem", fontWeight: 900, color: "rgba(0,0,0,0.52)", textTransform: "uppercase", letterSpacing: 0.6, mb: 0.6 }}>
                            Invite CSUN emails
                          </Typography>
                          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                            <TextField
                              size="small"
                              fullWidth
                              value={uploadInvitedEmail}
                              onChange={(e) => setUploadInvitedEmail(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addUploadInvite();
                                }
                              }}
                              placeholder="example@my.csun.edu"
                              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                            />
                            <Button
                              onClick={addUploadInvite}
                              variant="outlined"
                              sx={{
                                borderRadius: 999,
                                fontWeight: 950,
                                borderColor: "rgba(0,0,0,0.20)",
                                color: "rgba(0,0,0,0.80)",
                                "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
                              }}
                            >
                              Add
                            </Button>
                          </Stack>
                          {uploadInvited.length > 0 && (
                            <Stack direction="row" flexWrap="wrap" gap={0.6} sx={{ mt: 1 }}>
                              {uploadInvited.map((e) => (
                                <Chip
                                  key={e}
                                  label={e}
                                  size="small"
                                  onDelete={() => setUploadInvited((prev) => prev.filter((x) => x !== e))}
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
                        value={uploaderEmail}
                        onChange={(e) => setUploaderEmail(e.target.value)}
                        placeholder="you@my.csun.edu"
                        error={!!uploaderEmail && !isCsunEmail(uploaderEmail)}
                        helperText={!!uploaderEmail && !isCsunEmail(uploaderEmail) ? "Must end with @my.csun.edu" : ""}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />

                      <Button
                        variant="contained"
                        onClick={submitUpload}
                        disabled={!canUpload}
                        startIcon={<CloudUploadIcon />}
                        sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.15 }}
                      >
                        Add to folder
                      </Button>
                    </Stack>
                  </Paper>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Comments sidebar */}
          <Box sx={{ p: 2.5, bgcolor: "rgba(0,0,0,0.02)", borderLeft: fullScreen ? "none" : "1px solid rgba(0,0,0,0.06)" }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 4, bgcolor: "#fff", border: "1.5px solid rgba(0,0,0,0.07)" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                <Box>
                  <Typography sx={{ fontWeight: 950, fontSize: "0.92rem", color: "rgba(0,0,0,0.78)" }}>
                    Comments
                  </Typography>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mt: 0.5 }}>
                    <Stars value={avgForSelected} size={15} />
                    <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.55)", fontWeight: 900 }}>
                      {avgForSelected ? avgForSelected.toFixed(1) : "No ratings"}
                    </Typography>
                  </Stack>
                  <Typography sx={{ fontSize: "0.74rem", color: "rgba(0,0,0,0.48)", mt: 0.45 }}>
                    {selectedItem ? `For: ${selectedItem.title}` : "Select an item to view item-specific comments"}
                  </Typography>
                </Box>
                {selectedItem && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedItemId(null)}
                    sx={{
                      borderRadius: 999,
                      fontWeight: 950,
                      fontSize: "0.72rem",
                      borderColor: "rgba(0,0,0,0.18)",
                      color: "rgba(0,0,0,0.72)",
                      "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
                    }}
                  >
                    Clear
                  </Button>
                )}
              </Stack>

              <Divider sx={{ my: 1.25 }} />

              <Stack spacing={1.1} sx={{ maxHeight: fullScreen ? "none" : 260, overflow: "auto", pr: 0.5 }}>
                {selectedItemComments.length === 0 ? (
                  <Typography sx={{ color: "rgba(0,0,0,0.48)", fontSize: "0.84rem" }}>No comments yet.</Typography>
                ) : (
                  selectedItemComments.map((c) => (
                    <Box key={c.id} sx={{ pb: 1.1, borderBottom: "1px dashed rgba(0,0,0,0.14)" }}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Avatar sx={{ width: 22, height: 22, fontSize: "0.60rem", bgcolor: "#A80532", fontWeight: 900 }}>{c.author[0]?.toUpperCase()}</Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ fontSize: "0.74rem", fontWeight: 900, color: "rgba(0,0,0,0.72)" }}>{c.authorEmail}</Typography>
                          <Typography sx={{ fontSize: "0.68rem", color: "rgba(0,0,0,0.40)" }}>{formatRelative(c.createdAt)}</Typography>
                        </Box>
                        <Stars value={c.rating} size={14} />
                      </Stack>
                      <Typography sx={{ mt: 0.6, fontSize: "0.78rem", color: "rgba(0,0,0,0.62)" }}>{c.body}</Typography>
                    </Box>
                  ))
                )}
              </Stack>

              <Divider sx={{ my: 1.25 }} />

              <Typography sx={{ fontWeight: 950, fontSize: "0.86rem", color: "rgba(0,0,0,0.72)", mb: 0.9 }}>
                Add a comment
              </Typography>

              <Stack spacing={1}>
                <TextField
                  size="small"
                  label="Your CSUN Email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="you@my.csun.edu"
                  error={!!commentEmail && !isCsunEmail(commentEmail)}
                  helperText={!!commentEmail && !isCsunEmail(commentEmail) ? "Must end with @my.csun.edu" : ""}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.55)", fontWeight: 900, minWidth: 74 }}>Rating</Typography>
                  <Stack direction="row" spacing={0.35} alignItems="center">
                    {([1, 2, 3, 4, 5] as const).map((v) => (
                      <IconButton key={v} size="small" onClick={() => setCommentRating(v)} sx={{ p: 0.25 }}>
                        {v <= commentRating ? (
                          <StarRoundedIcon sx={{ fontSize: 18, color: "#A80532" }} />
                        ) : (
                          <StarBorderRoundedIcon sx={{ fontSize: 18, color: "rgba(0,0,0,0.25)" }} />
                        )}
                      </IconButton>
                    ))}
                  </Stack>
                </Stack>

                <TextField
                  size="small"
                  label="Comment"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  multiline
                  minRows={3}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />

                <Button
                  variant="contained"
                  onClick={submitComment}
                  disabled={!canComment}
                  sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.05 }}
                >
                  Post comment
                </Button>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
