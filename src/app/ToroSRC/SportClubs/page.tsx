"use client";

import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
} from "@mui/material";
import Link from "next/link";
import Header from "@/components/SRC-Components/srcHeader";
import { useRouter } from "next/navigation";
import { useAuthorize } from "@/lib/useAuthorize";

const RED = "#A80532";
const btnSolid = { bgcolor: RED, color: "#fff", "&:hover": { bgcolor: "#810326" } };
const btnOutline = { borderColor: RED, color: RED, "&:hover": { borderColor: "#810326", color: "#810326" } };

type Tryout = { dayTime?: string; location?: string; cost?: string; notes?: string };
type Club = { name: string; href: string; img: string; desc: string; tryout: Tryout };

// Helper for concise tryout placeholders without inventing dates.
const TBD = (loc: string, cost = "None / TBD", notes = "Confirm details on club site; bring CSUN ID.") =>
  ({ dayTime: "TBD — see club page", location: loc, cost, notes });

const clubs: Club[] = [
  // ---- A ----
  {
    name: "Archery",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/archery-club",
    img: "/clubs/Archery.png",
    desc:
      "Beginner-friendly and competitive community for target archery. Learn safe form, tune equipment, and train for collegiate events with structured practice blocks.",
    tryout: TBD("SRC range / outdoor field"),
  },
  {
    name: "Badminton",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/badminton-club",
    img: "/clubs/Badminton.png",
    desc:
      "All-levels sessions with drills, ladders, and team match play. Emphasis on footwork, shot variety, and tournament preparation.",
    tryout: TBD("SRC courts"),
  },
  {
    name: "Baseball",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/baseball-club",
    img: "/clubs/Baseball.png",
    desc:
      "Student-run club baseball with league play, travel games, and regular practices focused on skill development and team systems.",
    tryout: TBD("Off-campus/field facility"),
  },
  {
    name: "Boxing",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/boxing-club",
    img: "/clubs/Boxing.png",
    desc:
      "Technique, conditioning, and controlled sparring with a safety-first approach. Optional intercollegiate bouts for qualified athletes.",
    tryout: TBD("SRC studio / training space", "TBD (wraps/gloves provided for tryout where available)"),
  },
  {
    name: "Brazilian Jiu-Jitsu",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/brazilian-jiu-jitsu-club",
    img: "/clubs/BrazilianJiuJitsu.png",
    desc:
      "Grappling instruction with drilling, positional sparring, and tournament preparation in a welcoming student environment.",
    tryout: TBD("Mat room / studio"),
  },
  {
    name: "Chess",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/chess-club",
    img: "/clubs/Chess.png",
    desc:
      "Casual and rated play, lessons, and collegiate team competitions. Open to improving players and seasoned competitors alike.",
    tryout: TBD("Games Room / meeting space"),
  },
  {
    name: "Cheer",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/cheer-club",
    img: "/clubs/Cheer.png",
    desc:
      "Game-day spirit, stunts, and performance with regular team practices and event appearances throughout the semester.",
    tryout: TBD("Gym / practice floor", "TBD (possible uniform/dues)"),
  },
  {
    name: "Dance",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/dance-club",
    img: "/clubs/Dance.png",
    desc:
      "Team choreography with performance opportunities and technique training in multiple styles, welcoming a range of experience levels.",
    tryout: TBD("Studio / rehearsal hall"),
  },
  {
    name: "Esports",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/esports",
    img: "/clubs/Esports.png",
    desc:
      "Multiple titles with coached practice, scrims, and league competition. Structured rosters, VOD review, and campus events.",
    tryout: { dayTime: "Title-specific windows (see Discord/club page)", location: "Games Room / online", cost: "None / TBD", notes: "Bring CSUN ID; check Discord for tryout lobbies." },
  },
  {
    name: "Fasmode Dance Crew",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/fasmode-dance-crew",
    img: "/clubs/FasmodeDanceCrew.png",
    desc:
      "Student hip-hop dance crew focused on choreography, community performances, and campus showcases.",
    tryout: TBD("Studio / rehearsal hall"),
  },
  {
    name: "Northridge Street Dancers",
    href: "https://w2.csun.edu/as/departments/sport-clubs/available-sports/northridge-street-dancers",
    img: "/clubs/NorthridgeStreetDancers.png",
    desc:
      "Open-session street styles collective with workshops, jams, and showcases for all experience levels.",
    tryout: TBD("Studio / open floor"),
  },
  {
    name: "Ice Hockey",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/ice-hockey-club",
    img: "/clubs/IceHockey.png",
    desc:
      "ACHA club hockey with structured practices, film, and competitive schedule. Team travel for league play.",
    tryout: TBD("Ice rink facility", "TBD (ice fees/equipment)"),
  },
  {
    name: "Men’s Basketball",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/mens-basketball-club-0",
    img: "/clubs/MensBasketball.png",
    desc:
      "Club basketball with team practices, systems, and collegiate club competition opportunities.",
    tryout: TBD("SRC courts"),
  },
  {
    name: "Men’s Rugby",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/mens-rugby",
    img: "/clubs/MensRugby.png",
    desc:
      "Competitive 15s/7s rugby emphasizing fitness, fundamentals, and league fixtures against regional opponents.",
    tryout: TBD("Grass field"),
  },
  {
    name: "Men’s Volleyball",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/mens-volleyball-club",
    img: "/clubs/MensVolleyball.png",
    desc:
      "Indoor volleyball training with team systems, positional work, and tournament play.",
    tryout: TBD("SRC courts"),
  },
  {
    name: "Men’s Soccer",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/mens-soccer-club",
    img: "/clubs/MensSoccer.png",
    desc:
      "Club soccer with coached training sessions, friendlies, and league matches throughout the term.",
    tryout: TBD("Turf/grass field"),
  },
  {
    name: "Salsa Libre",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/salsa-libre-club",
    img: "/clubs/SalsaLibre.png",
    desc:
      "Latin dance community focusing on salsa and related styles with classes, socials, and campus performances.",
    tryout: TBD("Studio / social space"),
  },
  {
    name: "Swim",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/swim",
    img: "/clubs/Swim.png",
    desc:
      "Club swim with structured workouts, technique work, and optional collegiate meets.",
    tryout: TBD("Pool lanes"),
  },
  {
    name: "Table Tennis",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/table-tennis-club",
    img: "/clubs/TableTennis.png",
    desc:
      "Singles and doubles ladders, drills, and intercollegiate competition for all skill levels.",
    tryout: TBD("Games Room / table area"),
  },
  {
    name: "Tennis",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/tennis-club",
    img: "/clubs/Tennis.png",
    desc:
      "Team practices, challenge ladders, and club tennis matches with travel opportunities.",
    tryout: TBD("Tennis courts"),
  },
  {
    name: "Water Polo",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/water-polo-club",
    img: "/clubs/WaterPolo.png",
    desc:
      "Club water polo with practices focused on tactics, conditioning, and tournament play.",
    tryout: TBD("Pool (deep end)"),
  },
  {
    name: "Weightlifting",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/weightlifting-club",
    img: "/clubs/Weightlifting.png",
    desc:
      "Olympic and powerlifting focus with coached technique sessions and optional meet preparation.",
    tryout: TBD("Strength platform area"),
  },
  {
    name: "Women’s Basketball",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/womens-basketball",
    img: "/clubs/WomensBasketball.png",
    desc:
      "Women’s club basketball with system work, scrimmages, and collegiate club competition.",
    tryout: TBD("SRC courts"),
  },
  {
    name: "Women’s Lacrosse",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/womens-lacrosse-club",
    img: "/clubs/WomensLacrosse.png",
    desc:
      "Stick skills, offensive/defensive sets, and league play in a supportive team environment.",
    tryout: TBD("Grass field"),
  },
  {
    name: "Women’s Rugby",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/womens-rugby-club",
    img: "/clubs/WomensRugby.png",
    desc:
      "Competitive women’s rugby emphasizing safe contact, fitness, and fixtures across the region.",
    tryout: TBD("Grass field"),
  },
  {
    name: "Women’s Soccer",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/womens-soccer-club",
    img: "/clubs/WomensSoccer.png",
    desc:
      "Women’s club soccer with coached training, friendlies, and league matches.",
    tryout: TBD("Turf/grass field"),
  },
  {
    name: "Women’s Volleyball",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/womens-volleyball-club",
    img: "/clubs/WomensVolleyball.png",
    desc:
      "Women’s indoor volleyball with positional training and tournament competition.",
    tryout: TBD("SRC courts"),
  },
  {
    name: "Wrestling",
    href: "https://www.csun.edu/as/departments/sport-clubs/available-sports/wrestling-club",
    img: "/clubs/Wrestling.png",
    desc:
      "Folkstyle and freestyle fundamentals, live goes, and strength conditioning with optional competition.",
    tryout: TBD("Mat room"),
  },
];

