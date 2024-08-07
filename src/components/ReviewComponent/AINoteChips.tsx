// components/AINoteChips.js

import React from "react";
import { Box, Chip } from "@mui/material";
import { styled } from "@mui/system";

const AIRecommendation = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "20px",
});

const StyledChip = styled(Chip)(({ selected }) => ({
  backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  // 호버링 에니메이션 젝서
  "&:hover": {
    backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  },
}));

const AINoteChips = ({ notes, selectedNotes, onNoteClick }) => {
  return (
    <AIRecommendation>
      {notes.map((note, index) => (
        <StyledChip
          key={index}
          label={note}
          onClick={() => onNoteClick(note)}
          selected={selectedNotes.has(note)}
        />
      ))}
    </AIRecommendation>
  );
};

export default AINoteChips;
