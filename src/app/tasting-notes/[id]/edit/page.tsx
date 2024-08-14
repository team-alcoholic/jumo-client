"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { CircularProgress, Skeleton, Tab, Tabs } from "@mui/material";
import TabContentComponent from "@/components/TastingNotesComponent/TabContentComponent";
import TotalScoreComponent from "@/components/TastingNotesComponent/TotalScoreComponent";
import MoodSelectorComponent from "@/components/TastingNotesComponent/MoodSelectorComponent";
import {
  Container,
  SaveButton,
  StyledTab,
  StyledTabs,
  TabContent,
} from "@/app/tasting-notes/new/StyledComponent";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { calculateAverageScore } from "@/utils/format";
import {
  checkUserPermission,
  fetchAiNotes,
  fetchLiquorData,
  fetchRelatedNotes,
  ReviewSavingData,
  ReviewUpdateData,
  saveReviewData,
  updateReviewData,
} from "@/api/tastingNotesApi";
import { useRouter, useSearchParams } from "next/navigation";
import TastingNotesSkeleton from "@/components/TastingNotesComponent/TastingNotesSkeleton";
import { revalidateReview } from "@/app/server-actions";
import {
  CustomSnackbar,
  useCustomSnackbar,
} from "@/components/Snackbar/CustomSnackbar";

const REVIEW_URL = process.env.NEXT_PUBLIC_API_BASE_URL + "/tasting-notes/";

interface TastingNotesEditPageComponentProps {
  id: string;
}

