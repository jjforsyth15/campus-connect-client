"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CLUBS } from "../clubs.data";
import { Box, Button, Card, MenuItem, Select, Typography } from "@mui/material";

const MAROON = "#7b001c";
const DARK = "#2a0010";

type Answers = {
  majorGroup: "STEM" | "Business" | "Arts" | "Health" | "Other";
  goal: "Networking" | "Projects" | "Competitions" | "Service" | "Creative";
  interest: "Coding" | "Robotics" | "Marketing" | "Debate" | "MentalHealth" | "GreekLife" | "Gaming";
  commitment: "Low" | "Medium" | "High";
  vibe: "Small" | "Large" | "Competitive" | "Casual";
};

export default function RecommendPage() {
  const [answers, setAnswers] = useState<Answers>({
    majorGroup: "STEM",
    goal: "Projects",
    interest: "Coding",
    commitment: "Medium",
    vibe: "Small",
  });

  const [resultSlug, setResultSlug] = useState<string | null>(null);

  const scored = useMemo(() => {
    const a = answers;

    const wanted: string[] = [
      a.majorGroup.toLowerCase(),
      a.goal.toLowerCase(),
      a.interest.toLowerCase(),
      a.commitment.toLowerCase(),
      a.vibe.toLowerCase(),
    ];

    return CLUBS.map((c) => {
      const text = `${c.name} ${c.tagline} ${c.category}`.toLowerCase();
      let score = 0;
      for (const w of wanted) if (text.includes(w)) score += 2;

      if (a.majorGroup === "STEM" && c.category.toLowerCase().includes("engineering")) score += 3;
      if (a.majorGroup === "Business" && c.category.toLowerCase().includes("academic")) score += 2;
      if (a.majorGroup === "Arts" && c.name.toLowerCase().includes("film")) score += 2;
      if (a.interest === "Gaming" && c.name.toLowerCase().includes("esports")) score += 5;

      return { slug: c.slug, name: c.name, score };
    }).sort((x, y) => y.score - x.score);
  }, [answers]);

  function submit() {
    const best = scored[0];
    setResultSlug(best?.slug ?? null);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${MAROON} 0%, #4a0013 50%, ${DARK} 100%)`,
        px: { xs: 2, md: 6 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 950, mx: "auto" }}>
        <Typography sx={{ color: "white", fontSize: 42, fontWeight: 900 }}>Club Recommendation</Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 1 }}>
          Answer five questions and we will match you with the closest club.
        </Typography>

        <Card
          sx={{
            mt: 3,
            borderRadius: 4,
            p: 3,
            backgroundColor: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
          }}
        >
          <Question
            label="What is your major group?"
            value={answers.majorGroup}
            onChange={(v) => setAnswers((p) => ({ ...p, majorGroup: v as any }))}
            options={["STEM", "Business", "Arts", "Health", "Other"]}
          />

          <Question
            label="What is your goal?"
            value={answers.goal}
            onChange={(v) => setAnswers((p) => ({ ...p, goal: v as any }))}
            options={["Networking", "Projects", "Competitions", "Service", "Creative"]}
          />

          <Question
            label="What are you most interested in?"
            value={answers.interest}
            onChange={(v) => setAnswers((p) => ({ ...p, interest: v as any }))}
            options={["Coding", "Robotics", "Marketing", "Debate", "MentalHealth", "GreekLife", "Gaming"]}
          />

          <Question
            label="How much time can you commit?"
            value={answers.commitment}
            onChange={(v) => setAnswers((p) => ({ ...p, commitment: v as any }))}
            options={["Low", "Medium", "High"]}
          />

          <Question
            label="What vibe do you prefer?"
            value={answers.vibe}
            onChange={(v) => setAnswers((p) => ({ ...p, vibe: v as any }))}
            options={["Small", "Large", "Competitive", "Casual"]}
          />

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            <Button component={Link} href="/clubs" sx={btnBack}>
              Back
            </Button>

            <Button onClick={submit} sx={btnSubmit}>
              Submit
            </Button>
          </Box>
        </Card>

        {resultSlug && (
          <Card sx={{ mt: 3, borderRadius: 4, p: 3, background: "rgba(255,255,255,0.95)", boxShadow: "0 18px 55px rgba(0,0,0,0.35)" }}>
            <Typography sx={{ fontWeight: 900, fontSize: 20, color: DARK }}>Best match</Typography>
            <Typography sx={{ mt: 1, color: "rgba(42,0,16,0.75)" }}>{scored[0]?.name}</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button component={Link} href={`/clubs/${resultSlug}`} sx={btnView}>
                View club
              </Button>

              <Button onClick={() => setResultSlug(null)} sx={btnRetake}>
                Retake
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  );
}

function Question({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: "rgba(255,255,255,0.80)", fontWeight: 800 }}>{label}</Typography>
      <Select
        value={value}
        onChange={(e) => onChange(String(e.target.value))}
        fullWidth
        sx={{
          mt: 1,
          borderRadius: 3,
          bgcolor: "rgba(255,255,255,0.10)",
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
          "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
        }}
      >
        {options.map((o) => (
          <MenuItem key={o} value={o}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

const btnBack = {
  borderRadius: 3,
  px: 2,
  py: 1,
  color: "white",
  border: "1px solid rgba(255,255,255,0.20)",
  bgcolor: "rgba(255,255,255,0.10)",
  fontWeight: 800,
  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
};

const btnSubmit = {
  borderRadius: 3,
  px: 2.5,
  py: 1,
  bgcolor: "rgba(255,255,255,0.92)",
  color: MAROON,
  fontWeight: 900,
  "&:hover": { bgcolor: "rgba(255,255,255,0.96)" },
};

const btnView = {
  borderRadius: 3,
  bgcolor: MAROON,
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "#650016" },
};

const btnRetake = {
  borderRadius: 3,
  bgcolor: "black",
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
};
