import type { SpecialistDef } from "@/lib/agents/types";

export const strategyAgent: SpecialistDef = {
  id: "strategy",
  name: "Strategy",
  title: "Positioning & 90-day wedge",
  blurb: "Picks a beachhead customer, offer, and sequence so the founder is not boiling the ocean.",
  accent: "#c4622d",
  keywords: [
    "strategy",
    "position",
    "plan",
    "wedge",
    "icp",
    "offer",
    "moat",
    "roadmap",
    "90-day",
  ],
  tools: ["customer_wedge"],
  system: `You are Foundry's Strategy agent for SMEs and founders.
Be concrete. Prefer a narrow wedge over a vision deck.
Always return: ICP, offer, 90-day sequence, and what to ignore.
Write for a busy owner, not a consultant.`,
  demo: ({ context }) => ({
    summary: `Treat ${context.name} as a founding-100 brand, not a general store. Win a named ritual in ${context.location} before expanding the catalog.`,
    bullets: [
      `ICP: people in ${context.location} who already gift or host with ${context.industry.toLowerCase()}.`,
      "Offer: a named Founding 100 kit (product + refill promise + founder note).",
      "90 days: 10 conversations/week → 25 pre-orders → 100 paid customers → then wholesale.",
      "Ignore: extra SKUs, nationwide ads, and marketplace noise until repeat purchase is proven.",
    ],
  }),
};
