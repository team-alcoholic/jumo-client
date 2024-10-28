"use client";

import useObserver from "@/hooks/useObserver";
import {
  List,
  styled,
  Box,
  Tabs,
  Tab,
  Backdrop,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from "@mui/material";

import axios from "axios";
import { SyntheticEvent, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import MeetingCardSkeleton from "@/components/MeetingCard/MeetingCardSkeleton";
import PurchaseNoteCard from "@/components/NoteCard/PurchaseNoteCard";
import TastingNoteCard from "@/components/NoteCard/TastingNoteCard";
import { ShoppingCartOutlined, WineBarOutlined } from "@mui/icons-material";
import { useRouter } from "next/navigation";

/** MeetingListResponse와 MeetingInfo 타입 정의 (필요한 경우 추가) */
interface pageParamType {
  id: number | null;
}
/** getMeetingList의 optionParams */
interface OptionParams {
  type: string;
}

/** 노트 유형 옵션 배열 */
const NOTES_TYPE_OPTIONS = [
  { option: "ALL", label: "모두" },
  { option: "PURCHASE", label: "구매했어요" },
  { option: "TASTING", label: "마셨어요" },
];

/** 노트 목록 API 호출 함수 */
const getNotesList = async ({
  pageParam = { id: null },
  options,
}: {
  pageParam: pageParamType;
  options: OptionParams;
}) => {
  let response;
  if (pageParam.id === -1) return { meetings: [] };

  const params =
    pageParam.id === null
      ? { limit: 20 }
      : {
          cursor: pageParam.id,
          limit: 20,
        };

  const queryString = Object.entries(params)
    .map(([key, value]) => {
      if (!value) return null;
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter((item) => item !== null)
    .join("&");

  console.log(queryString);

  switch (options.type) {
    case "ALL":
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes?${queryString}`,
        { params }
      );
      break;
    case "PURCHASE":
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/purchase?${queryString}`,
        { params }
      );
      break;
    case "TASTING":
      response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/tasting?${queryString}`,
        { params }
      );
      break;
  }

  return response ? response.data : null;
};

export default function NotesFeedPage() {
  const router = useRouter();

  // 노트 유형 옵션 상태 관리
  const [typeOption, setTypeOption] = useState("ALL");
  // 노트 작성 다이얼 옵션
  const [dialOpen, setDialOpen] = useState(false);

  // useInfiniteQuery 설정
  const { data, fetchNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["meetingList", typeOption],
    queryFn: ({ pageParam }) =>
      getNotesList({
        pageParam,
        options: {
          type: typeOption,
        },
      }),
    getNextPageParam: (lastPage: NoteList) =>
      lastPage.eof ? undefined : { id: lastPage.cursor },
  });

  // IntersectionObserver API 설정: 페이지 마지막 요소 도달 시 다음 페이지 호출
  const target = useRef(null);
  const onIntersect = ([entry]: IntersectionObserverEntry[]) => {
    return entry.isIntersecting && fetchNextPage();
  };
  useObserver({ target, onIntersect });

  /** 노트 유형 옵션 변경 함수 */
  const handleTypeOptionChange = (
    _event: SyntheticEvent,
    newTypeOption: string
  ) => setTypeOption(newTypeOption);

  /** 노트 작성 다이얼 옵션 */
  const dialAction = [
    {
      icon: <WineBarOutlined />,
      name: "마셨어요",
      onClick: () => {
        router.push("/tasting-notes/new");
      },
    },
    {
      icon: <ShoppingCartOutlined />,
      name: "구매했어요",
      onClick: () => {
        router.push("/purchase-notes/new");
      },
    },
  ];

  /** 다이얼 상태 변경 함수 */
  const handleDialOpen = () => {
    setDialOpen(true);
  };
  const handleDialClose = () => {
    setDialOpen(false);
  };

  // return
  return (
    <ContainerBox>
      {/* 노트 유형 옵션 선택 탭 */}
      <Tabs value={typeOption} onChange={handleTypeOptionChange}>
        {NOTES_TYPE_OPTIONS.map(({ option, label }) => (
          <Tab key={option} value={option} label={label} />
        ))}
      </Tabs>

      {/* 노트 목록 */}
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
                {data.pages.map((page: NoteList, i) => (
                  <div key={i}>
                    {page.notes.map((note: Note, idx) => {
                      if (note.type == "PURCHASE")
                        return (
                          <PurchaseNoteCard
                            key={idx}
                            note={note.purchaseNote}
                          />
                        );
                      if (note.type == "TASTING")
                        return (
                          <TastingNoteCard key={idx} note={note.tastingNote} />
                        );
                      return null;
                    })}
                  </div>
                ))}
              </List>
            );
          default:
            return null;
        }
      })()}
      <div ref={target} />

      {/* 로딩 시 보여질 스켈레톤 */}
      {isFetchingNextPage && (
        <div>
          {Array.from({ length: 30 }).map((_, i) => (
            <MeetingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 노트 작성 다이얼 */}
      <Backdrop open={dialOpen} />
      <SpeedDial
        sx={{
          position: "fixed",
          bottom: 72,
          right: 12,
          "& .MuiSpeedDial-fab": {
            // 메인 버튼 설정
            width: 45,
            height: 45,
          },
        }}
        icon={<SpeedDialIcon />}
        onClose={handleDialClose}
        onOpen={handleDialOpen}
        open={dialOpen}
        ariaLabel="dial"
      >
        {dialAction.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </ContainerBox>
  );
}

const ContainerBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
});
