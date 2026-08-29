const FEATURES = [
  {
    title: "Finance",
    body: "Cash vs bills this week, and who to collect first. Health is OK, WATCH, or TIGHT — nothing else.",
  },
  {
    title: "Supply chain",
    body: "Supplier dates and slow lots. Do not restock what already sits. Do not invent stock if the shelf is empty.",
  },
  {
    title: "Resources",
    body: "Put owner time on the named follow-up. Team load is a this-week constraint — we do not hire.",
  },
  {
    title: "Analytics",
    body: "Sales vs last month and credit concentration on this snapshot only. Not a forecast. Not ads.",
  },
];

export function FeatureCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((feature, i) => (
        <article
          key={feature.title}
          className="rounded-[12px] border border-border bg-surface p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            0{i + 1}
          </p>
          <h2 className="mt-3 text-lg font-semibold">{feature.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{feature.body}</p>
        </article>
      ))}
    </section>
  );
}
