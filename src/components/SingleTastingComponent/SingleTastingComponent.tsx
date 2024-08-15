import { Box, Divider, Stack, Typography } from "@mui/material";

export default function SingleTastingComponent({
  keyContent,
  valueContent,
  detailContent,
  keyMinWidth,
}: SingleTastingProps) {
  return (
    <Stack sx={{ gap: "2px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: "20px",
        }}
      >
        <Typography
          sx={{
            minWidth: `${keyMinWidth}px`,
            color: "gray",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "15px",
          }}
        >
          {keyContent}
        </Typography>
        <Typography
          sx={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            fontSize: "14px",
          }}
        >
          {valueContent}
        </Typography>
      </Box>
      {/* <Typography
        sx={{
          paddingLeft: "10px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          fontSize: "14px",
        }}
      >
        {detailContent}
      </Typography> */}
    </Stack>
  );
}
