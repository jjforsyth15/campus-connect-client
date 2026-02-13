"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type Props = {
  open: boolean;
  onCloseAction: () => void;
  initialText: string;
  onSave: (text: string) => void;
};

export default function EditNoteDialog({ open, onCloseAction, initialText, onSave }: Props) {
  const [text, setText] = React.useState(initialText ?? "");

  React.useEffect(() => {
    if (open) setText(initialText ?? "");
  }, [open, initialText, onCloseAction]);

  const trimmed = text.trim();

  return (
    <Dialog open={open} onClose={onCloseAction} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 900 }}>
        Add a note
        <IconButton onClick={onCloseAction} sx={{ position: "absolute", right: 10, top: 10 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: "rgba(0,0,0,0.55)", mb: 1 }}>
          Share a short update (up to 60 chars)
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 60))}
          fullWidth
          placeholder="What’s up?"
          size="small"
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCloseAction} sx={{ fontWeight: 900, textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(trimmed);
            onCloseAction();
          }}
          disabled={!trimmed}
          variant="contained"
          sx={{
            fontWeight: 900,
            textTransform: "none",
            borderRadius: 999,
            bgcolor: "#A80532",
            "&:hover": { bgcolor: "#810326" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
