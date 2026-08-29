import { llmBaseUrl, llmConfigured, llmModel } from "@/lib/config";

type CompleteArgs = {
  system: string;
  prompt: string;
  json?: boolean;
};

export async function complete(args: CompleteArgs): Promise<string> {
  if (!llmConfigured()) {
    throw new Error("LLM is not configured");
  }

  const key = process.env.OPENAI_API_KEY as string;
  const url = `${llmBaseUrl()}/chat/completions`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: llmModel(),
      temperature: 0.4,
      messages: [
        { role: "system", content: args.system },
        { role: "user", content: args.prompt },
      ],
      ...(args.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LLM request failed (${res.status}): ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || "";
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
