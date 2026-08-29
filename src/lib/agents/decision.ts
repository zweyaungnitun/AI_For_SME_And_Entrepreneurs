import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk, type DecisionCard, type Ledger } from "@/lib/ledger/types";
export function buildDemoCard(
  ledger: Ledger,
  locale: "en" | "my" = "en",
  shopName = "the shop",
): DecisionCard {
  const snap = analyzeLedger(ledger);
  const top = snap.overdue[0] ?? snap.topCustomer;
  const slow = snap.slow[0];
  const issues = [
    snap.tight
      ? `Payables ${snap.nearTotal} vs cash ${snap.cashOnHand}`
      : "Cash covers near payables",
    top && (top.status === "overdue" || top.overdueDays > 0)
      ? `${top.customer} ${top.amount} overdue ${top.overdueDays}d`
      : "No overdue credit",
    slow
      ? `${slow.sku} slow`
      : ledger.inventory.length === 0
        ? "No stock lines"
        : "No slow lot flagged",
  ].slice(0, 3);

  const action = [
    top && (top.status === "overdue" || top.overdueDays > 0)
      ? `Contact ${top.customer} today.`
      : "Write the 7-day payable list.",
    slow ? `Do not restock ${slow.sku} this week.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    businessHealth: snap.businessHealth,
    summary: snap.tight
      ? `Payables outrun cash while credit still sits out.`
      : `Near-term bills are covered; still watch credit and slow lots.`,
    summaryMy: snap.tight
      ? `ပေးရန်ငွေက လက်ရှိငွေထက် များနေပြီး အကြွေးကျန်ရှိနေသည်။`
      : `အနီးကပ် ပေးရန်ကို ငွေက လွှမ်းခြုံနိုင်သည်။`,
    keyIssues: issues,
    priority: {
      title:
        top && (top.status === "overdue" || top.overdueDays > 0)
          ? `Collect ${top.customer} first`
          : "Protect cash this week",
      reason: snap.tight
        ? `Largest overdue while cash ${mmk(snap.cashOnHand)} is below payables ${mmk(snap.nearTotal)}.`
        : "Collecting overdue credit is the fastest cash in.",
      action,
    },
    recommendations: [
      slow
        ? `Do not restock ${slow.sku} this week`
        : "Do not take new unpaid work until overdue cash is in",
      "Helps organize numbers for a discussion. Does not score loans.",
    ],
    evidence: snap.evidence,
    locale,
    reminder:
      top && (top.status === "overdue" || top.overdueDays > 0)
        ? {
            customer: top.customer,
            amount: top.amount,
            messageEn: `${top.customer}, ${mmk(top.amount)} is ${top.overdueDays} days overdue. Please settle this week. — ${shopName}`,
            messageMy: `${top.customer} ခင်ဗျာ၊ ${mmk(top.amount)} ${top.overdueDays} ရက် ကျော်နေပါပြီ။ ဒီတစ်ပတ်အတွင်း ပြန်ပေးနိုင်ရင် ကျေးဇူးပါ။`,
          }
        : undefined,
  };
}

export function formatCard(card: DecisionCard, burmese: boolean) {
  const body = burmese
    ? [
        `ကျန်းမာရေး  ${card.businessHealth}`,
        "",
        card.summaryMy,
        "",
        "ယနေ့",
        card.priority.title,
        card.priority.action,
      ]
    : [
        `HEALTH  ${card.businessHealth}`,
        "",
        card.summary,
        "",
        "TODAY",
        card.priority.title,
        "",
        "WHY",
        card.priority.reason,
        "",
        "ACTION",
        card.priority.action,
        "",
        "ISSUES",
        ...card.keyIssues.map((i) => `• ${i}`),
        "",
        "EVIDENCE",
        ...card.evidence.map((i) => `• ${i}`),
      ];
  if (card.reminder) {
    body.push("", "REMINDER", card.reminder.messageMy);
  }
  return body.join("\n");
}
