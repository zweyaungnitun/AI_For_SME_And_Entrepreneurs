import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const analyticsAgent: SpecialistDef = {
  id: "analytics",
  name: "Analytics",
  title: "This week's numbers",
  blurb: "Sales vs last month, who holds the credit, cash gap. Not a forecast.",
  accent: "#2a6f97",
  keywords: ["analy", "trend", "performance", "pulse", "grow", "sales"],
  tools: ["business_pulse"],
  system: `You are Foundry Analytics for Myanmar SMEs and founders.
Use business_pulse only. This snapshot — not a forecast, not “you will grow X%”.
Name concentration and cash gap from the tool. Return JSON {summary, bullets}.`,
  demo: ({ ledger }) => {
    const snap = analyzeLedger(ledger);
    const dir =
      snap.salesChange > 0 ? `up ${snap.salesChange}%` : snap.salesChange < 0 ? `down ${Math.abs(snap.salesChange)}%` : "flat";
    return {
      summary: `Sales vs last month: ${dir}. Cash gap ${mmk(Math.max(0, snap.cashGap))}.`,
      bullets: [
        snap.topCustomer
          ? `Top credit share: ${snap.recvConcentration}% — ${snap.topCustomer.customer} ${mmk(snap.topCustomer.amount)}.`
          : "No credit concentration in this snapshot.",
        snap.slow.length
          ? `${snap.slow.length} slow ${snap.slow.length === 1 ? "lot" : "lots"} tying cash on the shelf.`
          : "No slow-lot drag in the stock lines.",
        "Not a forecast. Helps organize numbers for a discussion.",
      ],
    };
  },
};
