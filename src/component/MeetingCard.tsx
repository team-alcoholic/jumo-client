"use client";

import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Meeting } from "../app/meetings/page";
import { useRef, useState } from "react";
import useObserver from "@/hook/useObserver";
import Link from "next/link";
// import { LazyLoadImage } from "react-lazy-load-image-component";

export default function MeetingCard(
  { key, meeting }: { key: number, meeting: Meeting}
) {
  const [visible, setVisible] = useState(false);

  // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting ? setVisible(true) : setVisible(false);
  }
  useObserver({ target, onIntersect, threshold: 0.01 });


  return (
    <Link href={`/meetings/${meeting.id}`} key={meeting.id}>
      <ListItem ref={target} sx={{ minHeight: "75px" }}>
        {visible && (
          <>
            <ListItemAvatar>
              <Avatar alt="thumbnail" src={meeting.thumbnail} />
              {/* <LazyLoadImage alt="thumbnail" src={meeting.thumbnail} width="40px" height="auto" /> */}
            </ListItemAvatar>
            <ListItemText primary={meeting.name} secondary={`${meeting.id} ${meeting.region} ${meeting.meetingAt}`} />
          </>
        )}
      </ListItem>
    </Link>
  )
}