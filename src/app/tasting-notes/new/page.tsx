"use client";
import React, { useEffect, useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import TabContentComponent from "@/components/ReviewComponent/TabContentComponent";
import TotalScoreComponent from "@/components/ReviewComponent/TotalScoreComponent";
import MoodSelectorComponent from "@/components/ReviewComponent/MoodSelectorComponent";
import {
  Container,
  SaveButton,
  TabContent,
  TitleHeader,
  WhiskeyImage,
} from "@/app/tasting-notes/new/StyledComponent";
import LiquorTitle from "@/components/ReviewComponent/LiquorTitle";
import { calculateAverageScore } from "@/utils/format";

// 서버로부터 넘어오는 주류 데이터
interface LiquorData {
  thumbnailImageUrl: string | null;
  koName: string;
  type: string | null;
  abv: string | null;
  volume: string | null;
  country: string | null;
  tastingNotesAroma: string | null;
  tastingNotesTaste: string | null;
  tastingNotesFinish: string | null;
  region: string | null;
  grapeVariety: string | null;
  aiNotes: aiNotes | null;
}

interface aiNotes {
  tastingNotesAroma: string;
  tastingNotesTaste: string;
  tastingNotesFinish: string;
}

const LIQUOR_URL = "http://localhost:8080/api/v1/search_liquors/113067";
const LIQUOR_NOTES_URL = "http://localhost:8080/api/v1/similar_keywords";

const TastingNotesNewPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [relatedNotes, setRelatedNotes] = useState<string[][]>([[], [], []]);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>[]>([
    new Set(),
    new Set(),
    new Set(),
  ]);

  const [scores, setScores] = useState<(number | null)[]>([null, null, null]);
  const [memos, setMemos] = useState<string[]>(["", "", ""]);

  const [totalScore, setTotalScore] = useState<string>("");
  const [overallNote, setOverallNote] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [liquorData, setLiquorData] = useState<LiquorData | null>(null);

  // 맨 처음 주류 데이터 가져옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(LIQUOR_URL);
        if (!response.ok) throw new Error("Failed to fetch data");
        const data: LiquorData = await response.json();
        setLiquorData(data);

        // Initialize related notes with tasting notes from fetched data
        setRelatedNotes([
          data.tastingNotesAroma ? data.tastingNotesAroma.split(", ") : [],
          data.tastingNotesTaste ? data.tastingNotesTaste.split(", ") : [],
          data.tastingNotesFinish ? data.tastingNotesFinish.split(", ") : [],
        ]);
      } catch (error) {
        console.error("Error fetching liquor data:", error);
      }
    };

    fetchData();
  }, []);

  // 총점을 계산하는 함수
  useEffect(() => {
    const averageScore = calculateAverageScore(scores[0], scores[1], scores[2]);
    setTotalScore(averageScore ? averageScore.toString() : "");
  }, [scores]);
  // 탭 변경 시 호출되는 함수
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  // 관련 노트를 가져오는 함수
  const fetchRelatedNotes = async (note: string, exclude: string) => {
    try {
      const response = await fetch(
        `${LIQUOR_NOTES_URL}?keyword=${encodeURIComponent(note)}&exclude=${encodeURIComponent(exclude)}&limit=5`,
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return await response.json();
    } catch (error) {
      console.error("Error fetching related notes:", error);
      return [];
    }
  };

  // 노트 클릭 시 호출되는 함수
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
    setRelatedNotes((prev) => {
      const allNotes = new Set([...prev[currentTab], ...newRelatedNotes]);
      const updatedRelatedNotes = [...prev];
      updatedRelatedNotes[currentTab] = Array.from(allNotes);
      return updatedRelatedNotes;
    });
  };

  // 사용자가 노트 추가하기
  const onAddNote = (note: string) => {
    const currentTab = selectedTab;
    setRelatedNotes((prev) => {
      const newRelatedNotes = [...prev];
      if (!newRelatedNotes[currentTab].includes(note)) {
        newRelatedNotes[currentTab] = [...newRelatedNotes[currentTab], note];
      }
      return newRelatedNotes;
    });
  };

  const handleSave = () => {
    const data = {
      scores,
      memos,
      totalScore,
      overallNote,
      mood,
      selectedNotes,
    };
    console.log("Saved data:", data);
    alert("Data saved! Check the console for details.");
  };

  if (!liquorData) {
    return null;
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
          relatedNotes={relatedNotes[selectedTab]}
          selectedNotes={selectedNotes[selectedTab]}
          onNoteClick={handleNoteClick}
          score={scores[selectedTab]}
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
      <SaveButton onClick={handleSave} variant="contained">
        저장하기
      </SaveButton>
    </Container>
  );
};

export default TastingNotesNewPage;
