"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLink, BrandMark } from "@/components/layout/brand-mark";
import { useBrief } from "@/components/brief/brief-provider";
import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: GridIcon },
  { href: "/insight", label: "Insight", icon: InsightIcon },
  { href: "/voice", label: "Voice", icon: MicIcon },
];

const ADMIN_NAV = [
  { href: "/admin", label: "Admin Panel", icon: AdminIcon },
  { href: "/admin/import", label: "Import Data", icon: UploadIcon },
  { href: "/admin/gdrive", label: "Google Drive", icon: DriveIcon },
];

const QUICK_ACTIONS = [
  { href: "/dashboard?tab=finance", label: "Financials", icon: DollarIcon },
  { href: "/dashboard?tab=documents", label: "Documents", icon: FileIcon },
  { href: "/dashboard?tab=analytics", label: "Analytics", icon: ChartIcon },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const showChatbot = !pathname.startsWith("/admin") && !pathname.startsWith("/enter");
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <div className="px-5 py-5">
          <BrandLink size="sm" />
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Main
            </p>
            <div className="space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:bg-muted/20 hover:text-ink",
                    )}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Quick Access
            </p>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-muted/20 hover:text-ink"
                >
                  <item.icon />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Section */}
          <div>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Admin Tools
            </p>
            <div className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:bg-muted/20 hover:text-ink",
                    )}
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        <WorkspaceFooter />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur lg:hidden">
          <BrandLink size="sm" />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-xl border border-border"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <MenuIcon open={open} />
          </button>
        </header>

        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/30"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-surface p-4 shadow-xl">
              <BrandMark size="sm" />
              
              {/* Mobile Nav */}
              <nav className="mt-6 space-y-6">
                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Main
                  </p>
                  {NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-ink hover:bg-muted/20",
                      )}
                    >
                      <item.icon />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Quick Access
                  </p>
                  {QUICK_ACTIONS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted hover:bg-muted/20 hover:text-ink"
                    >
                      <item.icon />
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Admin Tools
                  </p>
                  {ADMIN_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted hover:bg-muted/20",
                      )}
                    >
                      <item.icon />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="mt-6">
                <WorkspaceFooter />
              </div>
            </div>
          </div>
        ) : null}

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {showChatbot && <ChatbotWidget />}
    </div>
  );
}

function WorkspaceFooter() {
  const { snapshot } = useBrief();
  return (
    <div className="space-y-3 border-t border-border px-5 py-4">
      <div>
        <p className="text-xs font-semibold text-ink">{snapshot.context.name}</p>
        <p className="mt-1 text-xs text-muted">{snapshot.context.location}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span className="text-muted">Workspace active</span>
      </div>
      <Link
        href="/enter"
        className="block rounded-lg border border-border px-3 py-2 text-center text-xs font-medium text-muted transition-colors hover:border-primary hover:text-primary"
      >
        Switch workspace
      </Link>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function InsightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v4M12 17v4M4.9 6.5l2.8 2.8M16.3 14.7l2.8 2.8M3 12h4M17 12h4M4.9 17.5l2.8-2.8M16.3 9.3l2.8-2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 11a6 6 0 0 0 12 0M12 17v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AdminIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function DriveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
