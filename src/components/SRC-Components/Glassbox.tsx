"use client";

import * as React from "react";
import { Box, BoxProps } from "@mui/material";

export default function GlassBox(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "rgba(255,255,255,0.25)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        ...props.sx,
      }}
    />
  );
}
