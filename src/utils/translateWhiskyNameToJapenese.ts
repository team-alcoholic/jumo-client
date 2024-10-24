import { whiskyDictionary } from "@/constants/whiskyDictionary";
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
// 검색 함수
export function translateWhiskyNameToJapenese(input: string): {
  found: boolean;
  japanese?: string;
  yearInfo?: string;
} {
  const yearInfo = extractYearInfo(input);
  const cleaned = cleanWhiskyName(input);

  // 1. 정확한 매칭 시도
  for (const [key, value] of Object.entries(whiskyDictionary)) {
    if (
      cleaned.includes(key) ||
      cleaned.includes(value.ko) ||
      cleaned.includes(value.en.toLowerCase())
    ) {
      return {
        found: true,
        japanese: yearInfo ? `${value.ja} ${yearInfo}` : value.ja,
        yearInfo,
      };
    }
  }

  // 3. 부분 매칭 시도
  for (const [key, value] of Object.entries(whiskyDictionary)) {
    if (
      value.ko.includes(cleaned) ||
      value.en.toLowerCase().includes(cleaned)
    ) {
      return {
        found: true,
        japanese: yearInfo ? `${value.ja} ${yearInfo}` : value.ja,
        yearInfo,
      };
    }
  }

  return { found: false };
}
