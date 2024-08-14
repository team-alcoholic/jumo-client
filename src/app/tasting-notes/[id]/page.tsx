import React from "react";
import { Box, Container, Typography } from "@mui/material";
import { GiNoseSide, GiTongue } from "react-icons/gi";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { HiOutlineLightBulb } from "react-icons/hi";
import NotesSection from "@/components/TastingNotesComponent/NotesSection";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { calculateAverageScore, formatDate } from "@/utils/format";
import MoodSelectedComponent from "@/components/TastingNotesComponent/MoodSelectedComponent";
import EditButton from "@/components/TastingNotesComponent/EditButton";

const REVIEW_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/tasting-notes/";

interface LiquorData {
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

// 데이터를 가져오는 함수
// 1분마다 캐시를 업데이트
async function fetchData(id: string): Promise<ReviewData> {
  const res = await fetch(REVIEW_URL + id, {
    next: { revalidate: 1, tags: ["review"] },
  });

  console.log("res url", REVIEW_URL + id);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("404");
    }
    throw new Error("Failed to fetch data");
  }
  return await res.json();
}

interface PostPageProps {
  params: { id: string };
}
export default async function PostPage({ params: { id } }: PostPageProps) {
  console.log("mId", id);
  const reviewData = await fetchData(id);
  console.log("reviewData", reviewData);

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

  return (
    <Container maxWidth="sm" sx={{ margin: "40px 0", padding: 0 }}>
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
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          paddingTop: "30px",
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
