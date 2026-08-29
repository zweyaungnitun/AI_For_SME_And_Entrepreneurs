import { mmk } from "@/lib/ledger/types";
import type { BusinessSnapshot } from "@/lib/brief/types";
import { cashVsPayable, overdueNamed } from "./decision-facts";

export function WhyEvidence({ snapshot }: { snapshot: BusinessSnapshot }) {
  const { cash, payable, gap, due } = cashVsPayable(snapshot);
  const named = overdueNamed(snapshot);
  const short = gap > 0;

  return (
    <section id="why" aria-labelledby="why-label" className="space-y-3">
      <h2
        id="why-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Why
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        <EvidenceTile
          label="Cash on hand"
          value={mmk(cash)}
          hint="Available now"
          emphasize={short}
        />
        <EvidenceTile
          label="Payable"
          value={mmk(payable)}
          hint={due || "Due this week"}
          emphasize={short}
        />
        <EvidenceTile
          label={named?.customer ?? "Largest overdue"}
          value={named ? mmk(named.amount) : "—"}
          hint={named ? `${named.days} days overdue` : "No overdue named"}
          emphasize
        />
      </div>
      {short ? (
        <p className="text-sm font-medium text-risk">
          Short {mmk(gap)} of the bill
          {named ? ` — ${named.customer} covers ${mmk(named.amount)} of that gap.` : "."}
        </p>
      ) : (
        <p className="text-sm text-muted">{snapshot.priority.reason}</p>
      )}
    </section>
  );
}

function EvidenceTile({
  label,
  value,
  hint,
  emphasize,
}: {
  label: string;
  value: string;
  hint: string;
  emphasize?: boolean;
}) {
  return (
    <article
      className={
        emphasize
          ? "rounded-[12px] border border-ink/10 bg-surface px-4 py-4"
          : "rounded-[12px] border border-border bg-surface px-4 py-4"
      }
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 font-serif text-2xl font-semibold tabular-nums tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </article>
  );
}
