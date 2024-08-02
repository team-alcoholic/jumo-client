"use client"

import MeetingCard from "@/components/MeetingCard/MeetingCard";
import useObserver from "@/hooks/useObserver";
import { Box, List, styled, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import useLocalStorage from "use-local-storage";
import MeetingCardSkeleton from "@/components/MeetingCard/MeetingCardSkeleton";
import UserFeedbackCard from "@/components/UserFeedbackCard/UserFeedbackCard";


const getMeetingList = async ({ pageParam=0 }) => {
  let response;
  if (pageParam===-1) return { meetings: [] };
  else response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meetings`, {
    params: { cursor: pageParam }
  });
  console.log(response.data);
  return response.data;
}

export default function MeetingsPage() {
  // 스크롤 위치 유지
  const [scrollY] = useLocalStorage("meeting-list-scroll", 0);
  useEffect(() => {
    if (+scrollY !== 0) window.scrollTo(0, +scrollY);
  }, [scrollY]);

  // useInfiniteQuery 설정
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
      queryKey: ["meetingList"],
      queryFn: getMeetingList,
      getNextPageParam: (lastPage: MeetingListResponse) => (lastPage.eof) ? -1 : lastPage.lastId ,
  });

  // IntersectionObserver API 설정: 페이지 마지막 요소 도달 시 다음 페이지 호출
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting && fetchNextPage();
  }
  useObserver({ target, onIntersect });


  // return
  return (
    <ContainerBox>
      <UserFeedbackCard />
      <Title>모임 목록</Title>
      {(()=>{
        switch(status){
          case 'error':
            return "error"
          case 'loading':
              return <List>
                {Array.from({ length: 30 }).map((_, i) => <MeetingCardSkeleton key={i} /> )}
              </List>
          case 'success':
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
            )
          default:
            return null
        }
      })()}
      <div ref={target} />
      {isFetchingNextPage && <div>
                {Array.from({ length: 30 }).map((_, i) => <MeetingCardSkeleton key={i} /> )}
              </div>}
    </ContainerBox>
  )
}

const ContainerBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
});

const Title = styled(Typography)({
  marginTop: '10px',
  padding: '0 10px',
  fontSize: '20px',
  color: 'gray'
});