"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Box, Container, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NavTabs from "./srcNavTabs";

export default function Header({ value }: { value?: string }) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        bgcolor: "transparent",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container sx={{ py: 1 }}>
        {/* Inner capsule with white outline */}
        <Box
          sx={{
            px: { xs: 1, sm: 1.5 },
            py: { xs: 0.5, sm: 0.75 },
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            borderRadius: 999,
            bgcolor: "rgba(255,255,255,0.56)", 
            border: "2px solid rgba(255,255,255,0.95)", 
            boxShadow: "0 6px 18px rgba(0,0,0,.10)",
          }}
        >
          {/* Back to main dashboard */}
          <IconButton
            component={Link}
            href="/dashboard"
            aria-label="Back"
            sx={{
              color: "#fff",
              border: "1px solid rgba(255,255,255,.95)",
              bgcolor: "rgba(255,255,255,0.15)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          {/* SRC logo + title */}
          <Link
            href="/ToroSRC"
            aria-label="SRC Home"
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}
          >
            <Image src="/images/src-logo.png" alt="CSUN SRC" width={36} height={36} />
            <Typography variant="h6" fontWeight={900} sx={{ color: "#ffffffff", letterSpacing: 0.3 }}>
              Student Recreation Center
            </Typography>
          </Link>

          <Box sx={{ flex: 1 }} />

          {/* Inline pill tabs on the right */}
          <NavTabs value={value} inline />
        </Box>
      </Container>
    </Box>
  );
}
