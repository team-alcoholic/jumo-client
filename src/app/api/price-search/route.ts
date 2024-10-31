import { NextRequest, NextResponse } from "next/server";
import iconv from "iconv-lite";
import { JSDOM } from "jsdom";
import { translateWhiskyNameToJapenese } from "@/utils/translateWhiskyNameToJapenese";
import fetch from "node-fetch";

// 캐시 타입 정의
interface CacheItem {
  data: any;
  timestamp: number;
}

// 캐시를 저장할 객체 (In-Memory)
let cache: Record<string, CacheItem> = {};

async function translateText(text: string): Promise<string> {
  if (!text) return "";

  try {
    const response = await fetch("https://api-free.deepl.com/v2/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      },
      body: new URLSearchParams({
        text: text,
        source_lang: "JA",
        target_lang: "KO",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Translation API error:", errorData);
      return text;
    }

    const data = await response.json();
    return data.translations[0]?.text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}

function toEUCJPEncoding(query: string) {
  const eucJPEncoded = iconv.encode(query, "euc-jp");
  return Array.from(eucJPEncoded)
    .map((byte) => `%${byte.toString(16).toUpperCase().padStart(2, "0")}`)
    .join("");
}

export async function GET(request: NextRequest) {
  const params = {
    query: request.nextUrl.searchParams.get("q") || "",
    store: (request.nextUrl.searchParams.get("store") || "dailyshot") as
      | "dailyshot"
      | "mukawa"
      | "cu"
      | "traders",
    page: parseInt(request.nextUrl.searchParams.get("page") || "1"),
    pageSize: parseInt(request.nextUrl.searchParams.get("pageSize") || "12"),
  };

  if (!params.query) {
    return NextResponse.json(
      { error: "검색어가 필요합니다." },
      { status: 400 }
    );
  }

  // 캐싱된 결과가 있는지 확인
  const cacheKey = `${params.query}-${params.store}`;
  const cachedResult = cache[cacheKey];

  if (
    cachedResult &&
    Date.now() - cachedResult.timestamp < 24 * 60 * 60 * 1000
  ) {
    // 캐싱된 데이터를 반환
    return NextResponse.json(cachedResult.data);
  }

  // ��카와인 경우 위스��� 이름을 일본어로 번역
  if (params.store === "mukawa" && params.query) {
    const translatedQuery = translateWhiskyNameToJapenese(params.query);
    params.query = translatedQuery.japanese || params.query;
  }

  try {
    let searchResult = await performSearch(params);

    if (params.store === "mukawa" && searchResult) {
      // 상품명만 번역하도록 수정
      searchResult = await translateProductNames(searchResult);
    }

    if (!searchResult?.length) {
      const firstValidWord = params.query
        ?.split(" ")
        .find((word) => word.length >= 2);
      if (firstValidWord) {
        searchResult = await performSearch({
          ...params,
          query: firstValidWord,
        });
        if (params.store === "mukawa" && searchResult) {
          searchResult = await translateProductNames(searchResult);
        }
      }
    }

    // 캐싱 저장
    cache[cacheKey] = {
      data: searchResult,
      timestamp: Date.now(),
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error("검색 처리 중 오류 발생:", error);
    return NextResponse.json(
      { error: "검색 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 검색 결과 아이템의 인터페이스 정의
interface SearchResultItem {
  name: string;
  price: number;
  url?: string;
  description?: string;
  soldOut?: boolean;
  original?: {
    name: string;
  };
}

// 상품명만 번역하는 새로운 함수
async function translateProductNames(
  results: SearchResultItem[]
): Promise<SearchResultItem[]> {
  const translatedResults: SearchResultItem[] = [];

  for (const item of results) {
    // Rate limiting 방지를 위한 딜레이
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const translatedName = await translateText(item.name);

    translatedResults.push({
      ...item,
      name: translatedName,
      original: {
        name: item.name,
      },
    });
  }

  return translatedResults;
}

// CU API 응답의 타입을 정의합니다.
interface CUApiResponse {
  data: {
    cubarResult: {
      result: {
        rows: Array<{
          fields: {
            item_nm: string;
            hyun_maega: string;
            link_url: string;
          };
        }>;
      };
    };
  };
}

// CU 아이템의 타입을 정의합니다.
interface CUItem {
  fields: {
    item_nm: string;
    hyun_maega: string;
    link_url: string;
  };
}

function getSearchUrl(
  store: "dailyshot" | "mukawa" | "cu" | "traders" | "getju",
  query: string,
  page: number,
  pageSize: number
) {
  const urls = {
    cu: () => `https://www.pocketcu.co.kr/api/search/rest/total/cubar`,
    dailyshot: (q: string, p: number, ps: number) =>
      `https://api.dailyshot.co/items/search?q=${q}&page=${p}&page_size=${ps}`,
    traders: (q: string, p: number, ps: number) =>
      `https://hbsinvtje8.execute-api.ap-northeast-2.amazonaws.com/ps/search/products?offset=${
        (p - 1) * ps
      }&limit=${ps}&store_id=2006&biztp=1200&search_term=${q}&sort_type=recommend`,
    mukawa: (q: string) =>
      `https://mukawa-spirit.com/?mode=srh&cid=&keyword=${toEUCJPEncoding(q)}`,
    getju: (q: string) =>
      `https://www.getju.co.kr/shop/search_result.php?search_str=${encodeURIComponent(q)}`,
  };

  const urlGenerator = urls[store];
  return urlGenerator ? urlGenerator(query, page, pageSize) : null;
}

// getju HTML 파싱 함수 추가
function parseGetjuHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const productItems = document.querySelectorAll("#prd_basic li");

  const results = Array.from(productItems).map((item) => {
    const element = item as Element;
    const name = element.querySelector(".info .name a")?.textContent?.trim();
    const priceText = element
      .querySelector(".price .sell strong")
      ?.textContent?.trim();
    const price = priceText ? parseInt(priceText.replace(/[^0-9]/g, "")) : 0;
    const url =
      "https://www.getju.co.kr" +
      element.querySelector(".info .name a")?.getAttribute("href");
    const type = element.querySelector(".info .type")?.textContent?.trim();
    const isSoldOut = element.querySelector(".soldout") !== null;

    return {
      name,
      price,
      url,
      type,
      isSoldOut,
    };
  });

  return results.filter((item) => item.name && item.price);
}

async function performSearch({
  store,
  query,
  page,
  pageSize,
}: {
  store: "dailyshot" | "mukawa" | "cu" | "traders" | "getju";
  query: string;
  page: number;
  pageSize: number;
}): Promise<SearchResultItem[]> {
  const url = getSearchUrl(store, query, page, pageSize);
  if (!url) {
    throw new Error("지원하지 않는 스토어입니다.");
  }

  let response;
  let results;

  if (store === "getju") {
    response = await fetch(url);
    if (!response.ok) {
      throw new Error(`겟주 API 요청 실패: ${response.status}`);
    }
    const html = await response.text();
    results = parseGetjuHtml(html);
  } else {
    if (store === "cu") {
      // CU는 POST 방식 사용
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchWord: query,
          prevSearchWord: query.split(" ")[0], // 첫 단어를 prevSearchWord로 사용
          spellModifyUseYn: "Y",
          offset: (page - 1) * pageSize,
          limit: pageSize,
          searchSort: "recom",
        }),
      });

      if (!response.ok) {
        throw new Error(`CU API 요청 실패: ${response.status}`);
      }

      const data = (await response.json()) as CUApiResponse;
      results = data.data.cubarResult.result.rows.map((item: CUItem) => {
        const fields = item.fields;
        return {
          name: fields.item_nm,
          price: parseInt(fields.hyun_maega, 10),
          url: `https://www.pocketcu.co.kr${fields.link_url}`,
        };
      });
    } else if (store === "mukawa") {
      // 무카와는 HTML 파싱을 사용
      response = await fetch(url);
      if (!response.ok) {
        throw new Error(`무카와 API 요청 실패: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const decodedHtml = iconv.decode(Buffer.from(buffer), "euc-jp");
      results = parseMukawaHtml(decodedHtml);
    } else {
      // dailyshot, traders는 기존 방식 유지
      response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      if (store === "dailyshot") {
        results = data.results || [];
      } else if (store === "traders") {
        results = data.data || [];
      } else {
        results = [];
      }
    }
  }

  // 통일된 형식으로 변환
  return results.map((item: SearchItem & { isSoldOut?: boolean }) => ({
    name: item.name || item.sku_nm,
    price: item.price || item.sell_price,
    url: item.url || item.web_url || undefined,
    description: item.description,
    soldOut: item.isSoldOut || false,
    original: {
      name: item.name,
    },
  }));
}

function parseMukawaHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const productItems = document.querySelectorAll(".list-product-item");

  const results = Array.from(productItems).map((item) => {
    const element = item as Element;
    const name = element
      .querySelector(".list-product-item__ttl")
      ?.textContent?.trim();
    const priceText = element
      .querySelector(".list-product-item__price")
      ?.textContent?.trim();
    const price = priceText ? parseInt(priceText.replace(/[^0-9]/g, "")) : 0;
    const description = element
      .querySelector(".list-product-item__memo")
      ?.textContent?.trim();
    const url =
      "https://mukawa-spirit.com" +
      element.querySelector("a")?.getAttribute("href");

    return { name, price, description, url };
  });

  return results;
}

interface SearchItem {
  name?: string;
  sku_nm?: string;
  price?: number;
  sell_price?: number;
  url?: string;
  web_url?: string;
  description?: string;
}
