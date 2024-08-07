// components/TabContentComponent.js

import React from "react";
import { Typography, TextField } from "@mui/material";
import { styled } from "@mui/system";
import AINoteChips from "./AINoteChips"; // Import the AINoteChips component

const ContentContainer = styled("div")({
  padding: "10px",
});

const TabContentComponent = ({
  title,
  description,
  initialNotes,
  relatedNotes,
  selectedNotes,
  onNoteClick,
  score,
  setScore,
  memo,
  setMemo,
}) => {
  // Function to handle score input validation
  const handleScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      setScore(value);
    } else if (e.target.value === "") {
      setScore("");
    }
  };

  return (
    <ContentContainer>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <AINoteChips
        notes={[...initialNotes, ...relatedNotes]} // Combine initial and related notes
        selectedNotes={selectedNotes}
        onNoteClick={onNoteClick}
      />
      <Typography>{description}</Typography>

      {/* Score Input */}
      <TextField
        type="number"
        label="점수 (0-100)"
        value={score}
        onChange={handleScoreChange}
        inputProps={{ min: 1, max: 100 }}
        margin="normal"
        fullWidth
      />

      {/* Memo Input */}
      <TextField
        label="메모"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        margin="normal"
        fullWidth
        multiline
        rows={4}
      />
    </ContentContainer>
  );
};

export default TabContentComponent;
