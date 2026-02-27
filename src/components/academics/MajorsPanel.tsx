"use client";

import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import type { MajorPlan } from "./constants";
import { btnGhost, btnGhostDark, fieldSx } from "./constants";

const CSUN_PLAN_JSON_BASE = "https://www.csun.edu/web-dev/api/curriculum/2.0/plans";

type Props = {
  majorsLoading: boolean;
  majorsErr: string | null;
  majorsFiltered: MajorPlan[];
  majorFilter: string;
  setMajorFilter: (v: string) => void;
  selectedMajor: MajorPlan | null;
  setSelectedMajor: (m: MajorPlan) => void;
  onReload: () => void;
};

export default function MajorsPanel({
  majorsLoading,
  majorsErr,
  majorsFiltered,
  majorFilter,
  setMajorFilter,
  selectedMajor,
  setSelectedMajor,
  onReload,
}: Props) {
  return (
    <>
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
        <Typography variant="h5" fontWeight={950} sx={{ color: "#fff" }}>
          Majors & Requirements
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
          Browse majors and select one to view plan info. Data is from mock list; backend can wire CSUN API later.
        </Typography>
        <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.14)" }} />
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.25} alignItems={{ md: "center" }} justifyContent="space-between">
          <TextField
            size="small"
            label="Search majors"
            placeholder='Try: "Computer Science", "Business"'
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            sx={{ ...fieldSx, maxWidth: 520 }}
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.7)" } }}
          />
          <Stack direction="row" spacing={1} alignItems="center">
            <Button variant="outlined" onClick={onReload} sx={btnGhost} disabled={majorsLoading}>
              {majorsLoading ? "Loading…" : "Reload"}
            </Button>
          </Stack>
        </Stack>
        {majorsErr && <Alert severity="warning" sx={{ mt: 2 }}>{majorsErr}</Alert>}
      </Paper>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", alignItems: "stretch" }}>
        <Paper elevation={0} sx={{ borderRadius: 4, p: 2.25, bgcolor: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", minHeight: 360 }}>
          <Typography fontWeight={950} sx={{ mb: 1.25 }}>Majors (Undergraduate Plans)</Typography>
          <Box sx={{ maxHeight: 360, overflowY: "auto", pr: 1 }}>
            {majorsFiltered.length ? (
              majorsFiltered.map((m) => (
                <Paper
                  key={m.plan_id}
                  elevation={0}
                  onClick={() => setSelectedMajor(m)}
                  sx={{
                    p: 1.25,
                    mb: 1,
                    borderRadius: 3,
                    cursor: "pointer",
                    border: "1px solid rgba(0,0,0,0.08)",
                    bgcolor: selectedMajor?.plan_id === m.plan_id ? "rgba(168,5,50,0.08)" : "rgba(0,0,0,0.03)",
                    "&:hover": { bgcolor: "rgba(168,5,50,0.06)" },
                  }}
                >
                  <Typography fontWeight={950} sx={{ color: "#A80532" }}>{m.plan_title}</Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)" }}>
                    {m.plan_id}{m.academic_groups_title ? ` • ${m.academic_groups_title}` : ""}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>{majorsLoading ? "Loading majors…" : "No majors match your search."}</Typography>
            )}
          </Box>
        </Paper>

        <Paper elevation={0} sx={{ borderRadius: 4, p: 2.25, bgcolor: "rgba(255,255,255,0.95)", border: "1px solid rgba(0,0,0,0.06)", minHeight: 360 }}>
          <Typography fontWeight={950} sx={{ mb: 1.25 }}>Selected Major</Typography>
          {selectedMajor ? (
            <>
              <Typography variant="h6" fontWeight={950} sx={{ color: "#111827" }}>{selectedMajor.plan_title}</Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.70)", mt: 0.5 }}>Plan ID: <strong>{selectedMajor.plan_id}</strong></Typography>
              {selectedMajor.academic_groups_title && (
                <Typography sx={{ color: "rgba(0,0,0,0.70)" }}>College/Group: <strong>{selectedMajor.academic_groups_title}</strong></Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography component="div" sx={{ color: "rgba(0,0,0,0.75)" }}>
                Select a major to view plan details. Backend can wire CSUN Curriculum API for full requirements.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Button
                variant="outlined"
                sx={btnGhostDark}
                onClick={() => typeof window !== "undefined" && window.open(`${CSUN_PLAN_JSON_BASE}/${encodeURIComponent(selectedMajor.plan_id)}`, "_blank", "noopener,noreferrer")}
                endIcon={<OpenInNewRoundedIcon />}
              >
                View Plan JSON
              </Button>
            </>
          ) : (
            <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>Click a major on the left to view details.</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
}