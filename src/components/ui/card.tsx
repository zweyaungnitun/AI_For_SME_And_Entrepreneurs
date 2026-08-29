import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-[12px] border border-border bg-surface p-5 shadow-[0_1px_2px_rgba(17,24,39,0.04)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
