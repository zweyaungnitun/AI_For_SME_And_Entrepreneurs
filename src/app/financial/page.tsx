"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { FinancialDocs } from "@/components/financial/financial-docs";

function FinancialView() {
  return <FinancialDocs />;
}

export default function FinancialDocsPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading financial documents...</p>}>
        <FinancialView />
      </Suspense>
    </AppShell>
  );
}
