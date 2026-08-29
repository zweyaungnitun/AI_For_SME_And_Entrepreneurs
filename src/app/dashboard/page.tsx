"use client";

import { useBrief } from "@/components/brief/brief-provider";
import { ContextForm } from "@/components/dashboard/context-form";
import { HealthBanner } from "@/components/dashboard/health-banner";
import { InsightsFeed } from "@/components/dashboard/insights-feed";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { PriorityCard, RiskCard } from "@/components/dashboard/priority-card";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const {
    snapshot,
    status,
    error,
    mode,
    streamingReply,
    setContext,
    setFinancials,
    analyze,
  } = useBrief();

  const running = status === "running";
  const primaryInsightId = snapshot.insights[0]?.id ?? "cashflow";

  return (
    <AppShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" suppressHydrationWarning>
              {greeting()}, {snapshot.context.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {snapshot.context.location} · {running ? "Crew is analyzing…" : `${mode} mode`}
            </p>
          </div>
          <Button onClick={() => void analyze()} disabled={running}>
            {running ? "Analyzing…" : "Analyze now"}
          </Button>
        </div>

        {error ? (
          <Card className="border-risk/30 bg-[#fef2f2] text-sm text-risk">{error}</Card>
        ) : null}

        {running && streamingReply ? (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Live brief
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {streamingReply}
            </p>
          </Card>
        ) : null}

        <HealthBanner status={snapshot.health} summary={snapshot.healthSummary} />
        <MetricsRow metrics={snapshot.metrics} />

        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <PriorityCard priority={snapshot.priority} insightId={primaryInsightId} />
          <RiskCard risk={snapshot.risk} insightId={primaryInsightId} />
        </div>

        <InsightsFeed insights={snapshot.insights} />
        <ContextForm
          context={snapshot.context}
          financials={snapshot.financials}
          onContext={setContext}
          onFinancials={setFinancials}
        />
      </div>
    </AppShell>
  );
}
