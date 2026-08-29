"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBrief } from "@/components/brief/brief-provider";
import { AnalysisSections } from "@/components/insight/analysis-sections";
import { EvidenceList } from "@/components/insight/evidence-list";
import { InsightHeader } from "@/components/insight/insight-header";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DEMO_SNAPSHOT } from "@/lib/brief/demo-data";

function InsightView() {
  const params = useSearchParams();
  const { snapshot } = useBrief();
  const [copied, setCopied] = useState(false);

  const insight = useMemo(() => {
    const id = params.get("id");
    return (
      snapshot.insights.find((item) => item.id === id) ??
      snapshot.insights[0] ??
      DEMO_SNAPSHOT.insights[0]
    );
  }, [params, snapshot.insights]);

  async function copyAction() {
    try {
      await navigator.clipboard.writeText(insight.action);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5">
      <InsightHeader insight={insight} />
      <Card className="border-primary/20 bg-[#eff6ff]">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          Today&apos;s priority
        </p>
        <p className="mt-2 font-semibold">{insight.action}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" onClick={() => void copyAction()}>
            {copied ? "Copied" : "Do this today"}
          </Button>
          <Button
            href={`/voice?prompt=${encodeURIComponent(insight.action)}`}
            variant="secondary"
            size="sm"
          >
            Ask in voice
          </Button>
        </div>
      </Card>
      <AnalysisSections insight={insight} />
      <EvidenceList items={insight.evidence} />
      <div className="flex flex-wrap gap-2">
        <Button href="/voice" variant="secondary">
          Ask in voice
        </Button>
        <Button href="/dashboard" variant="ghost">
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}

export default function InsightPage() {
  return (
    <AppShell>
      <Suspense
        fallback={
          <p className="text-sm text-muted">Loading insight…</p>
        }
      >
        <InsightView />
      </Suspense>
    </AppShell>
  );
}
