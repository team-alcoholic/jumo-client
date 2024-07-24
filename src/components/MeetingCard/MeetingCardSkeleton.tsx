"use client";

import { Avatar, Box, ListItemAvatar, ListItemText, Skeleton } from "@mui/material";
import { Meetings } from "../../app/meetings/page";
import { useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import { CardBox, DescriptionSpan } from "./StyledComponent";


export default function MeetingCardSkeleton() {
  const [visible, setVisible] = useState(false);

  // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => setVisible(entry.isIntersecting);
  useObserver({ target, onIntersect, threshold: 0.1 });

  return (
    <CardBox ref={target} sx={{overflow:'hidden'}}>
      <Box sx={{display:'flex',alignItems:'center',overflow:'hidden',width:'100%',padding:"10px"}}>
        <ListItemAvatar>
          <Skeleton variant="circular" width={40} height={40} />
        </ListItemAvatar>
        <Box>
          <Skeleton variant="text" width={400} />
          <Skeleton variant="text" width={400} />
        </Box>
      </Box>
      <DescriptionSpan>
        <Skeleton variant="text" width={300} />
      </DescriptionSpan>
    </CardBox>
  )
}