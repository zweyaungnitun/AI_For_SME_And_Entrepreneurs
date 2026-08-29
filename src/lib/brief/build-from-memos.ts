import type { AgentMemo } from "@/lib/agents/types";
import type { DecisionCard } from "@/lib/ledger/types";
import { ledgerFromFinancials, metricsFromLedger } from "@/lib/brief/snapshot";
import { DEMO_SNAPSHOT } from "./demo-data";
import type { BriefInsight, BusinessSnapshot, HealthStatus } from "./types";

function firstLine(text: string) {
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

function insightFromMemo(
  memo: AgentMemo,
  health: HealthStatus,
  generatedAt: string,
  fallback: BriefInsight,
): BriefInsight {
  const bullets = memo.bullets.filter(Boolean);
  return {
    id: insightIdFor(memo.agentId),
    title: `${memo.name}: ${firstLine(memo.summary).slice(0, 72) || memo.name}`,
    summary: memo.summary,
    happening: memo.summary,
    wrong: bullets[0] ?? fallback.wrong,
    matters: bullets[1] ?? fallback.matters,
    action: bullets[2] ?? fallback.action,
    why: bullets[3] ?? memo.summary,
    evidence: bullets.length ? bullets : fallback.evidence,
    health,
    generatedAt,
  };
}

function insightIdFor(agentId: AgentMemo["agentId"]) {
  if (agentId === "supply") return "supply";
  if (agentId === "resources") return "resources";
  if (agentId === "analytics") return "analytics";
  if (agentId === "market") return "market";
  if (agentId === "action" || agentId === "books") return "cashflow";
  return "cashflow";
}

export function buildBriefFromCard(
  card: DecisionCard,
  memos: AgentMemo[],
  reply: string,
  previous: BusinessSnapshot,
): BusinessSnapshot {
  const generatedAt = new Date().toISOString();
  const health = card.businessHealth;
  const ledger = ledgerFromFinancials(previous.financials, previous.shopId);
  const finance = memos.find((m) => m.agentId === "finance");
  const supply = memos.find((m) => m.agentId === "supply");
  const resources = memos.find((m) => m.agentId === "resources");
  const analytics = memos.find((m) => m.agentId === "analytics");
  const market = memos.find((m) => m.agentId === "market");
  const action = memos.find((m) => m.agentId === "action");

  const cashflow: BriefInsight = {
    id: "cashflow",
    title: card.priority.title,
    summary: card.summary,
    happening: card.summary,
    wrong: card.keyIssues[0] ?? card.summary,
    matters: card.priority.reason,
    action: card.priority.action,
    why: card.priority.reason,
    evidence: card.evidence,
    health,
    generatedAt,
  };

  const supplyInsight: BriefInsight = insightFromMemo(
    supply ?? {
      agentId: "supply",
      name: "Supply",
      summary: card.recommendations[0] ?? "Do not trap more cash in the chain.",
      bullets: card.recommendations,
      tools: [],
      ms: 0,
    },
    health,
    generatedAt,
    previous.insights.find((i) => i.id === "supply") ?? DEMO_SNAPSHOT.insights[1],
  );
  supplyInsight.id = "supply";

  const resourcesInsight: BriefInsight = insightFromMemo(
    resources ?? {
      agentId: "resources",
      name: "Resources",
      summary: "Put owner time on the named follow-up. Do not hire.",
      bullets: finance?.bullets ?? [],
      tools: [],
      ms: 0,
    },
    health,
    generatedAt,
    previous.insights.find((i) => i.id === "resources") ?? DEMO_SNAPSHOT.insights[2],
  );
  resourcesInsight.id = "resources";

  const analyticsInsight: BriefInsight = insightFromMemo(
    analytics ?? {
      agentId: "analytics",
      name: "Analytics",
      summary: "This snapshot only. Not a forecast.",
      bullets: card.evidence,
      tools: [],
      ms: 0,
    },
    health,
    generatedAt,
    previous.insights.find((i) => i.id === "analytics") ?? DEMO_SNAPSHOT.insights[3],
  );
  analyticsInsight.id = "analytics";

  const marketInsight: BriefInsight = insightFromMemo(
    market ?? {
      agentId: "market",
      name: "Market",
      summary: "Market position and competitive analysis.",
      bullets: [],
      tools: [],
      ms: 0,
    },
    health,
    generatedAt,
    previous.insights.find((i) => i.id === "market") ?? DEMO_SNAPSHOT.insights[3],
  );
  marketInsight.id = "market";

  return {
    ...previous,
    health,
    healthSummary: card.summary,
    metrics: metricsFromLedger(ledger),
    priority: card.priority,
    risk: {
      title:
        health === "TIGHT"
          ? "Short-term cash pressure"
          : health === "OK"
            ? "No urgent cash flag"
            : "Watch cash timing",
      detail: card.keyIssues[0] ?? card.summary,
    },
    insights: [cashflow, supplyInsight, resourcesInsight, analyticsInsight, marketInsight],
    reply: reply || action?.summary || card.priority.action,
    memos,
    updatedAt: generatedAt,
  };
}

export function buildBriefFromMemos(
  memos: AgentMemo[],
  reply: string,
  previous: BusinessSnapshot,
): BusinessSnapshot {
  const generatedAt = new Date().toISOString();
  const blob = `${reply}\n${memos.map((m) => `${m.summary}\n${m.bullets.join("\n")}`).join("\n")}`;
  let health: HealthStatus = previous.health;
  const t = blob.toLowerCase();
  if (/\btight\b/.test(t) || /payables? .*(>|exceed|outrun)/.test(t)) health = "TIGHT";
  else if (/\b(overdue|pressure|watch|gap)\b/.test(t)) health = "WATCH";
  else if (/\b(healthy|on track|stable|ok)\b/.test(t)) health = "OK";

  const specialistMemos = memos.filter((m) => m.agentId !== "conductor");
  const byId = new Map(specialistMemos.map((m) => [insightIdFor(m.agentId), m]));
  const order = ["cashflow", "supply", "resources", "analytics", "market"] as const;
  const insights: BriefInsight[] = order.map((id, i) => {
    const fallback = previous.insights.find((x) => x.id === id) ?? DEMO_SNAPSHOT.insights[Math.min(i, DEMO_SNAPSHOT.insights.length - 1)];
    const memo =
      id === "cashflow"
        ? specialistMemos.find((m) => m.agentId === "finance")
        : byId.get(id);
    if (!memo) return { ...fallback, health, generatedAt };
    return insightFromMemo(memo, health, generatedAt, fallback);
  });

  const finance = specialistMemos.find((m) => m.agentId === "finance");
  return {
    ...previous,
    health,
    healthSummary: firstLine(reply) || previous.healthSummary,
    priority: {
      title: finance?.bullets[0] ?? previous.priority.title,
      reason: finance?.summary ?? previous.priority.reason,
      action: finance?.bullets[1] ?? previous.priority.action,
    },
    risk: {
      title: health === "OK" ? "No urgent cash flag" : "Short-term cash pressure",
      detail: finance?.summary ?? previous.risk.detail,
    },
    insights,
    reply,
    memos,
    updatedAt: generatedAt,
  };
}
