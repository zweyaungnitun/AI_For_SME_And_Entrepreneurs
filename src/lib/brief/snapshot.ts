import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk, type Ledger } from "@/lib/ledger/types";
import { DEFAULT_SHOP_ID, getShop } from "@/lib/sme/catalog";
import type { FinancialInputs, Metric } from "@/lib/brief/types";

export function parseMmk(value: string) {
  const n = Number(String(value).replace(/[, ]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function ledgerFromFinancials(
  financials: FinancialInputs,
  shopId = DEFAULT_SHOP_ID,
): Ledger {
  const shop = getShop(shopId);
  const ledger = structuredClone(shop.ledger);
  const cash = parseMmk(financials.cashMmk);
  const upcoming = parseMmk(financials.upcomingMmk);
  const recv = parseMmk(financials.receivablesMmk);

  if (cash != null) ledger.cashOnHand = cash;
  if (upcoming != null && ledger.upcomingExpenses[0]) {
    ledger.upcomingExpenses[0] = {
      ...ledger.upcomingExpenses[0],
      amount: upcoming,
    };
  }
  if (recv != null && ledger.receivables.length > 0) {
    const current = ledger.receivables.reduce((a, r) => a + r.amount, 0);
    if (current > 0 && recv !== current) {
      ledger.receivables = ledger.receivables.map((r) => ({
        ...r,
        amount: Math.max(0, Math.round((r.amount / current) * recv)),
      }));
    }
  }
  return ledger;
}

export function metricsFromLedger(ledger: Ledger): Metric[] {
  const snap = analyzeLedger(ledger);
  const slow = snap.slow[0];
  const teamHint =
    snap.tight && ledger.receivables.filter((r) => r.overdueDays > 0).length > 0
      ? "Owner time on collections"
      : "This week's list";
  return [
    {
      id: "cash",
      label: "Cash on hand",
      value: mmk(ledger.cashOnHand),
      hint: snap.tight ? "Below this week's bills" : "Covers near payables",
      tone: snap.tight ? "risk" : "ok",
    },
    {
      id: "receivables",
      label: "Receivables",
      value: mmk(snap.overdueTotal || snap.ranked.reduce((a, r) => a + r.amount, 0)),
      hint: snap.overdue[0]
        ? `${snap.overdue[0].customer} first`
        : "No overdue credit",
      tone: snap.overdue.length ? "risk" : "ok",
    },
    {
      id: "upcoming",
      label: "Upcoming expenses",
      value: mmk(snap.nearTotal),
      hint: snap.near[0] ? `Due in ${snap.near[0].dueInDays} days` : "None this week",
      tone: snap.tight ? "risk" : "watch",
    },
    {
      id: "inventory",
      label: "Supply / stock",
      value: slow ? "Slow-moving" : ledger.inventory.length ? "Moving" : "No stock",
      hint: slow ? slow.sku : snap.near[0]?.name ?? "No slow lot",
      tone: slow || snap.tight ? "watch" : "neutral",
    },
    {
      id: "sales",
      label: "Sales pulse",
      value:
        snap.salesChange === 0
          ? "Flat vs last month"
          : `${snap.salesChange > 0 ? "+" : ""}${snap.salesChange}%`,
      hint: "This snapshot only — not a forecast",
      tone: "neutral",
    },
    {
      id: "team",
      label: "Team load",
      value: snap.tight ? "Strained" : "Manageable",
      hint: teamHint,
      tone: snap.tight ? "watch" : "ok",
    },
  ];
}
