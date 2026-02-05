"use client";

import * as React from "react";
import { Card, CardContent, CardMedia, Typography, Stack, Button, Collapse, Box } from "@mui/material";

const RED = "#A80532";
const redSolid = { bgcolor: RED, color: "#fff", "&:hover": { bgcolor: "#810326" } };
const redOutline = { borderColor: RED, color: RED, "&:hover": { borderColor: "#810326", color: "#810326" } };

export default function ProgramCard({
  title,
  blurb,
  imageSrc,
  onAddToEvents,
  onInvite,
  white,
  hideRSVP,
  expandableText,
}: {
  title: string;
  blurb: string;
  imageSrc: string;
  onAddToEvents: () => void;
  onInvite: () => void;
  white?: boolean;
  hideRSVP?: boolean;
  expandableText?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Card
      sx={{
        borderRadius: 3,
        bgcolor: white ? "#fff" : "rgba(255,255,255,0.12)",
        border: white ? "3px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.55)",
        overflow: "hidden",
      }}
    >
      <CardMedia component="img" height="180" image={imageSrc} alt={title} />
      <CardContent sx={{ pb: expandableText ? 1 : 2 }}>
        <Typography variant="h6" fontWeight={900} sx={{ mb: 0.5, color: white ? "#111" : "#fff" }}>
          {title}
        </Typography>
        <Typography sx={{ color: white ? "#333" : "rgba(255,255,255,0.9)", mb: 1.25 }}>{blurb}</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" sx={redSolid} onClick={onAddToEvents}>
            Add to Events
          </Button>
          <Button size="small" variant="outlined" sx={redOutline} onClick={onInvite}>
            Invite Friends
          </Button>
          {!hideRSVP && null}
        </Stack>

        {expandableText && (
          <>
            <Button
              size="small"
              onClick={() => setOpen(o => !o)}
              sx={{ mt: 1, fontWeight: 800, color: RED, textTransform: "none" }}
            >
              {open ? "Hide details" : "Read more"}
            </Button>
            <Collapse in={open} timeout={300} unmountOnExit>
              <Box
                sx={{
                  mt: 1,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  border: "2px solid rgba(0,0,0,0.08)",
                  p: 2,
                  color: "#222",
                  transformOrigin: "top",
                  animation: "drop .28s ease",
                  "@keyframes drop": {
                    from: { transform: "translateY(-6px)", opacity: 0.3 },
                    to: { transform: "translateY(0)", opacity: 1 },
                  },
                }}
              >
                <Typography>{expandableText}</Typography>
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
}
