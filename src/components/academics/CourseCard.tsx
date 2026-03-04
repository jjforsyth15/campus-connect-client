"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/StickyNote2";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ComputerIcon from "@mui/icons-material/Computer";
import type { CourseItem } from "./constants";
import { btnPrimary, btnDark, btnOutlineRed, btnOutlineGray } from "./constants";
import { rmpSearchUrl, fmt12 } from "./utils";

type Props = {
  semesterLabel: string;
  course: CourseItem;
  onOpenNotes: () => void;
  onOpenSearch: () => void;
  onOpenResources: () => void;
  onOpenPrereqs: () => void;
};

export default function CourseCard({
  semesterLabel,
  course,
  onOpenNotes,
  onOpenSearch,
  onOpenResources,
  onOpenPrereqs,
}: Props) {
  const code = `${course.subject.toUpperCase()} ${course.number}`;
  const title = course.title || "Course title (not loaded)";
  const professor = course.professor || "Professor (unknown)";

  const totalAssignments = course.assignments?.length ?? 0;
  const completedAssignments = course.assignments?.filter((a) => a.completed).length ?? 0;
  const progress = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  const scheduleStr =
    course.isOnline
      ? "Online"
      : course.days?.length
      ? `${course.days.join("/")} ${fmt12(course.startTime ?? "")}–${fmt12(course.endTime ?? "")}`
      : null;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 2.25,
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        minHeight: 230,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: "0 8px 32px rgba(168,5,50,0.10)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="overline" sx={{ letterSpacing: 2.3, fontWeight: 950, color: "#A80532", fontSize: "0.72rem" }}>
              {code}
            </Typography>
            {course.units && (
              <Chip label={`${course.units} units`} size="small" sx={{ height: 18, fontSize: "0.7rem", bgcolor: "rgba(168,5,50,0.08)", color: "#A80532", fontWeight: 900 }} />
            )}
          </Stack>
          <Typography
            variant="h6"
            sx={{ fontWeight: 950, mt: 0.25, mb: 0.5, lineHeight: 1.15, fontSize: "1.05rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={title}
          >
            {title}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", fontSize: "0.9rem", lineHeight: 1.5 }}>
            with <strong>{professor}</strong>{" "}
            <a href={rmpSearchUrl(professor)} target="_blank" rel="noreferrer" style={{ marginLeft: 8, fontWeight: 900, color: "#2563EB", textDecoration: "none", fontSize: "0.85rem" }}>RMP ↗</a>
          </Typography>
          {scheduleStr && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.4 }}>
              {course.isOnline ? (
                <ComputerIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.50)" }} />
              ) : (
                <AccessTimeIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.50)" }} />
              )}
              <Typography sx={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.55)" }}>{scheduleStr}</Typography>
            </Stack>
          )}
        </Box>
        <Stack spacing={0.75} alignItems="flex-end" sx={{ flexShrink: 0 }}>
          <Chip
            label={`${course.notes.length} notes`}
            size="small"
            sx={{ borderRadius: 999, bgcolor: "#A80532", color: "#fff", fontWeight: 900, fontSize: "0.72rem" }}
          />
          <Chip
            label={`${course.resources.length} files`}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 999, borderColor: "rgba(168,5,50,0.35)", color: "#A80532", fontWeight: 900, fontSize: "0.72rem" }}
          />
        </Stack>
      </Stack>

      {/* Assignment progress bar */}
      {totalAssignments > 0 && (
        <Box sx={{ mt: 1.5, mb: 0.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.4 }}>
            <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.60)", fontWeight: 700 }}>
              Assignments
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", color: completedAssignments === totalAssignments ? "#16a34a" : "rgba(0,0,0,0.55)", fontWeight: 900 }}>
              {completedAssignments}/{totalAssignments}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              borderRadius: 999,
              height: 5,
              bgcolor: "rgba(168,5,50,0.12)",
              "& .MuiLinearProgress-bar": { bgcolor: progress === 100 ? "#16a34a" : "#A80532", borderRadius: 999 },
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />

      <Stack direction="row" flexWrap="wrap" gap={0.85}>
        <Button variant="outlined" onClick={onOpenNotes} startIcon={<NotesIcon />} size="small" sx={btnOutlineRed}>
          Add Notes
        </Button>
        <Button variant="outlined" onClick={onOpenSearch} startIcon={<SearchRoundedIcon />} size="small" sx={btnOutlineGray}>
          Search
        </Button>
        <Button
          variant="contained"
          onClick={() => typeof window !== "undefined" && window.open(rmpSearchUrl(professor), "_blank", "noopener,noreferrer")}
          startIcon={<ThumbUpAltRoundedIcon />}
          size="small"
          sx={btnPrimary}
        >
          Rate Prof
        </Button>
        <Tooltip title="View description + prereqs">
          <Button variant="contained" onClick={onOpenPrereqs} startIcon={<InfoOutlinedIcon />} size="small" sx={btnDark}>
            Info
          </Button>
        </Tooltip>
        <Button variant="contained" onClick={onOpenResources} startIcon={<UploadFileIcon />} size="small" sx={btnDark}>
          Upload
        </Button>
        <Button variant="outlined" onClick={onOpenPrereqs} startIcon={<AccountTreeOutlinedIcon />} size="small" sx={btnOutlineGray}>
          Prereqs
        </Button>
      </Stack>
    </Paper>
  );
}
