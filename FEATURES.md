# AI ASSISTANCE LAYER

The AI is the primary intelligence layer of the product.

The application should NOT behave like a generic chatbot.

The AI should understand the user's business context,
identify important issues, explain why they matter,
and recommend practical next actions.

The preferred AI workflow is:

USER DATA
↓
AI UNDERSTANDS
↓
AI ANALYZES
↓
AI DETECTS
↓
AI PRIORITIZES
↓
AI RECOMMENDS
↓
USER TAKES ACTION

---

# AI-001 — AI Business Analyst

## Purpose

Analyze the SME's business information and produce a simple,
understandable business assessment.

## Inputs

Possible inputs:

* sales
* expenses
* cash
* receivables
* inventory
* supplier costs
* upcoming payments
* other relevant business context

## AI Responsibilities

The AI should:

* understand the business context
* identify important relationships between data
* summarize the current situation
* identify possible risks
* identify opportunities
* prioritize important findings

## Example Output

```text
BUSINESS HEALTH

🟠 WATCH

Main Issue:
Receivables are increasing while upcoming expenses are high.

Key Findings:
• 3 overdue customer payments
• Upcoming expenses due within 5 days
• Inventory contains slow-moving items
```

## Priority

P0

## AI Value

VERY HIGH

---

# AI-002 — AI Risk Detector

## Purpose

Detect potential business problems that may not be obvious
from raw business data.

## Possible Risks

* cashflow pressure
* overdue receivables
* slow-moving inventory
* excessive expense category
* rising supplier cost
* possible margin compression
* unusual spending
* operational bottlenecks

## Example

```text
⚠ CASHFLOW RISK

Available Cash:
420,000 MMK

Upcoming Expenses:
500,000 MMK

Overdue Receivables:
350,000 MMK

Why this matters:
Upcoming obligations may create short-term
cash pressure if receivables are delayed.
```

## Priority

P0

## Important

AI should identify a potential risk based on available data.

Do not present uncertain predictions as guaranteed outcomes.

---

# AI-003 — AI Next-Best-Action

## Purpose

Convert analysis into one clear recommended action.

The key product question is:

> "What should I do next?"

## Example

```text
TODAY'S PRIORITY

🔴 Follow up with 3 overdue customers.

WHY?

Your upcoming expenses are higher than
your currently available cash.

RECOMMENDED ACTION

Collect the highest-priority receivables first.
```

## Priority

P0

## AI Value

VERY HIGH

## Product Importance

This is one of the primary differentiating features.

The application should not stop at:

"Here is your data."

It should continue to:

"Here is what the data suggests you should do next."

---

# AI-004 — AI Recommendation Explanation

## Purpose

Explain why the AI generated a recommendation.

## Example

```text
RECOMMENDATION

Do not restock Product A.

WHY?

• 20 units are still in stock
• Only 2 units were sold this month
• Sales velocity is low
• Approximately 1,000,000 MMK is tied up in stock
```

## Priority

P0

## Reason

Users should be able to understand the reasoning
behind recommendations.

Avoid unexplained AI decisions.

---

# AI-005 — Burmese AI Business Assistant

## Purpose

Allow SME owners to interact naturally in Burmese.

## Example Questions

```text
ဒီနေ့ ဘာလုပ်သင့်လဲ?

ဘယ်ပစ္စည်းကို မမှာသင့်သေးလဲ?

ငွေဘယ်နေရာမှာ ပိတ်မိနေလဲ?

ဒီလ အမြတ်ဘာကြောင့် လျော့သွားတာလဲ?

ဘယ် customer ကို အရင် follow up လုပ်သင့်လဲ?
```

## AI Requirement

Responses should be grounded in the user's available
business information.

Do not provide generic business advice when relevant
business data is available.

## Priority

P1

## Differentiation

Myanmar-first interaction.

---

# AI-006 — AI Daily Business Brief

## Purpose

Provide a short daily summary of what matters most.

## Example

```text
GOOD MORNING 👋

Business Health:
🟠 WATCH

AI NOTICED:

• Revenue decreased 8%
• Receivables increased 22%
• Slow-moving inventory increased

TODAY'S PRIORITY:

Follow up on overdue payments.

WHY:

Short-term cash pressure is increasing.
```

## Priority

P1

## Demo Value

HIGH

---

# AI-007 — AI Action Generator

## Purpose

Turn a recommendation into a ready-to-use action.

## Example

```text
Customer:
Mg Mg

Amount:
200,000 MMK

Status:
7 days overdue

[ Generate Reminder ]
```

AI generates a Burmese customer reminder.

## Priority

P1

## Example Workflow

AI detects overdue payment
↓
AI prioritizes customer
↓
AI generates reminder
↓
User reviews
↓
User sends or copies message

---

# AI-008 — AI Natural Language Data Extraction

## Purpose

Allow users to enter business information naturally
instead of filling complex forms.

## Example Input

