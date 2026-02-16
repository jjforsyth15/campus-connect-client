"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Club } from "./mockData";

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

type Props = { clubs: Club[]; mode: "hub" | "club"; club?: Club };

const MAROON = "#7b001c";
const MAROON_DARK = "#2a0010";

export default function ClubsUI({ clubs, mode, club }: Props) {
  const router = useRouter();

  // HUB
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  // CLUB tabs
  const [tab, setTab] = useState<
    "About" | "Profile" | "Members" | "Roles" | "Posts" | "Apply" | "Applications"
  >("About");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return clubs.filter((c) => {
      const matchesQ =
        !query ||
<<<<<<< Updated upstream:src/app/clubs/ClubsUI.tsx
        c.name.toLowerCase().includes(query) ||
        c.tagline.toLowerCase().includes(query) ||
        c.category.toLowerCase().includes(query);
=======
        safeLower(c.name).includes(query) ||
        safeLower(c.tagline ?? "").includes(query) ||
        safeLower(c.category ?? "").includes(query);
>>>>>>> Stashed changes:src/components/clubs/ClubsUI.tsx

      const matchesCat = cat === "All" || c.category === cat;
      return matchesQ && matchesCat;
    });
  }, [clubs, q, cat]);

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 700px at 15% 0%, rgba(255,255,255,0.10), transparent 55%)," +
          "radial-gradient(900px 600px at 90% 10%, rgba(255,255,255,0.08), transparent 55%)," +
          `linear-gradient(180deg, ${MAROON} 0%, #4a0013 50%, ${MAROON_DARK} 100%)`,
        px: { xs: 2, md: 5 },
        py: { xs: 3, md: 5 },
      }}
    >
      <Box sx={{ maxWidth: 1150, mx: "auto" }}>{children}</Box>
    </Box>
  );

  const GlassPanel = ({ children }: { children: React.ReactNode }) => (
    <Card
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3 },
        backgroundColor: "rgba(255,255,255,0.10)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </Card>
  );

  const WhiteCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card
      sx={{
        borderRadius: 4,
        p: { xs: 2.5, md: 3 },
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
      }}
    >
      <Typography sx={{ fontWeight: 800, fontSize: 20, color: MAROON_DARK }}>{title}</Typography>
      <Box sx={{ mt: 2 }}>{children}</Box>
    </Card>
  );

  // ---------------- HUB ----------------
  if (mode === "hub") {
    return (
      <Shell>
        <GlassPanel>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography sx={{ color: "white", fontSize: { xs: 36, md: 46 }, fontWeight: 900 }}>
                Clubs Hub
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 1, maxWidth: 700 }}>
                Discover CSUN communities — join clubs, find events, connect with members, and build
                your network.
              </Typography>

              <Box sx={{ mt: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label="Discover" sx={chipActive} />
                <Chip label="Featured" sx={chipGhost} />
                <Chip label="My Clubs" sx={chipGhost} />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button component={Link} href="/clubs?view=recommend" sx={btnPrimary}>
                Get Recommendations →
              </Button>
            </Box>
          </Box>
        </GlassPanel>

        <Box sx={{ mt: 3 }}>
          <GlassPanel>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography sx={{ color: "white", fontSize: 26, fontWeight: 900 }}>
                  Find a Club
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 0.5 }}>
                  Search by name, category, or vibe (workshops, mentorship, etc.)
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip label="Filters" sx={chipGhost} />
                <Chip label="Sort" sx={chipGhost} />
                <Chip label="Save" sx={chipGhost} />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 170px" },
                gap: 1.5,
                alignItems: "center",
              }}
            >
              <TextField
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search clubs..."
                fullWidth
                InputProps={{ sx: inputSx }}
              />

              <Select value={cat} onChange={(e) => setCat(String(e.target.value))} fullWidth sx={selectSx}>
                <MenuItem value="All">All categories</MenuItem>
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Academic">Academic</MenuItem>
                <MenuItem value="Cultural">Cultural</MenuItem>
                <MenuItem value="Sports">Sports</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
              </Select>

              <Button
                sx={btnPrimaryWide}
                onClick={() =>
                  document.getElementById("clubs-grid")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse →
              </Button>
            </Box>
          </GlassPanel>
        </Box>

        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: 900, fontSize: 24 }}>Clubs</Typography>
          <Chip label={`${filtered.length} results`} sx={chipGhost} />
        </Box>

        <Box
          id="clubs-grid"
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          {filtered.map((c) => (
            <Card
              key={c.slug}
              sx={{
                textDecoration: "none",
                borderRadius: 4,
                background: "rgba(255,255,255,0.95)",
                color: MAROON_DARK,
                boxShadow: "0 18px 55px rgba(0,0,0,0.35)",
                transition: "transform 0.18s ease, box-shadow 0.18s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 22px 70px rgba(0,0,0,0.40)",
                },
              }}
            >
              <CardActionArea component={Link} href={`/clubs?slug=${c.slug}`} sx={{ borderRadius: 4, display: "block" }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: MAROON }}>
                        {c.category.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontSize: 26, fontWeight: 900, mt: 0.5 }}>{c.name}</Typography>
                      <Typography sx={{ mt: 1, color: "rgba(42,0,16,0.70)" }}>{c.tagline}</Typography>
                      {c.contact?.email && (
                        <Typography sx={{ mt: 0.8, color: "rgba(42,0,16,0.60)", fontSize: 14 }}>
                          {c.contact.email}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                      <Chip label="Profile" sx={{ bgcolor: MAROON, color: "white", fontWeight: 800 }} />
                      <Chip label="View →" sx={{ border: `1px solid rgba(123,0,28,0.25)` }} />
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip label="About" sx={chipLight} />
                    <Chip label="Members" sx={chipLight} />
                    <Chip label="Posts" sx={chipLight} />
                    <Chip label="Apply" sx={chipLight} />
                  </Box>
                </CardContent>
              </CardActionArea>

              <Box sx={{ px: 3, pb: 3, pt: 0.5, display: "flex", gap: 1.2, flexWrap: "wrap" }}>
                <Button sx={btnMaroon} onClick={() => router.push(`/clubs?slug=${c.slug}`)}>
                  View Club
                </Button>

                <Button sx={btnBlack} onClick={() => alert("Join flow next (DB + roles)")}>
                  Join
                </Button>

                <Button sx={btnOutline} onClick={() => alert("Contact flow next")}>
                  Contact
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      </Shell>
    );
  }

  // ---------------- CLUB PAGE ----------------
  if (!club) return null;

  const tabs = ["About", "Profile", "Members", "Roles", "Posts", "Apply", "Applications"] as const;

  return (
    <Shell>
      <GlassPanel>
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box>
<<<<<<< Updated upstream:src/app/clubs/ClubsUI.tsx
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: 2,
                color: "rgba(255,255,255,0.75)",
              }}
            >
              {club.category.toUpperCase()}
