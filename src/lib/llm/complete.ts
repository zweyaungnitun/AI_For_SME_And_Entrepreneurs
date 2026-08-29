import { llmConfigured, llmModel } from "@/lib/config";

type CompleteArgs = {
  system: string;
  prompt: string;
  json?: boolean;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

export async function complete(args: CompleteArgs): Promise<string> {
  if (!llmConfigured()) {
    throw new Error("LLM is not configured");
  }

  const key = process.env.GEMINI_API_KEY as string;
  const model = llmModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": key,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: args.system }] },
      contents: [{ role: "user", parts: [{ text: args.prompt }] }],
      generationConfig: {
        temperature: 0.3,
        ...(args.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
  });

  const data = (await res.json()) as GeminiResponse;

  if (!res.ok) {
    throw new Error(data.error?.message || `Gemini request failed (${res.status})`);
  }

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  return text || "";
}

export function extractJson<T>(text: string, fallback: T): T {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return fallback;
  try {
    return JSON.parse(match[0]) as T;
  } catch {
    return fallback;
  }
}
