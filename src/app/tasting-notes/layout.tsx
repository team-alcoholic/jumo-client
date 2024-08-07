"use client";

import { Typography } from "@mui/material";
import { Header } from "./new/StyledComponent";

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
