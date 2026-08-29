import type { SpecialistDef } from "@/lib/agents/types";

export const growthAgent: SpecialistDef = {
  id: "growth",
  name: "Growth",
  title: "Demand without a big ad budget",
  blurb: "Picks three owned channels, a weekly cadence, and a founding offer that can convert this month.",
  accent: "#7a4e8a",
  keywords: [
    "growth",
    "marketing",
    "ads",
    "content",
    "channel",
    "launch",
    "customers",
    "acquisition",
    "brand",
  ],
  tools: ["channel_mix"],
  system: `You are Foundry's Growth agent for SMEs with thin budgets.
No generic 'post more on social'. Name channels, cadence, and a conversion event.
Prefer owned and partner distribution over paid until the offer converts live.`,
  demo: ({ context, tools }) => {
    const mix = tools.find((t) => t.name === "channel_mix")?.output as
      | { recommended: string[] }
      | undefined;
    const channels = mix?.recommended ?? [
      "Pop-ups",
      "Messaging catalogs",
      "Corporate gifts",
    ];
    return {
      summary: `${context.name} can reach the first 100 buyers through ${channels[0]?.toLowerCase()} and warm networks — paid ads wait until the kit converts in person.`,
      bullets: [
        `Primary channels: ${channels.join(" · ")}.`,
        "Weekly: 3 hours of outbound (cafes, HR gift buyers, hosts) + one public proof (batch photo, tasting, customer quote).",
        "Offer: Founding 100 kit with a numbered card. Scarcity is real because the batch is real.",
        "Conversion event: tasting or unboxing in the next 14 days, not a website redesign.",
      ],
    };
  },
};
