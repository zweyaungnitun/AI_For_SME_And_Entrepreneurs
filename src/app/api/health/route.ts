import { specialists } from "@/lib/agents/registry";
import { dbConfigured, llmConfigured, llmModel } from "@/lib/config";
import { ensureDb } from "@/lib/db/ensure";
import { getSql } from "@/lib/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "neon" | "error" | "off" = "off";
  let vector: "pgvector" | "off" = "off";
  let knowledgeChunks = 0;

  if (dbConfigured()) {
    const ok = await ensureDb();
    if (ok) {
      database = "neon";
      vector = "pgvector";
      try {
        const rows = (await getSql()`
          SELECT COUNT(*)::int AS n FROM knowledge_chunks
        `) as Array<{ n: number }>;
        knowledgeChunks = Number(rows[0]?.n ?? 0);
      } catch {
        database = "error";
        vector = "off";
      }
    } else {
      database = "error";
    }
  }

  return Response.json({
    ok: true,
    app: "sme-copilot",
    mode: llmConfigured() ? "llm" : "demo",
    model: llmConfigured() ? llmModel() : "demo",
    database,
    vector,
    knowledgeChunks,
    agents: specialists.map((a) => a.id),
  });
}
