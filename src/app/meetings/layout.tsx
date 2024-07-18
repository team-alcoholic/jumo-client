import { Typography } from "@mui/material";
import { Header } from "./StyledComponents";

export default function MeetingsLayout({ children }: { children: React.ReactNode}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header style={{ backgroundColor: "white" }}>
        <Typography variant="h4">JUMO</Typography>
      </Header>
      {children}
    </div>
  );
}