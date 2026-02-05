"use client";

import * as React from "react";
import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { WidgetHeader } from "./WidgetHeader";

const todayClasses = [
  { kind: "In-Person", course: "CS 201 — Data Structures", time: "9:30 – 10:45 AM", location: "Eng Bldg 210" },
  { kind: "Online",    course: "HIST 120 — US History",     time: "12:00 – 1:15 PM",  location: "Zoom" },
  { kind: "In-Person", course: "MATH 230 — Linear Algebra", time: "2:00 – 3:15 PM",   location: "Science 104" },
];

export const TodayClassesWidget: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => (
  <Card className="widget-card" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <WidgetHeader title="Today’s Classes" onDelete={onDelete} />
    <CardContent sx={{ flex: 1, overflow: "auto" }}>
      <Stack spacing={1.25}>
        {todayClasses.map((cl, i) => (
          <Stack
            key={i}
            spacing={0.5}
            sx={{
              p: 1.25,
              border: "1px solid #eee",
              borderRadius: 2,
              bgcolor: cl.kind === "In-Person" ? "rgba(34,197,94,0.08)" : "rgba(99,102,241,0.08)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip size="small" label={cl.kind} color={cl.kind === "In-Person" ? "success" : "primary"} variant="outlined" />
              <Typography fontWeight={700}>{cl.course}</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {cl.time} • {cl.location}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </CardContent>
  </Card>
);
