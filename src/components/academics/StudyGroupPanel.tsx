"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import GroupsIcon from "@mui/icons-material/Groups";
import PlaceIcon from "@mui/icons-material/Place";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BookIcon from "@mui/icons-material/Book";
import type { StudyGroup } from "./constants";
import { btnPrimary, btnGhost, btnOutlineRed, fieldSx, fieldSxLight } from "./AcademicsStates";
import { formatDate, daysUntil, isPast } from "./utils";

type Props = {
  studyGroups: StudyGroup[];
  sgFormOpen: boolean;
  setSgFormOpen: (v: boolean) => void;
  sgCourse: string; setSgCourse: (v: string) => void;
  sgTopic: string; setSgTopic: (v: string) => void;
  sgDateTime: string; setSgDateTime: (v: string) => void;
  sgLocation: string; setSgLocation: (v: string) => void;
  sgIsVirtual: boolean; setSgIsVirtual: (v: boolean) => void;
  sgMeetingLink: string; setSgMeetingLink: (v: string) => void;
  sgMaxMembers: string; setSgMaxMembers: (v: string) => void;
  sgNotes: string; setSgNotes: (v: string) => void;
  sgCreator: string; setSgCreator: (v: string) => void;
  onCreate: () => void;
  onJoin: (groupId: string, name: string) => void;
};

