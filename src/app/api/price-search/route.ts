import { NextRequest, NextResponse } from "next/server";
import iconv from "iconv-lite";
import { JSDOM } from "jsdom";
import { translateWhiskyNameToJapenese } from "@/utils/translateWhiskyNameToJapenese";
import fetch from "node-fetch";

// 캐시를 저장할 객체 (In-Memory)
let cache = {};

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

  // 무카와인 경우 위스키 이름을 일본어로 번역
  if (params.store === "mukawa") {
    params.query = translateWhiskyNameToJapenese(params.query).japanese;
  }

  try {
    let searchResult = await performSearch(params);

    if (params.store === "mukawa" && searchResult) {
      // 상품명만 번역하도록 수정
      searchResult = await translateProductNames(searchResult);
    }

    if (!searchResult?.length) {
      const firstValidWord = params.query
        .split(" ")
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
// 상품명만 번역하는 새로운 함수
async function translateProductNames(results) {
  const translatedResults = [];

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

async function performSearch({ store, query, page, pageSize }) {
  const url = getSearchUrl(store, query, page, pageSize);
  if (!url) {
    throw new Error("지원하지 않는 스토어입니다.");
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status}`);
  }

  if (store === "mukawa") {
    const buffer = await response.arrayBuffer();
    const decodedHtml = iconv.decode(Buffer.from(buffer), "euc-jp");
    return parseMukawaHtml(decodedHtml);
  }

  return response.json();
}

function getSearchUrl(store, query, page, pageSize) {
  const urls = {
    dailyshot: (q, p, ps) =>
      `https://api.dailyshot.co/items/search?q=${q}&page=${p}&page_size=${ps}`,
    traders: (q, p, ps) =>
      `https://hbsinvtje8.execute-api.ap-northeast-2.amazonaws.com/ps/search/products?offset=${
        (p - 1) * ps
      }&limit=${ps}&store_id=2006&biztp=1200&search_term=${q}&sort_type=recommend`,
    mukawa: (q) =>
      `https://mukawa-spirit.com/?mode=srh&cid=&keyword=${toEUCJPEncoding(q)}`,
  };

  const urlGenerator = urls[store];
  return urlGenerator ? urlGenerator(query, page, pageSize) : null;
}

function parseMukawaHtml(html: string) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const productItems = document.querySelectorAll(".list-product-item");

  const results = Array.from(productItems).map((item) => {
    const name = item
      .querySelector(".list-product-item__ttl")
      ?.textContent?.trim();
    const priceText = item
      .querySelector(".list-product-item__price")
      ?.textContent?.trim();
    const price = priceText ? parseInt(priceText.replace(/[^0-9]/g, "")) : 0;
    const description = item
      .querySelector(".list-product-item__memo")
      ?.textContent?.trim();
    const url =
      "https://mukawa-spirit.com" +
      item.querySelector("a")?.getAttribute("href");

    return { name, price, description, url };
  });

  return results;
}
