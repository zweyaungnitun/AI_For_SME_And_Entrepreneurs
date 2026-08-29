export const APP_NAME = "SME Copilot";
export const APP_TAGLINE =
  "AI partner for Myanmar SMEs — smarter money decisions, clearer next actions";

export type LLMProvider = "openai" | "anthropic" | "gemini" | "demo";

export function llmProvider(): LLMProvider {
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";
  return "demo";
}

export function llmConfigured() {
  return llmProvider() !== "demo";
}

export function llmModel() {
  const provider = llmProvider();
  if (provider === "openai") {
    return process.env.OPENAI_MODEL?.trim() || "gpt-4-turbo";
  }
  if (provider === "anthropic") {
    return process.env.ANTHROPIC_MODEL?.trim() || "claude-3-5-sonnet-20241022";
  }
  if (provider === "gemini") {
    return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash-thinking-exp-01-21";
  }
  return "demo";
}

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function embeddingModel() {
  const provider = llmProvider();
  if (provider === "openai") {
    return process.env.OPENAI_EMBED_MODEL?.trim() || "text-embedding-3-small";
  }
  return process.env.GEMINI_EMBED_MODEL?.trim() || "text-embedding-004";
}
