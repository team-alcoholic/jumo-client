import React from "react";
import { Typography, Container } from "@mui/material";
import { GiNoseSide, GiTongue } from "react-icons/gi";
import LiquorTitle from "@/components/ReviewComponent/LiquorTitle";
import { HiOutlineLightBulb } from "react-icons/hi";
import NotesSection from "@/components/ReviewComponent/NotesSection";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { calculateAverageScore, formatDate } from "@/utils/format";
import MoodSelectedComponent from "@/components/ReviewComponent/MoodSelectedComponent";

const REVIEW_URL = "http://localhost:3000/api/reviews/hello";

interface LiquorData {
  thumbnailImageUrl: string | null;
  koName: string | null;
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
  noseNotes: string[] | null;
  palateNotes: string[] | null;
  finishNotes: string[] | null;
  author: string | null;
  date: string;
  liquorData: LiquorData | null;
}

// 데이터를 가져오는 함수
// 1분마다 캐시를 업데이트
async function fetchData(mId: string): Promise<ReviewData> {
  const res = await fetch(REVIEW_URL, {
    next: { revalidate: 1 },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("404");
    }
    throw new Error("Failed to fetch data");
  }
  const data: ReviewData = await res.json();
  return data;
}

interface PostPageProps {
  params: { mId: string };
}

export default async function PostPage({ params: { mId } }: PostPageProps) {
  const reviewData = await fetchData(mId);

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
    author,
    date,
    liquorData,
  } = reviewData;

  return (
    <Container maxWidth="sm" sx={{ padding: 0 }}>
      <LiquorTitle
        thumbnailImageUrl={liquorData?.thumbnailImageUrl || null}
        koName={liquorData?.koName || null}
        type={liquorData?.type || null}
        abv={liquorData?.abv || null}
        volume={liquorData?.volume || null}
        country={liquorData?.country || null}
        region={liquorData?.region || null}
        grapeVariety={liquorData?.grapeVariety || null}
      />
      <Typography
        variant="body2"
        gutterBottom
        sx={{
          textAlign: "right",
          color: "grey.600",
          fontStyle: "italic",
        }}
      >
        {author}님이 {formatDate(date)}에 작성함
      </Typography>
      <NotesSection
        title="향 (Nose)"
        icon={<GiNoseSide sx={{ verticalAlign: "middle", marginRight: 1 }} />}
        score={noseScore}
        notes={noseNotes}
        formattedDescription={noseMemo}
      />
      <NotesSection
        title="맛 (Palate)"
        icon={<GiTongue sx={{ verticalAlign: "middle", marginRight: 1 }} />}
        score={palateScore}
        notes={palateNotes}
        formattedDescription={palateMemo}
      />
      <NotesSection
        title="여운 (Finish)"
        icon={
          <HiOutlineLightBulb
            sx={{ verticalAlign: "middle", marginRight: 1 }}
          />
        }
        notes={finishNotes}
        score={finishScore}
        formattedDescription={finishMemo}
      />
      <NotesSection
        title="총평"
        icon={
          <MdOutlineStickyNote2
            sx={{ verticalAlign: "middle", marginRight: 1 }}
          />
        }
        notes={[]}
        // score={(noseScore + palateScore + finishScore) / 3}
        score={calculateAverageScore(noseScore, palateScore, finishScore)}
        formattedDescription={overallNote}
      />
      {mood && <MoodSelectedComponent mood={mood} />}
    </Container>
  );
}
