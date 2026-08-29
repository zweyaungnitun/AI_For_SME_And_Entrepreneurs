import type { Ledger, ShopType } from "@/lib/ledger/types";
import { ensureDb } from "@/lib/db/ensure";
import { getSql } from "@/lib/db/client";

type ShopRow = {
  id: string;
  type: ShopType;
  cash_on_hand: number;
  month_sales: number;
  last_month_sales: number;
};

export async function loadShopLedger(shopId: string): Promise<Ledger | null> {
  if (!(await ensureDb())) return null;
  const sql = getSql();
  const shops = (await sql`
    SELECT id, type, cash_on_hand, month_sales, last_month_sales
    FROM shops WHERE id = ${shopId}
  `) as ShopRow[];
  const shop = shops[0];
  if (!shop) return null;

  const payables = (await sql`
    SELECT name, amount, due_in_days FROM payables WHERE shop_id = ${shopId}
  `) as Array<{ name: string; amount: number; due_in_days: number }>;
  const recs = (await sql`
    SELECT customer, amount, overdue_days, status FROM receivables WHERE shop_id = ${shopId}
  `) as Array<{
    customer: string;
    amount: number;
    overdue_days: number;
    status: "pending" | "overdue";
  }>;
  const stock = (await sql`
    SELECT sku, units, sold_this_month, unit_cost FROM inventory WHERE shop_id = ${shopId}
  `) as Array<{
    sku: string;
    units: number;
    sold_this_month: number;
    unit_cost: number;
  }>;

  return {
    currency: "MMK",
    shopType: shop.type,
    cashOnHand: Number(shop.cash_on_hand),
    monthSales: Number(shop.month_sales),
    lastMonthSales: Number(shop.last_month_sales),
    upcomingExpenses: payables.map((p) => ({
      name: p.name,
      amount: Number(p.amount),
      dueInDays: Number(p.due_in_days),
    })),
    receivables: recs.map((r) => ({
      customer: r.customer,
      amount: Number(r.amount),
      overdueDays: Number(r.overdue_days),
      status: r.status,
    })),
    inventory: stock.map((s) => ({
      sku: s.sku,
      units: Number(s.units),
      soldThisMonth: Number(s.sold_this_month),
      unitCost: Number(s.unit_cost),
    })),
  };
}

export async function persistExtractedNote(
  shopId: string,
  extracted: {
    parsed?: boolean;
    customer?: string;
    amount?: number;
    status?: "pending" | "overdue";
  },
) {
  if (!extracted.parsed || !extracted.customer || !extracted.amount) return;
  if (!(await ensureDb())) return;
  const sql = getSql();
  const id = `${shopId}-note-${extracted.customer}-${extracted.amount}`;
  await sql`
    INSERT INTO receivables (id, shop_id, customer, amount, overdue_days, status)
    VALUES (
      ${id}, ${shopId}, ${extracted.customer}, ${extracted.amount},
      ${extracted.status === "overdue" ? 1 : 0}, ${extracted.status ?? "pending"}
    )
    ON CONFLICT (id) DO UPDATE SET
      amount = EXCLUDED.amount,
      status = EXCLUDED.status
  `;
}
