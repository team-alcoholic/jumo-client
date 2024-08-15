import React from "react";
import { Box, Typography } from "@mui/material";
import { StyledChip } from "@/app/meetings/[mId]/StyledComponents";

interface NotesSectionProps {
  title: string;
  icon: React.ReactNode;
  notes: string[] | null;
  formattedDescription: React.ReactNode | null;
  score: number | null;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  title,
  icon,
  notes,
  formattedDescription,
  score,
}) => {
  const isEmpty =
    (!notes || notes.length === 0) && !formattedDescription && score === null;
  return (
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
          {score !== null && ` - ${score}점`}
        </Typography>
      </Box>
      {isEmpty ? (
        <Typography
          variant="body1"
          paragraph
          sx={{
            fontSize: "1.2rem",
            color: "#757575",
            textAlign: "center",
            marginTop: 2,
            marginBottom: 1,
          }}
        >
          아직 리뷰가 없네요
        </Typography>
      ) : (
        <>
          <Box
            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, paddingTop: 1 }}
          >
            {notes?.map((note, index) => (
              <StyledChip key={index} label={note} />
            ))}
          </Box>
          {formattedDescription && (
            <Typography variant="body1" paragraph sx={{ mt: 2, mb: 1 }}>
              {formattedDescription}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default NotesSection;
