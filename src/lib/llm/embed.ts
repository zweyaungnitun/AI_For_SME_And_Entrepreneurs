import { embeddingModel, llmConfigured } from "@/lib/config";

type EmbedResponse = {
  embedding?: { values?: number[] };
  error?: { message?: string };
};

export const EMBED_DIM = 768;

export async function embed(text: string): Promise<number[] | null> {
  if (!llmConfigured()) return null;

  const key = process.env.GEMINI_API_KEY as string;
  const model = embeddingModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      model: `models/${model}`,
      content: { parts: [{ text: text.slice(0, 8000) }] },
    }),
  });

  const data = (await res.json()) as EmbedResponse;
  if (!res.ok || !data.embedding?.values?.length) return null;
  return data.embedding.values;
}

export function vectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}
