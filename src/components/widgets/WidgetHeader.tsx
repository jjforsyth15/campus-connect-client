"use client";

import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const WidgetHeader: React.FC<{ title: string; onDelete?: () => void }> = ({ title, onDelete }) => (
  <Box
    className="widget-drag"
    sx={{
      p: 1, px: 1.25, borderBottom: "1px solid #eee", cursor: "move",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}
  >
    <Typography fontWeight={700} fontSize={14}>{title}</Typography>
    {onDelete && (
      <IconButton size="small" onClick={onDelete} aria-label={`delete ${title}`}>
        <CloseIcon fontSize="small" />
      </IconButton>
    )}
  </Box>
);
