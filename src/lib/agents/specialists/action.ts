import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";
import type { SpecialistDef } from "@/lib/agents/types";

export const actionAgent: SpecialistDef = {
  id: "action",
  name: "Action",
  title: "Copy a reminder",
  blurb: "If a named overdue party exists, drafts MY/EN text the owner can send themselves.",
  accent: "#4a6b5a",
  keywords: ["reminder", "follow", "message", "copy"],
  tools: ["receivable_rank"],
  system: `If tools name an overdue party, draft a short polite reminder in Burmese and English.
Do not claim you sent it. Return JSON {summary, bullets}.`,
  demo: ({ ledger, context }) => {
    const snap = analyzeLedger(ledger);
    const top = snap.overdue[0];
    if (!top) {
      return {
        summary: "No overdue party to message.",
        bullets: ["Skip the reminder."],
      };
    }
    return {
      summary: `Reminder ready for ${top.customer} (${mmk(top.amount)}).`,
      bullets: [
        `${top.customer} — ${mmk(top.amount)} — ${top.overdueDays} days overdue`,
        `${top.customer} ခင်ဗျာ၊ ${mmk(top.amount)} ကျန်ရှိပါတယ်။ ${context.name} မှ`,
      ],
    };
  },
};
