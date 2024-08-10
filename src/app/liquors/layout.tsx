"use client";

import { Box, styled, Typography } from "@mui/material";

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "white" }}>
        <Typography variant="h4">JUMO</Typography>
      </Header>
      <div style={{ width: "100%", height: "80px" }}></div>
      {children}
    </div>
  );
}

const Header = styled(Box)(({ theme }) => ({
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
