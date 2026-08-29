import { cn } from "@/lib/cn";
import type { HealthStatus } from "@/lib/brief/types";

const healthStyles: Record<HealthStatus, string> = {
  OK: "bg-[#ecfdf5] text-ok",
  WATCH: "bg-[#fffbeb] text-watch",
  RISK: "bg-[#fef2f2] text-risk",
};

export function Badge({
  children,
  className,
  tone,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "neutral" | "ok" | "watch" | "risk";
}) {
  const palette =
    tone === "ok"
      ? healthStyles.OK
      : tone === "watch"
        ? healthStyles.WATCH
        : tone === "risk"
          ? healthStyles.RISK
          : "bg-[#f3f4f6] text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
        palette,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function HealthBadge({ status }: { status: HealthStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        healthStyles[status],
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "OK" && "bg-ok",
          status === "WATCH" && "bg-watch",
          status === "RISK" && "bg-risk",
        )}
      />
      {status}
    </span>
  );
}
