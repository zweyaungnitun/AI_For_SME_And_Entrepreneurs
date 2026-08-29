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
  if (ledger.inventory.length > 0) agents.push("ops");
  agents.push("action");

  const looksLikeNote =
    isBurmese(message) ||
    /took|will pay|yesterday|သိန်း|အကြွေး|boxes|invoice/i.test(hay);
  if (looksLikeNote && /(\d|သိန်း)/.test(message)) {
    agents.unshift("books");
  }

  return {
    agents,
    rationale: `Finance-first copilot for ${ledger.shopType}. Ops only with stock. Books if the message looks like a credit note.`,
  };
}

export async function planAgents(
  message: string,
  context: BusinessContext,
  ledger: Ledger,
) {
  return heuristicPlan(message, context, ledger);
}
