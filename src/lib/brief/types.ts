import type { AgentMemo, BusinessContext } from "@/lib/agents/types";
import type { BusinessHealth } from "@/lib/ledger/types";

export type HealthStatus = BusinessHealth;

export type MetricTone = "ok" | "watch" | "risk" | "neutral";

export type Metric = {
  id: string;
  label: string;
  value: string;
  hint?: string;
  tone: MetricTone;
};

export type BriefInsight = {
  id: string;
  title: string;
  summary: string;
  happening: string;
  wrong: string;
  matters: string;
  action: string;
  why: string;
  evidence: string[];
  health: HealthStatus;
  generatedAt: string;
};

export type Priority = {
  title: string;
  reason: string;
  action: string;
};

export type RiskAlert = {
  title: string;
  detail: string;
};

export type FinancialInputs = {
  cashMmk: string;
  receivablesMmk: string;
  upcomingMmk: string;
  inventoryNote: string;
};

export type BusinessSnapshot = {
  context: BusinessContext;
  financials: FinancialInputs;
  health: HealthStatus;
  healthSummary: string;
  metrics: Metric[];
  priority: Priority;
  risk: RiskAlert;
  insights: BriefInsight[];
  reply: string;
  memos: AgentMemo[];
  updatedAt: string | null;
};
