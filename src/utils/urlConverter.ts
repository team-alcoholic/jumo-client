export const isNaverCafeUrl = (url: string): boolean => {
  // Define the prefix to check for
  const prefix = "https://cafe.naver.com";

  // Check if the URL starts with the specified prefix
  return url.startsWith(prefix);
};

export const convertToMobileUrl = (pcUrl: string): string | null => {
  // Define regex patterns to extract clubid and articleid
  const clubidPattern = /clubid(?:%3D|=)(\d+)/;
  const articleidPattern = /articleid(?:%3D|=)(\d+)/;

  // Match patterns against the URL
  const clubidMatch = pcUrl.match(clubidPattern);
  const articleidMatch = pcUrl.match(articleidPattern);

  // Check if both ids are found
  if (clubidMatch && articleidMatch) {
    const clubid = clubidMatch[1];
    const articleid = articleidMatch[1];

    // Construct the mobile URL
    const mobileUrl = `https://m.cafe.naver.com/ca-fe/web/cafes/${clubid}/articles/${articleid}?fromList=true&menuId=51&tc=cafe_article_list`;
    return mobileUrl;
  }

  // Return null if extraction fails
  return null;
};
