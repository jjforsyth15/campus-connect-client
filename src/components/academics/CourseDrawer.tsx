"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from "@mui/icons-material/StickyNote2";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { btnOutlineGray, btnPrimary, formatDate, rmpSearchUrl, type CourseItem, type LectureNote } from "./AcademicsStates";

export default function CourseDrawer({
  open,
  onClose,
  tab,
  setTab,
  semesterLabel,
  course,
  // notes
  noteAuthor,
  noteTopic,
  noteBody,
  setNoteAuthor,
  setNoteTopic,
  setNoteBody,
  onPostNote,
  // search
  searchQuery,
  setSearchQuery,
  searchedNotes,
  // resources
  resourceLabel,
  resourceUrl,
  setResourceLabel,
  setResourceUrl,
  onAddResourceLink,
  onPickFile,
  onFilePicked,
}: {
  open: boolean;
  onClose: () => void;
  tab: 0 | 1 | 2 | 3;
  setTab: (v: 0 | 1 | 2 | 3) => void;
  semesterLabel: string;
  course: CourseItem | null;

  noteAuthor: string;
  noteTopic: string;
  noteBody: string;
  setNoteAuthor: (v: string) => void;
  setNoteTopic: (v: string) => void;
  setNoteBody: (v: string) => void;
  onPostNote: () => void;

  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchedNotes: LectureNote[];

  resourceLabel: string;
  resourceUrl: string;
  setResourceLabel: (v: string) => void;
  setResourceUrl: (v: string) => void;
  onAddResourceLink: () => void;
  onPickFile: () => void;
  onFilePicked: (file: File) => void;
}) {
  const code = course ? `${course.subject.toUpperCase()} ${course.number}` : "Course";
  const title = course?.title ?? "";
  const professor = course?.professor ?? "";
  const prereq = course?.prerequisitesText;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: 360, sm: 460 }, p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={950} sx={{ fontSize: "1.05rem" }}>
              {course ? `${code} Hub` : "Course Hub"}
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)" }}>
              {course ? semesterLabel : "Pick a course"}
            </Typography>
          </Box>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {course ? (
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(168,5,50,0.06)", mb: 2 }}>
            <Typography fontWeight={950} sx={{ color: "#A80532" }}>
              {code} — {semesterLabel}
            </Typography>
            {!!title && (
              <Typography sx={{ fontSize: "0.92rem", color: "rgba(0,0,0,0.7)" }}>{title}</Typography>
            )}
            {!!professor && (
              <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)", mt: 0.5 }}>
                Professor: <strong>{professor}</strong>{" "}
                <a
                  href={rmpSearchUrl(professor)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    marginLeft: 10,
                    fontWeight: 900,
                    color: "#2563EB",
                    textDecoration: "none",
                  }}
                >
                  RMP
                </a>
              </Typography>
            )}
          </Paper>
        ) : (
          <Typography sx={{ color: "rgba(0,0,0,0.7)", mb: 2 }}>Pick a class to view details.</Typography>
        )}

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            mb: 2,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 950 },
          }}
        >
          <Tab label="Notes" />
          <Tab label="Search" />
          <Tab label="Uploads" />
          <Tab label="Prereqs / Info" />
        </Tabs>

        {/* Notes */}
        {tab === 0 && (
          <>
            <Typography fontWeight={950} sx={{ mb: 1 }}>
              Add a topic note
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
              <TextField
                size="small"
                label="Your name (optional)"
                value={noteAuthor}
                onChange={(e) => setNoteAuthor(e.target.value)}
                disabled={!course}
              />
              <TextField
                size="small"
                label="Topic Title *"
                value={noteTopic}
                onChange={(e) => setNoteTopic(e.target.value)}
                placeholder='Example: "Time Complexity", "Deadlocks", "Bayes Theorem"'
                disabled={!course}
              />
              <TextField
                size="small"
                label="Topic Notes *"
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                multiline
                minRows={3}
                placeholder="Write definitions, steps, examples, or what the professor emphasized."
                disabled={!course}
              />
              <Button
                onClick={onPostNote}
                variant="contained"
                startIcon={<NotesIcon />}
                sx={btnPrimary}
                disabled={!course}
              >
                Post Note
              </Button>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight={950} sx={{ mb: 1 }}>
              Recent notes
            </Typography>

            <Stack spacing={1.25}>
              {course?.notes.length ? (
                course.notes.map((n) => (
                  <Paper key={n.id} elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.04)" }}>
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "#A80532", fontWeight: 950 }}>
                        {(n.author?.trim()?.[0] ?? "A").toUpperCase()}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ flexWrap: "wrap" }}>
                          <Typography fontWeight={950} sx={{ fontSize: "0.95rem" }}>
                            {n.author || "Anonymous"}
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.55)" }}>
                            {formatDate(n.createdAt)}
                          </Typography>
                        </Stack>
                        <Typography fontWeight={950} sx={{ mt: 0.25 }}>
                          {n.topicTitle}
                        </Typography>
                        <Typography sx={{ fontSize: "0.95rem", color: "rgba(0,0,0,0.75)", mt: 0.25 }}>
                          {n.body}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                  No notes yet. Add the first useful note for this class.
                </Typography>
              )}
            </Stack>
          </>
        )}

        {/* Search */}
        {tab === 1 && (
          <>
            <Typography fontWeight={950} sx={{ mb: 0.5 }}>
              Search notes (word filter)
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)", mb: 1.5 }}>
              Type multiple words — results must contain all words somewhere in the note.
            </Typography>

            <TextField
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try: "time complexity", "DFA", "Bayes theorem"'
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: "rgba(0,0,0,0.55)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
              disabled={!course}
            />

            <Typography fontWeight={950} sx={{ mb: 1 }}>
              Results ({searchedNotes.length})
            </Typography>

            <Stack spacing={1.25}>
              {course && searchedNotes.length ? (
                searchedNotes.map((n) => (
                  <Paper key={n.id} elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.04)" }}>
                    <Typography fontWeight={950}>{n.topicTitle}</Typography>
                    <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)" }}>
                      by <strong>{n.author || "Anonymous"}</strong> • {formatDate(n.createdAt)}
                    </Typography>
                    <Typography sx={{ mt: 0.5, color: "rgba(0,0,0,0.75)" }}>{n.body}</Typography>
                  </Paper>
                ))
              ) : course ? (
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>
                  No matching notes yet. Try different words or add a note.
                </Typography>
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>Pick a course first.</Typography>
              )}
            </Stack>
          </>
        )}

        {/* Uploads */}
        {tab === 2 && (
          <>
            <Typography fontWeight={950} sx={{ mb: 0.5 }}>
              Uploads / Resources
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)", mb: 1.5 }}>
              Add a link, paste a resource, or attach a file (files are session-only until backend is added).
            </Typography>

            <Stack spacing={1.25} sx={{ mb: 2 }}>
              <TextField
                size="small"
                label="Label (optional)"
                value={resourceLabel}
                onChange={(e) => setResourceLabel(e.target.value)}
                disabled={!course}
              />
              <TextField
                size="small"
                label="Resource URL"
                placeholder="https://…"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                disabled={!course}
              />
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={onAddResourceLink} sx={btnPrimary} disabled={!course}>
                  Add Link
                </Button>
                <Button variant="outlined" onClick={onPickFile} sx={btnOutlineGray} disabled={!course}>
                  Attach File
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Typography fontWeight={950} sx={{ mb: 1 }}>
              Saved uploads ({course?.resources.length ?? 0})
            </Typography>

            <Stack spacing={1.25}>
              {course?.resources.length ? (
                course.resources.map((r) => (
                  <Paper key={r.id} elevation={0} sx={{ p: 1.25, borderRadius: 3, bgcolor: "rgba(0,0,0,0.04)" }}>
                    <Typography fontWeight={950}>{r.label}</Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.65)" }}>
                      {formatDate(r.createdAt)}
                      {r.fileName ? ` • ${r.fileName}` : ""}
                    </Typography>

                    {r.url ? (
                      <Button
                        variant="text"
                        onClick={() => window.open(r.url!, "_blank", "noopener,noreferrer")}
                        endIcon={<OpenInNewRoundedIcon />}
                        sx={{ fontWeight: 950, textTransform: "none", mt: 0.5 }}
                      >
                        Open
                      </Button>
                    ) : (
                      <Typography sx={{ color: "rgba(0,0,0,0.55)" }}>No URL</Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>No uploads yet. Add a link or attach a file.</Typography>
              )}
            </Stack>
          </>
        )}

        {/* Prereqs / Info */}
        {tab === 3 && (
          <>
            <Typography fontWeight={950} sx={{ mb: 0.5 }}>
              Description & Prerequisites (best-effort)
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)", mb: 1.5 }}>
              This content is expected to come from the backend endpoint (so FE stays UI-only).
            </Typography>

            {course?.description ? (
              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(0,0,0,0.04)", mb: 1.5 }}>
                <Typography fontWeight={950} sx={{ mb: 0.5 }}>
                  Description
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.78)", whiteSpace: "pre-wrap" }}>
                  {course.description}
                </Typography>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ mb: 1.5 }}>
                No catalog description loaded yet for this course (backend endpoint may not be implemented yet).
              </Alert>
            )}

            <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(168,5,50,0.06)" }}>
              <Typography fontWeight={950} sx={{ color: "#A80532" }}>
                Prereqs
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.75)", mt: 0.5 }}>
                {prereq ? prereq : "No prerequisite text found / not provided yet by backend."}
              </Typography>
            </Paper>
          </>
        )}
      </Box>
    </Drawer>
  );
}