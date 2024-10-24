import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const store = searchParams.get("store") || "dailyshot";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");

    if (!query) {
      return NextResponse.json(
        { error: "검색어가 필요합니다." },
        { status: 400 }
      );
    }

    const url = getSearchUrl(store, query, page, pageSize);
    if (!url) {
      return NextResponse.json(
        { error: "지원하지 않는 스토어입니다." },
        { status: 400 }
      );
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("검색 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function getSearchUrl(
  store: string,
  query: string,
  page: number,
  pageSize: number
): string | null {
  const urls: Record<string, (q: string, p: number, ps: number) => string> = {
    dailyshot: (q, p, ps) =>
      `https://api.dailyshot.co/items/search?q=${q}&page=${p}&page_size=${ps}`,
    traders: (q, p, ps) =>
      `https://hbsinvtje8.execute-api.ap-northeast-2.amazonaws.com/ps/search/products?offset=${(p - 1) * ps}&limit=${ps}&store_id=2006&biztp=1200&search_term=${q}&sort_type=recommend`,
  };

  const urlGenerator = urls[store];
  return urlGenerator
    ? urlGenerator(encodeURIComponent(query), page, pageSize)
    : null;
}
