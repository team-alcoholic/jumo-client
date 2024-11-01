"use client";

import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  styled,
} from "@mui/material";
import { useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import Link from "next/link";

export default function NoteCardSkeleton() {
  // const [visible, setVisible] = useState(false);

  // // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  // const target = useRef(null);
  // const onIntersect = ([entry]: IntersectionObserverEntry[]) =>
  //   setVisible(entry.isIntersecting);
  // useObserver({ target, onIntersect, threshold: 0.1 });

  return (
    <StyledBox>
      <Stack>
        <Skeleton variant="text" width={300} />
        <Skeleton variant="text" width={100} />
      </Stack>

      <Skeleton
        variant="rectangular"
        width="100%"
        sx={{
          aspectRatio: "1/1",
          height: "auto",
        }}
      />

      <Stack>
        <Skeleton variant="text" width={300} />
        <Skeleton variant="text" width={300} />
      </Stack>
    </StyledBox>
  );
}

const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "5px",
  margin: "15px 0",
  padding: "15px 15px",
  minHeight: "150px",
  borderRadius: "5px",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  backgroundColor: "#ffffff",
  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
});
