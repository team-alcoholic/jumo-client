"use client";

import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import styled from "@emotion/styled";
import { ThumbUp, ThumbUpOutlined } from "@mui/icons-material";

interface LikeButtonProps {
  isLiked: boolean;
  user: User;
  note: Note;
}

const LikeButtonNotClicked = styled(Button)({
  // position: "fixed",
  // bottom: "90px",
  // right: "20px",
  // zIndex: "9999",
  width: "45px",
  height: "45px",
  minWidth: "0",
  padding: "0",
  backgroundColor: "#fafafa",
  color: "black",
  borderRadius: "9999px",
  boxShadow: "0 2px 2px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // "&:hover": {
  //   backgroundColor: "rgba(171, 71, 188, 0.7)"
  // }
});

const LikeButtonClicked = styled(Button)({
  width: "45px",
  height: "45px",
  minWidth: "0",
  padding: "0",
  backgroundColor: "#fafafa",
  color: "black",
  borderRadius: "9999px",
  boxShadow: "0 2px 2px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const LikeButton: React.FC<LikeButtonProps> = ({ isLiked, user, note }) => {
  const [liked, setLiked] = useState(isLiked);

  // const handleClose = () => {
  //   setCopied(false);
  // };

  const handleClick = () => {};

  return (
    <>
      {liked ? (
        <LikeButtonClicked onClick={handleClick}>
          <ThumbUp fontSize="small" sx={{ color: "#ff3421" }} />
        </LikeButtonClicked>
      ) : (
        <LikeButtonNotClicked onClick={handleClick}>
          <ThumbUpOutlined fontSize="small" />
        </LikeButtonNotClicked>
      )}

      {/* <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={handleClose}
        message="노트에 좋아요를 남겼습니다!"
      /> */}
    </>
  );
};

export default LikeButton;
