import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandMark({
  size = "md",
  inverted = false,
}: {
  size?: "sm" | "md";
  inverted?: boolean;
}) {
  const box = size === "sm" ? "h-8 w-8 text-xs" : "h-9 w-9 text-sm";
  const type = size === "sm" ? "text-base" : "text-lg";
  return (
    <span className="flex items-center gap-2.5">
      <span
        className={cn(
          "grid place-items-center rounded-lg font-semibold text-white",
          box,
          inverted ? "bg-white/15" : "bg-primary",
        )}
      >
        SC
      </span>
      <span className={cn("font-semibold tracking-tight", type, inverted ? "text-white" : "text-ink")}>
        SME Copilot
      </span>
    </span>
  );
}

export function BrandLink({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <Link href="/" className="hover:opacity-90">
      <BrandMark size={size} />
    </Link>
  );
}
