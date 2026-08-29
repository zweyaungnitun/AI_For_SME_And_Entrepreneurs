import { dbConfigured, getSql } from "@/lib/db/client";
import { KNOWLEDGE_SEED } from "@/lib/db/knowledge-seed";
import { SHOPS } from "@/lib/sme/catalog";
import { embed, vectorLiteral } from "@/lib/llm/embed";

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
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  await sql`
    CREATE TABLE IF NOT EXISTS shops (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      stage TEXT NOT NULL,
      location TEXT NOT NULL,
      team_size INTEGER NOT NULL DEFAULT 1,
      challenge TEXT NOT NULL DEFAULT '',
      cash_on_hand INTEGER NOT NULL DEFAULT 0,
      month_sales INTEGER NOT NULL DEFAULT 0,
      last_month_sales INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS payables (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      amount INTEGER NOT NULL,
      due_in_days INTEGER NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS receivables (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      customer TEXT NOT NULL,
      amount INTEGER NOT NULL,
      overdue_days INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending'
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      sku TEXT NOT NULL,
      units INTEGER NOT NULL,
      sold_this_month INTEGER NOT NULL DEFAULT 0,
      unit_cost INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      shop_id TEXT NOT NULL,
      ask TEXT NOT NULL,
      health TEXT NOT NULL,
      card JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id TEXT PRIMARY KEY,
      shop_id TEXT,
      kind TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      embedding vector(768)
    )
  `;
  await seedShops();
  await seedKnowledge();
  try {
    await sql`
      CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_hnsw
      ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)
    `;
  } catch {
    /* index is optional if too few rows */
  }
  return true;
}

async function seedShops() {
  const sql = getSql();
  for (const shop of SHOPS) {
    await sql`
      INSERT INTO shops (
        id, type, name, industry, stage, location, team_size, challenge,
        cash_on_hand, month_sales, last_month_sales
      ) VALUES (
        ${shop.id}, ${shop.type}, ${shop.context.name}, ${shop.context.industry},
        ${shop.context.stage}, ${shop.context.location}, ${shop.context.teamSize},
        ${shop.context.challenge}, ${shop.ledger.cashOnHand}, ${shop.ledger.monthSales},
        ${shop.ledger.lastMonthSales}
      )
      ON CONFLICT (id) DO NOTHING
    `;

    const payableCount = await sql`
      SELECT COUNT(*)::int AS n FROM payables WHERE shop_id = ${shop.id}
    `;
    if (Number(payableCount[0]?.n ?? 0) === 0) {
      for (const [i, bill] of shop.ledger.upcomingExpenses.entries()) {
        await sql`
          INSERT INTO payables (id, shop_id, name, amount, due_in_days)
          VALUES (${`${shop.id}-p-${i}`}, ${shop.id}, ${bill.name}, ${bill.amount}, ${bill.dueInDays})
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
        `;
      }
    }
  }
}

async function seedKnowledge() {
  const sql = getSql();
  for (const chunk of KNOWLEDGE_SEED) {
    const existing = await sql`
      SELECT id, embedding IS NOT NULL AS has_vec FROM knowledge_chunks WHERE id = ${chunk.id}
    `;
    const values = await embed(`${chunk.title}. ${chunk.body}`);

    if (existing.length === 0) {
      if (values) {
        const literal = vectorLiteral(values);
        await sql`
          INSERT INTO knowledge_chunks (id, shop_id, kind, title, body, embedding)
          VALUES (
            ${chunk.id}, ${chunk.shopId}, ${chunk.kind}, ${chunk.title}, ${chunk.body},
            ${literal}::vector
          )
        `;
      } else {
        await sql`
          INSERT INTO knowledge_chunks (id, shop_id, kind, title, body)
          VALUES (
            ${chunk.id}, ${chunk.shopId}, ${chunk.kind}, ${chunk.title}, ${chunk.body}
          )
        `;
      }
      continue;
    }

    if (values && !existing[0]?.has_vec) {
      const literal = vectorLiteral(values);
      await sql`
        UPDATE knowledge_chunks SET embedding = ${literal}::vector WHERE id = ${chunk.id}
      `;
    }
  }
}
