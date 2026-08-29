/**
 * Canonical Neon + pgvector schema.
 * Design: docs/DATABASE.md
 */

export const SHOP_TYPES = [
  "wholesale",
  "retail",
  "restaurant",
  "services",
  "online",
  "manufacturing",
] as const;

export const RECEIVABLE_STATUSES = ["pending", "overdue"] as const;

export const HEALTH_LABELS = ["OK", "WATCH", "TIGHT"] as const;

export const KNOWLEDGE_KINDS = ["practice", "trust", "reminder", "bank"] as const;

export const MESSAGE_ROLES = ["user", "assistant"] as const;

export const EMBED_DIMENSIONS = 768;

/** Applied in order by ensureDb(). Safe to re-run (IF NOT EXISTS). */
export const SCHEMA_STATEMENTS = [
  `CREATE EXTENSION IF NOT EXISTS vector`,

  `CREATE TABLE IF NOT EXISTS shops (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK (type IN ('wholesale','retail','restaurant','services','online','manufacturing')),
      name TEXT NOT NULL,
      industry TEXT NOT NULL,
      stage TEXT NOT NULL,
      location TEXT NOT NULL,
      team_size INTEGER NOT NULL DEFAULT 1,
      challenge TEXT NOT NULL DEFAULT '',
      cash_on_hand INTEGER NOT NULL DEFAULT 0 CHECK (cash_on_hand >= 0),
      month_sales INTEGER NOT NULL DEFAULT 0 CHECK (month_sales >= 0),
      last_month_sales INTEGER NOT NULL DEFAULT 0 CHECK (last_month_sales >= 0),
      currency TEXT NOT NULL DEFAULT 'MMK'
    )`,

  `CREATE TABLE IF NOT EXISTS payables (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK (amount >= 0),
      due_in_days INTEGER NOT NULL CHECK (due_in_days >= 0)
    )`,

  `CREATE TABLE IF NOT EXISTS receivables (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      customer TEXT NOT NULL,
      amount INTEGER NOT NULL CHECK (amount >= 0),
      overdue_days INTEGER NOT NULL DEFAULT 0 CHECK (overdue_days >= 0),
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','overdue'))
    )`,

  `CREATE TABLE IF NOT EXISTS inventory (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      sku TEXT NOT NULL,
      units INTEGER NOT NULL CHECK (units >= 0),
      sold_this_month INTEGER NOT NULL DEFAULT 0 CHECK (sold_this_month >= 0),
      unit_cost INTEGER NOT NULL DEFAULT 0 CHECK (unit_cost >= 0)
    )`,

  `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,

  `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      role TEXT NOT NULL CHECK (role IN ('user','assistant')),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,

  `CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      shop_id TEXT NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
      ask TEXT NOT NULL,
      health TEXT NOT NULL CHECK (health IN ('OK','WATCH','TIGHT')),
      card JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`,

  `CREATE TABLE IF NOT EXISTS knowledge_chunks (
      id TEXT PRIMARY KEY,
      shop_id TEXT REFERENCES shops(id) ON DELETE CASCADE,
      kind TEXT NOT NULL CHECK (kind IN ('practice','trust','reminder','bank')),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      embedding vector(768)
    )`,

  `CREATE INDEX IF NOT EXISTS payables_shop_idx ON payables (shop_id)`,
  `CREATE INDEX IF NOT EXISTS receivables_shop_idx ON receivables (shop_id)`,
  `CREATE INDEX IF NOT EXISTS inventory_shop_idx ON inventory (shop_id)`,
  `CREATE INDEX IF NOT EXISTS sessions_shop_idx ON sessions (shop_id)`,
  `CREATE INDEX IF NOT EXISTS messages_session_idx ON messages (session_id)`,
  `CREATE INDEX IF NOT EXISTS runs_shop_idx ON runs (shop_id, created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS knowledge_shop_idx ON knowledge_chunks (shop_id)`,
] as const;
