"use client";

// ═══════════════════════════════════════════════════════════════════════
// BACKEND INTEGRATION — LeaveClubDialog
// ═══════════════════════════════════════════════════════════════════════
// This component handles the full leave-club UX flow:
//   1. "Leave" button → confirmation dialog
//   2. Confirmed → optimistic removal from UI + API call
//   3. Post-leave state → informational message shown until dismissed
//
// BACKEND: Replace the simulated leaveClub() call with a real mutation:
//
//   // Option A — REST
//   await fetch(`/api/clubs/${clubId}/members/me`, { method: 'DELETE' })
//
//   // Option B — Supabase
//   await supabase
//     .from('club_members')
//     .delete()
//     .match({ club_id: clubId, user_id: session.user.id })
//
//   // After a successful leave, invalidate the membership query:
//   mutate('/api/users/me/clubs')          // SWR
//   queryClient.invalidateQueries(['myClubs'])  // React Query
//
// OPTIMISTIC UPDATE PATTERN:
//   // Remove immediately from local state, revert on error:
//   setMyClubIds(prev => { const next = new Set(prev); next.delete(clubId); return next; })
//   try { await leaveClubApi(clubId) }
//   catch { setMyClubIds(prev => new Set([...prev, clubId])); showErrorToast() }
//
// PERMISSIONS:
//   - Club founders/admins should be blocked from leaving — show a
//     "Transfer leadership before leaving" message instead.
//   - Check: SELECT role FROM club_members WHERE club_id = :id AND user_id = :me
//   - If role === 'founder' → disable leave button, show tooltip.
// ═══════════════════════════════════════════════════════════════════════

import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Typography,
  Fade,
  CircularProgress,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { btnMaroon, btnGhost, MAROON } from "./ClubsStates";

// ── Types ─────────────────────────────────────────────────────────────────────

type LeaveStep = "idle" | "confirm" | "loading" | "post-leave";

interface LeaveClubDialogProps {
  clubId: string;
  clubName: string;
  /** Called after the user successfully leaves — use to update parent state */
  onLeaveSuccess?: (clubId: string) => void;
  /** Compact trigger button variant for use inside cards */
  variant?: "card" | "page";
}

