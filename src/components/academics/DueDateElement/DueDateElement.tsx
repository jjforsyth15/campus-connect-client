"use client";

/**
 * DueDateElement.tsx  — Enhanced Interactive Due-Date Tracker
 *
 * ─── BACKEND INTEGRATION NOTES ───────────────────────────────────────────────
 * This component is currently driven by mock data from ./mockStatData/index.ts
 *
 * To wire a real API, replace the `useAssignments` hook (bottom of this file)
 * with real fetch calls:
 *
 *   GET  /api/assignments          → MockAssignment[]
 *   GET  /api/exams                → MockExam[]
 *   PATCH /api/assignments/:id     → body: { completed: boolean }
 *   PATCH /api/assignments/:id/star → body: { starred: boolean }
 *   POST  /api/reminders           → body: ReminderPayload
 *     { assignmentId, email, reminderDate }
 *
 * The `onToggleAssignment` / `onToggleStar` callbacks fire optimistic UI updates
 * locally and should call those endpoints.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import * as React from "react";
import dayjs from "dayjs";
import {
  Box, Chip, Divider, IconButton, Paper, Stack, Tooltip, Typography,
  TextField, MenuItem, Select, FormControl, InputLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, Button,
} from "@mui/material";
import CheckCircleIcon         from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessAlarmIcon          from "@mui/icons-material/AccessAlarm";
import MenuBookIcon             from "@mui/icons-material/MenuBook";
import ViewListIcon             from "@mui/icons-material/ViewList";
import PieChartIcon             from "@mui/icons-material/PieChart";
import CalendarViewMonthIcon    from "@mui/icons-material/CalendarViewMonth";
import BarChartIcon             from "@mui/icons-material/BarChart";
import StarIcon                 from "@mui/icons-material/Star";
import StarBorderIcon           from "@mui/icons-material/StarBorder";
import NotificationsIcon        from "@mui/icons-material/Notifications";
import FilterListIcon           from "@mui/icons-material/FilterList";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

import {
  mockAssignments,
  mockExams,
  mockCourses,
  COURSE_COLORS,
} from "@/components/academics/DueDateElement/mockStatData/index";
import type {
  MockAssignment,
  MockExam,
  MockCourse,
  FilterOption,
  SortOption,
} from "@/components/academics/DueDateElement/mockStatData/types";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, ChartTooltip, Legend);

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = "list" | "pie" | "calendar" | "progress" | "bar";

type Props = {
  /** BACKEND: replace with assignments from API */
  assignments?: MockAssignment[];
  /** BACKEND: replace with exams from API */
  exams?: MockExam[];
  /** BACKEND: replace with courses from API */
  courses?: MockCourse[];
  /** Called when user toggles assignment done — call PATCH /api/assignments/:id */
  onToggleAssignment?: (courseId: string, assignmentId: string) => void;
  /** Called when user stars an assignment — call PATCH /api/assignments/:id/star */
  onToggleStar?: (assignmentId: string) => void;
  expanded?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysUntil(iso: string) {
  return dayjs(iso).startOf("day").diff(dayjs().startOf("day"), "day");
}
function isPast(iso: string) {
  return dayjs(iso).isBefore(dayjs(), "day");
}
function isToday(iso: string) {
  return dayjs(iso).isSame(dayjs(), "day");
}
function formatDateOnly(iso: string) {
  return dayjs(iso).format("MMM D");
}
function formatTimeOnly(iso: string) {
  return dayjs(iso).format("h:mm A");
}

function urgencyColor(d: number, completed?: boolean) {
  if (completed) return "#16a34a";
  if (d < 0)    return "#9ca3af";
  if (d === 0)  return "#dc2626";
  if (d <= 2)   return "#ef4444";
  if (d <= 5)   return "#f59e0b";
  return "#6b7280";
}

const WEIGHT_ORDER: Record<string, number> = { exam: 0, quiz: 1, project: 2, homework: 3 };

function courseColor(courseCode: string) {
  return COURSE_COLORS[courseCode] ?? "#6b7280";
}

// ─── useAssignments hook ──────────────────────────────────────────────────────
/**
 * Local state manager for assignments.
 * BACKEND: Replace initial state with `useSWR('/api/assignments', fetcher)` or similar.
 * `toggleDone`  → PATCH /api/assignments/:id  { completed: !current }
 * `toggleStar`  → PATCH /api/assignments/:id/star { starred: !current }
 */
function useAssignments(initial: MockAssignment[]) {
  const [assignments, setAssignments] = React.useState<MockAssignment[]>(initial);

  const toggleDone = React.useCallback((id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
    // BACKEND: await fetch(`/api/assignments/${id}`, { method: 'PATCH', body: JSON.stringify({ completed }) })
  }, []);

  const toggleStar = React.useCallback((id: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, starred: !a.starred } : a))
    );
    // BACKEND: await fetch(`/api/assignments/${id}/star`, { method: 'PATCH', body: JSON.stringify({ starred }) })
  }, []);

  return { assignments, toggleDone, toggleStar };
}

