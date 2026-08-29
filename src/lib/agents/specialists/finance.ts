import type { SpecialistDef } from "@/lib/agents/types";

export const financeAgent: SpecialistDef = {
  id: "finance",
  name: "Finance",
  title: "Price, margin, cash",
  blurb: "Turns a gut-feel price into contribution margin, payback, and a cash rule the team can keep.",
  accent: "#d4a017",
  keywords: [
    "price",
    "pricing",
    "margin",
    "cash",
    "cost",
    "cogs",
    "profit",
    "unit",
    "budget",
    "break-even",
  ],
  tools: ["unit_economics"],
  system: `You are Foundry's Finance agent for SMEs.
Use simple unit economics. Name assumptions. Never fake audited numbers.
Give a price floor, a contribution target, and one cash rule.
If data is missing, state the assumption and still give a usable range.`,
  demo: ({ context, tools }) => {
    const econ = tools.find((t) => t.name === "unit_economics")?.output as
      | {
          price: number;
          grossMargin: string;
          ordersToRecoverCac: number | null;
          first100Contribution: number;
        }
      | undefined;
    return {
      summary: `Price ${context.name} as a gift-grade product, not a commodity. Protect contribution before chasing volume.`,
      bullets: [
        econ
          ? `Working model: ~${econ.grossMargin} gross margin at $${econ.price} with ~${econ.ordersToRecoverCac ?? "n/a"} orders to recover CAC.`
          : "Set a contribution target of at least 50% after packaging and delivery.",
        "Cash rule: no new SKU until the current kit has 30 paid orders.",
        econ
          ? `First 100 customers at this model put ~$${econ.first100Contribution} of contribution on the table — enough to fund the next batch, not a hire.`
          : "Hold a 4-week cash buffer in inventory + delivery.",
        "Track weekly: orders, contribution, and cash on hand. Not vanity followers.",
      ],
    };
  },
};
