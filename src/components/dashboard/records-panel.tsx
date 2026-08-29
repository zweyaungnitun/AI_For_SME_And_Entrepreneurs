"use client";

import { useEffect, useState } from "react";
import { ContextForm } from "@/components/dashboard/context-form";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { InsightsFeed } from "@/components/dashboard/insights-feed";
import { MetricsRow } from "@/components/dashboard/metrics-row";
import { DocumentLibrary, type BusinessDocument } from "@/components/documents/document-library";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { BusinessSnapshot, FinancialInputs } from "@/lib/brief/types";
import type { BusinessContext } from "@/lib/agents/types";
import type { ParsedFinancialDoc } from "@/lib/docs/parser";

export type RecordSection = "numbers" | "documents" | "operations" | "analytics";

const SECTIONS: { id: RecordSection; label: string }[] = [
  { id: "numbers", label: "Numbers" },
  { id: "documents", label: "Documents" },
  { id: "operations", label: "Operations" },
  { id: "analytics", label: "Analytics" },
];

export function mapTabParam(tab: string | null): RecordSection | null {
  if (tab === "finance" || tab === "numbers") return "numbers";
  if (tab === "documents") return "documents";
  if (tab === "operations") return "operations";
  if (tab === "analytics") return "analytics";
  return null;
}

export function RecordsPanel({
  snapshot,
  documents,
  initialSection,
  forceOpen,
  onContext,
  onFinancials,
  onParsed,
  onUpload,
  onDelete,
  onDownload,
}: {
  snapshot: BusinessSnapshot;
  documents: BusinessDocument[];
  initialSection?: RecordSection | null;
  forceOpen?: boolean;
  onContext: (patch: Partial<BusinessContext>) => void;
  onFinancials: (patch: Partial<FinancialInputs>) => void;
  onParsed: (doc: ParsedFinancialDoc) => void;
  onUpload: (file: File, type: BusinessDocument["type"]) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  const [open, setOpen] = useState(Boolean(forceOpen || initialSection));
  const [section, setSection] = useState<RecordSection>(initialSection ?? "numbers");

  useEffect(() => {
    if (initialSection) {
      setOpen(true);
      setSection(initialSection);
      window.requestAnimationFrame(() => {
        document.getElementById("records")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [initialSection]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <section id="records" className="space-y-4 border-t border-border pt-8">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Business records
          </p>
          <h2 className="mt-2 text-lg font-semibold text-ink">
            Numbers, documents, operations, analytics
          </h2>
          <p className="mt-1 text-sm text-muted">
            The books sit here. They are not the decision.
          </p>
        </div>
        <span className="mt-1 shrink-0 text-sm font-medium text-primary">
          {open ? "Hide" : "Open"}
        </span>
      </button>

      {open ? (
        <div className="space-y-5">
          <div className="flex flex-wrap gap-1 border-b border-border">
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                  section === item.id
                    ? "border-ink text-ink"
                    : "border-transparent text-muted hover:text-ink",
                )}
              >
                {item.label}
                {item.id === "documents" ? ` (${documents.length})` : ""}
              </button>
            ))}
          </div>

          {section === "numbers" ? (
            <div className="space-y-4">
              <ContextForm
                context={snapshot.context}
                financials={snapshot.financials}
                onContext={onContext}
                onFinancials={onFinancials}
              />
              <DocumentUpload onParsed={onParsed} />
              <MetricsRow metrics={snapshot.metrics} />
            </div>
          ) : null}

          {section === "documents" ? (
            <DocumentLibrary
              documents={documents}
              onUpload={onUpload}
              onDelete={onDelete}
              onDownload={onDownload}
            />
          ) : null}

          {section === "operations" ? (
            <div className="space-y-4">
              <Card>
                <h3 className="text-lg font-semibold">Operations</h3>
                <p className="mt-2 text-sm text-muted">
                  Inventory, suppliers, and day-to-day operations for this shop.
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <Stat
                    label="Active suppliers"
                    value={String(snapshot.context.teamSize * 2)}
                  />
                  <Stat
                    label="Inventory items"
                    value={String(
                      documents.filter((doc) => doc.type === "operational").length,
                    )}
                  />
                  <Stat label="Pending orders" value="5" />
                </div>
              </Card>
              <InsightsFeed
                heading=""
                insights={snapshot.insights.filter(
                  (item) => item.id === "supply" || item.id === "resources",
                )}
              />
            </div>
          ) : null}

          {section === "analytics" ? (
            <div className="space-y-4">
              <Card>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="mt-2 text-sm text-muted">
                  This snapshot only — not a forecast.
                </p>
              </Card>
              <InsightsFeed
                heading=""
                insights={snapshot.insights.filter(
                  (item) => item.id === "analytics" || item.id === "market",
                )}
              />
              <MetricsRow metrics={snapshot.metrics} />
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
