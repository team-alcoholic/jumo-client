import React from "react";
import { Box, Typography } from "@mui/material";
import { StyledChip } from "@/app/meetings/[mId]/StyledComponents";

interface NotesSectionProps {
  title: string;
  icon: React.ReactNode;
  notes: string[] | null;
  formattedDescription: React.ReactNode;
  score: number | null;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  title,
  icon,
  notes,
  formattedDescription,
  score,
}) => (
  <Box
    sx={{
      marginBottom: 2,
      padding: 2,
      borderRadius: 2,
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      backgroundColor: "#ffffff",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        paddingBottom: 0,
      }}
    >
      {icon}
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: "bold", marginLeft: 1 }}
      >
        {title}
        {score && ` - ${score}점`}
      </Typography>
    </Box>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, paddingTop: 1 }}>
      {notes?.map((note, index) => <StyledChip key={index} label={note} />)}
    </Box>
    <Typography variant="body1" paragraph sx={{ mt: 2, mb: 1 }}>
      {formattedDescription}
    </Typography>
  </Box>
);

export default NotesSection;