export default function StudyGroupPanel({
  studyGroups, sgFormOpen, setSgFormOpen,
  sgCourse, setSgCourse, sgTopic, setSgTopic,
  sgDateTime, setSgDateTime, sgLocation, setSgLocation,
  sgIsVirtual, setSgIsVirtual, sgMeetingLink, setSgMeetingLink,
  sgMaxMembers, setSgMaxMembers, sgNotes, setSgNotes,
  sgCreator, setSgCreator,
  onCreate, onJoin,
}: Props) {
  const [joinName, setJoinName] = React.useState("");
  const [joiningId, setJoiningId] = React.useState<string | null>(null);

  const upcoming = studyGroups.filter((g) => !isPast(g.dateTime));
  const past = studyGroups.filter((g) => isPast(g.dateTime));

  return (
    <>
      {/* Header */}
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
            <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>
              Study Group Planner
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
              Create study sessions, invite classmates, and save events to your calendar.
              {/* TODO (backend – Supabase): Persist groups in study_groups table and fetch on load */}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setSgFormOpen(true)}
            sx={btnPrimary}
          >
            Create Study Group
          </Button>
        </Stack>
      </Paper>

      {/* Upcoming groups */}
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
        {upcoming.length === 0 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)", gridColumn: "1/-1" }}>
            <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900 }}>No upcoming study groups yet.</Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.65)", mt: 0.5 }}>Create one above to get started!</Typography>
          </Paper>
        )}
        {upcoming.map((g) => <StudyGroupCard key={g.id} group={g} onJoin={onJoin} joinName={joinName} setJoinName={setJoinName} joiningId={joiningId} setJoiningId={setJoiningId} />)}
      </Box>

      {past.length > 0 && (
        <>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontWeight: 900, fontSize: "0.85rem", mt: 3, mb: 1.5, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Past Sessions
          </Typography>
          <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
            {past.map((g) => (
              <StudyGroupCard key={g.id} group={g} onJoin={onJoin} joinName={joinName} setJoinName={setJoinName} joiningId={joiningId} setJoiningId={setJoiningId} isPast />
            ))}
          </Box>
        </>
      )}

      {/* Create Study Group Modal */}
      <Dialog open={sgFormOpen} onClose={() => setSgFormOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ pb: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontWeight={950} sx={{ fontSize: "1.1rem" }}>Create Study Group</Typography>
            <IconButton onClick={() => setSgFormOpen(false)}><CloseIcon /></IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField
              size="small"
              label="Your Name *"
              placeholder="Alex Rivera"
              value={sgCreator}
              onChange={(e) => setSgCreator(e.target.value)}
              sx={fieldSxLight}
            />
            <TextField
              size="small"
              label="Course (Subject + Number) *"
              placeholder="COMP 333"
              value={sgCourse}
              onChange={(e) => setSgCourse(e.target.value.toUpperCase())}
              sx={fieldSxLight}
            />
            <TextField
              size="small"
              label="Study Topic *"
              placeholder='E.g. "Midterm Review – Chapter 5-9"'
              value={sgTopic}
              onChange={(e) => setSgTopic(e.target.value)}
              sx={fieldSxLight}
            />
            <TextField
              size="small"
              label="Date & Time *"
              type="datetime-local"
              value={sgDateTime}
              onChange={(e) => setSgDateTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={fieldSxLight}
            />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <FormControlLabel
                control={
                  <Switch
                    checked={sgIsVirtual}
                    onChange={(e) => setSgIsVirtual(e.target.checked)}
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#A80532" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#A80532" } }}
                  />
                }
                label="Virtual meeting"
              />
            </Stack>
            <TextField
              size="small"
              label={sgIsVirtual ? "Meeting Link" : "Location *"}
              placeholder={sgIsVirtual ? "https://zoom.us/j/..." : "Oviatt Library – Room 2"}
              value={sgIsVirtual ? sgMeetingLink : sgLocation}
              onChange={(e) => sgIsVirtual ? setSgMeetingLink(e.target.value) : setSgLocation(e.target.value)}
              sx={fieldSxLight}
            />
            {sgIsVirtual && (
              <TextField
                size="small"
                label="Location label (optional)"
                placeholder="Zoom"
                value={sgLocation}
                onChange={(e) => setSgLocation(e.target.value)}
                sx={fieldSxLight}
              />
            )}
            <TextField
              size="small"
              label="Max Members"
              type="number"
              value={sgMaxMembers}
              onChange={(e) => setSgMaxMembers(e.target.value)}
              sx={fieldSxLight}
            />
            <TextField
              size="small"
              label="Session notes (optional)"
              placeholder="Bring your typed notes from lectures 1-7…"
              value={sgNotes}
              onChange={(e) => setSgNotes(e.target.value)}
              multiline
              minRows={2}
              sx={fieldSxLight}
            />
            {/*
              TODO (backend – Supabase): On submit, insert into study_groups table:
              - study_groups (id, course_subject, course_number, topic, date_time, location, is_virtual, meeting_link, max_members, notes, created_by, created_at)
              - study_group_members (id, group_id, user_id, joined_at)
              Then emit a calendar event or push notification to members.
            */}
            <Button variant="contained" onClick={onCreate} sx={btnPrimary} startIcon={<GroupsIcon />}>
              Create & Save
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StudyGroupCard({
  group, onJoin, joinName, setJoinName, joiningId, setJoiningId, isPast: past,
}: {
  group: StudyGroup;
  onJoin: (id: string, name: string) => void;
  joinName: string;
  setJoinName: (v: string) => void;
  joiningId: string | null;
  setJoiningId: (v: string | null) => void;
  isPast?: boolean;
}) {
  const d = daysUntil(group.dateTime);
  const isFull = group.maxMembers != null && group.members.length >= group.maxMembers;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 4,
        p: 2.25,
        bgcolor: "rgba(255,255,255,0.96)",
        border: "1px solid rgba(0,0,0,0.06)",
        opacity: past ? 0.7 : 1,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="flex-start" justifyContent="space-between">
        <Box>
          <Chip
            label={`${group.courseSubject} ${group.courseNumber}`}
            size="small"
            sx={{ bgcolor: "#A80532", color: "#fff", fontWeight: 900, fontSize: "0.72rem", mb: 0.75 }}
          />
          <Typography fontWeight={950} sx={{ fontSize: "0.98rem", lineHeight: 1.2 }}>{group.topic}</Typography>
        </Box>
        {!past && (
          <Chip
            label={d === 0 ? "Today!" : d < 0 ? "Past" : `${d}d`}
            size="small"
            sx={{ bgcolor: d <= 1 ? "#fef2f2" : "rgba(0,0,0,0.06)", color: d <= 1 ? "#dc2626" : "rgba(0,0,0,0.60)", fontWeight: 900, fontSize: "0.72rem", flexShrink: 0 }}
          />
        )}
      </Stack>

      <Stack spacing={0.4} sx={{ mt: 1.25, mb: 1.25 }}>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <AccessTimeIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }} />
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.70)" }}>
            {new Date(group.dateTime).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          {group.isVirtual ? <VideocamIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }} /> : <PlaceIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.45)" }} />}
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.70)" }}>
            {group.isVirtual && group.meetingLink ? (
              <a href={group.meetingLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 700 }}>
                {group.location || "Virtual Meeting"}
              </a>
            ) : group.location}
          </Typography>
        </Stack>
        {group.notes && (
          <Stack direction="row" spacing={0.75} alignItems="flex-start">
            <BookIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.45)", mt: 0.15 }} />
            <Typography sx={{ fontSize: "0.82rem", color: "rgba(0,0,0,0.60)" }}>{group.notes}</Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <AvatarGroup max={4} sx={{ "& .MuiAvatar-root": { width: 26, height: 26, fontSize: "0.72rem", bgcolor: "#A80532" } }}>
            {group.members.map((m) => (
              <Avatar key={m.id} sx={{ bgcolor: "#A80532" }}>{m.name[0]}</Avatar>
            ))}
          </AvatarGroup>
          <Typography sx={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.55)" }}>
            {group.members.length}{group.maxMembers ? `/${group.maxMembers}` : ""} members
          </Typography>
          {isFull && <Chip label="Full" size="small" sx={{ height: 16, fontSize: "0.66rem", bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 900 }} />}
        </Stack>
        {!past && !isFull && (
          joiningId === group.id ? (
            <Stack direction="row" spacing={0.75}>
              <TextField
                size="small"
                placeholder="Your name"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                sx={{ width: 130, "& .MuiOutlinedInput-root": { fontSize: "0.82rem" } }}
              />
              <Button
                size="small"
                variant="contained"
                sx={btnPrimary}
                onClick={() => { onJoin(group.id, joinName); setJoiningId(null); setJoinName(""); }}
              >
                Join
              </Button>
              <IconButton size="small" onClick={() => setJoiningId(null)}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
            </Stack>
          ) : (
            <Button size="small" variant="outlined" sx={btnOutlineRed} startIcon={<GroupsIcon />} onClick={() => setJoiningId(group.id)}>
              Join
            </Button>
          )
        )}
      </Stack>
    </Paper>
  );
}
