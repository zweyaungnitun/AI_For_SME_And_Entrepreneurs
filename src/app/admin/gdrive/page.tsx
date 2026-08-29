"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  modifiedTime: string;
  webViewLink?: string;
};

type ConnectionStatus = {
  connected: boolean;
  provider: string;
  mcpServer: string;
  status: string;
};

export default function GoogleDrivePage() {
  const [status, setStatus] = useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  async function checkConnectionStatus() {
    try {
      setLoading(true);
      const response = await fetch("/api/gdrive/auth");
      const data = await response.json();
      setStatus(data);
      
      if (data.connected) {
        loadFiles();
      }
    } catch (error) {
      console.error("Failed to check connection status:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    try {
      setConnecting(true);
      const response = await fetch("/api/gdrive/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "connect" }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus((prev) => ({ ...prev!, connected: true, status: "active" }));
        loadFiles();
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      alert("Failed to connect to Google Drive. Please try again.");
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    try {
      const response = await fetch("/api/gdrive/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus((prev) => ({ ...prev!, connected: false, status: "not_configured" }));
        setFiles([]);
      }
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  async function loadFiles() {
    try {
      setLoadingFiles(true);
      const response = await fetch("/api/gdrive/files?fileType=spreadsheet");
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setLoadingFiles(false);
    }
  }

  async function handleImportFile(fileId: string, fileName: string) {
    try {
      const response = await fetch("/api/gdrive/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, fileName }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`File "${fileName}" downloaded successfully! You can now import it from your downloads.`);
      }
    } catch (error) {
      console.error("Failed to import file:", error);
      alert("Failed to import file. Please try again.");
    }
  }

  function formatBytes(bytes: string) {
    const num = parseInt(bytes);
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading Google Drive integration...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Google Drive Integration</h1>
            <p className="mt-1 text-sm text-muted">
              Import business data directly from your Google Drive
            </p>
          </div>
          <Button href="/admin" variant="secondary">
            Back to admin
          </Button>
        </div>

        {/* Connection Status */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">Connection Status</h2>
                <p className="mt-1 text-sm text-muted">
                  {status?.connected
                    ? "Connected to Google Drive via MCP"
                    : "Not connected. Click the button to authorize access"}
                </p>
              </div>
              {!status?.connected ? (
                <Button onClick={handleConnect} disabled={connecting}>
                  {connecting ? "Connecting..." : "Connect Google Drive"}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={loadFiles} variant="secondary" disabled={loadingFiles}>
                    {loadingFiles ? "Loading..." : "Refresh Files"}
                  </Button>
                  <Button onClick={handleDisconnect} variant="secondary">
                    Disconnect
                  </Button>
                </div>
              )}
            </div>

            {status?.connected && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-green-900 dark:text-green-300">
                      Successfully Connected
                    </p>
                    <p className="text-xs text-green-800 dark:text-green-200">
                      MCP Server: {status.mcpServer} · Status: {status.status}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Available Files */}
        {status?.connected && (
          <Card>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Available Files</h2>
                <p className="text-sm text-muted">
                  {files.length} {files.length === 1 ? "file" : "files"} found
                </p>
              </div>

              {loadingFiles ? (
                <div className="py-8 text-center">
                  <p className="text-muted">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="rounded-lg border border-border bg-muted/20 py-8 text-center">
                  <p className="text-muted">No Excel or CSV files found in your Google Drive</p>
                  <p className="mt-2 text-sm text-muted">
                    Upload financial documents to your Drive and click Refresh
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/20"
                    >
                      <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-2xl">
                          📊
                        </div>
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-xs text-muted">
                            {formatBytes(file.size)} · Modified {formatDate(file.modifiedTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {file.webViewLink && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(file.webViewLink, "_blank")}
                          >
                            View in Drive
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleImportFile(file.id, file.name)}
                        >
                          Import
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Setup Instructions */}
        <Card>
          <div className="space-y-4">
            <h3 className="font-semibold">Setup Instructions</h3>
            <div className="space-y-3 text-sm text-muted">
              <div className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <p>
                  Click <strong>&quot;Connect Google Drive&quot;</strong> to authorize access to your Drive files
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <p>
                  The system will show Excel and CSV files from your Google Drive
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <p>
                  Click <strong>&quot;Import&quot;</strong> to download and parse financial data
                </p>
              </div>
              <div className="flex gap-3">
                <span className="font-semibold text-primary">4.</span>
                <p>
                  Imported data will be available in your dashboard and financial reports
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* MCP Configuration */}
        <Card>
          <div className="space-y-3">
            <h3 className="font-semibold">Technical Details</h3>
            <div className="rounded-lg bg-muted/30 p-4">
              <p className="text-sm">
                <strong>Integration Method:</strong> Model Context Protocol (MCP)
              </p>
              <p className="mt-2 text-sm">
                <strong>MCP Server:</strong> @modelcontextprotocol/server-gdrive
              </p>
              <p className="mt-2 text-sm">
                <strong>Configuration File:</strong> .cursor/mcp.json
              </p>
              <p className="mt-2 text-sm text-muted">
                Secure, OAuth-based authentication via Cursor MCP integration
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
