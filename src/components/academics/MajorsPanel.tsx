"use client";

import * as React from "react";
import { Alert, Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import { btnGhost, btnGhostDark, fieldSx, type MajorPlan } from "./AcademicsStates";

export default function MajorsPanel({
  majorsLoading,
  majorsErr,
  majorsFiltered,
  majorFilter,
  setMajorFilter,
  selectedMajor,
  setSelectedMajor,
  onReload,
}: {
  majorsLoading: boolean;
  majorsErr: string | null;
  majorsFiltered: MajorPlan[];
  majorFilter: string;
  setMajorFilter: (v: string) => void;
  selectedMajor: MajorPlan | null;
  setSelectedMajor: (m: MajorPlan) => void;
  onReload: () => void;
}) {
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
          Browsing majors is powered by a backend endpoint (empty endpoint for now). Select a major to view plan info.
        </Typography>

        <Divider sx={{ my: 2.25, borderColor: "rgba(255,255,255,0.14)" }} />

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.25}
          alignItems={{ md: "center" }}
          justifyContent="space-between"
        >
          <TextField
            size="small"
            label="Search majors"
            placeholder='Try: "Computer Science", "Business", "Psychology"'
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

        {majorsErr && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {majorsErr}
          </Alert>
        )}
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          alignItems: "stretch",
        }}
      >
        {/* list */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 2.25,
            bgcolor: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(0,0,0,0.06)",
            minHeight: 360,
          }}
        >
          <Typography fontWeight={950} sx={{ mb: 1.25 }}>
            Majors (Undergraduate Plans)
          </Typography>

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
                    bgcolor:
                      selectedMajor?.plan_id === m.plan_id ? "rgba(168,5,50,0.08)" : "rgba(0,0,0,0.03)",
                    "&:hover": { bgcolor: "rgba(168,5,50,0.06)" },
                  }}
                >
                  <Typography fontWeight={950} sx={{ color: "#A80532" }}>
                    {m.plan_title}
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.65)" }}>
                    {m.plan_id}
                    {m.academic_groups_title ? ` • ${m.academic_groups_title}` : ""}
                  </Typography>
                </Paper>
              ))
            ) : (
              <Typography sx={{ color: "rgba(0,0,0,0.65)" }}>
                {majorsLoading ? "Loading majors…" : "No majors match your search."}
              </Typography>
            )}
          </Box>
        </Paper>

        {/* detail */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            p: 2.25,
            bgcolor: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(0,0,0,0.06)",
            minHeight: 360,
          }}
        >
          <Typography fontWeight={950} sx={{ mb: 1.25 }}>
            Selected Major
          </Typography>

          {selectedMajor ? (
            <>
              <Typography variant="h6" fontWeight={950} sx={{ color: "#111827" }}>
                {selectedMajor.plan_title}
              </Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.70)", mt: 0.5 }}>
                Plan ID: <strong>{selectedMajor.plan_id}</strong>
              </Typography>
              {selectedMajor.academic_groups_title && (
                <Typography sx={{ color: "rgba(0,0,0,0.70)" }}>
                  College/Group: <strong>{selectedMajor.academic_groups_title}</strong>
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography component="div" sx={{ color: "rgba(0,0,0,0.75)" }}>
                This section is required and wired to the majors list endpoint.
                <br />
                Next: if you want <strong>required classes per major</strong>, backend should provide either:
                <ul style={{ marginTop: 8, marginBottom: 0 }}>
                  <li>a requirements endpoint, or</li>
                  <li>a backend catalog mapping service.</li>
                </ul>
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Keep your same "View Plan JSON" behavior, but point to backend if you want later.
                  For now, this can remain a placeholder link. */}
              <Button
                variant="outlined"
                sx={btnGhostDark}
                onClick={() => window.open(`/api/v1/academics/majors/${encodeURIComponent(selectedMajor.plan_id)}`, "_blank")}
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
