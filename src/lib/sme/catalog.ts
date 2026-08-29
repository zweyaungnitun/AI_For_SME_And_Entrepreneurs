import type { BusinessContext } from "@/lib/agents/types";
import type { Ledger } from "@/lib/ledger/types";

export type ShopType =
  | "wholesale"
  | "retail"
  | "restaurant"
  | "services"
  | "online"
  | "manufacturing";

export type ShopProfile = {
  id: string;
  type: ShopType;
  label: string;
  debtorLabel: string;
  stockLabel: string;
  context: BusinessContext;
  ledger: Ledger;
  prompts: string[];
};

export const SHOP_TYPES: ShopType[] = [
  "wholesale",
  "retail",
  "restaurant",
  "services",
  "online",
  "manufacturing",
];

export const SHOPS: ShopProfile[] = [
  {
    id: "daw-hla",
    type: "wholesale",
    label: "Wholesale",
    debtorLabel: "credit buyer",
    stockLabel: "SKU",
    context: {
      name: "Daw Hla's Dry Goods",
      industry: "wholesale",
      stage: "established",
      location: "Mandalay, Myanmar",
      teamSize: 4,
      challenge: "A 5-day supplier payable is larger than cash, and Ko Min is overdue.",
    },
    ledger: {
      currency: "MMK",
      shopType: "wholesale",
      cashOnHand: 420_000,
      monthSales: 850_000,
      lastMonthSales: 850_000,
      upcomingExpenses: [{ name: "Supplier payable", amount: 500_000, dueInDays: 5 }],
      receivables: [
        { customer: "Ko Min", amount: 200_000, overdueDays: 7, status: "overdue" },
        { customer: "Ma Su", amount: 150_000, overdueDays: 0, status: "pending" },
      ],
      inventory: [
        { sku: "Product A", units: 20, soldThisMonth: 2, unitCost: 50_000 },
      ],
    },
    prompts: [
      "What should I do today so cash does not break?",
      "Who should I collect from first?",
      "Should I restock Product A?",
    ],
  },
  {
    id: "lin-htet-mart",
    type: "retail",
    label: "Retail shop",
    debtorLabel: "regular",
    stockLabel: "shelf item",
    context: {
      name: "Lin Htet Mart",
      industry: "retail",
      stage: "early",
      location: "Hlaing Tharyar, Yangon",
      teamSize: 3,
      challenge: "Rent is due before weekend sales, and two neighborhood regulars still owe.",
    },
    ledger: {
      currency: "MMK",
      shopType: "retail",
      cashOnHand: 310_000,
      monthSales: 1_200_000,
      lastMonthSales: 1_150_000,
      upcomingExpenses: [
        { name: "Shop rent", amount: 280_000, dueInDays: 3 },
        { name: "Electricity", amount: 45_000, dueInDays: 6 },
      ],
      receivables: [
        { customer: "U Myint", amount: 80_000, overdueDays: 10, status: "overdue" },
        { customer: "Daw Kyi", amount: 45_000, overdueDays: 4, status: "overdue" },
      ],
      inventory: [
        { sku: "Cooking oil 1L", units: 24, soldThisMonth: 3, unitCost: 8_500 },
        { sku: "Instant noodles", units: 60, soldThisMonth: 55, unitCost: 700 },
      ],
    },
    prompts: [
      "Can I make rent this week?",
      "Who do I follow up today?",
      "Which shelf item should I not reorder?",
    ],
  },
  {
    id: "innwa-kitchen",
    type: "restaurant",
    label: "Restaurant / tea shop",
    debtorLabel: "tab",
    stockLabel: "dish / ingredient",
    context: {
      name: "Innwa Kitchen",
      industry: "restaurant",
      stage: "early",
      location: "Chanayethazan, Mandalay",
      teamSize: 6,
      challenge: "Meat supplier wants cash in 4 days; two office tabs are unpaid.",
    },
    ledger: {
      currency: "MMK",
      shopType: "restaurant",
      cashOnHand: 380_000,
      monthSales: 2_400_000,
      lastMonthSales: 2_550_000,
      upcomingExpenses: [
        { name: "Meat supplier", amount: 420_000, dueInDays: 4 },
      ],
      receivables: [
        { customer: "Aye Yar Office tab", amount: 180_000, overdueDays: 8, status: "overdue" },
        { customer: "Ko Zaw tab", amount: 60_000, overdueDays: 3, status: "overdue" },
      ],
      inventory: [
        { sku: "Special curry pack (slow)", units: 18, soldThisMonth: 2, unitCost: 12_000 },
      ],
    },
    prompts: [
      "How do I cover the meat supplier?",
      "Which tab do I collect first?",
      "Should I prep more special curry?",
    ],
  },
  {
    id: "may-salon",
    type: "services",
    label: "Services",
    debtorLabel: "client",
    stockLabel: "supplies",
    context: {
      name: "May Beauty Studio",
      industry: "services",
      stage: "early",
      location: "Bahan, Yangon",
      teamSize: 2,
      challenge: "Chair-rental is due; bridal clients have not settled invoices.",
    },
    ledger: {
      currency: "MMK",
      shopType: "services",
      cashOnHand: 220_000,
      monthSales: 900_000,
      lastMonthSales: 820_000,
      upcomingExpenses: [{ name: "Chair rental", amount: 300_000, dueInDays: 2 }],
      receivables: [
        { customer: "Bride Su", amount: 250_000, overdueDays: 6, status: "overdue" },
        { customer: "Daw Hnin", amount: 40_000, overdueDays: 0, status: "pending" },
      ],
      inventory: [],
    },
    prompts: [
      "How do I pay chair rental?",
      "Which client invoice first?",
      "Should I take a new unpaid bridal booking?",
    ],
  },
  {
    id: "nwe-online",
    type: "online",
    label: "Online / social seller",
    debtorLabel: "COD / transfer",
    stockLabel: "listing",
    context: {
      name: "Nwe Closet",
      industry: "online",
      stage: "pre-revenue",
      location: "Monywa, Sagaing",
      teamSize: 1,
      challenge: "Page ads were paused; COD orders sit uncollected and one slow listing ties cash.",
    },
    ledger: {
      currency: "MMK",
      shopType: "online",
      cashOnHand: 150_000,
      monthSales: 480_000,
      lastMonthSales: 610_000,
      upcomingExpenses: [{ name: "Packaging restock", amount: 90_000, dueInDays: 3 }],
      receivables: [
        { customer: "COD — Ma Thida", amount: 85_000, overdueDays: 5, status: "overdue" },
        { customer: "KBZ Pay — Ko Lin", amount: 45_000, overdueDays: 2, status: "overdue" },
      ],
      inventory: [
        { sku: "Floral dress (listing)", units: 12, soldThisMonth: 1, unitCost: 18_000 },
      ],
    },
    prompts: [
      "What should I do before I boost the page again?",
      "Which COD do I chase?",
      "Should I order more floral dresses?",
    ],
  },
  {
    id: "shwe-garment",
    type: "manufacturing",
    label: "Workshop / light manufacturing",
    debtorLabel: "buyer",
    stockLabel: "material / lot",
    context: {
      name: "Shwe Yarn Workshop",
      industry: "manufacturing",
      stage: "growth",
      location: "Pathein, Ayeyarwady",
      teamSize: 8,
      challenge: "Yarn supplier wants payment; a buyer lot is overdue and leftover fabric is slow.",
    },
    ledger: {
      currency: "MMK",
      shopType: "manufacturing",
      cashOnHand: 640_000,
      monthSales: 3_100_000,
      lastMonthSales: 2_900_000,
      upcomingExpenses: [{ name: "Yarn supplier", amount: 720_000, dueInDays: 6 }],
      receivables: [
        { customer: "Yangon buyer lot #14", amount: 400_000, overdueDays: 9, status: "overdue" },
      ],
      inventory: [
        { sku: "Leftover cotton lot", units: 30, soldThisMonth: 2, unitCost: 9_000 },
      ],
    },
    prompts: [
      "How do I pay the yarn supplier?",
      "Which buyer do I chase?",
      "Should I buy more leftover cotton?",
    ],
  },
];

export const DEFAULT_SHOP_ID = "daw-hla";

export function getShop(id?: string) {
  return SHOPS.find((s) => s.id === id) ?? SHOPS[0];
}

export function shopVoice(type: ShopType) {
  switch (type) {
    case "restaurant":
      return "Speak as a kitchen operator: tabs, suppliers, slow dishes. One action this week.";
    case "services":
      return "Speak as a studio/clinic operator: unpaid client work, rent/chair, no fake inventory advice if stock is empty.";
    case "online":
      return "Speak as a social seller: COD, transfers, listings. Do not recommend boosting ads before cash is collected.";
    case "manufacturing":
      return "Speak as a workshop owner: buyer lots, material, supplier payables.";
    case "retail":
      return "Speak as a neighborhood shop: rent, regulars on credit, shelf items.";
    default:
      return "Speak as a wholesale owner: credit buyers, supplier payables, slow SKUs.";
  }
}
