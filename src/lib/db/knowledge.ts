import { ensureDb } from "@/lib/db/ensure";
import { getSql } from "@/lib/db/client";
import { embed, vectorLiteral } from "@/lib/llm/embed";

export type KnowledgeHit = {
  id: string;
  kind: string;
  title: string;
  body: string;
  score: number;
};

export type KnowledgeSearch = {
  source: "pgvector" | "keyword" | "none";
  hits: KnowledgeHit[];
  note: string;
};

const LEDGER_WINS =
  "Practice text only. Do not treat as MMK facts. Ledger tools win.";

export async function searchKnowledge(
  query: string,
  shopId: string,
): Promise<KnowledgeSearch> {
  if (!(await ensureDb())) {
    return {
      source: "none",
      hits: [],
      note: "Vector store off. Using snapshot tools only.",
    };
  }

  const sql = getSql();
  const values = await embed(query);

  if (values) {
    const literal = vectorLiteral(values);
    const rows = (await sql`
      SELECT id, kind, title, body,
        (1 - (embedding <=> ${literal}::vector))::float AS score
      FROM knowledge_chunks
      WHERE embedding IS NOT NULL
        AND (shop_id IS NULL OR shop_id = ${shopId})
      ORDER BY embedding <=> ${literal}::vector
      LIMIT 4
    `) as Array<KnowledgeHit>;
    return {
      source: "pgvector",
      hits: rows.map(normalizeHit),
      note: LEDGER_WINS,
    };
  }

  const q = `%${query.slice(0, 80).replace(/%/g, "")}%`;
  let rows = (await sql`
    SELECT id, kind, title, body, 0.45::float AS score
    FROM knowledge_chunks
    WHERE (shop_id IS NULL OR shop_id = ${shopId})
      AND (title ILIKE ${q} OR body ILIKE ${q} OR kind ILIKE ${q})
    LIMIT 4
  `) as Array<KnowledgeHit>;

  if (rows.length === 0) {
    rows = (await sql`
      SELECT id, kind, title, body, 0.2::float AS score
      FROM knowledge_chunks
      WHERE shop_id IS NULL
      LIMIT 3
    `) as Array<KnowledgeHit>;
  }

  return {
    source: "keyword",
    hits: rows.map(normalizeHit),
    note: LEDGER_WINS,
  };
}

function normalizeHit(row: KnowledgeHit): KnowledgeHit {
  return {
    id: row.id,
    kind: row.kind,
    title: row.title,
    body: row.body,
    score: Number(row.score ?? 0),
  };
}
