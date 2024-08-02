import { Box, styled } from "@mui/material";
import emotionStyled from "@emotion/styled";
import Link from "next/link";

export const LinkButton = styled(Link)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  margin: "15px 10px",
  padding: "10px",
  minHeight: "150px",
  border: "0.5px solid",
  borderRadius: "5px",
  borderColor: "gray",
  color: "inherit",
  textDecoration: "none",
});

export const CardBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  margin: "15px 10px",
  padding: "5px",
  minHeight: "150px",
  border: "0.5px solid",
  borderRadius: "5px",
  borderColor: "gray",
  color: "inherit",
  textDecoration: "none",
});

export const DescriptionSpan = emotionStyled.span`
  padding: 5px 10px;
  word-break: break-word;
  color: gray;
  font-size: 15px;
`;