export default function SportClubsPage() {

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

  const [dialog, setDialog] = React.useState<Club | null>(null);

  return (
    <Box sx={{ minHeight: "100vh"}}>
      <Header value="/ToroSRC/SportClubs" />

      <Container sx={{ pt: 3, pb: 8 }}>
        <Typography variant="h4" fontWeight={900} sx={{ color: "#fff", mb: 1 }}>
          Sport Clubs
        </Typography>
        <Typography sx={{ color: "rgba(255,255,255,0.95)", mb: 3 }}>
          Student led competitive and recreational organizations at CSUN. Clubs are separate from SRC classes and services.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
          }}
        >
          {clubs.map((c) => (
            <Card key={c.name} sx={{ bgcolor: "#fff", border: "3px solid rgba(0,0,0,0.12)", borderRadius: 3 }}>
              <CardActionArea component={Link} href={c.href} target="_blank" rel="noopener">
                <CardMedia component="img" height="140" image={c.img} alt={c.name} />
              </CardActionArea>
              <CardContent>
                <Typography variant="h6" fontWeight={900}>{c.name}</Typography>
                <Typography sx={{ mb: 1 }}>{c.desc}</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Button variant="contained" sx={btnSolid} onClick={() => setDialog(c)}>
                    Tryout Application
                  </Button>
                  <Button variant="outlined" sx={btnOutline} component={Link} href={c.href} target="_blank" rel="noopener">
                    Learn more
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Dialog open={!!dialog} onClose={() => setDialog(null)} fullWidth maxWidth="sm">
        <DialogTitle>Tryout Information — {dialog?.name}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.25}>
            <TextField label="Day/Time" value={dialog?.tryout.dayTime ?? ""} InputProps={{ readOnly: true }} />
            <TextField label="Location" value={dialog?.tryout.location ?? ""} InputProps={{ readOnly: true }} />
            <TextField label="Cost" value={dialog?.tryout.cost ?? ""} InputProps={{ readOnly: true }} />
            <TextField label="Notes" value={dialog?.tryout.notes ?? ""} multiline minRows={2} InputProps={{ readOnly: true }} />
            <Typography variant="body2">
              For the latest specifics (dates, times, fees), check the club page linked above.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(null)}>Close</Button>
          <Button variant="contained" sx={btnSolid} onClick={() => { setDialog(null); alert("Tryout added to your events"); }}>
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
