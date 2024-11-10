import { NextRequest, NextResponse } from "next/server";
import iconv from "iconv-lite";
import { JSDOM } from "jsdom";
import { translateWhiskyNameToJapenese } from "@/utils/translateWhiskyNameToJapenese";
import fetch from "node-fetch";
import OpenAI from "openai";

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 캐시 타입 정의
interface CacheItem {
  data: any;
  timestamp: number;
}

let cache: Record<string, CacheItem> = {};

// SearchResult 인터페이스 정의
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
async function translateProductNames(results: SearchResultItem[]): Promise<SearchResultItem[]> {
  if (!results.length) return [];

  const names = results.map(item => item.name);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Translate the given Japanese product names to Korean. Keep brand names, numbers and units (ml, L) unchanged. Return the translations in the same order as input array."
        },
        {
          role: "user",
          content: JSON.stringify(names)
        }
      ],
      temperature: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "translation_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              translations: {
                type: "array",
                items: {
                  type: "string",
                  description: "Translated product name"
                }
              }
            },
            required: ["translations"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const { translations } = JSON.parse(content);

      return results.map((item, index) => ({
        ...item,
        name: translations[index],
        original: {
          name: item.name
        }
      }));
    }

    return results;
  } catch (error) {
    console.error("Translation error:", error);
    return results;
  }
}

function toEUCJPEncoding(query: string): string {
  const eucJPEncoded = iconv.encode(query, "euc-jp");
  return Array.from(eucJPEncoded)
      .map((byte) => `%${byte.toString(16).toUpperCase().padStart(2, "0")}`)
      .join("");
}

type StoreType = "dailyshot" | "mukawa" | "cu" | "traders" | "getju" | "emart" | "lottemart" | "biccamera";

interface SearchParams {
  query: string;
  store: StoreType;
  page: number;
  pageSize: number;
}

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") || "";
    const store = (request.nextUrl.searchParams.get("store") || "dailyshot") as StoreType;
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
    const pageSize = parseInt(request.nextUrl.searchParams.get("pageSize") || "12", 10);

    const params: SearchParams = { query, store, page, pageSize };

    if (!params.query) {
      return NextResponse.json(
          { error: "검색어가 필요합니다." },
          { status: 400 }
      );
    }

    // 캐시 확인
    const cacheKey = `${params.query}-${params.store}`;
    const cachedResult = cache[cacheKey];
    if (cachedResult && Date.now() - cachedResult.timestamp < 24 * 60 * 60 * 1000) {
      return NextResponse.json(cachedResult.data);
    }

    // 무카와 스토어의 경우 위스키 이름 번역
    if (params.store === "mukawa" && params.query) {
      const translatedQuery = translateWhiskyNameToJapenese(params.query);
      params.query = translatedQuery.japanese || params.query;
    }

    let searchResult = await performSearch(params);

    // 무카와/빅카메라 결과 번역
    if ((params.store === "mukawa" || params.store === "biccamera") && searchResult) {
      searchResult = await translateProductNames(searchResult);
    }

    // 검색 결과가 없는 경우 첫 단어로 재검색
    if (!searchResult?.length) {
      const firstValidWord = params.query?.split(" ").find((word) => word.length >= 2);
      if (firstValidWord) {
        searchResult = await performSearch({
          ...params,
          query: firstValidWord,
        });

        if ((params.store === "mukawa" || params.store === "biccamera") && searchResult) {
          searchResult = await translateProductNames(searchResult);
        }
      }
    }

    // 캐시 저장
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

// 나머지 performSearch, parseMukawaHtml, parseBiccameraHtml 등의 함수들은
// 이전 코드와 동일하게 유지...
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


// 나머지 API 함수들은 생략합니다.
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
  store: StoreType,
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
    lottemart: () =>
      `https://company.lottemart.com/mobiledowa/product/search_product.asp`,
    emart: (q: string, p: number, ps: number) =>
      `https://hbsinvtje8.execute-api.ap-northeast-2.amazonaws.com/ps/search/products?offset=${
        (p - 1) * ps
      }&limit=${ps}&store_id=1090&biztp=1100&search_term=${encodeURIComponent(q)}&sort_type=sale`,
    biccamera: (q: string) =>
      `https://www.biccamera.com/bc/category/?q=${encodeURIComponent(q.replace(/ /g, "+"))}`,
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

