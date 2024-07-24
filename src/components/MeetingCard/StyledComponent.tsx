import { styled } from "@mui/material";
import emotionStyled from "@emotion/styled";
import Link from "next/link";


export const LinkButton = styled(Link)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  margin: '15px 10px',
  padding: '5px',
  minHeight: "100px",
  border: '1px solid',
  borderRadius: '5px',
  color: 'inherit',
  textDecoration:'none',
})

export const DescriptionSpan = emotionStyled.span`
  padding: 5px 20px;
  white-space: normal;
  word-break: break-word;
`