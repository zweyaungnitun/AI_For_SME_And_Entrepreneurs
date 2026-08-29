# FOUNDRY — COMPLETE FEATURE SPECIFICATION

**Myanmar SME & Entrepreneur Copilot**

Multi-agent financial and business management system for small businesses and entrepreneurs.

---

## PRODUCT MISSION

Smart **financial** decisions, everyday **management**, practical **growth** for Myanmar SMEs and entrepreneurs.

**Core Job:** Transform business snapshot → One executable action for 24-48h

---

## IMPLEMENTATION STATUS

✅ **COMPLETED** — Core P0 features working  
✅ **COMPLETED** — Database & RAG architecture (Neon + pgvector)  
✅ **COMPLETED** — Multi-specialist agents (9 total)  
✅ **COMPLETED** — Admin dashboard with tenant isolation  
✅ **COMPLETED** — Google Drive integration via MCP  
✅ **COMPLETED** — AI Advisor with guardrails  
✅ **COMPLETED** — Financial document management  
✅ **COMPLETED** — Enhanced UI/UX with modern design  

---

# CORE FEATURES (P0 — MUST HAVE)

## F-001 ✅ Sample Shop + Snapshot Input

**Status:** IMPLEMENTED  
**Research:** #6, #8

**Context:**
- Shop name, type, location, team size
- Financial snapshot: cash, sales, payables, receivables, inventory
- Support for typed input or preloaded samples

**Sample Business:**
```
Daw Hla's Dry Goods — Mandalay wholesale
Cash: 420,000 MMK
Sales (week): 850,000 MMK
Payable (5d): 500,000 MMK
Receivables:
  Ko Min: 200,000 MMK (7d overdue)
  Ma Su: 150,000 MMK (due Friday)
Stock:
  Product A: 20 units, 2 sold (1M MMK tied)
```

**Implementation:**
- `src/lib/sme/catalog.ts` — 6 demo businesses
- `src/lib/ledger/types.ts` — Ledger schema
- Multi-shop support with tenant isolation

---

## F-002 ✅ Local Decision Tools

**Status:** IMPLEMENTED  
**Research:** #3, #4, #6

**Why necessary:** AI judges, tools provide facts. No hallucination.

**Tools Implemented:**

| Tool | Input | Output | File |
|------|-------|--------|------|
| `cash_pressure` | cash, payables | gap, TIGHT flag | ✅ |
| `receivable_rank` | customer, amount, overdue | ordered list | ✅ |
| `slow_stock` | qty, sold, cost | flag + MMK tied | ✅ |
| `supplier_pressure` | payables, inventory | reorder constraints | ✅ |
| `resource_load` | team size, overdue count | capacity analysis | ✅ |
| `business_pulse` | sales, growth, concentration | snapshot metrics | ✅ |
| `trend_analysis` | financial history | growth/decline trends | ✅ |
| `financial_health_score` | all metrics | composite health score | ✅ |
| `search_knowledge` | query text | RAG-retrieved context | ✅ |

**Implementation:**
- `src/lib/agents/tools.ts` — All tools
- `src/lib/ledger/analyze.ts` — Analysis logic

---

## F-003 ✅ Next-Best-Action Brief

**Status:** IMPLEMENTED  
**Research:** #7 (product), combo A + E

**Crew Architecture:**

**Always:**
- Conductor (orchestrator)
- Finance agent

**Conditional:**
- Supply (if inventory/payables)
- Resources (if team constraints)
- Analytics (on full analysis)
- Books (accounting)
- Action (reminders/tasks)
- Market (competitive analysis)
- Strategy (long-term planning)
- Growth (revenue optimization)

**Output Format:**

```json
{
  "businessHealth": "OK" | "WATCH" | "TIGHT",
  "summary": "One-line situation",
  "keyIssues": ["Issue 1", "Issue 2", "Issue 3"],
  "priority": {
    "title": "What matters most",
    "reason": "Why this, not the rest",
    "action": "What to do (24-48h)"
  },
  "recommendations": ["Actionable item 1", "..."],
  "evidence": ["Fact from tools", "..."],
  "locale": "en" | "my"
}
```

**Implementation:**
- `src/lib/agents/orchestrator.ts` — Conductor loop
- `src/lib/agents/planner.ts` — Agent selection
- `src/lib/agents/registry.ts` — Agent catalog
- `src/lib/agents/specialists/` — 9 specialist agents
- `src/app/api/agents/run/route.ts` — SSE endpoint

