"use client";

import * as React from "react";
import { Stack } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

// BACKEND NOTE: The `value` prop fed to <Stars> is an average
// rating computed client-side in NoteView.tsx (`calcAvgRating`).
// Once comments are persisted in the database, consider pushing
// the average computation server-side:
//   - Store a denormalized `avgRating` and `ratingCount` column
//     on the `note_folder_items` table.
//   - Update these columns atomically via a DB trigger or in the
//     POST /api/note-share/comments handler after each new comment.
//   - This avoids recalculating averages from the full comment list
//     on every render and enables efficient ORDER BY avgRating queries.
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
