import * as XLSX from "xlsx";
import Papa from "papaparse";
import type { Ledger, MoneyLine, StockLine } from "@/lib/ledger/types";

export type ParsedFinancialDoc = {
  type: "ledger" | "transactions" | "inventory";
  data: Partial<Ledger> | FinancialTransaction[] | StockLine[];
  metadata: {
    fileName: string;
    rowCount: number;
    dateRange?: { from: string; to: string };
  };
};

export type FinancialTransaction = {
  date: string;
  type: "income" | "expense" | "receivable" | "payable";
  amount: number;
  description: string;
  category?: string;
};

/**
 * Parse Excel or CSV financial document into structured data
 */
export async function parseFinancialDocument(
  file: File,
): Promise<ParsedFinancialDoc> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "csv") {
    return parseCSV(file);
  } else if (["xls", "xlsx"].includes(ext || "")) {
    return parseExcel(file);
  }

  throw new Error("Unsupported file format. Use CSV or Excel (.xlsx, .xls)");
}

async function parseCSV(file: File): Promise<ParsedFinancialDoc> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const parsed = processRows(results.data as Record<string, string>[], file.name);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}

async function parseExcel(file: File): Promise<ParsedFinancialDoc> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(firstSheet);

  return processRows(rows, file.name);
}

function processRows(
  rows: Record<string, string>[],
  fileName: string,
): ParsedFinancialDoc {
  if (rows.length === 0) {
    throw new Error("Document is empty");
  }

  const headers = Object.keys(rows[0]).map((h) => h.toLowerCase().trim());

  // Detect document type based on headers
  if (detectLedgerFormat(headers)) {
    return {
      type: "ledger",
      data: parseLedgerFormat(rows),
      metadata: { fileName, rowCount: rows.length },
    };
  } else if (detectTransactionFormat(headers)) {
    return {
      type: "transactions",
      data: parseTransactionFormat(rows),
      metadata: {
        fileName,
        rowCount: rows.length,
        dateRange: getDateRange(rows),
      },
    };
  } else if (detectInventoryFormat(headers)) {
    return {
      type: "inventory",
      data: parseInventoryFormat(rows),
      metadata: { fileName, rowCount: rows.length },
    };
  }

  throw new Error(
    "Unable to detect financial document format. Expected columns like: date, amount, description OR cash, receivables, payables",
  );
}

function detectLedgerFormat(headers: string[]): boolean {
  const ledgerKeys = ["cash", "receivable", "payable", "stock", "inventory"];
  return ledgerKeys.some((key) => headers.some((h) => h.includes(key)));
}

function detectTransactionFormat(headers: string[]): boolean {
  return (
    headers.some((h) => h.includes("date") || h.includes("time")) &&
    headers.some((h) => h.includes("amount") || h.includes("mmk") || h.includes("kyat"))
  );
}

function detectInventoryFormat(headers: string[]): boolean {
  return (
    headers.some((h) => h.includes("product") || h.includes("item")) &&
    headers.some((h) => h.includes("quantity") || h.includes("qty") || h.includes("stock"))
  );
}

function parseLedgerFormat(rows: Record<string, string>[]): Partial<Ledger> {
  const ledger: Partial<Ledger> = {};
  const firstRow = rows[0];

  // Try to extract cash
  const cashKey = Object.keys(firstRow).find((k) =>
    k.toLowerCase().includes("cash"),
  );
  if (cashKey) {
    ledger.cashOnHand = parseAmount(firstRow[cashKey]);
  }

  // Try to extract receivables
  const receivables: MoneyLine[] = [];
  rows.forEach((row) => {
    const customerKey = Object.keys(row).find(
      (k) => k.toLowerCase().includes("customer") || k.toLowerCase().includes("debtor"),
    );
    const amountKey = Object.keys(row).find(
      (k) => k.toLowerCase().includes("receivable") || k.toLowerCase().includes("owed"),
    );

    if (customerKey && amountKey && row[customerKey] && row[amountKey]) {
      receivables.push({
        customer: row[customerKey],
        amount: parseAmount(row[amountKey]),
        due: row["due"] || row["Due Date"] || "",
      });
    }
  });
  if (receivables.length > 0) ledger.receivables = receivables;

  // Try to extract payables
  const payables: MoneyLine[] = [];
  rows.forEach((row) => {
    const supplierKey = Object.keys(row).find(
      (k) =>
        k.toLowerCase().includes("supplier") ||
        k.toLowerCase().includes("vendor") ||
        k.toLowerCase().includes("payable"),
    );
    const amountKey = Object.keys(row).find(
      (k) =>
        k.toLowerCase().includes("payable") ||
        k.toLowerCase().includes("amount") ||
        k.toLowerCase().includes("owe"),
    );

    if (supplierKey && amountKey && row[supplierKey] && row[amountKey]) {
      payables.push({
        customer: row[supplierKey],
        amount: parseAmount(row[amountKey]),
        due: row["due"] || row["Due Date"] || "",
      });
    }
  });
  if (payables.length > 0) ledger.payables = payables;

  return ledger;
}

