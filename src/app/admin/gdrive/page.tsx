"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GoogleDrivePage() {
  const [connected, setConnected] = useState(false);
  const [files, setFiles] = useState<Array<{ name: string; id: string; modifiedTime: string }>>([]);

  async function handleConnect() {
    // This would use the Google Drive MCP in production
    setConnected(true);
    // Simulate fetching files
    setFiles([
      { name: "Q1_2026_Financials.xlsx", id: "1", modifiedTime: "2026-03-31" },
      { name: "Inventory_August.csv", id: "2", modifiedTime: "2026-08-28" },
      { name: "Customer_Ledger.xlsx", id: "3", modifiedTime: "2026-08-15" },
    ]);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Google Drive integration</h1>
            <p className="mt-1 text-sm text-muted">
              Import business data directly from Google Drive
            </p>
          </div>
          <Button href="/admin" variant="secondary">
            Back to admin
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">Connection status</h2>
                <p className="mt-1 text-sm text-muted">
                  {connected
                    ? "Connected to Google Drive"
                    : "Connect your Google Drive to import files"}
                </p>
              </div>
              {!connected ? (
                <Button onClick={handleConnect}>Connect Google Drive</Button>
              ) : (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Connected
                </span>
              )}
            </div>

            {connected && (
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm">
                  <strong>MCP Server:</strong> Google Drive
                </p>
                <p className="mt-1 text-sm text-muted">
                  Using Model Context Protocol for secure file access
                </p>
              </div>
            )}
          </div>
        </Card>

        {connected && files.length > 0 && (
          <Card>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
              Available files
            </h2>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-muted">Modified: {file.modifiedTime}</p>
                  </div>
                  <Button size="sm" variant="secondary">
                    Import
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="mb-3 font-semibold">Setup instructions</h3>
          <ol className="space-y-2 text-sm text-muted">
            <li>1. Click &quot;Connect Google Drive&quot; to authorize access</li>
            <li>2. Select the folder containing your business data files</li>
            <li>3. Choose files to import (Excel or CSV format)</li>
            <li>4. Data will be parsed and validated before import</li>
            <li>5. Imported data appears in the business workspace</li>
          </ol>
        </Card>

        <Card>
          <h3 className="mb-3 font-semibold">MCP Configuration</h3>
          <p className="mb-3 text-sm text-muted">
            Add this to your <code className="rounded bg-muted px-1 py-0.5">.cursor/mcp.json</code>:
          </p>
          <pre className="overflow-x-auto rounded-lg bg-ink p-4 text-xs text-white">
{`{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-gdrive"
      ]
    }
  }
}`}
          </pre>
        </Card>
      </div>
    </AppShell>
  );
}
