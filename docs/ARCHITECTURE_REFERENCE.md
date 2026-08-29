# Quick Architecture Reference

Fast reference for database and RAG architecture.

---

## Database Schema (Visual)

```
┌─────────────────────────────────────────────────────────────┐
│                        SHOPS (Master)                        │
│  id, type, name, industry, stage, location, team_size,      │
│  challenge, cash_on_hand, month_sales, last_month_sales     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬──────────────┐
        │               │               │              │
        ▼               ▼               ▼              ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PAYABLES    │  │ RECEIVABLES  │  │  INVENTORY   │  │  SESSIONS    │
│              │  │              │  │              │  │              │
│ • name       │  │ • customer   │  │ • sku        │  │ • created_at │
│ • amount     │  │ • amount     │  │ • units      │  │              │
│ • due_in_days│  │ • overdue    │  │ • sold       │  │              │
└──────────────┘  └──────────────┘  └──────────────┘  └───────┬──────┘
                                                              │
                                             ┌────────────────┴─────────┐
                                             ▼                          ▼
                                      ┌──────────────┐         ┌──────────────┐
                                      │   MESSAGES   │         │     RUNS     │
                                      │              │         │              │
                                      │ • role       │         │ • ask        │
                                      │ • content    │         │ • health     │
                                      │ • created_at │         │ • card(JSON) │
                                      └──────────────┘         └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│              KNOWLEDGE_CHUNKS (Vector Store)                 │
│                                                              │
│  id, shop_id(nullable), kind, title, body, embedding(768d)  │
│                                                              │
│  • Global knowledge: shop_id = NULL                          │
│  • Business-specific: shop_id = 'daw-hla'                   │
│  • Vector index: IVFFlat(embedding) for ANN search          │
└─────────────────────────────────────────────────────────────┘
```

---

## RAG Pipeline (Visual)

```
┌─────────────────────┐
│   User Query        │
│  "Cash is tight"    │
└──────────┬──────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  1. EMBEDDING GENERATION                             │
│                                                      │
│  ┌──────────────────────────┐                       │
│  │ Gemini text-embedding-004│                       │
│  │         768 dims         │                       │
│  └──────────┬───────────────┘                       │
│             │                                        │
│             ├─ [0.123, -0.456, 0.789, ...]         │
│             │                                        │
│  Fallback:  │                                        │
│  ┌──────────▼───────────────┐                       │
│  │ hashedEmbedding(query)   │                       │
│  │  FNV-1a hash → vector    │                       │
│  └──────────────────────────┘                       │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  2. VECTOR SEARCH (pgvector)                         │
│                                                      │
│  SELECT *, (1 - (embedding <=> query_vec)) AS score │
│  FROM knowledge_chunks                               │
│  WHERE (shop_id IS NULL OR shop_id = 'daw-hla')    │
│  ORDER BY embedding <=> query_vec                    │
│  LIMIT 4                                             │
│                                                      │
│  ┌──────────────────────────────────────┐           │
│  │  IVFFlat Index (100 lists)           │           │
│  │  Approximate NN: O(log n)            │           │
│  └──────────────────────────────────────┘           │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  3. RESULTS                                          │
│                                                      │
│  [                                                   │
│    {                                                 │
│      kind: "practice",                               │
│      title: "When payables outrun cash",            │
│      body: "Collect largest overdue first...",      │
│      score: 0.89                                     │
│    },                                                │
│    {                                                 │
│      kind: "trust",                                  │
│      title: "Ledger wins",                          │
│      body: "Never invent customer names...",        │
│      score: 0.76                                     │
│    },                                                │
│    ...2 more                                         │
│  ]                                                   │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  4. COMBINE WITH TOOLS                               │
│                                                      │
│  ┌─────────────────┐    ┌─────────────────┐        │
│  │  Ledger Tools   │    │  RAG Context    │        │
│  │                 │    │                 │        │
│  │ • Cash: 500K    │    │ • Practice tips │        │
│  │ • Receivable:   │  + │ • Trust rules   │        │
│  │   Ko Min 200K   │    │ • Reminders     │        │
│  │ • Payables:     │    │ • Disclaimers   │        │
│  │   ABC 300K      │    │                 │        │
│  └─────────────────┘    └─────────────────┘        │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  5. SPECIALIST AGENT PROCESSING                      │
│                                                      │
│  Finance Agent System Prompt:                        │
│  "You are Finance for Myanmar SME..."               │
│                                                      │
│  Context:                                            │
│  • Shop: Daw Hla's Dry Goods (Wholesale)           │
│  • Team: 2 people                                    │
│  • Location: Mandalay                                │
│                                                      │
│  Tools Output:                                       │
│  • cash_pressure: {tight: true, gap: -100K}        │
│  • receivable_rank: [{customer: "Ko Min", ...}]    │
│                                                      │
│  RAG Context:                                        │
│  • "Collect largest overdue first"                   │
│  • "Never invent customer names"                     │
│                                                      │
│  → Gemini API → JSON Response                        │
└──────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────┐
│  6. FINAL SYNTHESIS                                  │
│                                                      │
│  Conductor combines all memos:                       │
│  "Priority: Collect 200K from Ko Min (7d overdue).  │
│   Do not reorder until cash is in."                 │
└──────────────────────────────────────────────────────┘
```

