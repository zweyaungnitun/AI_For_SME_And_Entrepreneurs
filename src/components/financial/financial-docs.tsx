"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { ImportDataPreview } from "@/components/admin/import-data-preview";
import type { ParsedFinancialDoc } from "@/lib/docs/parser";

type FinancialDocumentCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  templates?: string[];
};

const FINANCIAL_CATEGORIES: FinancialDocumentCategory[] = [
  {
    id: "statements",
    name: "Financial Statements",
    description: "Income statements, balance sheets, cash flow statements",
    icon: "📊",
    count: 0,
    templates: ["Monthly P&L", "Balance Sheet", "Cash Flow Statement"],
  },
  {
    id: "invoices",
    name: "Invoices & Receipts",
    description: "Sales invoices, purchase receipts, expense claims",
    icon: "🧾",
    count: 0,
    templates: ["Sales Invoice", "Purchase Receipt", "Expense Claim"],
  },
  {
    id: "bank",
    name: "Bank Statements",
    description: "Monthly bank statements, transaction records",
    icon: "🏦",
    count: 0,
  },
  {
    id: "payroll",
    name: "Payroll Records",
    description: "Salary sheets, payslips, tax deductions",
    icon: "💰",
    count: 0,
    templates: ["Monthly Payroll", "Payslip Template"],
  },
  {
    id: "tax",
    name: "Tax Documents",
    description: "Tax returns, receipts, compliance documents",
    icon: "📋",
    count: 0,
  },
  {
    id: "reports",
    name: "Financial Reports",
    description: "Analysis reports, forecasts, budgets",
    icon: "📈",
    count: 0,
    templates: ["Budget Plan", "Financial Forecast", "Analysis Report"],
  },
];

export function FinancialDocs() {
  const [importedDoc, setImportedDoc] = useState<ParsedFinancialDoc | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Financial Documents</h1>
          <p className="mt-1 text-sm text-muted">
            Centralized financial record management for your business
          </p>
        </div>
        <Button href="/dashboard?tab=documents">View all documents</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-primary">12</p>
            <p className="mt-1 text-sm text-muted">Total Documents</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-green-600">3</p>
            <p className="mt-1 text-sm text-muted">This Month</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-semibold text-orange-600">2</p>
            <p className="mt-1 text-sm text-muted">Pending Review</p>
          </div>
        </Card>
      </div>

      {/* Upload Section */}
      <DocumentUpload onParsed={setImportedDoc} />

      {/* Import Preview */}
      {importedDoc && (
        <ImportDataPreview doc={importedDoc} />
      )}

      {/* Financial Categories */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Document Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FINANCIAL_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setSelectedCategory(category.id)}
              className="text-left"
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.id ? "border-primary ring-2 ring-primary/20" : ""
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{category.icon}</div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {category.count}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="mt-1 text-sm text-muted">{category.description}</p>
                  </div>
                  {category.templates && category.templates.length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <p className="mb-2 text-xs font-semibold text-muted">Quick Templates:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.templates.map((template) => (
                          <span
                            key={template}
                            className="rounded-md bg-muted/30 px-2 py-1 text-xs text-muted hover:bg-primary/10 hover:text-primary"
                          >
                            {template}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Financial Documents</h2>
          <div className="space-y-3">
            {[
              {
                name: "August 2026 P&L Statement.xlsx",
                category: "Financial Statements",
                date: "2026-08-28",
                size: "245 KB",
              },
              {
                name: "Bank Statement - KBZ Bank.pdf",
                category: "Bank Statements",
                date: "2026-08-25",
                size: "1.2 MB",
              },
              {
                name: "Supplier Invoice - ABC Trading.pdf",
                category: "Invoices & Receipts",
                date: "2026-08-20",
                size: "89 KB",
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/20"
              >
                <div className="flex items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-xl">
                    📄
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted">
                      {doc.category} · {doc.date} · {doc.size}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                  <Button size="sm" variant="secondary">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Financial Document Tips */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10">
        <div className="space-y-3">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300">
            💡 Financial Document Best Practices
          </h3>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex gap-2">
              <span>•</span>
              <span>Upload bank statements monthly for accurate cash flow tracking</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Keep all invoices and receipts organized by category</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Review financial statements at least quarterly</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Back up all financial documents securely</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Use consistent naming conventions for easy search</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
