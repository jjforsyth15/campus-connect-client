"use client";

import * as React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import type { Note, User, ID } from "./types";

type Props = {
  meId: string;
  notes: Note[];
  users: User[];
  onClickUserAction?: (userId: ID) => void;
};

export default function NotesBar({ meId, notes, users, onClickUserAction }: Props) {
  const userById = React.useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const sorted = React.useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes]
  );

  return (
    <Box sx={{ display: "flex", gap: 2, px: 2, py: 1.25, overflowX: "auto" }}>
      {sorted.map((n) => {
        const u = userById.get(n.userId);
        if (!u) return null;

        const isMe = n.userId === meId;

        return (
          <Box
            key={n.id}
            onClick={() => onClickUserAction?.(n.userId)}
            sx={{
              minWidth: 84,
              cursor: "pointer",
              userSelect: "none",
              textAlign: "center",
            }}
          >
            <Avatar
              src={u.avatarUrl}
              alt={u.displayName}
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                border: isMe ? "2px solid rgba(168,5,50,0.9)" : "2px solid rgba(0,0,0,0.12)",
                bgcolor: "white",
              }}
            />
            <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 700, color: "#111" }}>
              {isMe ? "Your note" : u.displayName.split(" ")[0]}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.55)" }} noWrap>
              {n.text}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
