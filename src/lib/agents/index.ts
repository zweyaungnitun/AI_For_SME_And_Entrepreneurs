import { specialists } from "@/lib/agents/registry";
import type { AgentId } from "@/lib/agents/types";

export { specialists, getSpecialist, specialistMap } from "@/lib/agents/registry";
export { runCrew } from "@/lib/agents/orchestrator";
export { DEFAULT_CONTEXT, STAGES } from "@/lib/agents/defaults";
export type {
  AgentEvent,
  AgentId,
  AgentMemo,
  BusinessContext,
  RunRequest,
  SpecialistDef,
} from "@/lib/agents/types";

export const AGENT_ORDER: AgentId[] = [
  "conductor",
  ...specialists.map((agent) => agent.id),
];