// ── Simulated API call ────────────────────────────────────────────────────────
// BACKEND: Replace this with a real API call (see header comments above).
async function leaveClubApi(clubId: string): Promise<void> {
  // Simulate network latency
  await new Promise((res) => setTimeout(res, 1100));
  // Uncomment to simulate a random error for testing:
  // if (Math.random() < 0.3) throw new Error("Server error");
  console.log(`[LeaveClub] Left club ${clubId}`); // Remove once wired to real API
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeaveClubDialog({
  clubId,
  clubName,
  onLeaveSuccess,
  variant = "page",
}: LeaveClubDialogProps) {
  const [step, setStep] = React.useState<LeaveStep>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const openConfirm = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card flip if used inside FlipClubCard
    setError(null);
    setStep("confirm");
  };

  const handleConfirmLeave = async () => {
    setError(null);
    setStep("loading");
    try {
      await leaveClubApi(clubId);
      // BACKEND: Also call mutate() / invalidateQueries() here
      onLeaveSuccess?.(clubId);
      setStep("post-leave");
    } catch {
      setError("Something went wrong. Please try again.");
      setStep("confirm");
    }
  };

  const handleClose = () => {
    if (step === "loading") return; // prevent closing during request
    setStep("idle");
    setError(null);
  };

  const isOpen = step === "confirm" || step === "loading" || step === "post-leave";

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────────────────── */}
      <Button
        onClick={openConfirm}
        startIcon={<LogoutRoundedIcon sx={{ fontSize: 15 }} />}
        sx={
          variant === "card"
            ? {
                // Compact ghost button for use inside FlipClubCard back face
                borderRadius: 999,
                fontSize: 12,
                py: 0.7,
                px: 1.8,
                fontWeight: 800,
                color: "rgba(180,0,46,0.85)",
                bgcolor: "rgba(180,0,46,0.07)",
                border: "1px solid rgba(180,0,46,0.18)",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(180,0,46,0.14)",
                  transform: "translateY(-1px)",
                },
              }
            : {
                // Full-size button for the club detail page
                ...btnGhost,
                color: "rgba(255,160,160,0.95)",
                bgcolor: "rgba(180,0,46,0.14)",
                border: "1px solid rgba(180,0,46,0.35)",
                "&:hover": {
                  bgcolor: "rgba(180,0,46,0.28)",
                  transform: "translateY(-2px)",
                },
              }
        }
      >
        Leave Club
      </Button>

      {/* ── Dialog ─────────────────────────────────────────────────────── */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        TransitionComponent={Fade}
        transitionDuration={280}
        PaperProps={{
          sx: {
            borderRadius: "24px",
            bgcolor: "rgba(28,4,12,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(30px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
            maxWidth: 420,
            width: "100%",
            overflow: "hidden",
          },
        }}
        slotProps={{
          backdrop: {
            sx: { backdropFilter: "blur(6px)", bgcolor: "rgba(0,0,0,0.65)" },
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>

          {/* ── CONFIRM STEP ───────────────────────────────────────────── */}
          {(step === "confirm" || step === "loading") && (
            <Box sx={{ p: 3.5 }}>
              {/* Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "rgba(180,0,46,0.15)",
                  border: "1px solid rgba(180,0,46,0.30)",
                  display: "grid",
                  placeItems: "center",
                  mb: 2.5,
                }}
              >
                <WarningAmberRoundedIcon sx={{ color: "#ff6b6b", fontSize: 28 }} />
              </Box>

              <Typography
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: 20,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                Leave {clubName}?
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 14,
                  lineHeight: 1.65,
                  mb: 0.5,
                }}
              >
                You'll lose subcription to this club's media, events, resources, and
                member-only channels.
              </Typography>
              <Typography
                sx={{
                  color: "rgba(255,255,255,0.40)",
                  fontSize: 13,
                  lineHeight: 1.55,
                  mb: 3,
                }}
              >
                To rejoin, you'll need to re-apply or contact the club leaders.
              </Typography>

              {/* Error */}
              {error && (
                <Box
                  sx={{
                    mb: 2,
                    px: 1.8,
                    py: 1.2,
                    borderRadius: "12px",
                    bgcolor: "rgba(255,60,60,0.12)",
                    border: "1px solid rgba(255,60,60,0.25)",
                  }}
                >
                  <Typography sx={{ color: "#ff8080", fontSize: 13, fontWeight: 700 }}>
                    {error}
                  </Typography>
                </Box>
              )}

              {/* Actions */}
              <Box sx={{ display: "flex", gap: 1.2 }}>
                <Button
                  onClick={handleClose}
                  disabled={step === "loading"}
                  fullWidth
                  sx={{
                    ...btnGhost,
                    py: 1.1,
                    opacity: step === "loading" ? 0.5 : 1,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleConfirmLeave}
                  disabled={step === "loading"}
                  fullWidth
                  sx={{
                    ...btnMaroon,
                    py: 1.1,
                    position: "relative",
                    bgcolor: step === "loading" ? "rgba(180,0,46,0.55)" : MAROON,
                  }}
                >
                  {step === "loading" ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    "Yes, leave"
                  )}
                </Button>
              </Box>
            </Box>
          )}

          {/* ── POST-LEAVE STEP ────────────────────────────────────────── */}
          {step === "post-leave" && (
            <Box sx={{ p: 3.5 }}>
              {/* Animated checkmark */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  bgcolor: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.28)",
                  display: "grid",
                  placeItems: "center",
                  mb: 2.5,
                  animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
                  "@keyframes popIn": {
                    "0%": { transform: "scale(0.5)", opacity: 0 },
                    "100%": { transform: "scale(1)", opacity: 1 },
                  },
                }}
              >
                <CheckCircleOutlineRoundedIcon sx={{ color: "#34d399", fontSize: 28 }} />
              </Box>

              <Typography
                sx={{
                  color: "white",
                  fontWeight: 900,
                  fontSize: 20,
                  lineHeight: 1.2,
                  mb: 1,
                }}
              >
                You've left {clubName}
              </Typography>

              <Typography
                sx={{
                  color: "rgba(255,255,255,0.60)",
                  fontSize: 14,
                  lineHeight: 1.65,
                  mb: 1,
                }}
              >
                You no longer have access to this club's content or events.
              </Typography>

              {/* Rejoin info box */}
              <Box
                sx={{
                  mt: 2,
                  mb: 3,
                  p: 2,
                  borderRadius: "14px",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 13,
                    fontWeight: 700,
                    mb: 0.5,
                  }}
                >
                  Want to rejoin later?
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.50)",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  Re-apply through the club's page, or reach out directly to the
                  club leaders to request re-admission.
                </Typography>
              </Box>

              <Button
                onClick={handleClose}
                fullWidth
                sx={{ ...btnGhost, py: 1.1 }}
              >
                Done
              </Button>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
