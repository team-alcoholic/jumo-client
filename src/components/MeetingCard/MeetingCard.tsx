"use client";

import { Avatar, Box, ListItemAvatar, ListItemText } from "@mui/material";
import { useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import useLocalStorage from "use-local-storage";
import { DescriptionSpan, LinkButton } from "./StyledComponent";
import { formatDate } from "@/utils/format";
import { COMMUNITY_NAME } from "@/constants/communityNames";

export default function MeetingCard({ meeting }: { meeting: MeetingInfo }) {
  const [visible, setVisible] = useState(false);
  const [scrollY, setScrollY] = useLocalStorage("meeting-list-scroll", 0);

  // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) =>
    setVisible(entry.isIntersecting);
  useObserver({ target, onIntersect, threshold: 0.1 });

  const externalServiceName =
    meeting.externalService &&
    COMMUNITY_NAME.hasOwnProperty(meeting.externalService)
      ? COMMUNITY_NAME[meeting.externalService]
      : "";

  return (
    <LinkButton
      ref={target}
      onClick={() => setScrollY(window.scrollY)}
      href={`/meetings/${meeting.id}`}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {visible && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
            width: "100%",
          }}
        >
          <ListItemAvatar>
            <Avatar
              alt="thumbnail"
              src={meeting.thumbnail}
              slotProps={{ img: { loading: "lazy" } }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${meeting.name}`}
            secondary={`${meeting.region} | ${meeting.meetingAt?.length ? formatDate(meeting.meetingAt) : "일시 미정"}`}
            primaryTypographyProps={{
              style: {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
            secondaryTypographyProps={{
              style: {
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              },
            }}
          />
        </Box>
      )}
      <DescriptionSpan>
        {externalServiceName}
        {visible &&
          (meeting.liquors || meeting.payment
            ? `, ${meeting.liquors ? meeting.liquors + " 모임" : ""}${meeting.liquors && meeting.payment ? ", " : ""}${meeting.payment ? `회비 ${meeting.payment}원` : ""}`
            : ", 상세 정보를 확인해보세요.")}
      </DescriptionSpan>
    </LinkButton>
  );
}
