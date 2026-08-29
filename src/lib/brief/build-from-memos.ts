import type { AgentMemo } from "@/lib/agents/types";
import type { DecisionCard } from "@/lib/ledger/types";
import { ledgerFromFinancials, metricsFromLedger } from "@/lib/brief/snapshot";
import { DEMO_SNAPSHOT } from "./demo-data";
import type { BriefInsight, BusinessSnapshot, HealthStatus } from "./types";

function firstLine(text: string) {
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

export function buildBriefFromCard(
  card: DecisionCard,
  memos: AgentMemo[],
  reply: string,
  previous: BusinessSnapshot,
): BusinessSnapshot {
  const generatedAt = new Date().toISOString();
  const health = card.businessHealth;
  const ledger = ledgerFromFinancials(previous.financials);
  const finance = memos.find((m) => m.agentId === "finance");
  const ops = memos.find((m) => m.agentId === "ops");
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

  const recvIssue = card.keyIssues.find((i) => /overdue|collect/i.test(i));
  const receivables: BriefInsight = {
    id: "receivables",
    title: recvIssue ? recvIssue : "Credit follow-up",
    summary: finance?.summary ?? card.summary,
    happening: finance?.summary ?? card.summary,
    wrong: recvIssue ?? (finance?.bullets[0] ?? card.keyIssues[0] ?? ""),
    matters: "Named overdue credit is the fastest cash in before the payable hits.",
    action: card.reminder
      ? `Copy a reminder for ${card.reminder.customer}.`
      : card.priority.action,
    why: card.priority.reason,
    evidence: finance?.bullets.length ? finance.bullets : card.evidence,
    health,
    generatedAt,
  };

  const slowIssue = card.keyIssues.find((i) => /slow/i.test(i));
  const inventory: BriefInsight = {
    id: "inventory",
    title: slowIssue ?? ops?.summary ?? "Stock",
    summary: ops?.summary ?? slowIssue ?? "No slow lot flagged.",
    happening: ops?.summary ?? "Stock is a cash signal, not a separate app.",
    wrong: ops?.bullets[0] ?? slowIssue ?? "Do not restock what is already sitting.",
    matters: "Buying more of a slow SKU locks cash you need for the payable.",
    action:
      card.recommendations[0] ??
      ops?.bullets[0] ??
      "Do not restock slow lots this week.",
    why: "Slow units on the shelf are cash you cannot spend.",
    evidence: ops?.bullets.length ? ops.bullets : card.recommendations,
    health,
    generatedAt,
  };

  return {
    ...previous,
    health,
    healthSummary: card.summary,
    metrics: metricsFromLedger(ledger),
    priority: card.priority,
    risk: {
      title: health === "TIGHT" ? "Short-term cash pressure" : health === "OK" ? "No urgent cash flag" : "Watch cash timing",
      detail: card.keyIssues[0] ?? card.summary,
    },
    insights: [cashflow, receivables, inventory],
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
  const insights: BriefInsight[] =
    specialistMemos.length > 0
      ? specialistMemos.slice(0, 3).map((memo, i) => {
          const fallback = previous.insights[i] ?? DEMO_SNAPSHOT.insights[0];
          const bullets = memo.bullets.filter(Boolean);
          return {
            id: memo.agentId === "ops" ? "inventory" : memo.agentId === "action" ? "receivables" : "cashflow",
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
        })
      : previous.insights.map((insight) => ({ ...insight, health, generatedAt }));

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
