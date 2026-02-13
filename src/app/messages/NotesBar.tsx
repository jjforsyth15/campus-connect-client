"use client";

/*
 * ============================================================================
 * NOTES for BACKEND 
 * ============================================================================
 *
 * PURPOSE
 * - Renders a horizontal "notes/status" strip (like stories) using Notes + Users,
 * - Same style as DM status bars in apps like Instagram, Snapchat, etc.
 *
 * INPUTS (FROM PARENT / BACKEND LAYER)
 * - meId: the current authenticated user id (string)
 * - users: list of users (id, displayName, avatarUrl, etc.)
 * - notes: list of notes/status items (id, userId, text, updatedAt)
 *
 * CURRENT BEHAVIOR
 * - Notes are sorted by updatedAt DESC (most recent first).
 * - Each note shows:
 *   - avatar (border highlights current user)
 *   - label: "Your note" for me, otherwise first name
 *   - note text (truncated)
 *
 * USER ACTIONS (PARENT HANDLES)
 * - onClickUserAction(userId):
 *   - if userId === meId: open "edit my note"
 *   - else: navigate/select DM thread with that user
 *
 * BACKEND INTEGRATION (FUTURE)
 * - Parent will replace mock props with server data:
 *   - GET /api/notes (or /api/users/:id/notes feed)
 *   - POST/PATCH /api/notes/:id (create/update my note)
 * - NotesBar should remain unchanged; treat props as the UI contract.
 */

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
