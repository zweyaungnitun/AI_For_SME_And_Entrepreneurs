# Database & RAG Architecture

Comprehensive analysis of the database and Retrieval-Augmented Generation (RAG) architecture for Foundry SME Copilot.

---

## Database Architecture

### Technology Stack
- **Primary Database**: PostgreSQL (Neon)
- **Vector Extension**: pgvector
- **ORM/Client**: @neondatabase/serverless with SQL template literals
- **Embedding Model**: Google Gemini `text-embedding-004` (768 dimensions)

### Schema Overview

The database uses a **multi-tenant** architecture with strict tenant isolation.

#### Core Tables

**1. sessions**
```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_sessions_shop ON sessions(shop_id);
```
- Links conversations to specific businesses
- Enables tenant isolation
- Tracks session lifecycle

**2. messages**
```sql
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_messages_session ON messages(session_id);
```
- Stores conversation history
- User queries and AI responses
- Cascades delete with sessions

**3. runs**
```sql
CREATE TABLE runs (
  id TEXT PRIMARY KEY,
  session_id TEXT REFERENCES sessions(id) ON DELETE CASCADE,
  message_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  plan JSONB,
  memos JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_runs_session ON runs(session_id);
CREATE INDEX idx_runs_status ON runs(status);
```
- Tracks multi-agent orchestration runs
- Stores execution plan and specialist memos
- Performance monitoring via timestamps

**4. knowledge_chunks** (Vector Store)
```sql
CREATE TABLE knowledge_chunks (
  id TEXT PRIMARY KEY,
  shop_id TEXT,  -- NULL = global knowledge
  kind TEXT NOT NULL,  -- 'practice', 'trust', 'reminder', 'bank'
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  embedding vector(768),  -- pgvector type
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_knowledge_shop ON knowledge_chunks(shop_id);
CREATE INDEX idx_knowledge_embedding ON knowledge_chunks 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);  -- Approximate nearest neighbor index
```
- Hybrid global + tenant-specific knowledge
- 768-dimensional vector embeddings
- IVFFlat index for fast similarity search

---

## RAG (Retrieval-Augmented Generation) Architecture

### Three-Tier Retrieval Strategy

#### 1. **Vector Similarity Search (Primary)**
```typescript
// src/lib/db/knowledge.ts
const values = await embed(query);  // Generate query embedding
const rows = await sql`
  SELECT id, kind, title, body,
    (1 - (embedding <=> ${literal}::vector))::float AS score
  FROM knowledge_chunks
  WHERE embedding IS NOT NULL
    AND (shop_id IS NULL OR shop_id = ${shopId})  -- Tenant isolation
  ORDER BY embedding <=> ${literal}::vector  -- Cosine distance
  LIMIT 4
`;
```

**Features:**
- Semantic search using cosine similarity
- Tenant-aware: global + business-specific chunks
- Returns top 4 most relevant chunks
- Score normalization: `(1 - distance)` → higher = better

#### 2. **Keyword Fallback**
```typescript
// When embeddings unavailable (no API key or API down)
const q = `%${query.slice(0, 80).replace(/%/g, "")}%`;
const rows = await sql`
  SELECT id, kind, title, body, 0.45::float AS score
  FROM knowledge_chunks
  WHERE (shop_id IS NULL OR shop_id = ${shopId})
    AND (title ILIKE ${q} OR body ILIKE ${q} OR kind ILIKE ${q})
  LIMIT 4
`;
```

**Features:**
- PostgreSQL ILIKE for case-insensitive matching
- Searches across title, body, and kind
- Fixed score (0.45) for all matches
- Graceful degradation

#### 3. **Default Global Knowledge**
```typescript
// When no matches at all
const rows = await sql`
  SELECT id, kind, title, body, 0.2::float AS score
  FROM knowledge_chunks
  WHERE shop_id IS NULL  -- Only global knowledge
  LIMIT 3
`;
```

**Features:**
- Always returns some context
- Generic SME best practices
- Lowest score (0.2) indicates uncertainty

---

## Embedding Pipeline

### Generation Flow

**1. Query Embedding**
```typescript
// src/lib/llm/embed.ts
const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY,
  },
  body: JSON.stringify({
    model: "models/text-embedding-004",
    content: { parts: [{ text: text.slice(0, 8000) }] },
  }),
});
```

