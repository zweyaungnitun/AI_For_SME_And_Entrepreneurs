"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBrief } from "@/components/brief/brief-provider";
import { HealthBanner } from "@/components/dashboard/health-banner";
import { InsightsFeed } from "@/components/dashboard/insights-feed";
import { ActionRow, PriorityCard, SecondaryHold } from "@/components/dashboard/priority-card";
import { mapTabParam, RecordsPanel } from "@/components/dashboard/records-panel";
import { WhyEvidence } from "@/components/dashboard/why-evidence";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { BusinessDocument } from "@/components/documents/document-library";
import type { ParsedFinancialDoc } from "@/lib/docs/parser";
import type { Ledger } from "@/lib/ledger/types";

const SAMPLE_DOCS: BusinessDocument[] = [
  {
    id: "1",
    name: "Q3 2026 Financial Report.pdf",
    type: "financial",
    category: "Quarterly Report",
    size: 245000,
    uploadedAt: new Date("2026-08-15"),
    uploadedBy: "Admin",
    fileType: "pdf",
    tags: ["financial", "quarterly"],
  },
  {
    id: "2",
    name: "Supplier Contract - ABC Trading.pdf",
    type: "legal",
    category: "Contract",
    size: 125000,
    uploadedAt: new Date("2026-08-10"),
    uploadedBy: "Admin",
    fileType: "pdf",
    tags: ["legal", "supplier"],
  },
];

function DashboardView() {
  const {
    snapshot,
    status,
    error,
    streamingReply,
    setContext,
    setFinancials,
    analyze,
  } = useBrief();
  const searchParams = useSearchParams();
  const recordSection = mapTabParam(searchParams.get("tab"));

  const [documents, setDocuments] = useState<BusinessDocument[]>(SAMPLE_DOCS);

  const running = status === "running";
  const primaryInsightId = snapshot.insights[0]?.id ?? "cashflow";
  const secondaryInsights = useMemo(
    () =>
      snapshot.insights.filter(
        (item) => item.id !== "cashflow" && item.id !== "supply",
      ),
    [snapshot.insights],
  );

  function handleDocumentParsed(doc: ParsedFinancialDoc) {
    if (doc.type !== "ledger" || Array.isArray(doc.data)) return;
    const ledgerData = doc.data as Partial<Ledger>;
    if (ledgerData.cashOnHand === undefined) return;
    setFinancials({
      cashMmk: String(ledgerData.cashOnHand),
      receivablesMmk: String(
        ledgerData.receivables?.reduce((sum, row) => sum + row.amount, 0) ?? 0,
      ),
      upcomingMmk: String(
        ledgerData.upcomingExpenses?.reduce((sum, row) => sum + row.amount, 0) ?? 0,
      ),
      inventoryNote: snapshot.financials.inventoryNote,
    });
  }

  function handleDocumentUpload(file: File, type: BusinessDocument["type"]) {
    const newDoc: BusinessDocument = {
      id: Date.now().toString(),
      name: file.name,
      type,
      category: type.charAt(0).toUpperCase() + type.slice(1),
      size: file.size,
      uploadedAt: new Date(),
      uploadedBy: "Admin",
      fileType: file.name.split(".").pop() || "unknown",
      tags: [type],
    };
    setDocuments((prev) => [newDoc, ...prev]);
  }

  return (
    <>
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              SME Copilot
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {snapshot.context.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Who owes you. Where cash is tight. What to do today.
            </p>
            <p className="mt-1 text-xs text-muted">
              {snapshot.context.industry} · {snapshot.context.location}
            </p>
          </div>
          <Button variant="ghost" onClick={() => void analyze()} disabled={running}>
            {running ? "Analyzing…" : "Re-analyze"}
          </Button>
        </header>

        {error ? (
          <Card className="border-risk/30 bg-[#fef2f2] text-sm text-risk">{error}</Card>
        ) : null}

        {running && streamingReply ? (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Live brief
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {streamingReply}
            </p>
          </Card>
        ) : null}

        <div className="flex flex-col gap-6">
          <HealthBanner status={snapshot.health} summary={snapshot.healthSummary} />
          <PriorityCard snapshot={snapshot} />
          <WhyEvidence snapshot={snapshot} />
          <ActionRow snapshot={snapshot} insightId={primaryInsightId} />
          <SecondaryHold snapshot={snapshot} />
        </div>

        {secondaryInsights.length > 0 ? (
          <InsightsFeed insights={secondaryInsights} heading="Secondary information" />
        ) : null}
      </div>

      <div className="mx-auto mt-10 max-w-5xl">
        <RecordsPanel
          snapshot={snapshot}
          documents={documents}
          initialSection={recordSection}
          forceOpen={Boolean(recordSection)}
          onContext={setContext}
          onFinancials={setFinancials}
          onParsed={handleDocumentParsed}
          onUpload={handleDocumentUpload}
          onDelete={(id) => setDocuments((prev) => prev.filter((doc) => doc.id !== id))}
          onDownload={(id) => console.log("Download", id)}
        />
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <AppShell>
      <Suspense fallback={<p className="text-sm text-muted">Loading today&apos;s brief…</p>}>
        <DashboardView />
      </Suspense>
    </AppShell>
  );
}
