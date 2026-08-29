import type { SpecialistDef } from "@/lib/agents/types";
import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";

export const strategyAgent: SpecialistDef = {
  id: "strategy",
  name: "Strategy",
  title: "Business strategy & planning",
  blurb:
    "Develops strategic plans, identifies growth opportunities, and provides long-term business guidance based on current operations and market conditions.",
  accent: "#7c3aed",
  keywords: [
    "strategy",
    "plan",
    "growth",
    "expansion",
    "opportunity",
    "vision",
    "roadmap",
    "competitive",
    "positioning",
  ],
  tools: ["business_pulse", "search_knowledge"],
  system: `You are Foundry Strategy for Myanmar SMEs and entrepreneurs.
Analyze the current business state and provide strategic recommendations for sustainable growth.
Focus on: actionable next steps, resource optimization, competitive advantages, market opportunities.
Consider: current cash position, team capacity, market conditions, operational constraints.
Do NOT recommend actions that require significant capital if cash is tight.
Do NOT suggest expansion if core operations aren't stable.
Return JSON {summary, bullets}.`,
  demo: ({ context, ledger, tools }) => {
    const snap = analyzeLedger(ledger);
    const knowledge = tools.find((t) => t.name === "search_knowledge")?.output as
      | { hits?: Array<{ title: string }> }
      | undefined;

    const bullets: string[] = [];

    // Strategic assessment based on stage
    if (context.stage === "early" || context.stage === "pre-revenue") {
      bullets.push(
        "Focus on validating product-market fit before scaling operations.",
      );
      if (snap.tight) {
        bullets.push(
          `Cash: ${mmk(snap.cashOnHand)}. Prioritize revenue generation over expansion.`,
        );
      } else {
        bullets.push("Build repeatable sales process before adding overhead.");
      }
    } else if (context.stage === "growth") {
      bullets.push(
        "Growth phase: Balance scaling with operational efficiency.",
      );
      if (snap.recvConcentration > 0.4) {
        bullets.push(
          `Risk: ${Math.round(snap.recvConcentration * 100)}% revenue concentration. Diversify customer base before scaling.`,
        );
      } else {
        bullets.push("Customer base is diversified. Ready for measured expansion.");
      }
    } else {
      bullets.push(
        "Established position: Focus on margin improvement and market defense.",
      );
      bullets.push("Consider process automation to improve efficiency.");
    }

    // Operational readiness
    if (context.teamSize < 3 && snap.tight) {
      bullets.push(
        "Limited team + tight cash = focus on high-ROI activities only.",
      );
    } else if (context.teamSize >= 5) {
      bullets.push(
        "Team size supports delegation. Document processes for scalability.",
      );
    }

    // Strategic priorities
    if (snap.tight) {
      bullets.push(
        "Short-term: Secure cash flow stability before strategic initiatives.",
      );
    } else if (snap.salesChange > 0.2) {
      bullets.push(
        `Sales up ${Math.round(snap.salesChange * 100)}%. Momentum is strong—invest in what's working.`,
      );
    } else if (snap.salesChange < -0.1) {
      bullets.push(
        "Sales declining. Review pricing, product fit, and customer feedback.",
      );
    }

    if (knowledge?.hits?.[0]) {
      bullets.push(`Strategic insight: ${knowledge.hits[0].title}`);
    }

    return {
      summary:
        snap.tight
          ? "Stabilize operations and cash flow before pursuing growth opportunities."
          : context.stage === "growth"
            ? "Strong foundation for scaling. Focus on customer diversification and process efficiency."
            : "Maintain competitive position while exploring adjacent opportunities.",
      bullets,
    };
  },
};