// 롯데마트 HTML 파싱 함수 추가
function parseLottemartHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const productItems = document.querySelectorAll(".list-result li");

  const results = Array.from(productItems).map((item) => {
    const element = item as Element;
    const name = element.querySelector(".prod-name")?.textContent?.trim();
    const size = element.querySelector(".prod-count")?.textContent?.trim();

    // layer_popup 내부의 info-list에서 가격 정보 추출
    const infoList = element.querySelector(".info-list");
    const rows = infoList?.querySelectorAll("tr");

    let price = 0;

    rows?.forEach((row) => {
      const label = row.querySelector("th")?.textContent?.trim();
      const value = row.querySelector("td")?.textContent?.trim();

      if (label?.includes("가격")) {
        price = value ? parseInt(value.replace(/[^0-9]/g, "")) : 0;
      }
    });

    return {
      name: name ? `${name} ${size || ""}` : "",
      price,
      url: undefined,
      description: undefined,
    };
  });

  return results.filter((item) => item.name && item.price);
}

// 롯데마트 지점 정보 정의
const LOTTEMART_STORES = [
  { area: "서울", market: "301" },
  { area: "경기", market: "471" },
  { area: "서울", market: "334" },
  { area: "서울", market: "307" },
  { area: "경기", market: "415" },
];

async function performLottemartSearch(
  query: string
): Promise<SearchResultItem[]> {
  const url =
    "https://company.lottemart.com/mobiledowa/product/search_product.asp";

  // 모든 지점에 대한 검색 요청을 병렬로 실행
  const searchPromises = LOTTEMART_STORES.map(async ({ area, market }) => {
    const formData = new URLSearchParams({
      p_area: area,
      p_market: market,
      p_schWord: query,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      if (!response.ok) {
        console.error(
          `롯데마트 ${area} ${market} 검색 실패: ${response.status}`
        );
        return [];
      }

      const html = await response.text();
      return parseLottemartHtml(html);
    } catch (error) {
      console.error(`롯데마트 ${area} ${market} 검색 오류:`, error);
      return [];
    }
  });

  // 모든 검색 결과 대기
  const allResults = await Promise.all(searchPromises);

  // 결과 합치기 및 중복 제거 (상품명 기준)
  const uniqueResults = new Map<string, SearchResultItem>();

  allResults.flat().forEach((item) => {
    const existingItem = uniqueResults.get(item.name);
    if (!existingItem || item.price < existingItem.price) {
      // 같은 상품이 있는 경우 더 낮은 가격으로 업데이트
      uniqueResults.set(item.name, item);
    }
  });

  return Array.from(uniqueResults.values());
}

async function performSearch({
  store,
  query,
  page,
  pageSize,
}: {
  store: StoreType;
  query: string;
  page: number;
  pageSize: number;
}): Promise<SearchResultItem[]> {
  if (store === "lottemart") {
    return performLottemartSearch(query);
  }

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
  } else if (store === "cu") {
    // CU는 POST 방식 사용
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchWord: query,
        prevSearchWord: query.split(" ")[0],
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
    results = data.data.cubarResult.result.rows.map((item: CUItem) => ({
      name: item.fields.item_nm,
      price: parseInt(item.fields.hyun_maega, 10),
      url: `https://www.pocketcu.co.kr${item.fields.link_url}`,
    }));
  } else if (store === "mukawa") {
    response = await fetch(url);
    if (!response.ok) {
      throw new Error(`무카와 API 요청 실패: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const decodedHtml = iconv.decode(Buffer.from(buffer), "euc-jp");
    results = parseMukawaHtml(decodedHtml);
  } else if (store === "biccamera") {
    response = await fetch(url, {
      headers: {
        "User-Agent": "PostmanRuntime/7.42.0",
      },
    });

    if (!response.ok) {
      throw new Error(`빅카메라 API 요청 실패: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const decodedHtml = iconv.decode(Buffer.from(buffer), "shift-jis");
    results = parseBiccameraHtml(decodedHtml);
  } else {
    // dailyshot, traders, emart는 기존 방식 유지
    response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    if (store === "dailyshot") {
      results = data.results || [];
    } else if (store === "traders" || store === "emart") {
      results = data.data.map((item: any) => ({
        name: item.sku_nm,
        price: item.sell_price,
        soldOut: item.stock_status === "NO_STOCK",
      }));
    } else {
      results = [];
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

// 빅카메라 HTML 파싱 함수 추가
function parseBiccameraHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const productItems = document.querySelectorAll(".prod_box");

  const results = Array.from(productItems).map((item) => {
    const element = item as Element;
    const name = element.querySelector(".bcs_title a")?.textContent?.trim();
    const priceText = element
      .querySelector(".bcs_price .val")
      ?.textContent?.trim();
    const price = priceText ? parseInt(priceText.replace(/[^0-9]/g, "")) : 0;
    // URL 중복 제거
    const urlPath =
      element.querySelector(".bcs_title a")?.getAttribute("href") || "";
    const url = urlPath.startsWith("http")
      ? urlPath
      : `https://www.biccamera.com${urlPath}`;

    return { name, price, url };
  });

  return results.filter((item) => item.name && item.price);
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
