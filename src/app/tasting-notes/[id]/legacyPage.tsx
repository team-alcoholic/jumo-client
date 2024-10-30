import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { GiNoseSide, GiTongue } from "react-icons/gi";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { HiOutlineLightBulb } from "react-icons/hi";
import NotesSection from "@/components/TastingNotesComponent/NotesSection";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { formatDate } from "@/utils/format";
import EditButton from "@/components/TastingNotesComponent/EditButton";
import { notFound } from "next/navigation";
import ShareButton from "@/components/Button/ShareButton";
import { Metadata } from "next";
import Link from "next/link";
import TastingNotesButton from "@/components/Button/tastingNotesButton";
import PageTitleComponent from "@/components/LayoutComponents/PageTitleComponent";

const NOTE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/v2/notes/";
const NOTE_URL = process.env.NEXT_PUBLIC_BASE_URL + "/tasting-notes/";
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
  const description = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 리뷰`;
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
  const note = await getNote(id);

  const { score, nose, palate, finish, content, user, createdAt, liquor } =
    note.tastingNote;

  const text = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 리뷰`;

  const shareData = {
    title: `${liquor.koName} 테이스팅 노트`,
    text,
    url: `${NOTE_URL}${id}`,
  };

  return (
    <Stack>
      <PageTitleComponent title="테이스팅 노트" />
      <Container maxWidth="sm" sx={{ margin: "20px 0", padding: 0 }}>
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

        <ShareButton
          title={shareData.title}
          text={shareData.text}
          url={shareData.url}
        />
        <TastingNotesButton link={NOTE_URL + "new?liquorId=" + liquor.id} />

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
        <NotesSection
          title="향 (Nose)"
          icon={
            <Box
              component="span"
              sx={{ verticalAlign: "middle", marginRight: 1 }}
            >
              <GiNoseSide />
            </Box>
          }
          score={score}
          notes={[]}
          formattedDescription={nose}
        />
        <NotesSection
          title="맛 (Palate)"
          icon={
            <Box
              component="span"
              sx={{ verticalAlign: "middle", marginRight: 1 }}
            >
              <GiTongue />
            </Box>
          }
          score={score}
          notes={[]}
          formattedDescription={palate}
        />
        <NotesSection
          title="여운 (Finish)"
          icon={
            <Box
              component="span"
              sx={{ verticalAlign: "middle", marginRight: 1 }}
            >
              <HiOutlineLightBulb />
            </Box>
          }
          score={score}
          notes={[]}
          formattedDescription={finish}
        />
        <NotesSection
          title="총평"
          icon={
            <Box
              component="span"
              sx={{ verticalAlign: "middle", marginRight: 1 }}
            >
              <MdOutlineStickyNote2 />
            </Box>
          }
          notes={[]}
          score={score}
          formattedDescription={content}
        />
        {/* {mood && <MoodSelectedComponent mood={mood} />} */}
        <EditButton user={user} />
      </Container>
    </Stack>
  );
}
