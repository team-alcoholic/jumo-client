"use client";

import MeetingCard from "@/components/MeetingCard/MeetingCard";
import useObserver from "@/hooks/useObserver";
import {
  List,
  ButtonGroup,
  Button,
  styled,
  Typography,
  Box,
  Divider,
} from "@mui/material";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import useLocalStorage from "use-local-storage";
import MeetingCardSkeleton from "@/components/MeetingCard/MeetingCardSkeleton";
import UserFeedbackCard from "@/components/UserFeedbackCard/UserFeedbackCard";

// MeetingListResponse와 MeetingInfo 타입 정의 (필요한 경우 추가)

interface pageParamType {
  id: number | null;
  date: string | null;
}

const getMeetingList = async ({
  pageParam = { id: null, date: null },
  sort,
}: {
  pageParam: pageParamType;
  sort: String;
}) => {
  let response;
  if (pageParam.id === -1) return { meetings: [] };

  // 초기 요청 시 cursor-id와 cursor-date를 보내지 않음
  const params =
    pageParam.id === null
      ? {}
      : {
          "cursor-id": pageParam.id,
          "cursor-date": pageParam.date,
        };

  response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/meetings?sort=${sort}`,
    { params }
  );

  console.log(response.data);
  return response.data;
};

const SORT_OPTIONS = [
  { option: "created-at", label: "최신 작성순" },
  { option: "meeting-at", label: "모임 날짜순" },
  { option: "meeting-at-asc", label: "모임 임박순" },
];

export default function MeetingsPage() {
  // 스크롤 위치 유지
  const [scrollY] = useLocalStorage("meeting-list-scroll", 0);
  // useEffect(() => {
  //   if (+scrollY !== 0) window.scrollTo(0, +scrollY);
  // }, [scrollY]);

  // 정렬 옵션 상태 관리
  const [sortOption, setSortOption] = useState("created-at");

  // useInfiniteQuery 설정
  const { data, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["meetingList", sortOption], // sortOption을 queryKey에 포함
    queryFn: ({ pageParam }) => getMeetingList({ pageParam, sort: sortOption }),
    getNextPageParam: (lastPage: MeetingListResponse) =>
      lastPage.eof
        ? undefined
        : { id: lastPage.cursorId, date: lastPage.cursorDate },
  });

  // IntersectionObserver API 설정: 페이지 마지막 요소 도달 시 다음 페이지 호출
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting && fetchNextPage();
  };
  useObserver({ target, onIntersect });

  /** 정렬 옵션 변경 함수 */
  const handleSortChange = (newSort: string) => setSortOption(newSort);

  // return
  return (
    <ContainerBox>
      <UserFeedbackCard />
      <Title>모임 목록</Title>
      <Divider />
      <ButtonGroup
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "10px",
        }}
      >
        {SORT_OPTIONS.map(({ option, label }) => (
          <Button
            key={option}
            onClick={() => handleSortChange(option)}
            variant={sortOption === option ? "contained" : "outlined"}
          >
            {label}
          </Button>
        ))}
      </ButtonGroup>
      {(() => {
        switch (status) {
          case "error":
            return "error";
          case "loading":
            return (
              <List>
                {Array.from({ length: 30 }).map((_, i) => (
                  <MeetingCardSkeleton key={i} />
                ))}
              </List>
            );
          case "success":
            return (
              <List>
                {data.pages.map((page: MeetingListResponse, i) => (
                  <div key={i}>
                    {page.meetings.map((info: MeetingInfo) => (
                      <MeetingCard key={info.id} meeting={info} />
                    ))}
                  </div>
                ))}
              </List>
            );
          default:
            return null;
        }
      })()}
      <div ref={target} />
      {isFetchingNextPage && (
        <div>
          {Array.from({ length: 30 }).map((_, i) => (
            <MeetingCardSkeleton key={i} />
          ))}
        </div>
      )}
    </ContainerBox>
  );
}

const ContainerBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});

const Title = styled(Typography)({
  marginTop: "30px",
  padding: "0 10px",
  fontSize: "25px",
  color: "gray",
  textAlign: "center",
});
