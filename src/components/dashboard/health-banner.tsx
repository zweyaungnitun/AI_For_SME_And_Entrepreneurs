import { HealthBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { HealthStatus } from "@/lib/brief/types";

export function HealthBanner({
  status,
  summary,
}: {
  status: HealthStatus;
  summary: string;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Business health
        </p>
        <HealthBadge status={status} />
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink">{summary}</p>
    </Card>
  );
}
