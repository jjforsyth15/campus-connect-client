"use client";

import * as React from "react";
import {
  Alert, Avatar, AvatarGroup, Box, Button, Chip, Dialog, DialogContent,
  Checkbox, Divider, FormControlLabel, IconButton, InputAdornment, Paper,
  Snackbar, Stack, Switch, TextField, Tooltip, Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import VideocamIcon from "@mui/icons-material/Videocam";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SchoolIcon from "@mui/icons-material/School";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import NotesIcon from "@mui/icons-material/StickyNote2";
import EventNoteIcon from "@mui/icons-material/EventNote";
import LockIcon from "@mui/icons-material/Lock";

import type { StudyGroup } from "../shared/constants";
import { mockStudyGroups } from "../shared/mockData";

const SPECIAL_PRIVATE_TAG = "Private" as const;

const TOPIC_TAGS = [
  "AI", "STEM", "Computer Science", "Math", "Physics", "Chemistry", "Biology", "Engineering", "Art", "Design",
  "Music", "Literature", "Writing", "History", "Psychology", "Business", "Economics", "Language", "Philosophy",
] as const;

function normalizeEmail(s: string) {
  return s.trim().toLowerCase();
}

function isValidCsunEmail(email: string) {
  const e = normalizeEmail(email);
  return /^[^\s@]+@my\.csun\.edu$/i.test(e);
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeId() { return `${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`; }
function daysUntil(iso: string) { return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000); }
function isPast(iso: string) { return new Date(iso) < new Date(); }
function formatDT(iso: string) {
  return new Date(iso).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

// ─── Sub-tab pill bar ─────────────────────────────────────────────────────────
function SubTabBar({
  active,
  counts,
  onChange,
  onCreate,
}: {
  active: number;
  counts: number[];
  onChange: (i: number) => void;
  onCreate: () => void;
}) {
  const tabs = [
    { label: "LFG", icon: <SchoolIcon sx={{ fontSize: 13 }} /> },
    { label: "My Groups",  icon: <EventNoteIcon sx={{ fontSize: 13 }} /> },
  ];
  return (
    <Stack direction="row" spacing={0.75} sx={{ mb: 2.5, flexWrap: "wrap", gap: 0.75, alignItems: "center", justifyContent: "space-between" }}>
      <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", gap: 0.75 }}>
        {tabs.map((t, i) => (
          <Box key={i} onClick={() => onChange(i)} sx={{
            display: "flex", alignItems: "center", gap: 0.6,
            px: 1.5, py: 0.6, borderRadius: 999, cursor: "pointer", userSelect: "none",
            transition: "all 0.15s",
            bgcolor: active === i ? "#fff" : "rgba(255,255,255,0.10)",
            color: active === i ? "#A80532" : "rgba(255,255,255,0.75)",
            border: active === i ? "none" : "1px solid rgba(255,255,255,0.18)",
            fontWeight: 700, fontSize: "0.80rem", fontFamily: "'DM Sans', sans-serif",
            "&:hover": { bgcolor: active === i ? "#fff" : "rgba(255,255,255,0.18)" },
          }}>
            {t.icon} {t.label}
            {counts[i] > 0 && (
              <Box sx={{ ml: 0.25, px: 0.6, py: 0.1, borderRadius: 999, fontSize: "0.60rem", fontWeight: 900, bgcolor: active === i ? "#A80532" : "rgba(255,255,255,0.22)", color: active === i ? "#fff" : "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
                {counts[i]}
              </Box>
            )}
          </Box>
        ))}
      </Stack>

      <Button variant="contained" startIcon={<AddIcon sx={{ fontSize: "14px !important" }} />} onClick={onCreate}
        sx={{ bgcolor: "#fff", color: "#A80532", fontWeight: 950, borderRadius: 999, fontSize: "0.78rem", px: 1.75, "&:hover": { bgcolor: "rgba(255,255,255,0.92)" }, flexShrink: 0, py: 0.75 }}>
        Create Group
      </Button>
    </Stack>
  );
}

// ─── Urgency chip ─────────────────────────────────────────────────────────────
function UrgencyChip({ dateTime }: { dateTime: string }) {
  const d = daysUntil(dateTime);
  if (isPast(dateTime)) return <Chip label="Past" size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "rgba(0,0,0,0.07)", color: "rgba(0,0,0,0.45)" }} />;
  if (d === 0) return <Chip label="Today!" size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#fef2f2", color: "#dc2626" }} />;
  if (d === 1) return <Chip label="Tomorrow" size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "#fffbeb", color: "#d97706" }} />;
  return <Chip label={`${d}d away`} size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 900, bgcolor: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.55)" }} />;
}

