export function ProductPreview() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">The first screen is a decision</h2>
        <p className="mt-1 text-sm text-muted">
          Health, one priority, the numbers that prove it, and the action — in that order.
        </p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(17,24,39,0.08)]">
        <div className="flex items-center gap-2 border-b border-border bg-[#f3f4f6] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#fecaca]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fde68a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#bbf7d0]" />
          <span className="ml-3 text-xs text-muted">today · Daw Hla&apos;s Dry Goods</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="rounded-[16px] border border-risk/25 bg-[#fef2f2] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Business health
            </p>
            <p className="mt-1 font-serif text-4xl font-semibold text-risk">TIGHT</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Today&apos;s priority
            </p>
            <p className="mt-2 font-serif text-2xl font-semibold">Collect Ko Min first</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <PreviewFact label="Cash" value="420,000" />
            <PreviewFact label="Payable" value="500,000" />
            <PreviewFact label="Ko Min" value="200,000" />
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-white">
              Contact Ko Min
            </span>
            <span className="rounded-full border border-border px-4 py-2 text-xs font-medium">
              See why
            </span>
          </div>
          <p className="text-sm text-muted">Also this week: Do not restock Product A</p>
        </div>
      </div>
    </section>
  );
}

function PreviewFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-border px-2 py-3">
      <p className="text-[10px] uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
