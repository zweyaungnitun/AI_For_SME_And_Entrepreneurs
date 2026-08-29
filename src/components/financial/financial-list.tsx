"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mmk } from "@/lib/ledger/types";

type TimeFilter = "daily" | "weekly" | "monthly" | "yearly" | "custom";
type TransactionType = "income" | "expense" | "receivable" | "payable";

type FinancialTransaction = {
  id: string;
  date: Date;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  reference?: string;
};

type DateRange = {
  start: Date;
  end: Date;
};

const DEMO_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "1",
    date: new Date("2026-08-28"),
    type: "income",
    category: "Sales",
    description: "Product sales - Customer A",
    amount: 500000,
    currency: "MMK",
    status: "completed",
    reference: "INV-001",
  },
  {
    id: "2",
    date: new Date("2026-08-27"),
    type: "expense",
    category: "Supplies",
    description: "Office supplies purchase",
    amount: 45000,
    currency: "MMK",
    status: "completed",
    reference: "EXP-045",
  },
  {
    id: "3",
    date: new Date("2026-08-25"),
    type: "receivable",
    category: "Credit Sales",
    description: "Ko Min - 7 days overdue",
    amount: 200000,
    currency: "MMK",
    status: "pending",
    reference: "REC-012",
  },
  {
    id: "4",
    date: new Date("2026-08-20"),
    type: "payable",
    category: "Supplier Payment",
    description: "ABC Trading supplier invoice",
    amount: 300000,
    currency: "MMK",
    status: "pending",
    reference: "PAY-089",
  },
  {
    id: "5",
    date: new Date("2026-08-15"),
    type: "income",
    category: "Sales",
    description: "Bulk order - Customer B",
    amount: 850000,
    currency: "MMK",
    status: "completed",
    reference: "INV-002",
  },
];

export function FinancialList() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");
  const [selectedType, setSelectedType] = useState<TransactionType | "all">("all");
  const [limit, setLimit] = useState(10);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  const filteredTransactions = DEMO_TRANSACTIONS.filter((tx) => {
    const matchesType = selectedType === "all" || tx.type === selectedType;
    const matchesDate = tx.date >= dateRange.start && tx.date <= dateRange.end;
    return matchesType && matchesDate;
  }).slice(0, limit);

  const stats = {
    totalIncome: DEMO_TRANSACTIONS.filter((t) => t.type === "income" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    totalExpense: DEMO_TRANSACTIONS.filter((t) => t.type === "expense" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0),
    pendingReceivables: DEMO_TRANSACTIONS.filter((t) => t.type === "receivable" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0),
    pendingPayables: DEMO_TRANSACTIONS.filter((t) => t.type === "payable" && t.status === "pending")
      .reduce((sum, t) => sum + t.amount, 0),
  };

  function handleTimeFilterChange(filter: TimeFilter) {
    setTimeFilter(filter);
    const now = new Date();
    
    switch (filter) {
      case "daily":
        setDateRange({
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: now,
        });
        break;
      case "weekly":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        setDateRange({ start: weekStart, end: now });
        break;
      case "monthly":
        setDateRange({
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: now,
        });
        break;
      case "yearly":
        setDateRange({
          start: new Date(now.getFullYear(), 0, 1),
          end: now,
        });
        break;
    }
  }

  const netCashFlow = stats.totalIncome - stats.totalExpense;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="space-y-1">
            <p className="text-xs text-muted">Total Income</p>
            <p className="text-2xl font-semibold text-green-600">{mmk(stats.totalIncome)}</p>
            <p className="text-xs text-muted">This period</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <p className="text-xs text-muted">Total Expenses</p>
            <p className="text-2xl font-semibold text-red-600">{mmk(stats.totalExpense)}</p>
            <p className="text-xs text-muted">This period</p>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <p className="text-xs text-muted">Net Cash Flow</p>
            <p className={`text-2xl font-semibold ${netCashFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
              {mmk(netCashFlow)}
            </p>
            <p className="text-xs text-muted">
              {netCashFlow >= 0 ? "Positive" : "Negative"}
            </p>
          </div>
        </Card>
        <Card>
          <div className="space-y-1">
            <p className="text-xs text-muted">Pending</p>
            <p className="text-2xl font-semibold text-orange-600">
              {mmk(stats.pendingReceivables + stats.pendingPayables)}
            </p>
            <p className="text-xs text-muted">Outstanding</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Financial Transactions</h2>
            <Button size="sm">Export to Excel</Button>
          </div>

          {/* Time Filter */}
          <div>
            <p className="mb-2 text-sm font-medium">Time Period</p>
            <div className="flex flex-wrap gap-2">
              {(["daily", "weekly", "monthly", "yearly"] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleTimeFilterChange(filter)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    timeFilter === filter
                      ? "bg-primary text-white"
                      : "bg-surface text-muted hover:bg-muted/20"
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <p className="mb-2 text-sm font-medium">Transaction Type</p>
            <div className="flex flex-wrap gap-2">
              {(["all", "income", "expense", "receivable", "payable"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-primary text-white"
                      : "bg-surface text-muted hover:bg-muted/20"
                  }`}
                >
                  {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Limit */}
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Show:</p>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>

          {/* Date Range Display */}
          <div className="rounded-lg bg-muted/20 px-4 py-2">
            <p className="text-sm text-muted">
              Showing: {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      {/* Transaction List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr className="text-left text-sm font-semibold">
                <th className="pb-3">Date & Time</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="text-sm hover:bg-muted/20">
                  <td className="py-3">
                    <div>
                      <p className="font-medium">{tx.date.toLocaleDateString()}</p>
                      <p className="text-xs text-muted">{tx.date.toLocaleTimeString()}</p>
                    </div>
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-800"
                          : tx.type === "expense"
                            ? "bg-red-100 text-red-800"
                            : tx.type === "receivable"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 text-muted">{tx.category}</td>
                  <td className="py-3">{tx.description}</td>
                  <td className={`py-3 text-right font-semibold ${
                    tx.type === "income" ? "text-green-600" :
                    tx.type === "expense" ? "text-red-600" : "text-ink"
                  }`}>
                    {mmk(tx.amount)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-muted">{tx.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted">No transactions found for the selected filters</p>
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <p className="text-sm text-muted">
              Showing {filteredTransactions.length} of {DEMO_TRANSACTIONS.length} transactions
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                Previous
              </Button>
              <Button size="sm" variant="secondary">
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Monthly/Yearly Summary */}
      {(timeFilter === "monthly" || timeFilter === "yearly") && (
        <Card>
          <h3 className="mb-4 text-lg font-semibold">
            {timeFilter === "monthly" ? "Monthly" : "Yearly"} Summary
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted">Average Daily Income</p>
              <p className="mt-2 text-xl font-semibold text-green-600">
                {mmk(Math.round(stats.totalIncome / 30))}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted">Average Daily Expense</p>
              <p className="mt-2 text-xl font-semibold text-red-600">
                {mmk(Math.round(stats.totalExpense / 30))}
              </p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted">Net {timeFilter === "monthly" ? "Monthly" : "Yearly"}</p>
              <p className={`mt-2 text-xl font-semibold ${
                netCashFlow >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {mmk(netCashFlow)}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