// ─── Group Card ───────────────────────────────────────────────────────────────
function GroupCard({ group, isMember, isOwner, onJoin, onLeave, onDelete, onAddToCalendar }: {
  group: StudyGroup;
  isMember: boolean;
  isOwner: boolean;
  onJoin: (g: StudyGroup) => void;
  onLeave: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToCalendar: (g: StudyGroup) => void;
}) {
  const isFull = group.maxMembers !== undefined && group.members.length >= group.maxMembers;
  const past = isPast(group.dateTime);
  const courseLabel = `${group.courseSubject || "STUDY"}${group.courseNumber ? ` ${group.courseNumber}` : ""}`.trim();

  return (
    <Paper elevation={0} sx={{
      position: "relative",
      borderRadius: 4,
      border: isMember ? "1.5px solid #bbf7d0" : "1.5px solid rgba(0,0,0,0.07)",
      bgcolor: "#fff", overflow: "hidden",
      opacity: past ? 0.72 : 1,
      transition: "box-shadow 0.2s, transform 0.2s",
      "&:hover": !past ? { boxShadow: "0 8px 28px rgba(0,0,0,0.11)", transform: "translateY(-2px)" } : {},
    }}>
      {group.isPrivate && (
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", bgcolor: "rgba(168,5,50,0.04)" }} />
      )}
      <Box sx={{ height: 3, bgcolor: "#A80532" }} />
      <Box sx={{ p: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} sx={{ mb: 1.25 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack direction="row" spacing={0.65} alignItems="center" flexWrap="wrap" sx={{ mb: 0.5 }}>
              <Chip label={courseLabel} size="small"
                sx={{ bgcolor: "#A80532", color: "#fff", fontWeight: 900, fontSize: "0.68rem", height: 20 }} />
              <Chip
                icon={group.isPrivate ? <LockIcon sx={{ fontSize: "12px !important" }} /> : undefined}
                label={group.isPrivate ? "Private" : "Public"}
                size="small"
                sx={{ height: 18, fontSize: "0.62rem", fontWeight: 900, bgcolor: group.isPrivate ? "rgba(168,5,50,0.08)" : "rgba(0,0,0,0.05)", color: group.isPrivate ? "#A80532" : "rgba(0,0,0,0.55)", "& .MuiChip-icon": { color: group.isPrivate ? "#A80532" : "rgba(0,0,0,0.45)" } }}
              />
              {isMember && (
                <Chip icon={<CheckCircleIcon sx={{ fontSize: "10px !important" }} />} label="Joined" size="small"
                  sx={{ height: 18, fontSize: "0.62rem", fontWeight: 900, bgcolor: "#f0fdf4", color: "#16a34a", "& .MuiChip-icon": { color: "#16a34a" } }} />
              )}
            </Stack>
            <Typography fontWeight={950} sx={{ fontSize: "0.95rem", lineHeight: 1.25, color: "#111" }}>{group.topic}</Typography>
            {(group.tags?.length ?? 0) > 0 && (
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 0.85, gap: 0.5 }}>
                {group.tags!.slice(0, 4).map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ height: 16, fontSize: "0.60rem", bgcolor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.55)", fontWeight: 900 }} />
                ))}
              </Stack>
            )}
          </Box>
          <UrgencyChip dateTime={group.dateTime} />
        </Stack>

        <Stack spacing={0.4} sx={{ mb: 1.25 }}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AccessTimeIcon sx={{ fontSize: 13, color: "rgba(0,0,0,0.38)" }} />
            <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.62)" }}>{formatDT(group.dateTime)}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.75} alignItems="center">
            {group.isVirtual ? <VideocamIcon sx={{ fontSize: 13, color: "rgba(0,0,0,0.38)" }} /> : <PlaceIcon sx={{ fontSize: 13, color: "rgba(0,0,0,0.38)" }} />}
            <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.62)" }}>
              {group.isVirtual && group.meetingLink
                ? <a href={group.meetingLink} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>{group.location} ↗</a>
                : group.location}
            </Typography>
          </Stack>
          {group.notes && (
            <Stack direction="row" spacing={0.75} alignItems="flex-start">
              <NotesIcon sx={{ fontSize: 13, color: "rgba(0,0,0,0.38)", mt: 0.15 }} />
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(0,0,0,0.50)", lineHeight: 1.4 }}>{group.notes}</Typography>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ mb: 1.25 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.75} alignItems="center">
            <AvatarGroup max={5} sx={{ "& .MuiAvatar-root": { width: 22, height: 22, fontSize: "0.60rem", bgcolor: "#A80532" } }}>
              {group.members.map((m) => <Avatar key={m.id}>{m.name[0]}</Avatar>)}
            </AvatarGroup>
            <Typography sx={{ fontSize: "0.70rem", color: "rgba(0,0,0,0.48)" }}>
              {group.members.length}{group.maxMembers ? `/${group.maxMembers}` : ""}
            </Typography>
            {isFull && !isMember && (
              <Chip label="Full" size="small" sx={{ height: 16, fontSize: "0.60rem", bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 900 }} />
            )}
          </Stack>

          {!past && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Add to Calendar">
                <IconButton size="small" sx={{ p: 0.5, color: "rgba(0,0,0,0.35)", "&:hover": { color: "#A80532", bgcolor: "rgba(168,5,50,0.06)" } }}
                  onClick={() => onAddToCalendar(group)}>
                  <CalendarTodayIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              {isOwner ? (
                <Tooltip title="Delete group">
                  <IconButton size="small" sx={{ p: 0.5, color: "rgba(0,0,0,0.32)", "&:hover": { color: "#dc2626", bgcolor: "rgba(220,38,38,0.06)" } }}
                    onClick={() => onDelete(group.id)}>
                    <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              ) : isMember ? (
                <Button size="small" variant="outlined" startIcon={<ExitToAppIcon sx={{ fontSize: "11px !important" }} />}
                  onClick={() => onLeave(group.id)}
                  sx={{ borderRadius: 999, fontWeight: 900, fontSize: "0.68rem", borderColor: "rgba(0,0,0,0.20)", color: "rgba(0,0,0,0.55)", px: 1, "&:hover": { borderColor: "#dc2626", color: "#dc2626" } }}>
                  Leave
                </Button>
              ) : !isFull ? (
                <Button size="small" variant="contained" startIcon={<PersonAddIcon sx={{ fontSize: "11px !important" }} />}
                  onClick={() => onJoin(group)}
                  sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 900, borderRadius: 999, fontSize: "0.70rem", px: 1.25 }}>
                  Join
                </Button>
              ) : null}
            </Stack>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}

