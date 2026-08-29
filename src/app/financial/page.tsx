"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { FinancialDocs } from "@/components/financial/financial-docs";
import { FinancialList } from "@/components/financial/financial-list";
import { TabBar, TabPanel, type Tab } from "@/components/ui/tabs";
import { useState } from "react";

function DocumentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function FinancialView() {
  const [activeTab, setActiveTab] = useState("transactions");

  const TABS: Tab[] = [
    { id: "transactions", label: "Transactions", icon: ListIcon },
    { id: "documents", label: "Documents", icon: DocumentIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financial Management</h1>
        <p className="mt-1 text-sm text-muted">
          Complete financial tracking with time-based filtering and document management
        </p>
      </div>

      <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      <TabPanel value="transactions" activeTab={activeTab}>
        <FinancialList />
      </TabPanel>

      <TabPanel value="documents" activeTab={activeTab}>
        <FinancialDocs />
      </TabPanel>
    </div>
  );
}

export default function FinancialDocsPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading financial management...</p>}>
        <FinancialView />
      </Suspense>
    </AppShell>
  );
}