const TastingNotesEditPageComponent = ({
  id,
}: TastingNotesEditPageComponentProps) => {
  const { snackbar, showSnackbar, hideSnackbar } = useCustomSnackbar();
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const [relatedNotes, setRelatedNotes] = useState<Set<string>[]>([
    new Set(),
    new Set(),
    new Set(),
  ]);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>[]>([
    new Set(),
    new Set(),
    new Set(),
  ]);

  const [hasAiNotes, setHasAiNotes] = useState<boolean | null>(true);

  const [scores, setScores] = useState<(number | null)[]>([null, null, null]);
  const [memos, setMemos] = useState<string[]>(["", "", ""]);

  const [saving, setSaving] = useState(false); // 추가

  const [totalScore, setTotalScore] = useState<string>("");
  const [overallNote, setOverallNote] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [liquorData, setLiquorData] = useState<LiquorData | null>(null);

  const loadReviewData = useCallback(async () => {
    try {
      const response = await fetch(`${REVIEW_URL}${id}`);
      const reviewData: TastingNoteList = await response.json();
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
      const liquorData = reviewData.liquor;
      const permission = await checkUserPermission(user);
      if (!permission) {
        alert("권한이 없습니다.");
        router.back();
        return;
      }
      setLiquorData(liquorData);

      let tastingNotesAroma = noseNotes?.split(", ") || [];
      let tastingNotesTaste = palateNotes?.split(", ") || [];
      let tastingNotesFinish = finishNotes?.split(", ") || [];

      setRelatedNotes([
        new Set(tastingNotesAroma),
        new Set(tastingNotesTaste),
        new Set(tastingNotesFinish),
      ]);
      setSelectedNotes([
        new Set(tastingNotesAroma),
        new Set(tastingNotesTaste),
        new Set(tastingNotesFinish),
      ]);
      setMemos([noseMemo ?? "", palateMemo ?? "", finishMemo ?? ""]);
      setOverallNote(overallNote ?? "");
      setMood(mood ?? "");
      setScores([noseScore, palateScore, finishScore]);
    } catch (error) {
      alert("주류 정보를 불러오는데 실패했습니다. 주류를 다시 선택해주세요.");
    }
  }, [router]);

  useEffect(() => {
    (async () => {
      await loadReviewData();
    })();
  }, [loadReviewData]);

  useEffect(() => {
    const averageScore = calculateAverageScore(scores[0], scores[1], scores[2]);
    setTotalScore(averageScore ? averageScore.toString() : "");
  }, [scores]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const updateSetRelatedNotes = (
    newRelatedNotes: string[],
    currentTab: number,
  ) => {
    setRelatedNotes((prev) => {
      const updatedRelatedNotes = [...prev];
      updatedRelatedNotes[currentTab] = new Set([
        ...Array.from(prev[currentTab]),
        ...newRelatedNotes,
      ]);
      return updatedRelatedNotes;
    });
  };

  const handleNoteClick = async (note: string) => {
    const currentTab = selectedTab;

    setSelectedNotes((prev) => {
      const newSelectedNotes = [...prev];
      const noteSet = newSelectedNotes[currentTab];

      if (noteSet.has(note)) {
        noteSet.delete(note);
      } else {
        noteSet.add(note);
      }

      return newSelectedNotes;
    });

    if (selectedNotes[currentTab].has(note)) {
      const exclude = Array.from(selectedNotes[currentTab]).join(",");
      const newRelatedNotes = await fetchRelatedNotes(note, exclude);

      updateSetRelatedNotes(newRelatedNotes, currentTab);
    }
  };

  const onAddNote = (note: string) => {
    const currentTab = selectedTab;
    setRelatedNotes((prev) => {
      const newRelatedNotes = [...prev];
      newRelatedNotes[currentTab].add(note);
      return newRelatedNotes;
    });
  };

  const handleSave = async () => {
    const ReviewUpdateData: ReviewUpdateData = {
      id: id,
      noseScore: scores[0],
      palateScore: scores[1],
      finishScore: scores[2],
      noseMemo: memos[0] || null,
      palateMemo: memos[1] || null,
      finishMemo: memos[2] || null,
      overallNote: overallNote || null,
      mood: mood || null,
      noseNotes: selectedNotes[0].size
        ? Array.from(selectedNotes[0]).join(", ")
        : null,
      palateNotes: selectedNotes[1].size
        ? Array.from(selectedNotes[1]).join(", ")
        : null,
      finishNotes: selectedNotes[2].size
        ? Array.from(selectedNotes[2]).join(", ")
        : null,
    };

    setSaving(true);

    try {
      const tastingNotesId = await updateReviewData(ReviewUpdateData);
      await revalidateReview(); // 데이터 업데이트 후 캐시 무효화
      router.push(`/tasting-notes/${tastingNotesId}`);
      showSnackbar("저장에 성공했습니다.", "success");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.";
      showSnackbar(`저장 실패: ${errorMessage}`, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!liquorData) {
    return <TastingNotesSkeleton />;
  }

  return (
    <Container sx={{ margin: "30px 0" }}>
      <LiquorTitle
        thumbnailImageUrl={liquorData.thumbnailImageUrl}
        koName={liquorData.koName}
        type={liquorData.type}
        abv={liquorData.abv}
        volume={liquorData.volume}
        country={liquorData.country}
        region={liquorData.region}
        grapeVariety={liquorData.grapeVariety}
      />

      <StyledTabs value={selectedTab} onChange={handleTabChange} centered>
        <StyledTab label="Nose" />
        <StyledTab label="Palate" />
        <StyledTab label="Finish" />
      </StyledTabs>

      <TabContent>
        <TabContentComponent
          selectedTab={selectedTab}
          relatedNotes={Array.from(relatedNotes[selectedTab])}
          selectedNotes={selectedNotes[selectedTab]}
          onNoteClick={handleNoteClick}
          score={scores[selectedTab]}
          hasAiNotes={hasAiNotes}
          setScore={(value: number | null) =>
            setScores((prev: (number | null)[]) => {
              const newScores: (number | null)[] = [...prev];
              newScores[selectedTab] = value;
              return newScores;
            })
          }
          memo={memos[selectedTab]}
          setMemo={(value: string) =>
            setMemos((prev) => {
              const newMemos = [...prev];
              newMemos[selectedTab] = value;
              return newMemos;
            })
          }
          onAddNote={onAddNote}
        />
      </TabContent>

      <TotalScoreComponent
        totalScore={totalScore}
        overallNote={overallNote}
        setOverallNote={setOverallNote}
      />
      <MoodSelectorComponent mood={mood} setMood={setMood} />
      <SaveButton onClick={handleSave} variant="contained" disabled={saving}>
        {saving ? <CircularProgress size={24} /> : "수정 하기"}
      </SaveButton>
      <CustomSnackbar
        isOpen={snackbar.isOpen}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
      />
    </Container>
  );
};

export default function TastingNotesEditPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TastingNotesEditPageComponent id={id} />
    </Suspense>
  );
}
