"use client";

import { Box, Link, Stack, styled, Typography } from "@mui/material";
import { useRef, useState } from "react";
import useObserver from "@/hooks/useObserver";
import { formatDateTime } from "@/utils/format";
import Image from "next/image";

export default function PurchaseNoteCard({ note }: { note: PurchaseNote }) {
  const [visible, setVisible] = useState(true);
  // const [visible, setVisible] = useState(false);

  // // IntersectionObserver API 설정: 뷰포트 안에 요소가 들어올 때만 DOM에 마운트
  // const target = useRef(null);
  // const onIntersect = ([entry]: IntersectionObserverEntry[]) =>
  //   setVisible(entry.isIntersecting);
  // useObserver({ target, onIntersect, threshold: 0.1 });

  return (
    // <LinkButton ref={target} href={`/purchase-notes/${note.id}`}>
    <LinkButton href={`/purchase-notes/${note.id}`}>
      {visible && (
        <Stack sx={{ justifyContent: "center", gap: "10px", width: "100%" }}>
          {/* 제목 및 작성일시 */}
          <Box>
            <ContentTypography
              sx={{
                fontSize: { xs: "12px", md: "15px" },
                WebkitLineClamp: 2, // 표시할 줄 수
              }}
            >
              {note.user.profileNickname}님이 {note.liquor.koName}을 구매했어요.
            </ContentTypography>
            <Typography sx={{ fontSize: { xs: "10px", md: "12px" } }}>
              {formatDateTime(note.createdAt)}
            </Typography>
          </Box>

          {/* 이미지 */}
          {note.noteImages.length ? (
            <Image
              src={note.noteImages[0].fileUrl}
              alt="note image"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                aspectRatio: "1/1",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ) : null}

          {/* 구매 정보 */}
          <Box>
            <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
              구매처 {note.place}
            </Typography>
            <Typography sx={{ fontSize: { xs: "12px", md: "15px" } }}>
              가격 {note.price}
            </Typography>
          </Box>

          {/* 본문 내용 */}
          <Box>
            <ContentTypography
              sx={{
                padding: "5px",
                fontSize: { xs: "12px", md: "15px" },
                WebkitLineClamp: 5, // 표시할 줄 수
              }}
            >
              {note.content}
            </ContentTypography>
          </Box>
        </Stack>
      )}
    </LinkButton>
  );
}

const LinkButton = styled(Link)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "2px",
  margin: "15px 0",
  padding: "15px 15px",
  // maxWidth: "800px",
  minHeight: "150px",
  // border: "0.5px solid",
  // borderColor: "gray",
  borderRadius: "5px",
  color: "inherit",
  textDecoration: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  backgroundColor: "#ffffff",
  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
});

const ContentTypography = styled(Typography)({
  maxWidth: "100%",
  display: "-webkit-box",
  // WebkitLineClamp: 2, // 표시할 줄 수
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal",
});
