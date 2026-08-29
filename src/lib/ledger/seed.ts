import { getShop } from "@/lib/sme/catalog";
import type { Ledger } from "@/lib/ledger/types";

export function seedLedger(shopId?: string): Ledger {
  return structuredClone(getShop(shopId).ledger);
}

export function mergeLedger(base: Ledger, patch?: Partial<Ledger>): Ledger {
  if (!patch) return structuredClone(base);
  return {
    currency: "MMK",
    shopType: patch.shopType ?? base.shopType,
    cashOnHand: patch.cashOnHand ?? base.cashOnHand,
    monthSales: patch.monthSales ?? base.monthSales,
    lastMonthSales: patch.lastMonthSales ?? base.lastMonthSales,
    upcomingExpenses: patch.upcomingExpenses ?? base.upcomingExpenses,
    receivables: patch.receivables ?? base.receivables,
    inventory: patch.inventory ?? base.inventory,
  };
}
