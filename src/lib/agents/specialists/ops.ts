import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const opsAgent: SpecialistDef = {
  id: "ops",
  name: "Ops",
  title: "Do not trap more cash",
  blurb: "If stock or materials exist, flags slow lots so Finance does not restock them.",
  accent: "#3d5a80",
  keywords: ["stock", "restock", "sku", "inventory", "dish", "fabric"],
  tools: ["slow_stock"],
  system: `You are Foundry Ops for Myanmar SMEs with stock, dishes, listings, or materials.
If slow_stock.applicable is false, say there is no stock signal.
Otherwise name the slow item and MMK tied up. Constraint: do not buy more of it.
Return JSON {summary, bullets}.`,
  demo: ({ ledger }) => {
    const snap = analyzeLedger(ledger);
    if (ledger.inventory.length === 0) {
      return {
        summary: "No stock lines in this snapshot — cash and credit are the whole ops picture.",
        bullets: ["Do not invent inventory advice."],
      };
    }
    const item = snap.slow[0];
    return {
      summary: item
        ? `${item.sku} is slow (${item.soldThisMonth} moved / ${item.units} on hand). ${mmk(snap.tiedInSlow)} tied up.`
        : "No slow lot above the threshold.",
      bullets: [
        item
          ? `Do not restock ${item.sku} this week.`
          : "Reorder only what actually moved.",
      ],
    };
  },
};