// ─── ReminderDialog ───────────────────────────────────────────────────────────
function ReminderDialog({
  assignment,
  open,
  onClose,
}: {
  assignment: MockAssignment | null;
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = React.useState("");
  const [reminderDate, setReminderDate] = React.useState(
    dayjs().format("YYYY-MM-DD")
  );

  const handleSubmit = () => {
    if (!assignment) return;
    /**
     * BACKEND: POST /api/reminders
     * body: { assignmentId: assignment.id, email, reminderDate }
     */
    console.log("[REMINDER]", { assignmentId: assignment.id, email, reminderDate });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
      <DialogTitle sx={{ fontWeight: 900, fontSize: "0.95rem", pb: 0 }}>
        Set Reminder
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.55)", mb: 2, mt: 0.5 }}>
          {assignment?.title}
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Remind me on"
            type="date"
            size="small"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} size="small" sx={{ color: "rgba(0,0,0,0.45)" }}>Cancel</Button>
        <Button onClick={handleSubmit} size="small" variant="contained"
          sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, borderRadius: 2 }}>
          Set Reminder
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── AssignmentRow ─────────────────────────────────────────────────────────────
// (defined below — keeping section marker)
function AssignmentRow({
  a,
  onToggleDone,
  onToggleStar,
  onReminder,
  compact = false,
}: {
  a: MockAssignment;
  onToggleDone: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReminder: (a: MockAssignment) => void;
  compact?: boolean;
}) {
  const d = daysUntil(a.dueDate);
  const overdue = isPast(a.dueDate) && !a.completed;
  const color = courseColor(a.courseCode);

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 1,
        py: 0.6,
        borderRadius: 2,
        bgcolor: a.completed ? "rgba(22,163,74,0.04)" : overdue ? "rgba(220,38,38,0.04)" : "transparent",
        border: `1px solid ${a.completed ? "rgba(22,163,74,0.12)" : overdue ? "rgba(220,38,38,0.10)" : "transparent"}`,
        transition: "all 0.15s",
        "&:hover": { bgcolor: a.completed ? "rgba(22,163,74,0.07)" : "rgba(0,0,0,0.03)" },
      }}
    >
      {/* Done toggle */}
      <Tooltip title={a.completed ? "Mark incomplete" : "Mark complete"} placement="left">
        <IconButton size="small" sx={{ p: 0.2 }} onClick={() => onToggleDone(a.id)}>
          {a.completed
            ? <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 18 }} />
            : <RadioButtonUncheckedIcon sx={{ color: "rgba(0,0,0,0.28)", fontSize: 18 }} />}
        </IconButton>
      </Tooltip>

      {/* Course color dot */}
      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />

      {/* Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{
          fontSize: compact ? "0.80rem" : "0.85rem",
          fontWeight: 700,
          textDecoration: a.completed ? "line-through" : "none",
          color: a.completed ? "rgba(0,0,0,0.38)" : overdue ? "#dc2626" : "rgba(0,0,0,0.82)",
          lineHeight: 1.2,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {a.completed && "✓ "}{a.title}
        </Typography>
        {!compact && (
          <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.46)" }}>
            {a.courseCode} · {a.weight} · {a.points}pts · Due {formatDateOnly(a.dueDate)}
            {isToday(a.dueDate) ? " (Today)" : ""}
          </Typography>
        )}
      </Box>

      {/* Star */}
      <Tooltip title={a.starred ? "Unstar" : "Star as important"} placement="top">
        <IconButton size="small" sx={{ p: 0.2 }} onClick={() => onToggleStar(a.id)}>
          {a.starred
            ? <StarIcon sx={{ color: "#f59e0b", fontSize: 15 }} />
            : <StarBorderIcon sx={{ color: "rgba(0,0,0,0.25)", fontSize: 15 }} />}
        </IconButton>
      </Tooltip>

      {/* Reminder */}
      {!compact && (
        <Tooltip title="Set email reminder" placement="top">
          <IconButton size="small" sx={{ p: 0.2 }} onClick={() => onReminder(a)}>
            <NotificationsIcon sx={{ color: "rgba(0,0,0,0.25)", fontSize: 15 }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Status chip */}
      {!a.completed && (
        <Chip
          label={overdue ? "Overdue" : d === 0 ? "Today!" : `${d}d`}
          size="small"
          sx={{
            height: 16, fontSize: "0.64rem", fontWeight: 900, flexShrink: 0,
            bgcolor: overdue ? "#fef2f2" : d <= 1 ? "#fef2f2" : d <= 5 ? "#fffbeb" : "rgba(0,0,0,0.05)",
            color: urgencyColor(d),
          }}
        />
      )}
    </Stack>
  );
}