**2. Hashed Fallback (Demo Mode)**
```typescript
// Deterministic embedding when API unavailable
function hashedEmbedding(text: string): number[] {
  const values = new Array<number>(768).fill(0);
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  for (const token of tokens) {
    let hash = 2166136261;  // FNV-1a hash
    for (let i = 0; i < token.length; i++) {
      hash ^= token.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    values[(hash >>> 0) % 768] += 1;
  }
  // L2 normalization
  const norm = Math.sqrt(values.reduce((sum, n) => sum + n * n, 0)) || 1;
  return values.map((n) => n / norm);
}
```

**Features:**
- FNV-1a hash algorithm
- Deterministic and repeatable
- No API dependency
- Enables offline demos

---

## Knowledge Types

The system uses **typed knowledge chunks** for different purposes:

### 1. **trust** - Ground Rules
```typescript
{
  kind: "trust",
  title: "Ledger wins",
  body: "Only use customer names and MMK amounts from tools. Never invent data."
}
```
- Enforces data integrity
- Prevents hallucination

### 2. **practice** - Best Practices
```typescript
{
  kind: "practice",
  title: "When payables outrun cash",
  body: "If payables exceed cash, health is TIGHT. Collect largest overdue first."
}
```
- SME financial management rules
- Context-specific guidance

### 3. **reminder** - Templates
```typescript
{
  kind: "reminder",
  title: "Collection reminder",
  body: "Draft polite reminder with name, amount, overdue days. Burmese or English."
}
```
- Communication templates
- Localization guidance

### 4. **bank** - Disclaimers
```typescript
{
  kind: "bank",
  title: "Bank discussion",
  body: "Never say loan is approved. This is cash timing, not credit score."
}
```
- Legal safety
- Expectation management

---

## Tenant Isolation Strategy

### Multi-Level Isolation

**1. Session Level**
```typescript
// Each session tied to one shop
const session = await sql`
  SELECT * FROM sessions WHERE id = ${sessionId} AND shop_id = ${shopId}
`;
```

**2. Knowledge Level**
```typescript
// Query respects tenant boundaries
WHERE (shop_id IS NULL OR shop_id = ${shopId})
```

**3. Application Level**
```typescript
// BriefProvider enforces shop context
const { shopId } = useBrief();
```

### Knowledge Scoping

**Global Knowledge** (`shop_id = NULL`)
- Universal SME principles
- Industry best practices
- Applies to all businesses

**Tenant-Specific Knowledge** (`shop_id = 'daw-hla'`)
- Business-specific patterns
- Local market context
- Custom rules

---

## Integration with Multi-Agent System

### RAG → Tools → LLM Flow

```
User Query
    ↓
1. Embed Query (Gemini)
    ↓
2. Vector Search (pgvector)
    ↓
3. Retrieve Top 4 Chunks
    ↓
4. Combine with Ledger Tools
    ↓
5. Pass to Specialist Agents
    ↓
6. Synthesize Response
```

### Tool: `search_knowledge`

```typescript
// src/lib/agents/tools.ts
if (name === "search_knowledge") {
  return timed(name, { query: message }, async () => {
    const result = await searchKnowledge(message, shopId || DEFAULT_SHOP_ID);
    return {
      source: result.source,  // 'pgvector', 'keyword', or 'none'
      hits: result.hits.map((h) => ({
        kind: h.kind,
        title: h.title,
        body: h.body.slice(0, 400),
        score: h.score,
      })),
      note: result.note,
    };
  });
}
```

**Agent Access:**
- Finance agent: Trust rules + cash practices
- Supply agent: Inventory best practices
- Market agent: Competitive patterns
- Strategy agent: Growth frameworks

---

## Performance Optimizations

### 1. **IVFFlat Index**
```sql
CREATE INDEX idx_knowledge_embedding ON knowledge_chunks 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);
```
- Approximate nearest neighbor (ANN)
- O(log n) search vs O(n) brute force
- Trade accuracy for speed

### 2. **Connection Pooling**
```typescript
// src/lib/db/client.ts
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
```
- Serverless-optimized
- Auto-scaling connections
- Edge-compatible

