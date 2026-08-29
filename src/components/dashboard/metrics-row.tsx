import { MetricTile } from "@/components/ui/metric-tile";
import type { Metric } from "@/lib/brief/types";

export function MetricsRow({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricTile key={metric.id} metric={metric} />
      ))}
    </div>
  );
}
