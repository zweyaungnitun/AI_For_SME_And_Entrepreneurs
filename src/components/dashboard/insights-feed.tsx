import Link from "next/link";
import { HealthBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { BriefInsight } from "@/lib/brief/types";

const PILLAR: Record<string, string> = {
  cashflow: "Finance",
  supply: "Supply",
  resources: "Resources",
  analytics: "Analytics",
  market: "Market",
};

export function InsightsFeed({ insights }: { insights: BriefInsight[] }) {
  if (insights.length === 0) {
    return (
      <Card>
        <p className="text-sm text-muted">Run Analyze to generate insights.</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          AI insights
        </h2>
      </div>
      <ul className="divide-y divide-border">
        {insights.map((insight) => (
          <li key={insight.id}>
            <Link
              href={`/insight?id=${insight.id}`}
              className="flex items-start justify-between gap-4 py-3 hover:opacity-80"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {PILLAR[insight.id] ?? insight.id}
                </p>
                <p className="mt-1 font-medium text-ink">{insight.title}</p>
                <p className="mt-1 text-sm text-muted">{insight.summary}</p>
              </div>
              <HealthBadge status={insight.health} />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
