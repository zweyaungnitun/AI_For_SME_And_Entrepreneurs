import type { BusinessSnapshot } from "./types";

const GENERATED_AT = "2026-08-29T08:15:00.000Z";

export const DEMO_SNAPSHOT: BusinessSnapshot = {
  context: {
    name: "Hlaing Mini Mart",
    industry: "Neighborhood grocery retail",
    stage: "established",
    location: "Hlaing Township, Yangon",
    teamSize: 4,
    challenge:
      "Cash is tight this week — three customers still owe us, and supplier bills are due in five days.",
  },
  financials: {
    cashMmk: "420000",
    receivablesMmk: "350000",
    upcomingMmk: "500000",
    inventoryNote: "Cooking oil and snack packs moving slowly",
  },
  health: "WATCH",
  healthSummary:
    "Receivables are sitting while supplier bills land in five days. Cash on hand does not cover upcoming expenses unless collections move today.",
  metrics: [
    {
      id: "cash",
      label: "Cash on hand",
      value: "420,000 MMK",
      hint: "Below this week's bills",
      tone: "watch",
    },
    {
      id: "receivables",
      label: "Receivables",
      value: "350,000 MMK",
      hint: "3 overdue customers",
      tone: "risk",
    },
    {
      id: "upcoming",
      label: "Upcoming expenses",
      value: "500,000 MMK",
      hint: "Due in 5 days",
      tone: "risk",
    },
    {
      id: "inventory",
      label: "Inventory flag",
      value: "Slow-moving",
      hint: "Oil + snack packs",
      tone: "watch",
    },
  ],
  priority: {
    title: "Follow up with 3 overdue customers",
    reason:
      "Upcoming expenses (500,000 MMK) sit above cash on hand (420,000 MMK). Collecting 350,000 MMK in overdue credit closes the gap.",
    action:
      "Call Maung Maung today (200,000 MMK, 7 days overdue), then Daw Aye and Ko Win before noon. Ask for payment this week, not a new order.",
  },
  risk: {
    title: "Short-term cash pressure",
    detail:
      "Available cash 420,000 MMK vs upcoming expenses 500,000 MMK. If the three overdue invoices slip another week, supplier payments get squeezed.",
  },
  insights: [
    {
      id: "cashflow",
      title: "Cash is short of this week's bills",
      summary:
        "Cash on hand does not cover supplier payments due in five days unless overdue credit is collected.",
      happening:
        "Hlaing Mini Mart has 420,000 MMK in the till and 500,000 MMK in bills due within five days. Three regulars still owe 350,000 MMK.",
      wrong:
        "The shop is making sales on credit faster than it is collecting. Cash looks busy at the counter, but it is not available for suppliers.",
      matters:
        "If collections wait, you may delay a supplier or dip into personal cash. That is a this-week problem, not a year-end one.",
      action:
        "Collect the highest-priority receivables first. Start with Maung Maung (200,000 MMK, 7 days overdue).",
      why: "Closing 200,000 MMK today turns a 80,000 MMK cash gap into a buffer before Friday's supplier run.",
      evidence: [
        "Cash on hand: 420,000 MMK",
        "Upcoming expenses due in 5 days: 500,000 MMK",
        "Overdue receivables: 350,000 MMK across 3 customers",
        "Largest overdue: Maung Maung 200,000 MMK (7 days)",
      ],
      health: "WATCH",
      generatedAt: GENERATED_AT,
    },
    {
      id: "receivables",
      title: "Three customers are past due",
      summary:
        "Credit is informal and aging. The owner cannot answer 'who do I call first?' without flipping through notes.",
      happening:
        "Maung Maung, Daw Aye, and Ko Win still have open tabs. None have a written reminder this week.",
      wrong:
        "Follow-up is by memory. The largest balance is also the oldest, so it should be first — it currently is not.",
      matters:
        "These three invoices are the only liquid source of cash before supplier day.",
      action:
        "Call in this order: Maung Maung → Daw Aye → Ko Win. Confirm a payment day. Do not extend more credit until the tab is cleared.",
      why: "A 10-minute call sequence is cheaper than missing a supplier payment or restocking on borrowed cash.",
      evidence: [
        "Maung Maung — 200,000 MMK — 7 days overdue",
        "Daw Aye — 90,000 MMK — 4 days overdue",
        "Ko Win — 60,000 MMK — 3 days overdue",
      ],
      health: "WATCH",
      generatedAt: GENERATED_AT,
    },
    {
      id: "inventory",
      title: "Slow-moving stock is tying up cash",
      summary:
        "Cooking oil and snack packs are sitting while the shop still considers restocking them.",
      happening:
        "Shelf space and cash are locked in oil and snack packs that barely moved this month.",
      wrong:
        "Restocking those SKUs would spend cash the shop does not have this week.",
      matters:
        "Inventory is not 'assets' if it cannot pay Friday's supplier. It is cash you cannot spend.",
      action:
        "Do not restock cooking oil or snack packs this week. Push a small till discount on the slow units after collections are done.",
      why: "Sales velocity is low; another purchase order would widen the cash gap.",
      evidence: [
        "Cooking oil: stock still high, few units sold this month",
        "Snack packs: slow compared with rice and eggs",
        "Cash already short of upcoming expenses",
      ],
      health: "WATCH",
      generatedAt: GENERATED_AT,
    },
  ],
  reply: "",
  memos: [],
  updatedAt: null,
};

export const ANALYZE_PROMPT =
  "Analyze my shop this week. Cash on hand, overdue customer credit, upcoming supplier bills, and slow-moving inventory. Tell me what is happening, what is wrong, why it matters, and the single action I should take today.";

export function composeAnalyzePrompt(snapshot: BusinessSnapshot) {
  const { context, financials } = snapshot;
  return `${ANALYZE_PROMPT}

Business: ${context.name} (${context.industry}) in ${context.location}.
Team: ${context.teamSize}. Stage: ${context.stage}.
Challenge: ${context.challenge}

Numbers the owner entered:
- Cash on hand: ${financials.cashMmk} MMK
- Receivables: ${financials.receivablesMmk} MMK
- Upcoming expenses: ${financials.upcomingMmk} MMK
- Inventory note: ${financials.inventoryNote}`;
}
