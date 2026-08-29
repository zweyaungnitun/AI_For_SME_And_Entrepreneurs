import { cn } from "@/lib/cn";
import type { HealthStatus } from "@/lib/brief/types";

const THEME: Record<
  HealthStatus,
  { wrap: string; word: string; meaning: string }
> = {
  TIGHT: {
    wrap: "border-risk/25 bg-[#fef2f2]",
    word: "text-risk",
    meaning: "This week's payable is larger than cash on hand.",
  },
  WATCH: {
    wrap: "border-watch/30 bg-[#fffbeb]",
    word: "text-watch",
    meaning: "Timing, overdue credit, or slow stock is under pressure.",
  },
  OK: {
    wrap: "border-ok/25 bg-[#ecfdf5]",
    word: "text-ok",
    meaning: "Near-term bills are covered on this snapshot.",
  },
};

export function HealthBanner({
  status,
  summary,
}: {
  status: HealthStatus;
  summary: string;
}) {
  const theme = THEME[status];

  return (
    <section
      id="health"
      aria-labelledby="health-label"
      className={cn(
        "rounded-[16px] border px-5 py-6 sm:px-7 sm:py-7",
        theme.wrap,
      )}
    >
      <p
        id="health-label"
        className="text-xs font-semibold uppercase tracking-[0.2em] text-muted"
      >
        Business health
      </p>
      <p
        className={cn(
          "mt-3 font-serif text-5xl font-semibold tracking-tight sm:text-6xl",
          theme.word,
        )}
      >
        {status}
      </p>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink sm:text-base">
        {summary || theme.meaning}
      </p>
    </section>
  );
}
