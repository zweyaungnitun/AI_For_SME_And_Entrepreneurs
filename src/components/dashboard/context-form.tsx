"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { STAGES } from "@/lib/agents/defaults";
import type { BusinessContext } from "@/lib/agents/types";
import type { FinancialInputs } from "@/lib/brief/types";

export function ContextForm({
  context,
  financials,
  onContext,
  onFinancials,
}: {
  context: BusinessContext;
  financials: FinancialInputs;
  onContext: (patch: Partial<BusinessContext>) => void;
  onFinancials: (patch: Partial<FinancialInputs>) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold">Business / venture</span>
        <span className="text-xs text-muted">{open ? "Hide" : "Edit"}</span>
      </button>
      {open ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Business name">
            <input
              className={inputClass}
              value={context.name}
              onChange={(e) => onContext({ name: e.target.value })}
            />
          </Field>
          <Field label="Industry">
            <input
              className={inputClass}
              value={context.industry}
              onChange={(e) => onContext({ industry: e.target.value })}
            />
          </Field>
          <Field label="Location">
            <input
              className={inputClass}
              value={context.location}
              onChange={(e) => onContext({ location: e.target.value })}
            />
          </Field>
          <Field label="Stage">
            <select
              className={inputClass}
              value={context.stage}
              onChange={(e) =>
                onContext({ stage: e.target.value as BusinessContext["stage"] })
              }
            >
              {STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Team size">
            <input
              className={inputClass}
              type="number"
              min={1}
              value={context.teamSize}
              onChange={(e) => onContext({ teamSize: Number(e.target.value) || 1 })}
            />
          </Field>
          <Field label="Cash (MMK)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={financials.cashMmk}
              onChange={(e) => onFinancials({ cashMmk: e.target.value })}
            />
          </Field>
          <Field label="Receivables (MMK)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={financials.receivablesMmk}
              onChange={(e) => onFinancials({ receivablesMmk: e.target.value })}
            />
          </Field>
          <Field label="Upcoming expenses (MMK)">
            <input
              className={inputClass}
              inputMode="numeric"
              value={financials.upcomingMmk}
              onChange={(e) => onFinancials({ upcomingMmk: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="This week's challenge">
              <textarea
                className={`${inputClass} min-h-20`}
                value={context.challenge}
                onChange={(e) => onContext({ challenge: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Inventory note (optional)">
              <input
                className={inputClass}
                value={financials.inventoryNote}
                onChange={(e) => onFinancials({ inventoryNote: e.target.value })}
              />
            </Field>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">
          {context.name} · {context.industry} · {context.location}
        </p>
      )}
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-xs font-medium text-muted">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-primary";
