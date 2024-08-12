export interface aiNotes {
  tastingNotesAroma: string;
  tastingNotesTaste: string;
  tastingNotesFinish: string;
}

export interface ReviewSavingData {
  productID: number;
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
}

const LIQUOR_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/liquors/`;
const LIQUOR_NOTES_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/similar-tasting-notes`;
const AI_LIQUOR_NOTES_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ai_similar_keywords/11`;
const SAVE_REVIEW_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes`;

export const fetchLiquorData = async (
  liquorId: string,
): Promise<LiquorData> => {
  const response = await fetch(LIQUOR_URL + liquorId);
  if (!response.ok) throw new Error("Failed to fetch data");
  return await response.json();
};

export const fetchAiNotes = async (): Promise<aiNotes> => {
  const response = await fetch(AI_LIQUOR_NOTES_URL);
  if (!response.ok) throw new Error("Failed to fetch AI notes");
  return await response.json();
};

export const fetchRelatedNotes = async (
  note: string,
  exclude: string,
): Promise<string[]> => {
  const response = await fetch(
    `${LIQUOR_NOTES_URL}?keyword=${encodeURIComponent(note)}&exclude=${encodeURIComponent(exclude)}&limit=5`,
  );
  if (!response.ok) throw new Error("Failed to fetch related notes");
  return (await response.json())["tastingNotes"];
};

export const saveReviewData = async (data: ReviewSavingData): Promise<void> => {
  const response = await fetch(SAVE_REVIEW_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to save review data");
  }
};
