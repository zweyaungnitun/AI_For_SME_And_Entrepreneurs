"use client";

import { Card } from "@/components/ui/card";
import type { ParsedFinancialDoc, FinancialTransaction } from "@/lib/docs/parser";
import { mmk, type MoneyLine, type StockLine } from "@/lib/ledger/types";
import { analyzeTransactionTrends } from "@/lib/docs/parser";

export function ImportDataPreview({ doc }: { doc: ParsedFinancialDoc }) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Import preview</h2>
            <p className="mt-1 text-sm text-muted">
              {doc.metadata.fileName} · {doc.metadata.rowCount} rows · Type: {doc.type}
            </p>
          </div>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
            Valid
          </span>
        </div>

        {doc.type === "ledger" && doc.data.cashOnHand !== undefined && (
          <LedgerPreview data={doc.data} />
        )}

        {doc.type === "transactions" && Array.isArray(doc.data) && (
          <TransactionsPreview
            data={doc.data as FinancialTransaction[]}
            metadata={doc.metadata}
          />
        )}

        {doc.type === "inventory" && Array.isArray(doc.data) && (
          <InventoryPreview data={doc.data as StockLine[]} />
        )}
      </div>
    </Card>
  );
}

function LedgerPreview({ data }: { data: Partial<{ cashOnHand: number; receivables: MoneyLine[]; payables: MoneyLine[] }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Ledger snapshot
      </h3>
      
      <div className="grid gap-4 sm:grid-cols-3">
        {data.cashOnHand !== undefined && (
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-muted">Cash on hand</p>
            <p className="mt-1 text-xl font-semibold">{mmk(data.cashOnHand)}</p>
          </div>
        )}
        
        {data.receivables && (
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-muted">Total receivables</p>
            <p className="mt-1 text-xl font-semibold">
              {mmk(data.receivables.reduce((a, r) => a + r.amount, 0))}
            </p>
            <p className="mt-1 text-xs text-muted">{data.receivables.length} customers</p>
          </div>
        )}
        
        {data.payables && (
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-xs text-muted">Total payables</p>
            <p className="mt-1 text-xl font-semibold">
              {mmk(data.payables.reduce((a, p) => a + p.amount, 0))}
            </p>
            <p className="mt-1 text-xs text-muted">{data.payables.length} suppliers</p>
          </div>
        )}
      </div>

      {data.receivables && data.receivables.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-semibold">Receivables</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Due date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.receivables.slice(0, 5).map((r, i) => (
                  <tr key={i}>
                    <td className="py-2">{r.customer}</td>
                    <td className="py-2 font-medium">{mmk(r.amount)}</td>
                    <td className="py-2 text-muted">{r.due || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.receivables.length > 5 && (
              <p className="mt-2 text-xs text-muted">
                +{data.receivables.length - 5} more rows
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TransactionsPreview({
  data,
  metadata,
}: {
  data: FinancialTransaction[];
  metadata: ParsedFinancialDoc["metadata"];
}) {
  const trends = analyzeTransactionTrends(data, "monthly");
  const totalIncome = Object.values(trends.income).reduce((a, b) => a + b, 0);
  const totalExpenses = Object.values(trends.expenses).reduce((a, b) => a + b, 0);
  const netFlow = totalIncome - totalExpenses;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Transaction history
      </h3>
      
      {metadata.dateRange && (
        <p className="text-sm text-muted">
          Period: {metadata.dateRange.from} to {metadata.dateRange.to}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Total income</p>
          <p className="mt-1 text-xl font-semibold text-green-600">{mmk(totalIncome)}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Total expenses</p>
          <p className="mt-1 text-xl font-semibold text-red-600">{mmk(totalExpenses)}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Net cash flow</p>
          <p className={`mt-1 text-xl font-semibold ${netFlow >= 0 ? "text-green-600" : "text-red-600"}`}>
            {mmk(netFlow)}
          </p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Monthly trends</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="pb-2">Month</th>
                <th className="pb-2">Income</th>
                <th className="pb-2">Expenses</th>
                <th className="pb-2">Net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Object.keys(trends.income).map((month) => (
                <tr key={month}>
                  <td className="py-2">{month}</td>
                  <td className="py-2 text-green-600">{mmk(trends.income[month] || 0)}</td>
                  <td className="py-2 text-red-600">{mmk(trends.expenses[month] || 0)}</td>
                  <td className={`py-2 font-medium ${trends.netCashFlow[month] >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {mmk(trends.netCashFlow[month])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Recent transactions</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="pb-2">Date</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Description</th>
                <th className="pb-2">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.slice(0, 10).map((t, i) => (
                <tr key={i}>
                  <td className="py-2 text-muted">{t.date}</td>
                  <td className="py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      t.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                      t.type === "expense" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-2">{t.description || "—"}</td>
                  <td className="py-2 font-medium">{mmk(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && (
            <p className="mt-2 text-xs text-muted">+{data.length - 10} more transactions</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InventoryPreview({ data }: { data: StockLine[] }) {
  const totalValue = data.reduce((a, s) => a + (s.cost || 0) * s.qty, 0);
  const totalUnits = data.reduce((a, s) => a + s.qty, 0);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
        Inventory snapshot
      </h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Total items</p>
          <p className="mt-1 text-xl font-semibold">{data.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Total units</p>
          <p className="mt-1 text-xl font-semibold">{totalUnits}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-muted">Estimated value</p>
          <p className="mt-1 text-xl font-semibold">{mmk(totalValue)}</p>
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Items</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="pb-2">Product</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Unit cost</th>
                <th className="pb-2">Recently sold</th>
                <th className="pb-2">Total value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item, i) => (
                <tr key={i}>
                  <td className="py-2">{item.product}</td>
                  <td className="py-2">{item.qty}</td>
                  <td className="py-2 text-muted">{item.cost ? mmk(item.cost) : "—"}</td>
                  <td className="py-2 text-muted">{item.soldRecently ?? "—"}</td>
                  <td className="py-2 font-medium">
                    {item.cost ? mmk(item.cost * item.qty) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
