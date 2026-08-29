import { actionAgent } from "@/lib/agents/specialists/action";
import { analyticsAgent } from "@/lib/agents/specialists/analytics";
import { booksAgent } from "@/lib/agents/specialists/books";
import { financeAgent } from "@/lib/agents/specialists/finance";
import { resourcesAgent } from "@/lib/agents/specialists/resources";
import { supplyAgent } from "@/lib/agents/specialists/supply";
import type { AgentId, SpecialistDef } from "@/lib/agents/types";

export const specialists: SpecialistDef[] = [
  financeAgent,
  supplyAgent,
  resourcesAgent,
  analyticsAgent,
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
