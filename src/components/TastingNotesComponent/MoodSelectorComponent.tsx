// components/MoodSelectorComponent.tsx

import React from "react";
import { Typography, Grid, IconButton } from "@mui/material";
import {
  SentimentVeryDissatisfied,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import { styled } from "@mui/system";

const MoodSection = styled("div")({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

interface MoodSelectorComponentProps {
  mood: string;
  setMood: (mood: string) => void;
}

const MoodSelectorComponent: React.FC<MoodSelectorComponentProps> = ({
  mood,
  setMood,
}) => {
  return (
    <MoodSection>
      <Typography variant="h6" gutterBottom>
        오늘의 몸 컨디션
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <IconButton
            onClick={() => setMood("tired")}
            color={mood === "tired" ? "primary" : "default"}
          >
            <SentimentVeryDissatisfied fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={() => setMood("neutral")}
            color={mood === "neutral" ? "primary" : "default"}
          >
            <SentimentSatisfied fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item>
          <IconButton
            onClick={() => setMood("happy")}
            color={mood === "happy" ? "primary" : "default"}
          >
            <SentimentVerySatisfied fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </MoodSection>
  );
};

export default MoodSelectorComponent;
