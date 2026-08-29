"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentUpload } from "@/components/dashboard/document-upload";
import { ImportDataPreview } from "@/components/admin/import-data-preview";
import type { ParsedFinancialDoc } from "@/lib/docs/parser";

export default function AdminImportPage() {
  const [importedDoc, setImportedDoc] = useState<ParsedFinancialDoc | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSaveImport() {
    if (!importedDoc) return;
    setSaving(true);
    
    // Simulate saving to database
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSaving(false);
    alert("Business data imported successfully!");
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Import business data</h1>
            <p className="mt-1 text-sm text-muted">
              Upload Excel or CSV files from your businesses
            </p>
          </div>
          <Button href="/admin" variant="secondary">
            Back to admin
          </Button>
        </div>

        <DocumentUpload onParsed={setImportedDoc} />

        {importedDoc && (
          <>
            <ImportDataPreview doc={importedDoc} />
            
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Ready to import</h3>
                  <p className="mt-1 text-sm text-muted">
                    {importedDoc.metadata.rowCount} rows from {importedDoc.metadata.fileName}
                  </p>
                </div>
                <Button onClick={handleSaveImport} disabled={saving}>
                  {saving ? "Saving..." : "Save to workspace"}
                </Button>
              </div>
            </Card>
          </>
        )}

        <Card>
          <h3 className="mb-3 font-semibold">Import instructions</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li>• Ledger format: Include columns for Cash, Receivables, Payables, Customer</li>
            <li>• Transaction format: Date, Amount, Description, Type (income/expense)</li>
            <li>• Inventory format: Product, Quantity, Cost, Sold</li>
            <li>• Excel (.xlsx, .xls) and CSV files are supported</li>
            <li>• Data will be validated before import</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
