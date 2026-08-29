export type KnowledgeSeed = {
  id: string;
  shopId: string | null;
  kind: "practice" | "trust" | "reminder" | "bank";
  title: string;
  body: string;
};

/** Practice text only. No MMK amounts — ledger tools stay the source of truth. */
export const KNOWLEDGE_SEED: KnowledgeSeed[] = [
  {
    id: "trust-numbers",
    shopId: null,
    kind: "trust",
    title: "Ledger wins",
    body: "Only use customer names and MMK amounts that appear in cash_pressure, receivable_rank, or slow_stock. Never invent a person or a balance. Vector memory is practice, not books.",
  },
  {
    id: "practice-tight",
    shopId: null,
    kind: "practice",
    title: "When payables outrun cash",
    body: "If upcoming payables exceed cash on hand, health is TIGHT. Collect the largest overdue party first. Do not restock a slow lot this week. Do not take new unpaid work until that cash is in.",
  },
  {
    id: "practice-rank",
    shopId: null,
    kind: "practice",
    title: "Who to collect first",
    body: "Rank credit by overdue first, then by amount, then by days. Name the top party. The owner follows up on their own channel.",
  },
  {
    id: "practice-stock",
    shopId: null,
    kind: "practice",
    title: "Slow stock is a cash trap",
    body: "If units on hand are high and units sold this period are very low, do not buy more of that SKU. Treat it as cash sitting on the shelf, not a growth plan.",
  },
  {
    id: "reminder-copy",
    shopId: null,
    kind: "reminder",
    title: "Collection reminder",
    body: "Draft a short polite reminder with the name, amount, and overdue days from the tools. Burmese or English. The app copies text only. It does not send messages.",
  },
  {
    id: "bank-discussion",
    shopId: null,
    kind: "bank",
    title: "Bank discussion",
    body: "Helps organize numbers for a discussion. Never say a loan is approved or that the owner qualifies. This is cash timing for this week, not a credit score.",
  },
  {
    id: "daw-hla-wholesale",
    shopId: "daw-hla",
    kind: "practice",
    title: "Wholesale credit pattern",
    body: "Mandalay wholesale often has a supplier payable due before credit buyers settle. Use the snapshot tools for who and how much. Do not restock a slow dry-goods lot while cash is tight.",
  },
];
