"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandLink, BrandMark } from "@/components/layout/brand-mark";
import { useBrief } from "@/components/brief/brief-provider";
import { ChatbotWidget } from "@/components/chat/chatbot-widget";
import { HealthBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: GridIcon },
  { href: "/insight", label: "Insight", icon: InsightIcon },
  { href: "/advisor", label: "AI Advisor", icon: MicIcon },
];

const RECORDS_NAV = [
  { href: "/dashboard?tab=finance", label: "Numbers" },
  { href: "/dashboard?tab=documents", label: "Documents" },
  { href: "/dashboard?tab=operations", label: "Operations" },
  { href: "/dashboard?tab=analytics", label: "Analytics" },
];

const TOOLS_NAV = [
  { href: "/admin", label: "Admin" },
  { href: "/admin/import", label: "Import" },
  { href: "/admin/gdrive", label: "Google Drive" },
  { href: "/financial", label: "Financial files" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const showChatbot = !pathname.startsWith("/admin") && !pathname.startsWith("/enter");
  const toolsDefaultOpen = pathname.startsWith("/admin") || pathname.startsWith("/financial");

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
        <div className="px-5 py-5">
          <BrandLink size="sm" />
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Who owes you. Where cash is tight. What to do today.
          </p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
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

          <details className="group px-1">
            <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
              Records
            </summary>
            <div className="mt-1 space-y-0.5">
              {RECORDS_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-2 text-sm text-muted hover:bg-muted/20 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>

          <details className="group px-1" open={toolsDefaultOpen}>
            <summary className="cursor-pointer list-none rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
              Workspace tools
            </summary>
            <div className="mt-1 space-y-0.5">
              {TOOLS_NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-xl px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:bg-muted/20 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </details>
        </nav>

        <WorkspaceFooter />
      </aside>

      <div className="lg:pl-60">
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
              <p className="mt-2 px-1 text-xs text-muted">
                Who owes you. Where cash is tight. What to do today.
              </p>

              <nav className="mt-6 space-y-6">
                <div className="space-y-1">
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
                    Records
                  </p>
                  {RECORDS_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm text-muted hover:bg-muted/20 hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Workspace tools
                  </p>
                  {TOOLS_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-xl px-3 py-2 text-sm",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted hover:bg-muted/20 hover:text-ink",
                      )}
                    >
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
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-ink">{snapshot.context.name}</p>
          <p className="mt-1 text-xs text-muted">{snapshot.context.location}</p>
        </div>
        <HealthBadge status={snapshot.health} />
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

function TodayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
