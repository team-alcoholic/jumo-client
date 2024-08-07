"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/system";

// Import the reusable tab content component
import TabContentComponent from "@/components/TabContentComponent/TabContentComponent";
import {
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  SentimentVerySatisfied,
} from "@mui/icons-material";
import TotalScoreComponent from "@/components/TabContentComponent/TotalScoreComponent";
import MoodSelectorComponent from "@/components/TabContentComponent/MoodSelectorComponent";

const Container = styled(Box)({
  maxWidth: "800px",
  padding: "10px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
});

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginBottom: "30px",
  borderBottom: "2px solid #eee",
  paddingBottom: "10px",
});

const WhiskeyImage = styled(Avatar)({
  width: "100px",
  height: "100px",
  marginRight: "20px",
});

const TabContent = styled(Box)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const TotalSection = styled(Box)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const MoodSection = styled(Box)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const SaveButton = styled(Button)({
  marginTop: "20px",
  width: "100%",
  padding: "10px",
  backgroundColor: "#3f51b5",
  color: "#ffffff",
  "&:hover": {
    backgroundColor: "#303f9f",
  },
});

const IndexPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [relatedNotes, setRelatedNotes] = useState([[], [], []]); // Separate related notes for each tab
  const [selectedNotes, setSelectedNotes] = useState([
    new Set(),
    new Set(),
    new Set(),
  ]); // Separate selected notes for each tab

  const [scores, setScores] = useState(["", "", ""]); // Manage scores for each tab
  const [memos, setMemos] = useState(["", "", ""]); // Manage memos for each tab

  const [totalScore, setTotalScore] = useState("");
  const [overallNote, setOverallNote] = useState("");

  const [mood, setMood] = useState(""); // State for mood selection

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

  const handleFetchInitial = async (initialNotes, tabIndex) => {
    const exclude = Array.from(selectedNotes[tabIndex]).join(",");
    const newRelatedNotes = await Promise.all(
      initialNotes.map((note) => fetchRelatedNotes(note, exclude)),
    );
    const flattenedNotes = newRelatedNotes.flat();
    const allNotes = new Set(flattenedNotes);
    setRelatedNotes((prev) => {
      const updatedRelatedNotes = [...prev];
      updatedRelatedNotes[tabIndex] = Array.from(allNotes);
      return updatedRelatedNotes;
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

  // Define the content and initial AI notes for each tab
  const tabContents = [
    {
      title: "향 (Nose)",
      description: "향 (Nose) 관련 내용을 여기에 입력하세요.",
      initialNotes: ["바나나", "바닐라", "오크"],
    },
    {
      title: "맛 (Palate)",
      description: "맛 (Palate) 관련 내용을 여기에 입력하세요.",
      initialNotes: ["과일", "꿀", "캐러멜"],
    },
    {
      title: "여운 (Finish)",
      description: "여운 (Finish) 관련 내용을 여기에 입력하세요.",
      initialNotes: ["스파이시", "우디", "초콜릿"],
    },
  ];

  // Fetch initial related notes for each tab on mount
  useEffect(() => {
    tabContents.forEach((tabContent, index) => {
      handleFetchInitial(tabContent.initialNotes, index);
    });
  }, []);

  return (
    <Container>
      <Header>
        <WhiskeyImage src="/404.png" alt="Whiskey Bottle" />
        <div>
          <Typography
            variant="h4"
            style={{ fontWeight: "bold", color: "#3f51b5" }}
          >
            야마자키 코케이
          </Typography>
          <Typography variant="subtitle1" style={{ color: "#757575" }}>
            위스키, 도수 43도
          </Typography>
        </div>
      </Header>

      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Nose" />
        <Tab label="Palate" />
        <Tab label="Finish" />
      </Tabs>

      <TabContent>
        <TabContentComponent
          title={tabContents[selectedTab].title}
          description={tabContents[selectedTab].description}
          initialNotes={tabContents[selectedTab].initialNotes}
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
