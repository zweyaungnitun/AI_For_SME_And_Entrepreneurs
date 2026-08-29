const FEATURES = [
  {
    title: "Analyze",
    body: "See business health in one badge — OK, WATCH, or TIGHT — from the numbers you already have.",
  },
  {
    title: "Detect risk",
    body: "Spot cash pressure, overdue credit, and slow stock before they become a missed supplier payment.",
  },
  {
    title: "Get today's priority",
    body: "One recommended action, with the evidence behind it. Not a dashboard of charts to interpret.",
  },
];

export function FeatureCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
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