// ─── Join Modal ───────────────────────────────────────────────────────────────
function JoinModal({ open, group, onClose, onJoin }: { open: boolean; group: StudyGroup | null; onClose: () => void; onJoin: (email: string) => void }) {
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);

  const normalized = normalizeEmail(email);
  const valid = !!normalized && isValidCsunEmail(normalized);

  React.useEffect(() => {
    if (!email.trim()) { setErr(null); return; }
    setErr(valid ? null : "Use your @my.csun.edu email.");
  }, [email, valid]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
      <Box sx={{ bgcolor: "#A80532", px: 3, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.05rem" }}>Join Study Group</Typography>
            {group && <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.80rem", mt: 0.15 }}>{group.topic}</Typography>}
          </Box>
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.80)" }}><CloseIcon /></IconButton>
        </Stack>
      </Box>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <TextField
            size="small"
            label="Your CSUN Email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!err}
            helperText={err ?? "Must end in @my.csun.edu"}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            variant="contained"
            disabled={!valid}
            onClick={() => { onJoin(normalized); onClose(); setEmail(""); setErr(null); }}
            sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.1 }}>
            Join Group
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────
function CreateModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (g: StudyGroup) => void }) {
  const [subject, setSubject] = React.useState("");
  const [number, setNumber] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [dateTime, setDateTime] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [isVirtual, setIsVirtual] = React.useState(false);
  const [meetingLink, setMeetingLink] = React.useState("");
  const [maxMembers, setMaxMembers] = React.useState("8");
  const [notes, setNotes] = React.useState("");
  const [creatorEmail, setCreatorEmail] = React.useState("");
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [inviteInput, setInviteInput] = React.useState("");
  const [invitedEmails, setInvitedEmails] = React.useState<string[]>([]);
  const [inviteError, setInviteError] = React.useState<string | null>(null);

  const canSubmit = topic.trim() && dateTime && (isVirtual ? meetingLink.trim() : location.trim()) && isValidCsunEmail(creatorEmail) && (!isPrivate || invitedEmails.length > 0);

  const addInvite = (raw: string) => {
    const email = normalizeEmail(raw);
    if (!email) return;
    if (!isValidCsunEmail(email)) {
      setInviteError("Each member must be a valid @my.csun.edu email.");
      return;
    }
    setInviteError(null);
    setInvitedEmails((prev) => (prev.includes(email) ? prev : [...prev, email]));
  };

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleCreate = () => {
    if (!canSubmit) return;
    const newGroup: StudyGroup = {
      id: makeId(),
      courseSubject: subject.trim() ? subject.toUpperCase() : "STUDY",
      courseNumber: number.trim(),
      topic: topic.trim(),
      tags: tags.length ? tags : undefined,
      dateTime: new Date(dateTime).toISOString(),
      location: isVirtual ? (location || "Virtual") : location.trim(),
      isVirtual,
      meetingLink: isVirtual ? meetingLink.trim() : undefined,
      members: [{ id: makeId(), name: normalizeEmail(creatorEmail) }],
      createdBy: normalizeEmail(creatorEmail),
      createdAt: new Date().toISOString(),
      maxMembers: Number(maxMembers) || 8,
      notes: notes.trim() || undefined,
      isPrivate,
      invitedEmails: isPrivate ? invitedEmails : undefined,
    };
    onCreate(newGroup);
    onClose();
    setSubject(""); setNumber(""); setTopic(""); setTags([]); setDateTime(""); setLocation("");
    setIsVirtual(false); setMeetingLink(""); setMaxMembers("8"); setNotes(""); setCreatorEmail("");
    setIsPrivate(false); setInviteInput(""); setInvitedEmails([]); setInviteError(null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4, overflow: "hidden" } }}>
      <Box sx={{ bgcolor: "#A80532", px: 3, py: 2.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <GroupsIcon sx={{ color: "#fff", fontSize: 22 }} />
            <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.1rem" }}>Create Study Group</Typography>
          </Stack>
          <IconButton onClick={onClose} sx={{ color: "rgba(255,255,255,0.80)" }}><CloseIcon /></IconButton>
        </Stack>
        <Typography sx={{ color: "rgba(255,255,255,0.70)", fontSize: "0.80rem", mt: 0.4 }}>Sessions auto-expire 3 days after the meeting date.</Typography>
      </Box>
      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={1.75}>
          <TextField size="small" label="Group Title *" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder='e.g. "Midterm Review — Chapter 5-9"' sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
            {TOPIC_TAGS.map((t) => (
              <Chip
                key={t}
                label={t}
                size="small"
                clickable
                onClick={() => toggleTag(t)}
                sx={{ height: 20, fontSize: "0.68rem", fontWeight: 900, bgcolor: tags.includes(t) ? "rgba(168,5,50,0.08)" : "rgba(0,0,0,0.04)", color: tags.includes(t) ? "#A80532" : "rgba(0,0,0,0.55)", "&:hover": { bgcolor: tags.includes(t) ? "rgba(168,5,50,0.12)" : "rgba(0,0,0,0.06)" } }}
              />
            ))}
          </Stack>
          <Stack direction="row" spacing={1}>
            <TextField size="small" label="Subject" value={subject} onChange={(e) => setSubject(e.target.value.toUpperCase())} placeholder="COMP" sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField size="small" label="Number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="333" sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          </Stack>
          <TextField size="small" label="Your CSUN Email *" value={creatorEmail} onChange={(e) => setCreatorEmail(e.target.value)} error={!!creatorEmail && !isValidCsunEmail(creatorEmail)} helperText={creatorEmail && !isValidCsunEmail(creatorEmail) ? "Must end in @my.csun.edu" : ""} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          <Stack direction="row" spacing={1.25}>
            <TextField size="small" label="Date & Time *" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ flex: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            <TextField size="small" label="Max Members" type="number" value={maxMembers} onChange={(e) => setMaxMembers(e.target.value)} sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          </Stack>
          <FormControlLabel
            control={<Switch checked={isVirtual} onChange={(e) => setIsVirtual(e.target.checked)} sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#A80532" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#A80532" } }} />}
            label={<Typography sx={{ fontSize: "0.88rem", fontWeight: 700 }}>Virtual meeting</Typography>}
          />
          {isVirtual
            ? <TextField size="small" label="Meeting Link *" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://csun.zoom.us/j/…" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
            : <TextField size="small" label="Location *" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Oviatt Library — Room 2" sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          }

          <FormControlLabel
            control={<Checkbox checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} />}
            label={<Typography sx={{ fontSize: "0.88rem", fontWeight: 700 }}>Private group</Typography>}
          />

          {isPrivate && (
            <Stack spacing={1}>
              <TextField
                size="small"
                label="Members (emails end in @my.csun.edu)"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addInvite(inviteInput);
                    setInviteInput("");
                  }
                }}
                onBlur={() => {
                  if (inviteInput.trim()) {
                    addInvite(inviteInput);
                    setInviteInput("");
                  }
                }}
                error={!!inviteError}
                helperText={inviteError ?? "Press Enter to add each email."}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              {invitedEmails.length > 0 && (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                  {invitedEmails.map((e) => (
                    <Chip
                      key={e}
                      label={e}
                      size="small"
                      onDelete={() => setInvitedEmails((prev) => prev.filter((x) => x !== e))}
                      sx={{ height: 20, fontSize: "0.68rem", fontWeight: 900, bgcolor: "rgba(0,0,0,0.04)", color: "rgba(0,0,0,0.70)" }}
                    />
                  ))}
                </Stack>
              )}
            </Stack>
          )}
          <TextField size="small" label="Session Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
          <Button variant="contained" disabled={!canSubmit} onClick={handleCreate} startIcon={<GroupsIcon />}
            sx={{ bgcolor: "#A80532", "&:hover": { bgcolor: "#810326" }, fontWeight: 950, borderRadius: 999, py: 1.2 }}>
            Create Study Group
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function StudyGroupsPanel() {
  const [groups, setGroups] = React.useState<StudyGroup[]>(mockStudyGroups);
  const [myGroupIds, setMyGroupIds] = React.useState<string[]>(["sg1"]);
  const [myHostIds, setMyHostIds] = React.useState<string[]>([]);
  const [joinTarget, setJoinTarget] = React.useState<StudyGroup | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [subTab, setSubTab] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterMode, setFilterMode] = React.useState<"all" | "virtual" | "in-person">("all");
  const [tagFilters, setTagFilters] = React.useState<string[]>([]);
  const [toast, setToast] = React.useState<string | null>(null);

  const filterGroups = (list: StudyGroup[]) => {
    let filtered = list;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((g) =>
        `${g.courseSubject} ${g.courseNumber} ${g.topic} ${g.notes ?? ""} ${(g.tags ?? []).join(" ")}`.toLowerCase().includes(q)
      );
    }
    if (tagFilters.includes(SPECIAL_PRIVATE_TAG)) {
      filtered = filtered.filter((g) => !!g.isPrivate);
    }
    const normalTags = tagFilters.filter((t) => t !== SPECIAL_PRIVATE_TAG);
    if (normalTags.length) {
      filtered = filtered.filter((g) => (g.tags ?? []).some((t) => normalTags.includes(t)));
    }
    if (filterMode === "virtual") filtered = filtered.filter((g) => g.isVirtual);
    if (filterMode === "in-person") filtered = filtered.filter((g) => !g.isVirtual);
    return filtered;
  };

  const toggleTagFilter = (t: string) => {
    setTagFilters((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const lfgGroups = filterGroups(groups.filter((g) => !g.isPrivate));
  const myGroups = filterGroups(groups.filter((g) => myGroupIds.includes(g.id)));
  const displayed = subTab === 0 ? lfgGroups : myGroups;

  const handleJoin = (email: string) => {
    if (!joinTarget) return;
    setGroups((prev) => prev.map((g) => {
      if (g.id !== joinTarget.id) return g;
      if (g.members.some((m) => normalizeEmail(m.name) === normalizeEmail(email))) return g;
      return { ...g, members: [...g.members, { id: makeId(), name: normalizeEmail(email) }] };
    }));
    setMyGroupIds((prev) => [...prev, joinTarget.id]);
    setToast(`Joined "${joinTarget.topic}"!`);
  };

  const handleCreate = (g: StudyGroup) => {
    setGroups((prev) => [g, ...prev]);
    setMyGroupIds((prev) => [...prev, g.id]);
    setMyHostIds((prev) => [...prev, g.id]);
    setToast(`Created "${g.topic}"!`);
  };

  const handleLeave = (id: string) => {
    setMyGroupIds((prev) => prev.filter((i) => i !== id));
    setToast("Left study group.");
  };

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setMyGroupIds((prev) => prev.filter((i) => i !== id));
    setMyHostIds((prev) => prev.filter((i) => i !== id));
    setToast("Study group deleted.");
  };

  const handleAddToCalendar = (g: StudyGroup) => {
    const start = new Date(g.dateTime);
    const end = new Date(start.getTime() + 90 * 60000);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(g.topic)}&dates=${start.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z/${end.toISOString().replace(/[-:]/g, "").slice(0, 15)}Z&location=${encodeURIComponent(g.isVirtual ? (g.meetingLink ?? g.location) : g.location)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setToast("Opening Google Calendar…");
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Box>
          <Typography fontWeight={950} sx={{ color: "#fff", fontSize: "1.15rem", lineHeight: 1.2 }}>Study Groups</Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", mt: 0.25 }}>
            {groups.length} active · join with your school email
          </Typography>
        </Box>
      </Stack>

      <SubTabBar active={subTab} counts={[lfgGroups.length, myGroups.length]} onChange={setSubTab} onCreate={() => setCreateOpen(true)} />

      <Paper elevation={0} sx={{ borderRadius: 3, p: 1.75, mb: 2.5, bgcolor: "rgba(0,0,0,0.20)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}>
        <TextField fullWidth size="small" placeholder="Search by course, topic, or keyword…"
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: "rgba(255,255,255,0.45)" }} /></InputAdornment> }}
          sx={{ mb: 1.25, "& .MuiOutlinedInput-root": { bgcolor: "rgba(255,255,255,0.08)", color: "#fff", borderRadius: 2, "& fieldset": { borderColor: "rgba(255,255,255,0.18)" } }, "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.45)", opacity: 1 } }}
        />
        <Stack direction="row" spacing={0.6} flexWrap="wrap" sx={{ gap: 0.6 }}>
          {(["all", "virtual", "in-person"] as const).map((f) => (
            <Chip key={f} label={f === "all" ? "All" : f === "virtual" ? "Virtual" : "In-Person"} size="small" clickable onClick={() => setFilterMode(f)}
              sx={{ fontWeight: 900, fontSize: "0.68rem", bgcolor: filterMode === f ? "#fff" : "rgba(255,255,255,0.10)", color: filterMode === f ? "#A80532" : "rgba(255,255,255,0.72)", "&:hover": { bgcolor: filterMode === f ? "#fff" : "rgba(255,255,255,0.18)" } }} />
          ))}

          {subTab === 1 && (
            <Chip
              label={SPECIAL_PRIVATE_TAG}
              size="small"
              clickable
              onClick={() => toggleTagFilter(SPECIAL_PRIVATE_TAG)}
              sx={{ fontWeight: 900, fontSize: "0.68rem", bgcolor: tagFilters.includes(SPECIAL_PRIVATE_TAG) ? "#fff" : "rgba(255,255,255,0.10)", color: tagFilters.includes(SPECIAL_PRIVATE_TAG) ? "#A80532" : "rgba(255,255,255,0.72)", "&:hover": { bgcolor: tagFilters.includes(SPECIAL_PRIVATE_TAG) ? "#fff" : "rgba(255,255,255,0.18)" } }}
            />
          )}

          {TOPIC_TAGS.map((t) => (
            <Chip
              key={t}
              label={t}
              size="small"
              clickable
              onClick={() => toggleTagFilter(t)}
              sx={{ fontWeight: 900, fontSize: "0.66rem", bgcolor: tagFilters.includes(t) ? "#fff" : "rgba(255,255,255,0.10)", color: tagFilters.includes(t) ? "#A80532" : "rgba(255,255,255,0.72)", "&:hover": { bgcolor: tagFilters.includes(t) ? "#fff" : "rgba(255,255,255,0.18)" } }}
            />
          ))}
        </Stack>
      </Paper>

      {displayed.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, bgcolor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", textAlign: "center" }}>
          <GroupsIcon sx={{ fontSize: 38, color: "rgba(255,255,255,0.28)", mb: 1.5 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.80)", fontWeight: 900 }}>
            {subTab === 1 ? "You haven't joined any groups yet." : "No study groups found."}
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.45)", mt: 0.5, fontSize: "0.85rem" }}>
            {subTab === 1 ? "Browse all groups or create your own!" : "Try clearing your search or create the first one!"}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 1.75, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {displayed.map((g) => (
            <GroupCard key={g.id} group={g}
              isMember={myGroupIds.includes(g.id)} isOwner={myHostIds.includes(g.id)}
              onJoin={(grp) => setJoinTarget(grp)} onLeave={handleLeave} onDelete={handleDelete} onAddToCalendar={handleAddToCalendar}
            />
          ))}
        </Box>
      )}

      <JoinModal open={Boolean(joinTarget)} group={joinTarget} onClose={() => setJoinTarget(null)} onJoin={handleJoin} />
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <Snackbar open={!!toast} autoHideDuration={4000} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" sx={{ borderRadius: 3, fontWeight: 700 }}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
