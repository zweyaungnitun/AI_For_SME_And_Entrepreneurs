"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { parseFinancialDocument, type ParsedFinancialDoc } from "@/lib/docs/parser";

type UploadProps = {
  onParsed: (doc: ParsedFinancialDoc) => void;
};

export function DocumentUpload({ onParsed }: UploadProps) {
  const [status, setStatus] = useState<"idle" | "parsing" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setStatus("parsing");
    setError(null);
    setFileName(file.name);

    try {
      const parsed = await parseFinancialDocument(file);
      setStatus("success");
      onParsed(parsed);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Failed to parse document");
    }
  }

  return (
    <Card className="relative">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">Import financial data</h3>
            <p className="mt-1 text-sm text-muted">
              Upload Excel or CSV with transactions, ledger, or inventory
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={status === "parsing"}
          >
            {status === "parsing" ? "Processing..." : "Choose file"}
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        {status === "success" && (
          <div className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-900 dark:bg-green-900/20 dark:text-green-300">
            ✓ Imported {fileName}
          </div>
        )}

        {status === "error" && error && (
          <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-900 dark:bg-red-900/20 dark:text-red-300">
            {error}
          </div>
        )}

        <details className="text-xs text-muted">
          <summary className="cursor-pointer">Supported formats</summary>
          <ul className="mt-2 space-y-1 pl-4">
            <li>• Ledger: columns like Cash, Receivables, Payables, Customer, Supplier</li>
            <li>• Transactions: Date, Amount, Description, Type (income/expense)</li>
            <li>• Inventory: Product, Quantity, Cost, Sold</li>
          </ul>
        </details>
      </div>
    </Card>
  );
}
