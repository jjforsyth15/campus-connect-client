"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
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
import type { CourseItem } from "./constants";
import { btnPrimary, btnDark, btnOutlineRed, btnOutlineGray } from "./constants";
import { rmpSearchUrl } from "./utils";

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
          <Typography variant="overline" sx={{ letterSpacing: 2.3, fontWeight: 950, color: "#A80532", fontSize: "0.72rem" }}>
            {code}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 950, mt: 0.25, mb: 0.65, lineHeight: 1.15, fontSize: "1.08rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={title}>
            {title}
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", fontSize: "0.92rem" }}>
            with <strong>{professor}</strong>{" "}
            <a href={rmpSearchUrl(professor)} target="_blank" rel="noreferrer" style={{ marginLeft: 10, fontWeight: 900, color: "#2563EB", textDecoration: "none" }}>RMP</a>
            <br />
            <span style={{ opacity: 0.9 }}>{semesterLabel}</span>
          </Typography>
        </Box>
        <Stack spacing={1} alignItems="flex-end">
          <Chip label={`${course.notes.length} notes`} size="small" sx={{ borderRadius: 999, bgcolor: "#A80532", color: "#fff", fontWeight: 900 }} />
          <Chip label={`${course.resources.length} uploads`} size="small" variant="outlined" sx={{ borderRadius: 999, borderColor: "rgba(168,5,50,0.35)", color: "#A80532", fontWeight: 900 }} />
        </Stack>
      </Stack>
      <Divider sx={{ my: 1.75 }} />
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <Button variant="outlined" onClick={onOpenNotes} startIcon={<NotesIcon />} sx={btnOutlineRed}>Add Notes</Button>
        <Button variant="outlined" onClick={onOpenSearch} startIcon={<SearchRoundedIcon />} sx={btnOutlineGray}>Search Notes</Button>
        <Button variant="contained" onClick={() => typeof window !== "undefined" && window.open(rmpSearchUrl(professor), "_blank", "noopener,noreferrer")} startIcon={<ThumbUpAltRoundedIcon />} sx={btnPrimary}>Rate Professor</Button>
        <Tooltip title="View description + prereqs (best-effort from CSUN API)">
          <Button variant="contained" onClick={onOpenPrereqs} startIcon={<InfoOutlinedIcon />} sx={btnDark}>View Description</Button>
        </Tooltip>
        <Button variant="contained" onClick={onOpenResources} startIcon={<UploadFileIcon />} sx={btnDark}>Upload</Button>
        <Button variant="outlined" onClick={onOpenPrereqs} startIcon={<AccountTreeOutlinedIcon />} sx={btnOutlineGray}>Prereqs</Button>
      </Stack>
    </Paper>
  );
}