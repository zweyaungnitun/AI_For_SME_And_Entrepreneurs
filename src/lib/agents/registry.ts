import { financeAgent } from "@/lib/agents/specialists/finance";
import { growthAgent } from "@/lib/agents/specialists/growth";
import { marketAgent } from "@/lib/agents/specialists/market";
import { opsAgent } from "@/lib/agents/specialists/ops";
import { strategyAgent } from "@/lib/agents/specialists/strategy";
import type { AgentId, SpecialistDef } from "@/lib/agents/types";

export const specialists: SpecialistDef[] = [
  strategyAgent,
  financeAgent,
  marketAgent,
  growthAgent,
  opsAgent,
];

export const specialistMap = Object.fromEntries(
  specialists.map((agent) => [agent.id, agent]),
) as Record<Exclude<AgentId, "conductor">, SpecialistDef>;

export function getSpecialist(id: AgentId) {
  if (id === "conductor") return undefined;
  return specialistMap[id];
}
