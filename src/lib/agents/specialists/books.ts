import type { SpecialistDef } from "@/lib/agents/types";

export const booksAgent: SpecialistDef = {
  id: "books",
  name: "Books",
  title: "Note → record",
  blurb: "Turns a messy credit note into a receivable, then the same cash tools run again.",
  accent: "#6f8f7c",
  keywords: ["သိန်း", "အကြွေး", "took", "will pay", "yesterday", "note"],
  tools: ["extract_note"],
  system: `Extract {customer, amount, type, due, status} from the owner message only.
If amount is missing, say so. Never invent MMK. Return JSON {summary, bullets}.`,
  demo: ({ tools, message }) => {
    const extracted = tools.find((t) => t.name === "extract_note")?.output as
      | { parsed?: boolean; customer?: string; amount?: number; note?: string }
      | undefined;
    if (extracted?.parsed && extracted.customer && extracted.amount) {
      return {
        summary: `Noted ${extracted.customer} ${extracted.amount.toLocaleString("en-US")} MMK.`,
        bullets: [extracted.note || "Re-run cash tools on the updated snapshot."],
      };
    }
    return {
      summary: "Could not post a book line from that note.",
      bullets: [
        `Heard: “${message.slice(0, 80)}”`,
        "Need a name and an amount in MMK.",
      ],
    };
  },
};
