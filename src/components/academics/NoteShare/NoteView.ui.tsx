"use client";

import * as React from "react";
import { Stack } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <Stack direction="row" spacing={0.15} alignItems="center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(value);
        return filled ? (
          <StarRoundedIcon key={i} sx={{ fontSize: size, color: "#A80532" }} />
        ) : (
          <StarBorderRoundedIcon key={i} sx={{ fontSize: size, color: "rgba(0,0,0,0.22)" }} />
        );
      })}
    </Stack>
  );
}
