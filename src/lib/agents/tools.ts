import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk, type Ledger } from "@/lib/ledger/types";
import type { BusinessContext, ToolResult } from "@/lib/agents/types";
import { searchKnowledge } from "@/lib/db/knowledge";
import { DEFAULT_SHOP_ID } from "@/lib/sme/catalog";

function timed<T>(name: string, input: Record<string, unknown>, run: () => T): ToolResult {
  const start = Date.now();
  return { name, input, output: run(), ms: Date.now() - start };
}

export async function runTool(
  name: string,
  context: BusinessContext,
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

  if (name === "supplier_pressure") {
    return timed(name, { payables: snap.near.length, skus: ledger.inventory.length }, () => ({
      shopType: ledger.shopType,
      tight: snap.tight,
      suppliers: snap.near.map((e) => ({
        name: e.name,
        amount: e.amount,
        dueInDays: e.dueInDays,
      })),
      slowLots: snap.slow.map((s) => s.sku),
      constraint: snap.tight
        ? "Do not place a new purchase order until overdue cash is in or a payable is delayed."
        : "Reorder only what moved. Do not add slow lots.",
    }));
  }

  if (name === "resource_load") {
    return timed(
      name,
      { teamSize: context.teamSize, overdue: snap.overdue.length },
      () => {
        const collectionLoad = snap.overdue.length;
        const strained = snap.tight && context.teamSize <= 2;
        return {
          teamSize: context.teamSize,
          overdueCount: collectionLoad,
          payableCount: snap.near.length,
          inventoryLines: ledger.inventory.length,
          tight: snap.tight,
          strained,
          constraint: "Do not hire. Put owner time on the named collection or delay the payable.",
          why: strained
            ? `Team of ${context.teamSize} while cash is TIGHT and ${collectionLoad} overdue ${collectionLoad === 1 ? "party" : "parties"} sit.`
            : `Team of ${context.teamSize}. Collection load is ${collectionLoad}.`,
        };
      },
    );
  }

  if (name === "business_pulse") {
    return timed(name, { sales: ledger.monthSales, last: ledger.lastMonthSales }, () => ({
      salesChangePct: snap.salesChange,
      cashGap: snap.cashGap,
      tight: snap.tight,
      recvConcentrationPct: snap.recvConcentration,
      topShare: snap.topCustomer
        ? { customer: snap.topCustomer.customer, amount: snap.topCustomer.amount }
        : null,
      slowSkuCount: snap.slow.length,
      note: "This snapshot only. Not a forecast. Not a growth guarantee.",
    }));
  }

  if (name === "extract_note") {
    return timed(name, { message: message.slice(0, 240) }, () => heuristicExtract(message));
  }

  if (name === "trend_analysis") {
    return timed(
      name,
      {
        currentSales: ledger.monthSales,
        lastSales: ledger.lastMonthSales,
      },
      () => {
        const salesChange = snap.salesChange;
        const trend =
          salesChange > 0.15 ? "growing" : salesChange < -0.15 ? "declining" : "stable";

        const insights: string[] = [];

        if (trend === "growing") {
          insights.push(
            `Sales up ${Math.round(salesChange * 100)}% month-over-month. Strong momentum.`,
          );
          insights.push(
            snap.tight
              ? "Growth is good, but cash timing is critical. Secure receivables before adding expenses."
              : "Growth opportunity: consider negotiating better supplier terms to improve margins.",
          );
        } else if (trend === "declining") {
          insights.push(
            `Sales down ${Math.round(Math.abs(salesChange) * 100)}% month-over-month. Demand softening.`,
          );
          insights.push(
            "Action: Review pricing, customer satisfaction, or switch to faster-moving products.",
          );
        } else {
          insights.push("Sales steady month-over-month. Focus on margins and efficiency.");
        }

        if (snap.slow.length > 0) {
          insights.push(
            `Inventory moving slowly (${snap.slow.length} items, ${mmk(snap.tiedInSlow)} tied up) — cut reorder quantities or switch suppliers.`,
          );
        }

        return {
          trend,
          salesChangePct: salesChange,
          currentMonth: ledger.monthSales,
          lastMonth: ledger.lastMonthSales,
          slowStockItems: snap.slow.length,
          slowStockValue: snap.tiedInSlow,
          insights,
          warning: "Based on this snapshot only. Not a 90-day forecast.",
        };
      },
    );
  }

  if (name === "financial_health_score") {
    return timed(name, { cash: ledger.cashOnHand, payables: snap.nearTotal }, () => {
      const factors = {
        cashCoverage: snap.tight ? 0 : 1,
        receivableQuality: snap.overdue.length === 0 ? 1 : 0.5,
        stockEfficiency:
          snap.slow.length === 0 ? 1 : snap.slow.length > 3 ? 0 : 0.5,
        salesMomentum:
          snap.salesChange > 0.15 ? 1 : snap.salesChange < -0.15 ? 0 : 0.5,
      };

      const score =
        (factors.cashCoverage + factors.receivableQuality + factors.stockEfficiency + factors.salesMomentum) / 4;

      const health = score >= 0.75 ? "OK" : score >= 0.5 ? "WATCH" : "TIGHT";

      return {
        health,
        score: Math.round(score * 100),
        factors,
        summary:
          health === "OK"
            ? "Business fundamentals are solid. Focus on growth opportunities."
            : health === "WATCH"
            ? "Some tension in cash timing or operations. Address now before it tightens."
            : "Critical cash or operational issues. Prioritize collections and delay non-essential spend.",
        note: "Score based on current snapshot. Not a credit rating.",
      };
    });
  }

  if (name === "search_knowledge") {
    const start = Date.now();
    const output = await searchKnowledge(message, shopId ?? DEFAULT_SHOP_ID);
    return {
      name,
      input: { q: message.slice(0, 120), shopId: shopId ?? DEFAULT_SHOP_ID },
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
    [/ko\s*htet/i, "Ko Htet"],
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
