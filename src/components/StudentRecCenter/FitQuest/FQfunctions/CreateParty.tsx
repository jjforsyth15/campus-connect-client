"use client";

// BACKEND INPUT: PARTY CREATION DATA 
// The backend will receive the following structure here when user creates a party:
// {
//   name: partyName,
//   date,
//   time,
//   members: [{ name, email }],
//   durationMins,
//   recurring,
//   focus (e.g. "legs", "full body", etc...),
// }

import * as React from "react";
import {
  Card, CardContent, Typography, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Stack, TextField, FormControlLabel,
  Checkbox, Autocomplete, FormControl, InputLabel, Select, MenuItem, ListItemText,
} from "@mui/material";

export type Member = { name: string; email: string };
export type Party = {
  name: string;
  time: string;
  date: string;
  recurring: boolean;
  recurringDays?: number[];
  durationMins: number;
  focus: string;
  maxMembers: number;
  members: Member[];
};

const RED = "#A80532";
const solid = { bgcolor: RED, color: "#fff", "&:hover": { bgcolor: "#810326" } };
const outline = {
  borderColor: RED,
  color: RED,
  "&:hover": { borderColor: "#810326", color: "#810326" },
};

const defaultFocuses = [ "Push", "Pull", "Legs", "Full Body", "Mobility", "Cardio", "Core", "Hypertrophy", "Olympic Lifts", "Powerlifting", ];

type CreatePartyProps = {
  onCreate: (p: Party) => void;
  existingNames?: string[];
};

const dayOptions = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

