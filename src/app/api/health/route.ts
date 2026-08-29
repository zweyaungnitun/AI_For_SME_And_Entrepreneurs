import { specialists } from "@/lib/agents/registry";
import { dbConfigured, llmConfigured, llmModel } from "@/lib/config";
import { ensureDb } from "@/lib/db/ensure";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "neon" | "error" | "off" = "off";
  let vector: "pgvector" | "off" = "off";

  if (dbConfigured()) {
    const ok = await ensureDb();
    if (ok) {
      database = "neon";
      vector = "pgvector";
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
    agents: specialists.map((a) => a.id),
  });
}