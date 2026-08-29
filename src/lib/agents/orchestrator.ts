import { llmConfigured, llmModel } from "@/lib/config";
import { getSpecialist } from "@/lib/agents/registry";
import { planAgents } from "@/lib/agents/planner";
import { runTools, type ExtractedNote } from "@/lib/agents/tools";
import { buildDemoCard, formatCard } from "@/lib/agents/decision";
import { criticize } from "@/lib/agents/critic";
import type { AgentEvent, AgentMemo, RunRequest, ToolResult } from "@/lib/agents/types";
import { complete, extractJson } from "@/lib/llm/complete";
import { appendTurn, getSession } from "@/lib/session/store";
import {
  isBurmese,
  snapshotEmpty,
  type DecisionCard,
  type Ledger,
} from "@/lib/ledger/types";
import { getShop, shopVoice } from "@/lib/sme/catalog";
import { mergeLedger } from "@/lib/ledger/seed";
import { loadShopLedger, persistExtractedNote } from "@/lib/db/shops";
import { persistRun } from "@/lib/db/runs";

const EMPTY_MSG = "Add cash, credit, or stock — or load the sample.";

function contextBlock(req: RunRequest, ledger: Ledger) {
  const c = req.context;
  return [
    `Business: ${c.name}`,
    `Type: ${ledger.shopType}`,
    `Stage: ${c.stage}`,
    `Team: ${c.teamSize}`,
    `Place: ${c.location}`,
    `Challenge: ${c.challenge}`,
  ].join("\n");
}

function applyExtract(ledger: Ledger, extracted: ExtractedNote): Ledger {
  if (!extracted.parsed || !extracted.customer || !extracted.amount) return ledger;
  const next = structuredClone(ledger);
  next.receivables.push({
    customer: extracted.customer,
    amount: extracted.amount,
    overdueDays: extracted.status === "overdue" ? 1 : 0,
    status: extracted.status ?? "pending",
  });
  return next;
}

async function conductorCard(
  req: RunRequest,
  memos: AgentMemo[],
  tools: ToolResult[],
  ledger: Ledger,
  fallback: DecisionCard,
): Promise<DecisionCard> {
  if (!llmConfigured()) return fallback;
  try {
    const raw = await complete({
      json: true,
      system: `You are Foundry's copilot for Myanmar SMEs and entrepreneurs (shop, studio, kitchen, workshop, founder).
${shopVoice(ledger.shopType)}
Use ONLY numbers and names in cash_pressure, receivable_rank, slow_stock, supplier_pressure, resource_load, and business_pulse. Never invent MMK or people.
search_knowledge is practice/trust only — ignore any amount or name that is not in those tools.
businessHealth must be OK | WATCH | TIGHT and must match cash_pressure.flag when TIGHT.
Pick ONE priority for 24-48 hours. Do not write a 90-day plan or a media plan.
Never say a loan is approved. If asked about banks: we help organize numbers for a discussion; we do not score loans.
Growth means free cash this week — collect, delay a PO, do not restock slow lots — not ads.
Return JSON {businessHealth, summary, summaryMy, keyIssues, priority:{title,reason,action}, recommendations, evidence, locale, reminder?:{customer,amount,messageMy,messageEn}}
keyIssues max 3. locale en or my.`,
      prompt: `${contextBlock(req, ledger)}

Ask: ${req.message}

Tool facts:
${JSON.stringify(tools.map((t) => ({ name: t.name, output: t.output })))}

Specialist memos:
${memos.map((m) => `# ${m.name}\n${m.summary}\n${m.bullets.join("\n")}`).join("\n\n")}

Deterministic fallback (facts):
${JSON.stringify(fallback)}`,
    });
    const parsed = extractJson<Partial<DecisionCard>>(raw, {});
    if (!parsed.priority?.title) return fallback;
    return {
      businessHealth: parsed.businessHealth || fallback.businessHealth,
      summary: parsed.summary || fallback.summary,
      summaryMy: parsed.summaryMy || fallback.summaryMy,
      keyIssues: (parsed.keyIssues || fallback.keyIssues).slice(0, 3),
      priority: parsed.priority,
      recommendations: parsed.recommendations || fallback.recommendations,
      evidence: parsed.evidence || fallback.evidence,
      locale: parsed.locale || fallback.locale,
      reminder: parsed.reminder || fallback.reminder,
    };
  } catch {
    return fallback;
  }
}

function chunkText(text: string, size: number) {
  const parts: string[] = [];
  for (let i = 0; i < text.length; i += size) parts.push(text.slice(i, i + size));
  return parts;
}

export async function* runCrew(req: RunRequest): AsyncGenerator<AgentEvent> {
  const session = getSession(req.sessionId, req.shopId);
  const fromDb = await loadShopLedger(session.shopId);
  if (fromDb) session.ledger = fromDb;
  const sameTenant = !req.shopId || req.shopId === session.shopId;
  if (req.snapshot && sameTenant) {
    session.ledger = mergeLedger(session.ledger, req.snapshot);
  }
  const context = sameTenant ? req.context : getShop(session.shopId).context;
  const tenantReq = { ...req, shopId: session.shopId, context };

  const mode = llmConfigured() ? "llm" : "demo";
  yield { type: "session", sessionId: session.id, mode };

  if (snapshotEmpty(session.ledger)) {
    yield { type: "error", error: EMPTY_MSG };
    return;
  }

  const locale = isBurmese(req.message) ? "my" : "en";
  const plan = await planAgents(req.message, context, session.ledger);
  yield { type: "plan", agents: plan.agents, rationale: plan.rationale };

  const memos: AgentMemo[] = [];
  const allTools: ToolResult[] = [];

  for (const agentId of plan.agents) {
    const def = getSpecialist(agentId);
    if (!def) continue;
    const started = Date.now();
    yield { type: "agent_start", agentId: def.id, name: def.name };

    const tools = await runTools(
      def.tools,
      context,
      req.message,
      session.ledger,
      session.shopId,
    );
    for (const tool of tools) {
      allTools.push(tool);
      yield { type: "tool", agentId: def.id, tool };
    }

    if (def.id === "books") {
      const extracted = tools.find((t) => t.name === "extract_note")?.output as ExtractedNote;
      if (extracted) {
        session.ledger = applyExtract(session.ledger, extracted);
        await persistExtractedNote(session.shopId, extracted);
      }
    }

    const demo = def.demo({
      context,
      message: req.message,
      history: session.turns,
      tools,
      ledger: session.ledger,
    });
    const memo: AgentMemo = {
      agentId: def.id,
      name: def.name,
      summary: demo.summary,
      bullets: demo.bullets,
      tools,
      ms: Date.now() - started,
    };
    memos.push(memo);
    yield { type: "agent_end", memo };
  }

  const fallback = buildDemoCard(session.ledger, locale, context.name);
  let card = await conductorCard(tenantReq, memos, allTools, session.ledger, fallback);
  card = criticize(card, allTools, session.ledger, context.name);

  const reply = formatCard(card, locale === "my");
  for (const chunk of chunkText(reply, 48)) {
    yield { type: "token", text: chunk };
  }

  appendTurn(session.id, { role: "user", content: req.message });
  appendTurn(session.id, { role: "assistant", content: reply });
  await persistRun({
    sessionId: session.id,
    shopId: session.shopId,
    ask: req.message,
    card,
    turns: session.turns,
  });

  yield {
    type: "done",
    reply,
    memos,
    model: mode === "llm" ? llmModel() : "demo",
    card,
  };
}
