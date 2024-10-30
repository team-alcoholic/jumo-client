import React, { Fragment } from "react";
import {
  Box,
  Chip,
  Container,
  Divider,
  Rating,
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

  const { user, createdAt, liquor } = note.tastingNote;

  const title = `${liquor.koName} 테이스팅 노트`;
  const description = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 테이스팅 노트`;
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

export default async function TastingNotePage({
  params: { id },
}: PostPageProps) {
  const note: Note = await getNote(id);

  const { content, user, createdAt, liquor } = note.tastingNote;

  const text = `${user.profileNickname}님이 ${formatFullDate(createdAt)}에 작성한 ${liquor.koName} 테이스팅 노트`;

  const shareData = {
    title: `${liquor.koName} 테이스팅 노트`,
    text,
    url: `${NOTE_URL}${id}`,
  };

  return (
    <Stack sx={{ marginBottom: "50px" }}>
      <PageTitleComponent title="테이스팅 노트" />
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
            createdAt={note.tastingNote.createdAt}
          />
          <Divider />
        </Stack>

        {/* 이미지 */}
        {note.tastingNote.noteImages && note.tastingNote.noteImages.length ? (
          <Box>
            <ImageSlider
              images={note.tastingNote.noteImages.map((image) => image.fileUrl)}
            />
          </Box>
        ) : null}

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
              감상한 주류
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

          {/* 테이스팅 정보 */}
          <Stack sx={{ padding: "0 10px", gap: "8px" }}>
            <Typography
              sx={{ fontSize: { xs: "18px", md: "20px" }, fontWeight: "600" }}
            >
              테이스팅 정보
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"테이스팅 일자"}
                valueContent={
                  note.tastingNote.tastingAt
                    ? formatFullDate(note.tastingNote.tastingAt)
                    : "-"
                }
                keyMinWidth={85}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"테이스팅 장소"}
                valueContent={
                  note.tastingNote.place ? note.tastingNote.place : "-"
                }
                keyMinWidth={85}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px" }}>
              <KeyValueInfoComponent
                keyContent={"테이스팅 방법"}
                valueContent={
                  note.tastingNote.method ? note.tastingNote.method : "-"
                }
                keyMinWidth={85}
              />
            </Box>
          </Stack>

          {/* 테이스팅 노트 */}
          <Stack sx={{ gap: "8px" }}>
            <Typography
              sx={{
                padding: "0 10px",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: "600",
              }}
            >
              테이스팅 노트
            </Typography>

            {/* 점수 */}
            <Box
              sx={{
                padding: "0 10px",
                display: "flex",
                flexDirection: "row",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", md: "18px" },
                  color: "gray",
                  // overflow: "hidden",
                  // whiteSpace: "nowrap",
                  // textOverflow: "ellipsis",
                }}
              >
                점수
              </Typography>
              <Rating
                name="read-only"
                value={note.tastingNote.score}
                size="small"
                readOnly
              />
            </Box>

            {/* 테이스팅 칩 */}
            <Box
              sx={{
                padding: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                width: "100%",
                backgroundColor: "whitesmoke",
                borderRadius: "5px",
              }}
            >
              {note.tastingNote.noteAromas &&
              note.tastingNote.noteAromas.length ? (
                note.tastingNote.noteAromas.map((aroma: Aroma, index) => (
                  <Chip
                    sx={{ margin: "2px", color: "black", fontSize: "12px" }}
                    // size="small"
                    key={index}
                    label={aroma.name}
                  />
                ))
              ) : (
                <Typography
                  color="textSecondary" // 연한 색상 사용
                  align="center"
                  sx={{ fontSize: "12px", fontWeight: 400 }} // 크기를 더 작게 설정
                >
                  선택된 아로마가 없습니다.
                </Typography>
              )}
            </Box>

            {/* 본문 */}
            {!note.tastingNote.isDetail ? (
              <Box
                sx={{
                  padding: "20px",
                  borderRadius: "5px",
                  backgroundColor: "whitesmoke",
                }}
              >
                <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                  {note.tastingNote.content}
                </Typography>
              </Box>
            ) : null}
          </Stack>
        </Stack>

        {/* 상세 테이스팅 노트 */}
        {note.tastingNote.isDetail ? (
          <Stack sx={{ gap: "8px" }}>
            <Typography
              sx={{
                padding: "0 10px",
                fontSize: { xs: "18px", md: "20px" },
                fontWeight: "600",
              }}
            >
              상세 테이스팅 노트
            </Typography>

            {/* 노즈 */}
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", md: "18px" },
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                Nose
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                {note.tastingNote.nose ? note.tastingNote.nose : "-"}
              </Typography>
            </Stack>

            {/* 팔레트 */}
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", md: "18px" },
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                Palate
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                {note.tastingNote.palate ? note.tastingNote.palate : "-"}
              </Typography>
            </Stack>

            {/* 피니시 */}
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", md: "18px" },
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                Finish
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                {note.tastingNote.finish ? note.tastingNote.finish : "-"}
              </Typography>
            </Stack>

            {/* 총평 */}
            <Stack
              sx={{
                padding: "20px",
                borderRadius: "5px",
                backgroundColor: "whitesmoke",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "15px", md: "18px" },
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                Overall
              </Typography>
              <Typography sx={{ fontSize: { xs: "15px", md: "18px" } }}>
                {note.tastingNote.content ? note.tastingNote.content : "-"}
              </Typography>
            </Stack>
          </Stack>
        ) : null}

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
