import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Box,
} from "@mui/material";
import {
  SentimentVeryDissatisfied,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";

interface MoodSelectorComponentProps {
  mood: string;
}

const MoodSelectorComponent: React.FC<MoodSelectorComponentProps> = ({
  mood,
}) => {
  return (
    <Card sx={{ marginTop: 2, padding: 1, borderRadius: 2, boxShadow: 3 }}>
      <CardHeader
        title={<Typography variant="h6">몸 컨디션</Typography>}
        sx={{ paddingBottom: 0, paddingTop: 0 }}
      />
      <CardContent sx={{ paddingBottom: 1, paddingTop: 1 }}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item>
            <Box color={mood === "tired" ? "primary.main" : "default"}>
              <SentimentVeryDissatisfied fontSize="large" />
            </Box>
          </Grid>
          <Grid item>
            <Box color={mood === "neutral" ? "primary.main" : "default"}>
              <SentimentSatisfied fontSize="large" />
            </Box>
          </Grid>
          <Grid item>
            <Box color={mood === "happy" ? "primary.main" : "default"}>
              <SentimentVerySatisfied fontSize="large" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MoodSelectorComponent;
