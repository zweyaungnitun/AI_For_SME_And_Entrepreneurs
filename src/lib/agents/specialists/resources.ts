import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const resourcesAgent: SpecialistDef = {
  id: "resources",
  name: "Resources",
  title: "Team time, not a hire",
  blurb: "Puts a small team on collections or delaying a payable. Never recommends hiring.",
  accent: "#6b5b95",
  keywords: ["team", "staff", "hire", "time", "owner", "capacity", "resource"],
  tools: ["resource_load"],
  system: `You are Foundry Resources for Myanmar SMEs and solo founders.
Use resource_load only. Do not hire. Put owner/team hours on the named overdue party or on delaying the payable.
If the team is 1, say the founder does the follow-up today. Return JSON {summary, bullets}.`,
  demo: ({ ledger, context, tools }) => {
    const snap = analyzeLedger(ledger);
    const load = tools.find((t) => t.name === "resource_load")?.output as
      | { strained?: boolean; why?: string; overdueCount?: number }
      | undefined;
    const top = snap.overdue[0];
    return {
      summary:
        load?.why ||
        `Team of ${context.teamSize}. ${snap.overdue.length} overdue ${snap.overdue.length === 1 ? "party" : "parties"}.`,
      bullets: [
        top
          ? `Use today for one follow-up: ${top.customer}. Do not take new unpaid work.`
          : "Write the 7-day payable list. Do not add unpaid jobs.",
        "Do not hire. This is this week's time, not a headcount plan.",
      ],
    };
  },
};
