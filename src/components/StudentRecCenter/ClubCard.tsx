"use client";

import * as React from "react";
import { Card, CardContent, Typography, CardActionArea, Box, Chip } from "@mui/material";
import Link from "next/link";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ClubCard({
  name,
  href,
  desc,
  tag,
}: {
  name: string;
  href: string;
  desc: string;
  tag?: string;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.08)",
        border: "1.5px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(12px)",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        "&:hover": {
          transform: "translateY(-4px)",
          bgcolor: "rgba(255,255,255,0.14)",
          border: "1.5px solid rgba(255,255,255,0.35)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <CardActionArea component={Link} href={href} target="_blank" rel="noopener">
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ color: "#fff", fontSize: "1rem", lineHeight: 1.2, flex: 1, mr: 1 }}
            >
              {name}
            </Typography>
            <OpenInNewIcon sx={{ fontSize: 14, color: "rgba(255,255,255,0.4)", flexShrink: 0, mt: 0.25 }} />
          </Box>

          {tag && (
            <Chip
              label={tag}
              size="small"
              sx={{
                mb: 1,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                bgcolor: "rgba(168,5,50,0.3)",
                color: "#ffb3c1",
                border: "1px solid rgba(168,5,50,0.4)",
                height: 20,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.82rem", lineHeight: 1.5 }}>
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
