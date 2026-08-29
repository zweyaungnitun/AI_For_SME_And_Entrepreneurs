import type { DecisionCard } from "@/lib/ledger/types";
import type { ChatTurn } from "@/lib/agents/types";
import { ensureDb } from "@/lib/db/ensure";
import { getSql } from "@/lib/db/client";

export async function persistRun(args: {
  sessionId: string;
  shopId: string;
  ask: string;
  card: DecisionCard;
  turns: ChatTurn[];
}) {
  if (!(await ensureDb())) return;
  try {
    const sql = getSql();
    await sql`
      INSERT INTO sessions (id, shop_id)
      VALUES (${args.sessionId}, ${args.shopId})
      ON CONFLICT (id) DO NOTHING
    `;
    await sql`
      INSERT INTO runs (id, session_id, shop_id, ask, health, card)
      VALUES (
        ${crypto.randomUUID()}, ${args.sessionId}, ${args.shopId}, ${args.ask},
        ${args.card.businessHealth}, ${JSON.stringify(args.card)}::jsonb
      )
    `;
    for (const turn of args.turns.slice(-2)) {
      await sql`
        INSERT INTO messages (id, session_id, role, content)
        VALUES (${crypto.randomUUID()}, ${args.sessionId}, ${turn.role}, ${turn.content})
      `;
    }
  } catch (err) {
    console.error("[foundry] persist run failed", err);
  }
}
