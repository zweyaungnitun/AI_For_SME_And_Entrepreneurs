import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          For Myanmar SMEs and entrepreneurs
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          A practical partner for financial decisions, running the business, and growing this week.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          One brief from the numbers you already have: cash, suppliers, team time, and this
          week&apos;s pulse. Not a loan score. Not a 90-day deck.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/enter">Open a workspace</Button>
          <Button href="/enter?as=daw-hla" variant="secondary">
            Daw Hla cash demo
          </Button>
        </div>
      </div>
      <div className="rounded-[12px] border border-border bg-[#eff6ff] p-5 text-sm leading-relaxed text-ink">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">The decision gap</p>
        <p className="mt-3">
          Sales, bills, credit, and stock live in notebooks and chats. The owner still has to
          guess: who to call, what not to restock, whether the supplier run is safe.
        </p>
        <p className="mt-3 font-medium">
          Helps organize numbers for a discussion. Never “approved” or “you qualify.”
        </p>
      </div>
    </section>
  );
}
