"use client";
import React from "react";
import { Button } from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";

const FloatingTastingNotesButton = styled(Button)`
  position: fixed;
  bottom: 140px;
  right: 20px;
  z-index: 9999;
  width: 100px;
  height: 40px;
  min-width: 0;
  padding: 0;
  background-color: rgba(186, 104, 200, 0.6);
  color: white;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: rgba(171, 71, 188, 0.7);
  }
`;

interface TastingNotesButtonProps {
  link: string;
}

const TastingNotesButton: React.FC<TastingNotesButtonProps> = ({ link }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  return (
    <FloatingTastingNotesButton onClick={handleClick}>
      <EditNoteIcon style={{ marginRight: "5px" }} />
      <span style={{ fontSize: "14px" }}>나도쓰기</span>
    </FloatingTastingNotesButton>
  );
};

export default TastingNotesButton;
