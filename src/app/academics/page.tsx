/*
 
 * ACADEMICS PAGE - CampusConnect

 * NOTE (Team Request Alignment):
 * - UI/UX stays in the frontend
 * - Data fetching is delegated to backend via "empty endpoints"
 * - This page calls internal endpoints no CSUN scraping  
 * - no CSUN API 

 */

"use client";

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

import CourseCard from "@/components/academics/CourseCard";
import CourseDrawer from "@/components/academics/CourseDrawer";
import MajorsPanel from "@/components/academics/MajorsPanel";

import {
  BG,
  CS_PLAN_URL,
  LS_KEY,
  btnGhost,
  btnPrimary,
  fieldSx,
  selectSx,
  makeId,
  norm,
  loadState,
  saveState,
  type ToastType,
  type CourseItem,
  type LectureNote,
  type MajorPlan,
  type ResourceItem,
  type SemesterBucket,
  apiHydrateCourse,
  apiFetchMajors,
} from "@/components/academics/AcademicsStates";

// seeds

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

// pages

export default function AcademicsPage() {
  // persisted state
  const [semesters, setSemesters] = React.useState<SemesterBucket[]>(seed.semesters);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState(seed.selectedSemesterId);

  const [toast, setToast] = React.useState<{ type: ToastType; text: string } | null>(null);

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
    const loaded = loadState(LS_KEY);
    if (!loaded) return;
    if (loaded.semesters?.length) setSemesters(loaded.semesters);
    if (loaded.selectedSemesterId) setSelectedSemesterId(loaded.selectedSemesterId);
  }, []);

  // persist
  React.useEffect(() => {
    saveState(LS_KEY, { semesters, selectedSemesterId });
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

  // actions 

  async function handleAddCourse() {
    const subject = norm(addSubject).toUpperCase();
    const number = norm(addNumber);

    if (!subject || !number) {
      setToast({ type: "warning", text: "Please enter a Subject and Number (ex: COMP 333)." });
      return;
    }

    
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

    setToast({
      type: "info",
      text: "Adding course… requesting details from backend endpoint (best-effort).",
    });

    
    const api = await apiHydrateCourse({
      subject,
      number,
      semesterLabel: selectedSemester.id,
    });

    const newCourse: CourseItem = {
      id: makeId(),
      subject,
      number,
      title: norm(addTitle) || api.title || undefined,
      professor: norm(addProfessor) || api.professor || undefined,
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

  // notes

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

  //Resources

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

  // majors

  async function loadMajors() {
    setMajorsLoading(true);
    setMajorsErr(null);

    
    const res = await apiFetchMajors();

    if (!res.ok) {
      setMajorsErr(res.error || "Could not load majors from backend endpoint.");
      setMajorsLoading(false);
      return;
    }

    setMajors(res.data);
    if (!res.data.length) setMajorsErr("Majors returned empty. Backend endpoint not implemented yet.");
    setMajorsLoading(false);
  }

  React.useEffect(() => {
    if (tab !== 1) return;
    if (majors.length) return;
    loadMajors();
    
  }, [tab]);

  const majorsFiltered = React.useMemo(() => {
    const q = norm(majorFilter).toLowerCase();
    if (!q) return majors;
    return majors.filter((m) => {
      const hay = `${m.plan_title} ${m.plan_id} ${m.academic_groups_title ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [majors, majorFilter]);

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
          <MajorsPanel
            majorsLoading={majorsLoading}
            majorsErr={majorsErr}
            majorsFiltered={majorsFiltered}
            majorFilter={majorFilter}
            setMajorFilter={setMajorFilter}
            selectedMajor={selectedMajor}
            setSelectedMajor={setSelectedMajor}
            onReload={loadMajors}
          />
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
}
