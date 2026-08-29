import { runCrew } from "@/lib/agents/orchestrator";
import type { BusinessContext, RunRequest } from "@/lib/agents/types";
import type { Ledger } from "@/lib/ledger/types";
import { getShop, isKnownShop } from "@/lib/sme/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FRIENDLY = "Unable to analyze the shop right now.";

function isContext(value: unknown): value is BusinessContext {
  if (!value || typeof value !== "object") return false;
  const c = value as Record<string, unknown>;
  return typeof c.name === "string" && typeof c.industry === "string";
}

function isSnapshot(value: unknown): value is Partial<Ledger> {
  return Boolean(value) && typeof value === "object";
}

export async function POST(req: Request) {
  const body = (await req.json()) as Partial<RunRequest>;
  const message = body.message?.trim();
  if (!message) {
    return Response.json({ error: "message is required" }, { status: 400 });
  }

  const shop = getShop(isKnownShop(body.shopId) ? body.shopId : undefined);
  const input: RunRequest = {
    message,
    sessionId: body.sessionId,
    shopId: shop.id,
    context: isContext(body.context) ? { ...shop.context, ...body.context } : shop.context,
    snapshot: isSnapshot(body.snapshot) ? body.snapshot : undefined,
  };

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runCrew(input)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
      } catch {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", error: FRIENDLY })}\n\n`),
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
