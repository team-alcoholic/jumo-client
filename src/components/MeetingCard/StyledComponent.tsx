import { Box, ListItemText, styled, Typography } from "@mui/material";
import emotionStyled from "@emotion/styled";
import Link from "next/link";

export const LinkButton = styled(Link)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "5px",
  margin: "15px 10px",
  padding: "10px 20px",
  minHeight: "130px",
  border: "0.5px solid",
  borderRadius: "5px",
  borderColor: "gray",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const CardBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  margin: "15px 10px",
  padding: "5px",
  minHeight: "130px",
  border: "0.5px solid",
  borderRadius: "5px",
  borderColor: "gray",
  color: "inherit",
  textDecoration: "none",
});

export const ListItemHeaderBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  gap: "5px",
});

export const ListItemTextBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: "8px",
});

export const ListItemTextTypo = styled(Typography)({
  fontSize: "14px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

export const DescriptionBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "5px",
  padding: "5px 0",
});

export const DescriptionContentBox = styled(Box)({
  padding: "0 2px",
  wordBreak: "break-word",
  color: "gray",
  fontSize: "15px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
