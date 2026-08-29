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
    body: "Only use customer names and MMK amounts that appear in cash_pressure, receivable_rank, slow_stock, supplier_pressure, resource_load, or business_pulse. Never invent a person or a balance. Vector memory is practice, not books.",
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
  {
    id: "practice-supply",
    shopId: null,
    kind: "practice",
    title: "Supply chain this week",
    body: "If a supplier payable is due before cash covers it, do not place a new purchase order. If a lot is slow, do not restock it. Supply advice is a cash constraint, not a warehouse app.",
  },
  {
    id: "practice-resources",
    shopId: null,
    kind: "practice",
    title: "Owner time, not a hire",
    body: "A team of one or two should spend today on the named overdue party or on delaying the payable. Do not hire. Do not take new unpaid work until that cash is in.",
  },
  {
    id: "practice-analytics",
    shopId: null,
    kind: "practice",
    title: "This snapshot only",
    body: "Sales versus last month and credit concentration are readings of the numbers in the tools. Not a forecast. Not a growth guarantee.",
  },
  {
    id: "founder-solo",
    shopId: "nandar-studio",
    kind: "practice",
    title: "Solo founder pattern",
    body: "Desk or chair rent often lands before a client invoice. Collect the named client first. Do not invent stock advice if inventory is empty.",
  },
  {
    id: "lin-htet-retail",
    shopId: "lin-htet-mart",
    kind: "practice",
    title: "Neighborhood shop pattern",
    body: "Rent and utilities land before weekend sales. Rank neighborhood credit by overdue, then amount. Do not reorder a slow shelf item while cash is tight.",
  },
  {
    id: "innwa-kitchen",
    shopId: "innwa-kitchen",
    kind: "practice",
    title: "Kitchen tab pattern",
    body: "A supplier payable can outrun the till while office tabs sit. Collect the largest tab first. Do not prep more of a slow dish.",
  },
  {
    id: "may-salon",
    shopId: "may-salon",
    kind: "practice",
    title: "Studio chair pattern",
    body: "Chair or desk rent often lands before a bridal invoice. Collect the named client first. If stock lines are empty, skip restock advice.",
  },
  {
    id: "nwe-online",
    shopId: "nwe-online",
    kind: "practice",
    title: "Social seller pattern",
    body: "Collect COD and transfers before boosting a page. Do not order more of a slow listing. Ads are not this week's cash fix.",
  },
  {
    id: "shwe-garment",
    shopId: "shwe-garment",
    kind: "practice",
    title: "Workshop lot pattern",
    body: "A yarn or material payable can outrun cash while a buyer lot sits. Collect the named buyer first. Do not buy more leftover fabric that already sits slow.",
  },
];
