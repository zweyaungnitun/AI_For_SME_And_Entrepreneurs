import { Card } from "@/components/ui/card";
import type { BriefInsight } from "@/lib/brief/types";

const SECTIONS: { key: keyof Pick<BriefInsight, "happening" | "wrong" | "matters" | "action" | "why">; label: string }[] = [
  { key: "happening", label: "What's happening" },
  { key: "wrong", label: "What is wrong" },
  { key: "matters", label: "Why it matters" },
  { key: "action", label: "What to do today" },
  { key: "why", label: "Why this action" },
];

export function AnalysisSections({ insight }: { insight: BriefInsight }) {
  return (
    <div className="space-y-3">
      {SECTIONS.map((section) => (
        <Card key={section.key} className={section.key === "action" ? "border-primary/20 bg-[#eff6ff]" : undefined}>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {section.label}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink">{insight[section.key]}</p>
        </Card>
      ))}
    </div>
  );
}
