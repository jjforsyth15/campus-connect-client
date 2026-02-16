<<<<<<< Updated upstream
/**
 * ============================================================================
 * ACADEMICS PAGE - CampusConnect
 * ============================================================================
 *
 * Purpose:
 * Central academic planning interface that helps CSUN students organize courses,
 * semesters, notes, and resources while browsing majors and degree requirements.
 *
 * Features:
 * - Semester-based course planning with persistent local storage
 * - Add, manage, and organize courses by subject and number
 * - Course detail hub with notes, searchable notes, uploads, and prerequisites
 * - Integration with CSUN Curriculum API for course and major data (best-effort)
 * - Undergraduate majors browser with filtering and plan details
 * - Built-in academic helper chatbot for common CSUN questions
 * - Fully responsive layout using Material UI components
 *
 * Data Sources:
 * - CSUN Curriculum API (courses, terms, undergraduate plans)
 * - Local browser storage for user-specific planning data
 *
 * Design Notes:
 * - Glassmorphism-inspired UI with CSUN maroon branding
 * - Drawer-based course management for focused workflows
 * - Safe HTML structure to avoid hydration and nesting issues
 *
 * Last Updated: February 4 2026
 * 
 */


"use client";

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import CloseIcon from "@mui/icons-material/Close";
import NotesIcon from "@mui/icons-material/StickyNote2";
import AddIcon from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ChatIcon from "@mui/icons-material/Chat";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

/* --------------------------- */
/* Constants                   */
/* --------------------------- */

const CS_PLAN_URL =
  "https://www.csun.edu/current-students/degree-progress-report-and-planner-guide";

const CSUN_CLASS_SEARCH_URL =
  "https://cmsweb.csun.edu/psp/CNRPRD/EMPLOYEE/SA/c/NR_SSS_COMMON_MENU.NR_SSS_SOC_BASIC_C.GBL?";

const BG = `radial-gradient(1200px 600px at 20% 0%, rgba(255,255,255,0.10), transparent 55%),
linear-gradient(180deg, rgba(168,5,50,1) 0%, rgba(120,0,35,0.98) 55%, rgba(168,5,50,1) 100%)`;

const LS_KEY = "academics.degreePlanner.v1";

/* --------------------------- */
/* Types                       */
/* --------------------------- */

type ToastType = "info" | "success" | "warning" | "error";

type LectureNote = {
  id: string;
  author: string;
  topicTitle: string;
  body: string;
  createdAt: string;
};

type ResourceItem = {
  id: string;
  label: string;
  url?: string; // link OR object url (for file)
  fileName?: string;
  createdAt: string;
};

type CourseItem = {
  id: string;
  subject: string; // COMP
  number: string; // 333
  title?: string;
  professor?: string;
  description?: string;
  prerequisitesText?: string;
  notes: LectureNote[];
  resources: ResourceItem[];
};

type SemesterBucket = {
  id: string; // "Spring 2026"
  courses: CourseItem[];
};

type MajorPlan = {
  plan_id: string;
  plan_title: string;
  plan_type?: string;
  academic_groups_id?: string;
  academic_groups_title?: string;
};

