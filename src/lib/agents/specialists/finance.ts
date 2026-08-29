import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const financeAgent: SpecialistDef = {
  id: "finance",
  name: "Finance",
  title: "Cash action + trends",
  blurb:
    "Analyzes cash position, credit timing, and financial trends. Provides actionable advice on collections, spend timing, and financial health.",
  accent: "#d4a017",
  keywords: [
    "cash",
    "pay",
    "collect",
    "rent",
    "bill",
    "ငွေ",
    "အကြွေး",
    "trend",
    "analysis",
    "financial",
  ],
  tools: [
    "cash_pressure",
    "receivable_rank",
    "trend_analysis",
    "financial_health_score",
    "search_knowledge",
  ],
  system: `You are Foundry Finance for any Myanmar SME.
Analyze financial health, cash timing, and trends using ONLY tool numbers.
Provide:
1. ONE priority action for 24-48h (collect named debtor or delay named spend)
2. Financial health assessment (OK / WATCH / TIGHT)
3. Trend analysis (growing / stable / declining) with context
4. Specific advice based on the numbers

Never invent MMK. Never approve loans. Never guarantee future outcomes.
Return JSON {summary, bullets}.`,
  demo: ({ ledger, tools }) => {
    const snap = analyzeLedger(ledger);
    const top = snap.topCustomer;

    const trendTool = tools.find((t) => t.name === "trend_analysis");
    const healthTool = tools.find((t) => t.name === "financial_health_score");
    const knowledge = tools.find((t) => t.name === "search_knowledge")?.output as
      | { hits?: Array<{ title: string }>; source?: string }
      | undefined;

    const trend = trendTool?.output as
      | { trend: string; salesChangePct: number; insights: string[] }
      | undefined;
    const health = healthTool?.output as
      | { health: string; score: number; summary: string }
      | undefined;
    const practice = knowledge?.hits?.[0]?.title;

    const bullets: string[] = [];

    // Priority action
    if (top && snap.tight) {
      bullets.push(
        `PRIORITY: Collect ${top.customer} (${mmk(top.amount)}, ${top.overdueDays}d overdue) before the ${mmk(snap.nearTotal)} payable comes due.`,
      );
    } else if (top) {
      bullets.push(
        `Follow up with ${top.customer} (${mmk(top.amount)}, ${top.overdueDays}d overdue) to secure cash timing.`,
      );
    }

    // Health summary
    if (health) {
      bullets.push(`Financial health: ${health.health} (${health.score}/100). ${health.summary}`);
    } else {
      bullets.push(
        snap.tight
          ? `TIGHT: payables ${mmk(snap.nearTotal)} exceed cash ${mmk(snap.cashOnHand)}.`
          : `Cash ${mmk(snap.cashOnHand)} covers payables ${mmk(snap.nearTotal)}.`,
      );
    }

    // Trend insights
    if (trend && trend.insights.length > 0) {
      bullets.push(trend.insights[0]);
    }

    // Action constraints
    if (snap.tight) {
      bullets.push(
        "Do not add new expenses, restock, or unpaid work until cash improves.",
      );
    } else if (top) {
      bullets.push("Maintain 7-day payable visibility to avoid surprises.");
    }

    // Knowledge
    if (practice) {
      bullets.push(`Best practice: ${practice}.`);
    }

    return {
      summary:
        health?.health === "TIGHT" || snap.tight
          ? `Cash timing is critical. Focus on collections before any new spend.`
          : trend?.trend === "growing"
            ? `Growing sales with ${health?.health || "stable"} cash position. Watch timing to capture momentum.`
            : `Cash position is ${health?.health || "stable"}. Focus on efficiency and margins.`,
      bullets,
    };
  },
};
