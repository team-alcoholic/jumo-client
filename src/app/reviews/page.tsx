"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Avatar, Tabs, Tab, Button } from "@mui/material";
import { styled } from "@mui/system";

// Import the reusable tab content component
import TabContentComponent from "@/components/TabContentComponent/TabContentComponent";
import TotalScoreComponent from "@/components/TabContentComponent/TotalScoreComponent";
import MoodSelectorComponent from "@/components/TabContentComponent/MoodSelectorComponent";
import {
  Container,
  Header,
  SaveButton,
  TabContent,
  TitleHeader,
  WhiskeyImage,
} from "@/app/reviews/StyledComponent";

const IndexPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [relatedNotes, setRelatedNotes] = useState([[], [], []]);
  const [selectedNotes, setSelectedNotes] = useState([
    new Set(),
    new Set(),
    new Set(),
  ]);

  const [scores, setScores] = useState(["", "", ""]);
  const [memos, setMemos] = useState(["", "", ""]);

  const [totalScore, setTotalScore] = useState("");
  const [overallNote, setOverallNote] = useState("");
  const [mood, setMood] = useState("");
  const [liquorData, setLiquorData] = useState(null);

  useEffect(() => {
    // Fetch data from the server when component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/search_liquors/23223",
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
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

  useEffect(() => {
    // Calculate total score as average
    const validScores = scores.filter((score) => score !== "").map(Number);
    const averageScore =
      validScores.length > 0
        ? validScores.reduce((a, b) => a + b, 0) / validScores.length
        : "";
    setTotalScore(averageScore);
  }, [scores]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const fetchRelatedNotes = async (note, exclude) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/similar_keywords?keyword=${encodeURIComponent(
          note,
        )}&exclude=${encodeURIComponent(exclude)}&limit=5`,
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching related notes:", error);
      return [];
    }
  };

  const handleNoteClick = async (note) => {
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

  const onAddNote = (note) => {
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
      <TitleHeader>
        <WhiskeyImage src={liquorData.thumbnailImageUrl} alt="Whiskey Bottle" />
        <div>
          <Typography
            variant="h6"
            style={{ fontWeight: "bold", color: "#424242" }}
          >
            {liquorData.koName}
          </Typography>
          <Typography variant="subtitle1" style={{ color: "#757575" }}>
            {liquorData.type}, 도수 {liquorData.abv}
          </Typography>
          <Typography variant="subtitle2" style={{ color: "#757575" }}>
            {liquorData.volume}, {liquorData.country}
          </Typography>
        </div>
      </TitleHeader>

      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Nose" />
        <Tab label="Palate" />
        <Tab label="Finish" />
      </Tabs>

      <TabContent>
        <TabContentComponent
          title={tabContents[selectedTab].title}
          description={tabContents[selectedTab].description}
          initialNotes={[]} // No initial notes, they're managed by relatedNotes now
          relatedNotes={relatedNotes[selectedTab]}
          selectedNotes={selectedNotes[selectedTab]}
          onNoteClick={handleNoteClick}
          score={scores[selectedTab]}
          setScore={(value) =>
            setScores((prev) => {
              const newScores = [...prev];
              newScores[selectedTab] = value;
              return newScores;
            })
          }
          memo={memos[selectedTab]}
          setMemo={(value) =>
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

export default IndexPage;
