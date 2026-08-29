# FEATURES.md

# FOUNDRY DECISION BRIEF — NECESSARY BUILD

The **only** feature list for the solution locked in `PROBLEMS.md`.

**Research lock:** `SME_PROBLEM_MAP.md` combos **A + E**  
(#3 informal credit + #6 cashflow + #7 next-best-action + #8 scatter as input; #4 dead stock as signal)

**Job:** A Myanmar shop snapshot becomes **one** financial action for today.

If it is not in this file, do not build it.  
If time is short: cut P3, then P2, then P1. **Never cut P0.**

---

# 0. NECESSARY VS NOT

The map’s bar: clear pain, measurable consequence, real AI job, simple input, clear output, strong demo, 4 hours.

| Build | Research | Why necessary |
| --- | --- | --- |
| Sample shop + snapshot | #6, #8 | Demo cannot depend on a judge inventing books |
| Deterministic cash / credit / stock tools | #3, #4, #6 | Map: do not use AI where subtraction works |
| One next-best-action brief | #7 | This **is** the product |
| Structured JSON + demo fallback + errors | `RULE.md` 6, 10, 13 | Judge path must survive no key / bad API |
| Messy credit-note extract | #3, #8, combo D | Map’s own example; P1 after P0 |
| Copy collection reminder | #3 “collection action” | Closes DATA → ACTION |

| Do not build | Research | Why not necessary |
| --- | --- | --- |
| Expense “you are wasting money” coach | #1 | Needs history; savings claims are unsupported |
| Staff handover pack | #2 | Wrong job |
| Standalone inventory app | #4 as a product | Signal only |
| Cost-inflation module | #5 as a product | Only a flag if three numbers exist |
| Bank readiness report | #9 | Forbidden approval language; not daily |
| Second AI chatbot | — | `RULE.md`: no chatbot to claim AI |
| Market / Growth on the cash path | — | Dilutes the challenge |
| Database, POS, bank APIs | — | 4-hour risk |

---

# 1. JUDGE PATH (P0 MUST WORK)

```text
USER     Myanmar owner (judge uses the sample)
  ↓
INPUT    Snapshot and/or note  +  “What should I do today?”
  ↓
TOOLS    Cash gap · overdue rank · slow stock   (#6 #3 #4)
  ↓
AI       Finance-first crew picks ONE action     (#7)
  ↓
RESULT   Health · issues · priority · why · evidence
  ↓
ACTION   Collect a named person  or  do not restock
```

Works in **demo mode** (no key) and **LLM mode**.  
Do not add screens before this path is reliable.

---

# 2. AI DESIGN

```text
INPUT
  shop (name, type, Myanmar location)
  snapshot: cash, sales, expenses, receivables, stock, upcoming payables
  optional messy note (EN or Burmese)     #8 #3
  ask (default: what should I do today?)
        ↓
DETERMINISTIC TOOLS                         #6 #3 #4
  cash − payables
  receivables ranked by amount and days
  slow stock if quantity and sales exist
        ↓
AI TASK                                     #7
  read tool facts + note
  pick ONE priority
  explain using supplied numbers only
        ↓
STRUCTURED OUTPUT
  JSON the UI renders
        ↓
DECISION
  collect / hold stock / delay spend
        ↓
USER ACTION
  follow up  or  skip a purchase  [+ copy reminder if P1]
```

Do not invent customers or balances.  
Do not state a guaranteed loss or gain.  
Do not label tool math as “the model predicted.”

---

# 3. PRIORITY KEY

| | Meaning |
| --- | --- |
| **P0** | Demo is dead without it |
| **P1** | Map-backed value after P0 works |
| **P2** | Polish / extra signal if numbers exist |
| **P3** | Cut first |

---

# 4. P0 — MUST HAVE

Four features. Verify on the sample shop before anything else.

---

## F-001 — Sample shop + snapshot input

**Research:** #6, #8  
**Why necessary:** Judges and demo mode need the same facts every time.

**Context (short):** name, type (retail / wholesale / restaurant / online), Myanmar place, owner ask.

**Accept one of:**

1. Preloaded sample (required)
2. Typed snapshot fields
3. A short note (full extract quality is P1; P0 may treat the note as raw context)

No spreadsheet. No bank upload.

**Canonical sample** (illustrative — map #3 example + #6 + #4). Not a real business.

```text
Daw Hla's Dry Goods — Mandalay wholesale

Cash on hand              420,000 MMK
This week sales           850,000 MMK
Upcoming payable (5 days) 500,000 MMK

Receivables
  Ko Min   200,000 MMK   overdue 7 days     (“took 3 boxes last Friday”)
  Ma Su    150,000 MMK   due Friday

Stock
  Product A   20 units   2 sold this month   ~1,000,000 MMK on shelf
```

This one sample must be enough to show: cash tight vs payable, who to collect first, do not restock A.

**Priority:** P0

---

## F-002 — Local decision tools

**Research:** #3, #4, #6 — and the map’s warning that AI is not always better than logic.

**Why necessary:** Reliable demo numbers; AI only judges, it does not invent arithmetic.

Implement as existing-style local tools in `src/lib/agents/tools.ts`. No network.

| Tool | Input | Output |
| --- | --- | --- |
| `cash_pressure` | cash, upcoming payables | gap, TIGHT if payables > cash |
| `receivable_rank` | customer, amount, due/overdue | ordered list, top name |
| `slow_stock` | qty, sold in period, optional cost | flag + MMK tied if cost given |

Optional in the same run, only if fields exist: `cost_vs_price` (#5). Never invent a prior cost.

Finance (and Ops if stock is present) must call these before the memo.

**Priority:** P0

---

## F-003 — Next-best-action brief

**Research:** #7 (product), combo A + E  
**Why necessary:** This is what judges remember. Chat history is not the product.

**Crew:** Conductor + **Finance** always. **Ops** only if stock/supplier lines exist. Do not force Market or Growth onto a cash ask. Strategy only if it keeps the brief short — no 90-day deck.

**SSE stays:** `session → plan → agent_start → tool → agent_end → token → done`

**Render:**

| Block | Answers |
| --- | --- |
| Health `OK` / `WATCH` / `TIGHT` | What is happening? (#6) |
| Key issues (max 3) | What looks wrong? |
| **One** priority | What matters most? (#7) |
| Why | Why this, not the rest |
| Action (24–48h) | What to do |
| Evidence | Which snapshot / tool facts |

Example (copy for UI, not a live forecast):

```text
HEALTH     🟠 WATCH

TODAY
Collect Ko Min (200,000 MMK, 7 days overdue).
Do not restock Product A.

WHY
Payable 500,000 in 5 days > cash 420,000.
Ko Min is the largest overdue.
Product A already sits slow — buying more locks more cash.   (#4 signal)

EVIDENCE
cash_pressure, receivable_rank, slow_stock
```

**JSON contract:**

```json
{
  "businessHealth": "WATCH",
  "summary": "Payables outrun cash while one large overdue sits.",
  "keyIssues": [
    "Ko Min 200000 MMK overdue 7d",
    "Payables 500000 vs cash 420000",
    "Product A slow"
  ],
  "priority": {
    "title": "Collect Ko Min first",
    "reason": "Largest overdue while cash is below the 5-day payable.",
    "action": "Contact Ko Min today. Do not restock Product A this week."
  },
  "recommendations": ["Do not restock Product A this week"],
  "evidence": [
    "cash 420000",
    "payables 500000 due 5d",
    "Ko Min 200000 overdue 7d"
  ],
  "locale": "en"
}
```

`businessHealth`: `OK` | `WATCH` | `TIGHT` only.  
Parse JSON; ignore extra prose.

**Demo `demo()`:** Must emit this brief for the sample shop, not a generic founder memo.  
If the live model fails: say unavailable or that demo mode is on. **Do not call a mock “live AI.”**

**Empty / error:** “Unable to analyze the shop right now.” No raw provider errors. If nothing was entered: “Add cash, credit, or stock — or load the sample.”

**Priority:** P0  
**AI value:** Required

---

# 5. P1 — AFTER THE SAMPLE BRIEF WORKS

---

## F-004 — Credit-note extraction

**Research:** #3, #8, combo D  
**Map example:** “Ko Min took 3 boxes last Friday. He will pay next week.”

**Why necessary:** Many owners will not fill a form. Extraction is the map’s key product question — *can unstructured records become a financial action?* It is an **input** to F-003, not a second app.

```text
မနေ့က မောင်မောင်ကို ၂ သိန်းဖိုး အကြွေးပေးထားတယ်။ သောကြာနေ့ပြန်ပေးမယ်။
        ↓
{ "customer": "Maung Maung", "amount": 200000, "type": "receivable", "due": "Friday", "status": "pending" }
        ↓
same receivable_rank + same brief
```

Unknown amount stays unknown. Do not invent MMK.

**Priority:** P1

---

## F-005 — Copy collection reminder

**Research:** #3 collection action  
**Why necessary:** Closes the loop the map asks for (insight → action).

If the priority names an overdue customer: **Copy reminder** (MY or EN). Owner sends on their own channel. The app does not message anyone.

```text
Ko Min — 200,000 MMK — 7 days overdue
[ Copy reminder ]
```

**Priority:** P1

---

## F-006 — Burmese brief

**Research:** Challenge is Myanmar-first (not a map ID).  
**Why:** Owner may ask in Burmese. Not required for an English judge demo.

```text
ဒီနေ့ ဘာလုပ်သင့်လဲ?
ဘယ် customer ကို အရင် follow up လုပ်သင့်လဲ?
ငွေဘယ်နေရာမှာ ပိတ်မိနေလဲ?
```

Ground every answer in the snapshot. If Burmese quality is poor, keep English brief + bilingual ask. Do not fake fluency.

**Priority:** P1

---

# 6. P2 — ONLY IF P0+P1 ARE SOLID

| ID | What | Research | Rule |
| --- | --- | --- | --- |
| F-007 | `cost_vs_price` flag in the same brief | #5 | All three numbers required. Indicator, not “you are losing money.” |
| F-008 | Evidence line already in F-003, shown more clearly | trust | No extra model call |
| F-009 | Second sample (tea shop vs wholesale) | demo variety | Same schema, same tools |

Do not add a “daily morning” AI job. Tighter copy of F-003 is enough.

---

# 7. P3 — CUT FIRST

| Idea | Research | Why cut |
| --- | --- | --- |
| Expense leak / savings coach | #1 | Unsupported savings |
| Staff handover briefing | #2 | Wrong user job |
| What-if / forecast | — | Fake certainty |
| Cross-session memory | — | Needs storage |
| Financial readiness PDF | #9 | Claim risk |
| Market / Growth specialists | — | Wrong ask |

If #9 is ever mentioned in copy: **helps organize numbers for a discussion.** Never “approved” or “you qualify.”

---

# 8. HEALTH LABELS

Readings of **this snapshot**, not credit ratings.

| Label | Meaning |
| --- | --- |
| OK | Tools do not show near-term cash stress |
| WATCH | Tension: timing, overdue, or slow stock |
| TIGHT | Payables or overdues clearly pressure cash **in the input** |

---

# 9. STACK

This repo only.

| Need | Choice |
| --- | --- |
| UI | Next.js 15, existing console |
| API | `POST /api/agents/run` SSE |
| LLM | `src/lib/llm/complete.ts` · demo if no key |
| Crew | `src/lib/agents` — extend, do not replace |
| Tools | `src/lib/agents/tools.ts` (F-002) |
| Data | Request + one in-repo sample |
| External APIs | None for P0 |

No second framework. No new UI kit. No database for P0.

---

# 10. BUILD ORDER

1. Sample shop on screen (F-001)  
2. Tools return gap / rank / slow (F-002)  
3. Brief JSON in demo mode (F-003)  
4. Same brief in LLM mode  
5. UI: health, one action, why, evidence  
6. Errors  
7. Then F-004 → F-005 → F-006  

Skip database. Polish last.

---

# 11. WHEN BEHIND

1. Drop all P3  
2. Drop F-007–F-009  
3. Drop F-006, then F-005, then F-004  
4. Keep F-001–F-003  

A reliable English brief on Daw Hla beats an unfinished Burmese chatbot.

---

# 12. THREE-MINUTE DEMO

1. Console → load **Daw Hla's Dry Goods**.  
2. Ask: “What should I do today so cash does not break?”  
3. Show tools: payable > cash, Ko Min first, Product A slow.  
4. Read **one** action.  
5. If P1: copy Ko Min reminder.  
6. Bank question: “We help the owner decide this week. We do not score loans.”

That is the submission. Everything else is extra.

---

# 13. ADDITIONS (same product)

## F-014 — Database design (optional Neon + pgvector)

P0 still runs from the request + in-repo sample when `DATABASE_URL` is empty.

When set: persist shops, payables, receivables, inventory, sessions, messages, and the F-003 decision card. Store practice/trust/reminder chunks in **pgvector** (`vector(768)`, Gemini `text-embedding-004`). **Ledger tools win** — vector hits cannot introduce MMK or customers.

Full design: `docs/DATABASE.md`. Schema: `src/lib/db/schema.ts`.

**Priority:** P2

## F-015 — SME and entrepreneur copilot (challenge lock)

Official brief: smarter **financial** decisions, everyday **management**, practical **growth** for Myanmar SMEs **and** entrepreneurs. Bank motive: strategic support with real impact — not a loan score.

P0 Daw Hla cash path is unchanged. The same JSON brief (`OK` | `WATCH` | `TIGHT`) now covers four pillars. Still **one** 24–48h priority. Do not invent MMK. Do not forecast “you will grow X%.” Do not add TAM, ads, or Market/Growth decks.

| Challenge line | Product |
| --- | --- |
| Smarter financial decisions | Finance + `cash_pressure` + `receivable_rank` |
| Manage the business | Supply (`supplier_pressure`, `slow_stock`) + Resources (`resource_load` — do not hire) |
| Grow this week | Analytics (`business_pulse` on this snapshot only) + Action (copy reminder) |
| Bank strategic support | Same card **helps organize numbers for a discussion.** Never “approved” or “you qualify.” |

Crew: Conductor + Finance always. Supply if payables or stock. Resources + Analytics on a full Analyze ask. Books / Action as today.

Samples: Daw Hla (canonical SME) plus a founder/services row. Snapshot = shop, studio, kitchen, workshop, or founder — same tools.

**Priority:** P0 polish (same product, challenge-complete)


