"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from "@mui/icons-material/StickyNote2";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import LinkIcon from "@mui/icons-material/Link";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import {
  btnOutlineGray,
  btnPrimary,
  btnOutlineRed,
  fieldSxLight,
} from "./AcademicsStates";
import { formatDate, formatDateOnly, formatTimeOnly, rmpSearchUrl, daysUntil, isPast } from "./utils";
import type { CourseItem, LectureNote, Assignment, ExamItem } from "./constants";

// Icon helpers for file types
function FileTypeIcon({ type }: { type?: string }) {
  if (type === "pdf") return <PictureAsPdfIcon sx={{ color: "#dc2626", fontSize: 18 }} />;
  if (type === "png" || type === "jpg" || type === "jpeg") return <ImageIcon sx={{ color: "#7c3aed", fontSize: 18 }} />;
  return <DescriptionIcon sx={{ color: "#2563eb", fontSize: 18 }} />;
}

// Priority badge color
function priorityColor(p: string) {
  if (p === "high") return "#dc2626";
  if (p === "medium") return "#d97706";
  return "#6b7280";
}

export default function CourseModal({
  open,
  onClose,
  tab,
  setTab,
  semesterLabel,
  course,
  noteAuthor, noteTopic, noteBody, noteIsPublic,
  setNoteAuthor, setNoteTopic, setNoteBody, setNoteIsPublic,
  onPostNote,
  searchQuery, setSearchQuery, searchedNotes,
  resourceLabel, resourceUrl, resourceIsPublic,
  setResourceLabel, setResourceUrl, setResourceIsPublic,
  onAddResourceLink,
  onPickFile,
  onFilePicked,
  onToggleAssignment,
}: {
  open: boolean;
  onClose: () => void;
  tab: 0 | 1 | 2 | 3;
  setTab: (v: 0 | 1 | 2 | 3) => void;
  semesterLabel: string;
  course: CourseItem | null;
  noteAuthor: string; noteTopic: string; noteBody: string; noteIsPublic: boolean;
  setNoteAuthor: (v: string) => void;
  setNoteTopic: (v: string) => void;
  setNoteBody: (v: string) => void;
  setNoteIsPublic: (v: boolean) => void;
  onPostNote: () => void;
  searchQuery: string; setSearchQuery: (v: string) => void; searchedNotes: LectureNote[];
  resourceLabel: string; resourceUrl: string; resourceIsPublic: boolean;
  setResourceLabel: (v: string) => void;
  setResourceUrl: (v: string) => void;
  setResourceIsPublic: (v: boolean) => void;
  onAddResourceLink: () => void;
  onPickFile: () => void;
  onFilePicked: (file: File) => void;
  onToggleAssignment: (courseId: string, assignmentId: string) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const code = course ? `${course.subject.toUpperCase()} ${course.number}` : "Course";
  const title = course?.title ?? "";
  const professor = course?.professor ?? "";
  const prereq = course?.prerequisitesText;

  const examsAndAssignments = React.useMemo(() => {
    if (!course) return { upcoming: [], past: [] };
    const items: Array<{ type: "assignment" | "exam"; data: Assignment | ExamItem; date: string }> = [];
    for (const a of course.assignments ?? []) items.push({ type: "assignment", data: a, date: a.dueDate });
    for (const e of course.exams ?? []) items.push({ type: "exam", data: e, date: e.date });
    items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return {
      upcoming: items.filter((i) => !isPast(i.date)),
      past: items.filter((i) => isPast(i.date)),
    };
  }, [course]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#A80532",
          px: 3,
          pt: 2.5,
          pb: 0,
          color: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography fontWeight={950} sx={{ fontSize: "1.2rem" }}>
              {course ? `${code} Hub` : "Course Hub"}
            </Typography>
            <Typography sx={{ opacity: 0.85, fontSize: "0.9rem" }}>
              {course ? `${title || code} — ${semesterLabel}` : "Pick a course"}
            </Typography>
            {!!professor && (
              <Typography sx={{ opacity: 0.85, fontSize: "0.88rem", mt: 0.25 }}>
                Prof: <strong>{professor}</strong>{" "}
                <a
                  href={rmpSearchUrl(professor)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#93c5fd", fontWeight: 900, textDecoration: "none", marginLeft: 6 }}
                >
                  RMP ↗
                </a>
              </Typography>
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.85)", mt: -0.5 }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="inherit"
          TabIndicatorProps={{ style: { background: "#fff", height: 3, borderRadius: 2 } }}
          sx={{
            mt: 1.5,
            "& .MuiTab-root": { color: "rgba(255,255,255,0.70)", fontWeight: 900, textTransform: "none", fontSize: "0.92rem", minWidth: 80 },
            "& .Mui-selected": { color: "#fff" },
          }}
        >
          <Tab label="Notes" />
          <Tab label="Search" />
          <Tab label="Uploads" />
          <Tab label="Prereqs / Info" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* ── Tab 0: Notes ── */}
          {tab === 0 && (
            <>
              {/* Upcoming assignments/exams widget */}
              {(examsAndAssignments.upcoming.length > 0) && (
                <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, bgcolor: "rgba(168,5,50,0.04)", border: "1px solid rgba(168,5,50,0.14)", mb: 2.5 }}>
                  <Typography fontWeight={950} sx={{ fontSize: "0.88rem", color: "#A80532", mb: 1 }}>
                    Upcoming for {code}
                  </Typography>
                  <Stack spacing={0.75}>
                    {examsAndAssignments.upcoming.slice(0, 4).map((item) => {
                      const d = daysUntil(item.date);
                      if (item.type === "assignment") {
                        const a = item.data as Assignment;
                        return (
                          <Stack key={a.id} direction="row" spacing={1} alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => course && onToggleAssignment(course.id, a.id)}
                              sx={{ p: 0.25 }}
                            >
                              {a.completed
                                ? <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                                : <RadioButtonUncheckedIcon sx={{ color: "rgba(0,0,0,0.35)", fontSize: 18 }} />}
                            </IconButton>
                            <Typography
                              sx={{
                                fontSize: "0.88rem",
                                textDecoration: a.completed ? "line-through" : "none",
                                color: a.completed ? "rgba(0,0,0,0.40)" : "rgba(0,0,0,0.82)",
                                flex: 1,
                              }}
                            >
                              {a.title}
                            </Typography>
                            <Chip
                              label={`${d <= 0 ? "Due today!" : `${d}d`}`}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: "0.7rem",
                                bgcolor: d <= 1 ? "#fef2f2" : "rgba(0,0,0,0.06)",
                                color: d <= 1 ? "#dc2626" : "rgba(0,0,0,0.60)",
                                fontWeight: 900,
                              }}
                            />
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: priorityColor(a.priority) }} />
                          </Stack>
                        );
                      } else {
                        const e = item.data as ExamItem;
                        return (
                          <Stack key={e.id} direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon sx={{ fontSize: 18, color: "#d97706" }} />
                            <Typography sx={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.82)", flex: 1 }}>
                              {e.title}
                              {e.location ? ` — ${e.location}` : ""}
                            </Typography>
                            <Chip
                              label={`${d <= 0 ? "Today!" : `${d}d`}`}
                              size="small"
                              sx={{ height: 18, fontSize: "0.7rem", bgcolor: d <= 3 ? "#fffbeb" : "rgba(0,0,0,0.06)", color: d <= 3 ? "#d97706" : "rgba(0,0,0,0.60)", fontWeight: 900 }}
                            />
                          </Stack>
                        );
                      }
                    })}
                  </Stack>
                </Paper>
              )}

              <Typography fontWeight={950} sx={{ mb: 1.25 }}>Add a topic note</Typography>
              <Stack spacing={1.25} sx={{ mb: 2.5 }}>
                <TextField
                  size="small"
                  label="Your name (optional)"
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  disabled={!course}
                  sx={fieldSxLight}
                />
                <TextField
                  size="small"
                  label="Topic Title *"
                  value={noteTopic}
                  onChange={(e) => setNoteTopic(e.target.value)}
                  placeholder='E.g. "Time Complexity", "Deadlocks", "Bayes Theorem"'
                  disabled={!course}
                  sx={fieldSxLight}
                />
                <TextField
                  size="small"
                  label="Topic Notes *"
                  value={noteBody}
                  onChange={(e) => setNoteBody(e.target.value)}
                  multiline
                  minRows={3}
                  placeholder="Write definitions, steps, examples, or what the professor emphasized…"
                  disabled={!course}
                  sx={fieldSxLight}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={noteIsPublic}
                        onChange={(e) => setNoteIsPublic(e.target.checked)}
                        size="small"
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#A80532" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#A80532" } }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {noteIsPublic
                          ? <><PublicIcon sx={{ fontSize: 15, color: "#A80532" }} /><Typography sx={{ fontSize: "0.85rem", color: "#A80532", fontWeight: 900 }}>Public</Typography></>
                          : <><LockIcon sx={{ fontSize: 15, color: "rgba(0,0,0,0.55)" }} /><Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.60)" }}>Private</Typography></>
                        }
                      </Stack>
                    }
                  />
                  <Button onClick={onPostNote} variant="contained" startIcon={<NotesIcon />} sx={btnPrimary} disabled={!course}>
                    Post Note
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={950} sx={{ mb: 1.25 }}>Recent notes ({course?.notes.length ?? 0})</Typography>
              <Stack spacing={1.25}>
                {course?.notes.length ? (
                  course.notes.map((n) => (
                    <Paper key={n.id} elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <Stack direction="row" spacing={1.25} alignItems="flex-start">
                        <Avatar sx={{ width: 30, height: 30, bgcolor: "#A80532", fontWeight: 950, fontSize: "0.85rem" }}>
                          {(n.author?.trim()?.[0] ?? "A").toUpperCase()}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                            <Typography fontWeight={950} sx={{ fontSize: "0.92rem" }}>{n.author || "Anonymous"}</Typography>
                            <Typography sx={{ fontSize: "0.76rem", color: "rgba(0,0,0,0.55)" }}>{formatDate(n.createdAt)}</Typography>
                            <Chip
                              icon={n.isPublic ? <PublicIcon sx={{ fontSize: 11 }} /> : <LockIcon sx={{ fontSize: 11 }} />}
                              label={n.isPublic ? "Public" : "Private"}
                              size="small"
                              sx={{ height: 16, fontSize: "0.68rem", bgcolor: n.isPublic ? "rgba(22,163,74,0.10)" : "rgba(0,0,0,0.06)", color: n.isPublic ? "#16a34a" : "rgba(0,0,0,0.55)", fontWeight: 900, "& .MuiChip-icon": { color: "inherit" } }}
                            />
                          </Stack>
                          <Typography fontWeight={950} sx={{ mt: 0.3, fontSize: "0.95rem" }}>{n.topicTitle}</Typography>
                          <Typography sx={{ fontSize: "0.92rem", color: "rgba(0,0,0,0.72)", mt: 0.2 }}>{n.body}</Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  ))
                ) : (
                  <Typography sx={{ color: "rgba(0,0,0,0.60)", fontStyle: "italic" }}>
                    No notes yet. Be the first to add a useful note for this class.
                  </Typography>
                )}
              </Stack>
            </>
          )}

          {/* ── Tab 1: Search ── */}
          {tab === 1 && (
            <>
              <Typography fontWeight={950} sx={{ mb: 0.5 }}>Search notes</Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.60)", mb: 1.5 }}>
                All words must appear somewhere in the note.
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try: "time complexity", "DFA", "Bayes theorem"'
                sx={{ ...fieldSxLight, mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ color: "rgba(0,0,0,0.45)" }} />
                    </InputAdornment>
                  ),
                }}
                disabled={!course}
              />
              <Typography fontWeight={950} sx={{ mb: 1 }}>Results ({searchedNotes.length})</Typography>
              <Stack spacing={1.25}>
                {course && searchedNotes.length ? (
                  searchedNotes.map((n) => (
                    <Paper key={n.id} elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)" }}>
                      <Typography fontWeight={950}>{n.topicTitle}</Typography>
                      <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.60)" }}>
                        by <strong>{n.author || "Anonymous"}</strong> · {formatDate(n.createdAt)}
                      </Typography>
                      <Typography sx={{ mt: 0.5, color: "rgba(0,0,0,0.75)", fontSize: "0.92rem" }}>{n.body}</Typography>
                    </Paper>
                  ))
                ) : (
                  <Typography sx={{ color: "rgba(0,0,0,0.55)", fontStyle: "italic" }}>
                    {course ? "No matching notes. Try different keywords." : "Pick a course first."}
                  </Typography>
                )}
              </Stack>
            </>
          )}

          {/* ── Tab 2: Uploads ── */}
          {tab === 2 && (
            <>
              <Typography fontWeight={950} sx={{ mb: 0.5 }}>Uploads & Resources</Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.60)", mb: 2 }}>
                Attach files (PDF, Word, PNG, JPEG) or add URL links. Toggle public to share with classmates.
              </Typography>

              {/* File upload drop area */}
              <Paper
                elevation={0}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: "2px dashed rgba(168,5,50,0.30)",
                  borderRadius: 3,
                  p: 2.5,
                  textAlign: "center",
                  cursor: "pointer",
                  mb: 2,
                  bgcolor: "rgba(168,5,50,0.02)",
                  transition: "all 0.15s",
                  "&:hover": { bgcolor: "rgba(168,5,50,0.05)", borderColor: "rgba(168,5,50,0.55)" },
                }}
              >
                <UploadFileIcon sx={{ fontSize: 32, color: "rgba(168,5,50,0.55)", mb: 0.5 }} />
                <Typography fontWeight={900} sx={{ color: "#A80532", fontSize: "0.9rem" }}>
                  Click to attach a file
                </Typography>
                <Typography sx={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.50)" }}>
                  PDF, DOC, DOCX, PNG, JPEG supported
                </Typography>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onFilePicked(f);
                    e.currentTarget.value = "";
                  }}
                />
              </Paper>

              <Typography fontWeight={950} sx={{ mb: 1.25, fontSize: "0.9rem" }}>Or add a URL link</Typography>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <TextField size="small" label="Label (optional)" value={resourceLabel} onChange={(e) => setResourceLabel(e.target.value)} disabled={!course} sx={fieldSxLight} />
                <TextField
                  size="small"
                  label="URL"
                  placeholder="https://…"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  disabled={!course}
                  sx={fieldSxLight}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LinkIcon sx={{ color: "rgba(0,0,0,0.40)", fontSize: 18 }} /></InputAdornment> }}
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={resourceIsPublic}
                        onChange={(e) => setResourceIsPublic(e.target.checked)}
                        size="small"
                        sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#A80532" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#A80532" } }}
                      />
                    }
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        {resourceIsPublic
                          ? <><PublicIcon sx={{ fontSize: 14, color: "#A80532" }} /><Typography sx={{ fontSize: "0.82rem", color: "#A80532", fontWeight: 900 }}>Public</Typography></>
                          : <><LockIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.50)" }} /><Typography sx={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.55)" }}>Private</Typography></>
                        }
                      </Stack>
                    }
                  />
                  <Button variant="outlined" onClick={onAddResourceLink} sx={btnOutlineRed} disabled={!course} size="small">
                    Add Link
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />
              <Typography fontWeight={950} sx={{ mb: 1.25 }}>Saved uploads ({course?.resources.length ?? 0})</Typography>
              <Stack spacing={1}>
                {course?.resources.length ? (
                  course.resources.map((r) => (
                    <Paper key={r.id} elevation={0} sx={{ p: 1.25, borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <FileTypeIcon type={r.fileType} />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography fontWeight={950} sx={{ fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</Typography>
                            <Chip
                              icon={r.isPublic ? <PublicIcon sx={{ fontSize: 10 }} /> : <LockIcon sx={{ fontSize: 10 }} />}
                              label={r.isPublic ? "Public" : "Private"}
                              size="small"
                              sx={{ height: 16, fontSize: "0.66rem", bgcolor: r.isPublic ? "rgba(22,163,74,0.10)" : "rgba(0,0,0,0.05)", color: r.isPublic ? "#16a34a" : "rgba(0,0,0,0.50)", fontWeight: 900, "& .MuiChip-icon": { color: "inherit" } }}
                            />
                          </Stack>
                          <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.50)" }}>
                            {formatDate(r.createdAt)}{r.fileName ? ` · ${r.fileName}` : ""}
                          </Typography>
                        </Box>
                        {r.url && (
                          <IconButton size="small" onClick={() => window.open(r.url!, "_blank", "noopener,noreferrer")} sx={{ color: "#2563eb" }}>
                            <OpenInNewRoundedIcon sx={{ fontSize: 17 }} />
                          </IconButton>
                        )}
                      </Stack>
                    </Paper>
                  ))
                ) : (
                  <Typography sx={{ color: "rgba(0,0,0,0.55)", fontStyle: "italic" }}>No uploads yet.</Typography>
                )}
              </Stack>
            </>
          )}

          {/* ── Tab 3: Prereqs / Info ── */}
          {tab === 3 && (
            <>
              <Typography fontWeight={950} sx={{ mb: 0.5 }}>Description & Prerequisites</Typography>
              <Typography sx={{ fontSize: "0.88rem", color: "rgba(0,0,0,0.60)", mb: 2 }}>
                Catalog data is loaded from the CSUN API when available.
                {/* TODO (backend): Connect to https://catalog.csun.edu or CSUN curriculum API for course description */}
              </Typography>

              {course?.description ? (
                <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, bgcolor: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", mb: 1.75 }}>
                  <Typography fontWeight={950} sx={{ mb: 0.5 }}>Description</Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.75)", whiteSpace: "pre-wrap", fontSize: "0.92rem" }}>
                    {course.description}
                  </Typography>
                </Paper>
              ) : (
                <Alert severity="info" sx={{ mb: 1.75, borderRadius: 3 }}>
                  No catalog description loaded yet.{" "}
                  {/* TODO (backend): Fetch from GET /web-dev/api/catalog/course?subject=COMP&number=333 */}
                  Backend endpoint needs to be wired to return course description.
                </Alert>
              )}

              <Paper elevation={0} sx={{ p: 1.75, borderRadius: 3, bgcolor: "rgba(168,5,50,0.05)", border: "1px solid rgba(168,5,50,0.14)" }}>
                <Typography fontWeight={950} sx={{ color: "#A80532", mb: 0.5 }}>Prerequisites</Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.75)", fontSize: "0.92rem" }}>
                  {prereq
                    ? prereq
                    : "No prerequisite text found. Backend endpoint not yet wired."}
                  {/* TODO (backend): Fetch prereq text from CSUN course catalog API */}
                </Typography>
              </Paper>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
