# UI_WORKFLOW.md

# MOBBIN MCP + CURSOR — RAPID UX/UI SYSTEM

## PURPOSE

This workflow is designed for a strict 4-hour AI hackathon.

Use Mobbin MCP as a UX research and pattern discovery tool,
then use Cursor as the implementation agent.

The goal is:

> Find the right UX pattern quickly, adapt it intelligently,
> and build an original, polished UI without wasting build time.

The goal is NOT to reproduce an existing product.

---

# 1. CORE PRINCIPLE

Use this process:

PROBLEM
↓
USER
↓
USER GOAL
↓
USER FLOW
↓
UX PATTERN
↓
MOBBIN RESEARCH
↓
DESIGN DECISION
↓
CURSOR IMPLEMENTATION
↓
VISUAL QA

Do NOT:

PROBLEM
↓
OPEN MOBBIN
↓
BROWSE RANDOMLY
↓
COPY A SCREEN
↓
BUILD

---

# 2. FIRST RULE — UNDERSTAND THE PRODUCT

Before using Mobbin MCP, determine:

### Product Type

Examples:

* AI assistant
* business dashboard
* financial tool
* marketplace
* productivity tool
* document workflow
* analytics product
* recommendation system
* mobile utility

### Primary User

Who is using this?

### Primary Goal

What does the user want to accomplish?

### Primary Action

What is the ONE action that matters most?

### Primary Result

What should the user see after that action?

---

# 3. ONE CORE USER JOURNEY

The MVP should have one dominant user journey.

Example:

USER
↓
ENTER BUSINESS DATA
↓
ANALYZE
↓
AI PROCESSING
↓
BUSINESS INSIGHT
↓
NEXT BEST ACTION

The primary UI should make this journey obvious.

Everything else is secondary.

---

# 4. BEFORE MOBBIN RESEARCH

Do NOT search Mobbin without a specific UX question.

Ask:

> "What interaction pattern do we need to solve?"

Examples:

Need to display business health
→ Search dashboard / analytics patterns

Need to collect user information
→ Search forms / onboarding patterns

Need to display AI recommendations
→ Search AI assistant / recommendation patterns

Need to show business alerts
→ Search notification / alert / status patterns

Need to show analysis results
→ Search analytics / report / result patterns

---

# 5. MOBBIN MCP RESEARCH RULE

Use Mobbin MCP only when it provides useful UX inspiration.

Research time target:

### 5–10 minutes

Do not spend 30+ minutes browsing.

The research phase should answer:

1. What layout works?
2. What hierarchy works?
3. What interaction works?
4. What information should appear first?
5. What should be hidden or secondary?

---

# 6. SEARCH STRATEGY

Search by UX pattern, not by random brand.

Prefer:

* AI dashboard
* business dashboard
* financial dashboard
* analytics
* AI assistant
* recommendation
* onboarding
* form
* workflow
* results
* notification
* profile
* task management
* data visualization

Avoid spending time searching for exact competitor products
unless the competitor is directly relevant to the UX problem.

---

# 7. RESEARCH OUTPUT

After Mobbin research, do NOT reproduce the reference.

Extract:

## Layout Pattern

Example:

* top summary
* KPI cards
* priority alert
* action section
* detailed insights

## Interaction Pattern

Example:

* single primary CTA
* inline action
* expandable detail
* progressive disclosure

## Information Hierarchy

Example:

1. urgent issue
2. recommended action
3. explanation
4. supporting data

## Feedback Pattern

Example:

* loading
* success
* error
* empty state

---

# 8. DESIGN ADAPTATION

Use Mobbin references as design principles.

Adapt:

* hierarchy
* layout logic
* spacing
* interaction model
* navigation behavior
* component structure

Create original:

* branding
* color system
* typography
* copy
* illustrations
* iconography
* content structure

Never create a direct copy of the reference screen.

---

# 9. UX DECISION FRAMEWORK

Before implementing the UI, answer:

### What does the user need first?

Show it first.

### What is the most important action?

Make it visually dominant.

### What can the user ignore?

Move it lower or hide it behind progressive disclosure.

