"use client";
import React, { useEffect, useState } from "react";
import { CircularProgress, Tab, Tabs } from "@mui/material";
import TabContentComponent from "@/components/TastingNotesComponent/TabContentComponent";
import TotalScoreComponent from "@/components/TastingNotesComponent/TotalScoreComponent";
import MoodSelectorComponent from "@/components/TastingNotesComponent/MoodSelectorComponent";
import {
  Container,
  SaveButton,
  TabContent,
} from "@/app/tasting-notes/new/StyledComponent";
import LiquorTitle from "@/components/TastingNotesComponent/LiquorTitle";
import { calculateAverageScore } from "@/utils/format";
import {
  fetchAiNotes,
  fetchLiquorData,
  fetchRelatedNotes,
  LiquorData,
  ReviewSavingData,
  saveReviewData,
} from "@/api/tastingNotesApi";

const TastingNotesNewPage = () => {
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
  useEffect(() => {
    const loadLiquorData = async () => {
      try {
        const data = await fetchLiquorData();
        setLiquorData(data);
        let tastingNotesAroma = new Set(
          data.tastingNotesAroma?.split(", ") || [],
        );
        let tastingNotesTaste = new Set(
          data.tastingNotesTaste?.split(", ") || [],
        );
        let tastingNotesFinish = new Set(
          data.tastingNotesFinish?.split(", ") || [],
        );

        if (data.aiNotes) {
          setHasAiNotes(true);
          data.aiNotes.tastingNotesAroma
            .split(", ")
            .forEach((note) => tastingNotesAroma.add(note));
          data.aiNotes.tastingNotesTaste
            .split(", ")
            .forEach((note) => tastingNotesTaste.add(note));
          data.aiNotes.tastingNotesFinish
            .split(", ")
            .forEach((note) => tastingNotesFinish.add(note));
        } else setHasAiNotes(false);

        setRelatedNotes([
          tastingNotesAroma,
          tastingNotesTaste,
          tastingNotesFinish,
        ]);
      } catch (error) {
        console.error("Error fetching liquor data:", error);
      }
    };

    loadLiquorData();
  }, []);

  useEffect(() => {
    const loadAiNotes = async () => {
      if (!hasAiNotes) {
        try {
          const aiData = await fetchAiNotes();
          setRelatedNotes((prev) => [
            new Set([
              ...Array.from(prev[0]),
              ...aiData.tastingNotesAroma.split(", "),
            ]),
            new Set([
              ...Array.from(prev[1]),
              ...aiData.tastingNotesTaste.split(", "),
            ]),
            new Set([
              ...Array.from(prev[2]),
              ...aiData.tastingNotesFinish.split(", "),
            ]),
          ]);
          setHasAiNotes(true);
        } catch (error) {
          console.error("Error fetching AI notes:", error);
        }
      }
    };

    loadAiNotes();
  }, [hasAiNotes]);

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
    if (!selectedNotes[currentTab].has(note)) {
      setSelectedNotes((prev) => {
        const newSelectedNotes = [...prev];
        newSelectedNotes[currentTab].add(note);
        return newSelectedNotes;
      });
    } else {
      setSelectedNotes((prev) => {
        const newSelectedNotes = [...prev];
        newSelectedNotes[currentTab].delete(note);
        return newSelectedNotes;
      });
    }

    const exclude = Array.from(selectedNotes[currentTab]).join(",");
    const newRelatedNotes = await fetchRelatedNotes(note, exclude);

    updateSetRelatedNotes(newRelatedNotes, currentTab);
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
    const ReviewSavingData: ReviewSavingData = {
      productID: 199948,
      noseScore: scores[0],
      palateScore: scores[1],
      finishScore: scores[2],
      noseMemo: memos[0],
      palateMemo: memos[1],
      finishMemo: memos[2],
      overallNote: overallNote,
      mood: mood,
      noseNotes: Array.from(selectedNotes[0]).join(", "),
      palateNotes: Array.from(selectedNotes[1]).join(", "),
      finishNotes: Array.from(selectedNotes[2]).join(", "),
    };

    setSaving(true); // 로딩 상태 시작

    try {
      await saveReviewData(ReviewSavingData);
      console.log("Saved data:", ReviewSavingData);
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    } finally {
      setSaving(false); // 로딩 상태 종료
    }
  };

  if (!liquorData) {
    return <CircularProgress size={24} />;
  }

  const tabContents = [
    {
      title: "향 (Nose)",
      description: "향 (Nose) 관련 내용을 여기에 입력하세요.",
    },
    {
      title: "맛 (Palate)",
      description: "맛 (Palate) 관련 내용을 여기에 입력하세요.",
    },
    {
      title: "여운 (Finish)",
      description: "여운 (Finish) 관련 내용을 여기에 입력하세요.",
    },
  ];

  return (
    <Container>
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

      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Nose" />
        <Tab label="Palate" />
        <Tab label="Finish" />
      </Tabs>

      <TabContent>
        <TabContentComponent
          title={tabContents[selectedTab].title}
          description={tabContents[selectedTab].description}
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
    </Container>
  );
};

export default TastingNotesNewPage;
