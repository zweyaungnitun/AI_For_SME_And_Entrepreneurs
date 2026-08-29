import { specialists } from "@/lib/agents/registry";
import type { AgentId, BusinessContext, ChatTurn } from "@/lib/agents/types";
import { complete, extractJson } from "@/lib/llm/complete";
import { llmConfigured } from "@/lib/config";

const ALWAYS: AgentId[] = ["strategy"];

export function heuristicPlan(message: string, context: BusinessContext): AgentId[] {
  const hay = `${message} ${context.challenge} ${context.industry}`.toLowerCase();
  const picked = new Set<AgentId>(ALWAYS);

  for (const agent of specialists) {
    if (agent.keywords.some((k) => hay.includes(k))) picked.add(agent.id);
  }

  if (picked.size === 1) {
    picked.add("growth");
    picked.add("finance");
  }

  if (hay.includes("first 100") || hay.includes("customer") || hay.includes("launch")) {
    picked.add("growth");
    picked.add("market");
  }

  return specialists.map((a) => a.id).filter((id) => picked.has(id));
}

export async function planAgents(
  message: string,
  context: BusinessContext,
  history: ChatTurn[],
): Promise<{ agents: AgentId[]; rationale: string }> {
  const fallback = heuristicPlan(message, context);
  const rationale = `Route through ${fallback.join(", ")} given the stage (${context.stage}) and the ask.`;

  if (!llmConfigured()) {
    return { agents: fallback, rationale };
  }

  try {
    const raw = await complete({
      json: true,
      system:
        "You are Foundry's conductor. Pick 2-4 specialist ids from: strategy, finance, market, growth, ops. Always include strategy unless the question is purely operational. Return JSON {agents: string[], rationale: string}.",
      prompt: JSON.stringify({
        context,
        message,
        recent: history.slice(-4),
      }),
    });
    const parsed = extractJson<{ agents?: string[]; rationale?: string }>(raw, {});
    const allowed = new Set<string>(specialists.map((a) => a.id));
    const agents = (parsed.agents ?? []).filter((id): id is AgentId =>
      allowed.has(id),
    ).slice(0, 4);
    if (agents.length === 0) return { agents: fallback, rationale };
    if (!agents.includes("strategy")) agents.unshift("strategy");
    return {
      agents,
      rationale: parsed.rationale || rationale,
    };
  } catch {
    return { agents: fallback, rationale };
  }
}