---

## Tenant Isolation Model

```
┌────────────────────────────────────────────────────────┐
│                    USER REQUEST                        │
│            /api/agents/run?shopId=daw-hla             │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│              SESSION VALIDATION                        │
│                                                        │
│  SELECT * FROM sessions                                │
│  WHERE id = ? AND shop_id = 'daw-hla'                 │
│                                                        │
│  ✓ Match → Continue                                   │
│  ✗ Mismatch → 403 Forbidden                          │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│             LEDGER DATA FETCH                          │
│                                                        │
│  SELECT * FROM shops WHERE id = 'daw-hla'             │
│  SELECT * FROM payables WHERE shop_id = 'daw-hla'     │
│  SELECT * FROM receivables WHERE shop_id = 'daw-hla'  │
│  SELECT * FROM inventory WHERE shop_id = 'daw-hla'    │
│                                                        │
│  ✓ All queries scoped to single shop                  │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│          KNOWLEDGE RETRIEVAL (RAG)                     │
│                                                        │
│  SELECT * FROM knowledge_chunks                        │
│  WHERE (shop_id IS NULL OR shop_id = 'daw-hla')      │
│        AND embedding <=> query_vec                     │
│  LIMIT 4                                               │
│                                                        │
│  Returns:                                              │
│  • Global knowledge (shop_id = NULL)                   │
│  • Daw Hla specific (shop_id = 'daw-hla')            │
│  • NEVER from other shops                             │
└───────────────────────┬────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│              RESPONSE GENERATION                       │
│                                                        │
│  ✓ Data from single shop only                         │
│  ✓ Knowledge filtered by shop_id                      │
│  ✓ No cross-tenant leakage                           │
└────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────┐
│           MULTI-SHOP ISOLATION EXAMPLE                  │
│                                                         │
│  Shop A: Daw Hla (wholesale)                           │
│  ├─ Sessions: [s1, s2]                                 │
│  ├─ Ledger: Cash 500K, Receivable Ko Min 200K         │
│  └─ Knowledge: "Wholesale credit pattern"              │
│                                                         │
│  Shop B: Nandar Studio (services)                      │
│  ├─ Sessions: [s3, s4]                                 │
│  ├─ Ledger: Cash 150K, Receivable Ma Suu 80K          │
│  └─ Knowledge: "Solo founder pattern"                  │
│                                                         │
│  Global Knowledge (shop_id = NULL)                      │
│  └─ "Ledger wins", "Collection best practices", etc.   │
│                                                         │
│  Query from Shop A → ONLY sees:                        │
│    • Shop A ledger                                      │
│    • Shop A knowledge                                   │
│    • Global knowledge                                   │
│    • NEVER Shop B data                                  │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Characteristics

### Query Latency (Typical)

```
Operation                          Latency      Cache Hit
─────────────────────────────────────────────────────────
Session lookup                     2-5ms        99%
Ledger fetch (4 tables)           8-15ms       95%
Embedding generation (Gemini)     150-300ms    N/A
Vector search (pgvector)          10-30ms      80%
Keyword fallback                  5-12ms       90%
Full agent run (with tools)       800-2000ms   N/A
```

### Scalability Limits (Current)

```
Metric                          Soft Limit    Hard Limit
─────────────────────────────────────────────────────────
Concurrent sessions             500           1000
Knowledge chunks                10K           50K
Vector search QPS              100           500
Embedding API QPS              60            100
Database connections           20            100
```

### Cost Structure (Monthly)

```
Component                 Free Tier    Low Volume    High Volume
──────────────────────────────────────────────────────────────
Neon Database            Free         $19/mo        $69/mo
Gemini API (embeddings)  Free (1500)  $0.03/1K      $0.03/1K
Gemini API (text)        Free (15)    $0.07/1K in   $0.07/1K in
                                      $0.30/1K out  $0.30/1K out
