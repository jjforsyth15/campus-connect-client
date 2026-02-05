"use client";

import * as React from "react";
import { Card, CardContent, Box, Stack, Typography } from "@mui/material";
import { WidgetHeader } from "./WidgetHeader";

export const DMNotificationsWidget: React.FC<{ onDelete?: () => void }> = ({ onDelete }) => (
  <Card className="widget-card" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
    <WidgetHeader title="DM Notifications" onDelete={onDelete} />
    <CardContent sx={{ flex: 1, overflow: "auto" }}>
      <Stack spacing={1}>
        {["You have 2 new DMs from @jane", "@club-lead mentioned you in #events", "@ta replied to your thread"].map((n, i) => (
          <Box key={i} sx={{ p: 1, border: "1px solid #eee", borderRadius: 2 }}>
            <Typography variant="body2">{n}</Typography>
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);
