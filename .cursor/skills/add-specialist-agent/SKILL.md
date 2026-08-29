---
name: add-specialist-agent
description: Adds a Foundry specialist agent to the multi-agent crew. Use when the user wants a new agent, specialist, or crew member, or when extending src/lib/agents/specialists.
---

# Add a specialist agent

## Instructions

1. Add the id to `AgentId` in `src/lib/agents/types.ts`.
2. Create `src/lib/agents/specialists/<id>.ts` exporting a `SpecialistDef`.
3. Import and append it in `src/lib/agents/registry.ts`.
4. If it needs computation, add a named function in `src/lib/agents/tools.ts` and list that name on `tools`.
5. Add 4–8 `keywords` so the heuristic planner can select it without an LLM.
6. Write `demo()` so the console still works with no API key.
7. Keep `system` under ~120 words. Founder voice: concrete actions, no TAM slides.

## Template

```ts
import type { SpecialistDef } from "@/lib/agents/types";

export const legalAgent: SpecialistDef = {
  id: "legal",
  name: "Legal",
  title: "Light compliance that unblocks selling",
  blurb: "Flags only the paperwork that would stop a first invoice or a first wholesale account.",
  accent: "#8a6a4a",
  keywords: ["legal", "contract", "license", "label", "compliance"],
  tools: [],
  system:
    "You are Foundry's Legal agent for SMEs. Name the blocker, the minimum fix, and what can wait.",
  demo: ({ context }) => ({
    summary: `Unblock selling for ${context.name} in ${context.location} with the smallest viable paperwork.`,
    bullets: [
      "Issue a simple invoice and keep ingredient/service records.",
      "Do not hire counsel until a distributor or landlord demands it.",
    ],
  }),
};
```

Register:

```ts
import { legalAgent } from "@/lib/agents/specialists/legal";
export const specialists = [/* existing */, legalAgent];
```