**Demo Mode:**
- Works without API key
- Heuristic planner + specialist `demo()` functions
- Full event stream for testing

---

# ENHANCED FEATURES (P1 — IMPLEMENTED)

## F-004 ✅ Financial Document Import

**Status:** IMPLEMENTED (Enhanced beyond original)  
**Research:** #3, #8, combo D

**Original Goal:** Credit-note extraction

**Implemented:**
- Excel (.xlsx, .xls) parsing
- CSV parsing
- Auto-detection of formats (ledger, transactions, inventory)
- Visual data preview
- Import into financial snapshot

**File Types Supported:**
- Financial statements
- Transaction lists
- Inventory records
- Supplier invoices
- Customer receivables

**Implementation:**
- `src/lib/docs/parser.ts` — Document parsing
- `src/components/dashboard/document-upload.tsx` — Upload UI
- `src/components/admin/import-data-preview.tsx` — Preview
- Libraries: `xlsx`, `papaparse`

---

## F-005 ✅ Copy Collection Reminder

**Status:** IMPLEMENTED  
**Research:** #3 collection action

**Feature:**
- Auto-generates polite reminders
- Includes customer name, amount, overdue days
- Supports English and Burmese
- Copy-to-clipboard functionality
- Owner sends via their own channel

**Implementation:**
- `src/components/dashboard/priority-card.tsx` — Reminder generation
- Integrated into decision brief

---

## F-006 ✅ Burmese Support

**Status:** IMPLEMENTED  
**Research:** Myanmar-first challenge

**Features:**
- Burmese input detection
- Bilingual UI elements
- Burmese brief generation (via Gemini)
- Font support for Myanmar Unicode

**Implementation:**
- `src/lib/ledger/types.ts` — `isBurmese()` detector
- LLM system prompts support Burmese
- Sample prompts in Burmese

---

# DATABASE & RAG (P2 — IMPLEMENTED)

## F-014 ✅ Database Architecture

**Status:** FULLY IMPLEMENTED  
**Tech Stack:** Neon PostgreSQL + pgvector

**Schema:**

```sql
shops              -- Business master data
├── payables       -- Upcoming expenses
├── receivables    -- Credit customers
├── inventory      -- Stock items
└── sessions       -- User sessions
    ├── messages   -- Conversation history
    └── runs       -- Agent execution logs

knowledge_chunks   -- Vector store (768d embeddings)
```

**Features:**
- Multi-tenant isolation
- Cascade deletes
- Indexed queries
- JSONB for complex data
- Foreign key constraints

**Implementation:**
- `src/lib/db/schema.ts` — Table definitions
- `src/lib/db/client.ts` — Neon connection
- `src/lib/db/demo-seed.ts` — Seed data
- See: `docs/DATABASE_RAG_ARCHITECTURE.md`

---

## F-015 ✅ RAG Architecture

**Status:** FULLY IMPLEMENTED  
**Embedding:** Gemini `text-embedding-004` (768 dims)

**Three-Tier Retrieval:**

1. **Vector Similarity (Primary)**
   - pgvector cosine similarity
   - IVFFlat index for ANN
   - Top 4 results per query

2. **Keyword Fallback**
   - PostgreSQL ILIKE search
   - When embeddings unavailable

3. **Default Global Knowledge**
   - Generic SME practices
   - Always returns context

**Knowledge Types:**
- `trust` — Ground rules (no hallucination)
- `practice` — SME best practices
- `reminder` — Communication templates
- `bank` — Legal disclaimers

**Tenant Isolation:**
- Global knowledge: `shop_id = NULL`
- Business-specific: `shop_id = 'shop-id'`
- Query filter: `WHERE (shop_id IS NULL OR shop_id = ?)`

**Implementation:**
- `src/lib/db/knowledge.ts` — Search logic
- `src/lib/db/knowledge-seed.ts` — Seed data
- `src/lib/llm/embed.ts` — Embeddings + fallback
- See: `docs/DATABASE_RAG_ARCHITECTURE.md`

---

# NEW FEATURES (BEYOND ORIGINAL SPEC)

## F-016 ✅ Admin Dashboard

**Status:** IMPLEMENTED  
**Purpose:** Platform administration and data management

**Features:**
- Business list view with metrics
- Data import/export
- Google Drive integration
- System health monitoring
- Tenant management

