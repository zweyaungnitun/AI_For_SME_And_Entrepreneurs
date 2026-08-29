import Link from "next/link";
import { HealthBadge } from "@/components/ui/badge";
import type { BriefInsight } from "@/lib/brief/types";

export function InsightHeader({ insight }: { insight: BriefInsight }) {
  const date = new Date(insight.generatedAt);
  const when = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

  return (
    <header className="space-y-3">
      <nav className="text-sm text-muted">
        <Link href="/dashboard" className="hover:text-ink">
          Dashboard
        </Link>
        <span className="mx-2">→</span>
        <span className="text-ink">Insight</span>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
          {insight.title}
        </h1>
        <HealthBadge status={insight.health} />
      </div>
      {when ? <p className="text-xs text-muted">Generated {when}</p> : null}
    </header>
  );
}