// ─── ListView ─────────────────────────────────────────────────────────────────
function ListView({
  assignments,
  exams,
  onToggleDone,
  onToggleStar,
  onReminder,
}: {
  assignments: MockAssignment[];
  exams: MockExam[];
  onToggleDone: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReminder: (a: MockAssignment) => void;
}) {
  const [filter, setFilter] = React.useState<FilterOption | "all">("all");
  const [sort, setSort] = React.useState<SortOption>("due-date");
  const [showAll, setShowAll] = React.useState(false);

  const upcomingExams = exams.filter((e) => !isPast(e.date));
  const overdueCt = assignments.filter((a) => isPast(a.dueDate) && !a.completed).length;

  const filtered = assignments.filter((a) => {
    if (filter === "done")     return a.completed;
    if (filter === "due-today") return isToday(a.dueDate) && !a.completed;
    if (filter === "due-soon") return daysUntil(a.dueDate) <= 2 && daysUntil(a.dueDate) >= 0 && !a.completed;
    if (filter === "upcoming") return daysUntil(a.dueDate) > 2 && !a.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "most-points")        return b.points - a.points;
    if (sort === "due-date")           return dayjs(a.dueDate).diff(dayjs(b.dueDate));
    if (sort === "weight-high-to-low") return WEIGHT_ORDER[a.weight] - WEIGHT_ORDER[b.weight];
    if (sort === "weight-low-to-high") return WEIGHT_ORDER[b.weight] - WEIGHT_ORDER[a.weight];
    if (sort === "group-by-class")     return a.courseCode.localeCompare(b.courseCode);
    return 0;
  });

  const incomplete = sorted.filter((a) => !a.completed);
  const done       = sorted.filter((a) => a.completed);
  const visible    = showAll ? incomplete : incomplete.slice(0, 6);

  return (
    <>
      {/* Filters */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5, gap: 0.75 }}>
        {overdueCt > 0 && (
          <Chip label={`${overdueCt} overdue`} size="small"
            sx={{ bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 900, fontSize: "0.70rem" }} />
        )}
        <FormControl size="small" sx={{ minWidth: 110 }}>
          <InputLabel sx={{ fontSize: "0.72rem" }}>Filter</InputLabel>
          <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value as any)}
            sx={{ fontSize: "0.72rem", height: 28 }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="due-today">Due Today</MenuItem>
            <MenuItem value="due-soon">Due Soon (≤2d)</MenuItem>
            <MenuItem value="upcoming">Upcoming</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel sx={{ fontSize: "0.72rem" }}>Sort</InputLabel>
          <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value as SortOption)}
            sx={{ fontSize: "0.72rem", height: 28 }}>
            <MenuItem value="due-date">Due Date</MenuItem>
            <MenuItem value="most-points">Most Points</MenuItem>
            <MenuItem value="group-by-class">Group by Class</MenuItem>
            <MenuItem value="weight-high-to-low">Weight: High→Low</MenuItem>
            <MenuItem value="weight-low-to-high">Weight: Low→High</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
            <AccessAlarmIcon sx={{ fontSize: 14, color: "#d97706" }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: "#d97706", textTransform: "uppercase", letterSpacing: 1 }}>
              Upcoming Exams
            </Typography>
          </Stack>
          <Stack spacing={0.5} sx={{ mb: 1.5 }}>
            {upcomingExams.map((e) => {
              const d = daysUntil(e.date);
              const color = courseColor(e.courseCode);
              return (
                <Stack key={e.id} direction="row" spacing={1.5} alignItems="center"
                  sx={{ px: 1, py: 0.5, borderRadius: 2, bgcolor: "rgba(217,119,6,0.04)", border: "1px solid rgba(217,119,6,0.12)" }}>
                  <Box sx={{ width: 3, height: 32, borderRadius: 999, bgcolor: color, flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.83rem", fontWeight: 900, lineHeight: 1.2 }}>{e.title}</Typography>
                    <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.50)" }}>
                      {e.courseCode} · {formatDateOnly(e.date)} {formatTimeOnly(e.date)}{e.location ? ` · ${e.location}` : ""}
                    </Typography>
                  </Box>
                  <Chip label={d === 0 ? "Today!" : `${d}d`} size="small"
                    sx={{ height: 16, fontSize: "0.64rem", fontWeight: 900,
                      bgcolor: d <= 3 ? "#fffbeb" : "rgba(0,0,0,0.06)", color: urgencyColor(d), flexShrink: 0 }} />
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ my: 1 }} />
        </>
      )}

      {/* Assignments header */}
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
        <MenuBookIcon sx={{ fontSize: 14, color: "#A80532" }} />
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: "#A80532", textTransform: "uppercase", letterSpacing: 1 }}>
          Assignments
        </Typography>
        <Typography sx={{ fontSize: "0.65rem", color: "rgba(0,0,0,0.40)" }}>
          ({incomplete.length} pending)
        </Typography>
      </Stack>

      {/* Pending assignments */}
      <Stack spacing={0.4}>
        {visible.map((a) => (
          <AssignmentRow key={a.id} a={a} onToggleDone={onToggleDone} onToggleStar={onToggleStar} onReminder={onReminder} />
        ))}
      </Stack>

      {incomplete.length > 6 && (
        <Typography onClick={() => setShowAll((p) => !p)}
          sx={{ fontSize: "0.78rem", color: "#A80532", fontWeight: 900, cursor: "pointer", mt: 0.75 }}>
          {showAll ? "Show less" : `Show all ${incomplete.length}`}
        </Typography>
      )}

      {/* Done section */}
      {done.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
            <CheckCircleIcon sx={{ fontSize: 14, color: "#16a34a" }} />
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: "#16a34a", textTransform: "uppercase", letterSpacing: 1 }}>
              Completed ({done.length})
            </Typography>
          </Stack>
          <Stack spacing={0.4}>
            {done.map((a) => (
              <AssignmentRow key={a.id} a={a} onToggleDone={onToggleDone} onToggleStar={onToggleStar} onReminder={onReminder} compact />
            ))}
          </Stack>
        </>
      )}
    </>
  );
}

