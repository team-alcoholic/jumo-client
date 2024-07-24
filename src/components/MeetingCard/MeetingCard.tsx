"use client";

import { Avatar, Box, ListItemAvatar, ListItemText } from "@mui/material";
import { Meeting } from "../../app/meetings/page";
import { useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import useLocalStorage from "use-local-storage";
import { DescriptionSpan, LinkButton } from "./StyledComponent";

const formatDateTime = (datetime: string) => {
  return `${datetime.slice(5, 7)}/${datetime.slice(8, 10)}`;
}


export default function MeetingCard(
  { meeting }: { meeting: Meeting}
) {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useLocalStorage("meeting-list-scroll", 0);

  // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => setVisible(entry.isIntersecting);
  useObserver({ target, onIntersect, threshold: 0.1 });

  return (
    <LinkButton ref={target} onClick={() => setScrollY(window.scrollY)} href={`/meetings/${meeting.id}`}>
        {visible && (
          <Box style={{display:'flex',alignItems:'center',overflow:'hidden',width:'100%'}}>
            <ListItemAvatar>
              <Avatar alt="thumbnail" src={meeting.thumbnail} slotProps={{img:{loading: "lazy"}}} />
            </ListItemAvatar>
            <ListItemText
              primary={`${meeting.id}: ${meeting.name}`}
              secondary={`${formatDateTime(meeting.meetingAt)} ${meeting.region}`}
              primaryTypographyProps={{style:{overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}}
            />
          </Box>
        )}
      <DescriptionSpan>
        {visible && `${meeting.liquors}, 회비 ${meeting.payment}원`}
      </DescriptionSpan>
    </LinkButton>
  )
}