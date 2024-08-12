import { Box, Typography } from "@mui/material";

export default function KeyValueInfoComponent({
  keyContent,
  valueContent,
  keyMinWidth,
}: KeyValueInfoProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
      <Typography sx={{ minWidth: `${keyMinWidth}px`, color: "gray" }}>
        {keyContent}
      </Typography>
      <Typography>{valueContent}</Typography>
    </Box>
  );
}
