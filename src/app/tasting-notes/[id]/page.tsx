import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { GiNoseSide, GiTongue } from "react-icons/gi";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { HiOutlineLightBulb } from "react-icons/hi";
import NotesSection from "@/components/TastingNotesComponent/NotesSection";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { calculateAverageScore, formatDate } from "@/utils/format";
import MoodSelectedComponent from "@/components/TastingNotesComponent/MoodSelectedComponent";
import EditButton from "@/components/TastingNotesComponent/EditButton";
import { notFound } from "next/navigation";
import ShareButton from "@/components/Button/ShareButton";
import { Metadata } from "next";
import Link from "next/link";
import HomeButton from "@/components/Button/tastingNotesButton";
import TastingNotesButton from "@/components/Button/tastingNotesButton";

const REVIEW_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/tasting-notes/";
const REVIEW_URL = process.env.NEXT_PUBLIC_BASE_URL + "/tasting-notes/";
const LIQUOR_URL = process.env.NEXT_PUBLIC_BASE_URL + "/liquors/";

interface LiquorData {
  id: number;
  thumbnailImageUrl: string | null;
  koName: string;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  region: string | null;
  grapeVariety: string | null;
}

interface ReviewData {
  productID: number | null;
  noseScore: number | null;
  palateScore: number | null;
  finishScore: number | null;
  noseMemo: string | null;
  palateMemo: string | null;
  finishMemo: string | null;
  overallNote: string | null;
  mood: string | null;
  noseNotes: string | null;
  palateNotes: string | null;
  finishNotes: string | null;
  user: User;
  createdAt: string;
  liquor: LiquorData;
}

async function fetchData(id: string): Promise<ReviewData> {
  const res = await fetch(REVIEW_API_URL + id, {
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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const reviewData = await fetchData(params.id);
  const { user, createdAt, liquor } = reviewData;

  const title = `${liquor.koName} 테이스팅 노트`;
  const description = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 리뷰`;
  const url = `${REVIEW_URL}${params.id}`;

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
          alt: liquor.koName,
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

interface PostPageProps {
  params: { id: string };
}

export default async function PostPage({ params: { id } }: PostPageProps) {
  const reviewData = await fetchData(id);

  const {
    noseScore,
    palateScore,
    finishScore,
    noseMemo,
    palateMemo,
    finishMemo,
    overallNote,
    mood,
    noseNotes,
    palateNotes,
    finishNotes,
    user,
    createdAt,
    liquor,
  } = reviewData;

  const text = `${user.profileNickname}님이 ${formatDate(createdAt)}에 작성한 ${liquor.koName} 리뷰`;

  const shareData = {
    title: `${liquor.koName} 테이스팅 노트`,
    text,
    url: `${REVIEW_URL}${id}`,
  };

  return (
    <Container maxWidth="sm" sx={{ margin: "40px 0", padding: 0 }}>
      <Link
        href={LIQUOR_URL + liquor.id}
        passHref
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <LiquorTitle
          thumbnailImageUrl={liquor?.thumbnailImageUrl || null}
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
      <TastingNotesButton link={REVIEW_URL + "new?liquorId=" + liquor.id} />

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
        score={noseScore}
        notes={noseNotes ? noseNotes.split(",") : []}
        formattedDescription={noseMemo}
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
        score={palateScore}
        notes={palateNotes ? palateNotes.split(",") : []}
        formattedDescription={palateMemo}
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
        notes={finishNotes ? finishNotes.split(",") : []}
        score={finishScore}
        formattedDescription={finishMemo}
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
        score={calculateAverageScore(noseScore, palateScore, finishScore)}
        formattedDescription={overallNote}
      />
      {mood && <MoodSelectedComponent mood={mood} />}
      <EditButton user={user} />
    </Container>
  );
}
