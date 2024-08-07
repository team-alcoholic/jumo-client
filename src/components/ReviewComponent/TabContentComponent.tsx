// components/ReviewComponent.js
import React, { useState } from "react";
import { Typography, TextField, Button, Box } from "@mui/material";
import { Add, RocketLaunch } from "@mui/icons-material"; // Import the Add icon
import { styled } from "@mui/system";
import AINoteChips from "./AINoteChips"; // Import the AINoteChips component

const ContentContainer = styled("div")({
  padding: "10px",
});

const TabContentComponent = ({
  title,
  description,
  relatedNotes,
  selectedNotes,
  onNoteClick,
  score,
  setScore,
  memo,
  setMemo,
  onAddNote,
}) => {
  const [newNote, setNewNote] = useState("");

  // Function to handle score input validation
  const handleScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 0 && value <= 100) {
      setScore(value);
    } else if (e.target.value === "") {
      setScore("");
    }
  };

  // Function to handle adding a new note
  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(newNote.trim());
      setNewNote(""); // Clear input after adding
    }
  };

  // Function to handle Enter key press for adding a note
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNote();
    }
  };

  return (
    <ContentContainer>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        gap={1}
        marginBottom={2}
      >
        <RocketLaunch style={{ color: "#ff5722", fontSize: "1rem" }} />
        <Typography
          variant="p4" // Use a larger and more prominent variant
          style={{
            fontWeight: "bold",
            color: "grey",
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          테이스팅 노트 AI v1.0
        </Typography>
      </Box>
      <AINoteChips
        notes={relatedNotes} // Use relatedNotes directly
        selectedNotes={selectedNotes}
        onNoteClick={onNoteClick}
      />

      {/* New Note Input and Button in a Row */}
      <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
        <TextField
          label="없는 노트 추가"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button
          variant="outlined" // Use the 'outlined' variant for a visible border
          onClick={handleAddNote}
          style={{
            height: "56px",
            minWidth: "56px",
            padding: 0,
            borderColor: "skyblue", // Set the border color to match the theme
            color: "#424242", // Set icon color to black
          }}
        >
          <Add />
        </Button>
      </Box>

      <Typography>{description}</Typography>

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
