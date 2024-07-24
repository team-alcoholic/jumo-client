"use client"

import MeetingCard from "@/components/MeetingCard/MeetingCard";
import useObserver from "@/hooks/useObserver";
import { List } from "@mui/material";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "react-query";
import useLocalStorage from "use-local-storage";
import MeetingCardSkeleton from "@/components/MeetingCard/MeetingCardSkeleton";

export interface Meeting {
  id: number;
  uuid: string;
  name: string;
  status: string;
  meetingAt: string;
  fixAt: string;
  region: string;
  liquors: string;
  participatesMin: number|null;
  participatesMax: number|null;
  payment: number|null;
  byob: boolean;
  thumbnail: string;
  externalService: string;
}

interface MeetingResponse {
  meetings: Meeting[],
  lastId: number,
  eof: boolean
}

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
      getNextPageParam: (lastPage: MeetingResponse) => (lastPage.eof) ? -1 : lastPage.lastId ,
  });

  // IntersectionObserver API 설정: 페이지 마지막 요소 도달 시 다음 페이지 호출
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting && fetchNextPage();
  }
  useObserver({ target, onIntersect });

  return (
    <div>
      <h4 style={{ textAlign: "center", marginBottom: "0", marginTop: "20px" }}>모임 목록</h4>
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
                {data.pages.map((page: MeetingResponse, i) => (
                  <div key={i}>
                    {page.meetings.map((info: Meeting) => (
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
    </div>
  )
}