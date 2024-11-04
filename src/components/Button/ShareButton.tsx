"use client";
import React, { useState } from "react";
import { Button, Snackbar } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import styled from "@emotion/styled";

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
}

const FloatingShareButton = styled(Button)({
  // position: "fixed",
  // bottom: "90px",
  // right: "20px",
  // zIndex: "9999",
  width: "100px",
  height: "40px",
  minWidth: "0",
  padding: "0",
  // backgroundColor: "whitesmoke",
  color: "black",
  borderRadius: "20px",
  boxShadow: "0 2px 2px rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // "&:hover": {
  //   backgroundColor: "rgba(171, 71, 188, 0.7)"
  // }
});
const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
  };

  const handleClose = () => {
    setCopied(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        console.log("공유 성공");
      } catch (error) {
        console.error("공유 실패:", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <>
      <CopyToClipboard text={url} onCopy={handleCopy}>
        <FloatingShareButton onClick={handleShare}>
          <ShareIcon style={{ marginRight: "5px" }} />
          <span style={{ fontSize: "14px" }}>공유하기</span>
        </FloatingShareButton>
      </CopyToClipboard>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={handleClose}
        message="링크가 복사되었습니다!"
      />
    </>
  );
};

export default ShareButton;
