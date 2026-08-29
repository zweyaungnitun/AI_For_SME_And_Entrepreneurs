export type Expense = {
  name: string;
  amount: number;
  dueInDays: number;
};

export type Receivable = {
  customer: string;
  amount: number;
  overdueDays: number;
  status: "pending" | "overdue";
};

export type StockItem = {
  sku: string;
  units: number;
  soldThisMonth: number;
  unitCost: number;
};

/** Parsed import rows (Excel/CSV). Not the shop ledger shape. */
export type MoneyLine = {
  customer: string;
  amount: number;
  due?: string;
};

export type StockLine = {
  product: string;
  qty: number;
  cost?: number;
  soldRecently?: number;
};

export type ShopType =
  | "wholesale"
  | "retail"
  | "restaurant"
  | "services"
  | "online"
  | "manufacturing";

export type Ledger = {
  currency: "MMK";
  shopType: ShopType;
  cashOnHand: number;
  monthSales: number;
  lastMonthSales: number;
  upcomingExpenses: Expense[];
  receivables: Receivable[];
  inventory: StockItem[];
};

export type BusinessHealth = "OK" | "WATCH" | "TIGHT";

export type DecisionCard = {
  businessHealth: BusinessHealth;
  summary: string;
  summaryMy: string;
  keyIssues: string[];
  priority: {
    title: string;
    reason: string;
    action: string;
  };
  recommendations: string[];
  evidence: string[];
  locale: "en" | "my";
  reminder?: {
    customer: string;
    amount: number;
    messageMy: string;
    messageEn: string;
  };
};

export function mmk(amount: number) {
  return `${amount.toLocaleString("en-US")} MMK`;
}

export function isBurmese(text: string) {
  return /[\u1000-\u109F]/.test(text);
}

export function snapshotEmpty(ledger: Ledger) {
  return (
    ledger.cashOnHand <= 0 &&
    ledger.upcomingExpenses.length === 0 &&
    ledger.receivables.length === 0 &&
    ledger.inventory.length === 0
  );
}