function parseTransactionFormat(
  rows: Record<string, string>[],
): FinancialTransaction[] {
  return rows
    .map((row) => {
      const dateKey =
        Object.keys(row).find((k) => k.toLowerCase().includes("date")) ||
        "date";
      const amountKey =
        Object.keys(row).find((k) =>
          ["amount", "mmk", "kyat", "value"].some((term) =>
            k.toLowerCase().includes(term),
          ),
        ) || "amount";
      const descKey =
        Object.keys(row).find((k) =>
          ["description", "desc", "note", "memo"].some((term) =>
            k.toLowerCase().includes(term),
          ),
        ) || "description";
      const typeKey =
        Object.keys(row).find((k) => k.toLowerCase().includes("type")) || "type";

      const amount = parseAmount(row[amountKey]);
      if (!amount || !row[dateKey]) return null;

      return {
        date: row[dateKey],
        type: inferTransactionType(row[typeKey], row[descKey], amount),
        amount: Math.abs(amount),
        description: row[descKey] || "",
        category: row["category"] || row["Category"],
      };
    })
    .filter((t): t is FinancialTransaction => t !== null);
}

function parseInventoryFormat(rows: Record<string, string>[]): StockLine[] {
  return rows
    .map((row) => {
      const productKey =
        Object.keys(row).find((k) =>
          ["product", "item", "name", "sku"].some((term) =>
            k.toLowerCase().includes(term),
          ),
        ) || "product";
      const qtyKey =
        Object.keys(row).find((k) =>
          ["quantity", "qty", "stock", "count"].some((term) =>
            k.toLowerCase().includes(term),
          ),
        ) || "quantity";
      const costKey = Object.keys(row).find((k) =>
        ["cost", "price", "value"].some((term) => k.toLowerCase().includes(term)),
      );

      const qty = parseAmount(row[qtyKey]);
      if (!row[productKey] || !qty) return null;

      return {
        product: row[productKey],
        qty,
        cost: costKey ? parseAmount(row[costKey]) : undefined,
        soldRecently: row["sold"] ? parseAmount(row["sold"]) : undefined,
      };
    })
    .filter((s): s is StockLine => s !== null);
}

function inferTransactionType(
  typeField: string,
  description: string,
  amount: number,
): FinancialTransaction["type"] {
  const combined = `${typeField} ${description}`.toLowerCase();

  if (combined.includes("income") || combined.includes("sale") || combined.includes("revenue"))
    return "income";
  if (combined.includes("expense") || combined.includes("cost") || combined.includes("purchase"))
    return "expense";
  if (combined.includes("receivable") || combined.includes("credit") || combined.includes("owed"))
    return "receivable";
  if (combined.includes("payable") || combined.includes("debt") || combined.includes("owe"))
    return "payable";

  return amount >= 0 ? "income" : "expense";
}

function parseAmount(value: string | number | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const cleaned = String(value)
    .replace(/[^0-9.-]/g, "")
    .trim();
  return parseFloat(cleaned) || 0;
}

function getDateRange(
  rows: Record<string, string>[],
): { from: string; to: string } | undefined {
  const dateKey = Object.keys(rows[0]).find((k) => k.toLowerCase().includes("date"));
  if (!dateKey) return undefined;

  const dates = rows.map((r) => r[dateKey]).filter(Boolean);
  if (dates.length === 0) return undefined;

  return {
    from: dates[0],
    to: dates[dates.length - 1],
  };
}

/**
 * Aggregate transactions into time-series analysis
 */
export function analyzeTransactionTrends(
  transactions: FinancialTransaction[],
  period: "daily" | "monthly" | "yearly",
): {
  income: Record<string, number>;
  expenses: Record<string, number>;
  netCashFlow: Record<string, number>;
} {
  const income: Record<string, number> = {};
  const expenses: Record<string, number> = {};

  transactions.forEach((t) => {
    const key = formatDateByPeriod(t.date, period);
    if (t.type === "income") {
      income[key] = (income[key] || 0) + t.amount;
    } else if (t.type === "expense") {
      expenses[key] = (expenses[key] || 0) + t.amount;
    }
  });

  const netCashFlow: Record<string, number> = {};
  const allKeys = new Set([...Object.keys(income), ...Object.keys(expenses)]);
  allKeys.forEach((key) => {
    netCashFlow[key] = (income[key] || 0) - (expenses[key] || 0);
  });

  return { income, expenses, netCashFlow };
}

function formatDateByPeriod(
  dateStr: string,
  period: "daily" | "monthly" | "yearly",
): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    if (period === "yearly") return date.getFullYear().toString();
    if (period === "monthly")
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return date.toISOString().split("T")[0];
  } catch {
    return dateStr;
  }
}
