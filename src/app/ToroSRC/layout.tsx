// src/app/ToroSRC/layout.tsx
"use client";

import * as React from "react";
import { Box } from "@mui/material";
import SrcAuroraBg from "@/components/SRC-Components/SrcBg";

const SRC_TINT =
  "linear-gradient(180deg, rgba(168,5,50,0.45) 0%, rgba(168,5,50,0.34) 50%, rgba(168,5,50,0.45) 100%)";

export default function ToroSRCRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <SrcAuroraBg opacity={0.55} speed={0.06} />
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background: SRC_TINT,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 2 }}>{children}</Box>
    </Box>
  );
}
