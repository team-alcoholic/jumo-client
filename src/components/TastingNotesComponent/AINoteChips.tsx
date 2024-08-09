import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { styled } from "@mui/system";

const AIRecommendation = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "20px",
});

const StyledChip = styled(Chip)<{ selected: boolean }>(({ selected }) => ({
  backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  // 호버링 애니메이션 제거
  "&:hover": {
    backgroundColor: selected ? "#ffeb3b" : "#e0e0e0",
  },
}));

const NoNotesMessage = styled(Box)({
  textAlign: "center",
  margin: "20px 0",
  color: "#757575",
  fontSize: "16px",
});

interface AINoteChipsProps {
  notes: string[];
  selectedNotes: Set<string>;
  onNoteClick: (note: string) => void;
}

const AINoteChips: React.FC<AINoteChipsProps> = ({
  notes,
  selectedNotes,
  onNoteClick,
}) => {
  return (
    <AIRecommendation>
      {notes.length === 0 ? (
        <NoNotesMessage>
          😢 아직 해당 주류의 테이스팅 노트에 대한 정보가 없네요 ㅠㅠ 첫 번째로
          테이스팅 노트를 추가해주세요!
        </NoNotesMessage>
      ) : (
        notes.map((note, index) => (
          <StyledChip
            key={index}
            label={note}
            onClick={() => onNoteClick(note)}
            selected={selectedNotes.has(note)}
          />
        ))
      )}
    </AIRecommendation>
  );
};

export default AINoteChips;
