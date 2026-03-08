"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ViewListIcon from "@mui/icons-material/ViewList";
import PieChartIcon from "@mui/icons-material/PieChart";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import type { Assignment, ExamItem } from "../shared/constants";
import { daysUntil, isPast, formatDateOnly, formatTimeOnly } from "../shared/utils";

// When expanded=false (sidebar): only "list" | "calendar" | "progress"
// When expanded=true  (Due Dates tab): also "pie"
type ViewMode = "list" | "pie" | "calendar" | "progress";

type Props = {
  assignments: Array<Assignment & { courseCode: string }>;
  exams: Array<ExamItem & { courseCode: string }>;
  onToggleAssignment: (courseId: string, assignmentId: string) => void;
  courses: Array<{ id: string; subject: string; number: string }>;
  expanded?: boolean; // true on Due Dates tab (full page)
};

function urgencyColor(d: number, completed?: boolean) {
  if (completed) return "#16a34a";
  if (d < 0) return "#9ca3af";
  if (d === 0) return "#dc2626";
  if (d <= 2) return "#dc2626";
  if (d <= 5) return "#d97706";
  return "#6b7280";
}

// ─── Pie / Summary chart ──────────────────────────────────────────────────────
// Only rendered when expanded=true (Due Dates tab)
function PieView({
  assignments,
  courses,
}: {
  assignments: Array<Assignment & { courseCode: string }>;
  courses: Array<{ id: string; subject: string; number: string }>;
}) {
  const total = assignments.length;
  const completed = assignments.filter((a) => a.completed).length;
  const overdue  = assignments.filter((a) => isPast(a.dueDate) && !a.completed).length;
  const pending  = total - completed - overdue;

  if (total === 0) {
    return (
      <Typography sx={{ color: "rgba(0,0,0,0.50)", fontSize: "0.85rem", py: 2 }}>
        No assignments yet.
      </Typography>
    );
  }

  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  // ── Overall donut ──
  const r = 52, cx = 70, cy = 70, stroke = 18;
  const circ = 2 * Math.PI * r;

  const segments = [
    { value: completed, color: "#16a34a", label: "Completed" },
    { value: overdue,   color: "#dc2626", label: "Overdue"   },
    { value: pending,   color: "#d97706", label: "Pending"   },
  ];

  let cumOffset = 0;
  const paths = segments.map((seg) => {
    const dash   = (seg.value / total) * circ;
    const gap    = circ - dash;
    const offset = cumOffset;
    cumOffset += dash;
    return { ...seg, dash, gap, offset };
  });

  // ── Per-course breakdown ──
  const courseCodes = [...new Set(assignments.map((a) => a.courseCode))];
  const perCourse = courseCodes.map((code) => {
    const ca  = assignments.filter((a) => a.courseCode === code);
    const c   = ca.filter((a) => a.completed).length;
    const o   = ca.filter((a) => isPast(a.dueDate) && !a.completed).length;
    const p   = ca.length - c - o;
    return { code, total: ca.length, completed: c, overdue: o, pending: p };
  });

  return (
    <Stack spacing={3}>
      {/* ── Overall donut + legend ── */}
      <Box>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: "rgba(0,0,0,0.45)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
          Overall Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <svg width={140} height={140} viewBox="0 0 140 140">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth={stroke} />
            {paths.filter((p) => p.value > 0).map((p, i) => (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={p.color}
                strokeWidth={stroke}
                strokeDasharray={`${p.dash} ${p.gap}`}
                strokeDashoffset={circ / 4 - p.offset}
                style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }}
              />
            ))}
            <text x={cx} y={cy - 7}  textAnchor="middle" fontSize={22} fontWeight={900} fill="#111">{total}</text>
            <text x={cx} y={cy + 13} textAnchor="middle" fontSize={10} fill="#888">total</text>
          </svg>

          <Stack spacing={1}>
            {segments.map((s) => (
              <Stack key={s.label} direction="row" spacing={1} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: 2, bgcolor: s.color, flexShrink: 0 }} />
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, minWidth: 76 }}>{s.label}</Typography>
                <Typography sx={{ fontSize: "0.82rem", fontWeight: 900, color: s.color }}>{s.value}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.35)" }}>({pct(s.value)}%)</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      <Divider />

      {/* ── Per-course donut grid ── */}
      <Box>
        <Typography sx={{ fontSize: "0.72rem", fontWeight: 900, color: "rgba(0,0,0,0.45)", letterSpacing: 1.5, textTransform: "uppercase", mb: 1.5 }}>
          By Course
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 1.5 }}>
          {perCourse.map((c) => {
            const courseCirc = 2 * Math.PI * 28;
            const cSegs = [
              { value: c.completed, color: "#16a34a" },
              { value: c.overdue,   color: "#dc2626"  },
              { value: c.pending,   color: "#d97706"  },
            ];
            let cCum = 0;
            const cPaths = cSegs.map((s) => {
              const dash = c.total > 0 ? (s.value / c.total) * courseCirc : 0;
              const offset = cCum;
              cCum += dash;
              return { ...s, dash, gap: courseCirc - dash, offset };
            });
            const cpct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;

            return (
              <Paper
                key={c.code}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: 1.5,
                  bgcolor: "rgba(168,5,50,0.03)",
                  border: "1.5px solid rgba(168,5,50,0.10)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                {/* Mini donut */}
                <svg width={64} height={64} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
                  <circle cx={32} cy={32} r={28} fill="none" stroke="#f3f4f6" strokeWidth={8} />
                  {cPaths.filter((p) => p.value > 0).map((p, i) => (
                    <circle
                      key={i}
                      cx={32} cy={32} r={28}
                      fill="none"
                      stroke={p.color}
                      strokeWidth={8}
                      strokeDasharray={`${p.dash} ${p.gap}`}
                      strokeDashoffset={courseCirc / 4 - p.offset}
                      style={{ transform: "rotate(-90deg)", transformOrigin: "32px 32px" }}
                    />
                  ))}
                  <text x={32} y={29} textAnchor="middle" fontSize={11} fontWeight={900} fill="#111">{cpct}%</text>
                  <text x={32} y={41} textAnchor="middle" fontSize={8}  fill="#888">done</text>
                </svg>

                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "#A80532", letterSpacing: 0.5 }}>
                    {c.code}
                  </Typography>
                  <Stack spacing={0.2} sx={{ mt: 0.4 }}>
                    {c.completed > 0 && (
                      <Typography sx={{ fontSize: "0.70rem", color: "#16a34a", fontWeight: 700 }}>
                        ✓ {c.completed} done
                      </Typography>
                    )}
                    {c.pending > 0 && (
                      <Typography sx={{ fontSize: "0.70rem", color: "#d97706", fontWeight: 700 }}>
                        ◷ {c.pending} pending
                      </Typography>
                    )}
                    {c.overdue > 0 && (
                      <Typography sx={{ fontSize: "0.70rem", color: "#dc2626", fontWeight: 900 }}>
                        ⚠ {c.overdue} overdue
                      </Typography>
                    )}
                    {c.total === 0 && (
                      <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>
                        No tasks
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Stack>
  );
}

// ─── Calendar block view ──────────────────────────────────────────────────────
function CalendarView({
  assignments,
  exams,
}: {
  assignments: Array<Assignment & { courseCode: string }>;
  exams: Array<ExamItem & { courseCode: string }>;
}) {
  const now = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow    = new Date(year, month, 1).getDay();

  const eventsByDay: Record<number, { label: string; color: string }[]> = {};

  assignments.forEach((a) => {
    const d = new Date(a.dueDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({
        label: `${a.courseCode} HW`,
        color: a.completed ? "#16a34a" : isPast(a.dueDate) ? "#dc2626" : "#d97706",
      });
    }
  });

  exams.forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push({ label: `${e.courseCode} ${e.type.toUpperCase()}`, color: "#A80532" });
    }
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthName = now.toLocaleString(undefined, { month: "long", year: "numeric" });

  return (
    <Box>
      <Typography sx={{ fontSize: "0.82rem", fontWeight: 900, mb: 1, color: "rgba(0,0,0,0.70)" }}>
        {monthName}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.25, mb: 0.5 }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <Typography key={d} sx={{ fontSize: "0.65rem", fontWeight: 900, color: "rgba(0,0,0,0.40)", textAlign: "center" }}>
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.25 }}>
        {cells.map((d, i) => {
          const events  = d ? eventsByDay[d] ?? [] : [];
          const isToday = d === now.getDate();
          return (
            <Box
              key={i}
              sx={{
                minHeight: 32,
                borderRadius: 1.5,
                bgcolor: isToday ? "rgba(168,5,50,0.10)" : events.length ? "rgba(0,0,0,0.03)" : "transparent",
                border: isToday ? "1.5px solid #A80532" : "1.5px solid transparent",
                p: 0.25,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {d && (
                <>
                  <Typography sx={{ fontSize: "0.68rem", fontWeight: isToday ? 900 : 500, color: isToday ? "#A80532" : "rgba(0,0,0,0.65)", lineHeight: 1.4 }}>
                    {d}
                  </Typography>
                  {events.slice(0, 2).map((ev, j) => (
                    <Box key={j} sx={{ width: "80%", height: 3, borderRadius: 999, bgcolor: ev.color, mb: 0.15 }} />
                  ))}
                  {events.length > 2 && (
                    <Typography sx={{ fontSize: "0.55rem", color: "rgba(0,0,0,0.40)" }}>
                      +{events.length - 2}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
        {[
          { color: "#A80532", label: "Exam"    },
          { color: "#d97706", label: "HW due"  },
          { color: "#16a34a", label: "Done"    },
          { color: "#dc2626", label: "Overdue" },
        ].map((l) => (
          <Stack key={l.label} direction="row" spacing={0.5} alignItems="center">
            <Box sx={{ width: 8, height: 8, borderRadius: 999, bgcolor: l.color }} />
            <Typography sx={{ fontSize: "0.68rem", color: "rgba(0,0,0,0.50)" }}>{l.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

// ─── Progress bars per course ─────────────────────────────────────────────────
function ProgressView({
  assignments,
  courses,
}: {
  assignments: Array<Assignment & { courseCode: string }>;
  courses: Array<{ id: string; subject: string; number: string }>;
}) {
  const byCourse: Record<string, { total: number; done: number }> = {};
  for (const a of assignments) {
    if (!byCourse[a.courseCode]) byCourse[a.courseCode] = { total: 0, done: 0 };
    byCourse[a.courseCode].total++;
    if (a.completed) byCourse[a.courseCode].done++;
  }

  const entries = Object.entries(byCourse);
  if (entries.length === 0) {
    return (
      <Typography sx={{ color: "rgba(0,0,0,0.50)", fontSize: "0.85rem", py: 2 }}>
        No assignments yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ py: 0.5 }}>
      {entries.map(([code, { total, done }]) => {
        const pct = total > 0 ? (done / total) * 100 : 0;
        return (
          <Box key={code}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 900 }}>{code}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.55)" }}>{done}/{total} done</Typography>
                <Chip
                  label={`${Math.round(pct)}%`}
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    bgcolor: pct === 100 ? "#f0fdf4" : "rgba(0,0,0,0.06)",
                    color:   pct === 100 ? "#16a34a" : "#A80532",
                  }}
                />
              </Stack>
            </Stack>
            <Box sx={{ position: "relative", height: 8, borderRadius: 999, bgcolor: "rgba(168,5,50,0.10)", overflow: "hidden" }}>
              <Box sx={{
                position: "absolute", left: 0, top: 0,
                height: "100%", width: `${pct}%`,
                bgcolor: pct === 100 ? "#16a34a" : "#A80532",
                borderRadius: 999,
                transition: "width 0.5s ease",
              }} />
            </Box>
            {/* Mini assignment list */}
            {assignments.filter((a) => a.courseCode === code).map((a) => {
              const d      = daysUntil(a.dueDate);
              const overdue = isPast(a.dueDate) && !a.completed;
              return (
                <Stack key={a.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.4, pl: 0.5 }}>
                  <Typography sx={{
                    fontSize: "0.75rem",
                    color: a.completed ? "rgba(0,0,0,0.35)" : overdue ? "#dc2626" : "rgba(0,0,0,0.65)",
                    textDecoration: a.completed ? "line-through" : "none",
                    flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", mr: 1,
                  }}>
                    {a.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.68rem", color: urgencyColor(d, a.completed), fontWeight: 900, flexShrink: 0 }}>
                    {a.completed ? "✓" : overdue ? "Overdue" : d === 0 ? "Today" : `${d}d`}
                  </Typography>
                </Stack>
              );
            })}
          </Box>
        );
      })}
    </Stack>
  );
}

//  List view 
function ListView({
  assignments, exams, onToggleAssignment, courses,
}: {
  assignments: Array<Assignment & { courseCode: string }>;
  exams: Array<ExamItem & { courseCode: string }>;
  onToggleAssignment: (courseId: string, assignmentId: string) => void;
  courses: Array<{ id: string; subject: string; number: string }>;
}) {
  const [showAll, setShowAll] = React.useState(false);
  const overdueAssignments = assignments.filter((a) => isPast(a.dueDate) && !a.completed);
  const upcomingExams      = exams.filter((e) => !isPast(e.date));

  const getCourseId = (courseCode: string) => {
    const [subj, num] = courseCode.split(" ");
    return courses.find((c) => c.subject === subj && c.number === num)?.id ?? "";
  };

  const visibleAssignments = showAll ? assignments : assignments.slice(0, 6);

  return (
    <>
      {overdueAssignments.length > 0 && (
        <Chip
          label={`${overdueAssignments.length} overdue`}
          size="small"
          sx={{ mb: 1.25, bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 900, fontSize: "0.72rem" }}
        />
      )}

      {upcomingExams.length > 0 && (
        <>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
            <AccessAlarmIcon sx={{ fontSize: 14, color: "#d97706" }} />
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 900, color: "#d97706", textTransform: "uppercase", letterSpacing: 1 }}>
              Upcoming Exams
            </Typography>
          </Stack>
          <Stack spacing={0.65} sx={{ mb: 1.5 }}>
            {upcomingExams.map((e) => {
              const d = daysUntil(e.date);
              return (
                <Stack key={e.id} direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 3, height: 30, borderRadius: 999, bgcolor: d <= 3 ? "#d97706" : "#e5e7eb", flexShrink: 0 }} />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 900, lineHeight: 1.2 }}>{e.title}</Typography>
                    <Typography sx={{ fontSize: "0.73rem", color: "rgba(0,0,0,0.50)" }}>
                      {e.courseCode} · {formatDateOnly(e.date)} {formatTimeOnly(e.date)}{e.location ? ` · ${e.location}` : ""}
                    </Typography>
                  </Box>
                  <Chip
                    label={d === 0 ? "Today!" : `${d}d`}
                    size="small"
                    sx={{ height: 17, fontSize: "0.68rem", fontWeight: 900, bgcolor: d <= 3 ? "#fffbeb" : "rgba(0,0,0,0.06)", color: urgencyColor(d), flexShrink: 0 }}
                  />
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ my: 1.25 }} />
        </>
      )}

      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
        <MenuBookIcon sx={{ fontSize: 14, color: "#A80532" }} />
        <Typography sx={{ fontSize: "0.75rem", fontWeight: 900, color: "#A80532", textTransform: "uppercase", letterSpacing: 1 }}>
          Assignments
        </Typography>
      </Stack>

      {assignments.length === 0 && (
        <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.45)", fontStyle: "italic" }}>
          No assignments tracked yet.
        </Typography>
      )}

      <Stack spacing={0.5}>
        {visibleAssignments.map((a) => {
          const d       = daysUntil(a.dueDate);
          const overdue = isPast(a.dueDate) && !a.completed;
          const courseId = getCourseId(a.courseCode);
          return (
            <Stack key={a.id} direction="row" spacing={1} alignItems="center">
              <IconButton size="small" sx={{ p: 0.25 }} onClick={() => courseId && onToggleAssignment(courseId, a.id)}>
                {a.completed
                  ? <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 18 }} />
                  : <RadioButtonUncheckedIcon sx={{ color: "rgba(0,0,0,0.28)", fontSize: 18 }} />}
              </IconButton>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{
                  fontSize: "0.85rem", fontWeight: 700,
                  textDecoration: a.completed ? "line-through" : "none",
                  color: a.completed ? "rgba(0,0,0,0.38)" : overdue ? "#dc2626" : "rgba(0,0,0,0.82)",
                  lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {a.title}
                </Typography>
                <Typography sx={{ fontSize: "0.72rem", color: "rgba(0,0,0,0.46)" }}>
                  {a.courseCode} · Due {formatDateOnly(a.dueDate)}
                </Typography>
              </Box>
              {!a.completed && (
                <Chip
                  label={overdue ? "Overdue" : d === 0 ? "Today!" : `${d}d`}
                  size="small"
                  sx={{
                    height: 16, fontSize: "0.66rem", fontWeight: 900,
                    bgcolor: overdue ? "#fef2f2" : d <= 1 ? "#fef2f2" : d <= 5 ? "#fffbeb" : "rgba(0,0,0,0.05)",
                    color: urgencyColor(d, a.completed),
                    flexShrink: 0,
                  }}
                />
              )}
            </Stack>
          );
        })}
      </Stack>

      {assignments.length > 6 && (
        <Typography
          onClick={() => setShowAll((p) => !p)}
          sx={{ fontSize: "0.80rem", color: "#A80532", fontWeight: 900, cursor: "pointer", mt: 1 }}
        >
          {showAll ? "Show less" : `Show all ${assignments.length}`}
        </Typography>
      )}
    </>
  );
}

// Main Element
export default function DueDateElement({
  assignments,
  exams,
  onToggleAssignment,
  courses,
  expanded = false,
}: Props) {
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const views: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "list",     icon: <ViewListIcon          sx={{ fontSize: 16 }} />, label: "List"     },
    ...(expanded
      ? [{ mode: "pie" as ViewMode, icon: <PieChartIcon sx={{ fontSize: 16 }} />, label: "Summary" }]
      : []),
    { mode: "calendar", icon: <CalendarViewMonthIcon sx={{ fontSize: 16 }} />, label: "Calendar" },
    { mode: "progress", icon: <BarChartIcon          sx={{ fontSize: 16 }} />, label: "Progress" },
  ];

  // If we switch from expanded→sidebar and viewMode is "pie", fall back to "list"
  React.useEffect(() => {
    if (!expanded && viewMode === "pie") setViewMode("list");
  }, [expanded, viewMode]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 2.25,
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography fontWeight={950} sx={{ fontSize: "0.95rem" }}>
          {expanded ? "Due Dates & Exams" : "Tracker"}
        </Typography>

        {/* View-mode toggles */}
        <Stack direction="row" spacing={0.25}>
          {views.map((v) => (
            <Tooltip key={v.mode} title={v.label} placement="top">
              <IconButton
                size="small"
                onClick={() => setViewMode(v.mode)}
                sx={{
                  p: 0.6,
                  borderRadius: 2,
                  bgcolor: viewMode === v.mode ? "#A80532" : "transparent",
                  color:   viewMode === v.mode ? "#fff"    : "rgba(0,0,0,0.45)",
                  "&:hover": { bgcolor: viewMode === v.mode ? "#810326" : "rgba(0,0,0,0.07)" },
                  transition: "all 0.15s",
                }}
              >
                {v.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Stack>

      {viewMode === "list"     && <ListView     assignments={assignments} exams={exams} onToggleAssignment={onToggleAssignment} courses={courses} />}
      {viewMode === "pie"      && <PieView      assignments={assignments} courses={courses} />}
      {viewMode === "calendar" && <CalendarView assignments={assignments} exams={exams} />}
      {viewMode === "progress" && <ProgressView assignments={assignments} courses={courses} />}
    </Paper>
  );
}
