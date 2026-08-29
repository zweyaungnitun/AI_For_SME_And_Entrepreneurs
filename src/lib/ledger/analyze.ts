import { type BusinessHealth, type Ledger } from "@/lib/ledger/types";

export function dueSoon(ledger: Ledger, withinDays = 7) {
  return ledger.upcomingExpenses.filter((e) => e.dueInDays <= withinDays);
}

export function rankReceivables(ledger: Ledger) {
  return [...ledger.receivables].sort((a, b) => {
    const aOver = a.status === "overdue" || a.overdueDays > 0 ? 1 : 0;
    const bOver = b.status === "overdue" || b.overdueDays > 0 ? 1 : 0;
    if (aOver !== bOver) return bOver - aOver;
    if (a.amount !== b.amount) return b.amount - a.amount;
    return b.overdueDays - a.overdueDays;
  });
}

export function overdueReceivables(ledger: Ledger) {
  return rankReceivables(ledger).filter(
    (r) => r.status === "overdue" || r.overdueDays > 0,
  );
}

export function slowStock(ledger: Ledger) {
  return ledger.inventory.filter((item) => item.soldThisMonth <= 3 && item.units >= 10);
}

export function sum(amounts: number[]) {
  return amounts.reduce((a, b) => a + b, 0);
}

export function analyzeLedger(ledger: Ledger) {
  const near = dueSoon(ledger, 7);
  const nearTotal = sum(near.map((e) => e.amount));
  const ranked = rankReceivables(ledger);
  const overdue = overdueReceivables(ledger);
  const overdueTotal = sum(overdue.map((r) => r.amount));
  const slow = slowStock(ledger);
  const tiedInSlow = sum(slow.map((s) => s.units * s.unitCost));
  const cashGap = nearTotal - ledger.cashOnHand;
  const tight = cashGap > 0;
  const salesChange =
    ledger.lastMonthSales === 0
      ? 0
      : Math.round(
          ((ledger.monthSales - ledger.lastMonthSales) / ledger.lastMonthSales) * 100,
        );

  let businessHealth: BusinessHealth = "OK";
  if (tight) businessHealth = "TIGHT";
  else if (overdue.length > 0 || slow.length > 0) businessHealth = "WATCH";

  const topCustomer = overdue[0] ?? ranked[0] ?? null;
  const recvTotal = sum(ranked.map((r) => r.amount));
  const recvConcentration =
    recvTotal === 0 || !topCustomer
      ? 0
      : Math.round((topCustomer.amount / recvTotal) * 100);
  const stockUnits = sum(ledger.inventory.map((item) => item.units));
  const stockSold = sum(ledger.inventory.map((item) => item.soldThisMonth));
  const stockTurnover = stockUnits === 0 ? 0 : stockSold / stockUnits;

  return {
    cashOnHand: ledger.cashOnHand,
    near,
    nearTotal,
    ranked,
    overdue,
    overdueTotal,
    recvTotal,
    recvConcentration,
    stockTurnover,
    slow,
    tiedInSlow,
    cashGap,
    tight,
    salesChange,
    businessHealth,
    topCustomer,
    evidence: [
      `cash ${ledger.cashOnHand}`,
      `payables ${nearTotal} due ${near[0]?.dueInDays ?? 0}d`,
      ...overdue.map((r) => `${r.customer} ${r.amount} overdue ${r.overdueDays}d`),
      ...slow.map((s) => `${s.sku} slow ${s.units}u ${s.soldThisMonth} sold`),
    ],
  };
}

export type LedgerAnalysis = ReturnType<typeof analyzeLedger>;