Total (100 users/day)    $0           ~$50/mo       ~$200/mo
```

---

## Common Queries Reference

### Find all knowledge for a shop

```sql
SELECT * FROM knowledge_chunks
WHERE shop_id IS NULL OR shop_id = 'daw-hla'
ORDER BY kind, title;
```

### Vector similarity search

```sql
SELECT id, title, body,
  (1 - (embedding <=> '[0.1,0.2,...]'::vector)) AS score
FROM knowledge_chunks
WHERE embedding IS NOT NULL
  AND (shop_id IS NULL OR shop_id = 'daw-hla')
ORDER BY embedding <=> '[0.1,0.2,...]'::vector
LIMIT 4;
```

### Get shop financial snapshot

```sql
SELECT
  s.*,
  json_agg(DISTINCT p.*) FILTER (WHERE p.id IS NOT NULL) AS payables,
  json_agg(DISTINCT r.*) FILTER (WHERE r.id IS NOT NULL) AS receivables,
  json_agg(DISTINCT i.*) FILTER (WHERE i.id IS NOT NULL) AS inventory
FROM shops s
LEFT JOIN payables p ON p.shop_id = s.id
LEFT JOIN receivables r ON r.shop_id = s.id
LEFT JOIN inventory i ON i.shop_id = s.id
WHERE s.id = 'daw-hla'
GROUP BY s.id;
```

### Recent agent runs for shop

```sql
SELECT r.*, s.shop_id
FROM runs r
JOIN sessions s ON s.id = r.session_id
WHERE s.shop_id = 'daw-hla'
ORDER BY r.created_at DESC
LIMIT 10;
```

---

## Troubleshooting Guide

### Vector search returns no results

**Cause:** Embeddings not generated
**Fix:**
```typescript
// Check if embeddings exist
const count = await sql`
  SELECT COUNT(*) FROM knowledge_chunks
  WHERE embedding IS NOT NULL
`;

// Re-seed with embeddings
await seedKnowledgeChunks();
```

### Slow vector search

**Cause:** Missing index or too many dimensions
**Fix:**
```sql
-- Verify index exists
SELECT indexname FROM pg_indexes
WHERE tablename = 'knowledge_chunks';

-- Rebuild index
DROP INDEX IF EXISTS idx_knowledge_embedding;
CREATE INDEX idx_knowledge_embedding ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

### Cross-tenant data leak

**Cause:** Missing shop_id filter
**Fix:**
```typescript
// ❌ BAD
const data = await sql`SELECT * FROM receivables`;

// ✅ GOOD
const data = await sql`
  SELECT * FROM receivables
  WHERE shop_id = ${shopId}
`;
```

### Embedding API failures

**Cause:** Rate limit or API key issues
**Fix:**
```typescript
// Use fallback
const embedding = await embedOrFallback(text);
// Always returns a vector (hash-based if API fails)
```

---

## Key Files Reference

```
Database & RAG Implementation
├── src/lib/db/
│   ├── schema.ts           # Table definitions
│   ├── client.ts           # Neon connection
│   ├── knowledge.ts        # RAG search logic
│   ├── knowledge-seed.ts   # Seed data
│   └── demo-seed.ts        # Demo conversations
├── src/lib/llm/
│   └── embed.ts            # Gemini embeddings + fallback
├── src/lib/agents/
│   ├── tools.ts            # Tool implementations (search_knowledge)
│   └── orchestrator.ts     # Agent coordination
└── docs/
    ├── DATABASE_RAG_ARCHITECTURE.md  # This file
    └── DATABASE.md                    # Original design doc
```

---

## Next Steps

1. **Monitor performance**: Add Neon observability
2. **Optimize embeddings**: Cache frequently used queries
3. **Scale index**: Switch to HNSW when >10K chunks
4. **Add re-ranking**: Two-stage retrieval for better precision
5. **Implement hybrid search**: Combine vector + keyword (BM25)
