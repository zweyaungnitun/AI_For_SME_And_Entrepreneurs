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

/** Deterministic 768-d vector so demo rows are never NULL if Gemini is down. */
export function hashedEmbedding(text: string): number[] {
  const values = new Array<number>(EMBED_DIM).fill(0);
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const token of tokens) {
    let hash = 2166136261;
    for (let i = 0; i < token.length; i += 1) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    values[(hash >>> 0) % EMBED_DIM] += 1;
  }
  const norm = Math.sqrt(values.reduce((sum, n) => sum + n * n, 0)) || 1;
  return values.map((n) => n / norm);
}

export async function embedOrFallback(text: string): Promise<number[]> {
  return (await embed(text)) ?? hashedEmbedding(text);
}

export function vectorLiteral(values: number[]) {
  return `[${values.join(",")}]`;
}
