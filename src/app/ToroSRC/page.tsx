"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Snackbar,
  Alert,
} from "@mui/material";
import Link from "next/link";
import Header from "@/components/SRC-Components/srcHeader";
import Carousel from "@/components/SRC-Components/Carousel";
import { useRouter } from "next/navigation";
import { loadProfile } from "@/lib/load-profile";
import { Profile } from "../profile/page";
import { useAuthorize } from "@/lib/useAuthorize";

const SRC_RED = "#A80532";

export default function ToroSRC_HomePage() {

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

  const [toast, setToast] = React.useState<string | null>(null);
  const post = (url: string, program: string) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program }),
    });

  const featured = [
    { title: "Yoga", blurb: "Guided flows for balance and flexibility. Mats available.", imageSrc: "/images/yoga.png" },
    { title: "Boxing Conditioning", blurb: "Pads, bags, and footwork. High energy training.", imageSrc: "/images/boxing.png" },
    { title: "Aquatics", blurb: "Lap swim and learn to swim options for all levels.", imageSrc: "/images/aquatics.png" },
    { title: "Recovery Sessions", blurb: "Mobility, stretching, and tools to feel your best.", imageSrc: "/images/recovery.png" },
    { title: "Private Instruction", blurb: "One on one coaching tailored to your goals.", imageSrc: "/images/private.png" },
    { title: "First Aid & CPR", blurb: "Learn lifesaving skills with certified instruction.", imageSrc: "/images/firstaid.png" },
    { title: "Reservations", blurb: "Reserve courts, lanes, and spaces with ease.", imageSrc: "/images/reservations.png" },
    { title: "Group Exercise", blurb: "Join classes across strength, cardio, and mobility.", imageSrc: "/images/classes.png" },
    { title: "Games Room", blurb: "Billiards, console gaming, lounge space to unwind.", imageSrc: "/images/games-room.png" },
    { title: "Rock Wall", blurb: "Bouldering and top rope for all experience levels.", imageSrc: "/images/rock-wall.png" },
    { title: "Outdoor Experiences", blurb: "Trips and skills clinics to explore the outdoors.", imageSrc: "/images/outdoor.png" },
    { title: "Intramural Sports", blurb: "Leagues and tournaments for friendly competition.", imageSrc: "/images/intramurals.png" },
  ].map(p => ({
    ...p,
    onAddToEvents: async () => {
      try {
        await post("/api/events", p.title);
        setToast(`${p.title} added to your Events`);
      } catch {
        setToast("Could not add to Events");
      }
    },
    onInvite: async () => {
      try {
        await post("/api/invite", p.title);
        setToast(`Invite sent for ${p.title}`);
      } catch {
        setToast("Could not send invite");
      }
    },
  }));

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      {/* Background and tint are provided by src/app/ToroSRC/layout.tsx */}

      <Header value="" />

      <Container sx={{ pt: 2, pb: 8 }}>
        {/* Hero with blurred bg and clear foreground video */}
        <Box
          sx={{
            position: "relative",
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.55)",
            height: { xs: 260, sm: 320, md: 420 },
            mb: 3,
          }}
        >
          <video
            src="../videos/hero-src.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "blur(18px) brightness(.8) saturate(0.9)",
              transform: "scale(1.12)",
            }}
          />
          <video
            src="../videos/hero-src.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <Box sx={{ textAlign: "center", lineHeight: 1 }}>
              <Typography
                component="div"
                sx={{
                  fontSize: { xs: 56, sm: 84, md: 112 },
                  fontWeight: 900,
                  letterSpacing: 2,
                  color: "transparent",
                  WebkitTextStroke: { xs: "2px #fff", md: "3px #fff" },
                  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                }}
              >
                CSUN
              </Typography>
              <Typography
                component="div"
                sx={{
                  mt: { xs: 0.25, md: 0.5 },
                  fontSize: { xs: 22, sm: 28, md: 34 },
                  fontWeight: 900,
                  letterSpacing: 4,
                  color: SRC_RED,
                  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                }}
              >
                SRC
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick categories */}
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          }}
        >
          {[
            { title: "Boxing", href: "/ToroSRC/programs#boxing" },
            { title: "Yoga", href: "/ToroSRC/programs#yoga" },
            { title: "Aquatics", href: "/ToroSRC/programs#aquatics" },
            { title: "Recovery", href: "/ToroSRC/programs#recovery" },
            { title: "Personal Training", href: "/ToroSRC/programs#pt" },
            { title: "Sport Clubs", href: "/ToroSRC/SportClubs" },
          ].map((c) => (
            <Card
              key={c.title}
              sx={{
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.15)",
                border: "2px solid rgba(255,255,255,0.9)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                  bgcolor: "rgba(255,255,255,0.25)",
                },
              }}
            >
              <CardActionArea component={Link} href={c.href}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} sx={{ color: "#fff" }}>
                    {c.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                    Explore classes, schedules, and sign ups.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>


        <Typography variant="h5" fontWeight={900} sx={{ mt: 5, mb: 2, color: "#fff" }}>
          Featured at the SRC
        </Typography>
        <Carousel slides={featured} />
      </Container>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
        <Alert severity="success" sx={{ width: "100%" }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
