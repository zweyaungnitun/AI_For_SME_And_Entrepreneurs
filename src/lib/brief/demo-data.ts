import { getShop } from "@/lib/sme/catalog";
import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import { metricsFromLedger } from "@/lib/brief/snapshot";
import type { BusinessSnapshot } from "./types";

const shop = getShop("daw-hla");
const snap = analyzeLedger(shop.ledger);
const top = snap.overdue[0];
const slow = snap.slow[0];
const GENERATED_AT = "2026-08-29T08:15:00.000Z";

export const DEMO_SNAPSHOT: BusinessSnapshot = {
  context: shop.context,
  financials: {
    cashMmk: String(shop.ledger.cashOnHand),
    receivablesMmk: String(
      shop.ledger.receivables.reduce((a, r) => a + r.amount, 0),
    ),
    upcomingMmk: String(shop.ledger.upcomingExpenses[0]?.amount ?? 0),
    inventoryNote: slow
      ? `${slow.sku} ${slow.units} units, ${slow.soldThisMonth} sold this month`
      : "No stock lines",
  },
  health: snap.businessHealth,
  healthSummary:
    "Payables outrun cash while one large overdue sits. Collect Ko Min first. Do not restock Product A.",
  metrics: metricsFromLedger(shop.ledger),
  priority: {
    title: top ? `Collect ${top.customer} first` : "Protect cash this week",
    reason: `Payable ${mmk(snap.nearTotal)} in ${snap.near[0]?.dueInDays ?? 5} days > cash ${mmk(shop.ledger.cashOnHand)}.`,
    action: top
      ? `Contact ${top.customer} today (${mmk(top.amount)}, ${top.overdueDays} days overdue). Do not restock ${slow?.sku ?? "slow stock"} this week.`
      : "Write the 7-day payable list.",
  },
  risk: {
    title: "Short-term cash pressure",
    detail: `Available cash ${mmk(shop.ledger.cashOnHand)} vs upcoming ${mmk(snap.nearTotal)}. ${top ? `${top.customer} is the largest overdue.` : ""}`,
  },
  insights: [
    {
      id: "cashflow",
      title: "Payables outrun cash this week",
      summary:
        "Cash on hand does not cover the supplier payable due in five days unless overdue credit is collected.",
      happening: `${shop.context.name} has ${mmk(shop.ledger.cashOnHand)} in the till and ${mmk(snap.nearTotal)} due in ${snap.near[0]?.dueInDays ?? 5} days.`,
      wrong:
        "Credit is sitting while the payable is closer than the cash. The till looks busy; the cash is not available.",
      matters:
        "If collections wait, the supplier payment gets squeezed this week — not at year end.",
      action: top
        ? `Collect ${top.customer} first (${mmk(top.amount)}, ${top.overdueDays} days overdue).`
        : "Collect the largest overdue first.",
      why: "Largest overdue while cash is below the 5-day payable.",
      evidence: snap.evidence,
      health: snap.businessHealth,
      generatedAt: GENERATED_AT,
    },
    {
      id: "receivables",
      title: top ? `${top.customer} is overdue` : "Credit follow-up",
      summary:
        "Ranked credit says who to call first. The owner should not follow up by memory.",
      happening: shop.ledger.receivables
        .map((r) => `${r.customer} ${mmk(r.amount)} (${r.status}, ${r.overdueDays}d)`)
        .join(". "),
      wrong: "The largest overdue should be first. It currently waits.",
      matters: "This is the only liquid cash before the supplier day.",
      action: top
        ? `Contact ${top.customer} today. Ask for payment this week, not a new order.`
        : "Call the largest overdue party today.",
      why: "A short follow-up is cheaper than missing the payable.",
      evidence: shop.ledger.receivables.map(
        (r) => `${r.customer} — ${mmk(r.amount)} — ${r.overdueDays} days`,
      ),
      health: snap.businessHealth,
      generatedAt: GENERATED_AT,
    },
    {
      id: "inventory",
      title: slow ? `${slow.sku} is slow` : "Stock",
      summary: slow
        ? `${slow.sku} already sits slow — buying more locks more cash.`
        : "No slow lot flagged.",
      happening: slow
        ? `${slow.sku}: ${slow.units} on hand, ${slow.soldThisMonth} sold this month.`
        : "No stock signal.",
      wrong: "Restocking a slow SKU spends cash the shop does not have this week.",
      matters: "Inventory is not cash if it cannot pay the supplier.",
      action: slow
        ? `Do not restock ${slow.sku} this week.`
        : "Reorder only what moved.",
      why: "Sales velocity is low; another purchase order would widen the cash gap.",
      evidence: slow
        ? [
            `${slow.sku}: ${slow.units}u, ${slow.soldThisMonth} sold`,
            `Tied on shelf ≈ ${mmk(slow.units * slow.unitCost)}`,
          ]
        : ["No slow lot above the threshold"],
      health: snap.businessHealth,
      generatedAt: GENERATED_AT,
    },
  ],
  reply: "",
  memos: [],
  updatedAt: null,
};

export const ANALYZE_PROMPT =
  "What should I do today so cash does not break?";

export function composeAnalyzePrompt(snapshot: BusinessSnapshot) {
  const { context, financials } = snapshot;
  return `${ANALYZE_PROMPT}

Business: ${context.name} (${context.industry}) in ${context.location}.
Team: ${context.teamSize}. Stage: ${context.stage}.
Challenge: ${context.challenge}

Numbers the owner entered:
- Cash on hand: ${financials.cashMmk} MMK
- Receivables: ${financials.receivablesMmk} MMK
- Upcoming expenses: ${financials.upcomingMmk} MMK
- Inventory note: ${financials.inventoryNote}`;
}
