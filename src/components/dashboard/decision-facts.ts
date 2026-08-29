import { parseMmk } from "@/lib/brief/snapshot";
import type { BusinessSnapshot } from "@/lib/brief/types";
import { mmk } from "@/lib/ledger/types";

export function contactName(snapshot: BusinessSnapshot): string | null {
  const match = snapshot.priority.title.match(/Collect\s+(.+?)\s+first/i);
  return match?.[1]?.trim() ?? null;
}

export function overdueNamed(snapshot: BusinessSnapshot) {
  const cashflow = snapshot.insights.find((item) => item.id === "cashflow");
  for (const line of cashflow?.evidence ?? []) {
    const match = line.match(/^(.+?)\s+(\d+)\s+overdue\s+(\d+)d/i);
    if (match) {
      return {
        customer: match[1],
        amount: Number(match[2]),
        days: Number(match[3]),
      };
    }
  }
  return null;
}

export function cashVsPayable(snapshot: BusinessSnapshot) {
  const cash = parseMmk(snapshot.financials.cashMmk) ?? 0;
  const payable = parseMmk(snapshot.financials.upcomingMmk) ?? 0;
  const due = snapshot.metrics.find((metric) => metric.id === "upcoming")?.hint ?? "";
  return { cash, payable, gap: payable - cash, due };
}

export function restockLine(snapshot: BusinessSnapshot): string | null {
  const fromAction = snapshot.priority.action.match(/Do not restock[^.]+/i);
  if (fromAction) return fromAction[0].trim().replace(/\.$/, "");
  const supply = snapshot.insights.find((item) => item.id === "supply");
  if (supply?.action && /do not restock/i.test(supply.action)) {
    return supply.action.replace(/\.$/, "");
  }
  return null;
}

export function reminderText(snapshot: BusinessSnapshot) {
  const named = overdueNamed(snapshot);
  if (named) {
    return `${named.customer} — ${mmk(named.amount)} — ${named.days} days overdue`;
  }
  const who = contactName(snapshot);
  if (who) return `Follow up ${who} today.`;
  return snapshot.priority.action;
}

export function primaryActionLabel(snapshot: BusinessSnapshot) {
  const who = contactName(snapshot);
  return who ? `Contact ${who}` : "Do this today";
}
