export function ProductPreview() {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">See the week at a glance</h2>
          <p className="mt-1 text-sm text-muted">
            Health, cash, sales pulse, and the one call that closes the gap.
          </p>
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_12px_40px_rgba(17,24,39,0.08)]">
        <div className="flex items-center gap-2 border-b border-border bg-[#f3f4f6] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#fecaca]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fde68a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#bbf7d0]" />
          <span className="ml-3 text-xs text-muted">dashboard · Daw Hla&apos;s Dry Goods</span>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <div className="sm:col-span-3 flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-[#fffbeb] px-4 py-3">
            <span className="text-sm font-medium">Business health</span>
            <span className="rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-risk">
              TIGHT
            </span>
          </div>
          <PreviewMetric label="Cash" value="420,000" />
          <PreviewMetric label="Receivables" value="350,000" />
          <PreviewMetric label="Bills due" value="500,000" />
          <div className="sm:col-span-3 rounded-[12px] border border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Today&apos;s priority
            </p>
            <p className="mt-2 font-semibold">Collect Ko Min first</p>
            <p className="mt-1 text-sm text-muted">
              200,000 MMK overdue 7 days. Do not restock Product A.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[12px] border border-border p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-semibold">{value} MMK</p>
    </div>
  );
}
