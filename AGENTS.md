# Foundry

Next.js 15 full-stack **multi-agent** workspace for SMEs and founders.

A conductor routes each founder ask through specialist agents (strategy, finance, market, growth, ops). Specialists run local tools, write memos, and the conductor synthesizes one executable brief.

## Commands

```bash
npm install
cp .env.example .env.local   # optional; empty key = demo mode
npm run dev                  # http://localhost:3000
npm run lint
npm run build
```

## Layout

```
src/app/page.tsx                 landing
src/app/console/page.tsx         crew workspace
src/app/api/agents/run/route.ts  SSE crew runner
src/app/api/agents/route.ts      agent catalog
src/app/api/health/route.ts      mode + model
src/lib/agents/orchestrator.ts   conductor loop
src/lib/agents/planner.ts        pick specialists
src/lib/agents/registry.ts       catalog
src/lib/agents/specialists/      one file per agent
src/lib/agents/tools.ts          local tools
src/lib/llm/complete.ts          OpenAI-compatible chat
```

## Runtime

- **Demo mode** (no `OPENAI_API_KEY`): heuristic planner + specialist `demo()` + local tools. The UI still streams a full trace.
- **LLM mode**: same loop, but planner / specialists / synthesis call `/chat/completions` at `OPENAI_BASE_URL`. Works with OpenAI, Groq, Together, Azure, Ollama.

## Add a specialist

1. Create `src/lib/agents/specialists/<id>.ts` exporting a `SpecialistDef`.
2. Register it in `src/lib/agents/registry.ts`.
3. Add `id` to `AgentId` in `src/lib/agents/types.ts`.
4. Optional: add a tool in `src/lib/agents/tools.ts` and list it on `tools: []`.

See `.cursor/skills/add-specialist-agent/SKILL.md`.

## Conventions

- App Router only. Server work in `src/lib` and `src/app/api`. Client UI in `src/components`.
- Agents are data + a `demo()` fallback. Do not hide routing logic inside React.
- Crew events are the contract: `session → plan → agent_start → tool → agent_end → token → done`.
- No extra UI libraries. Tailwind v4 tokens live in `src/app/globals.css`.
- Do not commit `.env.local`. Keep `.env.example` in sync.

## Product voice

Write like a sharp operator talking to a busy owner. Concrete actions, named customers, cash rules. No TAM slides, no generic “post more on social.”
