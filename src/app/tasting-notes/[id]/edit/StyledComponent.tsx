"use client";

import { Avatar, Box, Button, styled, Tab, Tabs } from "@mui/material";

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
  marginTop: "0px",
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

// 스타일 적용된 Tabs 컴포넌트
export const StyledTabs = styled(Tabs)({
  borderBottom: "1px solid #ddd",
  marginBottom: "16px",
  "& .MuiTabs-indicator": {
    backgroundColor: "#00796b",
    height: "3px",
  },
});

// 스타일 적용된 Tab 컴포넌트
export const StyledTab = styled(Tab)({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "16px",
  color: "#555",
  padding: "12px 16px",
  "&.Mui-selected": {
    color: "#00796b",
  },
  "&:hover": {
    color: "#00796b",
  },
  "&.Mui-focusVisible": {
    outline: "none",
    backgroundColor: "transparent", // 클릭 시 배경색 변경 방지
  },
  "&:focus": {
    outline: "none",
    backgroundColor: "transparent", // 클릭 시 배경색 변경 방지
  },
  transition: "color 0.3s",
});