### 3. **Selective Embedding**
```typescript
// Only embed when needed
if (values) {
  // Vector search
} else {
  // Keyword fallback
}
```
- Reduces API costs
- Graceful degradation

### 4. **Caching Strategy**
```typescript
// Knowledge chunks are static
// Pre-generated embeddings at seed time
await embedOrFallback(chunk.body);
```
- One-time embedding cost
- Query-time embeddings only

---

## Scalability Considerations

### Current Capacity
- **Knowledge chunks**: ~20 seed documents
- **Embedding dimensions**: 768
- **Search results**: Top 4 per query
- **Index lists**: 100 (IVFFlat)

### Growth Path

**Short-term (100-1K businesses)**
- Current architecture sufficient
- Add more global practices
- Increase per-tenant chunks

**Medium-term (1K-10K businesses)**
- Partition by region/industry
- Implement chunk expiration
- Add chunk versioning

**Long-term (10K+ businesses)**
- Hierarchical indexing (HNSW)
- Distributed vector database
- RAG chain caching
- Fine-tune embedding model

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│           User Query (Dashboard)             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│      BriefProvider (shopId context)          │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│     Orchestrator (Conductor Agent)           │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────┴────────┐
         │                 │
         ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│ Ledger Tools │  │ search_knowledge │
│              │  │                  │
│ • cash       │  │ 1. embed(query)  │
│ • receivable │  │ 2. pgvector <==> │
│ • inventory  │  │ 3. Top 4 chunks  │
└──────────────┘  └──────────────────┘
         │                 │
         └────────┬────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│        Specialist Agent (Finance/etc)        │
│                                              │
│  System Prompt + Ledger Data + RAG Context  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│            Gemini LLM API                    │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│       Structured Response (JSON)             │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│   Conductor Synthesis → Final Brief          │
└─────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. **Ledger Tools Win**
- RAG provides **context**, not facts
- All MMK amounts come from ledger tools
- Vector search supplements, never replaces

### 2. **Graceful Degradation**
- Works without embeddings (keyword search)
- Works without database (demo mode)
- Always returns some response

### 3. **Tenant Security**
- Shop-scoped sessions
- Shop-filtered knowledge
- No cross-tenant leakage

### 4. **Cost Efficiency**
- Pre-generate embeddings
- Cache knowledge chunks
- Limit result set (top 4)

### 5. **Demo-Friendly**
- Hashed embeddings for offline use
- Seed data with fixed vectors
- No API required for basic testing

---

## Future Enhancements

### RAG Improvements
1. **Hybrid Search**: Combine vector + BM25
2. **Re-ranking**: Two-stage retrieval
3. **Query Expansion**: Synonyms and related terms
4. **Context Window**: Sliding history
5. **Fine-tuning**: Custom embeddings for SME domain

### Database Improvements
1. **HNSW Index**: Better than IVFFlat for scale
2. **Partitioning**: By region/industry
3. **Materialized Views**: Pre-aggregated metrics
4. **Event Sourcing**: Audit trail for compliance
5. **CDC**: Real-time sync with analytics DB

### Architecture Improvements
1. **Edge Caching**: CloudFlare KV for hot knowledge
2. **GraphQL**: Type-safe queries
3. **gRPC**: Agent-to-agent communication
4. **Message Queue**: Async agent tasks
5. **Feature Store**: ML feature management

---

## Monitoring & Observability

### Key Metrics

**Database:**
- Query latency (p50, p95, p99)
- Connection pool usage
- Index hit rate
- Table sizes

**RAG:**
- Embedding generation time
- Vector search latency
- Hit score distribution
- Fallback rate (keyword vs vector)

**Application:**
- Sessions per business
- Messages per session
- Agent invocation frequency
- Tool usage patterns

### Recommended Tools
- **Neon Console**: Connection/query metrics
- **Sentry**: Error tracking
- **PostHog**: User analytics
- **Grafana**: Custom dashboards

---

## Conclusion

Foundry uses a **modern, scalable RAG architecture** built on:
- PostgreSQL + pgvector for vector search
- Gemini embeddings for semantic understanding
- Multi-tenant isolation for security
- Hybrid retrieval for reliability
- Tool-first approach for accuracy

The system balances **AI flexibility** with **data integrity**, ensuring SMEs get relevant, actionable advice grounded in their actual business data.
