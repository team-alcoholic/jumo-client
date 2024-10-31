import React from "react";
import { Container, Typography } from "@mui/material";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { formatDate } from "@/utils/format";
import EditButton from "@/components/TastingNotesComponent/EditButton";
import { notFound } from "next/navigation";
import ShareButton from "@/components/Button/ShareButton";
import { Metadata } from "next";
import Link from "next/link";
import TastingNotesButton from "@/components/Button/tastingNotesButton";

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
    <Container maxWidth="sm" sx={{ margin: "40px 0", padding: 0 }}>
      {/* 주류 정보 */}
      <Link
        href={LIQUOR_URL + liquor.id}
        passHref
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <LiquorTitle
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

      {/* 버튼 그룹 */}
      <ShareButton
        title={shareData.title}
        text={shareData.text}
        url={shareData.url}
      />
      <TastingNotesButton link={NOTE_URL + "new?liquorId=" + liquor.id} />

      {/* 본문 */}
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          paddingTop: "5px",
          paddingBottom: "5px",
          textAlign: "right",
          color: "grey.600",
          fontStyle: "italic",
        }}
      >
        {user.profileNickname}님이 {formatDate(createdAt)}에 작성함
      </Typography>
      {/* {mood && <MoodSelectedComponent mood={mood} />} */}
      <EditButton user={user} />
    </Container>
  );
}
