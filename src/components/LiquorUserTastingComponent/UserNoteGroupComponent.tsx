import { Stack, Typography } from "@mui/material";

export default function UserNoteGroupComponent() {
  return (
    <Stack sx={{ marginBottom: "10px", padding: "20px 0", gap: "15px" }}>
      {/* 소제목 */}
      <Typography
        sx={{
          fontSize: "12px",
          color: "gray",
          textAlign: "center",
        }}
      >
        내가 감상한 주류
      </Typography>
    </Stack>
  );
}
