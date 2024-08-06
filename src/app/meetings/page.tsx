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
  FormGroup,
  FormControlLabel,
  Checkbox,
  CheckboxProps,
} from "@mui/material";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
// import useLocalStorage from "use-local-storage";
import MeetingCardSkeleton from "@/components/MeetingCard/MeetingCardSkeleton";
import UserFeedbackCard from "@/components/UserFeedbackCard/UserFeedbackCard";

// MeetingListResponse와 MeetingInfo 타입 정의 (필요한 경우 추가)
interface pageParamType {
  id: number | null;
  date: string | null;
}
/** getMeetingList의 optionParams */
interface OptionParams {
  sort: string;
  liquors: string;
}

/** 정렬 옵션 배열 */
const SORT_OPTIONS = [
  { option: "created-at", label: "최신 작성순" },
  { option: "meeting-at", label: "모임 날짜순" },
  { option: "meeting-at-asc", label: "모임 임박순" },
];
/** 주종 필터 옵션 배열 */
const LIQUORS_FILTER_OPTIONS = [
  { option: "wine", label: "와인" },
  { option: "whisky", label: "위스키" },
];

/** 모임 목록 API 호출 함수 */
const getMeetingList = async ({
  pageParam = { id: null, date: null },
  options,
}: {
  pageParam: pageParamType;
  options: OptionParams;
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

  const queryString = Object.entries(options)
    .map(([key, value]) => {
      if (!value) return null;
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter((item) => item !== null)
    .join("&");

  response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/meetings?${queryString}`,
    { params }
  );

  console.log(response.data);
  return response.data;
};

export default function MeetingsPage() {
  // 스크롤 위치 유지
  // const [scrollY] = useLocalStorage("meeting-list-scroll", 0);
  // useEffect(() => {
  //   if (+scrollY !== 0) window.scrollTo(0, +scrollY);
  // }, [scrollY]);

  // 정렬 옵션 상태 관리
  const [sortOption, setSortOption] = useState("created-at");
  // 필터 상태 관리
  const [liquorsFilter, setLiquorsFilter] = useState<string[]>([]);

  // useInfiniteQuery 설정
  const { data, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    // 정렬 및 필터 정보를 queryKey에 포함
    queryKey: ["meetingList", sortOption, liquorsFilter],
    queryFn: ({ pageParam }) =>
      getMeetingList({
        pageParam,
        options: {
          sort: sortOption,
          liquors: liquorsFilter.join(","),
        },
      }),
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

  /** 주류 필터 옵션 변경 함수 */
  const handleLiquorsFilterChange = (option: string) => {
    setLiquorsFilter((prevFilter) => {
      if (prevFilter.includes(option))
        return prevFilter.filter((item) => item !== option);
      else return [...prevFilter, option];
    });
  };

  // return
  return (
    <ContainerBox>
      {/* 서비스 소개 및 유저 피드백 관련 컴포넌트 */}
      <UserFeedbackCard />

      {/* 페이지 제목 */}
      <Title>모임 목록</Title>
      <Divider />

      {/* 정렬 옵션 */}
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

      {/* 필터 */}
      <FilterBox>
        <FilterFormGroup>
          {LIQUORS_FILTER_OPTIONS.map(({ option, label }) => (
            <FilterFormControlLabel
              key={option}
              control={
                <BpCheckbox
                  onClick={() => handleLiquorsFilterChange(option)}
                  checked={liquorsFilter.includes(option)}
                />
              }
              label={label}
            />
          ))}
        </FilterFormGroup>
      </FilterBox>

      {/* 모임 목록 */}
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

const FilterBox = styled(Box)({
  // marginTop: "30px",
});

const FilterFormGroup = styled(FormGroup)({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
});

const FilterFormControlLabel = styled(FormControlLabel)({
  color: "gray",
});

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 0 0 1px rgb(16 22 26 / 40%)"
      : "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: theme.palette.mode === "dark" ? "#394b59" : "#f5f8fa",
  backgroundImage:
    theme.palette.mode === "dark"
      ? "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))"
      : "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: "#137cbd",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
});

// Inspired by blueprintjs
function BpCheckbox(props: CheckboxProps) {
  return (
    <Checkbox
      sx={{
        "&:hover": { bgcolor: "transparent" },
      }}
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ "aria-label": "Checkbox demo" }}
      {...props}
    />
  );
}
