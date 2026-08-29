# PROBLEMS.md

# AI FOR SMEs & ENTREPRENEURS

Source of truth for **the problem** and **the one solution we build**.

Follows `RULE.md` Phases 1–4.  
Research intake: `research/SME_PROBLEM_MAP.md`.  
Build spec: `FEATURES.md` (selected solution only).

The official challenge outranks research. Research is **hypothesis**, not proof.

---

# 0. OFFICIAL CHALLENGE

**Topic:** AI for SMEs & Entrepreneurs

**Ask:** How can AI help SMEs and entrepreneurs make smarter decisions, solve everyday problems, and grow?

**Build:** An AI partner for **Myanmar** SMEs — smarter **financial** decisions, everyday management, practical growth.

**Bank motive (FACT — challenge text):** Support SMEs through a stronger strategic connection. AI should create real impact, not a slide deck.

**Not the brief:** TAM essay, loan approval, full ERP, “post more on social.”

**Product question (from research combo A + E):**

> Who owes me money, where is cash tight, and **what should I do today?**

---

# 1. HOW TO READ THIS FILE

| Label | Meaning |
| --- | --- |
| **FACT** | Challenge text, or true of this repo / ordinary software |
| **HYPOTHESIS** | Item from `SME_PROBLEM_MAP.md` — plausible, not universal |
| **ASSUMPTION** | Needed for a 4-hour demo — stated, not proven |

The research file itself says: do not treat every SME as the same; do not assume informal books, no bank access, or that AI beats simple math; do not promise financial results.

---

# 2. RESEARCH INTAKE

Every map item, judged with the map’s own bar:

1. clear pain  
2. measurable consequence  
3. real AI job  
4. simple input  
5. clear output  
6. strong demo  
7. fits 4 hours  

**Use** = in the selected product. **Signal** = may appear in the brief if the numbers exist. **Out** = do not build.

| Map | Hypothesis | Map MVP | Demo | 4h | Decision | Why |
| --- | --- | --- | --- | --- | --- | --- |
| **#6 Cashflow** | Owner cannot turn income, expense, credit, and payables into a short-term cash picture | VERY HIGH | VERY HIGH | MED | **USE** | Challenge is financial decisions. Strongest daily consequence. |
| **#3 Informal credit** | Credit lives in notebooks, chats, memory | HIGH | HIGH | LOW | **USE** | Map’s own question: can messy notes become a financial action? |
| **#7 Decision fatigue** | Owner has pieces but no “do this next” | VERY HIGH | VERY HIGH | LOW–MED | **USE — product job** | Map: this is what turns a dashboard into a partner. |
| **#8 Data scatter** | Facts sit in notes, sheets, receipts, memory | VERY HIGH | HIGH | LOW–MED | **USE — input** | Input path, not a second product. |
| **#4 Dead stock** | Slow items get re-ordered; cash sits on the shelf | VERY HIGH | VERY HIGH | LOW–MED | **SIGNAL** | Supporting evidence when stock lines exist. Not the whole app. |
| **#5 Cost inflation** | Cost rose, price did not | VERY HIGH | HIGH | LOW | **SIGNAL** | Only if previous cost, current cost, and price are all present. No guaranteed-loss copy. |
| **#1 Micro-expenses** | Small spends go unrecorded | HIGH | MED | LOW | **OUT of P0** | Easy to fake “you saved money.” Weak without a history the owner will not type in 4 hours. |
| **#2 Staff handover** | New person cannot reconstruct cash, stock, follow-ups | HIGH | HIGH | LOW–MED | **OUT** | Strong demo, wrong job: staffing, not this week’s financial decision. |
| **#9 Bank readiness** | Records are not conversation-ready | HIGH | MED | MED | **OUT** | Map forbids loan-approval claims. Report, not a daily partner. |

## Research combinations (map § PROBLEM COMBINATIONS)

