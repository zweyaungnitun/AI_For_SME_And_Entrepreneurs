import { analyzeLedger } from "@/lib/ledger/analyze";
import type { DecisionCard, Ledger } from "@/lib/ledger/types";
import type { ToolResult } from "@/lib/agents/types";
import { buildDemoCard } from "@/lib/agents/decision";

function allowedAmounts(ledger: Ledger, tools: ToolResult[]) {
  const amounts = new Set<number>([
    ledger.cashOnHand,
    ledger.monthSales,
    ...ledger.upcomingExpenses.map((e) => e.amount),
    ...ledger.receivables.map((r) => r.amount),
    ...ledger.inventory.map((i) => i.units * i.unitCost),
  ]);
  const blob = JSON.stringify(tools);
  for (const match of blob.matchAll(/\b(\d{4,})\b/g)) {
    amounts.add(Number(match[1]));
  }
  return amounts;
}

function allowedNames(ledger: Ledger) {
  return new Set(ledger.receivables.map((r) => r.customer.toLowerCase()));
}

/** Drop Gemini claims that are not in tools/ledger. Health always comes from tools. */
export function criticize(
  card: DecisionCard,
  tools: ToolResult[],
  ledger: Ledger,
  shopName?: string,
): DecisionCard {
  const snap = analyzeLedger(ledger);
  const amounts = allowedAmounts(ledger, tools);
  const names = allowedNames(ledger);
  const text = [
    card.summary,
    card.priority.title,
    card.priority.reason,
    card.priority.action,
    ...card.keyIssues,
    ...card.evidence,
  ].join(" ");

  const unknownAmount = [...text.matchAll(/\b(\d{5,})\b/g)].some(
    (m) => !amounts.has(Number(m[1])),
  );
  const mentioned = [...names].filter((n) => text.toLowerCase().includes(n));
  const inventedName =
    /\b(Ko|Ma|U|Daw|Bride)\s+[A-Z][a-z]+/.test(card.priority.title) &&
    names.size > 0 &&
    mentioned.length === 0 &&
    ledger.receivables.length > 0;

  if (unknownAmount || inventedName) {
    return buildDemoCard(ledger, card.locale, shopName);
  }

  return {
    ...card,
    businessHealth: snap.businessHealth,
    keyIssues: card.keyIssues.slice(0, 3),
    reminder: card.reminder,
  };
}
