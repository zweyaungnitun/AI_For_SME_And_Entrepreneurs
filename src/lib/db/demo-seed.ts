import { buildDemoCard, formatCard } from "@/lib/agents/decision";
import { getSql } from "@/lib/db/client";
import { SHOPS } from "@/lib/sme/catalog";

export type TableCounts = {
  shops: number;
  payables: number;
  receivables: number;
  inventory: number;
  sessions: number;
  messages: number;
  runs: number;
  knowledge_chunks: number;
  knowledge_with_embedding: number;
};

export async function seedDemoConversations() {
  const sql = getSql();
  for (const shop of SHOPS) {
    const sessionId = `demo-session-${shop.id}`;
    const runId = `demo-run-${shop.id}`;
    const ask = shop.prompts[0] ?? "What should I do today so cash does not break?";
    const card = buildDemoCard(shop.ledger, "en", shop.context.name);
    const reply = formatCard(card, false);

    await sql`
      INSERT INTO sessions (id, shop_id)
      VALUES (${sessionId}, ${shop.id})
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO messages (id, session_id, role, content)
      VALUES (${`${sessionId}-user`}, ${sessionId}, 'user', ${ask})
      ON CONFLICT (id) DO NOTHING
    `;
    await sql`
      INSERT INTO messages (id, session_id, role, content)
      VALUES (${`${sessionId}-assistant`}, ${sessionId}, 'assistant', ${reply})
      ON CONFLICT (id) DO NOTHING
    `;

    await sql`
      INSERT INTO runs (id, session_id, shop_id, ask, health, card)
      VALUES (
        ${runId}, ${sessionId}, ${shop.id}, ${ask},
        ${card.businessHealth}, ${JSON.stringify(card)}::jsonb
      )
      ON CONFLICT (id) DO NOTHING
    `;
  }
}

export async function countTables(): Promise<TableCounts> {
  const sql = getSql();
  const row = (await sql`
    SELECT
      (SELECT COUNT(*)::int FROM shops) AS shops,
      (SELECT COUNT(*)::int FROM payables) AS payables,
      (SELECT COUNT(*)::int FROM receivables) AS receivables,
      (SELECT COUNT(*)::int FROM inventory) AS inventory,
      (SELECT COUNT(*)::int FROM sessions) AS sessions,
      (SELECT COUNT(*)::int FROM messages) AS messages,
      (SELECT COUNT(*)::int FROM runs) AS runs,
      (SELECT COUNT(*)::int FROM knowledge_chunks) AS knowledge_chunks,
      (SELECT COUNT(*)::int FROM knowledge_chunks WHERE embedding IS NOT NULL) AS knowledge_with_embedding
  `) as Array<TableCounts>;
  return row[0];
}
