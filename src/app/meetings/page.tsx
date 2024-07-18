"use client"

import useObserver from "@/hook/useObserver";
import { Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import axios from "axios";
import { useRef } from "react";
import { useInfiniteQuery } from "react-query";
// import { LazyLoadImage } from "react-lazy-load-image-component";

interface MeetingsPage {
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

const getMeetingList = async ({ pageParam=0 }) => {
  let result;
  if (pageParam===-1) return [];
  if (pageParam===0) result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meeting/list/latest`);
  else result = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/meeting/list/latest/${pageParam}`);
  console.log(result.data);
  return result.data;
}

export default function MeetingsPage() {
  // useInfiniteQuery 설정
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery(
    "meetingList",
    getMeetingList,
    { getNextPageParam: (lastPage) => (lastPage.length) ? lastPage[lastPage.length-1].id : -1 }
  );

  // IntersectionObserver API 설정: 페이지 마지막 요소 도달 시 다음 페이지 호출
  const bottom = useRef(null);
  useObserver({
    target: bottom,
    onIntersect: ([entry]: IntersectionObserverEntry[]) => entry.isIntersecting && fetchNextPage()
  });

  return (
    <div>
      {status === "loading" && "불러오는 중..."}
      {status === "error" && "에러"}
      {status === "success" &&
        <List>
          {data.pages.map((page, i) => (
            <div key={i}>
              {page.map((meeting:MeetingsPage) => (
                <ListItem key={meeting.id}>
                  <ListItemAvatar>
                    <Avatar alt="thumbnail" src={meeting.thumbnail} />
                    {/* <LazyLoadImage alt="thumbnail" src={meeting.thumbnail} width="40px" height="auto" /> */}
                  </ListItemAvatar>
                  <ListItemText primary={meeting.name} secondary={`${meeting.id} ${meeting.meetingAt}`} />
                </ListItem>))}
            </div>
          ))}
        </List>}

      <div ref={bottom} />
      {isFetchingNextPage && "이어서 불러오는 중..."}
    </div>
  )
}