/* --------------------------- */
/* Helpers                     */
/* --------------------------- */

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function norm(s: string) {
  return s.trim();
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function termToApiTerm(semesterLabel: string) {
  // "Spring 2026" -> "Spring-2026"
  const parts = semesterLabel.trim().split(/\s+/);
  if (parts.length < 2) return semesterLabel;
  return `${parts[0]}-${parts[1]}`;
}

function buildCourseKey(subject: string, number: string) {
  return `${subject.toUpperCase()}-${number}`;
}

function rmpSearchUrl(profName: string) {
  const q = encodeURIComponent(profName);
  // 1800 is CSUN’s RateMyProfessors school id (works as a decent default)
  return `https://www.ratemyprofessors.com/search/professors/1800?q=${q}`;
}

function extractPrereqsFromDescription(desc?: string) {
  if (!desc) return undefined;

  const m = desc.match(/Prerequisites?\s*:\s*([^.\n\r]*)/i);
  if (m?.[1]) return m[1].trim();

  const m2 = desc.match(/Prerequisite\(s\)\s*:\s*([^.\n\r]*)/i);
  if (m2?.[1]) return m2[1].trim();

  return undefined;
}

async function safeJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function loadState(): { semesters: SemesterBucket[]; selectedSemesterId: string } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveState(data: { semesters: SemesterBucket[]; selectedSemesterId: string }) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/* --------------------------- */
/* Seed                        */
/* --------------------------- */

const seed: { semesters: SemesterBucket[]; selectedSemesterId: string } = {
  selectedSemesterId: "Spring 2026",
  semesters: [
    {
      id: "Spring 2026",
      courses: [
        {
          id: makeId(),
          subject: "COMP",
          number: "333",
          title: "Concepts of Programming Languages",
          professor: "Prof. Verma",
          notes: [],
          resources: [],
        },
        {
          id: makeId(),
          subject: "MATH",
          number: "340",
          title: "Introduction to Probability and Statistics",
          professor: "Dr. Smith",
          notes: [],
          resources: [],
        },
      ],
    },
  ],
};

/* --------------------------- */
/* Page                        */
/* --------------------------- */

export default function AcademicsPage() {
  // persisted state
  const [semesters, setSemesters] = React.useState<SemesterBucket[]>(seed.semesters);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(seed.selectedSemesterId);

  const [toast, setToast] = React.useState<{ type: ToastType; text: string } | null>(null);
  const [savedPulse, setSavedPulse] = React.useState(false);

  // tabs: 0 = My Classes, 1 = Majors
  const [tab, setTab] = React.useState<0 | 1>(0);

  // add course inputs
  const [addSubject, setAddSubject] = React.useState("COMP");
  const [addNumber, setAddNumber] = React.useState("");
  const [addTitle, setAddTitle] = React.useState("");
  const [addProfessor, setAddProfessor] = React.useState("");

  // add semester input
  const [newSemName, setNewSemName] = React.useState("");

  // drawer
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerTab, setDrawerTab] = React.useState<0 | 1 | 2 | 3>(0);
  const [activeCourseId, setActiveCourseId] = React.useState<string | null>(null);

  // notes inputs
  const [noteAuthor, setNoteAuthor] = React.useState("");
  const [noteTopic, setNoteTopic] = React.useState("");
  const [noteBody, setNoteBody] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // resources inputs
  const [resourceLabel, setResourceLabel] = React.useState("");
  const [resourceUrl, setResourceUrl] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // majors
  const [majorsLoading, setMajorsLoading] = React.useState(false);
  const [majorsErr, setMajorsErr] = React.useState<string | null>(null);
  const [majors, setMajors] = React.useState<MajorPlan[]>([]);
  const [majorFilter, setMajorFilter] = React.useState("");
  const [selectedMajor, setSelectedMajor] = React.useState<MajorPlan | null>(null);

  // init localStorage
  React.useEffect(() => {
    const loaded = loadState();
    if (!loaded) return;
    if (loaded.semesters?.length) setSemesters(loaded.semesters);
    if (loaded.selectedSemesterId) setSelectedSemesterId(loaded.selectedSemesterId);
  }, []);

  // persist
  React.useEffect(() => {
    saveState({ semesters, selectedSemesterId });
    setSavedPulse(true);
    const t = setTimeout(() => setSavedPulse(false), 650);
    return () => clearTimeout(t);
  }, [semesters, selectedSemesterId]);

  const selectedSemester = React.useMemo(
    () => semesters.find((s) => s.id === selectedSemesterId) ?? semesters[0],
    [semesters, selectedSemesterId]
  );

  const activeCourse = React.useMemo(() => {
    if (!activeCourseId) return null;
    return selectedSemester?.courses.find((c) => c.id === activeCourseId) ?? null;
  }, [activeCourseId, selectedSemester]);

  const openCourseDrawer = (courseId: string, openTab: 0 | 1 | 2 | 3) => {
    setActiveCourseId(courseId);
    setDrawerTab(openTab);
    setDrawerOpen(true);

    // reset inputs
    setNoteAuthor("");
    setNoteTopic("");
    setNoteBody("");
    setSearchQuery("");
    setResourceLabel("");
    setResourceUrl("");
  };

  /* ---------- API: course info ---------- */
  async function hydrateCourseFromApi(subject: string, number: string, semesterLabel: string) {
    const code = buildCourseKey(subject, number);

    let description: string | undefined;
    let title: string | undefined;
    let prerequisitesText: string | undefined;
    let professorFromApi: string | undefined;

    // catalog detail
    try {
      const courseUrl = `https://www.csun.edu/web-dev/api/curriculum/2.0/courses/${code}`;
      const courseJson = await safeJson(courseUrl);
      title = courseJson?.course_title ?? courseJson?.title ?? courseJson?.name ?? undefined;
      description = courseJson?.description ?? courseJson?.course_description ?? undefined;
      prerequisitesText = extractPrereqsFromDescription(description);
    } catch {
      // ignore
    }

    // term offerings (best effort instructor)
    try {
      const term = termToApiTerm(semesterLabel);
      const classesUrl = `https://www.csun.edu/web-dev/api/curriculum/2.0/terms/${term}/classes/${code}`;
      const classesJson = await safeJson(classesUrl);

      const sections: any[] = Array.isArray(classesJson)
        ? classesJson
        : classesJson?.classes ?? classesJson?.sections ?? [];

      const inst =
        sections
          .map((s) => s?.instructor_name ?? s?.instructor ?? s?.instructors?.[0]?.name ?? null)
          .find((x) => typeof x === "string" && x.trim().length > 0) ?? undefined;

      if (typeof inst === "string") professorFromApi = inst;
    } catch {
      // ignore
    }

    return { title, description, prerequisitesText, professorFromApi };
  }

  async function handleAddCourse() {
    const subject = norm(addSubject).toUpperCase();
    const number = norm(addNumber);

    if (!subject || !number) {
      setToast({ type: "warning", text: "Please enter a Subject and Number (ex: COMP 333)." });
      return;
    }

    // prevent duplicates in semester
    const exists = selectedSemester.courses.some(
      (c) => c.subject.toUpperCase() === subject && c.number === number
    );
    if (exists) {
      setToast({
        type: "warning",
        text: `${subject} ${number} already exists in ${selectedSemester.id}.`,
      });
      return;
    }

    setToast({ type: "info", text: "Adding course… pulling CSUN details (best-effort)." });

    const api = await hydrateCourseFromApi(subject, number, selectedSemester.id);

    const newCourse: CourseItem = {
      id: makeId(),
      subject,
      number,
      title: norm(addTitle) || api.title || undefined,
      professor: norm(addProfessor) || api.professorFromApi || undefined,
      description: api.description,
      prerequisitesText: api.prerequisitesText,
      notes: [],
      resources: [],
    };

    setSemesters((prev) =>
      prev.map((s) =>
        s.id === selectedSemester.id ? { ...s, courses: [newCourse, ...s.courses] } : s
      )
    );

    setAddNumber("");
    setAddTitle("");
    setAddProfessor("");
    setToast({ type: "success", text: `Added ${subject} ${number} to ${selectedSemester.id}.` });
  }

  function handleAddSemester() {
    const name = norm(newSemName);
    if (!name) {
      setToast({ type: "warning", text: "Type a semester name like: Fall 2026" });
      return;
    }
    const exists = semesters.some((s) => s.id.toLowerCase() === name.toLowerCase());
    if (exists) {
      setToast({ type: "warning", text: "That semester already exists." });
      return;
    }
    setSemesters((prev) => [{ id: name, courses: [] }, ...prev]);
    setSelectedSemesterId(name);
    setNewSemName("");
    setToast({ type: "success", text: `Created semester: ${name}` });
  }

  /* ---------- Notes ---------- */
  function postNote() {
    if (!activeCourse) return;

    const topicTitle = norm(noteTopic);
    const body = norm(noteBody);
    if (!topicTitle || !body) {
      setToast({ type: "warning", text: "Add a Topic Title and note content." });
      return;
    }

    const newNote: LectureNote = {
      id: makeId(),
      author: norm(noteAuthor) || "Anonymous",
      topicTitle,
      body,
      createdAt: new Date().toISOString(),
    };

    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) =>
            c.id === activeCourse.id ? { ...c, notes: [newNote, ...c.notes] } : c
          ),
        };
      })
    );

    setNoteTopic("");
    setNoteBody("");
    setToast({ type: "success", text: "Posted note." });
  }

  const searchedNotes = React.useMemo(() => {
    if (!activeCourse) return [];
    const q = norm(searchQuery).toLowerCase();
    if (!q) return activeCourse.notes;

    const words = q.split(/\s+/).filter(Boolean);
    return activeCourse.notes.filter((n) => {
      const hay = `${n.topicTitle} ${n.body} ${n.author}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [activeCourse, searchQuery]);

  /* ---------- Resources ---------- */
  function addResourceLink() {
    if (!activeCourse) return;
    const label = norm(resourceLabel) || "Resource link";
    const url = norm(resourceUrl);

    if (!url) {
      setToast({ type: "warning", text: "Paste a URL to add a resource link." });
      return;
    }

    const item: ResourceItem = {
      id: makeId(),
      label,
      url,
      createdAt: new Date().toISOString(),
    };

    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) =>
            c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c
          ),
        };
      })
    );

    setResourceLabel("");
    setResourceUrl("");
    setToast({ type: "success", text: "Added resource link." });
  }

  function addResourceFile(file: File) {
    if (!activeCourse) return;

    const objectUrl = URL.createObjectURL(file);
    const item: ResourceItem = {
      id: makeId(),
      label: norm(resourceLabel) || file.name,
      url: objectUrl,
      fileName: file.name,
      createdAt: new Date().toISOString(),
    };

    // NOTE: object URLs won't persist after refresh (needs backend upload for real persistence)
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSemester.id) return s;
        return {
          ...s,
          courses: s.courses.map((c) =>
            c.id === activeCourse.id ? { ...c, resources: [item, ...c.resources] } : c
          ),
        };
      })
    );

    setResourceLabel("");
    setToast({ type: "success", text: "Added file (session only). Add backend to persist." });
  }

  /* ---------- Majors ---------- */
  async function loadMajors() {
    setMajorsLoading(true);
    setMajorsErr(null);

    try {
      const url = "https://www.csun.edu/web-dev/api/curriculum/2.0/plans/undergraduate";
      const json = await safeJson(url);

      const list: any[] = Array.isArray(json) ? json : json?.plans ?? json?.items ?? [];
      const cleaned: MajorPlan[] = list
        .map((p) => ({
          plan_id: p?.plan_id ?? p?.id ?? "",
          plan_title: p?.plan_title ?? p?.title ?? p?.name ?? "",
          plan_type: p?.plan_type ?? undefined,
          academic_groups_id: p?.academic_groups_id ?? undefined,
          academic_groups_title: p?.academic_groups_title ?? undefined,
        }))
        .filter((p) => p.plan_id && p.plan_title);

      setMajors(cleaned);
      if (!cleaned.length) setMajorsErr("Majors list returned empty. (API shape may have changed.)");
    } catch {
      setMajorsErr("Could not load CSUN majors from the API (network/CORS).");
    } finally {
      setMajorsLoading(false);
    }
  }

  React.useEffect(() => {
    if (tab !== 1) return;
    if (majors.length) return;
    loadMajors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const majorsFiltered = React.useMemo(() => {
    const q = norm(majorFilter).toLowerCase();
    if (!q) return majors;
    return majors.filter((m) => {
      const hay = `${m.plan_title} ${m.plan_id} ${m.academic_groups_title ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [majors, majorFilter]);

  /* --------------------------- */
  /* Render                      */
  /* sx: is a MUI inline styling prop*/
  /* --------------------------- */

  return (
    <Box sx={{ minHeight: "100vh", background: BG }}>
      <Container sx={{ pt: 3.25, pb: 8 }}>
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: { xs: 2.25, md: 3 },
            mb: 3,
            bgcolor: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.22)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="overline"
                sx={{ letterSpacing: 2.8, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}
              >
                ACADEMICS
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                <SchoolIcon sx={{ color: "rgba(255,255,255,0.95)" }} />
                <Typography
                  variant="h4"
                  fontWeight={950}
                  sx={{ fontSize: { xs: "1.65rem", md: "2.1rem" }, color: "#fff" }}
                >
                  Degree Planner
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "0.98rem",
                  maxWidth: 820,
                  mt: 0.75,
                }}
              >
                Build your CSUN roadmap: switch semesters, save notes, store resources, and browse requirements.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent="flex-end">
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBackRoundedIcon />} sx={btnGhost}>
                Back
              </Button>

              <Button
                variant="contained"
                onClick={() => window.open(CS_PLAN_URL, "_blank", "noopener,noreferrer")}
                sx={btnPrimary}
              >
                Degree Progress Report 
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mt: 2 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              textColor="inherit"
              TabIndicatorProps={{ style: { background: "#fff" } }}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.75)",
                  fontWeight: 900,
                  textTransform: "none",
                  fontSize: "0.98rem",
                },
                "& .Mui-selected": { color: "#fff" },
              }}
            >
              <Tab label="My Classes" />
              <Tab label="Majors & Requirements" />
            </Tabs>
          </Box>
        </Paper>

        {/* TAB: MY CLASSES */}
        {tab === 0 && (
          <>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: { xs: 2.25, md: 3 },
                mb: 2.5,
                bgcolor: "rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>
                    My Classes
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                    Switch semesters, add courses, and click a course to manage notes/resources/prereqs.
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
                  

                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel sx={{ color: "rgba(255,255,255,0.70)" }}>Semester</InputLabel>
                    <Select
                      value={selectedSemesterId}
                      label="Semester"
                      onChange={(e) => setSelectedSemesterId(String(e.target.value))}
                      sx={selectSx}
                    >
                      {semesters.map((s) => (
                        <MenuItem key={s.id} value={s.id}>
                          {s.id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    label="Add Semester"
                    placeholder="Fall 2026"
                    value={newSemName}
                    onChange={(e) => setNewSemName(e.target.value)}
                    sx={fieldSx}
                    InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                  />
                  <Button variant="outlined" onClick={handleAddSemester} sx={btnGhost}>
                    Add Semester
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.14)" }} />

              {/* Add course row */}
              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 2fr 2fr auto" },
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  label="Subject"
                  value={addSubject}
                  onChange={(e) => setAddSubject(e.target.value.toUpperCase())}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Number"
                  placeholder="333"
                  value={addNumber}
                  onChange={(e) => setAddNumber(e.target.value.replace(/[^\d]/g, ""))}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Title (optional)"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Professor (optional)"
                  value={addProfessor}
                  onChange={(e) => setAddProfessor(e.target.value)}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <Button
                  type="button"
                  onClick={handleAddCourse}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={btnPrimary}
                >
                  Add
                </Button>
              </Box>
            </Paper>

            {/* Course cards */}
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
                alignItems: "stretch",
              }}
            >
              {selectedSemester.courses.map((c) => (
                <CourseCard
                  key={c.id}
                  semesterLabel={selectedSemester.id}
                  course={c}
                  onOpenNotes={() => openCourseDrawer(c.id, 0)}
                  onOpenSearch={() => openCourseDrawer(c.id, 1)}
                  onOpenResources={() => openCourseDrawer(c.id, 2)}
                  onOpenPrereqs={() => openCourseDrawer(c.id, 3)}
                />
              ))}

              {!selectedSemester.courses.length && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    bgcolor: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900 }}>
                    No courses yet for {selectedSemester.id}.
                  </Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 0.5 }}>
                    Add a course above (Subject + Number).
                  </Typography>
                </Paper>
              )}
            </Box>
          </>
        )}

        {/* TAB: MAJORS */}
        {tab === 1 && (
          <>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: { xs: 2.25, md: 3 },
                mb: 2.5,
                bgcolor: "rgba(0,0,0,0.18)",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>
                Majors & Requirements
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                Browsing majors is powered by the CSUN Curriculum API (Undergraduate Plans). Select a major to view plan
                info.
              </Typography>

              <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.14)" }} />

              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.25}
                alignItems={{ md: "center" }}
                justifyContent="space-between"
              >
                <TextField
                  size="small"
                  label="Search majors"
                  placeholder='Try: "Computer Science", "Business", "Psychology"'
                  value={majorFilter}
                  onChange={(e) => setMajorFilter(e.target.value)}
                  sx={{ ...fieldSx, maxWidth: 520 }}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="outlined" onClick={loadMajors} sx={btnGhost} disabled={majorsLoading}>
                    {majorsLoading ? "Loading…" : "Reload"}
                  </Button>
                </Stack>
              </Stack>

              {majorsErr && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {majorsErr}
                </Alert>
              )}
            </Paper>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                alignItems: "stretch",
              }}
            >
              {/* list */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 2.25,
                  bgcolor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  minHeight: 360,
                }}
              >
                <Typography fontWeight={950} sx={{ mb: 1.25 }}>
                  Majors (Undergraduate Plans)
                </Typography>

                <Box sx={{ maxHeight: 360, overflowY: "auto", pr: 1 }}>
                  {majorsFiltered.length ? (
                    majorsFiltered.map((m) => (
                      <Paper
                        key={m.plan_id}
                        elevation={0}
                        onClick={() => setSelectedMajor(m)}
                        sx={{
                          p: 1.25,
                          mb: 1,
                          borderRadius: 3,
                          cursor: "pointer",
                          border: "1px solid rgba(0,0,0,0.08)",
                          bgcolor:
                            selectedMajor?.plan_id === m.plan_id
                              ? "rgba(168,5,50,0.08)"
                              : "rgba(0,0,0,0.03)",
                          "&:hover": { bgcolor: "rgba(168,5,50,0.06)" },
                        }}
                      >
                        <Typography fontWeight={950} sx={{ color: "#A80532" }}>
                          {m.plan_title}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)" }}>
                          {m.plan_id}
                          {m.academic_groups_title ? ` • ${m.academic_groups_title}` : ""}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
                      {majorsLoading ? "Loading majors…" : "No majors match your search."}
                    </Typography>
                  )}
                </Box>
              </Paper>

              {/* detail */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 2.25,
                  bgcolor: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  minHeight: 360,
                }}
              >
                <Typography fontWeight={950} sx={{ mb: 1.25 }}>
                  Selected Major
                </Typography>

                {selectedMajor ? (
                  <>
                    <Typography variant="h6" fontWeight={950} sx={{ color: "#111827" }}>
                      {selectedMajor.plan_title}
                    </Typography>
                    <Typography sx={{ color: "rgba(0,0,0,0.70)", mt: 0.5 }}>
                      Plan ID: <strong>{selectedMajor.plan_id}</strong>
                    </Typography>
                    {selectedMajor.academic_groups_title && (
                      <Typography sx={{ color: "rgba(0,0,0,0.70)" }}>
                        College/Group: <strong>{selectedMajor.academic_groups_title}</strong>
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Typography default is <p> — make it <div> so <ul> is valid */}
                    <Typography component="div" sx={{ color: "rgba(0,0,0,0.75)" }}>
                      This section is required and wired to the CSUN majors list.
                      <br />
                      Next: if you want <strong>required classes per major</strong>, we’ll need either:
                      <ul style={{ marginTop: 8, marginBottom: 0 }}>
                        <li>a CSUN API endpoint that returns requirements for a plan, or</li>
                        <li>a backend scraper/proxy that maps a plan to its catalog requirement pages.</li>
                      </ul>
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Button
                      variant="outlined"
                      sx={btnGhostDark}
                      onClick={() =>
                        window.open(
                          `https://www.csun.edu/web-dev/api/curriculum/2.0/plans/${encodeURIComponent(
                            selectedMajor.plan_id
                          )}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                      endIcon={<OpenInNewRoundedIcon />}
                    >
                      View Plan JSON
                    </Button>
                  </>
                ) : (
                  <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>Click a major on the left to view details.</Typography>
                )}
              </Paper>
            </Box>
          </>
        )}

        {/* Toast */}
        <Snackbar open={!!toast} autoHideDuration={2600} onClose={() => setToast(null)}>
          <Alert severity={(toast?.type as any) ?? "info"} sx={{ width: "100%" }}>
            {toast?.text ?? ""}
          </Alert>
        </Snackbar>

        {/* Drawer */}
        <CourseDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          tab={drawerTab}
          setTab={setDrawerTab}
          semesterLabel={selectedSemester.id}
          course={activeCourse}
          // notes
          noteAuthor={noteAuthor}
          noteTopic={noteTopic}
          noteBody={noteBody}
          setNoteAuthor={setNoteAuthor}
          setNoteTopic={setNoteTopic}
          setNoteBody={setNoteBody}
          onPostNote={postNote}
          // search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchedNotes={searchedNotes}
          // resources
          resourceLabel={resourceLabel}
          resourceUrl={resourceUrl}
          setResourceLabel={setResourceLabel}
          setResourceUrl={setResourceUrl}
          onAddResourceLink={addResourceLink}
          onPickFile={() => fileInputRef.current?.click()}
          onFilePicked={addResourceFile}
        />

        {/* hidden file picker */}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) addResourceFile(f);
            e.currentTarget.value = "";
          }}
        />

        
      </Container>
    </Box>
  );
=======
"use client";

import AcademicsView from "@/components/academics/AcademicsView";

export default function AcademicsPage() {
  return <AcademicsView />;
>>>>>>> Stashed changes
}

/* --------------------------- */
/* Components                  */
/* --------------------------- */

function CourseCard({
  semesterLabel,
  course,
  onOpenNotes,
  onOpenSearch,
  onOpenResources,
  onOpenPrereqs,
}: {
  semesterLabel: string;
  course: CourseItem;
  onOpenNotes: () => void;
  onOpenSearch: () => void;
  onOpenResources: () => void;
  onOpenPrereqs: () => void;
}) {
  const code = `${course.subject.toUpperCase()} ${course.number}`;
  const title = course.title || "Course title (not loaded)";
  const professor = course.professor || "Professor (unknown)";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 2.25,
        bgcolor: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: 230,
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 2.3,
              fontWeight: 950,
              color: "#A80532",
              fontSize: "0.72rem",
            }}
          >
            {code}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 950,
              mt: 0.25,
              mb: 0.65,
              lineHeight: 1.15,
              fontSize: "1.08rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={title}
          >
            {title}
          </Typography>

          <Typography sx={{ color: "rgba(0,0,0,0.72)", fontSize: "0.92rem" }}>
            with <strong>{professor}</strong>{" "}
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
            <br />
            <span style={{ opacity: 0.9 }}>{semesterLabel}</span>
          </Typography>
        </Box>

        <Stack spacing={1} alignItems="flex-end">
          <Chip
            label={`${course.notes.length} notes`}
            size="small"
            sx={{ borderRadius: 999, bgcolor: "#A80532", color: "#fff", fontWeight: 900 }}
          />
          <Chip
            label={`${course.resources.length} uploads`}
            size="small"
            variant="outlined"
            sx={{
              borderRadius: 999,
              borderColor: "rgba(168,5,50,0.35)",
              color: "#A80532",
              fontWeight: 900,
            }}
          />
        </Stack>
      </Stack>

      <Divider sx={{ my: 1.75 }} />

      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Button variant="outlined" onClick={onOpenNotes} startIcon={<NotesIcon />} sx={btnOutlineRed}>
          Add Notes
        </Button>

        <Button variant="outlined" onClick={onOpenSearch} startIcon={<SearchRoundedIcon />} sx={btnOutlineGray}>
          Search Notes
        </Button>

        <Button
          variant="contained"
          onClick={() => window.open(rmpSearchUrl(professor), "_blank", "noopener,noreferrer")}
          startIcon={<ThumbUpAltRoundedIcon />}
          sx={btnPrimary}
        >
          Rate Professor
        </Button>

        <Tooltip title="View description + prereqs (best-effort from CSUN API)">
          <Button variant="contained" onClick={onOpenPrereqs} startIcon={<InfoOutlinedIcon />} sx={btnDark}>
            View Description
          </Button>
        </Tooltip>

        <Button variant="contained" onClick={onOpenResources} startIcon={<UploadFileIcon />} sx={btnDark}>
          Upload
        </Button>

        <Button variant="outlined" onClick={onOpenPrereqs} startIcon={<AccountTreeOutlinedIcon />} sx={btnOutlineGray}>
          Prereqs
        </Button>
      </Stack>
    </Paper>
  );
}

function CourseDrawer({
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
              <Button onClick={onPostNote} variant="contained" startIcon={<NotesIcon />} sx={btnPrimary} disabled={!course}>
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
              If the CSUN API returns a catalog description, we extract “Prerequisite:” text automatically.
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
                No catalog description loaded yet for this course (API may not have it / request may have failed).
              </Alert>
            )}

            <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, bgcolor: "rgba(168,5,50,0.06)" }}>
              <Typography fontWeight={950} sx={{ color: "#A80532" }}>
                Prereqs
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.75)", mt: 0.5 }}>
                {prereq ? prereq : "No prerequisite text found in the description."}
              </Typography>
            </Paper>
          </>
        )}
      </Box>
    </Drawer>
  );
}



/* --------------------------- */
/* Styling helpers             */
/* --------------------------- */

const btnPrimary = {
  bgcolor: "#A80532",
  "&:hover": { bgcolor: "#810326" },
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
};

const btnGhost = {
  borderColor: "rgba(255,255,255,0.40)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
  "&:hover": { borderColor: "rgba(255,255,255,0.70)", bgcolor: "rgba(255,255,255,0.06)" },
};

const btnGhostDark = {
  borderColor: "rgba(0,0,0,0.20)",
  color: "rgba(0,0,0,0.80)",
  fontWeight: 950,
  borderRadius: 999,
  px: 2.25,
  "&:hover": { borderColor: "rgba(0,0,0,0.35)", bgcolor: "rgba(0,0,0,0.04)" },
};

const btnDark = {
  bgcolor: "rgba(0,0,0,0.86)",
  "&:hover": { bgcolor: "rgba(0,0,0,0.95)" },
  fontWeight: 950,
  borderRadius: 999,
  px: 2.1,
};

const btnOutlineRed = {
  borderColor: "#A80532",
  color: "#A80532",
  fontWeight: 950,
  borderRadius: 999,
  "&:hover": { borderColor: "#810326", color: "#810326", bgcolor: "rgba(168,5,50,0.04)" },
};

const btnOutlineGray = {
  borderColor: "rgba(0,0,0,0.25)",
  color: "rgba(0,0,0,0.75)",
  fontWeight: 950,
  borderRadius: 999,
  "&:hover": { borderColor: "rgba(0,0,0,0.45)", bgcolor: "rgba(0,0,0,0.04)" },
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "rgba(255,255,255,0.08)",
    color: "#fff",
    borderRadius: 2,
    "& fieldset": { borderColor: "rgba(255,255,255,0.20)" },
    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.32)" },
    "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.55)" },
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255,255,255,0.55)",
    opacity: 1,
  },
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
};

const selectSx = {
  bgcolor: "rgba(255,255,255,0.08)",
  color: "#fff",
  borderRadius: 2,
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.20)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.32)" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.55)" },
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
};