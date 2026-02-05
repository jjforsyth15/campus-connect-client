"use client";

import * as React from "react";
import { Box, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Header from "../../../components/SRC-Components/srcHeader";
import CreateParty, { Party } from "./FQfunctions/CreateParty";
import PartyList from "./FQfunctions/PartyList";
import StartQuest, { Quest } from "./FQfunctions/StartQuest";
import MilestonesPanel, { Milestone } from "./FQfunctions/Milestones";
import WorkoutDeck from "./FQfunctions/WorkoutDeck";
import { useRouter } from "next/navigation";
import { useAuthorize } from "@/lib/useAuthorize";

export default function FitQuestPage() {

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

  const [parties, setParties] = React.useState<Party[]>([]);
  const [quests, setQuests] = React.useState<Quest[]>([]);
  const [milestones, setMilestones] = React.useState<Milestone[]>([]);

  const addParty = (p: Party) => setParties((prev) => [...prev, p]);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header value="/ToroSRC/FitQuest" />
      <Container sx={{ pt: 3, pb: 8 }}>
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{ color: "#fff", mb: 1 }}
        >
          FitQuest
        </Typography>
        <Typography
          sx={{ color: "rgba(255,255,255,0.95)", mb: 3 }}
        >
          Interactive fitness feature. Build parties that follow the same
          training plan and compete in exercise categories with friends or set
          personal milestones.
        </Typography>

        <Grid container columnSpacing={{ xs: 0, md: 5 }} rowSpacing={3}>
          {/* Left column */}
          <Grid xs={12} md={6} sx={{ pr: { md: 1 } }}>
            <CreateParty
              onCreate={addParty}
              existingNames={parties.map((p) => p.name)}
            />
            <PartyList
              parties={parties}
              setParties={setParties}
              quests={quests}
              setQuests={setQuests}
            />
          </Grid>

          {/* Right column */}
          <Grid xs={12} md={6} sx={{ pl: { md: 1 } }}>
            <StartQuest
              parties={parties}
              quests={quests}
              setQuests={setQuests}
            />
            <Box sx={{ mt: 3 }}>
              <MilestonesPanel
                milestones={milestones}
                setMilestones={setMilestones}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Full-width workout card deck at bottom */}
        <Box sx={{ mt: 4 }}>
          <WorkoutDeck />
        </Box>
      </Container>
    </Box>
  );
}