### What information supports the decision?

Show it near the decision.

### What happens after the action?

Make the state transition obvious.

---

# 10. AI PRODUCT UX

For AI-powered products, clearly separate:

USER INPUT
↓
AI PROCESSING
↓
AI RESULT
↓
USER ACTION

The UI should visually communicate this relationship.

Do NOT hide the AI result inside a generic chat window
unless conversation is the actual product.

---

# 11. AI RESULT DESIGN

Do not present AI output as a giant text block.

Prefer:

### Summary

What happened?

### Key Findings

What did the AI discover?

### Priority

What matters most?

### Recommendation

What should the user do?

### Why

Why did the AI recommend it?

### Action

What can the user do now?

Preferred structure:

```text
AI INSIGHT
↓
PROBLEM
↓
WHY IT MATTERS
↓
RECOMMENDED ACTION
↓
ACTION BUTTON
```

---

# 12. SME DASHBOARD PATTERN

For SME-focused products, prefer a decision-oriented dashboard.

Recommended structure:

```text
HEADER
↓
BUSINESS HEALTH
↓
TODAY'S PRIORITY
↓
AI INSIGHTS
↓
SUPPORTING BUSINESS DATA
↓
SECONDARY ACTIONS
```

Do NOT build:

```text
20 KPI cards
+
5 charts
+
10 menus
+
complex analytics
```

unless required.

---

# 13. RECOMMENDED MVP SCREEN COUNT

Target:

### 1–3 main screens

Possible structure:

## Screen 1 — Dashboard

Shows:

* business status
* priority issue
* AI recommendation
* key metrics

## Screen 2 — Analysis / Input

Shows:

* business data
* AI analyze action
* processing state

## Screen 3 — Details

Shows:

* detailed findings
* explanations
* supporting data
* actions

Avoid creating additional screens unless required.

---

# 14. PRIMARY CTA

Every major screen should have ONE dominant action.

Examples:

* Analyze My Business
* Find My Next Action
* Review Risk
* Generate Recommendation
* Add Business Data

Do not make 5 buttons equally important.

---

# 15. VISUAL HIERARCHY

Use this priority:

## Level 1

Most important decision.

## Level 2

Supporting context.

## Level 3

Details.

## Level 4

Secondary actions.

The user should understand the primary purpose
within approximately 3 seconds.

---

# 16. DESIGN SYSTEM

Create a lightweight design system before building many components.

Define:

### Typography

* heading
* subheading
* body
* caption
* metric

### Spacing

Use a consistent spacing scale.

### Radius

Use a consistent corner radius.

### Shadows

Keep shadows subtle.

### Colors

Define:

* background
* surface
* primary
* text
* muted
* success
* warning
* danger

Do not create a new color for every component.

---

# 17. ACCESSIBILITY

Maintain:

* readable contrast
* clear focus states
* meaningful labels
* sufficient touch targets
* understandable error messages
* semantic HTML where possible

Do not sacrifice readability for visual effects.

---

# 18. LOADING STATES

AI operations may take time.

Always design the loading state.

Examples:

```text
Analyzing business data...
Finding potential risks...
Generating recommendations...
```

Use:

* skeleton
* progress indicator
* subtle animation

Do not show fake progress percentages unless the percentage
represents a real measurable process.

---

# 19. EMPTY STATES

Every important data area should have a useful empty state.

Example:

```text
No business data yet.

Add today's sales and expenses
to receive your first AI insight.

[ Add Data ]
```

The empty state should explain:

WHAT
WHY
ACTION

---

# 20. ERROR STATES

Errors should be human-readable.

Bad:

```text
500 Internal Server Error
```

Better:

```text
We couldn't analyze your data right now.

Please try again.
```

For AI/API errors:

* explain the problem
* preserve user input
* provide a retry action

---

# 21. RESULT STATES

Make successful AI results visually obvious.

Example:

