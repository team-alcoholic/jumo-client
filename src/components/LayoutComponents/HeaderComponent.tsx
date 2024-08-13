import { Box, Typography } from "@mui/material";

export default function HeaderComponent() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
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
          boxShadow: "0 2px 1px -1px gray",
          zIndex: 1000,
        }}
        style={{ backgroundColor: "white" }}
      >
        <Typography variant="h4">JUMO</Typography>
      </Box>
      <div style={{ width: "100%", height: "80px" }}></div>
    </div>
  );
}
