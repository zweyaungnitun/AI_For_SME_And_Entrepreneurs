export { dbConfigured, getSql } from "@/lib/db/client";
export { ensureDb } from "@/lib/db/ensure";
export { loadShopLedger, persistExtractedNote } from "@/lib/db/shops";
export { persistRun } from "@/lib/db/runs";
export { searchKnowledge } from "@/lib/db/knowledge";
export {
  SCHEMA_STATEMENTS,
  EMBED_DIMENSIONS,
  HEALTH_LABELS,
  KNOWLEDGE_KINDS,
} from "@/lib/db/schema";
