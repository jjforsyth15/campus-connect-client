"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import ComputerIcon from "@mui/icons-material/Computer";
import type { UniCartClass, UniCartProfile } from "./constants";
import { btnPrimary, btnOutlineGray, btnOutlineRed, fieldSx, selectSx } from "./AcademicsStates";
import { timesConflict, fmt12 } from "./utils";

type Props = {
  cartClasses: UniCartClass[];
  cartSemester: string;
  setCartSemester: (v: string) => void;
  cartModeFilter: "all" | "online" | "in-person";
  setCartModeFilter: (v: "all" | "online" | "in-person") => void;
  classSearchQuery: string;
  setClassSearchQuery: (v: string) => void;
  filteredClassLibrary: UniCartClass[];
  matchedProfiles: UniCartProfile[];
  onAddToCart: (cls: UniCartClass) => void;
  onRemoveFromCart: (id: string) => void;
};

const SEMESTERS = ["Spring 2026", "Fall 2026", "Spring 2027"];

/** Returns list of conflict pairs within a cart */
function findConflicts(classes: UniCartClass[]): Array<[string, string]> {
  const conflicts: Array<[string, string]> = [];
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const a = classes[i], b = classes[j];
      if (!a.isOnline && !b.isOnline && timesConflict(a.days, a.startTime, a.endTime, b.days, b.startTime, b.endTime)) {
        conflicts.push([a.id, b.id]);
      }
    }
  }
  return conflicts;
}

/** Returns how many shared classes two carts have */
function sharedClasses(userCart: UniCartClass[], profile: UniCartProfile): UniCartClass[] {
  return userCart.filter((c) => profile.classes.some((pc) => pc.id === c.id));
}

