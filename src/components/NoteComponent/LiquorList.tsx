import React from "react";
import { Avatar, Box, Typography } from "@mui/material";
import { TitleHeader } from "@/app/tasting-notes/new/StyledComponent";

export const LiquorList: React.FC<LiquorTitleProps> = ({
  thumbnailImageUrl,
  koName,
  type,
  abv,
  volume,
  country,
  region,
  grapeVariety,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        borderBottom: "2px solid #eee",
        paddingBottom: "10px",
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      <Avatar
        src={
          thumbnailImageUrl ||
          "https://img.freepik.com/premium-vector/alcohol-cocktail-hand-drawn-whiskey-sign-vector-art-illustration_218179-1949.jpg?w=1800"
        }
        alt="liquor image"
        sx={{ width: "60px", height: "60px", margin: "0 10px" }}
      />
      <div style={{ maxWidth: "100%" }}>
        <Typography
          style={{
            fontWeight: "bold",
            color: "#424242",
            fontSize: "15px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {koName}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "#757575" }}>
          {type && `${type}`}
          {type && abv && ", "}
          {abv && `도수 ${abv}`}
        </Typography>
      </div>
    </Box>
  );
};