=======
            <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.75)" }}>
              {(club.category ?? "").toUpperCase()}
>>>>>>> Stashed changes:src/components/clubs/ClubsUI.tsx
            </Typography>
            <Typography sx={{ color: "white", fontSize: 40, fontWeight: 900, mt: 0.5 }}>
              {club.name}
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.70)", mt: 1, maxWidth: 760 }}>
              {club.tagline ?? club.description ?? ""}
            </Typography>

            <Box sx={{ mt: 2.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {tabs.map((t) => (
                <Chip key={t} label={t} onClick={() => setTab(t)} sx={tab === t ? chipActive : chipGhost} />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/clubs" sx={btnGhost}>
              ← Back
            </Button>

            {/* Chatbot removed */}

            <Button sx={btnPrimary} onClick={() => alert("Next: Join flow")}>
              Join
            </Button>
          </Box>
        </Box>
      </GlassPanel>

      <Box sx={{ mt: 3 }}>
        <GlassPanel>
          {tab === "About" && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
              <WhiteCard title="Our story">
                <Typography sx={{ color: "rgba(42,0,16,0.75)", lineHeight: 1.7 }}>{club.story ?? club.description ?? ""}</Typography>

                <Typography sx={{ mt: 3, fontWeight: 900, color: MAROON }}>Why join</Typography>
                <Box sx={{ mt: 1.5, display: "grid", gap: 1 }}>
                  {(club.whyJoin ?? []).map((w) => (
                    <Box key={w} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                      <Typography sx={{ color: MAROON, fontWeight: 900 }}>•</Typography>
                      <Typography sx={{ color: "rgba(42,0,16,0.75)" }}>{w}</Typography>
                    </Box>
                  ))}
                </Box>
              </WhiteCard>

              <WhiteCard title="Contact">
                <ContactRow label="Email" value={club.contact?.email} />
                <ContactRow label="Instagram" value={club.contact?.instagram} />
                <ContactRow label="Website" value={club.contact?.website} />
              </WhiteCard>
            </Box>
          )}

          {tab === "Profile" && (
            <WhiteCard title="Club Profile">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Profile foundation for clubs to manage their public info (bio, links, meetings). Backend + permissions
                next.
              </Typography>
            </WhiteCard>
          )}

          {tab === "Members" && (
            <WhiteCard title="Members">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Member management foundation (invite, approve, remove). Backend + permissions next.
              </Typography>
            </WhiteCard>
          )}

          {tab === "Roles" && (
            <WhiteCard title="Roles">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Appoint roles (President, VP, Treasurer). This will control permissions later.
              </Typography>
            </WhiteCard>
          )}

          {tab === "Posts" && (
            <WhiteCard title="Club Posts">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Posts feed foundation (announcements, meetings, events). Next: DB + editor.
              </Typography>
            </WhiteCard>
          )}

          {tab === "Apply" && (
            <WhiteCard title="Apply to Join">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Application foundation. Next: save to DB and notify club admins.
              </Typography>
            </WhiteCard>
          )}

          {tab === "Applications" && (
            <WhiteCard title="Applications">
              <Typography sx={{ color: "rgba(42,0,16,0.70)" }}>
                Admin view foundation for reviewing applications (approve/deny). Permissions later.
              </Typography>
            </WhiteCard>
          )}
        </GlassPanel>
      </Box>
    </Shell>
  );
}

function ContactRow({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 900, letterSpacing: 2, color: MAROON }}>
        {label.toUpperCase()}
      </Typography>

      <Typography sx={{ mt: 0.5, color: "rgba(42,0,16,0.75)" }}>
        {value ? (
          value.startsWith("http") ? (
            <a href={value} target="_blank" rel="noreferrer" style={{ color: MAROON }}>
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span style={{ color: "rgba(42,0,16,0.35)" }}>Not added yet</span>
        )}
      </Typography>

      <Divider sx={{ mt: 2, opacity: 0.2 }} />
    </Box>
  );
}

/** SX presets */
const chipGhost = {
  bgcolor: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "rgba(255,255,255,0.92)",
  fontWeight: 700,
};

const chipActive = {
  bgcolor: "rgba(255,255,255,0.92)",
  color: "#7b001c",
  fontWeight: 900,
};

const chipLight = {
  bgcolor: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.10)",
  fontWeight: 700,
};

