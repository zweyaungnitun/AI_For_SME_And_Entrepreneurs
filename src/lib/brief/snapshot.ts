import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk, type Ledger } from "@/lib/ledger/types";
import { getShop } from "@/lib/sme/catalog";
import type { FinancialInputs, Metric } from "@/lib/brief/types";

export function parseMmk(value: string) {
  const n = Number(String(value).replace(/[, ]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function ledgerFromFinancials(
  financials: FinancialInputs,
  shopId = "daw-hla",
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
      label: "Inventory flag",
      value: slow ? "Slow-moving" : ledger.inventory.length ? "Moving" : "No stock",
      hint: slow ? slow.sku : "No slow lot",
      tone: slow ? "watch" : "neutral",
    },
  ];
}
