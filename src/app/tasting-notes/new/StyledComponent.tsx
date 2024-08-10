"use client";

import { Avatar, Box, Button, styled } from "@mui/material";

export const Header = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: "100%",
  height: 80,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(255, 255, 255, 1)",
  borderBottom: "1px solid #D9D9D9",
  boxShadow: theme.shadows[1],
  zIndex: 1000,
}));

export const Container = styled(Box)({
  maxWidth: "800px",
  padding: "10px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
});

export const TitleHeader = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
  borderBottom: "2px solid #eee",
  paddingBottom: "10px",
});

export const WhiskeyImage = styled(Avatar)({
  width: "100px",
  height: "100px",
  marginRight: "20px",
});

export const TabContent = styled(Box)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

export const SaveButton = styled(Button)({
  marginTop: "20px",
  width: "100%",
  padding: "10px",
  backgroundColor: "#3f51b5",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});
