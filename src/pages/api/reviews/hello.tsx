export default async function commonHandler(req, res) {
  const reviewData = {
    productID: 12123,
    noseScore: 29,
    palateScore: 77,
    finishScore: 29,
    noseMemo: "이것은 세상에서 제일 맛있는 향",
    palateMemo: "이것은 세상에서 제일 맛있는 맛",
    finishMemo: "이것은 세상에서 제일 맛있는 끝맛",
    overallNote:
      "세상에서 제일 맛있는 위스키가 있다면 이것이 바로 그 위스키일 것입니다.",
    mood: "neutral",
    noseNotes: ["건포도", "자두", "가죽", "건포도", "자두", "가죽", "잼"],
    palateNotes: ["건포도", "자enennen두", "가죽", "잼"],
    finishNotes: ["건포도", "자두", "가죽", "잼wkwkkw"],
    author: "작성자",
    date: "2024-08-08",
    liquorData: {
      thumbnailImageUrl:
        "https://d1e2y5wc27crnp.cloudfront.net/media/core/product/thumbnail/7d0e0525-9062-469c-a3ad-0a5f25d3ee9b.webp",
      koName: "카발란 솔리스트 마데이라 캐스크 CS",
      type: "Whiskey",
      abv: "40%",
      volume: "700ml",
      country: "Scotland",
      region: "Highlands",
      grapeVariety: null,
    },
  };
  const reviewData2 = {
    productID: 12123,
    noseScore: null,
    palateScore: null,
    finishScore: null,
    noseMemo: null,
    palateMemo: null,
    finishMemo: null,
    overallNote: null,
    mood: null,
    noseNotes: [],
    palateNotes: [],
    finishNotes: [],
    author: "작성자",
    date: "2024-08-08",
    liquorData: {
      thumbnailImageUrl:
        "https://d1e2y5wc27crnp.cloudfront.net/media/core/product/thumbnail/7d0e0525-9062-469c-a3ad-0a5f25d3ee9b.webp",
      koName: "카발란 솔리스트 마데이라 캐스크 CS",
      type: "Whiskey",
      abv: "40%",
      volume: "700ml",
      country: "Scotland",
      region: "Highlands",
      grapeVariety: null,
    },
  };

  if (req.method === "GET") res.status(200).json(reviewData);
}
