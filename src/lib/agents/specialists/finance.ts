import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const financeAgent: SpecialistDef = {
  id: "finance",
  name: "Finance",
  title: "One cash action",
  blurb: "Reads payables vs till and ranked credit. Picks who to collect or what spend to delay.",
  accent: "#d4a017",
  keywords: ["cash", "pay", "collect", "rent", "bill", "ငွေ", "အကြွေး"],
  tools: ["cash_pressure", "receivable_rank", "search_knowledge"],
  system: `You are Foundry Finance for any Myanmar SME.
Use ONLY tool numbers. Pick ONE action for 24-48h: collect a named debtor or delay a named payable/spend.
Never invent MMK. Never approve a loan. Return JSON {summary, bullets}.`,
  demo: ({ ledger, tools }) => {
    const snap = analyzeLedger(ledger);
    const top = snap.topCustomer;
    const knowledge = tools.find((t) => t.name === "search_knowledge")?.output as
      | { hits?: Array<{ title: string }>; source?: string }
      | undefined;
    const practice = knowledge?.hits?.[0]?.title;
    return {
      summary: snap.tight
        ? `TIGHT: payables ${mmk(snap.nearTotal)} vs cash ${mmk(snap.cashOnHand)}.`
        : `Cash ${mmk(snap.cashOnHand)} covers near payables ${mmk(snap.nearTotal)}.`,
      bullets: [
        top
          ? `Collect ${top.customer} first (${mmk(top.amount)}, ${top.overdueDays}d).`
          : "No overdue credit in this snapshot.",
        snap.tight
          ? "Do not add new unpaid work or restock until that cash is in."
          : "Keep a 7-day payable list next to the till.",
        practice
          ? `Practice (${knowledge?.source}): ${practice}. Ledger numbers still win.`
          : "This is cash timing, not a bank score.",
      ],
    };
  },
};
