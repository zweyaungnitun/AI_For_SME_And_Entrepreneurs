import { cn } from "@/lib/cn";

export type VoiceStatus = "idle" | "listening" | "processing" | "speaking" | "error";

const LABELS: Record<VoiceStatus, string> = {
  idle: "Ready",
  listening: "Listening",
  processing: "Processing",
  speaking: "Speaking",
  error: "Mic unavailable",
};

export function VoiceVisualizer({ status }: { status: VoiceStatus }) {
  const active = status === "listening" || status === "speaking";
  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
          "grid h-28 w-28 place-items-center rounded-full border",
          status === "listening" && "border-primary bg-[#eff6ff]",
          status === "processing" && "border-watch bg-[#fffbeb]",
          status === "speaking" && "border-ok bg-[#ecfdf5]",
          status === "error" && "border-risk bg-[#fef2f2]",
          status === "idle" && "border-border bg-surface",
        )}
      >
        <div className="flex h-10 items-end gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                "wave-bar w-1 rounded-full bg-primary",
                active ? "h-8 origin-bottom" : "h-3",
              )}
              style={
                active
                  ? {
                      animation: `wave 0.9s ease-in-out ${i * 0.08}s infinite`,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold",
          status === "listening" && "bg-[#eff6ff] text-primary",
          status === "processing" && "bg-[#fffbeb] text-watch",
          status === "speaking" && "bg-[#ecfdf5] text-ok",
          status === "error" && "bg-[#fef2f2] text-risk",
          status === "idle" && "bg-[#f3f4f6] text-muted",
        )}
      >
        {LABELS[status]}
      </span>
    </div>
  );
}
