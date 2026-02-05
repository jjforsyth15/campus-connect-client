"use client";

import * as React from "react";
import { Card, CardContent, Typography, CardActionArea, Box } from "@mui/material";
import Link from "next/link";

export default function ClubCard({
  name,
  href,
  desc,
}: {
  name: string;
  href: string;
  desc: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.35)",
        backdropFilter: "blur(8px)",
      }}
    >
      <CardActionArea component={Link} href={href} target="_blank" rel="noopener">
        <CardContent>
          <Typography variant="h6" fontWeight={900} sx={{ color: "#fff" }}>
            {name}
          </Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
            {desc}
          </Typography>
          <Box sx={{ mt: 1.5, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
            Learn more ↗
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
