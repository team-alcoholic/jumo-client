
// getju HTML 파싱 함수 추가
import {JSDOM} from "jsdom";

export function parseGetjuHtml(html: string) {
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
        const url = element.querySelector(".info .name a")?.getAttribute("href");
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
export function parseLottemartHtml(html: string) {
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


export function parseMukawaHtml(html: string) {
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
export function parseBiccameraHtml(html: string) {
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