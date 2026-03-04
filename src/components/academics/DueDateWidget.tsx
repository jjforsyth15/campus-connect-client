"use client";

import * as React from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import type { Assignment, ExamItem } from "./constants";
import { daysUntil, isPast, formatDateOnly, formatTimeOnly } from "./utils";

type Props = {
  assignments: Array<Assignment & { courseCode: string }>;
  exams: Array<ExamItem & { courseCode: string }>;
  onToggleAssignment: (courseId: string, assignmentId: string) => void;
  courses: Array<{ id: string; subject: string; number: string }>;
};

function urgencyColor(d: number, completed?: boolean) {
  if (completed) return "#16a34a";
  if (d < 0) return "#9ca3af";
  if (d === 0) return "#dc2626";
  if (d <= 2) return "#dc2626";
  if (d <= 5) return "#d97706";
  return "#6b7280";
}

export default function DueDateWidget({ assignments, exams, onToggleAssignment, courses }: Props) {
  const [showPast, setShowPast] = React.useState(false);

  const upcomingAssignments = assignments.filter((a) => !isPast(a.dueDate) || a.completed === false);
  const upcomingExams = exams.filter((e) => !isPast(e.date));
  const pastExams = exams.filter((e) => isPast(e.date));
  const overdueAssignments = assignments.filter((a) => isPast(a.dueDate) && !a.completed);

  const getCourseId = (courseCode: string) => {
    const [subj, num] = courseCode.split(" ");
    return courses.find((c) => c.subject === subj && c.number === num)?.id ?? "";
  };

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
        <Typography fontWeight={950} sx={{ fontSize: "1rem" }}>
          Due Dates & Exams
        </Typography>
        <Chip
          label={`${overdueAssignments.length} overdue`}
          size="small"
          sx={{
            display: overdueAssignments.length ? "flex" : "none",
            bgcolor: "#fef2f2",
            color: "#dc2626",
            fontWeight: 900,
            fontSize: "0.72rem",
          }}
        />
      </Stack>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <>
          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
            <AccessAlarmIcon sx={{ fontSize: 15, color: "#d97706" }} />
            <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "#d97706", textTransform: "uppercase", letterSpacing: 1 }}>
              Upcoming Exams
            </Typography>
          </Stack>
          <Stack spacing={0.65} sx={{ mb: 1.5 }}>
            {upcomingExams.map((e) => {
              const d = daysUntil(e.date);
              return (
                <Stack key={e.id} direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 3,
                      height: 32,
                      borderRadius: 999,
                      bgcolor: d <= 3 ? "#d97706" : "#e5e7eb",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 900, lineHeight: 1.2 }}>{e.title}</Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: "rgba(0,0,0,0.55)" }}>
                      {e.courseCode} · {formatDateOnly(e.date)} {formatTimeOnly(e.date)}
                      {e.location ? ` · ${e.location}` : ""}
                    </Typography>
                  </Box>
                  <Chip
                    label={d === 0 ? "Today!" : `${d}d`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      bgcolor: d <= 3 ? "#fffbeb" : "rgba(0,0,0,0.06)",
                      color: urgencyColor(d),
                      flexShrink: 0,
                    }}
                  />
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ my: 1.25 }} />
        </>
      )}

      {/* Assignments */}
      <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.75 }}>
        <MenuBookIcon sx={{ fontSize: 15, color: "#A80532" }} />
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 900, color: "#A80532", textTransform: "uppercase", letterSpacing: 1 }}>
          Assignments
        </Typography>
      </Stack>
      <Stack spacing={0.5}>
        {assignments.length === 0 && (
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.50)", fontStyle: "italic" }}>
            No assignments tracked yet.
          </Typography>
        )}
        {assignments
          .filter((a) => !isPast(a.dueDate) || !a.completed)
          .slice(0, showPast ? 999 : 6)
          .map((a) => {
            const d = daysUntil(a.dueDate);
            const overdue = isPast(a.dueDate) && !a.completed;
            const courseId = getCourseId(a.courseCode);
            return (
              <Stack key={a.id} direction="row" spacing={1} alignItems="center">
                <IconButton
                  size="small"
                  sx={{ p: 0.25 }}
                  onClick={() => courseId && onToggleAssignment(courseId, a.id)}
                >
                  {a.completed
                    ? <CheckCircleIcon sx={{ color: "#16a34a", fontSize: 19 }} />
                    : <RadioButtonUncheckedIcon sx={{ color: "rgba(0,0,0,0.30)", fontSize: 19 }} />}
                </IconButton>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      textDecoration: a.completed ? "line-through" : "none",
                      color: a.completed ? "rgba(0,0,0,0.40)" : overdue ? "#dc2626" : "rgba(0,0,0,0.82)",
                      lineHeight: 1.2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.50)" }}>
                    {a.courseCode} · Due {formatDateOnly(a.dueDate)}
                  </Typography>
                </Box>
                {!a.completed && (
                  <Chip
                    label={overdue ? "Overdue" : d === 0 ? "Today!" : `${d}d`}
                    size="small"
                    sx={{
                      height: 17,
                      fontSize: "0.68rem",
                      fontWeight: 900,
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

      {assignments.filter((a) => !isPast(a.dueDate) || !a.completed).length > 6 && (
        <Typography
          onClick={() => setShowPast((p) => !p)}
          sx={{ fontSize: "0.82rem", color: "#A80532", fontWeight: 900, cursor: "pointer", mt: 1 }}
        >
          {showPast ? "Show less" : `Show all ${assignments.length}`}
        </Typography>
      )}
    </Paper>
  );
}
