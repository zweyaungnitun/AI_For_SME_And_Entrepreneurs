import { actionAgent } from "@/lib/agents/specialists/action";
import { analyticsAgent } from "@/lib/agents/specialists/analytics";
import { booksAgent } from "@/lib/agents/specialists/books";
import { financeAgent } from "@/lib/agents/specialists/finance";
import { growthAgent } from "@/lib/agents/specialists/growth";
import { marketAgent } from "@/lib/agents/specialists/market";
import { resourcesAgent } from "@/lib/agents/specialists/resources";
import { strategyAgent } from "@/lib/agents/specialists/strategy";
import { supplyAgent } from "@/lib/agents/specialists/supply";
import type { AgentId, SpecialistDef } from "@/lib/agents/types";

export const specialists: SpecialistDef[] = [
  financeAgent,
  supplyAgent,
  resourcesAgent,
  analyticsAgent,
  marketAgent,
  strategyAgent,
  growthAgent,
  booksAgent,
  actionAgent,
];

export const specialistMap = Object.fromEntries(
  specialists.map((agent) => [agent.id, agent]),
) as Record<Exclude<AgentId, "conductor">, SpecialistDef>;

export function getSpecialist(id: AgentId) {
  if (id === "conductor") return undefined;
  return specialistMap[id];
}
