import type { SpecialistDef } from "@/lib/agents/types";
import { mmk } from "@/lib/ledger/types";
import { analyzeLedger } from "@/lib/ledger/analyze";

export const growthAgent: SpecialistDef = {
  id: "growth",
  name: "Growth",
  title: "Revenue & customer growth",
  blurb:
    "Identifies revenue opportunities, customer acquisition strategies, and sustainable growth tactics based on current performance and market dynamics.",
  accent: "#10b981",
  keywords: [
    "growth",
    "revenue",
    "sales",
    "customer",
    "acquisition",
    "retention",
    "marketing",
    "scale",
    "expansion",
  ],
  tools: ["business_pulse", "trend_analysis", "search_knowledge"],
  system: `You are Foundry Growth for Myanmar SMEs and entrepreneurs.
Analyze current performance and recommend practical growth strategies.
Focus on: customer acquisition, revenue optimization, retention, upselling opportunities.
Consider: available resources, market conditions, competition, current capacity.
Do NOT recommend expensive marketing if cash is tight.
Do NOT suggest rapid scaling if operations aren't stable.
Prioritize high-ROI, low-cost growth tactics suitable for SMEs.
Return JSON {summary, bullets}.`,
  demo: ({ context, ledger, tools }) => {
    const snap = analyzeLedger(ledger);
    const trendTool = tools.find((t) => t.name === "trend_analysis");
    const trend = trendTool?.output as
      | { trend: string; salesChangePct: number; insights: string[] }
      | undefined;

    const bullets: string[] = [];

    // Growth assessment
    if (trend) {
      bullets.push(`Sales trend: ${trend.trend} (${Math.round(trend.salesChangePct * 100)}% MoM)`);
      
      if (trend.trend === "growing") {
        bullets.push(
          "Strong momentum. Double down on what's working: existing channels, top products, best customers.",
        );
        if (!snap.tight) {
          bullets.push(
            "Cash position allows strategic marketing investment. Test small, scale winners.",
          );
        }
      } else if (trend.trend === "declining") {
        bullets.push(
          "Sales softening. Immediate actions: reach out to past customers, review pricing, gather feedback.",
        );
        bullets.push(
          "Low-cost channels: referrals, partnerships, local community engagement.",
        );
      } else {
        bullets.push(
          "Sales stable. Focus on increasing average order value and purchase frequency.",
        );
      }
    }

    // Customer insights
    if (snap.topCustomer && snap.recvConcentration > 0.3) {
      bullets.push(
        `${snap.topCustomer.customer} is ${Math.round(snap.recvConcentration * 100)}% of revenue. Growth = customer diversification.`,
      );
      bullets.push(
        "Tactics: Referral program, similar customer targeting, expand product range.",
      );
    } else {
      bullets.push(
        "Customer base is healthy. Growth opportunity: increase wallet share with existing customers.",
      );
    }

    // Tactical recommendations
    if (context.stage === "early") {
      bullets.push(
        "Early stage: Word-of-mouth and personal networks are your highest ROI channels.",
      );
    } else if (context.teamSize >= 3 && !snap.tight) {
      bullets.push(
        "Team capacity + stable cash = ready for systematic customer acquisition.",
      );
    }

    // Immediate growth actions
    const actions: string[] = [];
    if (snap.overdueTotal > 0) {
      actions.push(`Collect ${mmk(snap.overdueTotal)} overdue = instant revenue boost`);
    }
    if (snap.topCustomer) {
      actions.push("Ask top customers for referrals (zero cost, high conversion)");
    }
    actions.push("Document what's working, do more of it");
    
    bullets.push(`This week: ${actions.join(". ")}.`);

    return {
      summary:
        trend?.trend === "growing"
          ? "Capitalize on momentum with focused investment in proven channels."
          : snap.tight
            ? "Prioritize zero-cost growth tactics: referrals, retention, and reactivation."
            : "Stable foundation for systematic customer acquisition and revenue optimization.",
      bullets,
    };
  },
};
