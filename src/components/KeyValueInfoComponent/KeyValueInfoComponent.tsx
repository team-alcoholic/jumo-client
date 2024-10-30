import { Box, Typography } from "@mui/material";

export default function KeyValueInfoComponent({
  keyContent,
  valueContent,
  keyMinWidth,
}: KeyValueInfoProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <Typography
        sx={{
          fontSize: { xs: "15px", md: "18px" },
          minWidth: `${keyMinWidth}px`,
          color: "gray",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {keyContent}
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "15px", md: "18px" },
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
        }}
      >
        {valueContent}
      </Typography>
    </Box>
  );
}
