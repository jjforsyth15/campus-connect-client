"use client";

/*
 * ============================================================================
 * NOTES for BACKEND 
 * ============================================================================
 *
 * PURPOSE
 * - Allows the current user to search for another user and start a new DM.
 * - This component is UI-only and does NOT perform any API calls directly.
 *
 * CURRENT IMPLEMENTATION (FRONTEND-ONLY)
 * - Receives users as a full list (mocked or pre-fetched by parent).
 * - Filters users client-side by:
 *   - username
 *   - displayName
 * - Excludes users in blockedUserIds.
 * - On selection:
 *   - Calls onPickUserAction(userId)
 *   - Parent is responsible for:
 *       - finding existing thread OR
 *       - creating a new thread
 *
 */

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { User, ID } from "./types";

type Props = {
  open: boolean;
  onCloseAction: () => void;
  users: User[];
  blockedUserIds: Set<string>;
  onPickUserAction: (userId: ID) => void;
};

export default function NewMessageDialog({
  open,
  onCloseAction,
  users,
  blockedUserIds,
  onPickUserAction,
}: Props) {
  const [q, setQ] = React.useState("");

  React.useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    return users
      .filter((u) => !blockedUserIds.has(u.id))
      .filter((u) => {
        if (!query) return true;
        return u.username.toLowerCase().includes(query) || u.displayName.toLowerCase().includes(query);
      })
      .slice(0, 30);
  }, [q, users, blockedUserIds]);

  return (
    <Dialog open={open} onClose={onCloseAction} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 1000 }}>
        New message
        <IconButton onClick={onCloseAction} sx={{ position: "absolute", right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 900, color: "rgba(0,0,0,0.55)", mb: 1 }}>
          To
        </Typography>

        <TextField
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search username or name"
          fullWidth
          size="small"
          InputProps={{
            sx: { bgcolor: "rgba(0,0,0,0.04)", borderRadius: 999 },
          }}
        />

        <Divider sx={{ my: 1.5 }} />

        <List sx={{ p: 0, maxHeight: 380, overflow: "auto" }}>
          {filtered.map((u) => (
            <ListItemButton
              key={u.id}
              onClick={() => {
                onPickUserAction(u.id);
                onCloseAction();
              }}
              sx={{ borderRadius: 2 }}
            >
              <Avatar src={u.avatarUrl} sx={{ mr: 1.5, bgcolor: "white" }} />
              <ListItemText
                primary={<Typography sx={{ fontWeight: 900 }}>{u.displayName}</Typography>}
                secondary={`@${u.username}`}
              />
              <Button
                variant="contained"
                sx={{
                  ml: 1,
                  borderRadius: 999,
                  fontWeight: 900,
                  textTransform: "none",
                  bgcolor: "#A80532",
                  "&:hover": { bgcolor: "#810326" },
                }}
              >
                Chat
              </Button>
            </ListItemButton>
          ))}

          {!filtered.length && (
            <Box sx={{ py: 5, textAlign: "center" }}>
              <Typography sx={{ fontWeight: 900 }}>No results</Typography>
              <Typography sx={{ color: "rgba(0,0,0,0.6)" }}>Try a different search.</Typography>
            </Box>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}
