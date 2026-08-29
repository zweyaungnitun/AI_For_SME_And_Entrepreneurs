import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Priority, RiskAlert } from "@/lib/brief/types";

export function PriorityCard({
  priority,
  insightId,
}: {
  priority: Priority;
  insightId: string;
}) {
  return (
    <Card className="border-primary/20 bg-[#eff6ff]">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Today&apos;s priority
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{priority.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{priority.reason}</p>
      <p className="mt-3 text-sm font-medium text-ink">{priority.action}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button href={`/insight?id=${insightId}`} size="sm">
          See why
        </Button>
        <Button href="/voice" variant="secondary" size="sm">
          Ask in voice
        </Button>
      </div>
    </Card>
  );
}

export function RiskCard({ risk, insightId }: { risk: RiskAlert; insightId: string }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-risk">Risk alert</p>
      <h2 className="mt-3 text-lg font-semibold">{risk.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{risk.detail}</p>
      <Link
        href={`/insight?id=${insightId}`}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Open cash insight
      </Link>
    </Card>
  );
}