**Routes:**
- `/admin` — Dashboard home
- `/admin/import` — Bulk data import
- `/admin/gdrive` — Google Drive integration

**Implementation:**
- `src/app/admin/page.tsx`
- `src/app/admin/import/page.tsx`
- `src/app/admin/gdrive/page.tsx`
- `src/components/admin/` — Admin components

---

## F-017 ✅ Google Drive Integration

**Status:** IMPLEMENTED  
**Tech:** Model Context Protocol (MCP)

**Features:**
- OAuth authentication flow
- List spreadsheet files from Drive
- One-click import
- Real-time connection status
- File metadata preview

**API Endpoints:**
- `GET /api/gdrive/auth` — Connection status
- `POST /api/gdrive/auth` — Connect/disconnect
- `GET /api/gdrive/files` — List files
- `POST /api/gdrive/files` — Download file

**Implementation:**
- `src/app/api/gdrive/` — API routes
- `src/app/admin/gdrive/page.tsx` — UI
- `.cursor/mcp.json` — MCP configuration
- See: `docs/GOOGLE_DRIVE.md`

---

## F-018 ✅ AI Advisor with Guardrails

**Status:** IMPLEMENTED  
**Route:** `/advisor` (renamed from `/voice`)

**Guardrails:**

**Input Validation:**
- Min 3 chars, max 1,000 chars
- Character counter

**Content Filtering:**
- Blocks: loans, guarantees, illegal, gambling, crypto
- Educational rejection messages

**Rate Limiting:**
- 10 messages/minute
- 50 messages/hour
- Clear feedback on limits

**Response Safety:**
- Never guarantees outcomes
- Auto-detects inappropriate requests
- Data-driven advice only
- Prominent safety notice

**Implementation:**
- `src/app/advisor/page.tsx` — Full interface
- `src/components/chat/chatbot-widget.tsx` — Floating widget
- See: `docs/GUARDRAILS.md`

---

## F-019 ✅ Financial Management System

**Status:** IMPLEMENTED  
**Route:** `/financial`

**Features:**

**Transaction Management:**
- Time-based filtering (daily, weekly, monthly, yearly)
- Transaction type filtering (income, expense, receivable, payable)
- Limit controls
- Date range selection
- Summary analytics

**Document Management:**
- Category-based organization
- Upload/download
- File type detection
- Recent documents list
- Quick stats

**Implementation:**
- `src/app/financial/page.tsx`
- `src/components/financial/financial-list.tsx`
- `src/components/financial/financial-docs.tsx`

---

## F-020 ✅ Enhanced Dashboard UI

**Status:** IMPLEMENTED  
**Route:** `/dashboard`

**Features:**

**Tabbed Interface:**
- Overview
- Finance
- Documents
- Operations
- Analytics

**Components:**
- Health banner
- Metrics cards
- Priority/risk cards
- Document library
- Insights feed
- Quick action buttons

**Modern Design:**
- Tailwind v4 tokens
- Smooth animations
- Responsive layout
- Dark mode support
- Icon system

**Implementation:**
- `src/app/dashboard/page.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/dashboard/` — Dashboard components

---

## F-021 ✅ Multi-Specialist Agent System

**Status:** IMPLEMENTED (9 agents total)

**Specialists:**

| Agent | Purpose | Tools | Keywords |
|-------|---------|-------|----------|
| **Finance** | Cash flow, collections | cash_pressure, receivable_rank, trend_analysis | cash, collect, payment |
| **Supply** | Inventory, suppliers | supplier_pressure, slow_stock | inventory, supplier, restock |
| **Resources** | Team capacity | resource_load | team, capacity, hire |
| **Analytics** | Business metrics | business_pulse, trend_analysis | sales, growth, metrics |
| **Market** | Competitive analysis | business_pulse, search_knowledge | market, competition, pricing |
| **Strategy** | Long-term planning | business_pulse, search_knowledge | strategy, plan, direction |
| **Growth** | Revenue optimization | business_pulse, trend_analysis | revenue, customer, acquisition |
| **Books** | Record keeping | search_knowledge | record, track, document |
| **Action** | Task execution | search_knowledge | reminder, follow-up, action |

**Planner:**
- Heuristic keyword matching
- Context-aware selection
- Parallel execution
- Demo fallbacks

**Implementation:**
- `src/lib/agents/specialists/` — All 9 agents
- `src/lib/agents/planner.ts` — Selection logic
- `src/lib/agents/orchestrator.ts` — Coordination

