import type { AgentEvent, BusinessContext } from "@/lib/agents/types";

export type CrewStreamEvent =
  | AgentEvent
  | { type: "error"; error: string };

export async function runCrewStream(
  input: { message: string; sessionId?: string; context: BusinessContext },
  onEvent: (event: CrewStreamEvent) => void,
) {
  const res = await fetch("/api/agents/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok || !res.body) {
    onEvent({ type: "error", error: "Unable to analyze the business right now." });
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";
    for (const chunk of chunks) {
      const line = chunk.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      try {
        onEvent(JSON.parse(line.slice(6)) as CrewStreamEvent);
      } catch {
        /* ignore partial JSON */
      }
    }
  }
}
