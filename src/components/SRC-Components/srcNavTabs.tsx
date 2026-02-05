"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Tabs, Tab } from "@mui/material";

const CSUN_RED = "#A80532";

const tabs = [
  { label: "Services", href: "/ToroSRC/services" },
  { label: "Sport Clubs", href: "/ToroSRC/SportClubs" },
  { label: "FitQuest", href: "/ToroSRC/FitQuest" },
];

export default function NavTabs({
  value,
  inline,
}: {
  value?: string;
  inline?: boolean;
}) {
  const pathname = usePathname();
  const resolved = React.useMemo(() => {
    const v = (value ?? pathname ?? "").toLowerCase();
    const match = tabs.find((t) => t.href.toLowerCase() === v);
    return match?.href ?? false;
  }, [pathname, value]);

  return (
    <Box
      sx={
        inline
          ? { bgcolor: "transparent" }
          : {
              px: { xs: 1, sm: 2 },
              py: 0.5,
              bgcolor: "#fff",
              borderRadius: 3,
              border: "2px solid rgba(0,0,0,0.08)",
            }
      }
    >
      <Tabs
        value={resolved}
        variant="standard"
        TabIndicatorProps={{ style: { display: "none" } }}
        aria-label="SRC Navigation"
        sx={{
          minHeight: 0,
          flexWrap: "wrap",
          justifyContent: "center",
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
              // pill button look
              minHeight: 40,
              lineHeight: 1,
              mx: 0.5,
              px: 1.75,
              borderRadius: 999,
              textTransform: "none",
              fontSize: { xs: 14, sm: 15 },
              fontWeight: 900,
              color: CSUN_RED,
              bgcolor: "#fff",
              border: "2px solid rgba(0,0,0,0.06)",
              boxShadow: "0 1px 2px rgba(0,0,0,.04)",
              transition: "transform .18s ease, box-shadow .18s ease, border-color .18s ease",
              "&:hover": {
                transform: "translateY(-2px)", // nudge animation on hover
                boxShadow: "0 6px 12px rgba(0,0,0,.12)",
                borderColor: "rgba(0,0,0,0.12)",
              },
              "&.Mui-selected": {
                color: "#fff",
                bgcolor: CSUN_RED,
                borderColor: CSUN_RED,
                boxShadow: "0 6px 12px rgba(0,0,0,.18)",
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
