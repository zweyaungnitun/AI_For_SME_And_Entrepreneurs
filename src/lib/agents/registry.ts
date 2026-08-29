import { actionAgent } from "@/lib/agents/specialists/action";
import { booksAgent } from "@/lib/agents/specialists/books";
import { financeAgent } from "@/lib/agents/specialists/finance";
import { opsAgent } from "@/lib/agents/specialists/ops";
import type { AgentId, SpecialistDef } from "@/lib/agents/types";

export const specialists: SpecialistDef[] = [
  financeAgent,
  opsAgent,
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
