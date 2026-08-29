"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type Tab = {
  id: string;
  label: string;
  icon: React.ComponentType;
  badge?: number;
};

type TabBarProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "pills";
};

export function TabBar({ tabs, activeTab, onChange, variant = "default" }: TabBarProps) {
  if (variant === "pills") {
    return (
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface text-muted hover:bg-muted/50 hover:text-ink",
              )}
            >
              <Icon />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:border-border hover:text-ink",
              )}
            >
              <Icon />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function TabPanel({
  children,
  value,
  activeTab,
}: {
  children: React.ReactNode;
  value: string;
  activeTab: string;
}) {
  if (value !== activeTab) return null;
  return <div className="animate-fade-in">{children}</div>;
}
