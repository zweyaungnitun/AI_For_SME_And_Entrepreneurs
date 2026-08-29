export const APP_NAME = "Foundry";
export const APP_TAGLINE = "Multi-agent counsel for SMEs and founders";

export function llmConfigured() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function llmModel() {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

export function llmBaseUrl() {
  return (process.env.OPENAI_BASE_URL?.trim() || "https://api.openai.com/v1").replace(
    /\/$/,
    "",
  );
}
