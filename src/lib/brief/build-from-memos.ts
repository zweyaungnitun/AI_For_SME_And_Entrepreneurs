import type { AgentMemo } from "@/lib/agents/types";
import { DEMO_SNAPSHOT } from "./demo-data";
import type { BriefInsight, BusinessSnapshot, HealthStatus } from "./types";

function firstLine(text: string) {
  return text.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
}

function detectHealth(blob: string, fallback: HealthStatus): HealthStatus {
  const t = blob.toLowerCase();
  if (/\b(critical|cannot pay|insolvent|runway is 0)\b/.test(t)) return "RISK";
  if (/\b(overdue|tight|pressure|risk|short of|gap|watch)\b/.test(t)) return "WATCH";
  if (/\b(healthy|on track|stable|ok)\b/.test(t)) return "OK";
  return fallback;
}

function insightIdFor(agentId: AgentMemo["agentId"]) {
  if (agentId === "finance") return "cashflow";
  if (agentId === "ops") return "inventory";
  if (agentId === "market" || agentId === "growth") return "receivables";
  return agentId;
}

function insightFromMemo(
  memo: AgentMemo,
  health: HealthStatus,
  generatedAt: string,
  fallback: BriefInsight,
): BriefInsight {
  const bullets = memo.bullets.filter(Boolean);
  return {
    id: insightIdFor(memo.agentId),
    title: `${memo.name}: ${firstLine(memo.summary).slice(0, 72) || memo.name}`,
    summary: memo.summary,
    happening: memo.summary,
    wrong: bullets[0] ?? fallback.wrong,
    matters: bullets[1] ?? fallback.matters,
    action: bullets[2] ?? fallback.action,
    why: bullets[3] ?? memo.summary,
    evidence: bullets.length ? bullets : fallback.evidence,
    health,
    generatedAt,
  };
}

export function buildBriefFromMemos(
  memos: AgentMemo[],
  reply: string,
  previous: BusinessSnapshot,
): BusinessSnapshot {
  const generatedAt = new Date().toISOString();
  const blob = `${reply}\n${memos.map((m) => `${m.summary}\n${m.bullets.join("\n")}`).join("\n")}`;
  const health = detectHealth(blob, previous.health);
  const specialistMemos = memos.filter((m) => m.agentId !== "conductor");

  const insights: BriefInsight[] =
    specialistMemos.length > 0
      ? specialistMemos.map((memo, i) =>
          insightFromMemo(
            memo,
            health,
            generatedAt,
            previous.insights[i] ?? DEMO_SNAPSHOT.insights[0],
          ),
        )
      : previous.insights.map((insight) => ({ ...insight, health, generatedAt }));

  const finance = specialistMemos.find((m) => m.agentId === "finance");
  const summary = firstLine(reply) || previous.healthSummary;

  return {
    ...previous,
    health,
    healthSummary: summary,
    priority: {
      title:
        finance?.bullets[0] ??
        previous.priority.title,
      reason: finance?.summary ?? previous.priority.reason,
      action:
        finance?.bullets[2] ??
        previous.priority.action,
    },
    risk: {
      title: health === "OK" ? "No urgent cash flag" : previous.risk.title,
      detail: finance?.summary ?? previous.risk.detail,
    },
    insights,
    reply,
    memos,
    updatedAt: generatedAt,
  };
}
