import { dbConfigured, getSql } from "@/lib/db/client";
import { SCHEMA_STATEMENTS } from "@/lib/db/schema";
import { KNOWLEDGE_SEED } from "@/lib/db/knowledge-seed";
import { countTables, seedDemoConversations, type TableCounts } from "@/lib/db/demo-seed";
import { SHOPS } from "@/lib/sme/catalog";
import { embedOrFallback, vectorLiteral } from "@/lib/llm/embed";

let ready: Promise<boolean> | null = null;

export async function ensureDb(): Promise<boolean> {
  if (!dbConfigured()) return false;
  if (!ready) {
    ready = bootstrap().catch((err) => {
      ready = null;
      console.error("[foundry] database setup failed", err);
      return false;
    });
  }
  return ready;
}

async function bootstrap() {
  const sql = getSql();
  for (const statement of SCHEMA_STATEMENTS) {
    await sql.query(statement);
  }
  await seedShops();
  await seedKnowledge();
  await seedDemoConversations();
  try {
    await sql.query(`
      CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_hnsw
      ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
    `);
  } catch {
    /* HNSW needs rows; skip if the provider rejects the index */
  }
  return true;
}

/** Idempotent seed of catalog + knowledge vectors + demo sessions/runs. */
export async function seedDemoData(): Promise<TableCounts | null> {
  if (!(await ensureDb())) return null;
  await seedShops();
  await seedKnowledge();
  await seedDemoConversations();
  return countTables();
}

async function seedShops() {
  const sql = getSql();
  for (const shop of SHOPS) {
    await sql`
      INSERT INTO shops (
        id, type, name, industry, stage, location, team_size, challenge,
        cash_on_hand, month_sales, last_month_sales, currency
      ) VALUES (
        ${shop.id}, ${shop.type}, ${shop.context.name}, ${shop.context.industry},
        ${shop.context.stage}, ${shop.context.location}, ${shop.context.teamSize},
        ${shop.context.challenge}, ${shop.ledger.cashOnHand}, ${shop.ledger.monthSales},
        ${shop.ledger.lastMonthSales}, ${shop.ledger.currency}
      )
      ON CONFLICT (id) DO UPDATE SET
        type = EXCLUDED.type,
        name = EXCLUDED.name,
        industry = EXCLUDED.industry,
        stage = EXCLUDED.stage,
        location = EXCLUDED.location,
        team_size = EXCLUDED.team_size,
        challenge = EXCLUDED.challenge,
        cash_on_hand = EXCLUDED.cash_on_hand,
        month_sales = EXCLUDED.month_sales,
        last_month_sales = EXCLUDED.last_month_sales,
        currency = EXCLUDED.currency
    `;

    const payableCount = await sql`
      SELECT COUNT(*)::int AS n FROM payables WHERE shop_id = ${shop.id}
    `;
    if (Number(payableCount[0]?.n ?? 0) === 0) {
      for (const [i, bill] of shop.ledger.upcomingExpenses.entries()) {
        await sql`
          INSERT INTO payables (id, shop_id, name, amount, due_in_days)
          VALUES (${`${shop.id}-p-${i}`}, ${shop.id}, ${bill.name}, ${bill.amount}, ${bill.dueInDays})
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const recvCount = await sql`
      SELECT COUNT(*)::int AS n FROM receivables WHERE shop_id = ${shop.id}
    `;
    if (Number(recvCount[0]?.n ?? 0) === 0) {
      for (const [i, rec] of shop.ledger.receivables.entries()) {
        await sql`
          INSERT INTO receivables (id, shop_id, customer, amount, overdue_days, status)
          VALUES (
            ${`${shop.id}-r-${i}`}, ${shop.id}, ${rec.customer}, ${rec.amount},
            ${rec.overdueDays}, ${rec.status}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }

    const stockCount = await sql`
      SELECT COUNT(*)::int AS n FROM inventory WHERE shop_id = ${shop.id}
    `;
    if (Number(stockCount[0]?.n ?? 0) === 0) {
      for (const [i, item] of shop.ledger.inventory.entries()) {
        await sql`
          INSERT INTO inventory (id, shop_id, sku, units, sold_this_month, unit_cost)
          VALUES (
            ${`${shop.id}-i-${i}`}, ${shop.id}, ${item.sku}, ${item.units},
            ${item.soldThisMonth}, ${item.unitCost}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
    }
  }
}

async function seedKnowledge() {
  const sql = getSql();
  for (const chunk of KNOWLEDGE_SEED) {
    const values = await embedOrFallback(`${chunk.title}. ${chunk.body}`);
    const literal = vectorLiteral(values);
    await sql`
      INSERT INTO knowledge_chunks (id, shop_id, kind, title, body, embedding)
      VALUES (
        ${chunk.id}, ${chunk.shopId}, ${chunk.kind}, ${chunk.title}, ${chunk.body},
        ${literal}::vector
      )
      ON CONFLICT (id) DO UPDATE SET
        shop_id = EXCLUDED.shop_id,
        kind = EXCLUDED.kind,
        title = EXCLUDED.title,
        body = EXCLUDED.body,
        embedding = EXCLUDED.embedding
    `;
  }
}