| Combo | Map question | Verdict |
| --- | --- | --- |
| **A. Cashflow + receivables** | Who owes me, and what do I prioritize today? | **Core** |
| **E. Data + next-best-action** | Tell me what to do next. | **Core — the product** |
| **B. Inventory + cashflow** | Where is my money stuck? | Signal inside the brief |
| **D. Messy records + AI** | Turn notes into useful information. | Input path for A+E |
| **C. Expenses + AI** | Where am I quietly losing money? | Out of P0 (same risk as #1) |

**Locked research stack:**

```text
#8 scatter (how data arrives)
      +
#3 credit  +  #6 cash  [+ #4 stock if present]
      +
#7 next-best-action (what we ship)
```

That is map combos **A + E**. Combo B may appear as “do not restock.” Combo D is how a note gets in. Combos C and #9 are not the product.

---

# 3. PHASE 1 — PROBLEM ANALYSIS

## 3.1 Real user

**Primary (locked):**

> Myanmar SME owner who personally decides cash, customer credit, and (often) stock this week — shop, small wholesale, tea shop / restaurant, or online seller.

**FACT:** Challenge audience is Myanmar SMEs and entrepreneurs.

**ASSUMPTION:** They can paste a short snapshot or accept one sample shop. No live POS or bank feed in 4 hours.

**Secondary (not the user):** Bank team that wants SMEs easier to support.

**FACT:** Challenge names that motive.

**ASSUMPTION:** A owner who can act on cash this week is a better partner than a fake “loan-ready” PDF.

---

## 3.2 Pain

**FACT:** Totals on a screen are not a decision.

**HYPOTHESIS (#6, #7, #8):** The owner may have sales, expenses, who owes them, and what they must pay — in pieces — and still cannot answer what to do before the next payable.

```text
Sales + expenses + credit + stock + supplier bills
        ↓
Scattered records          (#8)
        ↓
Mental math / guess        (#7)
        ↓
Business decision
```

Gap: **DATA → DECISION**

They do not need more fields. They need:

> What is tight, **who to collect or what not to buy**, and **what to do today**.

---

## 3.3 Current workaround

**HYPOTHESIS** (map #3, #4, #6, #7):

- Closing-time head math
- Notebook / Viber / Telegram (“Ko Min took 3 boxes last Friday…”)
- Ask staff who is overdue
- Buy because the supplier is at the door (#4)
- Collect whoever is easiest, not who covers the payable (#3 + #6)
- Wait until cash *feels* short, then react (#6)

**FACT:** Ordinary software stops at RECORD → STORE → DISPLAY.

---

## 3.4 Business consequence

**HYPOTHESIS — possible, not guaranteed:**

| If… | Then the owner may… | Map |
| --- | --- | --- |
| Large overdue sits while a bill is due | Miss a payable with cash “on paper” | #3 + #6 |
| Slow SKU gets re-ordered | Lock MMK on the shelf | #4 + #6 |
| Cost up, price flat | Margin thins without a decision | #5 |
| Everything looks urgent | Spend the day on the loud task, not the cash task | #7 |

**Bank (HYPOTHESIS):** An SME that cannot see its own week is harder to support. Connection stays thin. That is a motive, not a feature.

---

## 3.5 Opportunity

Research #7 is the differentiation: **next-best-action**, not another chart.

```text
RECORD → UNDERSTAND → PRIORITIZE → RECOMMEND → ACT
```

**Partner, not dashboard:**

> Take this week’s shop facts (typed or messy) and return **one** action for the next 24–48 hours, with why and the numbers used.

Owner value: a decision they can execute.  
Bank value (honest): a more numerate SME. Not a credit score.

---

## 3.6 AI opportunity

The map warns: **do not assume AI is better than deterministic logic.**

| Job | Who does it |
| --- | --- |
| Cash vs upcoming payables | Local tool (math) |
| Rank overdue by amount / days | Local tool (math) |
| Flag slow stock if qty + sales exist | Local tool (math) |
| Cost vs price if all three exist | Local tool (math) |
| Read a messy EN/MY note | AI (#3, #8) |
| Pick **one** priority when issues compete | AI (#7) |
| Explain in owner language | AI |
| Structured brief for the UI | AI |

AI is required for judgment and language. It is not required to subtract two numbers.

```text
INPUT     snapshot and/or messy note + ask
   ↓
TOOLS     cash gap, credit rank, slow stock
   ↓
AI TASK   prioritize, explain, one action
   ↓
JSON      health, issues, priority, action, evidence
   ↓
DECISION  collect / hold stock / delay spend
   ↓
ACTION    follow up a named person or skip a purchase
```

No chatbot that advises with empty books.

---

# 4. THREE SOLUTION CONCEPTS

Exactly three. Each is a **research combination**, not a tech stack.

---

## Concept A — Cash + Credit + Today’s Action

**Research:** combo A + E · maps #3, #6, #7, #8 · #4 as signal

**User:** Myanmar SME owner or entrepreneur (shop, studio, kitchen, workshop, founder).

**Problem:** They can list sales, who owes them, and what they must pay — and still cannot answer “what do I do today so cash does not break?”

**Solution:** Load a sample or paste this week’s numbers / a credit note. Tools compute gaps. Crew returns one brief: health, up to three issues, **one** priority, why, action, evidence.

**AI role:** Extract a messy credit line if needed; choose among competing issues; explain. Not a formatter. Not free chat.

**Journey:**

```text
Console → sample or paste
       → “What should I do today?”
       → tools + finance-first crew
       → one action (collect Ko Min / do not restock)
       → copy reminder if P1
```

**Innovation:** Map #7 — decision partner. Myanmar sample. Bank story without underwriting.

**Complexity:** Medium (crew already exists).  
**Demo:** Very high (map: #6 and #7).  
**Risk:** Scope creep — extra agents and extra map items.

---

## Concept B — Where is my money stuck?

**Research:** combo B · maps #4, #6 · #5 optional

**User:** Owner who holds inventory.

**Problem:** Slow stock keeps getting bought; cash sits on the shelf.

**Solution:** Stock + velocity in → flagged SKUs, MMK tied up, restock / hold.

**AI role:** Explain the hold. Most of the work is deterministic (map: AI not always better than math).

**Journey:** Enter lines → see “do not restock A.”

**Innovation:** Sharp SKU story. Map demo = VERY HIGH.

**Complexity:** Low–medium.  
**Demo:** High for inventory, weak if judges ask who to collect this week.  
**Risk:** Incomplete challenge answer (financial decisions + manage + grow).

---

## Concept C — Messy notes, structured books

**Research:** combo D · maps #8, #3 · cousin of #2

**User:** Owner whose week lives in chat and paper.

**Problem:** Facts exist; they are not structured, so nothing can be decided.

**Solution:** Paste notes → customer / amount / due / stock lines out.

**AI role:** Extraction. Stops at “here is a table” unless it becomes Concept A.

**Journey:** Paste “Ko Min took 3 boxes…” → structured row.

**Innovation:** High AI utilization on language. Map MVP = VERY HIGH.

**Complexity:** Low.  
**Demo:** Extraction wow, then “so what?”  
**Risk:** A parser, not a partner. Handover (#2) is the same trap: tidy lists, no cash decision.

---

# 5. PHASE 3 — SCORE

Official 100-point rubric. Research priority used as a tie-break.

| Criterion | A Cash+credit+action | B Money stuck | C Note parser |
| --- | ---: | ---: | ---: |
| Problem & Impact /25 | **23** | 19 | 16 |
| AI Utilization /25 | **22** | 15 | 20 |
| Innovation /20 | **16** | 14 | 13 |
| Execution /20 | **17** | 18 | 18 |
| Practicality /10 | **9** | 8 | 7 |
| **Total /100** | **87** | **74** | **74** |
| 4-hour /5 | **4** | 5 | 5 |
| Demo reliability /5 | **5** | 4 | 3 |

**A wins:** Hits the challenge (financial decision today), uses the map’s strongest combo (A+E), gives AI a real job (#7) and tools a real job (#6, #3), demo is one path.

**B loses:** Map loves the demo; the brief is wider than inventory.

**C loses:** Map loves extraction; the product would stop before the decision. Extraction is **P1 input** for A, not the app.

#9 Bank pack was not a fourth concept (`RULE.md`: exactly three). It fails Practicality (claim risk) and the “daily partner” ask.

---

# 6. PHASE 4 — DECISION

## Build this

> **Concept A — Cash + Credit + Today’s Action**  
> (Foundry Decision Brief)

Smallest product: Myanmar business snapshot (SME or founder) → **one executable next decision**, with why and evidence.

| `RULE.md` prefer | Fit |
| --- | --- |
| Meaningful problem | This week’s cash and credit (#6, #3) |
| Clear AI value | One priority + explanation (#7) |
| Working MVP | Existing crew + demo mode |
| Strong demo | User → input → AI → result → action |

Do not pick A because it has more agents or more features.

## Locked statements

**Short:**  
Myanmar SME owners often hold this week’s sales, credit, and bills in fragments (#8). They lack a simple way to turn that into **one** financial action (#7). Calls get slower and easier to get wrong.

**Pitch:**  
The problem is not missing data. The data does not become a decision. They need what is tight, what matters most, why, and what to do **today** (research: *Who owes me, and what should I prioritize?*).

**Bank (honest):**  
A shop that can see cash pressure is easier to support. We organize the week’s decision. We do not approve credit (map #9).

**Human still decides.** If A is rejected, build B (dead stock), not C or #9. Do not invent a fourth product.

---

# 7. OUT OF SCOPE

| Do not build | Research reason |
| --- | --- |
| Loan score / “bank will approve” | Map #9 forbidden language |
| Live bank, CB, MPU, POS | 4-hour + no feed (**ASSUMPTION**) |
| Bookkeeping / inventory ERP | Wrong product |
| Staff handover briefing | Map #2 — high demo, wrong job |
| Expense “savings” coach | Map #1 — unsupported savings |
| Standalone note parser | Combo D without #7 |
| Generic global founder chat | Wrong user |
| Multi-week forecast / what-if engine | Not in the map’s 4-hour bar |

Behind schedule: drop P3, then P2, then P1. **Never drop the P0 brief.**

---

# 8. PROBLEM → SOLUTION CONTRACT

| Owner question | Research | Product answers with |
| --- | --- | --- |
| Who owes me, who first? | #3, combo A | Ranked receivable + one name |
| Why is cash tight if sales look fine? | #6 | Cash vs payables vs overdue |
| Where is money stuck? | #4, combo B | Slow SKU as a **signal**, not a second app |
| What do I do today? | #7, combo E | Exactly one action |
| I only have a chat note | #8, #3, combo D | Extract, then same brief |
| Will the bank approve me? | #9 | **We do not answer that** |

Judges should hear: Myanmar owner, decision gap, AI changed a pile into one action, something they can do in 24 hours, bank = support not lending.

Necessary features for that contract are in `FEATURES.md`.
