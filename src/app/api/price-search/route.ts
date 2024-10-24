import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const params = {
    query: request.nextUrl.searchParams.get("q"),
    store: request.nextUrl.searchParams.get("store") || "dailyshot",
    page: parseInt(request.nextUrl.searchParams.get("page") || "1"),
    pageSize: parseInt(request.nextUrl.searchParams.get("pageSize") || "12"),
  };

  if (!params.query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    let searchResult = await performSearch(params);

    if (!searchResult?.total) {
      const firstValidWord = params.query
        .split(" ")
        .find((word) => word.length >= 2);
      if (firstValidWord) {
        searchResult = await performSearch({
          ...params,
          query: firstValidWord,
        });
      }
    }

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("검색 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

async function performSearch({ store, query, page, pageSize }) {
  const url = getSearchUrl(store, query, page, pageSize);
  if (!url) {
    throw new Error("지원하지 않는 스토어입니다.");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  return response.json();
}

function getSearchUrl(
  store: string,
  query: string,
  page: number,
  pageSize: number
): string | null {
  const urls = {
    dailyshot: (q: string, p: number, ps: number) =>
      `https://api.dailyshot.co/items/search?q=${q}&page=${p}&page_size=${ps}`,
    traders: (q: string, p: number, ps: number) =>
      `https://hbsinvtje8.execute-api.ap-northeast-2.amazonaws.com/ps/search/products?offset=${
        (p - 1) * ps
      }&limit=${ps}&store_id=2006&biztp=1200&search_term=${q}&sort_type=recommend`,
  };

  const urlGenerator = urls[store];
  return urlGenerator
    ? urlGenerator(encodeURIComponent(query), page, pageSize)
    : null;
}
