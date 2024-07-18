"use client";

import { Avatar, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Meeting } from "../app/meetings/page";
import { useRef, useState } from "react";
import useObserver from "@/hook/useObserver";
import Link from "next/link";
import useLocalStorage from "use-local-storage";
// import { LazyLoadImage } from "react-lazy-load-image-component";
import styles from "../style/meetings.module.css";

const formatDateTime = (datetime: string) => {
  return `${datetime.slice(5, 7)}/${datetime.slice(8, 10)}`;
}


export default function MeetingCard(
  { meeting }: { key: number, meeting: Meeting}
) {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useLocalStorage("meeting-list-scroll", 0);

  // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting ? setVisible(true) : setVisible(false);
  }
  useObserver({ target, onIntersect, threshold: 0.1 });

  return (
    <Link
      href={`/meetings/${meeting.id}`}
      onClick={() => setScrollY(window.scrollY)}
      className={styles.container}
    >
      <ListItem ref={target} className={styles.item}>
        {visible && (
          <>
            <ListItemAvatar>
              <Avatar alt="thumbnail" src={meeting.thumbnail} />
              {/* <LazyLoadImage alt="thumbnail" src={meeting.thumbnail} width="40px" height="auto" /> */}
            </ListItemAvatar>
            <ListItemText
              primary={`${meeting.id}: ${meeting.name}`}
              secondary={`${formatDateTime(meeting.meetingAt)} ${meeting.region}`}
            />
          </>
        )}
      </ListItem>
      <span className={styles.description}>
        {`${meeting.liquors}, 회비 ${meeting.payment}원`}
      </span>
    </Link>
  )
}