"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { BusinessSnapshot, RiskAlert } from "@/lib/brief/types";
import {
  contactName,
  primaryActionLabel,
  reminderText,
  restockLine,
} from "./decision-facts";

export function PriorityCard({ snapshot }: { snapshot: BusinessSnapshot }) {
  const who = contactName(snapshot);

  return (
    <section id="priority" aria-labelledby="priority-label" className="space-y-3">
      <p
        id="priority-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-primary"
      >
        Today&apos;s priority
      </p>
      <h2 className="font-serif text-3xl font-semibold tracking-tight text-ink sm:text-[2.5rem] sm:leading-tight">
        {snapshot.priority.title}
      </h2>
      {who ? (
        <p className="text-sm text-muted">
          One call. Not a report. {who} is the largest overdue on this snapshot.
        </p>
      ) : (
        <p className="text-sm leading-relaxed text-muted">{snapshot.priority.reason}</p>
      )}
    </section>
  );
}

export function ActionRow({
  snapshot,
  insightId,
}: {
  snapshot: BusinessSnapshot;
  insightId: string;
}) {
  const [copied, setCopied] = useState(false);
  const reminder = reminderText(snapshot);

  async function copyContact() {
    try {
      await navigator.clipboard.writeText(reminder);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section id="action" aria-labelledby="action-label" className="space-y-2">
      <p
        id="action-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Action
      </p>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => void copyContact()}>
          {copied ? "Copied reminder" : primaryActionLabel(snapshot)}
        </Button>
        <Button href={`/insight?id=${insightId}`} variant="secondary">
          See why
        </Button>
      </div>
      <p className="text-xs text-muted">
        Copies a reminder you send yourself. The app does not message anyone.
      </p>
    </section>
  );
}

export function SecondaryHold({ snapshot }: { snapshot: BusinessSnapshot }) {
  const line = restockLine(snapshot);
  const supply = snapshot.insights.find((item) => item.id === "supply");
  if (!line && !supply) return null;

  return (
    <section
      id="also"
      aria-labelledby="also-label"
      className="rounded-[16px] border border-border bg-surface px-5 py-5"
    >
      <p
        id="also-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Also this week
      </p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">
        {line ?? supply?.action}
      </h3>
      {supply?.happening ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{supply.happening}</p>
      ) : null}
    </section>
  );
}

/** Kept for insight/records reuse. Not shown on the first screen. */
export function RiskCard({ risk, insightId }: { risk: RiskAlert; insightId: string }) {
  return (
    <section className="rounded-[12px] border border-border bg-surface p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-risk">Risk alert</p>
      <h2 className="mt-3 text-lg font-semibold">{risk.title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{risk.detail}</p>
      <a
        href={`/insight?id=${insightId}`}
        className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
      >
        Open cash insight
      </a>
    </section>
  );
}

