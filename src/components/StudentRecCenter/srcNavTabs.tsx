"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tabs, Tab } from "@mui/material";

const CSUN_RED = "#A80532";

const tabs = [
  { label: "Services",  href: "/StudentRecCenter/services" },
  { label: "Schedule",  href: "/StudentRecCenter/GroupClasses" },
  { label: "Sport Clubs", href: "/StudentRecCenter/SportClubs" },
  { label: "FitQuest",  href: "/StudentRecCenter/FitQuest" },
];

export default function NavTabs({
  value,
  inline,
  scrolled,
}: {
  value?: string;
  inline?: boolean;
  scrolled?: boolean;
}) {
  const pathname = usePathname();

  const resolved = React.useMemo(() => {
    const v = (value ?? pathname ?? "").toLowerCase();
    const match = tabs.find((t) => t.href.toLowerCase() === v);
    return match?.href ?? false;
  }, [pathname, value]);

  return (
    <Box
      sx={{
        overflow: "visible",
        py: "4px",
        my: "-4px",
      }}
    >
      <Tabs
        value={resolved}
        variant="scrollable"
        scrollButtons={false}
        TabIndicatorProps={{ style: { display: "none" } }}
        aria-label="SRC Navigation"
        sx={{
          minHeight: 0,
          overflow: "visible",
          "& .MuiTabs-scroller": { overflow: "visible !important" },
          "& .MuiTabs-flexContainer": { gap: 0.5, overflow: "visible" },
        }}
      >
        {tabs.map((t) => (
          <Tab
            key={t.href}
            value={t.href}
            component={Link}
            href={t.href}
            label={t.label}
            sx={{
              minHeight: 34,
              lineHeight: 1,
              px: { xs: 1.25, sm: 1.5 },
              py: 0.75,
              borderRadius: 999,
              textTransform: "none",
              fontSize: { xs: 12, sm: 13 },
              fontWeight: 700,
              letterSpacing: 0.2,
              whiteSpace: "nowrap",
              color: scrolled ? "#A80532" : "rgba(255,255,255,0.9)",
              bgcolor: "transparent",
              border: scrolled
                ? "1.5px solid rgba(168,5,50,0.18)"
                : "1.5px solid rgba(255,255,255,0.22)",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              overflow: "visible",
              "&:hover": {
                transform: "translateY(-1px)",
                bgcolor: scrolled ? "rgba(168,5,50,0.07)" : "rgba(255,255,255,0.14)",
                borderColor: scrolled ? "rgba(168,5,50,0.35)" : "rgba(255,255,255,0.5)",
                color: scrolled ? CSUN_RED : "#fff",
              },
              "&.Mui-selected": {
                color: "#fff",
                bgcolor: CSUN_RED,
                borderColor: CSUN_RED,
                boxShadow: "0 3px 12px rgba(168,5,50,0.4)",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
