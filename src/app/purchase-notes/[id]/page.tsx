import React, { Fragment } from "react";
import {
  Box,
  Container,
  Divider,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { formatDate, formatFullDate } from "@/utils/format";
import EditButton from "@/components/TastingNotesComponent/EditButton";
import { notFound } from "next/navigation";
import ShareButton from "@/components/Button/ShareButton";
import { Metadata } from "next";
import Link from "next/link";
import TastingNotesButton from "@/components/Button/tastingNotesButton";
import PageTitleComponent from "@/components/LayoutComponents/PageTitleComponent";
import { LiquorList } from "@/components/NoteComponent/LiquorList";
import ImageSlider from "@/components/ImageSlider/ImageSlider";
import UserInfoComponent from "@/components/NoteComponent/UserInfoComponent";
import { LiquorInfoComponent } from "@/components/NoteComponent/LiquorInfoComponent";
import KeyValueInfoComponent from "@/components/KeyValueInfoComponent/KeyValueInfoComponent";

const NOTE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v2/notes/";
const NOTE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/purchase-notes/";
const LIQUOR_URL = process.env.NEXT_PUBLIC_BASE_URL + "/liquors/";

/** 노트 상세 조회 API 호출 함수 */
async function getNote(id: string): Promise<Note> {
  const res = await fetch(NOTE_API_URL + id, {
    next: { revalidate: 1, tags: ["review"] },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw notFound();
    }
    throw new Error("Failed to fetch data");
  }
  return await res.json();
}

/** 메타데이터 생성 함수 */
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const note = await getNote(params.id);

  const { user, createdAt, liquor } = note.purchaseNote;

  const title = `${liquor.koName} 구매 노트`;
  const description = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 구매 노트`;
  const url = `${NOTE_URL}${params.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url:
            liquor.thumbnailImageUrl ||
            "https://github.com/user-attachments/assets/36420b2d-e392-4b20-bcda-80d7944d9658",
          width: 1200,
          height: 630,
          alt: "liquor image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        liquor.thumbnailImageUrl ||
          "https://github.com/user-attachments/assets/36420b2d-e392-4b20-bcda-80d7944d9658",
      ],
    },
  };
}

export default async function PurchaseNotePage({
  params: { id },
}: PostPageProps) {
  const note = await getNote(id);

  const { content, user, createdAt, liquor } = note.purchaseNote;

  const text = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 리뷰`;

  const shareData = {
    title: `${liquor.koName} 테이스팅 노트`,
    text,
    url: `${NOTE_URL}${id}`,
  };

  return (
    <Stack sx={{ marginBottom: "50px" }}>
      <PageTitleComponent title="구매 노트" />
      <Stack
        maxWidth="sm"
        sx={{
          margin: "10px 0",
          padding: 0,
          gap: "30px",
        }}
      >
        {/* 사용자 정보 */}
        <Stack sx={{ gap: "10px" }}>
          <UserInfoComponent
            user={user}
            createdAt={note.purchaseNote.createdAt}
          />
          <Divider />
        </Stack>
        {/* </Stack> */}

        {/* 이미지 */}
        {note.purchaseNote.noteImages && note.purchaseNote.noteImages.length ? (
          <Box>
            <ImageSlider
              images={note.purchaseNote.noteImages.map(
                (image) => image.fileUrl
              )}
            />
          </Box>
        ) : null}
        {/* 
      <Stack
        maxWidth="sm"
        sx={{
          margin: "10px 0",
          padding: 0,
          gap: "30px",
        }}
      > */}
        <Stack sx={{ gap: "30px" }}>
          {/* 주류 정보 */}
          <Stack sx={{ gap: "8px" }}>
            <Typography
              sx={{
                padding: "0 10px",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: "600",
              }}
            >
              구매한 주류
            </Typography>
            <Link
              href={LIQUOR_URL + liquor.id}
              passHref
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <LiquorInfoComponent
                thumbnailImageUrl={liquor?.thumbnailImageUrl}
                koName={liquor.koName}
                type={liquor?.type || null}
                abv={liquor?.abv || null}
                volume={liquor?.volume || null}
                country={liquor?.country || null}
                region={liquor?.region || null}
                grapeVariety={liquor?.grapeVariety || null}
              />
            </Link>
          </Stack>

          {/* 구매 정보 */}
          <Stack sx={{ padding: "0 10px", gap: "8px" }}>
            <Typography
              sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: "600" }}
            >
              구매 정보
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"구매처"}
                valueContent={
                  note.purchaseNote.place ? note.purchaseNote.place : "-"
                }
                keyMinWidth={70}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"구매 가격"}
                valueContent={
                  note.purchaseNote.price ? `${note.purchaseNote.price}원` : "-"
                }
                keyMinWidth={70}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"용량"}
                valueContent={
                  note.purchaseNote.volume
                    ? `${note.purchaseNote.volume}ml`
                    : "-"
                }
                keyMinWidth={70}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"구매 일자"}
                valueContent={
                  note.purchaseNote.purchaseAt
                    ? formatFullDate(note.purchaseNote.purchaseAt)
                    : "-"
                }
                keyMinWidth={70}
              />
            </Box>
          </Stack>

          {/* 본문 */}
          <Stack sx={{ gap: "8px" }}>
            <Typography
              sx={{
                padding: "0 10px",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: "600",
              }}
            >
              구매 후기
            </Typography>
            <Box
              sx={{
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                {note.purchaseNote.content}
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* 버튼 그룹 */}
        {/* <ShareButton
          title={shareData.title}
          text={shareData.text}
          url={shareData.url}
        />
        <TastingNotesButton link={NOTE_URL + "new?liquorId=" + liquor.id} /> */}
        {/* <EditButton user={user} /> */}
      </Stack>
    </Stack>
  );
}
