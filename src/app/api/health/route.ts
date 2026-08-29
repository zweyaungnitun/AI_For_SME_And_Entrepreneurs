import { specialists } from "@/lib/agents/registry";
import { llmConfigured, llmModel } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    app: "foundry",
    mode: llmConfigured() ? "llm" : "demo",
    model: llmConfigured() ? llmModel() : "demo",
    agents: specialists.map((a) => a.id),
  });
}
