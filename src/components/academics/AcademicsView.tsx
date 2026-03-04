"use client";

import * as React from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
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
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import FilterListIcon from "@mui/icons-material/FilterList";
import CourseCard from "./CourseCard";
import CourseModal from "./CourseModal";
import DueDateWidget from "./DueDateWidget";
import StudyGroupPanel from "./StudyGroupPanel";
import UniCartPanel from "./UniCartPanel";
import { useAcademicsData } from "./useAcademicsData";
import { BG, CS_PLAN_URL, btnGhost, btnPrimary, btnOutlineGray, fieldSx, selectSx } from "./constants";

// Subject filter quick chips
const SUBJECT_CHIPS = ["All", "COMP", "MATH", "ENGL", "PHYS", "BUS"];
const DAYS_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export default function AcademicsView() {
  const data = useAcademicsData();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <Box sx={{ minHeight: "100vh", background: BG }}>
      {/* ── Hero / Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 3, md: 4.5 },
          pb: { xs: 0, md: 0 },
        }}
      >
        {/* Decorative background images (CSS background so no next/image needed) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.13,
            backgroundImage: `
              url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=60"),
              url("https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=60")
            `,
            backgroundSize: "60% auto, 42% auto",
            backgroundPosition: "right top, left bottom",
            backgroundRepeat: "no-repeat, no-repeat",
            pointerEvents: "none",
          }}
        />

        <Container sx={{ position: "relative", zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              p: { xs: 2.5, md: 3.5 },
              mb: 0,
              bgcolor: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(18px)",
            }}
          >
            {/* Top row */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "flex-start" }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: 3.5, fontWeight: 900, color: "rgba(255,255,255,0.80)", fontSize: "0.68rem" }}
                >
                  CSUN · ACADEMICS
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.25 }}>
                  <SchoolIcon sx={{ color: "#fff", fontSize: 28 }} />
                  <Typography
                    variant="h3"
                    fontWeight={950}
                    sx={{ fontSize: { xs: "1.75rem", md: "2.4rem" }, color: "#fff", lineHeight: 1.1 }}
                  >
                    Degree Planner
                  </Typography>
                </Stack>
                <Typography sx={{ color: "rgba(255,255,255,0.78)", fontSize: "0.98rem", mt: 0.75, maxWidth: 640, lineHeight: 1.6 }}>
                  Your all-in-one academic hub. Track courses, manage due dates, find classmates, and plan study sessions — all in one place.
                </Typography>

                {/* Feature quick-links */}
                <Stack direction="row" flexWrap="wrap" gap={0.85} sx={{ mt: 1.75 }}>
                  {[
                    { label: "Smart Planner", href: "/academics/smart-planner", icon: <AccountTreeIcon sx={{ fontSize: 14 }} /> },
                    { label: "UniCart", icon: <ShoppingCartIcon sx={{ fontSize: 14 }} />, tab: 2 },
                    { label: "Study Groups", icon: <GroupsIcon sx={{ fontSize: 14 }} />, tab: 3 },
                    { label: "Degree Progress", href: CS_PLAN_URL, external: true, icon: <AutoGraphIcon sx={{ fontSize: 14 }} /> },
                  ].map((f) =>
                    f.href ? (
                      <Chip
                        key={f.label}
                        icon={f.icon as React.ReactElement}
                        label={f.label}
                        size="small"
                        component={f.external ? "a" : Link}
                        href={f.href}
                        target={f.external ? "_blank" : undefined}
                        rel={f.external ? "noopener noreferrer" : undefined}
                        clickable
                        sx={{
                          bgcolor: "rgba(255,255,255,0.14)",
                          color: "rgba(255,255,255,0.90)",
                          fontWeight: 900,
                          fontSize: "0.78rem",
                          border: "1px solid rgba(255,255,255,0.20)",
                          "& .MuiChip-icon": { color: "rgba(255,255,255,0.75)" },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                        }}
                      />
                    ) : (
                      <Chip
                        key={f.label}
                        icon={f.icon as React.ReactElement}
                        label={f.label}
                        size="small"
                        clickable
                        onClick={() => data.setTab(f.tab as 0 | 1 | 2 | 3)}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.14)",
                          color: "rgba(255,255,255,0.90)",
                          fontWeight: 900,
                          fontSize: "0.78rem",
                          border: "1px solid rgba(255,255,255,0.20)",
                          "& .MuiChip-icon": { color: "rgba(255,255,255,0.75)" },
                          "&:hover": { bgcolor: "rgba(255,255,255,0.22)" },
                        }}
                      />
                    )
                  )}
                </Stack>
              </Box>

              {/* Stat summary cards */}
              <Stack direction="row" spacing={1.5} alignItems="flex-start" flexWrap="wrap" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                {[
                  { label: "Courses", value: data.selectedSemester?.courses.length ?? 0 },
                  {
                    label: "Units",
                    value: data.selectedSemester?.courses.reduce((s, c) => s + (c.units ?? 0), 0) ?? 0,
                  },
                  {
                    label: "Due Soon",
                    value: data.upcomingAssignments.filter((a) => {
                      const d = new Date(a.dueDate).getTime() - Date.now();
                      return !a.completed && d < 7 * 86400000 && d > 0;
                    }).length,
                  },
                ].map((s) => (
                  <Paper
                    key={s.label}
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      p: "10px 16px",
                      textAlign: "center",
                      bgcolor: "rgba(0,0,0,0.25)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      minWidth: 72,
                    }}
                  >
                    <Typography sx={{ fontSize: "1.65rem", fontWeight: 950, color: "#fff", lineHeight: 1 }}>
                      {s.value}
                    </Typography>
                    <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.65)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                      {s.label}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>

            {/* Back + DPR buttons */}
            <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mt: 2 }}>
              <Button component={Link} href="/" variant="outlined" startIcon={<ArrowBackRoundedIcon />} sx={btnGhost} size="small">
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => typeof window !== "undefined" && window.open(CS_PLAN_URL, "_blank", "noopener,noreferrer")}
                sx={btnPrimary}
                size="small"
              >
                Degree Progress Report
              </Button>
              {/* Smart Planner link */}
              <Button
                component={Link}
                href="/academics/smart-planner"
                variant="outlined"
                startIcon={<AccountTreeIcon />}
                sx={btnGhost}
                size="small"
              >
                Smart Planner
              </Button>
            </Stack>

            {/* Tabs */}
            <Box sx={{ mt: 2.5 }}>
              <Tabs
                value={data.tab}
                onChange={(_, v) => data.setTab(v)}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: "#fff", height: 3, borderRadius: 2 } }}
                sx={{
                  "& .MuiTab-root": {
                    color: "rgba(255,255,255,0.70)",
                    fontWeight: 900,
                    textTransform: "none",
                    fontSize: "0.95rem",
                    minWidth: 80,
                  },
                  "& .Mui-selected": { color: "#fff" },
                }}
              >
                <Tab label="My Classes" />
                <Tab
                  label={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <span>Due Dates</span>
                      {data.upcomingExams.filter((e) => {
                        const d = new Date(e.date).getTime() - Date.now();
                        return d > 0 && d < 3 * 86400000;
                      }).length > 0 && (
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fbbf24" }} />
                      )}
                    </Stack>
                  }
                />
                <Tab
                  label={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <ShoppingCartIcon sx={{ fontSize: 16 }} />
                      <span>UniCart</span>
                    </Stack>
                  }
                />
                <Tab
                  label={
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <GroupsIcon sx={{ fontSize: 16 }} />
                      <span>Study Groups</span>
                    </Stack>
                  }
                />
              </Tabs>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      <Container sx={{ pt: 3, pb: 8 }}>
        {/* ── Tab 0: My Classes ── */}
        {data.tab === 0 && (
          <>
            {/* Add-course form */}
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
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ md: "center" }}>
                <Box>
                  <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>My Classes</Typography>
                  <Typography sx={{ color: "rgba(255,255,255,0.70)", fontSize: "0.9rem", mt: 0.25 }}>
                    {data.selectedSemester?.id} · {data.filteredCourses.length} courses
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" justifyContent="flex-end">
                  <FormControl size="small" sx={{ minWidth: 155 }}>
                    <InputLabel sx={{ color: "rgba(255,255,255,0.70)" }}>Semester</InputLabel>
                    <Select
                      value={data.selectedSemesterId}
                      label="Semester"
                      onChange={(e) => data.setSelectedSemesterId(String(e.target.value))}
                      sx={selectSx}
                    >
                      {data.semesters.map((s) => <MenuItem key={s.id} value={s.id}>{s.id}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    label="Add Semester"
                    placeholder="Fall 2026"
                    value={data.newSemName}
                    onChange={(e) => data.setNewSemName(e.target.value)}
                    sx={fieldSx}
                    InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                  />
                  <Button variant="outlined" onClick={data.handleAddSemester} sx={btnGhost} size="small">
                    Add Semester
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.14)" }} />

              {/* Add Course Row */}
              <Box
                sx={{
                  display: "grid",
                  gap: 1.25,
                  gridTemplateColumns: { xs: "1fr", md: "100px 100px 1fr 1fr 80px auto" },
                  alignItems: "center",
                }}
              >
                <TextField
                  size="small"
                  label="Subject"
                  value={data.addSubject}
                  onChange={(e) => data.setAddSubject(e.target.value.toUpperCase())}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Number"
                  placeholder="333"
                  value={data.addNumber}
                  onChange={(e) => data.setAddNumber(e.target.value.replace(/[^\d]/g, ""))}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Title (optional)"
                  value={data.addTitle}
                  onChange={(e) => data.setAddTitle(e.target.value)}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Professor (optional)"
                  value={data.addProfessor}
                  onChange={(e) => data.setAddProfessor(e.target.value)}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <TextField
                  size="small"
                  label="Units"
                  type="number"
                  value={data.addUnits}
                  onChange={(e) => data.setAddUnits(e.target.value)}
                  sx={fieldSx}
                  InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                />
                <Button
                  onClick={data.handleAddCourse}
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={btnPrimary}
                >
                  Add
                </Button>
              </Box>

              {/* Filters */}
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.75 }} flexWrap="wrap">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters((p) => !p)}
                  sx={{ ...btnGhost, fontSize: "0.82rem", px: 1.5 }}
                >
                  {showFilters ? "Hide Filters" : "Filter Classes"}
                </Button>
                {showFilters && (
                  <>
                    {/* Subject quick-filter */}
                    {SUBJECT_CHIPS.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        onClick={() => data.setFilterSubject(s === "All" ? "" : s)}
                        sx={{
                          bgcolor: data.filterSubject === (s === "All" ? "" : s) ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.10)",
                          color: "rgba(255,255,255,0.90)",
                          fontWeight: 900,
                          fontSize: "0.78rem",
                          border: "1px solid rgba(255,255,255,0.18)",
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.18)" },
                        }}
                      />
                    ))}

                    {/* Day filter */}
                    <ToggleButtonGroup
                      value={data.filterDays}
                      onChange={(_, v) => data.setFilterDays(v)}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        "& .MuiToggleButton-root": { color: "rgba(255,255,255,0.65)", fontWeight: 900, border: "none", textTransform: "none", px: 1, fontSize: "0.78rem", py: 0.35 },
                        "& .Mui-selected": { color: "#fff", bgcolor: "rgba(255,255,255,0.18) !important" },
                      }}
                    >
                      {DAYS_OPTIONS.map((d) => <ToggleButton key={d} value={d}>{d}</ToggleButton>)}
                    </ToggleButtonGroup>

                    {/* Online filter */}
                    <ToggleButtonGroup
                      value={data.filterOnline}
                      exclusive
                      size="small"
                      onChange={(_, v) => v && data.setFilterOnline(v)}
                      sx={{
                        bgcolor: "rgba(255,255,255,0.08)",
                        borderRadius: 2,
                        "& .MuiToggleButton-root": { color: "rgba(255,255,255,0.65)", fontWeight: 900, border: "none", textTransform: "none", px: 1.25, fontSize: "0.78rem", py: 0.35 },
                        "& .Mui-selected": { color: "#fff", bgcolor: "rgba(255,255,255,0.18) !important" },
                      }}
                    >
                      <ToggleButton value="all">All</ToggleButton>
                      <ToggleButton value="in-person">In-Person</ToggleButton>
                      <ToggleButton value="online">Online</ToggleButton>
                    </ToggleButtonGroup>

                    {/* Units filter */}
                    <TextField
                      size="small"
                      placeholder="Units"
                      value={data.filterUnits}
                      onChange={(e) => data.setFilterUnits(e.target.value)}
                      sx={{ ...fieldSx, width: 80 }}
                      InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
                    />
                  </>
                )}
              </Stack>
            </Paper>

            {/* Course cards + due-date widget */}
            <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", lg: "1fr 320px" }, alignItems: "start" }}>
              <Box>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fit, minmax(370px, 1fr))",
                    alignItems: "stretch",
                  }}
                >
                  {data.filteredCourses.map((c) => (
                    <CourseCard
                      key={c.id}
                      semesterLabel={data.selectedSemester.id}
                      course={c}
                      onOpenNotes={() => data.openCourseModal(c.id, 0)}
                      onOpenSearch={() => data.openCourseModal(c.id, 1)}
                      onOpenResources={() => data.openCourseModal(c.id, 2)}
                      onOpenPrereqs={() => data.openCourseModal(c.id, 3)}
                    />
                  ))}
                  {!data.filteredCourses.length && (
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
                        No courses{data.filterSubject || data.filterDays.length || data.filterUnits ? " matching filters" : ` yet for ${data.selectedSemester.id}`}.
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>
                        {data.filterSubject || data.filterDays.length || data.filterUnits
                          ? "Clear filters or add a new course above."
                          : "Add a course above (Subject + Number required)."}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              </Box>

              {/* Due Date Widget sidebar */}
              <Box>
                <DueDateWidget
                  assignments={data.upcomingAssignments}
                  exams={data.upcomingExams}
                  onToggleAssignment={data.toggleAssignment}
                  courses={data.selectedSemester?.courses ?? []}
                />
              </Box>
            </Box>
          </>
        )}

        {/* ── Tab 1: Due Dates ── */}
        {data.tab === 1 && (
          <>
            <Paper
              elevation={0}
              sx={{ borderRadius: 4, p: { xs: 2.25, md: 3 }, mb: 2.5, bgcolor: "rgba(0,0,0,0.18)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(12px)" }}
            >
              <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>Due Dates & Upcoming Exams</Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 0.4, fontSize: "0.92rem" }}>
                All assignments and exams across {data.selectedSemester?.id}. Click the circle to mark complete.
              </Typography>
            </Paper>
            <DueDateWidget
              assignments={data.upcomingAssignments}
              exams={data.upcomingExams}
              onToggleAssignment={data.toggleAssignment}
              courses={data.selectedSemester?.courses ?? []}
            />
          </>
        )}

        {/* ── Tab 2: UniCart ── */}
        {data.tab === 2 && (
          <UniCartPanel
            cartClasses={data.cartClasses}
            cartSemester={data.cartSemester}
            setCartSemester={data.setCartSemester}
            cartModeFilter={data.cartModeFilter}
            setCartModeFilter={data.setCartModeFilter}
            classSearchQuery={data.classSearchQuery}
            setClassSearchQuery={data.setClassSearchQuery}
            filteredClassLibrary={data.filteredClassLibrary}
            matchedProfiles={data.matchedProfiles}
            onAddToCart={data.addToCart}
            onRemoveFromCart={data.removeFromCart}
          />
        )}

        {/* ── Tab 3: Study Groups ── */}
        {data.tab === 3 && (
          <StudyGroupPanel
            studyGroups={data.studyGroups}
            sgFormOpen={data.sgFormOpen}
            setSgFormOpen={data.setSgFormOpen}
            sgCourse={data.sgCourse}
            setSgCourse={data.setSgCourse}
            sgTopic={data.sgTopic}
            setSgTopic={data.setSgTopic}
            sgDateTime={data.sgDateTime}
            setSgDateTime={data.setSgDateTime}
            sgLocation={data.sgLocation}
            setSgLocation={data.setSgLocation}
            sgIsVirtual={data.sgIsVirtual}
            setSgIsVirtual={data.setSgIsVirtual}
            sgMeetingLink={data.sgMeetingLink}
            setSgMeetingLink={data.setSgMeetingLink}
            sgMaxMembers={data.sgMaxMembers}
            setSgMaxMembers={data.setSgMaxMembers}
            sgNotes={data.sgNotes}
            setSgNotes={data.setSgNotes}
            sgCreator={data.sgCreator}
            setSgCreator={data.setSgCreator}
            onCreate={data.createStudyGroup}
            onJoin={data.joinStudyGroup}
          />
        )}
      </Container>

      {/* ── Toast ── */}
      <Snackbar open={!!data.toast} autoHideDuration={2600} onClose={() => data.setToast(null)}>
        <Alert
          severity={(data.toast?.type as "info" | "success" | "warning" | "error") ?? "info"}
          sx={{ width: "100%", borderRadius: 3 }}
        >
          {data.toast?.text ?? ""}
        </Alert>
      </Snackbar>

      {/* ── Course Modal ── */}
      <CourseModal
        open={data.modalOpen}
        onClose={() => data.setModalOpen(false)}
        tab={data.modalTab}
        setTab={data.setModalTab}
        semesterLabel={data.selectedSemester?.id ?? ""}
        course={data.activeCourse}
        noteAuthor={data.noteAuthor}
        noteTopic={data.noteTopic}
        noteBody={data.noteBody}
        noteIsPublic={data.noteIsPublic}
        setNoteAuthor={data.setNoteAuthor}
        setNoteTopic={data.setNoteTopic}
        setNoteBody={data.setNoteBody}
        setNoteIsPublic={data.setNoteIsPublic}
        onPostNote={data.postNote}
        searchQuery={data.searchQuery}
        setSearchQuery={data.setSearchQuery}
        searchedNotes={data.searchedNotes}
        resourceLabel={data.resourceLabel}
        resourceUrl={data.resourceUrl}
        resourceIsPublic={data.resourceIsPublic}
        setResourceLabel={data.setResourceLabel}
        setResourceUrl={data.setResourceUrl}
        setResourceIsPublic={data.setResourceIsPublic}
        onAddResourceLink={data.addResourceLink}
        onPickFile={() => fileInputRef.current?.click()}
        onFilePicked={data.addResourceFile}
        onToggleAssignment={data.toggleAssignment}
      />

      {/* Hidden file input for legacy onPickFile button path */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) data.addResourceFile(f);
          e.currentTarget.value = "";
        }}
      />
    </Box>
  );
}