---

## F-022 ✅ Document Library System

**Status:** IMPLEMENTED

**Document Types:**
- Financial
- Legal
- Operational
- Marketing
- HR
- Other

**Features:**
- Category filtering
- Upload interface
- Download functionality
- File metadata
- Tag system
- Search/filter

**Implementation:**
- `src/components/documents/document-library.tsx`
- Integrated in dashboard

---

## F-023 ✅ Session & Tenant Management

**Status:** IMPLEMENTED

**Features:**
- Shop-scoped sessions
- Session persistence
- Message history
- Run tracking
- Tenant isolation

**Flow:**
1. User enters via `/enter`
2. Selects business
3. Session created with `shop_id`
4. All queries filtered by tenant
5. No cross-tenant leakage

**Implementation:**
- `src/app/enter/page.tsx` — Business selection
- `src/components/brief/brief-provider.tsx` — Context
- `src/lib/db/` — Database layer

---

# NOT IMPLEMENTED (BY DESIGN)

## ❌ Features Explicitly Excluded

Based on original spec and time constraints:

| Feature | Why Not | Original Priority |
|---------|---------|-------------------|
| Expense coach | Needs history, unsupported savings claims | P3 |
| Staff handover | Wrong job | P3 |
| Standalone inventory app | Signal only, not main product | P3 |
| Cost-inflation module | Only if 3 numbers exist | P3 |
| Bank readiness report | Approval language risk | P3 |
| Second AI chatbot | Rule: no chatbot claim | — |
| What-if forecasts | Fake certainty | P3 |
| Cross-session memory | Storage complexity | P3 |
| Market/Growth as P0 | Cash path first | — |
| Database/POS/Bank APIs | 4-hour risk | — |

---

# ARCHITECTURE SUMMARY

## Tech Stack

**Frontend:**
- Next.js 15 App Router
- React Server Components
- Tailwind CSS v4
- TypeScript

**Backend:**
- Next.js API Routes (SSE)
- Server Actions
- Node.js runtime

**Database:**
- Neon PostgreSQL (serverless)
- pgvector extension
- 768d embeddings

**AI/LLM:**
- Google Gemini 2.0 Flash Thinking
- Gemini text-embedding-004
- Demo mode (no API key required)

**Integrations:**
- Google Drive (MCP)
- Excel/CSV parsing
- Vector search (pgvector)

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── dashboard/          # Main dashboard
│   ├── advisor/            # AI chat interface
│   ├── financial/          # Financial management
│   ├── admin/              # Admin panel
│   ├── console/            # Agent console
│   ├── insights/           # Insights view
│   ├── enter/              # Business selection
│   └── api/                # API routes
│       ├── agents/         # Agent execution
│       └── gdrive/         # Google Drive API
├── components/             # React components
│   ├── dashboard/          # Dashboard components
│   ├── financial/          # Financial components
│   ├── admin/              # Admin components
│   ├── chat/               # Chatbot components
│   ├── documents/          # Document management
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI primitives
├── lib/                    # Core logic
│   ├── agents/             # Multi-agent system
│   │   ├── specialists/    # 9 specialist agents
│   │   ├── orchestrator.ts # Conductor
│   │   ├── planner.ts      # Agent selection
│   │   ├── tools.ts        # Tool implementations
│   │   └── types.ts        # Agent types
│   ├── db/                 # Database layer
│   │   ├── schema.ts       # Table definitions
│   │   ├── knowledge.ts    # RAG search
│   │   ├── client.ts       # Neon client
│   │   └── demo-seed.ts    # Seed data
│   ├── llm/                # LLM integration
│   │   ├── complete.ts     # Chat completion
│   │   └── embed.ts        # Embeddings
│   ├── ledger/             # Financial logic
│   │   ├── types.ts        # Ledger types
│   │   └── analyze.ts      # Analysis functions
│   ├── docs/               # Document parsing
│   │   └── parser.ts       # Excel/CSV parser
│   └── sme/                # SME catalog
│       └── catalog.ts      # Demo businesses
└── docs/                   # Documentation
    ├── DATABASE_RAG_ARCHITECTURE.md
    ├── ARCHITECTURE_REFERENCE.md
    ├── GUARDRAILS.md
    ├── GOOGLE_DRIVE.md
    ├── GEMINI.md
    └── ADMIN.md
