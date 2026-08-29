import { cn } from "@/lib/cn";
import type { Metric } from "@/lib/brief/types";

const toneBar: Record<Metric["tone"], string> = {
  ok: "bg-ok",
  watch: "bg-watch",
  risk: "bg-risk",
  neutral: "bg-border",
};

export function MetricTile({ metric }: { metric: Metric }) {
  return (
    <article className="relative overflow-hidden rounded-[12px] border border-border bg-surface p-4">
      <span
        className={cn("absolute inset-y-0 left-0 w-1", toneBar[metric.tone])}
        aria-hidden="true"
      />
      <p className="pl-3 text-xs font-medium uppercase tracking-wide text-muted">
        {metric.label}
      </p>
      <p className="mt-1 pl-3 text-lg font-semibold tracking-tight text-ink">
        {metric.value}
      </p>
      {metric.hint ? (
        <p className="mt-1 pl-3 text-xs text-muted">{metric.hint}</p>
      ) : null}
    </article>
  );
}