// ─── PieView ──────────────────────────────────────────────────────────────────
function PieView({
  assignments,
  onToggleDone,
  onToggleStar,
  onReminder,
}: {
  assignments: MockAssignment[];
  onToggleDone: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReminder: (a: MockAssignment) => void;
}) {
  const [hoveredSlice, setHoveredSlice] = React.useState<MockAssignment | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 });

  const total     = assignments.length;
  const completed = assignments.filter((a) => a.completed).length;
  const overdue   = assignments.filter((a) => isPast(a.dueDate) && !a.completed).length;
  const pending   = total - completed - overdue;

  if (total === 0) return (
    <Typography sx={{ color: "rgba(0,0,0,0.50)", fontSize: "0.85rem", py: 2 }}>No assignments yet.</Typography>
  );

  // ── Overall donut (SVG) ──
  const r = 52, cx = 70, cy = 70, stroke = 18;
  const circ = 2 * Math.PI * r;
  const segments = [
    { value: completed, color: "#16a34a", label: "Done"    },
    { value: overdue,   color: "#dc2626", label: "Overdue" },
    { value: pending,   color: "#f59e0b", label: "Pending" },
  ];
  let cumOffset = 0;
  const paths = segments.map((seg) => {
    const dash = (seg.value / total) * circ;
    const offset = cumOffset;
    cumOffset += dash;
    return { ...seg, dash, gap: circ - dash, offset };
  });

  // ── Per-course pie (Chart.js) ──
  const courseCodes = [...new Set(assignments.map((a) => a.courseCode))];

  return (
    <Stack spacing={3}>
      {/* Overall donut */}
      <Box>
        <Typography sx={{ fontSize: "0.70rem", fontWeight: 900, color: "rgba(0,0,0,0.40)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
          Overall Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
            {paths.filter((p) => p.value > 0).map((p, i) => (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth={stroke}
                strokeDasharray={`${p.dash} ${p.gap}`}
                strokeDashoffset={circ / 4 - p.offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px`, transition: "stroke-dasharray 0.5s ease" }}
              />
            ))}
            <text x={cx} y={cy - 7}  textAnchor="middle" fontSize={22} fontWeight={900} fill="#111">{total}</text>
            <text x={cx} y={cy + 13} textAnchor="middle" fontSize={10} fill="#888">total</text>
          </svg>
          <Stack spacing={1}>
            {segments.map((s) => (
              <Stack key={s.label} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: s.color }} />
                <Typography sx={{ fontSize: "0.80rem", fontWeight: 700, minWidth: 68 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "0.80rem", fontWeight: 900, color: s.color }}>{s.value}</Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "rgba(0,0,0,0.35)" }}>
                  ({total > 0 ? Math.round((s.value / total) * 100) : 0}%)
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* Per-course pies with assignment hover */}
      <Box>
        <Typography sx={{ fontSize: "0.70rem", fontWeight: 900, color: "rgba(0,0,0,0.40)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
          By Course
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 2 }}>
          {courseCodes.map((code) => {
            const ca = assignments.filter((a) => a.courseCode === code);
            const done_    = ca.filter((a) => a.completed);
            const upcoming = ca.filter((a) => !a.completed && daysUntil(a.dueDate) > 2);
            const soon     = ca.filter((a) => !a.completed && daysUntil(a.dueDate) >= 0 && daysUntil(a.dueDate) <= 2);
            const overdue_ = ca.filter((a) => isPast(a.dueDate) && !a.completed);

            const allGroups = [
              { label: "Done",     items: done_,    color: "#16a34a" },
              { label: "Soon",     items: soon,     color: "#ef4444" },
              { label: "Later",    items: upcoming, color: "#f59e0b" },
              { label: "Overdue",  items: overdue_, color: "#dc2626" },
            ].filter((g) => g.items.length > 0);

            const chartData = {
              labels: allGroups.map((g) => `${g.label} (${g.items.length})`),
              datasets: [{
                data: allGroups.map((g) => g.items.length),
                backgroundColor: allGroups.map((g) => g.color + "cc"),
                borderColor:     allGroups.map((g) => g.color),
                borderWidth: 2,
                hoverOffset: 6,
              }],
            };

            const cpct = ca.length > 0 ? Math.round((done_.length / ca.length) * 100) : 0;

            return (
              <Paper key={code} elevation={0} sx={{
                borderRadius: 3, p: 1.75,
                border: `1.5px solid ${courseColor(code)}30`,
                bgcolor: `${courseColor(code)}06`,
              }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: courseColor(code) }} />
                    <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: courseColor(code) }}>{code}</Typography>
                  </Stack>
                  <Chip label={`${cpct}% done`} size="small"
                    sx={{ height: 16, fontSize: "0.64rem", fontWeight: 900,
                      bgcolor: cpct === 100 ? "#f0fdf4" : "rgba(0,0,0,0.06)",
                      color: cpct === 100 ? "#16a34a" : courseColor(code) }} />
                </Stack>

                {/* Chart.js Pie */}
                <Box sx={{ height: 130, position: "relative" }}>
                  <Pie
                    data={chartData}
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => {
                              const idx  = ctx.dataIndex;
                              const grp  = allGroups[idx];
                              const pct  = ca.length > 0 ? Math.round((grp.items.length / ca.length) * 100) : 0;
                              return [`${grp.label}: ${grp.items.length} (${pct}%)`,
                                      ...grp.items.map((a) => `  • ${a.title} (${a.points}pts)`)];
                            },
                          },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Legend */}
                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                  {allGroups.map((g) => (
                    <Stack key={g.label} direction="row" spacing={0.4} alignItems="center">
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: g.color }} />
                      <Typography sx={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.55)" }}>
                        {g.label} {Math.round((g.items.length / ca.length) * 100)}%
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                {/* Interactive assignment rows */}
                <Divider sx={{ my: 0.75 }} />
                <Stack spacing={0.3}>
                  {ca.map((a) => (
                    <AssignmentRow key={a.id} a={a} onToggleDone={onToggleDone} onToggleStar={onToggleStar} onReminder={onReminder} compact />
                  ))}
                </Stack>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}

// ─── CalendarView ─────────────────────────────────────────────────────────────
function CalendarView({
  assignments,
  exams,
  onToggleDone,
  onToggleStar,
  onReminder,
}: {
  assignments: MockAssignment[];
  exams: MockExam[];
  onToggleDone: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReminder: (a: MockAssignment) => void;
}) {
  const [cursorMonth, setCursorMonth] = React.useState(dayjs());
  const [hoveredDay, setHoveredDay] = React.useState<number | null>(null);

  const year  = cursorMonth.year();
  const month = cursorMonth.month();
  const daysInMonth = cursorMonth.daysInMonth();
  const firstDow    = cursorMonth.startOf("month").day();
  const today = dayjs();

  type CalEvent = { label: string; color: string; assignment?: MockAssignment; exam?: MockExam; title: string; detail: string };
  const eventsByDay: Record<number, CalEvent[]> = {};

  assignments.forEach((a) => {
    const d = dayjs(a.dueDate);
    if (d.month() === month && d.year() === year) {
      const day = d.date();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({
        label: a.courseCode,
        color: a.completed ? "#16a34a" : isPast(a.dueDate) ? "#dc2626" : courseColor(a.courseCode),
        assignment: a,
        title: a.title,
        detail: `${a.weight} · ${a.points}pts · ${a.completed ? "Done ✓" : isPast(a.dueDate) ? "Overdue!" : `Due in ${daysUntil(a.dueDate)}d`}`,
      });
    }
  });

  exams.forEach((e) => {
    const d = dayjs(e.date);
    if (d.month() === month && d.year() === year) {
      const day = d.date();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({
        label: `${e.courseCode} EXAM`,
        color: "#A80532",
        exam: e,
        title: e.title,
        detail: `${e.type.toUpperCase()} · ${e.location ?? "TBD"} · ${formatTimeOnly(e.date)}`,
      });
    }
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isPastDay = (day: number) => cursorMonth.date(day).isBefore(today, "day");
  const isTodayDay = (day: number) => cursorMonth.date(day).isSame(today, "day");

  return (
    <Box>
      {/* Month nav */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <IconButton size="small" onClick={() => setCursorMonth((m) => m.subtract(1, "month"))}>
          <Typography sx={{ fontSize: "1rem", color: "rgba(0,0,0,0.55)", lineHeight: 1 }}>‹</Typography>
        </IconButton>
        <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, color: "rgba(0,0,0,0.75)" }}>
          {cursorMonth.format("MMMM YYYY")}
        </Typography>
        <IconButton size="small" onClick={() => setCursorMonth((m) => m.add(1, "month"))}>
          <Typography sx={{ fontSize: "1rem", color: "rgba(0,0,0,0.55)", lineHeight: 1 }}>›</Typography>
        </IconButton>
      </Stack>

      {/* Day headers */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.25, mb: 0.4 }}>
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
          <Typography key={d} sx={{ fontSize: "0.60rem", fontWeight: 900, color: "rgba(0,0,0,0.38)", textAlign: "center" }}>{d}</Typography>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.3, position: "relative" }}>
        {cells.map((d, i) => {
          const events = d ? eventsByDay[d] ?? [] : [];
          const past   = d ? isPastDay(d) : false;
          const today_ = d ? isTodayDay(d) : false;

          return (
            <Tooltip
              key={i}
              placement="top"
              disableHoverListener={!d || events.length === 0}
              title={
                d && events.length > 0 ? (
                  <Box sx={{ maxWidth: 220 }}>
                    <Typography sx={{ fontSize: "0.75rem", fontWeight: 900, mb: 0.5 }}>
                      {cursorMonth.date(d).format("MMM D")}
                    </Typography>
                    {events.map((ev, j) => (
                      <Box key={j} sx={{ mb: 0.5 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: ev.color }} />
                          <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: ev.color }}>{ev.label}</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: "0.70rem" }}>{ev.title}</Typography>
                        <Typography sx={{ fontSize: "0.65rem", opacity: 0.75 }}>{ev.detail}</Typography>
                      </Box>
                    ))}
                  </Box>
                ) : ""
              }
            >
              <Box
                sx={{
                  minHeight: 34,
                  borderRadius: 1.5,
                  bgcolor: today_
                    ? "rgba(168,5,50,0.10)"
                    : past
                    ? "rgba(0,0,0,0.03)"
                    : events.length > 0 ? "rgba(0,0,0,0.02)" : "transparent",
                  border: today_ ? "1.5px solid #A80532" : "1.5px solid transparent",
                  opacity: past && !today_ ? 0.45 : 1,
                  p: 0.3,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  cursor: events.length > 0 ? "pointer" : "default",
                  transition: "all 0.1s",
                  "&:hover": events.length > 0 ? { bgcolor: "rgba(0,0,0,0.06)", transform: "scale(1.04)" } : {},
                }}
              >
                {d && (
                  <>
                    <Typography sx={{ fontSize: "0.65rem", fontWeight: today_ ? 900 : 500, color: today_ ? "#A80532" : past ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.70)", lineHeight: 1.4 }}>
                      {d}
                    </Typography>
                    {events.slice(0, 2).map((ev, j) => (
                      <Box key={j} sx={{ width: "82%", height: 3, borderRadius: 999, bgcolor: ev.color, mb: 0.15 }} />
                    ))}
                    {events.length > 2 && (
                      <Typography sx={{ fontSize: "0.50rem", color: "rgba(0,0,0,0.40)" }}>+{events.length - 2}</Typography>
                    )}
                  </>
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      {/* Legend */}
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.25 }}>
        {[
          { color: "#A80532", label: "Exam" },
          { color: "#f59e0b", label: "Due soon" },
          { color: "#16a34a", label: "Done" },
          { color: "#dc2626", label: "Overdue" },
        ].map((l) => (
          <Stack key={l.label} direction="row" spacing={0.4} alignItems="center">
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: l.color }} />
            <Typography sx={{ fontSize: "0.65rem", color: "rgba(0,0,0,0.50)" }}>{l.label}</Typography>
          </Stack>
        ))}
        <Typography sx={{ fontSize: "0.62rem", color: "rgba(0,0,0,0.35)", ml: "auto", fontStyle: "italic" }}>
          Hover dates for details
        </Typography>
      </Stack>
    </Box>
  );
}

// ─── ProgressView (meter + per-course bars) ───────────────────────────────────
function ProgressView({
  assignments,
  onToggleDone,
  onToggleStar,
  onReminder,
}: {
  assignments: MockAssignment[];
  onToggleDone: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReminder: (a: MockAssignment) => void;
}) {
  const total     = assignments.length;
  const completed = assignments.filter((a) => a.completed).length;
  const overallPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const courseCodes = [...new Set(assignments.map((a) => a.courseCode))];

  // Total points per category
  const totalPoints = assignments.reduce((s, a) => s + a.points, 0);
  const pointsByWeight: Record<string, number> = {};
  assignments.forEach((a) => { pointsByWeight[a.weight] = (pointsByWeight[a.weight] ?? 0) + a.points; });

  return (
    <Stack spacing={2.5} sx={{ py: 0.5 }}>
      {/* ── Master completion meter ── */}
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.75 }}>
          <Typography sx={{ fontSize: "0.80rem", fontWeight: 900 }}>Overall Completion</Typography>
          <Chip label={`${overallPct}%`} size="small"
            sx={{ height: 18, fontSize: "0.70rem", fontWeight: 900,
              bgcolor: overallPct === 100 ? "#f0fdf4" : "rgba(168,5,50,0.08)",
              color: overallPct === 100 ? "#16a34a" : "#A80532" }} />
        </Stack>
        <Box sx={{ position: "relative", height: 12, borderRadius: 999, bgcolor: "rgba(168,5,50,0.10)", overflow: "hidden" }}>
          <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${overallPct}%`,
            background: overallPct === 100 ? "#16a34a" : "linear-gradient(90deg, #A80532, #d94468)",
            borderRadius: 999, transition: "width 0.6s ease" }} />
        </Box>
        <Typography sx={{ fontSize: "0.68rem", color: "rgba(0,0,0,0.45)", mt: 0.5 }}>
          {completed} of {total} assignments done
        </Typography>
      </Box>

      <Divider />

      {/* ── Per-course meters ── */}
      <Box>
        <Typography sx={{ fontSize: "0.70rem", fontWeight: 900, color: "rgba(0,0,0,0.40)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1 }}>
          By Course
        </Typography>
        <Stack spacing={1.5}>
          {courseCodes.map((code) => {
            const ca   = assignments.filter((a) => a.courseCode === code);
            const done = ca.filter((a) => a.completed).length;
            const pct  = ca.length > 0 ? (done / ca.length) * 100 : 0;
            const color = courseColor(code);

            return (
              <Box key={code}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.4 }}>
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color }} />
                    <Typography sx={{ fontSize: "0.80rem", fontWeight: 900 }}>{code}</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.50)" }}>{done}/{ca.length}</Typography>
                    <Chip label={`${Math.round(pct)}%`} size="small"
                      sx={{ height: 15, fontSize: "0.62rem", fontWeight: 900,
                        bgcolor: pct === 100 ? "#f0fdf4" : "rgba(0,0,0,0.06)",
                        color: pct === 100 ? "#16a34a" : color }} />
                  </Stack>
                </Stack>
                <Box sx={{ position: "relative", height: 8, borderRadius: 999, bgcolor: `${color}22`, overflow: "hidden" }}>
                  <Box sx={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`,
                    bgcolor: pct === 100 ? "#16a34a" : color, borderRadius: 999, transition: "width 0.5s ease" }} />
                </Box>

                {/* Assignment list under each course */}
                <Stack spacing={0.25} sx={{ mt: 0.6, pl: 0.5 }}>
                  {ca.map((a) => (
                    <AssignmentRow key={a.id} a={a} onToggleDone={onToggleDone} onToggleStar={onToggleStar} onReminder={onReminder} compact />
                  ))}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
}

// ─── BarView — weekly stacked bar chart ───────────────────────────────────────
function BarView({ assignments }: { assignments: MockAssignment[] }) {
  const weekStart = dayjs().startOf("week");
  const labels    = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day").format("ddd M/D"));
  const courseCodes = [...new Set(assignments.map((a) => a.courseCode))];

  const datasets = courseCodes.map((code) => {
    const color = courseColor(code);
    const data = Array.from({ length: 7 }, (_, i) => {
      const day = weekStart.add(i, "day");
      return assignments
        .filter((a) => a.courseCode === code && dayjs(a.dueDate).isSame(day, "day"))
        .reduce((s, a) => s + a.points, 0);
    });
    return {
      label: code,
      data,
      backgroundColor: color + "bb",
      borderColor: color,
      borderWidth: 1.5,
      borderRadius: 4,
    };
  });

  // Build tooltip extra info
  const assignmentsByDayAndCourse: Record<string, Record<string, MockAssignment[]>> = {};
  for (let i = 0; i < 7; i++) {
    const day = weekStart.add(i, "day");
    const key = labels[i];
    assignmentsByDayAndCourse[key] = {};
    courseCodes.forEach((code) => {
      assignmentsByDayAndCourse[key][code] = assignments.filter(
        (a) => a.courseCode === code && dayjs(a.dueDate).isSame(day, "day")
      );
    });
  }

  return (
    <Box>
      <Typography sx={{ fontSize: "0.70rem", fontWeight: 900, color: "rgba(0,0,0,0.40)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
        This Week — Points Due by Day
      </Typography>
      <Box sx={{ height: 200 }}>
        <Bar
          data={{ labels, datasets }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: { font: { size: 10 }, boxWidth: 10, padding: 8 },
              },
              tooltip: {
                callbacks: {
                  title: (items) => items[0]?.label ?? "",
                  label: (ctx) => {
                    const day    = ctx.label;
                    const course = ctx.dataset.label ?? "";
                    const items  = assignmentsByDayAndCourse[day]?.[course] ?? [];
                    if (items.length === 0) return "";
                    return [
                      `${course}: ${ctx.parsed.y}pts`,
                      ...items.map((a) => `  • ${a.title} (${a.points}pts) ${a.completed ? "✓" : ""}`),
                    ];
                  },
                  afterLabel: (ctx) => {
                    const day    = ctx.label;
                    const course = ctx.dataset.label ?? "";
                    const items  = assignmentsByDayAndCourse[day]?.[course] ?? [];
                    const pct    = items.length > 0
                      ? Math.round((items.filter((a) => a.completed).length / items.length) * 100)
                      : 0;
                    return items.length > 0 ? `  Completion: ${pct}%` : "";
                  },
                },
              },
            },
            scales: {
              x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
              y: { stacked: true, ticks: { font: { size: 10 } }, title: { display: true, text: "Points", font: { size: 10 } } },
            },
          }}
        />
      </Box>
      <Typography sx={{ fontSize: "0.65rem", color: "rgba(0,0,0,0.35)", mt: 1, fontStyle: "italic" }}>
        Bar height = total points due per day. Hover a colored segment for details.
      </Typography>
    </Box>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function DueDateElement({
  assignments: propAssignments,
  exams: propExams,
  courses: propCourses,
  onToggleAssignment,
  onToggleStar: propOnToggleStar,
  expanded = false,
}: Props) {
  // Use mock data if no props provided (remove this fallback when wiring real API)
  const initialAssignments = propAssignments ?? mockAssignments;
  const exams     = propExams    ?? mockExams;
  const courses   = propCourses  ?? mockCourses;

  const { assignments, toggleDone, toggleStar } = useAssignments(initialAssignments);

  const handleToggleDone = React.useCallback((id: string) => {
    toggleDone(id);
    const a = assignments.find((x) => x.id === id);
    if (a && onToggleAssignment) onToggleAssignment(a.courseId, id);
  }, [assignments, toggleDone, onToggleAssignment]);

  const handleToggleStar = React.useCallback((id: string) => {
    toggleStar(id);
    if (propOnToggleStar) propOnToggleStar(id);
  }, [toggleStar, propOnToggleStar]);

  // Reminder dialog
  const [reminderTarget, setReminderTarget] = React.useState<MockAssignment | null>(null);

  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "list",     icon: <ViewListIcon          sx={{ fontSize: 15 }} />, label: "List"     },
    ...(expanded ? [{ mode: "pie" as ViewMode, icon: <PieChartIcon sx={{ fontSize: 15 }} />, label: "By Class" }] : []),
    { mode: "calendar", icon: <CalendarViewMonthIcon sx={{ fontSize: 15 }} />, label: "Calendar" },
    { mode: "progress", icon: <FilterListIcon        sx={{ fontSize: 15 }} />, label: "Progress" },
    ...(expanded ? [{ mode: "bar" as ViewMode, icon: <BarChartIcon sx={{ fontSize: 15 }} />, label: "Bar" }] : []),
  ];

  React.useEffect(() => {
    if (!expanded && (viewMode === "pie" || viewMode === "bar")) setViewMode("list");
  }, [expanded, viewMode]);

  const sharedProps = { assignments, onToggleDone: handleToggleDone, onToggleStar: handleToggleStar, onReminder: setReminderTarget };

  return (
    <Paper elevation={0} sx={{
      borderRadius: 4, p: 2.25,
      bgcolor: "rgba(255,255,255,0.97)",
      border: "1px solid rgba(0,0,0,0.06)",
    }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography fontWeight={950} sx={{ fontSize: "0.95rem" }}>
          {expanded ? "Due Dates & Exams" : "Tracker"}
        </Typography>
        <Stack direction="row" spacing={0.25}>
          {views.map((v) => (
            <Tooltip key={v.mode} title={v.label} placement="top">
              <IconButton size="small" onClick={() => setViewMode(v.mode)} sx={{
                p: 0.55, borderRadius: 2,
                bgcolor: viewMode === v.mode ? "#A80532" : "transparent",
                color:   viewMode === v.mode ? "#fff"    : "rgba(0,0,0,0.40)",
                "&:hover": { bgcolor: viewMode === v.mode ? "#810326" : "rgba(0,0,0,0.07)" },
                transition: "all 0.15s",
              }}>
                {v.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Stack>

      {viewMode === "list"     && <ListView     {...sharedProps} exams={exams} />}
      {viewMode === "pie"      && <PieView      {...sharedProps} />}
      {viewMode === "calendar" && <CalendarView {...sharedProps} exams={exams} />}
      {viewMode === "progress" && <ProgressView {...sharedProps} />}
      {viewMode === "bar"      && <BarView      assignments={assignments} />}

      {/* Reminder modal */}
      <ReminderDialog
        assignment={reminderTarget}
        open={Boolean(reminderTarget)}
        onClose={() => setReminderTarget(null)}
      />
    </Paper>
  );
}
