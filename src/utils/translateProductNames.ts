import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

export async function translateProductNames(
  results: SearchResultItem[]
): Promise<SearchResultItem[]> {
  if (!results.length) return [];

  const names = results.map((item) => item.name);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a professional translator. Translate the given Japanese product names to Korean. Keep brand names, numbers and units (ml, L) unchanged. Return the translations in the same order as input array.",
        },
        {
          role: "user",
          content: JSON.stringify(names),
        },
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
                  description: "Translated product name",
                },
              },
            },
            required: ["translations"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      const { translations } = JSON.parse(content);

      return results.map((item, index) => ({
        ...item,
        name: translations[index],
        original: {
          name: item.name,
        },
      }));
    }

    return results;
  } catch (error) {
    console.error("Translation error:", error);
    return results;
  }
}
