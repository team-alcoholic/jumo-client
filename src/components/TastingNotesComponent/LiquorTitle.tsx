import React from "react";
import { Typography } from "@mui/material";
import {
  TitleHeader,
  WhiskeyImage,
} from "@/app/tasting-notes/new/StyledComponent";

const LiquorTitle: React.FC<LiquorTitleProps> = ({
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
    <TitleHeader>
      <WhiskeyImage
        src={
          thumbnailImageUrl ||
          "https://img.freepik.com/premium-vector/alcohol-cocktail-hand-drawn-whiskey-sign-vector-art-illustration_218179-1949.jpg?w=1800"
        }
        alt="Whiskey Bottle"
      />
      <div>
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#424242",
            fontSize: { xs: "18px", md: "20px" },
          }}
        >
          {koName}
        </Typography>
        <Typography
          sx={{ color: "#757575", fontSize: { xs: "15px", md: "18px" } }}
        >
          {type && `${type}`}
          {type && abv && ", "}
          {abv && `도수 ${abv}`}
        </Typography>
        <Typography
          sx={{ color: "#757575", fontSize: { xs: "12px", md: "15px" } }}
        >
          {volume && `${volume}`}
          {volume && country && ", "}
          {country && `${country}`}
        </Typography>
        <Typography
          sx={{ color: "#757575", fontSize: { xs: "12px", md: "15px" } }}
        >
          {region && `${region}`}
          {region && grapeVariety && ", "}
          {grapeVariety && `${grapeVariety}`}
        </Typography>
      </div>
    </TitleHeader>
  );
};

export default LiquorTitle;
