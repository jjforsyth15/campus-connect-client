"use client";

import * as React from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Collapse,
} from "@mui/material";
import Header from "@/components/SRC-Components/srcHeader";
import { red } from "@mui/material/colors";
import { useRouter } from "next/navigation";
import { useAuthorize } from "@/lib/useAuthorize";

type Svc = { title: string; blurb: string; long: string; imageSrc: string };

const services: Svc[] = [
  {
    title: "Group Exercise & Classes",
    blurb: "Wide range of classes across strength, cardio, and mobility.",
    long: "From cycling and HIIT to yoga, Pilates, and mindfulness formats, classes are led by certified instructors and scaled to all levels. Book ahead, check in fast, and rotate through tracks that build capacity over the term. Equipment provided where noted; bring water and arrive early for setup.",
    imageSrc: "/images/classes.png",
  },
  {
    title: "Recovery Sessions",
    blurb: "Guided mobility, stretching, and tools to aid performance.",
    long: "Target soreness and improve range of motion with foam rolling, banded mobility, and breath work. Learn short recovery flows for pre-lift prep or post-workout cooldown. Sessions are beginner friendly and integrate into any training plan.",
    imageSrc: "/images/recovery.png",
  },
  {
    title: "Private Instruction",
    blurb: "One on one coaching with a trainer or instructor.",
    long: "Work toward specific goals with movement assessments, progressive programming, and milestone tracking. Sessions can cover strength technique, endurance, or sport-specific skills. Your coach aligns schedule, recovery, and nutrition tips to fit your classes and commitments.",
    imageSrc: "/images/private.png",
  },
  {
    title: "First Aid & CPR",
    blurb: "Earn certifications in first aid, CPR and AED.",
    long: "Hands-on courses build confidence for real situations on campus and beyond. Learn scene safety, primary assessment, bleeding control, and AED use with realistic scenarios. Certification is valid per provider guidelines.",
    imageSrc: "/images/firstaid.png",
  },
  {
    title: "Reservations",
    blurb: "Book courts, lanes, and studios.",
    long: "Secure times for basketball, volleyball, racquet sports, turf, and pool lanes. Reservations keep wait times low and guarantee your slot. Add to calendar and invite friends right from your confirmation.",
    imageSrc: "/images/reservations.png",
  },
  {
    title: "Games Room",
    blurb: "Relax and play with friends.",
    long: "Unwind with billiards, table tennis, console stations, and lounges. Watch match days, join tournaments, or host casual meetups between classes.",
    imageSrc: "/images/games-room.png",
  },
  {
    title: "Rock Wall",
    blurb: "Climb for fun or training.",
    long: "Bouldering and top-rope routes for all levels with staff belays and clinics. Gear orientations and progressive challenges help you move from first climb to durable sessions.",
    imageSrc: "/images/rock-wall.png",
  },
  {
    title: "Outdoor Experiences",
    blurb: "Guided trips and clinics.",
    long: "Day hikes, camping, and skills workshops provide transportation, gear, and instruction. Learn trip prep, Leave No Trace, and essential field skills while exploring SoCal.",
    imageSrc: "/images/outdoor.png",
  },
  {
    title: "Aquatics",
    blurb: "Lap swim and instruction.",
    long: "Year-round indoor access with lane reservations, technique sessions, and learn-to-swim options. Build endurance, refine strokes, and cross-train for your sport.",
    imageSrc: "/images/aquatics.png",
  },
  {
    title: "Intramural Sports",
    blurb: "Leagues and tournaments.",
    long: "Form your team or join free agents across multiple sports. Regular season and playoffs keep competition friendly, inclusive, and structured around the student calendar.",
    imageSrc: "/images/intramurals.png",
  },
  {
    title: "Pro Shop Rental Equipment",
    blurb: "Check out balls, racquets, and more.",
    long: "Borrow equipment for your session, such as basketballs and badminton racquets, then return it when you are done. A valid CSUN ID may be required.",
    imageSrc: "/images/proshop.png",
  },
];

