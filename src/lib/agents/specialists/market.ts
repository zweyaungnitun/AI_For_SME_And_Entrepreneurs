import type { SpecialistDef } from "@/lib/agents/types";
import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";

export const marketAgent: SpecialistDef = {
  id: "market",
  name: "Market",
  title: "Competitive positioning",
  blurb:
    "Analyzes market trends, competitive landscape, and positioning opportunities based on the business context and current operations.",
  accent: "#8b5cf6",
  keywords: [
    "market",
    "competition",
    "competitor",
    "positioning",
    "trend",
    "industry",
    "customer",
    "demand",
    "pricing",
  ],
  tools: ["search_knowledge", "business_pulse"],
  system: `You are Foundry Market Intelligence for Myanmar SMEs.
Analyze the business's market position using ONLY the provided context and ledger data.
Focus on: competitive advantages, pricing position, customer concentration risk, market timing.
Do NOT invent competitor data or market size numbers.
Provide actionable insights: which customers to prioritize, pricing adjustments, or timing opportunities.
Return JSON {summary, bullets}.`,
  demo: ({ context, ledger, tools }) => {
    const snap = analyzeLedger(ledger);
    const knowledge = tools.find((t) => t.name === "search_knowledge")?.output as
      | { hits?: Array<{ title: string }>; source?: string }
      | undefined;
    const practice = knowledge?.hits?.[0]?.title;

    const topCustomer = snap.topCustomer;
    const concentration = snap.recvConcentration;

    const bullets = [
      context.stage === "early" || context.stage === "growth"
        ? `${context.industry} in ${context.location}: Focus on repeatability before expansion.`
        : `Established ${context.industry} position — protect margins and customer relationships.`,
    ];

    if (topCustomer && concentration > 0.4) {
      bullets.push(
        `Customer concentration risk: ${topCustomer.customer} is ${Math.round(concentration * 100)}% of receivables (${mmk(topCustomer.amount)}). Diversify to reduce dependency.`,
      );
    }

    if (snap.slow.length > 0) {
      bullets.push(
        `Slow stock movement (${snap.slow.length} items): ${mmk(snap.tiedInSlow)} tied up. Consider: lower price, bundle offers, or switch suppliers.`,
      );
    }

    if (practice) {
      bullets.push(`Market practice: ${practice}.`);
    }

    bullets.push(
      `This week: ${topCustomer ? `Secure the ${topCustomer.customer} payment` : "Focus on converting prospects"} to strengthen cash position for next moves.`,
    );

    return {
      summary:
        concentration > 0.4
          ? "High customer concentration risk — diversify before scaling."
          : `${context.industry} position stable. Timing and margins matter most this week.`,
      bullets,
    };
  },
};
