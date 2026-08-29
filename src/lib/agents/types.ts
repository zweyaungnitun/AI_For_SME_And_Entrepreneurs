import type { DecisionCard, Ledger } from "@/lib/ledger/types";

export type Stage =
  | "idea"
  | "pre-revenue"
  | "early"
  | "growth"
  | "established";

export type BusinessContext = {
  name: string;
  industry: string;
  stage: Stage;
  location: string;
  teamSize: number;
  challenge: string;
};

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type AgentId =
  | "conductor"
  | "finance"
  | "supply"
  | "resources"
  | "analytics"
  | "books"
  | "action";

export type ToolResult = {
  name: string;
  input: Record<string, unknown>;
  output: unknown;
  ms: number;
};

export type AgentMemo = {
  agentId: AgentId;
  name: string;
  summary: string;
  bullets: string[];
  tools: ToolResult[];
  ms: number;
};

export type AgentEvent =
  | { type: "session"; sessionId: string; mode: "llm" | "demo" }
  | { type: "plan"; agents: AgentId[]; rationale: string }
  | { type: "agent_start"; agentId: AgentId; name: string }
  | { type: "tool"; agentId: AgentId; tool: ToolResult }
  | { type: "agent_end"; memo: AgentMemo }
  | { type: "token"; text: string }
  | { type: "error"; error: string }
  | {
      type: "done";
      reply: string;
      memos: AgentMemo[];
      model: string;
      card: DecisionCard;
    };

export type RunRequest = {
  message: string;
  sessionId?: string;
  shopId?: string;
  context: BusinessContext;
  snapshot?: Partial<Ledger>;
};

export type DemoArgs = {
  context: BusinessContext;
  message: string;
  history: ChatTurn[];
  tools: ToolResult[];
  ledger: Ledger;
};

export type SpecialistDef = {
  id: Exclude<AgentId, "conductor">;
  name: string;
  title: string;
  blurb: string;
  accent: string;
  keywords: string[];
  tools: string[];
  system: string;
  demo: (args: DemoArgs) => { summary: string; bullets: string[] };
};