```text
မနေ့က မောင်မောင်ကို
၂ သိန်းဖိုး အကြွေးပေးထားတယ်။
သောကြာနေ့ပြန်ပေးမယ်။
```

## Expected Structured Output

```json
{
  "customer": "Maung Maung",
  "amount": 200000,
  "type": "receivable",
  "due": "Friday",
  "status": "pending"
}
```

## Priority

P1

## AI Value

VERY HIGH

---

# AI-009 — AI Insight Generation

## Purpose

Turn structured business data into concise insights.

## Example

```text
INSIGHT

Inventory value increased 18%,
while sales volume remained almost unchanged.

Potential concern:
More cash may be tied up in inventory.

Suggested action:
Review slow-moving products before restocking.
```

## Priority

P1

---

# AI-010 — AI Evidence / Context Display

## Purpose

Show which business data contributed to a recommendation.

## Example

```text
WHY THIS RECOMMENDATION?

Based on:

• 30-day sales
• current inventory
• purchase cost
• receivables
• upcoming expenses
```

## Priority

P1

## Reason

This improves transparency and user trust.

---

# AI-011 — AI Scenario Assistant

## Purpose

Help the owner explore simple "what if" questions.

## Example

```text
What if I increase this product's price by 10%?

What if I buy 100 more units?

What if the customer pays 7 days late?
```

## Priority

P2

## Warning

Do not implement complex financial forecasting
during the 4-hour MVP unless it is the central challenge.

---

# AI-012 — AI Business Memory

## Purpose

Remember previous business information and decisions
so the owner can ask contextual questions.

Possible information:

* previous sales
* previous expenses
* inventory
* suppliers
* customer issues
* previous recommendations

## Example

```text
Last month, which product had the highest
inventory risk?

What did you recommend last time?
```

## Priority

P2

## 4-Hour Rule

Only implement a simplified version if the selected
solution strongly depends on historical context.

---

# AI-013 — AI Financial Readiness Assistant

## Purpose

Help an SME organize its available business information
into a clearer financial summary.

Possible sections:

* revenue
* expenses
* cashflow
* receivables
* inventory
* business risks

## Output

```text
FINANCIAL READINESS SUMMARY

Revenue records:
Available

Expense records:
Available

Cashflow information:
Partially available

Receivable records:
Available

Recommended improvement:
Maintain consistent monthly records.
```

## Priority

P2

## Important

Do NOT claim:

"Your loan will be approved."

Do NOT claim:

"You are guaranteed to qualify for financing."

Use:

"Helps organize information for financial review."

---

# AI OUTPUT STANDARD

AI-generated results should preferably follow a structured format.

Example:

```json
{
  "businessHealth": "WATCH",
  "summary": "...",
  "keyIssues": [
    "...",
    "..."
  ],
  "priority": {
    "title": "...",
    "reason": "...",
    "action": "..."
  },
  "recommendations": [
    "...",
    "..."
  ],
  "evidence": [
    "...",
    "..."
  ]
}
```

Do not rely on uncontrolled free-form AI text
for important UI elements when structured output is possible.

---

# AI FAILURE HANDLING

The AI layer must handle:

* API timeout
* API error
* empty response
* malformed response
* invalid JSON
* unavailable model
* network failure

Example user-facing fallback:

```text
Unable to analyze the business right now.

Please try again.
```

Do not expose raw API errors to the user.

---

# AI TRUST PRINCIPLES

The product should:

* explain important recommendations
* distinguish facts from interpretations
* show relevant supporting data
* avoid fabricated business information
* avoid claiming certainty where none exists
* avoid guaranteeing financial outcomes
* avoid pretending to have access to unavailable data

---

# AI PRIORITY FOR 4-HOUR MVP

## P0 — MUST HAVE

1. AI Business Analysis
2. AI Risk Detection
3. AI Next-Best-Action
4. Recommendation Explanation

## P1 — SHOULD HAVE

5. Burmese AI Assistant
6. Natural Language Data Extraction
7. Daily Business Brief
8. Action Generator

## P2 — NICE TO HAVE

9. Scenario Assistant
10. Business Memory
11. Financial Readiness Assistant

---

# AI DESIGN PRINCIPLE

The AI should answer this sequence:

### 1. What is happening?

AI Analysis

### 2. What is wrong?

Risk Detection

### 3. What matters most?

Prioritization

### 4. What should I do?

Next Best Action

### 5. Why?

Explanation

### 6. Can you help me do it?

Action Generation

---

# FINAL AI PRODUCT LOOP

The ideal product experience is:

```text
BUSINESS DATA
      ↓
AI UNDERSTANDS CONTEXT
      ↓
AI IDENTIFIES PROBLEM
      ↓
AI PRIORITIZES
      ↓
AI EXPLAINS
      ↓
AI RECOMMENDS ACTION
      ↓
USER ACTS
      ↓
BUSINESS IMPROVES
```

The AI is not merely answering questions.

The AI is helping the SME owner make better decisions.
