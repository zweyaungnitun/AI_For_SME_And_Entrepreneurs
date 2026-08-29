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

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Tab Icons
function OverviewIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function FinanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function DocumentsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function OperationsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m14.2 5.2l-4.2-4.2m0-6l-4.2-4.2" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export default function DashboardPage() {
  const {
    snapshot,
    status,
    error,
    streamingReply,
    setContext,
    setFinancials,
    analyze,
  } = useBrief();

  const [activeTab, setActiveTab] = useState("overview");
  const [documents, setDocuments] = useState<BusinessDocument[]>([
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
  ]);

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
    if (doc.type === "ledger") {
      const ledgerData = doc.data as Partial<Ledger>;
      if (ledgerData.cashOnHand !== undefined) {
        setFinancials({
          cashMmk: String(ledgerData.cashOnHand),
          receivablesMmk: String(
            ledgerData.receivables?.reduce((a: number, r) => a + r.amount, 0) ?? 0,
          ),
          upcomingMmk: String(
            (ledgerData.upcomingExpenses || []).reduce((a: number, p) => a + p.amount, 0),
          ),
          inventoryNote: snapshot.financials.inventoryNote,
        });
      }
    }
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
          <Button
            variant="ghost"
            onClick={() => void analyze()}
            disabled={running}
          >
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

            <Card className="border-primary/20 bg-primary/5">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                  <ChatIcon />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Need advice?</h3>
                  <p className="mt-1 text-sm text-muted">
                    Ask the AI advisor about your cash flow, collections, market position, or financial planning
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button href="/advisor" size="sm">
                      Open AI advisor
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const widget = document.querySelector('[aria-label="Open chat"]') as HTMLButtonElement;
                        widget?.click();
                      }}
                    >
                      Quick chat
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            <InsightsFeed insights={snapshot.insights} />
          </div>
        </TabPanel>

        <TabPanel value="finance" activeTab={activeTab}>
          <div className="space-y-6">
            <HealthBanner status={snapshot.health} summary={snapshot.healthSummary} />
            <MetricsRow metrics={snapshot.metrics} />
            <DocumentUpload onParsed={handleDocumentParsed} />
            <ContextForm
              context={snapshot.context}
              financials={snapshot.financials}
              onContext={setContext}
              onFinancials={setFinancials}
            />
          </div>
        </TabPanel>

        <TabPanel value="documents" activeTab={activeTab}>
          <DocumentLibrary
            documents={documents}
            onUpload={handleDocumentUpload}
            onDelete={(id) => setDocuments((prev) => prev.filter((d) => d.id !== id))}
            onDownload={(id) => console.log("Download", id)}
          />
        </TabPanel>

        <TabPanel value="operations" activeTab={activeTab}>
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold">Operations Dashboard</h2>
              <p className="mt-2 text-sm text-muted">
                Track inventory, suppliers, and day-to-day operations
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted">Active Suppliers</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {snapshot.context.teamSize * 2}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted">Inventory Items</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {documents.filter(d => d.type === "operational").length}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-sm text-muted">Pending Orders</p>
                  <p className="mt-2 text-2xl font-semibold">5</p>
                </div>
              </div>
            </Card>
            <InsightsFeed insights={snapshot.insights.filter(i => i.id === "supply" || i.id === "resources")} />
          </div>
        </TabPanel>

        <TabPanel value="analytics" activeTab={activeTab}>
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold">Business Analytics</h2>
              <p className="mt-2 text-sm text-muted">
                Insights into performance, trends, and market position
              </p>
            </Card>
            <InsightsFeed insights={snapshot.insights.filter(i => i.id === "analytics" || i.id === "market")} />
            <MetricsRow metrics={snapshot.metrics} />
          </div>
        </TabPanel>
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
