export const APP_NAME = "SME Copilot";
export const APP_TAGLINE =
  "AI partner for Myanmar SMEs — smarter money decisions, clearer next actions";

export function llmConfigured() {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function llmModel() {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
}

export function llmProvider() {
  return llmConfigured() ? "gemini" : "demo";
}

export function dbConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export function embeddingModel() {
  return process.env.GEMINI_EMBED_MODEL?.trim() || "text-embedding-004";
}
