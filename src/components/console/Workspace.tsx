"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/SiteChrome";
import { DEFAULT_CONTEXT, STAGES } from "@/lib/agents/defaults";
import type {
  AgentEvent,
  AgentId,
  AgentMemo,
  BusinessContext,
} from "@/lib/agents/types";

export type CrewMember = {
  id: AgentId;
  name: string;
  title: string;
  accent: string;
};

type Status = "idle" | "running" | "done";

type TraceItem =
  | { kind: "plan"; agents: AgentId[]; rationale: string }
  | { kind: "start"; agentId: AgentId; name: string }
  | { kind: "tool"; agentId: AgentId; name: string }
  | { kind: "memo"; memo: AgentMemo };

const PROMPTS = [
  "Give me a 90-day plan to get the first 100 customers.",
  "What should we charge, and what cash rule should we keep?",
  "Who is the beachhead customer in our city, and how do we reach them this month?",
];

export function Workspace({ crew }: { crew: CrewMember[] }) {
  const [context, setContext] = useState<BusinessContext>(DEFAULT_CONTEXT);
  const [showContext, setShowContext] = useState(false);
  const [input, setInput] = useState(PROMPTS[0]);
  const [sessionId, setSessionId] = useState<string>();
  const [status, setStatus] = useState<Status>("idle");
  const [mode, setMode] = useState<"demo" | "llm">("demo");
  const [active, setActive] = useState<AgentId[]>([]);
  const [doneIds, setDoneIds] = useState<AgentId[]>([]);
  const [reply, setReply] = useState("");
  const [trace, setTrace] = useState<TraceItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const runningLabel = useMemo(() => {
    if (status !== "running") return mode === "llm" ? "Live model" : "Demo crew";
    if (active.length === 0) return "Conductor planning…";
    return `${active[active.length - 1]} running`;
  }, [status, active, mode]);

  async function run(message: string) {
    const text = message.trim();
    if (!text || status === "running") return;
    setStatus("running");
    setError(null);
    setReply("");
    setTrace([]);
    setActive([]);
    setDoneIds([]);

    const res = await fetch("/api/agents/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, sessionId, context }),
    });

    if (!res.ok || !res.body) {
      setError("The crew could not start.");
      setStatus("idle");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split("\n\n");
      buffer = chunks.pop() ?? "";
      for (const chunk of chunks) {
        const line = chunk.split("\n").find((l) => l.startsWith("data: "));
        if (!line) continue;
        try {
          const event = JSON.parse(line.slice(6)) as AgentEvent | { type: "error"; error: string };
          if (event.type === "error") {
            setError(event.error);
            continue;
          }
          applyEvent(event);
        } catch {
          /* ignore partial JSON */
        }
      }
    }
    setStatus("done");
    setActive([]);
  }

  function applyEvent(event: AgentEvent) {
    if (event.type === "session") {
      setSessionId(event.sessionId);
      setMode(event.mode);
    }
    if (event.type === "plan") {
      setTrace((t) => [
        ...t,
        { kind: "plan", agents: event.agents, rationale: event.rationale },
      ]);
    }
    if (event.type === "agent_start") {
      setActive((ids) => [...ids, event.agentId]);
      setTrace((t) => [
        ...t,
        { kind: "start", agentId: event.agentId, name: event.name },
      ]);
    }
    if (event.type === "tool") {
      setTrace((t) => [
        ...t,
        { kind: "tool", agentId: event.agentId, name: event.tool.name },
      ]);
    }
    if (event.type === "agent_end") {
      setDoneIds((ids) => [...ids, event.memo.agentId]);
      setTrace((t) => [...t, { kind: "memo", memo: event.memo }]);
    }
    if (event.type === "token") {
      setReply((r) => r + event.text);
    }
  }

  function patch<K extends keyof BusinessContext>(key: K, value: BusinessContext[K]) {
    setContext((c) => ({ ...c, [key]: value }));
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-5 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-90">
            <BrandMark size="sm" />
          </Link>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-parchment-dim">
            <span
              className={`h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-copper-bright" : "bg-sage"}`}
            />
            {runningLabel}
          </div>
        </header>

        <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_320px]">
          <aside className="panel p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-parchment-dim">Crew</p>
            <ul className="mt-4 space-y-2">
              {crew.map((agent) => {
                const isOn = active.includes(agent.id);
                const isDone = doneIds.includes(agent.id);
                return (
                  <li
                    key={agent.id}
                    className="flex items-start gap-3 rounded-xl px-2 py-2"
                    style={{
                      background: isOn ? "rgba(196,98,45,0.12)" : undefined,
                    }}
                  >
                    <span
                      className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background: isOn || isDone ? agent.accent : "transparent",
                        boxShadow: `0 0 0 1px ${agent.accent}`,
                      }}
                    />
                    <span>
                      <span className="block text-sm">{agent.name}</span>
                      <span className="block text-xs text-parchment-dim">
                        {agent.title}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </aside>

          <main className="panel flex min-h-[70vh] flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-5 py-4">
              <div>
                <p className="font-serif text-xl">{context.name}</p>
                <p className="text-xs text-parchment-dim">
                  {context.industry} · {context.location} · {context.stage}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowContext((v) => !v)}
                className="text-xs uppercase tracking-[0.16em] text-copper hover:text-copper-bright"
              >
                {showContext ? "Hide brief" : "Edit brief"}
              </button>
            </div>

            {showContext ? (
              <div className="grid gap-3 border-b border-[var(--line)] px-5 py-4 sm:grid-cols-2">
                <Field label="Business" value={context.name} onChange={(v) => patch("name", v)} />
                <Field
                  label="Industry"
                  value={context.industry}
                  onChange={(v) => patch("industry", v)}
                />
                <label className="block text-xs text-parchment-dim">
                  Stage
                  <select
                    className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-ink px-3 py-2 text-sm text-parchment"
                    value={context.stage}
                    onChange={(e) =>
                      patch("stage", e.target.value as BusinessContext["stage"])
                    }
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Location"
                  value={context.location}
                  onChange={(v) => patch("location", v)}
                />
                <Field
                  label="Team size"
                  value={String(context.teamSize)}
                  onChange={(v) => patch("teamSize", Number(v) || 1)}
                />
                <label className="block text-xs text-parchment-dim sm:col-span-2">
                  Challenge
                  <textarea
                    className="mt-1 min-h-20 w-full rounded-lg border border-[var(--line-strong)] bg-ink px-3 py-2 text-sm text-parchment"
                    value={context.challenge}
                    onChange={(e) => patch("challenge", e.target.value)}
                  />
                </label>
              </div>
            ) : null}

            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
              {!reply && status === "idle" ? (
                <div className="space-y-4">
                  <p className="font-serif text-3xl leading-tight">
                    Ask the crew the way you would ask a sharp operator.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROMPTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setInput(p)}
                        className="rounded-full border border-[var(--line-strong)] px-3 py-1.5 text-left text-xs text-parchment-dim hover:text-parchment"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {reply ? (
                <article className="whitespace-pre-wrap text-[15px] leading-7">
                  {reply}
                </article>
              ) : null}

              {error ? (
                <p className="text-sm text-copper-bright">{error}</p>
              ) : null}
            </div>

            <form
              className="border-t border-[var(--line)] p-4"
              onSubmit={(e) => {
                e.preventDefault();
                void run(input);
              }}
            >
              <div className="flex gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  className="flex-1 resize-none rounded-xl border border-[var(--line-strong)] bg-ink px-4 py-3 text-sm outline-none focus:border-copper"
                  placeholder="What do you need the crew to decide?"
                />
                <button
                  type="submit"
                  disabled={status === "running"}
                  className="self-end rounded-xl bg-parchment px-5 py-3 text-sm font-medium text-ink disabled:opacity-50"
                >
                  {status === "running" ? "Running" : "Run crew"}
                </button>
              </div>
            </form>
          </main>

          <aside className="panel max-h-[80vh] overflow-y-auto p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-parchment-dim">
              Trace
            </p>
            <ol className="mt-4 space-y-3 font-mono text-[11px] leading-relaxed text-parchment-dim">
              {trace.length === 0 ? (
                <li>Waiting for a run…</li>
              ) : null}
              {trace.map((item, i) => (
                <li key={`${item.kind}-${i}`}>
                  {item.kind === "plan" ? (
                    <span>
                      plan → {item.agents.join(", ")}
                      <span className="mt-1 block normal-case font-sans text-xs">
                        {item.rationale}
                      </span>
                    </span>
                  ) : null}
                  {item.kind === "start" ? (
                    <span>start {item.name.toLowerCase()}</span>
                  ) : null}
                  {item.kind === "tool" ? (
                    <span>
                      tool {item.agentId}/{item.name}
                    </span>
                  ) : null}
                  {item.kind === "memo" ? (
                    <span>
                      memo {item.memo.name.toLowerCase()} · {item.memo.ms}ms
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-xs text-parchment-dim">
      {label}
      <input
        className="mt-1 w-full rounded-lg border border-[var(--line-strong)] bg-ink px-3 py-2 text-sm text-parchment"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
