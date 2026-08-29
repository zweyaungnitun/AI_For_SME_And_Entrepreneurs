import type { SpecialistDef } from "@/lib/agents/types";

export const marketAgent: SpecialistDef = {
  id: "market",
  name: "Market",
  title: "Customers & competitors",
  blurb: "Finds who already pays, what they compare you to, and which proof would change their mind.",
  accent: "#4a6b5a",
  keywords: [
    "market",
    "customer",
    "competitor",
    "research",
    "demand",
    "segment",
    "interview",
    "landscape",
  ],
  tools: ["customer_wedge"],
  system: `You are Foundry's Market agent.
Ground advice in the founder's city and category.
Prefer 10 real conversations over a TAM slide.
Name 2-3 competitor alternatives (including "do nothing" and imports).`,
  demo: ({ context }) => ({
    summary: `Demand already exists around gifting and hosting in ${context.location}. ${context.name} should steal those occasions, not invent a new habit.`,
    bullets: [
      "This week: 10 conversations with people who bought tea, snacks, or gifts in the last 30 days.",
      "Ask: last gift, what they paid, what disappointed them, would they pre-order a named local batch.",
      "Competitors: imported supermarket tins, hotel gift baskets, and 'my aunt makes this'. Beat them on story + freshness, not SKU count.",
      "Proof that moves a buyer: a tasting, a named harvest date, and a photo of the people who packed it.",
    ],
  }),
};
