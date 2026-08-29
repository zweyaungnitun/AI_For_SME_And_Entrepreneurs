import type { BusinessContext, ToolResult } from "@/lib/agents/types";

function timed<T>(name: string, input: Record<string, unknown>, run: () => T): ToolResult {
  const start = Date.now();
  const output = run();
  return { name, input, output, ms: Date.now() - start };
}

const CHANNELS: Record<string, string[]> = {
  food: ["Weekend pop-ups", "WhatsApp / Viber catalogs", "Office tasting boxes"],
  tea: ["Tasting nights", "Hotel and cafe wholesale", "Gift sets for corporates"],
  retail: ["Neighborhood flyers + QR", "Referral cards at till", "Local creator unboxings"],
  software: ["Founder-led LinkedIn", "Product-led free trial", "Partner agencies"],
  services: ["Warm intros", "Case-study posts", "Workshops"],
  default: ["Community groups", "Partner shelves", "Direct outreach"],
};

export function guessPrice(industry: string) {
  const t = industry.toLowerCase();
  if (t.includes("tea") || t.includes("snack") || t.includes("food") || t.includes("coffee")) {
    return { price: 18, cogs: 7, cac: 6 };
  }
  if (t.includes("software") || t.includes("saas")) {
    return { price: 49, cogs: 6, cac: 80 };
  }
  if (t.includes("service") || t.includes("consult")) {
    return { price: 400, cogs: 80, cac: 120 };
  }
  return { price: 40, cogs: 16, cac: 25 };
}

export function runTool(name: string, context: BusinessContext, message: string): ToolResult {
  const numbers = guessPrice(context.industry);

  if (name === "unit_economics") {
    return timed(name, numbers, () => {
      const contribution = numbers.price - numbers.cogs;
      const margin = contribution / numbers.price;
      const paybackOrders = contribution > 0 ? numbers.cac / contribution : null;
      const first100Revenue = numbers.price * 100;
      const first100Contribution = contribution * 100;
      return {
        currency: "USD equivalent",
        ...numbers,
        contribution: Number(contribution.toFixed(2)),
        grossMargin: `${Math.round(margin * 100)}%`,
        ordersToRecoverCac: paybackOrders ? Number(paybackOrders.toFixed(1)) : null,
        first100Revenue,
        first100Contribution: Number(first100Contribution.toFixed(0)),
      };
    });
  }

  if (name === "channel_mix") {
    const key =
      Object.keys(CHANNELS).find((k) => context.industry.toLowerCase().includes(k)) ?? "default";
    return timed(name, { industry: context.industry, stage: context.stage }, () => ({
      recommended: CHANNELS[key],
      avoidUntilProductLove: ["Broad paid social", "Billboards", "Unfocused marketplaces"],
      weeklyCadence: "3 outbound hours + 1 public proof post",
    }));
  }

  if (name === "customer_wedge") {
    return timed(
      name,
      { location: context.location, challenge: context.challenge },
      () => ({
        primaryIcp: `Early adopters in ${context.location} who already buy ${context.industry.toLowerCase()} as a gift or weekly ritual`,
        wedgeOffer: "Founding-100 kit with a refill promise and a named batch",
        proof: "10 conversations this week, 3 paid pre-orders before any ads",
        constraint: context.challenge,
        messageHint: message.slice(0, 140),
      }),
    );
  }

  if (name === "ops_cadence") {
    return timed(name, { teamSize: context.teamSize }, () => ({
      weekly: [
        "Mon: pipeline + cash",
        "Wed: make / fulfill",
        "Fri: customer conversations + one public proof",
      ],
      roles:
        context.teamSize <= 3
          ? ["Founder: sales + story", "Partner: product", "Partner: ops / delivery"]
          : ["Founder", "Product", "Demand", "Ops"],
      stopDoing: ["Building extra SKUs", "Custom one-offs that break margin"],
    }));
  }

  return timed(name, {}, () => ({ skipped: true }));
}

export function runTools(names: string[], context: BusinessContext, message: string) {
  return names.map((name) => runTool(name, context, message));
}
