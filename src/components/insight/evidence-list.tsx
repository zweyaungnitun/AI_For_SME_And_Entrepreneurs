import { Card } from "@/components/ui/card";

export function EvidenceList({ items }: { items: string[] }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Supporting evidence
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
