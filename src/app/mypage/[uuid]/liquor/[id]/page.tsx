"use client";

import CreateNoteDial from "@/components/FloatingButton/CreateNoteDial";
import PageTitleComponent from "@/components/LayoutComponents/PageTitleComponent";
import PurchaseNoteCard from "@/components/NoteCard/PurchaseNoteCard";
import TastingNoteCard from "@/components/NoteCard/TastingNoteCard";
import { LiquorInfoComponent } from "@/components/NoteComponent/LiquorInfoComponent";
import { Backdrop, Stack, Typography } from "@mui/material";
import axios from "axios";
import { stat } from "fs";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "react-query";

const LIQUOR_URL = process.env.NEXT_PUBLIC_BASE_URL + "/liquors/";

const getUserLiquorNoteList = async (userUuid: string, liquorId: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/notes/user/${userUuid}`,
      { params: { liquorId } }
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error(err);
  }
};

export default function MypageLiquorPage({
  params: { uuid, id },
}: {
  params: { uuid: string; id: string };
}) {
  // 노트 작성 다이얼 옵션
  const [dialOpen, setDialOpen] = useState(false);
  // 다이얼 상태 변경 함수
  const handleDialOpen = () => {
    setDialOpen(true);
  };
  const handleDialClose = () => {
    setDialOpen(false);
  };

  // 노트 목록 api query
  const { data, status } = useQuery({
    queryKey: ["userLiquorNoteList", id],
    queryFn: () => getUserLiquorNoteList(uuid, id),
  });

  const liquor = useMemo(
    () =>
      data &&
      data[0][data[0].type === "PURCHASE" ? "purchaseNote" : "tastingNote"]
        .liquor,
    [data]
  );

  return (
    <Stack sx={{ gap: "20px" }}>
      <PageTitleComponent title="주류별 노트 목록" />

      {/* 페이지 내용 */}
      {status == "success" ? (
        <Stack sx={{ gap: "5px" }}>
          {/* 주류 정보 */}
          <Link
            href={LIQUOR_URL + liquor.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <LiquorInfoComponent
              thumbnailImageUrl={liquor.thumbnailImageUrl}
              koName={liquor.koName}
              type={liquor.type}
              abv={liquor.abv}
            />
          </Link>
          {/* 노트 목록 */}
          <Stack>
            {data.length ? (
              data.map((note: Note, idx: number) => {
                if (note.type === "PURCHASE")
                  return (
                    <PurchaseNoteCard key={idx} note={note.purchaseNote} />
                  );
                else
                  return <TastingNoteCard key={idx} note={note.tastingNote} />;
              })
            ) : (
              <Typography sx={{ fontSize: "15px", color: "gray" }}>
                작성된 노트가 없습니다.
              </Typography>
            )}
          </Stack>
        </Stack>
      ) : null}

      {/* 노트 작성 다이얼 */}
      <Backdrop open={dialOpen} />
      <CreateNoteDial
        dialOpen={dialOpen}
        handleDialOpen={handleDialOpen}
        handleDialClose={handleDialClose}
        liquorId={
          status == "success"
            ? data[0].type == "PURCHASE"
              ? data[0].purchaseNote.liquor.id
              : data[0].tastingNote.liquor.id
            : undefined
        }
        offset={false}
      />
    </Stack>
  );
}