```

---

# DEMO FLOW

## Three-Minute Demo

1. **Landing** (`/`)
   - Product introduction
   - "Enter workspace" CTA

2. **Business Selection** (`/enter`)
   - Choose: Daw Hla's Dry Goods (wholesale)
   - Or: Nandar Design Studio (services)

3. **Dashboard** (`/dashboard`)
   - Health: WATCH (payables > cash)
   - Priority: Collect Ko Min (200K, 7d overdue)
   - Risk: Do not restock Product A

4. **AI Advisor** (`/advisor`)
   - Ask: "What should I do today?"
   - Get: One 24-48h action
   - Copy: Collection reminder

5. **Financial View** (`/financial`)
   - Monthly transaction list
   - Document upload
   - Summary analytics

6. **Admin Panel** (`/admin`)
   - Business overview
   - Google Drive import
   - Data management

---

# COMPLIANCE & SAFETY

## Guardrails in Place

**Never Claims:**
- Loan approval
- Guaranteed outcomes
- Future revenue projections
- Investment advice

**Always States:**
- Based on current snapshot
- For discussion purposes
- Validate with professionals
- This week only, not long-term

**Content Moderation:**
- Input validation
- Topic filtering
- Rate limiting
- Response safety checks

**Data Privacy:**
- Tenant isolation
- Session scoping
- No cross-business leakage
- Secure API keys

---

# DEPLOYMENT

## Environment Variables

```bash
# LLM
GEMINI_API_KEY=          # Optional, demo mode if empty
GEMINI_MODEL=gemini-2.0-flash-thinking-exp-01-21
GEMINI_EMBED_MODEL=text-embedding-004

# Database
DATABASE_URL=            # Optional, in-memory if empty

# Google Drive
GOOGLE_DRIVE_ENABLED=false
```

## Build & Run

```bash
npm install
cp .env.example .env.local
npm run dev              # http://localhost:3000
npm run build            # Production build
npm run lint             # Check code quality
```

## Deployment Targets

- **Recommended:** Netlify (Next.js App Router support)
- **Alternative:** Vercel, AWS Amplify, CloudFlare Pages
- **Database:** Neon (serverless PostgreSQL)

---

# ROADMAP (FUTURE)

## Short-term (Next 3 months)

- [ ] Mobile app (React Native)
- [ ] WhatsApp integration
- [ ] Receipt OCR
- [ ] Multi-currency support
- [ ] Advanced analytics dashboard

## Medium-term (6 months)

- [ ] Bank API integrations
- [ ] POS system connectors
- [ ] Team collaboration features
- [ ] Custom report builder
- [ ] Inventory forecasting

## Long-term (12+ months)

- [ ] Predictive cash flow
- [ ] Supplier marketplace
- [ ] Credit scoring (with explicit consent)
- [ ] Business insurance integration
- [ ] Multi-country expansion

---

# SUCCESS METRICS

## Usage Metrics

- Daily active businesses
- Briefs generated per day
- Collections initiated
- Documents imported
- Session duration

## Impact Metrics

- Cash flow improvements
- Collection success rate
- Inventory turnover increase
- Time saved per week
- Business health distribution

## Technical Metrics

- API latency (p95 < 2s)
- Embedding generation time
- Vector search performance
- Database query time
- Error rate < 1%

---

# SUPPORT & DOCUMENTATION

## For Developers

- `AGENTS.md` — Multi-agent system guide
- `docs/DATABASE_RAG_ARCHITECTURE.md` — Database & RAG deep dive
- `docs/ARCHITECTURE_REFERENCE.md` — Quick reference
- `docs/GUARDRAILS.md` — Safety implementation
- `docs/GOOGLE_DRIVE.md` — Google Drive integration

## For Users

- In-app help tooltips
- Quick start guide
- Video tutorials (planned)
- FAQ section
- Support chat

---

# CONCLUSION

**Foundry** is a production-ready, multi-agent SME copilot that:

✅ Provides **one executable action** for 24-48h  
✅ Uses **deterministic tools** for facts, AI for judgment  
✅ Maintains **tenant isolation** and data privacy  
✅ Works in **demo mode** without API keys  
✅ Integrates **RAG** for contextual knowledge  
✅ Supports **9 specialist agents** for comprehensive advice  
✅ Offers **modern UI/UX** with guardrails  
✅ Scales with **PostgreSQL + pgvector**  

**Built for Myanmar SMEs and entrepreneurs. Ready for production.**
