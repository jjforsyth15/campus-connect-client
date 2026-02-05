"use client";

import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const RED = "#A80532";
const solidBtn = {
  bgcolor: RED,
  color: "#fff",
  "&:hover": { bgcolor: "#810326" },
};
const outlineBtn = {
  borderColor: RED,
  color: RED,
  "&:hover": { borderColor: "#810326", color: "#810326" },
};

type YearOption =
  | ""
  | "Freshman"
  | "Sophomore"
  | "Junior"
  | "Senior"
  | "Undergraduate";

type NewAccountSetupProps = {
  // BACKEND: replace this flag with real "profile incomplete" check from user record
  isNewAccount?: boolean;
};

const NewAccountSetup: React.FC<NewAccountSetupProps> = ({
  isNewAccount = true,
}) => {
  const [showBanner, setShowBanner] = React.useState(isNewAccount);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);

  // BACKEND: profile picture file / URL (connect to your storage / avatar field)
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);

  // BACKEND: map these to user profile fields
  const [displayName, setDisplayName] = React.useState("");
  const [schoolId, setSchoolId] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [year, setYear] = React.useState<YearOption>("");

  // BACKEND: optional metadata fields
  const [age, setAge] = React.useState("");
  const [sex, setSex] = React.useState("");
  const [hobbies, setHobbies] = React.useState("");
  const [clubs, setClubs] = React.useState("");
  const [searchingRoom, setSearchingRoom] = React.useState("");      // "yes" | "no" | ""
  const [searchingRoommate, setSearchingRoommate] = React.useState(""); // "yes" | "no" | ""
  const [bio, setBio] = React.useState("");                          // <= 400 chars
  const maxBioChars = 400;

  const [fileError, setFileError] = React.useState("");

  // little shake flags for labels
  const [shakePic, setShakePic] = React.useState(false);
  const [shakeName, setShakeName] = React.useState(false);
  const [shakeSid, setShakeSid] = React.useState(false);
  const [shakeMajor, setShakeMajor] = React.useState(false);
  const [shakeYear, setShakeYear] = React.useState(false);

  React.useEffect(() => {
    if (!shakePic && !shakeName && !shakeSid && !shakeMajor && !shakeYear)
      return;
    const t = setTimeout(() => {
      setShakePic(false);
      setShakeName(false);
      setShakeSid(false);
      setShakeMajor(false);
      setShakeYear(false);
    }, 350);
    return () => clearTimeout(t);
  }, [shakePic, shakeName, shakeSid, shakeMajor, shakeYear]);

  const totalRequired = 5;

  const completedRequired = React.useMemo(() => {
    let c = 0;
    if (profilePicture) c++;
    if (displayName.trim()) c++;
    if (schoolId.trim()) c++;
    if (major.trim()) c++;
    if (year) c++;
    return c;
  }, [profilePicture, displayName, schoolId, major, year]);

  const progressPercent = (completedRequired / totalRequired) * 100;
  const isComplete = completedRequired >= totalRequired;

  const requiredInvalid = (v: unknown) => showErrors && !v;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setProfilePicture(null);
      setFileError("");
      return;
    }

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setProfilePicture(null);
      setFileError("Only PNG and JPG files are allowed.");
      return;
    }

    setFileError("");
    setProfilePicture(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    const missingRequired =
      !profilePicture || !displayName || !schoolId || !major || !year;

    if (missingRequired) {
      if (!profilePicture) setShakePic(true);
      if (!displayName) setShakeName(true);
      if (!schoolId) setShakeSid(true);
      if (!major) setShakeMajor(true);
      if (!year) setShakeYear(true);
      return;
    }

    // BACKEND: send this payload to your API and mark account as "profile_complete"
    const payload = {
      profilePicture,
      displayName,
      schoolId,
      major,
      year,
      age,
      sex,
      hobbies,
      clubs,
      searchingRoom,
      searchingRoommate,
      bio,
    };
    console.log("NEW ACCOUNT PROFILE PAYLOAD", payload);

    alert("Account setup complete (stub).");
    setFormOpen(false);
    setShowBanner(false);
  };

  if (!showBanner && !formOpen) return (
    <>
      {/* global shake animation styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-3px); }
          40%, 80% { transform: translateX(3px); }
        }
        .shake { animation: shake 0.25s ease-in-out; }
      `}</style>
    </>
  );

  return (
    <>
      {/* Top banner strip inside dashboard main content */}
      {showBanner && (
        <Box sx={{ mb: 2, maxWidth: 1100, mx: "auto" }}>
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "#ffffff",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              px: 3,
              py: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: RED }}
              >
                Finish setting up account?
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
                Add your profile info so other students can find you.
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={solidBtn}
              onClick={() => setConfirmOpen(true)}
            >
              Finish setup
            </Button>
          </Box>
        </Box>
      )}

      {/* Center YES/LATER dialog (Create Party style) */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 900, pb: 1 }}>
          Start now? You can always finish later.
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "rgba(0,0,0,0.7)", mb: 2 }}
          >
            It only takes a minute to fill out the basics.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{ justifyContent: "center", pb: 2, pt: 0, gap: 2 }}
        >
          <Button
            variant="contained"
            sx={solidBtn}
            onClick={() => {
              setConfirmOpen(false);
              setFormOpen(true);
            }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            sx={outlineBtn}
            onClick={() => {
              setConfirmOpen(false);
              setShowBanner(false);
            }}
          >
            Later
          </Button>
        </DialogActions>
      </Dialog>

      {/* Main profile-setup form dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle
            sx={{
              fontWeight: 900,
              pb: 1.5,
              pr: 5,
              position: "relative",
            }}
          >
            Complete your profile
            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: "rgba(0,0,0,0.6)" }}
            >
              {completedRequired} of {totalRequired} required fields completed
            </Typography>

            <Box
              onClick={() => setFormOpen(false)} // close dialog
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                width: 34,
                height: 34,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "0.25s",
                color: RED,
                fontWeight: 900,
                fontSize: "20px",
                "&:hover": {
                  bgcolor: "rgba(0,0,0,0.08)",
                },
              }}
            >
              ×
            </Box>
          </DialogTitle>


          <DialogContent dividers sx={{ pt: 1.5 }}>
            <Stack spacing={2.4}>
              {/* PROFILE PICTURE + PREVIEW (circular cutout like profile) */}
              <Box className={shakePic ? "shake" : ""}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: requiredInvalid(profilePicture)
                      ? "#d32f2f"
                      : "#111",
                    mb: 0.75,
                  }}
                >
                  Profile picture (PNG or JPG)*
                </Typography>

                <Stack direction="row" spacing={2.5} alignItems="center">
                  {/* Circular avatar preview */}
                  <Box
                    sx={{
                      width: 96,
                      height: 96,
                      borderRadius: "50%",        
                      overflow: "hidden",
                      border: "3px solid #ffffff",
                      boxShadow: "0 0 0 2px rgba(0,0,0,0.15)",
                      bgcolor: "#111",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      // BACKEND: swap this src to real avatar URL 
                      src={
                        profilePicture
                          ? URL.createObjectURL(profilePicture)
                          : "/avatar_placeholder.png" 
                      }
                      alt="Profile preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Button
                      variant="contained"
                      component="label"
                      sx={solidBtn}
                    >
                      Upload profile picture
                      {/* BACKEND: hook into upload pipeline / file picker here */}
                      <input
                        hidden
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                      />
                    </Button>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 0.75, color: "rgba(0,0,0,0.65)" }}
                    >
                      Recommended: square image, at least 400×400px.
                    </Typography>
                    {fileError && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#d32f2f", mt: 0.5 }}
                      >
                        {fileError}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>

              {/* REQUIRED FIELDS */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1} className={shakeName ? "shake" : ""}>
                  <TextField
                    fullWidth
                    label="Display name*"
                    // BACKEND: save as user's public display name
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    error={requiredInvalid(displayName)}
                    helperText={
                      requiredInvalid(displayName) ? "Required" : " "
                    }
                  />
                </Box>
                <Box flex={1} className={shakeSid ? "shake" : ""}>
                  <TextField
                    fullWidth
                    label="School ID*"
                    // BACKEND: map to student ID field
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    error={requiredInvalid(schoolId)}
                    helperText={requiredInvalid(schoolId) ? "Required" : " "}
                  />
                </Box>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1} className={shakeMajor ? "shake" : ""}>
                  <TextField
                    fullWidth
                    label="Major*"
                    // BACKEND: map to academic major
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    error={requiredInvalid(major)}
                    helperText={requiredInvalid(major) ? "Required" : " "}
                  />
                </Box>

                <Box flex={1} className={shakeYear ? "shake" : ""}>
                  <FormControl fullWidth error={requiredInvalid(year)}>
                    <InputLabel>Year at CSUN*</InputLabel>
                    <Select
                      // BACKEND: map to student's year standing
                      label="Year at CSUN*"
                      value={year}
                      onChange={(e) => setYear(e.target.value as YearOption)}
                    >
                      <MenuItem value="">
                        <em>Select year</em>
                      </MenuItem>
                      <MenuItem value="Freshman">Freshman</MenuItem>
                      <MenuItem value="Sophomore">Sophomore</MenuItem>
                      <MenuItem value="Junior">Junior</MenuItem>
                      <MenuItem value="Senior">Senior</MenuItem>
                      <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                    </Select>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        ml: 0.75,
                        color: requiredInvalid(year)
                          ? "#d32f2f"
                          : "transparent",
                      }}
                    >
                      Required
                    </Typography>
                  </FormControl>
                </Box>
              </Stack>

              {/* OPTIONAL INFO BLOCKS */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="Age (optional)"
                    type="number"
                    // BACKEND: optional | consider storing as integer
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </Box>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="Sex (optional)"
                    // BACKEND: optional demographic field
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                  />
                </Box>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="Hobbies (optional)"
                    // BACKEND: free-text interests
                    multiline
                    minRows={3}
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                  />
                </Box>
                <Box flex={1}>
                  <TextField
                    fullWidth
                    label="Clubs (optional)"
                    // BACKEND: comma-separated or free-text; normalize server-side
                    multiline
                    minRows={3}
                    value={clubs}
                    onChange={(e) => setClubs(e.target.value)}
                  />
                </Box>
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Box flex={1}>
                  <FormControl fullWidth>
                    <InputLabel>Searching for room (y or n)</InputLabel>
                    <Select
                      label="Searching for room (y or n)"
                      // BACKEND: store as boolean or enum from this string
                      value={searchingRoom}
                      onChange={(e) => setSearchingRoom(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>No answer</em>
                      </MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl fullWidth>
                    <InputLabel>Searching for roommate (y or n)</InputLabel>
                    <Select
                      label="Searching for roommate (y or n)"
                      // BACKEND: store as boolean or enum
                      value={searchingRoommate}
                      onChange={(e) => setSearchingRoommate(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>No answer</em>
                      </MenuItem>
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              {/* BIO */}
              <Box>
                <TextField
                  fullWidth
                  label="Bio (optional)"
                  // BACKEND: short profile bio, max 400 characters
                  multiline
                  minRows={3}
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value.slice(0, maxBioChars))
                  }
                  helperText={`${bio.length}/${maxBioChars} characters`}
                />
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions
            sx={{ justifyContent: "space-between", px: 3, py: 1.5 }}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(0,0,0,0.6)" }}
            >
              * Required fields
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" sx={solidBtn}>
                Save profile
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>

      {/* Bottom anchored progress meter (white / red / black) */}
      {formOpen && (
        <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          pb: 2,
          px: 2,
          zIndex: 1301,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none", // allow clicks to pass through
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 520,
            borderRadius: 999,
            bgcolor: isComplete ? "#0f3d0f" : "#111",
            color: "#fff",
            px: 3,
            py: 1.5,
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            pointerEvents: "auto", 
          }}
        >
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                  fontSize: 12,
                }}
              >
                <span>
                  Profile setup: {completedRequired}/{totalRequired} required
                  fields
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </Box>
              <Box
                sx={{
                  height: 8,
                  borderRadius: 999,
                  bgcolor: "#444",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    width: `${progressPercent}%`,
                    bgcolor: isComplete ? "#16a34a" : RED,
                    transition: "width 0.25s ease-out",
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                border: "2px solid #fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 900,
                bgcolor: isComplete ? "#16a34a" : "transparent",
              }}
            >
              {isComplete ? "✓" : ""}
            </Box>
          </Box>
        </Box>
      )}

      {/* global shake styles */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-3px); }
          40%, 80% { transform: translateX(3px); }
        }
        .shake { animation: shake 0.25s ease-in-out; }
      `}</style>
    </>
  );
};

export default NewAccountSetup;
