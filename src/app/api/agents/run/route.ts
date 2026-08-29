import { runCrew } from "@/lib/agents/orchestrator";
import { DEFAULT_CONTEXT } from "@/lib/agents/defaults";
import type { BusinessContext, RunRequest } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isContext(value: unknown): value is BusinessContext {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.name === "string" &&
    typeof c.industry === "string" &&
    typeof c.stage === "string" &&
    typeof c.location === "string" &&
    typeof c.teamSize === "number" &&
    typeof c.challenge === "string"
  );
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<RunRequest>;
  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const input: RunRequest = {
    message,
    sessionId: body.sessionId,
    context: isContext(body.context) ? body.context : DEFAULT_CONTEXT,
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runCrew(input)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } catch (error) {
        const err = error instanceof Error ? error.message : "crew failed";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: err })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
