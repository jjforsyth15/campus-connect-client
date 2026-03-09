"use client";

import * as React from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { Box, Typography, Chip, Button, Snackbar, Alert, Tooltip } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { SRC_EVENTS, CalEvent } from "./icsData";

dayjs.extend(isBetween);

const RED = "#A80532";

function isActive(event: CalEvent): boolean {
  const now = dayjs();
  const start = dayjs(event.dtstart);
  const end = dayjs(event.dtend);
  return now.isBetween(start, end, "day", "[]");
}

export default function EventsBanner() {
  const [added, setAdded] = React.useState<Set<string>>(new Set());
  const [toast, setToast] = React.useState<string | null>(null);

  const activeEvents = SRC_EVENTS.filter(isActive);
  const upcomingEvents = SRC_EVENTS.filter((e) => dayjs(e.dtstart).isAfter(dayjs()));
  const displayEvents = [...activeEvents, ...upcomingEvents.filter((e) => !activeEvents.includes(e))];

  async function handleAdd(event: CalEvent) {
    // ─────────────────────────────────────────────────────────────────
    // BACKEND TODO: POST to your events/calendar API endpoint:
    //   await fetch("/api/events", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       type: "src-event",
    //       uid: event.uid,
    //       summary: event.summary,
    //       dtstart: event.dtstart,
    //       dtend: event.dtend,
    //       location: event.location,
    //       url: event.url,
    //     }),
    //   });
    // ─────────────────────────────────────────────────────────────────
    setAdded((prev) => new Set(prev).add(event.uid));
    setToast(`"${event.summary}" added to your events!`);
  }

  if (displayEvents.length === 0) return null;

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
        <CalendarMonthIcon sx={{ fontSize: 18, color: "rgba(255,255,255,0.5)" }} />
        <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "1rem" }}>Upcoming SRC Events</Typography>
        <Chip
          label={`${displayEvents.length} events`}
          size="small"
          sx={{
            fontSize: 10, height: 20, fontWeight: 700,
            bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.15)",
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex", gap: 1.5, overflowX: "auto", pb: 1.5,
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-track": { bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(255,255,255,0.2)", borderRadius: 2 },
        }}
      >
        {displayEvents.map((event) => {
          const active = isActive(event);
          const wasAdded = added.has(event.uid);
          const start = dayjs(event.dtstart);
          const end = dayjs(event.dtend);
          const dateLabel = event.allDay
            ? start.format("MMM D") + (end.diff(start, "day") > 1 ? ` – ${end.subtract(1, "day").format("MMM D")}` : "")
            : start.format("MMM D · h:mma");

          return (
            <Box
              key={event.uid}
              sx={{
                flexShrink: 0,
                width: 260,
                borderRadius: 3,
                bgcolor: active ? "rgba(168,5,50,0.18)" : "rgba(255,255,255,0.07)",
                border: active ? "1.5px solid rgba(168,5,50,0.4)" : "1.5px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: active ? "rgba(168,5,50,0.25)" : "rgba(255,255,255,0.12)",
                  border: active ? "1.5px solid rgba(168,5,50,0.55)" : "1.5px solid rgba(255,255,255,0.25)",
                },
              }}
            >
              {/* Date + active badge */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.3 }}>
                  {dateLabel}
                </Typography>
                {active && (
                  <Chip
                    label="● Active"
                    size="small"
                    sx={{
                      fontSize: 9, height: 18, fontWeight: 800, letterSpacing: 0.5,
                      bgcolor: "rgba(34,197,94,0.2)", color: "#86efac",
                      border: "1px solid rgba(34,197,94,0.35)",
                      "& .MuiChip-label": { px: 0.75 },
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
                    }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography sx={{ fontWeight: 800, color: "#fff", fontSize: "0.88rem", lineHeight: 1.3 }}>
                {event.summary}
              </Typography>

              {/* Description snippet */}
              <Typography sx={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {event.description}
              </Typography>

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 0.75, mt: "auto", pt: 0.5 }}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={wasAdded}
                  startIcon={<AddCircleOutlineIcon sx={{ fontSize: "12px !important" }} />}
                  onClick={() => handleAdd(event)}
                  sx={{
                    bgcolor: wasAdded ? "rgba(34,197,94,0.25)" : RED,
                    color: "#fff", fontSize: 10, fontWeight: 700,
                    borderRadius: 999, px: 1.25, py: 0.4,
                    textTransform: "none", flexShrink: 0,
                    "&:hover": { bgcolor: "#8f0229" },
                    "&.Mui-disabled": { bgcolor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.35)" },
                  }}
                >
                  {wasAdded ? "Added ✓" : "Add to Events"}
                </Button>
                <Tooltip title="View on CSUN News" placement="top">
                  <Button
                    size="small"
                    component="a"
                    href={event.url}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      minWidth: 0, px: 1, color: "rgba(255,255,255,0.45)",
                      border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999,
                      "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
                    }}
                  >
                    <OpenInNewIcon sx={{ fontSize: 13 }} />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
        <Alert severity="success" sx={{ width: "100%" }}>{toast}</Alert>
      </Snackbar>
    </Box>
  );
}
