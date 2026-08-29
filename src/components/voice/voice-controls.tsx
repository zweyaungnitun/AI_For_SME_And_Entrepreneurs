"use client";

import { Button } from "@/components/ui/button";
import type { VoiceStatus } from "./voice-visualizer";

export function VoiceControls({
  status,
  draft,
  onDraft,
  onTalk,
  onStop,
  onSend,
}: {
  status: VoiceStatus;
  draft: string;
  onDraft: (value: string) => void;
  onTalk: () => void;
  onStop: () => void;
  onSend: () => void;
}) {
  const listening = status === "listening";
  const busy = status === "processing";

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        onSend();
      }}
    >
      {listening ? (
        <Button type="button" variant="danger" onClick={onStop}>
          Stop
        </Button>
      ) : (
        <Button type="button" variant="secondary" onClick={onTalk} disabled={busy}>
          Talk
        </Button>
      )}
      <label className="block flex-1 text-xs font-medium text-muted">
        Type a message
        <input
          className="mt-1 w-full rounded-full border border-border bg-white px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
          value={draft}
          placeholder="Who should I follow up for payment?"
          onChange={(e) => onDraft(e.target.value)}
          disabled={busy || listening}
        />
      </label>
      <Button type="submit" disabled={busy || listening || !draft.trim()}>
        Send
      </Button>
    </form>
  );
}
