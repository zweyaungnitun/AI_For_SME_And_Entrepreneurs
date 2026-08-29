"use client";

import { useState } from "react";
import { useBrief } from "@/components/brief/brief-provider";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HealthBadge } from "@/components/ui/badge";
import { SHOPS } from "@/lib/sme/catalog";
import { analyzeLedger } from "@/lib/ledger/analyze";
import { mmk } from "@/lib/ledger/types";

export default function AdminDashboard() {
  const { loadVenture } = useBrief();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  const businessList = SHOPS.map((shop) => {
    const analysis = analyzeLedger(shop.ledger);
    return {
      ...shop,
      analysis,
      totalReceivables: shop.ledger.receivables.reduce((a, r) => a + r.amount, 0),
      totalPayables: shop.ledger.upcomingExpenses.reduce((a, e) => a + e.amount, 0),
    };
  });

  function handleOpenBusiness(shopId: string) {
    loadVenture(shopId);
    // Navigate to dashboard in a real app
    window.location.href = "/dashboard";
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted">
              Manage all business workspaces · {SHOPS.length} active
            </p>
          </div>
          <div className="flex gap-2">
            <Button href="/enter" variant="secondary">
              Switch workspace
            </Button>
            <Button href="/admin/import">Import new business</Button>
          </div>
        </div>

        <Card>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
              Business overview
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-2xl font-semibold">{businessList.length}</p>
                <p className="text-sm text-muted">Total businesses</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-2xl font-semibold">
                  {businessList.filter((b) => b.analysis.businessHealth === "OK").length}
                </p>
                <p className="text-sm text-muted">Healthy businesses</p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-2xl font-semibold">
                  {businessList.filter((b) => b.analysis.businessHealth === "TIGHT").length}
                </p>
                <p className="text-sm text-muted">Need attention</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
            All businesses
          </h2>
          <div className="space-y-3">
            {businessList.map((business) => (
              <div
                key={business.id}
                className={`rounded-lg border p-4 transition-colors ${
                  selectedShop === business.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
                onClick={() => setSelectedShop(business.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{business.context.name}</h3>
                      <HealthBadge status={business.analysis.businessHealth} />
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {business.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {business.context.industry} · {business.context.location} · Team of{" "}
                      {business.context.teamSize}
                    </p>
                    <p className="mt-2 text-sm">{business.context.challenge}</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted">Cash on hand</p>
                        <p className="mt-1 font-medium">{mmk(business.ledger.cashOnHand)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Receivables</p>
                        <p className="mt-1 font-medium">{mmk(business.totalReceivables)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Payables</p>
                        <p className="mt-1 font-medium">{mmk(business.totalPayables)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted">Inventory lines</p>
                        <p className="mt-1 font-medium">{business.ledger.inventory.length}</p>
                      </div>
                    </div>

                    {business.analysis.topCustomer && (
                      <div className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm dark:bg-amber-900/20">
                        Priority: Collect {business.analysis.topCustomer.customer} (
                        {mmk(business.analysis.topCustomer.amount)},{" "}
                        {business.analysis.topCustomer.overdueDays}d overdue)
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => handleOpenBusiness(business.id)}>
                      Open workspace
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/admin/business/${business.id}`;
                      }}
                    >
                      View details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
            Quick actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button href="/admin/import" variant="secondary" size="sm">
              Import from Excel
            </Button>
            <Button href="/admin/gdrive" variant="secondary" size="sm">
              Connect Google Drive
            </Button>
            <Button href="/admin/export" variant="secondary" size="sm">
              Export all data
            </Button>
            <Button href="/admin/settings" variant="secondary" size="sm">
              Admin settings
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
