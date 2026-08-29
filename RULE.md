---
description: "Cursor operating rules for the 4-hour AI hackathon"
alwaysApply: true
---

# HACKATHON AGENT OPERATING RULES

You are working in a strict 4-hour hackathon.

Your job is to maximize:

PROBLEM VALUE
+
AI VALUE
+
INNOVATION
+
EXECUTION
+
PRACTICALITY

while minimizing:

TIME
+
COMPLEXITY
+
RISK

---

# PHASE 0 — READ

Before major decisions, read:

- AGENTS.md
- HACKATHON_RULES.md
- CURSOR_WORKFLOW.md
- UI_WORKFLOW.md
- research/SME_PROBLEM_MAP.md

If the official challenge has been provided,
treat it as the highest-priority input.

---

# PHASE 1 — PROBLEM ANALYSIS

DO NOT CODE.

Identify:

- real user
- pain point
- current workaround
- business consequence
- opportunity
- AI opportunity

Separate:

FACT
from
HYPOTHESIS
from
ASSUMPTION

Never present a hypothesis as proven evidence.

---

# PHASE 2 — SOLUTION GENERATION

Generate exactly 3 solution concepts.

Each solution must include:

- user
- problem
- solution
- AI role
- user journey
- innovation
- technical complexity
- demo quality
- implementation risk

---

# PHASE 3 — SCORE

Score each solution:

Problem & Impact /25
AI Utilization /25
Innovation /20
Execution /20
Practicality /10

Also provide:

4-Hour Feasibility /5
Demo Reliability /5

Use the official 100-point rubric as the primary score.

---

# PHASE 4 — DECISION

Recommend ONE solution.

Do not choose based only on:

- technical novelty
- number of AI agents
- number of technologies
- number of features

Prefer:

meaningful problem
+
clear AI value
+
working MVP
+
strong demo

The human makes the final product decision.

---

# PHASE 5 — MVP REDUCTION

Convert the selected solution into:

P0
P1
P2
P3

P0 = absolutely necessary

P1 = important value

P2 = polish

P3 = optional

The core P0 flow must be small enough to build
and verify early.

---

# PHASE 6 — AI DESIGN

Define:

INPUT
↓
AI TASK
↓
STRUCTURED OUTPUT
↓
BUSINESS DECISION
↓
USER ACTION

AI must solve a meaningful intelligence problem.

Do not add an AI chatbot simply to claim AI usage.

Prefer structured output when possible.

---

# PHASE 7 — TOOL SELECTION

Select the simplest reliable stack.

Evaluate:

- frontend needs
- backend needs
- AI needs
- data needs
- external APIs
- deployment
- team familiarity
- time risk

Possible choices:

Next.js + TypeScript
Python + FastAPI
Laravel
Spring Boot
Other only when justified

Do not introduce multiple stacks without a strong reason.

---

# PHASE 8 — MOBBIN MCP

Use Mobbin MCP only when UI research can improve the MVP.

Search by UX pattern.

Examples:

- AI dashboard
- business dashboard
- analytics
- financial app
- recommendation
- workflow
- form
- results

Extract:

- layout pattern
- information hierarchy
- interaction pattern
- feedback pattern

Do NOT clone a product.

Create an original design inspired by the underlying UX pattern.

Maximum research target:

5–10 minutes unless UI research is essential to the product.

---

# PHASE 9 — BUILD ORDER

Build in this order:

1. core user flow
2. backend/API
3. AI integration
4. result
5. database
6. UI polish
7. secondary features

Do not build secondary features before P0 works.

---

# PHASE 10 — DEMO-FIRST

Always maintain one reliable judge-facing flow.

USER
↓
INPUT
↓
AI
↓
RESULT
↓
ACTION

This flow must work before optional features.

---

# PHASE 11 — TIME CONTROL

At approximately 2 hours:

The core MVP should already be functional or close.

At approximately 3 hours:

Focus on integration and reliability.

At approximately 3:30:

Begin freeze preparation.

At approximately 3:40:

STOP FEATURE DEVELOPMENT.

After freeze:

Only:

- critical bug fixes
- testing
- deployment
- screenshots
- demo preparation
- submission preparation

---

# PHASE 12 — WHEN BEHIND

If the project is behind schedule:

1. remove P3
2. remove P2
3. simplify P1
4. preserve P0

Never protect optional features at the expense of the core demo.

---

# PHASE 13 — FAILURE HANDLING

If an external API fails:

- identify the issue
- try the smallest fix
- avoid rewriting the system

If the API remains unreliable:

use an honest fallback appropriate for the demo.

Do NOT falsely claim mocked output is live AI output.

---

# PHASE 14 — FINAL AUDIT

Before submission verify:

- project runs
- main flow works
- AI works
- result displays
- critical errors handled
- GitHub available
- Live URL available if web
- screenshots available
- tool disclosure ready
- Cursor usage can be explained