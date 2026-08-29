import { DEFAULT_SHOP_ID, getShop } from "@/lib/sme/catalog";
import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import { metricsFromLedger } from "@/lib/brief/snapshot";
import type { BusinessSnapshot } from "./types";

const GENERATED_AT = "2026-08-29T08:15:00.000Z";

export function snapshotForShop(shopId: string): BusinessSnapshot {
  const shop = getShop(shopId);
  const snap = analyzeLedger(shop.ledger);
  const top = snap.overdue[0];
  const slow = snap.slow[0];
  const bill = snap.near[0];

  return {
    shopId: shop.id,
    context: shop.context,
    financials: {
      cashMmk: String(shop.ledger.cashOnHand),
      receivablesMmk: String(
        shop.ledger.receivables.reduce((a, r) => a + r.amount, 0),
      ),
      upcomingMmk: String(shop.ledger.upcomingExpenses[0]?.amount ?? 0),
      inventoryNote: slow
        ? `${slow.sku} ${slow.units} units, ${slow.soldThisMonth} sold this month`
        : shop.ledger.inventory.length
          ? "Stock on hand"
          : "No stock lines",
    },
    health: snap.businessHealth,
    healthSummary: snap.tight
      ? `Payables outrun cash. Collect ${top?.customer ?? "overdue credit"} first.`
      : "Near-term bills are covered; still watch credit and slow lots.",
    metrics: metricsFromLedger(shop.ledger),
    priority: {
      title: top ? `Collect ${top.customer} first` : "Protect cash this week",
      reason: bill
        ? `Payable ${mmk(snap.nearTotal)} in ${bill.dueInDays} days vs cash ${mmk(shop.ledger.cashOnHand)}.`
        : "Collecting overdue credit is the fastest cash in.",
      action: [
        top
          ? `Contact ${top.customer} today (${mmk(top.amount)}, ${top.overdueDays} days overdue).`
          : "Write the 7-day payable list.",
        slow ? `Do not restock ${slow.sku} this week.` : shop.ledger.inventory.length === 0 ? "Do not take new unpaid work." : "",
      ]
        .filter(Boolean)
        .join(" "),
    },
    risk: {
      title: snap.tight ? "Short-term cash pressure" : "Watch cash timing",
      detail: `Cash ${mmk(shop.ledger.cashOnHand)} vs upcoming ${mmk(snap.nearTotal)}. ${top ? `${top.customer} is the largest overdue.` : ""}`,
    },
    insights: [
      {
        id: "cashflow",
        title: snap.tight ? "Payables outrun cash this week" : "Cash covers near bills",
        summary: snap.tight
          ? "Cash on hand does not cover the near payable unless overdue credit is collected."
          : "Near payables are covered; still collect what is overdue.",
        happening: `${shop.context.name} has ${mmk(shop.ledger.cashOnHand)} cash and ${mmk(snap.nearTotal)} due soon.`,
        wrong: "Credit sitting while a payable is closer than the cash.",
        matters: "This is a this-week problem, not a year-end one.",
        action: top
          ? `Collect ${top.customer} first (${mmk(top.amount)}, ${top.overdueDays} days overdue).`
          : "Protect cash this week.",
        why: "Largest overdue while cash is below the near payable — or the fastest cash in.",
        evidence: snap.evidence,
        health: snap.businessHealth,
        generatedAt: GENERATED_AT,
      },
      {
        id: "market",
        title: "Market position & pricing",
        summary: snap.recvConcentration > 0.4
          ? `High customer concentration (${Math.round(snap.recvConcentration * 100)}% in one customer). Diversify to reduce risk.`
          : "Customer base is reasonably diversified. Focus on repeat business.",
        happening: top
          ? `${top.customer} represents ${Math.round(snap.recvConcentration * 100)}% of receivables.`
          : "Multiple customers, no single concentration.",
        wrong: snap.recvConcentration > 0.4
          ? "Too much revenue from one buyer creates dependency risk."
          : snap.stockTurnover && snap.stockTurnover < 0.1
            ? "Slow inventory suggests demand or pricing mismatch."
            : "",
        matters: "Market position and pricing directly impact cash generation and business resilience.",
        action: snap.recvConcentration > 0.4
          ? "Develop 2-3 new customer relationships this month to reduce dependency."
          : snap.stockTurnover && snap.stockTurnover < 0.1
            ? "Review pricing or consider switching to faster-moving products."
            : "Maintain customer relationships and monitor competitive position.",
        why: snap.recvConcentration > 0.4
          ? "One customer delay can paralyze the entire business."
          : "Strong fundamentals allow focus on growth opportunities.",
        evidence: [
          ...(top ? [`${top.customer}: ${Math.round(snap.recvConcentration * 100)}% concentration`] : []),
          ...(snap.stockTurnover ? [`Stock turnover: ${(snap.stockTurnover * 100).toFixed(1)}%`] : []),
        ],
        health: snap.recvConcentration > 0.4 ? "WATCH" : snap.businessHealth,
        generatedAt: GENERATED_AT,
      },
      {
        id: "supply",
        title: slow ? `${slow.sku} is slow` : bill ? `${bill.name} is due` : "Supply",
        summary: slow
          ? `${slow.sku} already sits slow — a new PO locks more cash.`
          : bill
            ? `${bill.name} ${mmk(bill.amount)} due in ${bill.dueInDays} days.`
            : "No supplier or stock signal.",
        happening: slow
          ? `${slow.sku}: ${slow.units} on hand, ${slow.soldThisMonth} sold.`
          : bill
            ? `${bill.name} in ${bill.dueInDays} days.`
            : "No stock lines.",
        wrong: snap.tight
          ? "A new purchase order would spend cash the business does not have this week."
          : "Restocking a slow lot still traps cash.",
        matters: "Supply is a cash constraint, not a warehouse app.",
        action: slow
          ? `Do not restock ${slow.sku} this week.`
          : snap.tight
            ? "Do not place a new PO until overdue cash is in."
            : "Reorder only what moved.",
        why: "Slow units and supplier dates are cash you cannot spend twice.",
        evidence: [
          ...(bill ? [`${bill.name} ${mmk(bill.amount)} in ${bill.dueInDays}d`] : []),
          ...(slow
            ? [`${slow.sku}: ${slow.units}u, ${slow.soldThisMonth} sold`]
            : ["No slow lot above the threshold"]),
        ],
        health: snap.businessHealth,
        generatedAt: GENERATED_AT,
      },
      {
        id: "resources",
        title: "Owner time, not a hire",
        summary: `Team of ${shop.context.teamSize}. Put hours on the named follow-up — do not hire.`,
        happening: `${shop.context.teamSize} ${shop.context.teamSize === 1 ? "person" : "people"}. ${snap.overdue.length} overdue ${snap.overdue.length === 1 ? "party" : "parties"}.`,
        wrong: "New unpaid work or a hire would not pay this week's bill.",
        matters: "The scarce resource is today, not headcount.",
        action: top
          ? `Use today for one follow-up: ${top.customer}.`
          : "Write the 7-day payable list.",
        why: "A short call is cheaper than missing the payable.",
        evidence: [
          `Team size ${shop.context.teamSize}`,
          ...(top ? [`${top.customer} ${mmk(top.amount)} overdue ${top.overdueDays}d`] : []),
        ],
        health: snap.businessHealth,
        generatedAt: GENERATED_AT,
      },
      {
        id: "analytics",
        title: "This week's numbers",
        summary: `Sales vs last month ${snap.salesChange === 0 ? "flat" : `${snap.salesChange}%`}. Not a forecast.`,
        happening: `Concentration ${snap.recvConcentration}% on the top credit line.`,
        wrong: "Reading a dashboard is not the same as one action.",
        matters: "Growth this week is cash in, not ads.",
        action: "Use the pulse to pick one collection or one PO to skip.",
        why: "Helps organize numbers for a discussion. Does not score loans.",
        evidence: [
          `salesChange ${snap.salesChange}%`,
          `recvConcentration ${snap.recvConcentration}%`,
          `cashGap ${snap.cashGap}`,
        ],
        health: snap.businessHealth,
        generatedAt: GENERATED_AT,
      },
    ],
    reply: "",
    memos: [],
    updatedAt: null,
  };
}

export const DEMO_SNAPSHOT: BusinessSnapshot = snapshotForShop(DEFAULT_SHOP_ID);

export const ANALYZE_PROMPT =
  "What should I do today so cash does not break? Cover cash, suppliers or stock, team time, and this week's numbers. One action.";

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