```text
┌──────────────────────────────┐
│ BUSINESS HEALTH              │
│                              │
│ 🟠 WATCH                     │
│                              │
│ Cashflow needs attention.    │
└──────────────────────────────┘

┌──────────────────────────────┐
│ TODAY'S PRIORITY             │
│                              │
│ Follow up overdue payments  │
│                              │
│ WHY                          │
│ Upcoming expenses are high. │
│                              │
│ [ Review Receivables ]       │
└──────────────────────────────┘
```

---

# 22. BURMESE-FIRST UX

For Myanmar users, support natural Burmese interaction where
appropriate.

Examples:

* Burmese input
* Burmese AI responses
* Burmese guidance
* simple localized labels

Use English for technical concepts when it improves clarity.

Do not force overly formal Burmese.

The language should feel natural to the intended user.

---

# 23. COPY RULES

UI copy should be:

* short
* clear
* actionable
* human

Prefer:

"Analyze My Business"

over:

"Click Here to Initiate Business Analytical Processing"

Prefer:

"Today's Priority"

over:

"Recommended Most Important Business Operational Action"

---

# 24. RESPONSIVE DESIGN

The primary workflow must work on:

* desktop
* tablet
* mobile

Use responsive layouts.

Do not create separate implementations unless required.

---

# 25. ANIMATION RULES

Animation should support:

* feedback
* hierarchy
* transition
* state change

Prefer:

* fade
* slide
* scale
* subtle hover
* skeleton animation

Avoid:

* excessive movement
* distracting background animation
* long transitions
* animation that delays the core action

---

# 26. COMPONENT STRATEGY

Create reusable components only when they are actually repeated.

Good:

* Button
* Card
* Metric
* StatusBadge
* InsightCard
* RecommendationCard

Avoid creating abstractions for one-off elements.

Hackathon code should optimize for:

CLARITY
+
SPEED
+
RELIABILITY

---

# 27. VISUAL QA LOOP

After implementation:

1. Open the application.
2. Inspect the primary flow visually.
3. Compare implementation against the intended UX pattern.
4. Check:

   * spacing
   * alignment
   * typography
   * hierarchy
   * overflow
   * responsiveness
   * loading
   * error states
5. Fix the most visible problems first.

---

# 28. MOBBIN → CURSOR HANDOFF

After research, create a short design decision.

Example:

```text
MOBBIN RESEARCH RESULT

Pattern:
Decision-oriented analytics dashboard

We will use:
- top business health summary
- priority action card
- insight cards
- supporting metrics

We will NOT copy:
- original branding
- original colors
- original layout exactly
- original copy

Our adaptation:
AI-first SME decision dashboard
with Burmese-first interaction.
```

Then Cursor should implement from the design decision,
not directly from the reference.

---

# 29. HACKATHON TIME RULE

UI research must not consume the build window.

Recommended:

0–5 min
Understand UX problem

5–10 min
Mobbin research

10–15 min
Design decision

15+ min
Implementation

If the UI research is still going after the allocated research time:

STOP RESEARCH.

Make a reasonable design decision and build.

---

# 30. FINAL UI PRIORITY

When time is limited, prioritize in this order:

1. Core user flow
2. Primary CTA
3. AI result
4. Information hierarchy
5. Responsive layout
6. Loading state
7. Error state
8. Empty state
9. Visual polish
10. Secondary animations

Never polish secondary screens while the primary flow is unclear.

---

# 31. UI STOP RULE

Once:

* primary flow is clear
* core screens are usable
* AI result is understandable
* responsive behavior works
* critical visual issues are fixed

STOP UI DEVELOPMENT.

Do not redesign the entire interface late in the hackathon.

---

# 32. FINAL DESIGN QUESTION

Before shipping, ask:

> Can a judge understand what this product does,
> what they should click,
> what the AI did,
> and why the result matters
> within a few seconds?

If NO:

simplify the UI.

If YES:

move to testing and demo preparation.

---

# GOLDEN RULE

DO NOT COPY THE UI.

COPY THE LEARNING.

Use Mobbin to understand:

WHAT WORKS
WHY IT WORKS
WHEN IT WORKS

Then create:

YOUR PRODUCT
YOUR UX
YOUR VISUAL IDENTITY
YOUR SOLUTION