export default function UniCartPanel({
  cartClasses, cartSemester, setCartSemester,
  cartModeFilter, setCartModeFilter,
  classSearchQuery, setClassSearchQuery,
  filteredClassLibrary, matchedProfiles,
  onAddToCart, onRemoveFromCart,
}: Props) {
  const conflicts = findConflicts(cartClasses);
  const conflictIds = new Set(conflicts.flat());
  const totalUnits = cartClasses.reduce((sum, c) => sum + c.units, 0);

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
              UniCart – Class Matching
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
              Build your semester cart, detect schedule conflicts, and find classmates taking the same courses.
              {/* TODO (backend): Replace mock class library with live CSUN SOLAR/class search API */}
              {/* TODO (backend): Wire matchedProfiles to real user profiles from Supabase */}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: "rgba(255,255,255,0.70)" }}>Semester</InputLabel>
              <Select value={cartSemester} label="Semester" onChange={(e) => setCartSemester(String(e.target.value))} sx={selectSx}>
                {SEMESTERS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mt: 2 }} alignItems={{ md: "center" }}>
          <TextField
            size="small"
            placeholder="Search classes (subject, number, title, professor)…"
            value={classSearchQuery}
            onChange={(e) => setClassSearchQuery(e.target.value)}
            sx={{ ...fieldSx, flex: 1 }}
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          />
          <ToggleButtonGroup
            value={cartModeFilter}
            exclusive
            size="small"
            onChange={(_, v) => v && setCartModeFilter(v)}
            sx={{
              bgcolor: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              "& .MuiToggleButton-root": { color: "rgba(255,255,255,0.70)", fontWeight: 900, border: "none", textTransform: "none", px: 1.5 },
              "& .Mui-selected": { color: "#fff", bgcolor: "rgba(255,255,255,0.16) !important" },
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="in-person">In Person</ToggleButton>
            <ToggleButton value="online">Online</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "1fr 380px" } }}>
        {/* Class Library */}
        <Box>
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900, mb: 1.25, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 1.2 }}>
            Class Library — {cartSemester}
          </Typography>
          <Stack spacing={1.25}>
            {filteredClassLibrary.length === 0 && (
              <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>No classes match your filters.</Typography>
              </Paper>
            )}
            {filteredClassLibrary.map((cls) => {
              const inCart = cartClasses.some((c) => c.id === cls.id);
              const hasConflictWithCart = !cls.isOnline && cartClasses.some(
                (c) => !c.isOnline && c.id !== cls.id && timesConflict(c.days, c.startTime, c.endTime, cls.days, cls.startTime, cls.endTime)
              );
              return (
                <Paper
                  key={cls.id}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    p: 1.75,
                    bgcolor: "rgba(255,255,255,0.96)",
                    border: hasConflictWithCart ? "1.5px solid #f97316" : "1px solid rgba(0,0,0,0.06)",
                    transition: "box-shadow 0.15s",
                    "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.12)" },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                        <Typography sx={{ fontWeight: 950, color: "#A80532", fontSize: "0.82rem", letterSpacing: 1.5 }}>
                          {cls.subject} {cls.number}
                        </Typography>
                        <Chip label={`${cls.units} units`} size="small" sx={{ height: 16, fontSize: "0.68rem", bgcolor: "rgba(168,5,50,0.08)", color: "#A80532", fontWeight: 900 }} />
                        {cls.isOnline
                          ? <Chip icon={<ComputerIcon sx={{ fontSize: 11 }} />} label="Online" size="small" sx={{ height: 16, fontSize: "0.68rem", bgcolor: "rgba(37,99,235,0.08)", color: "#2563eb", fontWeight: 900, "& .MuiChip-icon": { color: "inherit" } }} />
                          : null}
                        {cls.seatsAvailable === 0
                          ? <Chip label="Full" size="small" sx={{ height: 16, fontSize: "0.68rem", bgcolor: "#fef2f2", color: "#dc2626", fontWeight: 900 }} />
                          : cls.seatsAvailable != null && cls.seatsAvailable <= 5
                          ? <Chip label={`${cls.seatsAvailable} left`} size="small" sx={{ height: 16, fontSize: "0.68rem", bgcolor: "#fffbeb", color: "#d97706", fontWeight: 900 }} />
                          : null}
                        {hasConflictWithCart && (
                          <Chip icon={<WarningAmberIcon sx={{ fontSize: 11 }} />} label="Time Conflict" size="small" sx={{ height: 16, fontSize: "0.68rem", bgcolor: "#fff7ed", color: "#f97316", fontWeight: 900, "& .MuiChip-icon": { color: "inherit" } }} />
                        )}
                      </Stack>
                      <Typography fontWeight={950} sx={{ fontSize: "0.95rem", mt: 0.3 }}>{cls.title}</Typography>
                      <Typography sx={{ fontSize: "0.83rem", color: "rgba(0,0,0,0.62)" }}>
                        {cls.professor}
                        {!cls.isOnline && cls.days.length ? ` · ${cls.days.join("/")} ${fmt12(cls.startTime)}–${fmt12(cls.endTime)}` : ""}
                        {` · §${cls.section}`}
                      </Typography>
                    </Box>
                    <Tooltip title={inCart ? "Already in cart" : cls.seatsAvailable === 0 ? "Section full" : "Add to cart"}>
                      <span>
                        <Button
                          variant={inCart ? "outlined" : "contained"}
                          size="small"
                          startIcon={inCart ? <CheckCircleOutlineIcon /> : <AddShoppingCartIcon />}
                          onClick={() => !inCart && onAddToCart(cls)}
                          disabled={inCart || cls.seatsAvailable === 0}
                          sx={inCart ? btnOutlineGray : btnPrimary}
                        >
                          {inCart ? "Added" : "Add"}
                        </Button>
                      </span>
                    </Tooltip>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Box>

        {/* Right column: Cart + Matches */}
        <Box>
          {/* Cart */}
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900, mb: 1.25, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 1.2 }}>
            My Cart ({cartClasses.length} classes · {totalUnits} units)
          </Typography>
          <Paper elevation={0} sx={{ borderRadius: 3, p: 1.75, bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(0,0,0,0.06)", mb: 2.5, minHeight: 100 }}>
            {cartClasses.length === 0 ? (
              <Typography sx={{ color: "rgba(0,0,0,0.50)", fontStyle: "italic", fontSize: "0.9rem" }}>
                Your cart is empty. Add classes from the library.
              </Typography>
            ) : (
              <Stack spacing={0.85}>
                {cartClasses.map((cls) => (
                  <Stack key={cls.id} direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 4, height: 30, borderRadius: 999, bgcolor: conflictIds.has(cls.id) ? "#f97316" : "#A80532", flexShrink: 0 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={950} sx={{ fontSize: "0.88rem" }}>{cls.subject} {cls.number} — {cls.title}</Typography>
                      <Typography sx={{ fontSize: "0.76rem", color: "rgba(0,0,0,0.55)" }}>
                        {cls.isOnline ? "Online" : `${cls.days.join("/")} ${fmt12(cls.startTime)}–${fmt12(cls.endTime)}`} · {cls.units}u
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {conflictIds.has(cls.id) && (
                        <Tooltip title="Schedule conflict with another cart class">
                          <WarningAmberIcon sx={{ fontSize: 16, color: "#f97316" }} />
                        </Tooltip>
                      )}
                      <Button size="small" onClick={() => onRemoveFromCart(cls.id)} sx={{ minWidth: 0, p: 0.5, color: "rgba(0,0,0,0.40)", "&:hover": { color: "#dc2626" } }}>
                        <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                      </Button>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
            {conflicts.length > 0 && (
              <Alert severity="warning" sx={{ mt: 1.5, borderRadius: 2, fontSize: "0.82rem" }}>
                {conflicts.length} schedule conflict{conflicts.length > 1 ? "s" : ""} detected in your cart.
              </Alert>
            )}
          </Paper>

          {/* Matched classmates */}
          <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 900, mb: 1.25, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: 1.2 }}>
            Matching Students
          </Typography>
          {/* TODO (backend): Query Supabase for users whose class selections overlap with cartClasses */}
          <Stack spacing={1.25}>
            {cartClasses.length === 0 ? (
              <Paper elevation={0} sx={{ borderRadius: 3, p: 1.75, bgcolor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>Add classes to see matching classmates.</Typography>
              </Paper>
            ) : (
              matchedProfiles
                .map((p) => ({ profile: p, shared: sharedClasses(cartClasses, p) }))
                .filter(({ shared }) => shared.length > 0)
                .sort((a, b) => b.shared.length - a.shared.length)
                .map(({ profile, shared }) => (
                  <Paper key={profile.id} elevation={0} sx={{ borderRadius: 3, p: 1.5, bgcolor: "rgba(255,255,255,0.96)", border: "1px solid rgba(0,0,0,0.06)" }}>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Avatar sx={{ width: 34, height: 34, bgcolor: "#A80532", fontWeight: 950, fontSize: "0.9rem" }}>
                        {profile.name[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={950} sx={{ fontSize: "0.92rem" }}>{profile.name}</Typography>
                        <Typography sx={{ fontSize: "0.78rem", color: "rgba(0,0,0,0.55)" }}>
                          {profile.major} · {profile.year}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${shared.length} shared`}
                        size="small"
                        sx={{ bgcolor: "rgba(168,5,50,0.10)", color: "#A80532", fontWeight: 900, fontSize: "0.72rem" }}
                      />
                    </Stack>
                    <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mt: 1 }}>
                      {shared.map((cls) => (
                        <Chip key={cls.id} label={`${cls.subject} ${cls.number}`} size="small" sx={{ height: 18, fontSize: "0.7rem", bgcolor: "rgba(168,5,50,0.07)", color: "#A80532", fontWeight: 900 }} />
                      ))}
                    </Stack>
                  </Paper>
                ))
            )}
            {cartClasses.length > 0 && matchedProfiles.every((p) => sharedClasses(cartClasses, p).length === 0) && (
              <Paper elevation={0} sx={{ borderRadius: 3, p: 1.75, bgcolor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <Typography sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.88rem" }}>No matching classmates found for your current cart.</Typography>
              </Paper>
            )}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
