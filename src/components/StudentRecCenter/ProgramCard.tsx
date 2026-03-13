"use client";

import * as React from "react";
import {
  Card, CardContent, CardMedia, Typography, Stack, Button, Collapse, Box, Chip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RED = "#A80532";

export default function ProgramCard({
  title, blurb, imageSrc, onAddToEvents, onInvite,
  white, hideRSVP, expandableText, tag,
}: {
  title: string;
  blurb: string;
  imageSrc: string;
  onAddToEvents: () => void;
  onInvite: () => void;
  white?: boolean;
  hideRSVP?: boolean;
  expandableText?: string;
  tag?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        bgcolor: white ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.08)",
        border: white ? "1.5px solid rgba(0,0,0,0.07)" : "1.5px solid rgba(255,255,255,0.18)",
        backdropFilter: white ? "none" : "blur(12px)",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        "&:hover .card-img": { transform: "scale(1.05)" },
        "&:hover": {
          border: white
            ? "1.5px solid rgba(168,5,50,0.2)"
            : "1.5px solid rgba(255,255,255,0.4)",
        },
      }}
    >
      {/* Image — use aspect-ratio box so it never clips */}
      <Box
        sx={{
          overflow: "hidden",
          position: "relative",
          paddingTop: "56.25%",
        }}
      >
        <CardMedia
          component="img"
          image={imageSrc}
          alt={title}
          className="card-img"
          sx={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
        {/* Bottom gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {tag && (
          <Chip
            label={tag}
            size="small"
            sx={{
              position: "absolute", top: 10, right: 10,
              fontSize: 10, fontWeight: 800, letterSpacing: 0.8,
              textTransform: "uppercase",
              bgcolor: RED, color: "#fff", height: 22,
              "& .MuiChip-label": { px: 1 },
              boxShadow: "0 2px 8px rgba(168,5,50,0.5)",
            }}
          />
        )}
      </Box>

      <CardContent sx={{ p: 2, pb: expandableText ? 1.5 : 2 }}>
        <Typography
          variant="h6"
          fontWeight={800}
          sx={{ mb: 0.5, fontSize: "0.95rem", color: white ? "#111" : "#fff", letterSpacing: -0.2 }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: white ? "#555" : "rgba(255,255,255,0.75)", mb: 1.5, fontSize: "0.8rem", lineHeight: 1.5 }}
        >
          {blurb}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddCircleOutlineIcon sx={{ fontSize: "13px !important" }} />}
            onClick={onAddToEvents}
            sx={{
              bgcolor: RED, color: "#fff",
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, px: 1.5, py: 0.5,
              letterSpacing: 0.3, textTransform: "none",
              boxShadow: "0 2px 8px rgba(168,5,50,0.35)",
              "&:hover": { bgcolor: "#8f0229", boxShadow: "0 4px 14px rgba(168,5,50,0.45)", transform: "translateY(-1px)" },
              transition: "all 0.2s ease",
            }}
          >
            Add to Events
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<PeopleOutlineIcon sx={{ fontSize: "13px !important" }} />}
            onClick={onInvite}
            sx={{
              borderColor: white ? "rgba(168,5,50,0.35)" : "rgba(255,255,255,0.4)",
              color: white ? RED : "rgba(255,255,255,0.9)",
              fontSize: 11, fontWeight: 700,
              borderRadius: 999, px: 1.5, py: 0.5,
              letterSpacing: 0.3, textTransform: "none",
              "&:hover": {
                borderColor: RED,
                bgcolor: white ? "rgba(168,5,50,0.06)" : "rgba(255,255,255,0.12)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Invite
          </Button>
        </Stack>

        {expandableText && (
          <>
            <Button
              size="small"
              endIcon={
                <ExpandMoreIcon sx={{ transition: "transform 0.3s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", fontSize: "16px !important" }} />
              }
              onClick={() => setOpen((o) => !o)}
              sx={{ mt: 1, fontWeight: 700, fontSize: 11, color: white ? RED : "rgba(255,255,255,0.7)", textTransform: "none", p: 0, "&:hover": { bgcolor: "transparent", color: RED } }}
            >
              {open ? "Less" : "Details"}
            </Button>
            <Collapse in={open} timeout={280} unmountOnExit>
              <Box sx={{ mt: 1, p: 1.5, borderRadius: 2, bgcolor: white ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.1)", border: white ? "1px solid rgba(0,0,0,0.07)" : "1px solid rgba(255,255,255,0.15)" }}>
                <Typography variant="body2" sx={{ fontSize: "0.78rem", color: white ? "#333" : "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
                  {expandableText}
                </Typography>
              </Box>
            </Collapse>
          </>
        )}
      </CardContent>
    </Card>
  );
}
