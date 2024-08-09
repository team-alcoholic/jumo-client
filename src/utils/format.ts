/**
 * 가격에 콤마를 추가하는 함수
 * @param price
 */
export const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 요일 배열
const days = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * 날짜를 포맷팅하는 함수
 * @param dateString
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const day = days[date.getDay()];
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const dayOfMonth = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);

  return `모임 시작 ${month}.${dayOfMonth}(${day}) ${hours}:${minutes}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = days[date.getUTCDay()];
  return `${("0" + (date.getUTCMonth() + 1)).slice(-2)}.${("0" + date.getUTCDate()).slice(-2)}(${day})`;
};

export const formatDateWithoutDay = (dateString: string): string => {
  const date = new Date(dateString);
  return `${("0" + (date.getUTCMonth() + 1)).slice(-2)}.${("0" + date.getUTCDate()).slice(-2)}`;
};

export const calculateAverageScore = (
  score1: number | null,
  score2: number | null,
  score3: number | null,
): number | null => {
  const scores = [score1, score2, score3];
  const validScores = scores.filter((score) => score !== null);
  if (validScores.length === 0) return null;

  const averageScore =
    validScores.reduce((a, b) => a + b, 0) / validScores.length;
  return Math.round(averageScore * 10) / 10; // 소수 첫째 자리까지만 반환
};