const btnGhost = {
  borderRadius: 3,
  px: 2,
  py: 1,
  color: "white",
  border: "1px solid rgba(255,255,255,0.20)",
  bgcolor: "rgba(255,255,255,0.10)",
  fontWeight: 800,
  "&:hover": { bgcolor: "rgba(255,255,255,0.14)" },
};

const btnPrimary = {
  borderRadius: 3,
  px: 2.2,
  py: 1,
  bgcolor: "rgba(255,255,255,0.92)",
  color: "#7b001c",
  fontWeight: 900,
  "&:hover": { bgcolor: "rgba(255,255,255,0.96)" },
};

const btnPrimaryWide = { ...btnPrimary, py: 1.35 };

const btnMaroon = {
  borderRadius: 3,
  bgcolor: MAROON,
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "#650016" },
};

const btnBlack = {
  borderRadius: 3,
  bgcolor: "black",
  color: "white",
  fontWeight: 900,
  px: 2.2,
  "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
};

const btnOutline = {
  borderRadius: 3,
  bgcolor: "white",
  color: MAROON_DARK,
  fontWeight: 900,
  px: 2.2,
  border: "1px solid rgba(0,0,0,0.12)",
  "&:hover": { bgcolor: "rgba(255,255,255,0.92)" },
};

const inputSx = {
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& input::placeholder": { color: "rgba(255,255,255,0.55)" },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
};

const selectSx = {
  borderRadius: 3,
  bgcolor: "rgba(255,255,255,0.10)",
  color: "white",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.18)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.28)" },
  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.85)" },
};
