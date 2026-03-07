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
import CourseCard from "./CourseCard";
import CourseDrawer from "./CourseDrawer";
import MajorsPanel from "./MajorsPanel";
import { useAcademicsData } from "./useAcademicsData";
import { BG, CS_PLAN_URL, btnGhost, btnPrimary, fieldSx, selectSx } from "./constants";

export default function AcademicsView() {
  const data = useAcademicsData();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <Box sx={{ minHeight: "100vh", background: BG }}>
      <Container sx={{ pt: 3.25, pb: 8 }}>
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
              <Typography variant="overline" sx={{ letterSpacing: 2.8, fontWeight: 900, color: "rgba(255,255,255,0.85)" }}>
                ACADEMICS
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                <SchoolIcon sx={{ color: "rgba(255,255,255,0.95)" }} />
                <Typography variant="h4" fontWeight={950} sx={{ fontSize: { xs: "1.65rem", md: "2.1rem" }, color: "#fff" }}>
                  Degree Planner
                </Typography>
              </Stack>
              <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.98rem", maxWidth: 820, mt: 0.75 }}>
                Build your CSUN roadmap: switch semesters, save notes, store resources, and browse requirements.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.25} alignItems="flex-start" justifyContent="flex-end">
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBackRoundedIcon />} sx={btnGhost}>Back</Button>
              <Button variant="contained" onClick={() => typeof window !== "undefined" && window.open(CS_PLAN_URL, "_blank", "noopener,noreferrer")} sx={btnPrimary}>
                Degree Progress Report
              </Button>
            </Stack>
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Tabs
              value={data.tab}
              onChange={(_, v) => data.setTab(v)}
              textColor="inherit"
              TabIndicatorProps={{ style: { background: "#fff" } }}
              sx={{
                "& .MuiTab-root": { color: "rgba(255,255,255,0.75)", fontWeight: 900, textTransform: "none", fontSize: "0.98rem" },
                "& .Mui-selected": { color: "#fff" },
              }}
            >
              <Tab label="My Classes" />
              <Tab label="Majors & Requirements" />
            </Tabs>
          </Box>
        </Paper>

        {data.tab === 0 && (
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
                  <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>My Classes</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                    Switch semesters, add courses, and click a course to manage notes/resources/prereqs.
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
                  <FormControl size="small" sx={{ minWidth: 170 }}>
                    <InputLabel sx={{ color: "rgba(255,255,255,0.70)" }}>Semester</InputLabel>
                    <Select value={data.selectedSemesterId} label="Semester" onChange={(e) => data.setSelectedSemesterId(String(e.target.value))} sx={selectSx}>
                      {data.semesters.map((s) => <MenuItem key={s.id} value={s.id}>{s.id}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField size="small" label="Add Semester" placeholder="Fall 2026" value={data.newSemName} onChange={(e) => data.setNewSemName(e.target.value)} sx={fieldSx} InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }} />
                  <Button variant="outlined" onClick={data.handleAddSemester} sx={btnGhost}>Add Semester</Button>
                </Stack>
              </Stack>
              <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.14)" }} />
              <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 2fr 2fr auto" }, alignItems: "center" }}>
                <TextField size="small" label="Subject" value={data.addSubject} onChange={(e) => data.setAddSubject(e.target.value.toUpperCase())} sx={fieldSx} InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }} />
                <TextField size="small" label="Number" placeholder="333" value={data.addNumber} onChange={(e) => data.setAddNumber(e.target.value.replace(/[^\d]/g, ""))} sx={fieldSx} InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }} />
                <TextField size="small" label="Title (optional)" value={data.addTitle} onChange={(e) => data.setAddTitle(e.target.value)} sx={fieldSx} InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }} />
                <TextField size="small" label="Professor (optional)" value={data.addProfessor} onChange={(e) => data.setAddProfessor(e.target.value)} sx={fieldSx} InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }} />
                <Button type="button" onClick={data.handleAddCourse} variant="contained" startIcon={<AddIcon />} sx={btnPrimary}>Add</Button>
              </Box>
            </Paper>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", alignItems: "stretch" }}>
              {data.selectedSemester.courses.map((c) => (
                <CourseCard
                  key={c.id}
                  semesterLabel={data.selectedSemester.id}
                  course={c}
                  onOpenNotes={() => data.openCourseDrawer(c.id, 0)}
                  onOpenSearch={() => data.openCourseDrawer(c.id, 1)}
                  onOpenResources={() => data.openCourseDrawer(c.id, 2)}
                  onOpenPrereqs={() => data.openCourseDrawer(c.id, 3)}
                />
              ))}
              {!data.selectedSemester.courses.length && (
                <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}>
                  <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900 }}>No courses yet for {data.selectedSemester.id}.</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 0.5 }}>Add a course above (Subject + Number).</Typography>
                </Paper>
              )}
            </Box>
          </>
        )}

        {data.tab === 1 && (
          <MajorsPanel
            majorsLoading={data.majorsLoading}
            majorsErr={data.majorsErr}
            majorsFiltered={data.majorsFiltered}
            majorFilter={data.majorFilter}
            setMajorFilter={data.setMajorFilter}
            selectedMajor={data.selectedMajor}
            setSelectedMajor={data.setSelectedMajor}
            onReload={data.loadMajors}
          />
        )}

        <Snackbar open={!!data.toast} autoHideDuration={2600} onClose={() => data.setToast(null)}>
          <Alert severity={(data.toast?.type as "info" | "success" | "warning" | "error") ?? "info"} sx={{ width: "100%" }}>{data.toast?.text ?? ""}</Alert>
        </Snackbar>

        <CourseDrawer
          open={data.drawerOpen}
          onClose={() => data.setDrawerOpen(false)}
          tab={data.drawerTab}
          setTab={data.setDrawerTab}
          semesterLabel={data.selectedSemester.id}
          course={data.activeCourse}
          noteAuthor={data.noteAuthor}
          noteTopic={data.noteTopic}
          noteBody={data.noteBody}
          setNoteAuthor={data.setNoteAuthor}
          setNoteTopic={data.setNoteTopic}
          setNoteBody={data.setNoteBody}
          onPostNote={data.postNote}
          searchQuery={data.searchQuery}
          setSearchQuery={data.setSearchQuery}
          searchedNotes={data.searchedNotes}
          resourceLabel={data.resourceLabel}
          resourceUrl={data.resourceUrl}
          setResourceLabel={data.setResourceLabel}
          setResourceUrl={data.setResourceUrl}
          onAddResourceLink={data.addResourceLink}
          onPickFile={() => fileInputRef.current?.click()}
          onFilePicked={data.addResourceFile}
        />

        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) data.addResourceFile(f);
            e.currentTarget.value = "";
          }}
        />
      </Container>
    </Box>
  );
}