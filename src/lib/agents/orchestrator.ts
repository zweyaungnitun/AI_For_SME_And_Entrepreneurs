import { llmConfigured, llmModel } from "@/lib/config";
import { getSpecialist } from "@/lib/agents/registry";
import { planAgents } from "@/lib/agents/planner";
import { runTools } from "@/lib/agents/tools";
import type { AgentEvent, AgentMemo, RunRequest } from "@/lib/agents/types";
import { complete } from "@/lib/llm/complete";
import { appendTurn, getSession } from "@/lib/session/store";

function contextBlock(req: RunRequest) {
  const c = req.context;
  return [
    `Business: ${c.name}`,
    `Industry: ${c.industry}`,
    `Stage: ${c.stage}`,
    `Location: ${c.location}`,
    `Team: ${c.teamSize}`,
    `Challenge: ${c.challenge}`,
  ].join("\n");
}

function parseMemo(text: string) {
  try {
    const parsed = JSON.parse(text) as { summary?: string; bullets?: string[] };
    return {
      summary: parsed.summary || text,
      bullets: parsed.bullets || [],
    };
  } catch {
    return { summary: text, bullets: [] as string[] };
  }
}

function demoSynthesis(req: RunRequest, memos: AgentMemo[]) {
  return [
    `Here is a working plan for ${req.context.name}.`,
    "",
    ...memos.flatMap((memo) => [
      `${memo.name}. ${memo.summary}`,
      ...memo.bullets.map((b) => `• ${b}`),
      "",
    ]),
    "Next 7 days: run 10 customer conversations, pack one kit SKU, and take 3 paid pre-orders before spending on ads.",
  ].join("\n");
}

async function synthesize(req: RunRequest, memos: AgentMemo[]) {
  if (!llmConfigured()) return demoSynthesis(req, memos);

  return complete({
    system: `You are Foundry's conductor. Merge specialist memos into a single brief a founder can execute this week.
Structure: 1) Direct answer 2) 90-day sequence 3) This week's actions 4) What not to do.
No fluff. Keep it under 400 words.`,
    prompt: `${contextBlock(req)}

Question: ${req.message}

Memos:
${memos
  .map(
    (m) =>
      `# ${m.name}\n${m.summary}\n${m.bullets.map((b) => `- ${b}`).join("\n")}`,
  )
  .join("\n\n")}`,
  });
}

function chunkText(text: string, size: number) {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += size) parts.push(text.slice(i, i + size));
  return parts;
}

export async function* runCrew(req: RunRequest): AsyncGenerator<AgentEvent> {
  const session = getSession(req.sessionId);
  const mode = llmConfigured() ? "llm" : "demo";
  yield { type: "session", sessionId: session.id, mode };

  const plan = await planAgents(req.message, req.context, session.turns);
  yield { type: "plan", agents: plan.agents, rationale: plan.rationale };

  const memos: AgentMemo[] = [];

  for (const agentId of plan.agents) {
    const def = getSpecialist(agentId);
    if (!def) continue;
    const started = Date.now();
    yield { type: "agent_start", agentId: def.id, name: def.name };

    const tools = runTools(def.tools, req.context, req.message);
    for (const tool of tools) {
      yield { type: "tool", agentId: def.id, tool };
    }

    let summary: string;
    let bullets: string[];

    if (llmConfigured()) {
      const text = await complete({
        json: true,
        system: def.system,
        prompt: `${contextBlock(req)}

Recent:
${session.turns.map((t) => `${t.role}: ${t.content}`).join("\n") || "(none)"}

Tool results:
${JSON.stringify(tools.map((t) => ({ name: t.name, output: t.output })))}

Founder message:
${req.message}

Return JSON {summary: string, bullets: string[]}.`,
      });
      const parsed = parseMemo(text);
      summary = parsed.summary;
      bullets = parsed.bullets;
    } else {
      const demo = def.demo({
        context: req.context,
        message: req.message,
        history: session.turns,
        tools,
      });
      summary = demo.summary;
      bullets = demo.bullets;
    }

    const memo: AgentMemo = {
      agentId: def.id,
      name: def.name,
      summary,
      bullets,
      tools,
      ms: Date.now() - started,
    };
    memos.push(memo);
    yield { type: "agent_end", memo };
  }

  const reply = await synthesize(req, memos);
  for (const chunk of chunkText(reply, 48)) {
    yield { type: "token", text: chunk };
  }

  appendTurn(session.id, { role: "user", content: req.message });
  appendTurn(session.id, { role: "assistant", content: reply });

  yield {
    type: "done",
    reply,
    memos,
    model: mode === "llm" ? llmModel() : "demo",
  };
}
