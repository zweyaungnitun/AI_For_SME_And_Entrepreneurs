import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk, type Ledger } from "@/lib/ledger/types";
import type { BusinessContext, ToolResult } from "@/lib/agents/types";
import { searchKnowledge } from "@/lib/db/knowledge";

function timed<T>(name: string, input: Record<string, unknown>, run: () => T): ToolResult {
  const start = Date.now();
  return { name, input, output: run(), ms: Date.now() - start };
}

export async function runTool(
  name: string,
  _context: BusinessContext,
  message: string,
  ledger: Ledger,
  shopId?: string,
): Promise<ToolResult> {
  const snap = analyzeLedger(ledger);

  if (name === "cash_pressure") {
    return timed(name, { cash: ledger.cashOnHand, payables: snap.nearTotal }, () => ({
      shopType: ledger.shopType,
      cash: ledger.cashOnHand,
      payables: snap.nearTotal,
      gap: snap.cashGap,
      tight: snap.tight,
      flag: snap.tight ? "TIGHT" : "OK",
      upcoming: snap.near.map((e) => ({
        name: e.name,
        amount: e.amount,
        dueInDays: e.dueInDays,
      })),
      why: snap.tight
        ? `Payables ${mmk(snap.nearTotal)} exceed cash ${mmk(ledger.cashOnHand)}.`
        : `Cash ${mmk(ledger.cashOnHand)} covers payables ${mmk(snap.nearTotal)}.`,
    }));
  }

  if (name === "receivable_rank") {
    return timed(name, { count: ledger.receivables.length }, () => ({
      shopType: ledger.shopType,
      ranked: snap.ranked.map((r) => ({
        customer: r.customer,
        amount: r.amount,
        overdueDays: r.overdueDays,
        status: r.status,
      })),
      top: snap.topCustomer
        ? {
            customer: snap.topCustomer.customer,
            amount: snap.topCustomer.amount,
            overdueDays: snap.topCustomer.overdueDays,
          }
        : null,
      overdueTotal: snap.overdueTotal,
    }));
  }

  if (name === "slow_stock") {
    return timed(name, { skus: ledger.inventory.length }, () => ({
      shopType: ledger.shopType,
      applicable: ledger.inventory.length > 0,
      items: snap.slow.map((s) => ({
        sku: s.sku,
        units: s.units,
        soldThisMonth: s.soldThisMonth,
        tiedUp: s.units * s.unitCost,
      })),
      tiedUpTotal: snap.tiedInSlow,
    }));
  }

  if (name === "extract_note") {
    return timed(name, { message: message.slice(0, 240) }, () => heuristicExtract(message));
  }

  if (name === "search_knowledge") {
    const start = Date.now();
    const output = await searchKnowledge(message, shopId ?? "daw-hla");
    return {
      name,
      input: { q: message.slice(0, 120), shopId: shopId ?? "daw-hla" },
      output,
      ms: Date.now() - start,
    };
  }

  return timed(name, {}, () => ({ skipped: true, reason: "unknown tool" }));
}

export type ExtractedNote = {
  parsed: boolean;
  customer?: string;
  amount?: number;
  type?: "receivable";
  due?: string;
  status?: "pending" | "overdue";
  note: string;
};

function heuristicExtract(message: string): ExtractedNote {
  const lakh = message.match(/(\d+)\s*(သိန်း|lakhs?)/i);
  const plain = message.match(/(\d[\d,]*)\s*(MMK|kyat)?/i);
  let amount: number | undefined;
  if (lakh) amount = Number(lakh[1]) * 100_000;
  else if (plain) {
    const n = Number(plain[1].replace(/,/g, ""));
    if (n >= 1000) amount = n;
  }

  const names: Array<[RegExp, string]> = [
    [/ko\s*min/i, "Ko Min"],
    [/ma\s*su/i, "Ma Su"],
    [/u\s*myint/i, "U Myint"],
    [/daw\s*kyi/i, "Daw Kyi"],
    [/bride\s*su/i, "Bride Su"],
    [/maung\s*maung|မောင်မောင်/i, "Maung Maung"],
  ];
  const hit = names.find(([re]) => re.test(message));
  const customer = hit?.[1];

  if (customer && amount) {
    return {
      parsed: true,
      customer,
      amount,
      type: "receivable",
      due: /friday|သောကြာ/i.test(message) ? "Friday" : undefined,
      status: /overdue|ကျော်/i.test(message) ? "overdue" : "pending",
      note: "Parsed from the owner note. Amount used only because it appeared in the message.",
    };
  }

  return {
    parsed: false,
    note: "No structured entry. Need a name and an amount in MMK.",
  };
}

export async function runTools(
  names: string[],
  context: BusinessContext,
  message: string,
  ledger: Ledger,
  shopId?: string,
) {
  return Promise.all(names.map((name) => runTool(name, context, message, ledger, shopId)));
}
