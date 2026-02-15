"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Box, CssBaseline } from "@mui/material";

const DashboardSidebar = dynamic(() => import("@/components/dashboard/sidebar"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        borderRight: "1px solid rgba(0,0,0,0.08)",
        bgcolor: "white",
      }}
    />
  ),
});

const DRAWER_WIDTH = 220;

/**
 * Same layout as MessagesShell (sidebar + main) for loading/error/empty states.
 */
export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <Box sx={{ display: "flex", bgcolor: "#fafafb", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />
      <DashboardSidebar drawerWidth={DRAWER_WIDTH} onLogout={() => router.push("/")} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          p: 3,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
