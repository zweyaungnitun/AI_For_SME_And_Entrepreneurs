"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type BusinessDocument = {
  id: string;
  name: string;
  type: "financial" | "legal" | "operational" | "marketing" | "hr" | "other";
  category: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  fileType: string;
  tags: string[];
};

type DocumentLibraryProps = {
  documents: BusinessDocument[];
  onUpload: (file: File, type: BusinessDocument["type"]) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string) => void;
};

const DOCUMENT_TYPES = [
  { id: "financial", label: "Financial", icon: "📊", color: "bg-blue-100 text-blue-800" },
  { id: "legal", label: "Legal", icon: "⚖️", color: "bg-purple-100 text-purple-800" },
  { id: "operational", label: "Operations", icon: "⚙️", color: "bg-green-100 text-green-800" },
  { id: "marketing", label: "Marketing", icon: "📢", color: "bg-orange-100 text-orange-800" },
  { id: "hr", label: "HR & Team", icon: "👥", color: "bg-pink-100 text-pink-800" },
  { id: "other", label: "Other", icon: "📁", color: "bg-gray-100 text-gray-800" },
] as const;

export function DocumentLibrary({ documents, onUpload, onDelete, onDownload }: DocumentLibraryProps) {
  const [activeType, setActiveType] = useState<BusinessDocument["type"] | "all">("all");
  const [uploading, setUploading] = useState(false);

  const filteredDocs = activeType === "all"
    ? documents
    : documents.filter((d) => d.type === activeType);

  function handleFileUpload(file: File, type: BusinessDocument["type"]) {
    setUploading(true);
    onUpload(file, type);
    setTimeout(() => setUploading(false), 1000);
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-6">
      {/* Document Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeType === "all"
              ? "bg-primary text-white"
              : "bg-surface text-muted hover:bg-muted/50"
          }`}
        >
          All Documents ({documents.length})
        </button>
        {DOCUMENT_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id as BusinessDocument["type"])}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeType === type.id
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:bg-muted/50"
            }`}
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {documents.filter((d) => d.type === type.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Upload Section */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Upload documents</h3>
            <p className="mt-1 text-sm text-muted">
              Add financial records, contracts, reports, and other business files
            </p>
          </div>
          <label>
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, activeType === "all" ? "other" : activeType);
              }}
              disabled={uploading}
            />
            <Button as="span" disabled={uploading}>
              {uploading ? "Uploading..." : "Choose file"}
            </Button>
          </label>
        </div>
      </Card>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <Card className="text-center">
          <div className="py-12">
            <p className="text-4xl">📄</p>
            <p className="mt-4 font-medium text-muted">No documents yet</p>
            <p className="mt-2 text-sm text-muted">
              Upload your first document to get started
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocs.map((doc) => {
            const docType = DOCUMENT_TYPES.find((t) => t.id === doc.type);
            return (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{docType?.icon || "📄"}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted mt-1">{doc.category}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${docType?.color}`}>
                        {docType?.label}
                      </span>
                      <span className="text-xs text-muted">{formatFileSize(doc.size)}</span>
                    </div>
                    <p className="text-xs text-muted mt-2">
                      {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => onDownload(doc.id)}
                  >
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onDelete(doc.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
