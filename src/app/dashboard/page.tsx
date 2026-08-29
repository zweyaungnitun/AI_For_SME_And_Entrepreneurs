"use client";

import { useState } from "react";
import { useBrief } from "@/components/brief/brief-provider";
import { ContextForm } from "@/components/dashboard/context-form";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { HealthBanner } from "@/components/dashboard/health-banner";
import { InsightsFeed } from "@/components/dashboard/insights-feed";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { PriorityCard, RiskCard } from "@/components/dashboard/priority-card";
import { DocumentLibrary, type BusinessDocument } from "@/components/documents/document-library";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabBar, TabPanel, type Tab } from "@/components/ui/tabs";
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

  const TABS: Tab[] = [
    { id: "overview", label: "Overview", icon: OverviewIcon },
    { id: "finance", label: "Finance", icon: FinanceIcon, badge: snapshot.insights.filter(i => i.id === "cashflow").length },
    { id: "documents", label: "Documents", icon: DocumentsIcon, badge: documents.length },
    { id: "operations", label: "Operations", icon: OperationsIcon },
    { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
  ];

  function handleDocumentParsed(doc: ParsedFinancialDoc) {
    if (doc.type === "ledger" && doc.data.cashOnHand !== undefined) {
      setFinancials({
        cashMmk: String(doc.data.cashOnHand),
        receivablesMmk: String(
          doc.data.receivables?.reduce((a, r) => a + r.amount, 0) ?? 0,
        ),
        upcomingMmk: String(
          doc.data.payables?.reduce((a, p) => a + p.amount, 0) ?? 0,
        ),
        inventoryNote: snapshot.financials.inventoryNote,
      });
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
    <AppShell>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight" suppressHydrationWarning>
              {greeting()}, {snapshot.context.name}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {snapshot.context.industry} · {snapshot.context.location} · Team of {snapshot.context.teamSize}
            </p>
          </div>
          <Button onClick={() => void analyze()} disabled={running}>
            {running ? "Analyzing…" : "Analyze now"}
          </Button>
        </div>

        {error && (
          <Card className="border-risk/30 bg-[#fef2f2] text-sm text-risk">{error}</Card>
        )}

        {running && streamingReply && (
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Live brief
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
              {streamingReply}
            </p>
          </Card>
        )}

        {/* Tab Navigation */}
        <TabBar tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {/* Tab Panels */}
        <TabPanel value="overview" activeTab={activeTab}>
          <div className="space-y-6">
            <HealthBanner status={snapshot.health} summary={snapshot.healthSummary} />
            <MetricsRow metrics={snapshot.metrics} />
            
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <PriorityCard priority={snapshot.priority} insightId={primaryInsightId} />
              <RiskCard risk={snapshot.risk} insightId={primaryInsightId} />
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
                    <Button href="/voice" size="sm">
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
    </AppShell>
  );
}
