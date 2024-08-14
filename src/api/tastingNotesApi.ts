export interface aiNotes {
  noseNotes: string[];
  palateNotes: string[];
  finishNotes: string[];
}

export interface ReviewSavingData {
  liquorId: string;
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

export interface ReviewUpdateData {
  id: string;
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
const AI_LIQUOR_NOTES_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/ai-similar-tasting-notes`;
const SAVE_REVIEW_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/tasting-notes`;

export const fetchLiquorData = async (
  liquorId: string,
): Promise<LiquorData> => {
  const response = await fetch(LIQUOR_URL + liquorId);
  if (!response.ok) throw new Error("Failed to fetch data");

  return await response.json();
};

export const fetchAiNotes = async (liquorId: string): Promise<aiNotes> => {
  const response = await fetch(AI_LIQUOR_NOTES_URL + "/" + liquorId);
  if (!response.ok) return { noseNotes: [], palateNotes: [], finishNotes: [] };
  return await response.json();
};

export const fetchRelatedNotes = async (
  note: string,
  exclude: string,
): Promise<string[]> => {
  const response = await fetch(
    `${LIQUOR_NOTES_URL}?keyword=${encodeURIComponent(note)}&exclude=${encodeURIComponent(exclude)}&limit=5`,
  );

  if (!response.ok) return [];

  return (await response.json())["tastingNotes"];
};

export const saveReviewData = async (data: ReviewSavingData): Promise<void> => {
  const response = await fetch(SAVE_REVIEW_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키를 포함하여 요청

    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
};

export const updateReviewData = async (
  data: ReviewUpdateData,
): Promise<void> => {
  const response = await fetch(SAVE_REVIEW_URL + "/" + data.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // 쿠키를 포함하여 요청

    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw await response.json();
  }
  return await response.json();
};

export const checkUserPermission = async (user: User) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
      {
        method: "GET",
        credentials: "include", // 세션 기반 인증에 필요한 경우 추가
      },
    );
    const fetchedUser = await response.json();
    return fetchedUser.userUuid === user.userUuid;
  } catch (error) {
    console.error("Error fetching auth data:", error);
    return false;
  }
};
