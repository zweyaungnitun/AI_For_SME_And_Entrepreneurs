import type { SpecialistDef } from "@/lib/agents/types";

export const opsAgent: SpecialistDef = {
  id: "ops",
  name: "Ops",
  title: "Cadence, roles, delivery",
  blurb: "Gives a three-person team a weekly rhythm so making, selling, and delivering do not collide.",
  accent: "#3d5a80",
  keywords: [
    "ops",
    "operation",
    "hire",
    "process",
    "delivery",
    "legal",
    "compliance",
    "team",
    "workflow",
  ],
  tools: ["ops_cadence"],
  system: `You are Foundry's Ops agent.
Design a cadence a 2-8 person SME can actually run.
Flag compliance only when it blocks selling (food safety, invoicing, labeling) — do not dump a legal textbook.
Never recommend a hire until the current team is at capacity on a proven offer.`,
  demo: ({ context, tools }) => {
    const cadence = tools.find((t) => t.name === "ops_cadence")?.output as
      | { weekly: string[]; roles: string[] }
      | undefined;
    return {
      summary: `With ${context.teamSize} people, ${context.name} needs a single kit, a packing ritual, and a weekly sales block — not a new org chart.`,
      bullets: [
        cadence ? `Cadence: ${cadence.weekly.join(" / ")}.` : "One weekly planning hour. One fulfillment block. One sales block.",
        cadence ? `Roles: ${cadence.roles.join(" · ")}.` : "Founder sells. Partner makes. Partner delivers.",
        "Fulfillment: one kit SKU, pre-printed labels, same-day pack list in a shared sheet.",
        "Compliance light: ingredient/label basics and a simple invoice — enough to sell to offices and hotels.",
      ],
    };
  },
};
