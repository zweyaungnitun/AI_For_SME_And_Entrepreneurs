import type { AgentId, BusinessContext } from "@/lib/agents/types";
import { isBurmese } from "@/lib/ledger/types";
import type { Ledger } from "@/lib/ledger/types";

export function heuristicPlan(
  message: string,
  _context: BusinessContext,
  ledger: Ledger,
): { agents: AgentId[]; rationale: string } {
  const hay = message.toLowerCase();
  const agents: AgentId[] = ["finance"];

  if (ledger.inventory.length > 0 || ledger.upcomingExpenses.length > 0) {
    agents.push("supply");
  }

  const fullAnalyze =
    /analy|performance|pulse|business|grow|resource|team|suppl/i.test(hay) ||
    /what should i do today so cash does not break/i.test(hay) ||
    hay.includes("cash on hand") ||
    hay.includes("overdue customer credit");

  const collectOnly = /who (should i |do i )?(collect|follow|call)/i.test(hay) && !fullAnalyze;

  if (!collectOnly) {
    agents.push("resources");
    if (fullAnalyze || hay.length > 80) agents.push("analytics");
  }

  if (ledger.receivables.some((r) => r.status === "overdue" || r.overdueDays > 0)) {
    agents.push("action");
  }

  const looksLikeNote =
    isBurmese(message) ||
    /took|will pay|yesterday|သိန်း|အကြွေး|boxes|invoice/i.test(hay);
  if (looksLikeNote && /(\d|သိန်း)/.test(message)) {
    agents.unshift("books");
  }

  return {
    agents,
    rationale: `Finance-first SME/founder crew for ${ledger.shopType}. Supply if payables or stock. Resources and analytics on a full analyze. Books if the message looks like a credit note.`,
  };
}

export async function planAgents(
  message: string,
  context: BusinessContext,
  ledger: Ledger,
) {
  return heuristicPlan(message, context, ledger);
}
