import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          For Myanmar SME owners
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
          Your shop already has the data. You still need today&apos;s decision.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          SME Copilot turns cash, credit, stock, and bills into one answer: what
          matters, why it matters, and what to do next.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href="/dashboard">Open dashboard</Button>
          <Button href="/voice" variant="secondary">
            Try voice
          </Button>
        </div>
      </div>
      <div className="rounded-[12px] border border-border bg-[#eff6ff] p-5 text-sm leading-relaxed text-ink">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">The decision gap</p>
        <p className="mt-3">
          Sales, expenses, inventory, and receivables live in notebooks and chats.
          The owner still has to guess: who to call, what not to restock, whether
          Friday&apos;s supplier run is safe.
        </p>
        <p className="mt-3 font-medium">
          Tell me what matters, why it matters, and what I should do next.
        </p>
      </div>
    </section>
  );
}
