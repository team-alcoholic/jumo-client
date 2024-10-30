import { whiskyDictionary } from "@/constants/whiskyDictionary";
// Levenshtein 거리 계산 함수 추가
function levenshteinDistance(a: string, b: string): number {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
}

// 문자열 정규화 함수
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, "") // 모든 공백 제거
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // 특수문자 제거
    .replace(/(whisky|whiskey|위스키)/gi, "") // 위스키 관련 일반 단어 제거
    .replace(/(single|malt|싱글|몰트)/gi, ""); // 일반적인 위스키 용어 제거
}

// 검색어 전처리 함수
export function cleanWhiskyName(input: string): string {
  return input
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // 특수문자 제거
    .replace(/\s+/g, "") // 공백 제거
    .replace(/(whisky|whiskey|위스키)/gi, "") // 위스키 관련 일반 단어 제거
    .replace(/(single|malt|싱글|몰트)/gi, "") // 일반적인 위스키 용어 제거
    .trim();
}

// 숫자/연도 추출 함수
export function extractYearInfo(input: string): string {
  const yearPatterns = [
    /(\d+)\s*년/, // 12년
    /(\d+)\s*year/i, // 12year, 12 Year
    /(\d+)\s*yo/i, // 12yo, 12 YO
    /(\d+)\s*y/i, // 12y, 12 Y
  ];

  for (const pattern of yearPatterns) {
    const match = input.match(pattern);
    if (match && match[1]) return match[1]; // 숫자 그룹만 반환
  }

  // 숫자만 있는 경우 (예: 12)
  const numberMatch = input.match(/\d+/);
  if (numberMatch) return numberMatch[0];

  return "";
}

// 검색 함수 수정
export function translateWhiskyNameToJapenese(input: string): {
  found: boolean;
  japanese?: string;
  yearInfo?: string;
} {
  const yearInfo = extractYearInfo(input);
  const normalizedInput = normalizeString(input);

  // 유사도 결과를 저장할 배열
  const matches: {
    key: string;
    similarity: number;
    value: (typeof whiskyDictionary)[keyof typeof whiskyDictionary];
  }[] = [];

  // 모든 위스키 항목에 대해 유사도 검사
  for (const [key, value] of Object.entries(whiskyDictionary)) {
    const normalizedKo = normalizeString(value.ko);
    const normalizedEn = normalizeString(value.en);

    // 한국어와 영어 이름 모두에 대해 유사도 계산
    const koDistance = levenshteinDistance(normalizedInput, normalizedKo);
    const enDistance = levenshteinDistance(normalizedInput, normalizedEn);

    // 더 작은 거리 값 사용 (더 유사한 것)
    const minDistance = Math.min(koDistance, enDistance);

    // 유사도 점수 계산 (거리가 짧을수록 유사도가 높음)
    const similarity = 1 / (minDistance + 1);

    matches.push({ key, similarity, value });
  }

  // 유사도가 가장 높은 항목 찾기
  matches.sort((a, b) => b.similarity - a.similarity);

  // 유사도가 일정 수준 이상인 경우에만 결과 반환
  if (matches.length > 0 && matches[0].similarity > 0.1) {
    // 임계값 조정 가능
    const bestMatch = matches[0].value;
    return {
      found: true,
      japanese: yearInfo ? `${bestMatch.ja} ${yearInfo}` : bestMatch.ja,
      yearInfo,
    };
  }

  return { found: false };
}
