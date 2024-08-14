"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import {
  Alert,
  AlertProps,
  CircularProgress,
  Skeleton,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
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
  fetchAiNotes,
  fetchLiquorData,
  fetchRelatedNotes,
  ReviewSavingData,
  saveReviewData,
} from "@/api/tastingNotesApi";
import { useRouter, useSearchParams } from "next/navigation";
import TastingNotesSkeleton from "@/components/TastingNotesComponent/TastingNotesSkeleton";
import { styled } from "@mui/material/styles";
import {
  CustomSnackbar,
  useCustomSnackbar,
} from "@/components/Snackbar/CustomSnackbar";

const TastingNotesNewPageComponent = () => {
  const { snackbar, showSnackbar, hideSnackbar } = useCustomSnackbar();

  const params = useSearchParams();
  const router = useRouter();

  const liquorId = params.get("liquorId");

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

  const [hasAiNotes, setHasAiNotes] = useState<boolean | null>(null);

  const [scores, setScores] = useState<(number | null)[]>([null, null, null]);
  const [memos, setMemos] = useState<string[]>(["", "", ""]);

  const [saving, setSaving] = useState(false); // 추가

  const [totalScore, setTotalScore] = useState<string>("");
  const [overallNote, setOverallNote] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [liquorData, setLiquorData] = useState<LiquorData | null>(null);
  const getAuth = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "GET",
          credentials: "include", // 세션 기반 인증에 필요한 경우 추가
        }
      );

      if (response.status === 401) {
        alert(
          "리뷰 작성은 로그인이 필요합니다.(카카오로 1초 로그인 하러 가기)"
        );
        const redirectUrl = window.location.href;
        router.push(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`);
      } else {
        await response.json();
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
    }
  }, [router]);

  const loadLiquorData = useCallback(async () => {
    try {
      if (!liquorId) {
        alert("리뷰 작성을 위해서는 주류 검색이 필요합니다.");
        router.push("/liquors");
        return;
      }
      const data = await fetchLiquorData(liquorId);
      setLiquorData(data);

      let tastingNotesAroma = new Set(
        data.tastingNotesAroma?.split(", ") || []
      );
      let tastingNotesTaste = new Set(
        data.tastingNotesTaste?.split(", ") || []
      );
      let tastingNotesFinish = new Set(
        data.tastingNotesFinish?.split(", ") || []
      );

      if (data.aiNotes) {
        setHasAiNotes(true);
        data.aiNotes.tastingNotesAroma
          .split(", ")
          .forEach((note: string) => tastingNotesAroma.add(note));
        data.aiNotes.tastingNotesTaste
          .split(", ")
          .forEach((note: string) => tastingNotesTaste.add(note));
        data.aiNotes.tastingNotesFinish
          .split(", ")
          .forEach((note: string) => tastingNotesFinish.add(note));
      } else {
        getAiNotes(liquorId);
      }

      setRelatedNotes([
        tastingNotesAroma,
        tastingNotesTaste,
        tastingNotesFinish,
      ]);
    } catch (error) {
      alert("주류 정보를 불러오는데 실패했습니다. 주류를 다시 선택해주세요.");
      router.push("/liquors");
    }
  }, [liquorId, router]);

  useEffect(() => {
    (async () => {
      await getAuth();
      await loadLiquorData();
    })();
  }, [getAuth, loadLiquorData]);

  const getAiNotes = async (liquorId: string) => {
    setHasAiNotes(false);
    const aiData = await fetchAiNotes(liquorId);
    setRelatedNotes((prev) => [
      new Set([...Array.from(prev[0]), ...aiData.noseNotes]),
      new Set([...Array.from(prev[1]), ...aiData.palateNotes]),
      new Set([...Array.from(prev[2]), ...aiData.finishNotes]),
    ]);
    setHasAiNotes(true);
  };

  useEffect(() => {
    const averageScore = calculateAverageScore(scores[0], scores[1], scores[2]);
    setTotalScore(averageScore ? averageScore.toString() : "");
  }, [scores]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };
  const updateSetRelatedNotes = (
    newRelatedNotes: string[],
    currentTab: number
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

  if (!liquorId) {
    return null; // 또는 로딩 인디케이터나 에러 메시지를 표시할 수 있습니다.
  }

  const handleSave = async () => {
    const ReviewSavingData: ReviewSavingData = {
      liquorId,
      noseScore: scores[0],
      palateScore: scores[1],
      finishScore: scores[2],

      noseMemo: convertEmptyStringToNull(memos[0]),
      palateMemo: convertEmptyStringToNull(memos[1]),
      finishMemo: convertEmptyStringToNull(memos[2]),
      overallNote: convertEmptyStringToNull(overallNote),
      mood: convertEmptyStringToNull(mood),
      noseNotes: convertEmptyStringToNull(
        Array.from(selectedNotes[0]).join(", ")
      ),
      palateNotes: convertEmptyStringToNull(
        Array.from(selectedNotes[1]).join(", ")
      ),
      finishNotes: convertEmptyStringToNull(
        Array.from(selectedNotes[2]).join(", ")
      ),
    };

    setSaving(true);

    try {
      const tastingNotesId = await saveReviewData(ReviewSavingData);
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
        {saving ? <CircularProgress size={24} /> : "저장하기"}
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

export default function TastingNotesNewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TastingNotesNewPageComponent />
    </Suspense>
  );
}
