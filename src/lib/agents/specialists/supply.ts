import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const supplyAgent: SpecialistDef = {
  id: "supply",
  name: "Supply",
  title: "Suppliers and slow lots",
  blurb: "Flags payables and slow stock so the owner does not trap more cash in the chain.",
  accent: "#3d5a80",
  keywords: [
    "stock",
    "restock",
    "sku",
    "inventory",
    "supplier",
    "supply",
    "po",
    "yarn",
    "ingredient",
  ],
  tools: ["supplier_pressure", "slow_stock"],
  system: `You are Foundry Supply for Myanmar SMEs and founders.
Use supplier_pressure and slow_stock only. If no stock, say so — do not invent SKUs.
If cash is TIGHT, do not recommend a new purchase order.
Name the slow lot and the payable. Return JSON {summary, bullets}.`,
  demo: ({ ledger }) => {
    const snap = analyzeLedger(ledger);
    const bill = snap.near[0];
    const item = snap.slow[0];
    if (ledger.inventory.length === 0 && snap.near.length === 0) {
      return {
        summary: "No supplier or stock lines — cash and credit are the whole supply picture.",
        bullets: ["Do not invent inventory or PO advice."],
      };
    }
    return {
      summary: snap.tight
        ? `Supplier pressure: ${bill ? `${bill.name} ${mmk(bill.amount)} in ${bill.dueInDays}d` : "near payables"} vs cash ${mmk(ledger.cashOnHand)}.`
        : "Near payables are covered; still do not restock slow lots.",
      bullets: [
        item
          ? `Do not restock ${item.sku} this week (${mmk(item.units * item.unitCost)} on shelf).`
          : ledger.inventory.length === 0
            ? "No stock lines — skip restock advice."
            : "Reorder only what actually moved.",
        snap.tight
          ? "Do not place a new PO until overdue cash is in or this payable is delayed."
          : "Keep the 7-day supplier list next to the till.",
      ],
    };
  },
};
