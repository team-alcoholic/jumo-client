// components/TotalScoreComponent.js

import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import { styled } from "@mui/system";

const TotalSection = styled(Box)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const TotalScoreComponent = ({ totalScore, overallNote, setOverallNote }) => {
  return (
    <TotalSection>
      <Typography variant="h6" gutterBottom>
        총점 및 총평
      </Typography>
      <TextField
        label="총점"
        value={totalScore || ""}
        InputProps={{
          readOnly: true,
        }}
        margin="normal"
        fullWidth
      />
      <TextField
        label="총평"
        value={overallNote}
        onChange={(e) => setOverallNote(e.target.value)}
        margin="normal"
        fullWidth
        multiline
        rows={4}
      />
    </TotalSection>
  );
};

export default TotalScoreComponent;