export default function CreateParty({ onCreate, existingNames = [], }: CreatePartyProps) {   // Parent component implements this do; call the real API endpoint
  // with the `Party` payload when a user creates a party.
  const [open, setOpen] = React.useState(false);
  const [focusOptions, setFocusOptions] =
    React.useState<string[]>(defaultFocuses);

  const [form, setForm] = React.useState<Party>({ //form data grab information from user for backend
    name: "",
    date: "",
    time: "",
    recurring: false,
    recurringDays: [],
    durationMins: 60,
    focus: "",
    maxMembers: 2,
    members: [
      { name: "", email: "" },
      { name: "", email: "" },
      { name: "", email: "" },
    ],
  });

  // error flags
  const [nameErr, setNameErr] = React.useState<string>("");
  const [dateErr, setDateErr] = React.useState(false); // for one-time parties
  const [daysErr, setDaysErr] = React.useState(false); // for recurring parties
  const [timeErr, setTimeErr] = React.useState(false);
  const [focusErr, setFocusErr] = React.useState(false);

  const [shakeName, setShakeName] = React.useState(false);
  const [shakeDate, setShakeDate] = React.useState(false);
  const [shakeDays, setShakeDays] = React.useState(false);
  const [shakeTime, setShakeTime] = React.useState(false);
  const [shakeFocus, setShakeFocus] = React.useState(false);

  React.useEffect(() => {
    if (
      !shakeName &&
      !shakeDate &&
      !shakeTime &&
      !shakeDays &&
      !shakeFocus
    )
      return;
    const timer = setTimeout(() => {
      setShakeName(false);
      setShakeDate(false);
      setShakeTime(false);
      setShakeDays(false);
      setShakeFocus(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [shakeName, shakeDate, shakeTime, shakeDays, shakeFocus]);

  const resetForm = () => {
    setForm({
      name: "",
      date: "",
      time: "",
      recurring: false,
      recurringDays: [],
      durationMins: 60,
      focus: "",
      maxMembers: 2,
      members: [
        { name: "", email: "" },
        { name: "", email: "" },
        { name: "", email: "" },
      ],
    });
    setNameErr("");
    setDateErr(false);
    setDaysErr(false);
    setTimeErr(false);
    setFocusErr(false);
  };

  const openDialog = () => {
    resetForm();
    setOpen(true);
  };

  const validate = () => {
    let ok = true;

    const trimmedName = form.name.trim();
    if (!trimmedName) {
      setNameErr("Name required");
      setShakeName(true);
      ok = false;

    } else if (existingNames.includes(trimmedName)) {
      setNameErr("Name already used");
      setShakeName(true);
      ok = false;

    } else {
      setNameErr("");
    }
    

    if (!form.time) {
      setTimeErr(true);
      setShakeTime(true);
      ok = false;
    } else {
      setTimeErr(false);
    }

    if (form.recurring) {
      if (!form.recurringDays || form.recurringDays.length === 0) {
        setDaysErr(true);
        setShakeDays(true);
        ok = false;
      } else {
        setDaysErr(false);
      }
      setDateErr(false);
    } else {
      if (!form.date) {
        setDateErr(true);
        setShakeDate(true);
        ok = false;
      } else {
        setDateErr(false);
      }
      setDaysErr(false);
    }

    if (!form.focus.trim()) {
      setFocusErr(true);
      setShakeFocus(true);
      ok = false;
    } else {
      setFocusErr(false);
    }

    return ok;
  };

  const submit = () => {
    if (!validate()) return;

    const trimmedMembers = form.members
      .slice(0, form.maxMembers)
      .filter((m) => m.name.trim() || m.email.trim());

    if (trimmedMembers.length === 0) {
      setShakeName(true);
      setNameErr("At least one member must be specified");
      return;
    }

    const newParty: Party = {
      ...form,
      members: trimmedMembers,
      recurringDays: form.recurring ? form.recurringDays : undefined,
      date: form.recurring ? "" : form.date,
    };
     // BACKEND ENTRY POINT:
    // `newParty` is the full payload you should persist to the database.
    //
    // Then pass it in:
    //   <CreateParty onCreate={handleCreate} ... />
    //
    onCreate(newParty);
    setOpen(false);
  };

  const handleFocusChange = (_: any, value: string | null) => {
    if (!value) {
      setForm({ ...form, focus: "" });
      return;
    }

    if (!focusOptions.includes(value)) {
      setFocusOptions((prev) => [...prev, value]);
    }

    setForm({ ...form, focus: value });
  };

  const handleRecurringToggle = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      recurring: checked,
      date: checked ? "" : prev.date,
      recurringDays: checked ? prev.recurringDays ?? [] : [],
    }));
    setDateErr(false);
    setDaysErr(false);
  };

  const dateShakeClass = shakeDate ? "shake" : "";
  const daysShakeClass = shakeDays ? "shake" : "";
  const nameShakeClass = shakeName ? "shake" : "";
  const timeShakeClass = shakeTime ? "shake" : "";
  const focusShakeClass = shakeFocus ? "shake" : "";

  return (
    <>
      <Card
        sx={{
          mt: 3,
          mb: 2,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.10)",
          border: "3px dashed rgba(255,255,255,0.7)",
          color: "#fff",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={900}>
                Create Workout Party
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Set up a recurring or one time workout party with your friends.
              </Typography>
            </Box>
            <Button variant="contained" sx={solid} onClick={openDialog}>
              New Party
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900, pb: 0.75 }}>
          Create Workout Party
        </DialogTitle>
        <DialogContent sx={{ pt: 0.75 }}>
          <Stack spacing={1.25}>
            {/* Name */}
            <Box className={nameShakeClass}>
              <TextField
                fullWidth
                label="Group name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                error={!!nameErr}
                helperText={nameErr || undefined}
                sx={{ mb: 0 }}
              />
            </Box>

            {/* Recurring toggle */}
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.recurring}
                    onChange={(e) =>
                      handleRecurringToggle(e.target.checked)
                    }
                    sx={{ color: RED, "&.Mui-checked": { color: RED } }}
                  />
                }
                label="Recurring"
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              {!form.recurring ? (
                <Box flex={1} className={dateShakeClass}>
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                    error={dateErr}
                    helperText={dateErr ? "Date required" : " "}
                  />
                </Box>
              ) : (
                <Box flex={1} className={daysShakeClass}>
                  <FormControl fullWidth error={daysErr}>
                    <InputLabel id="recurring-days-label">
                      Days of week
                    </InputLabel>
                    <Select
                      labelId="recurring-days-label"
                      multiple
                      value={form.recurringDays ?? []}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          recurringDays:
                            typeof e.target.value === "string"
                              ? e.target.value
                                  .split(",")
                                  .map(Number)
                              : (e.target.value as number[]),
                        })
                      }
                      label="Days of week"
                      renderValue={(selected) =>
                        (selected as number[])
                          .sort((a, b) => a - b)
                          .map(
                            (v) =>
                              dayOptions.find(
                                (d) => d.value === v
                              )?.label ?? ""
                          )
                          .join(", ")
                      }
                    >
                      {dayOptions.map((day) => (
                        <MenuItem
                          key={day.value}
                          value={day.value}
                        >
                          <Checkbox
                            checked={
                              form.recurringDays?.includes(
                                day.value
                              ) ?? false
                            }
                          />
                          <ListItemText
                            primary={day.label}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                    {daysErr && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, ml: 0.5 }}
                      >
                        Select at least one day
                      </Typography>
                    )}
                  </FormControl>
                </Box>
              )}

              {/* Time */}
              <Box flex={1} className={timeShakeClass}>
                <TextField
                  fullWidth
                  label="Start time"
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  InputLabelProps={{ shrink: true }}
                  error={timeErr}
                  helperText={timeErr ? "Time required" : " "}
                />
              </Box>
            </Stack>

            {/* Duration */}
            <TextField
              type="number"
              label="Duration (mins)"
              value={form.durationMins}
              onChange={(e) =>
                setForm({
                  ...form,
                  durationMins: Math.max(
                    15,
                    Number(e.target.value || 15)
                  ),
                })
              }
            />

            {/* Focus */}
            <Box className={focusShakeClass}>
              <Autocomplete
                freeSolo
                options={focusOptions}
                value={form.focus}
                onChange={handleFocusChange}
                onInputChange={(_, value) =>
                  setForm({ ...form, focus: value })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Focus (search or type)"
                    placeholder="Full Body, Legs, Push, Pull..."
                    error={focusErr}
                    helperText={focusErr ? "Focus required" : " "}
                  />
                )}
              />
            </Box>

            {/* Max members + Members */}
            <Stack spacing={0.5}>
              <TextField
                type="number"
                label="# of members"
                value={form.maxMembers}
                onChange={(e) => {
                  const raw = Number(e.target.value || 1);
                  const maxMembers = Math.max(1, raw);

                  setForm((prev) => {
                    let members = [...prev.members];

                    if (members.length < maxMembers) {
                      members = members.concat(
                        Array.from(
                          {
                            length:
                              maxMembers - members.length,
                          },
                          () => ({ name: "", email: "" })
                        )
                      );
                    } else if (
                      members.length > maxMembers
                    ) {
                      members = members.slice(0, maxMembers);
                    }

                    return {
                      ...prev,
                      maxMembers,
                      members,
                    };
                  });
                }}
              />

              {/* spacer so Member 1 isn't glued to the field */}
              <Box sx={{ mt: 1.25 }} />

              {/* Member inputs */}
              <Stack spacing={1}>
                {form.members
                  .slice(0, form.maxMembers)
                  .map((m, idx) => (
                    <Stack
                      key={idx}
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={1}
                    >
                      <TextField
                        sx={{ flex: 1 }}
                        label={
                          idx === 0
                            ? `Member ${
                                idx + 1
                              } name (you)`
                            : `Member ${idx + 1} name`
                        }
                        value={m.name}
                        onChange={(e) => {
                          const next = [
                            ...form.members,
                          ];
                          next[idx] = {
                            ...m,
                            name: e.target.value,
                          };
                          setForm({
                            ...form,
                            members: next,
                          });
                        }}
                      />
                      <TextField
                        sx={{ flex: 1 }}
                        label={`Member ${
                          idx + 1
                        } email (@my.csun.edu)`}
                        value={m.email}
                        onChange={(e) => {
                          const next = [
                            ...form.members,
                          ];
                          next[idx] = {
                            ...m,
                            email: e.target.value,
                          };
                          setForm({
                            ...form,
                            members: next,
                          });
                        }}
                        error={
                          !!m.email &&
                          !/@my\.csun\.edu$/i.test(
                            m.email
                          )
                        }
                        helperText={
                          m.email &&
                          !/@my\.csun\.edu$/i.test(
                            m.email
                          )
                            ? "Email must end with @my.csun.edu"
                            : " "
                        }
                      />
                    </Stack>
                  ))}
              </Stack>
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={solid}
            onClick={submit}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
