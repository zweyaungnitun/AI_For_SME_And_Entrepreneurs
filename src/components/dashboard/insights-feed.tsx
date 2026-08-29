import Link from "next/link";
import { HealthBadge } from "@/components/ui/badge";
import type { BriefInsight } from "@/lib/brief/types";

const PILLAR: Record<string, string> = {
  cashflow: "Finance",
  supply: "Supply",
  resources: "Resources",
  analytics: "Analytics",
  market: "Market",
};

export function InsightsFeed({
  insights,
  heading = "More from this week",
}: {
  insights: BriefInsight[];
  heading?: string;
}) {
  if (insights.length === 0) {
    return (
      <section className="rounded-[12px] border border-border bg-surface p-5">
        <p className="text-sm text-muted">Run Analyze to generate insights.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {heading ? (
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {heading}
        </h2>
      ) : null}
      <ul className="divide-y divide-border rounded-[12px] border border-border bg-surface">
        {insights.map((insight) => (
          <li key={insight.id}>
            <Link
              href={`/insight?id=${insight.id}`}
              className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[#f8f9fb]"
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
    </section>
  );
}
