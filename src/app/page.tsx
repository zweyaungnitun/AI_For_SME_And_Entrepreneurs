import Link from "next/link";
import { SiteHeader } from "@/components/SiteChrome";

const AGENTS = [
  {
    name: "Conductor",
    role: "Routes the ask, sequences specialists, writes the brief.",
  },
  {
    name: "Strategy",
    role: "Beachhead customer, offer, and a 90-day wedge.",
  },
  {
    name: "Finance",
    role: "Price, contribution, and a cash rule the team can keep.",
  },
  {
    name: "Market",
    role: "Who already pays, what they compare you to, what proof lands.",
  },
  {
    name: "Growth",
    role: "Owned channels and a conversion event — not a media plan.",
  },
  {
    name: "Ops",
    role: "Cadence, roles, and delivery for a 2–8 person team.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grain pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 py-8 sm:px-10">
        <SiteHeader active="home" />

        <section className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-8">
            <p className="text-xs uppercase tracking-[0.28em] text-copper">
              Multi-agent system · Next.js 15
            </p>
            <h1 className="font-serif text-5xl leading-[1.05] text-balance sm:text-7xl">
              Counsel for the business you are actually running.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-parchment-dim">
              Foundry is a full-stack crew: a conductor plus five specialists.
              Ask like a founder. Get a plan you can execute this week — strategy,
              money, customers, demand, and operations in one pass.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/console"
                className="rounded-full bg-parchment px-6 py-3 text-sm font-medium text-ink hover:bg-white"
              >
                Talk to the crew
              </Link>
              <a
                href="#crew"
                className="rounded-full border border-[var(--line-strong)] px-6 py-3 text-sm hover:border-parchment-dim"
              >
                Meet the agents
              </a>
            </div>
          </div>

          <aside className="panel p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.22em] text-sage">Live routing</p>
            <ol className="mt-6 space-y-4 font-mono text-sm text-parchment-dim">
              <li>01  Conductor reads the ask</li>
              <li>02  Specialists run tools in parallel sequence</li>
              <li>03  Memos stream into the trace</li>
              <li>04  Conductor synthesizes a founder brief</li>
            </ol>
            <p className="mt-8 text-sm leading-relaxed text-parchment-dim">
              Works in demo mode with no API key. Point{" "}
              <code className="text-parchment">OPENAI_BASE_URL</code> at any
              OpenAI-compatible model when you want live LLM counsel.
            </p>
          </aside>
        </section>

        <section id="crew" className="space-y-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-serif text-3xl sm:text-4xl">The crew</h2>
            <p className="max-w-sm text-sm text-parchment-dim">
              One agent per concern. Add another by dropping a file in{" "}
              <code>src/lib/agents/specialists</code>.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AGENTS.map((agent) => (
              <article key={agent.name} className="panel p-6">
                <h3 className="font-serif text-2xl">{agent.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-parchment-dim">
                  {agent.role}
                </p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] py-10 text-sm text-parchment-dim">
          <p>Foundry · AI for SMEs and entrepreneurs</p>
          <p>App Router · streaming crew · AGENTS.md frame</p>
        </footer>
      </div>
    </div>
  );
}