const RED = "#B6002D";

export default function ServicesPage() {

  // authorization
  const router = useRouter();
  const { auth, user, token, loading } = useAuthorize();

  React.useEffect(() => {
    if(loading) return;
    
    if (auth && token)
    console.log("Stored user: ", user);
    else {
      console.log("User not logged in.");
      console.log("auth: " + auth, ". token: " + token);
      router.replace("/");
    }
  }, [auth, token, user, loading, router]);  

  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");

  const normalizedSearch = search.trim().toLowerCase();

  const filteredServices = services.filter((s) => {
    if (!normalizedSearch) return true;
    const haystack = `${s.title} ${s.blurb} ${s.long}`.toLowerCase();
    return haystack.includes(normalizedSearch);
  });

  const handleToggle = (idx: number) => {
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header value="/ToroSRC/services" />

      <Container sx={{ pt: 3, pb: 8 }}>
        <Typography variant="h4" fontWeight={900} sx={{ color: "#fff", mb: 2 }}>
          SRC Programs & Services
        </Typography>

        {/* Search */}
        <Box sx={{ mb: 3, maxWidth: 420 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search services"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.14)",
                borderRadius: 999,
                color: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#fff",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: RED,
                },
              },
            }}
          />
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          }}
        >
          {filteredServices.map((s, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <Box
                key={s.title}
                sx={{
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  p: 2,
                  pb: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "rgba(255,255,255,0.12)",
                  border: "2px solid rgba(255,255,255,0.5)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.32)",
                  transition:
                    "transform 160ms ease-out, box-shadow 160ms ease-out, border-color 160ms ease-out, box-shadow 160ms ease-out",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "white",
                    boxShadow:
                      "0 22px 55px rgba(250, 24, 24, 1), 0 0 0 1px rgba(255, 7, 69, 1)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src={s.imageSrc}
                  alt={s.title}
                  sx={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 1.5,
                    bgcolor: "#222",
                  }}
                />

                {/* Text content */}
                <Typography
                  variant="h6"
                  fontWeight={900}
                  sx={{ mb: 0.5, color: "#ffffffff" }}
                >
                  {s.title}
                </Typography>

                <Typography
                  sx={{
                    mb: 1.5,
                    fontSize: 14,
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {s.blurb}
                </Typography>

                {/* Buttons */}
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      borderRadius: 999,
                      bgcolor: RED,
                      "&:hover": { bgcolor: "#8c0328" },
                    }}
                    onClick={() => {}}
                  >
                    ADD TO EVENTS
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      borderRadius: 999,
                      borderColor: RED,
                      color: RED,
                      bgcolor: "rgba(255, 255, 255, 1)",
                      "&:hover": {
                        borderColor: "#8c0328",
                        bgcolor: "rgba(255,255,255,0.9)",
                      },
                    }}
                    onClick={() => {}}
                  >
                    INVITE FRIENDS
                  </Button>
                </Box>

                {/* Read more / Hide details toggle */}
                <Typography
                  role="button"
                  tabIndex={0}
                  onClick={() => handleToggle(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleToggle(idx);
                    }
                  }}
                  sx={{
                    mt: 0.25,
                    mb: 0.75,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "white",
                    cursor: "pointer",
                    userSelect: "none",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {isExpanded ? "Hide details" : "Read more"}
                </Typography>

                {/* Expanded content */}
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box
                    sx={{
                      mt: 0.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "rgba(255,255,255,0.9)",
                      color: "#111",
                      fontSize: 13.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {s.long}
                  </Box>
                </Collapse>
              </Box>
            );
          })}

          {filteredServices.length === 0 && (
            <Typography sx={{ color: "#fff", gridColumn: "1 / -1", mt: 2 }}>
              No services match your search.
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}
