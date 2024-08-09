import React from "react";
import { Typography } from "@mui/material";
import {
  TitleHeader,
  WhiskeyImage,
} from "@/app/tasting-notes/new/StyledComponent";

interface LiquorTitleProps {
  thumbnailImageUrl: string | null;
  koName: string;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  region: string | null;
  grapeVariety: string | null;
}

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
          variant="h6"
          style={{ fontWeight: "bold", color: "#424242" }}
        >
          {koName}
        </Typography>
        <Typography variant="subtitle1" style={{ color: "#757575" }}>
          {type && `${type}`}
          {type && abv && ", "}
          {abv && `도수 ${abv}`}
        </Typography>
        <Typography variant="subtitle2" style={{ color: "#757575" }}>
          {volume && `${volume}`}
          {volume && country && ", "}
          {country && `${country}`}
        </Typography>
        <Typography variant="subtitle2" style={{ color: "#757575" }}>
          {region && `${region}`}
          {region && grapeVariety && ", "}
          {grapeVariety && `${grapeVariety}`}
        </Typography>
      </div>
    </TitleHeader>
  );
};

export default LiquorTitle;
