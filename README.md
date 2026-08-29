# Foundry

Multi-agent counsel for SMEs and entrepreneurs. Next.js 15 App Router, streaming crew, demo mode without an API key.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

- Landing: [http://localhost:3000](http://localhost:3000)
- Console: [http://localhost:3000/console](http://localhost:3000/console)

Leave `OPENAI_API_KEY` empty for demo mode. Set it (and optionally `OPENAI_BASE_URL` / `OPENAI_MODEL`) for live LLM specialists.

## Stack

| Layer | Where |
| --- | --- |
| UI | `src/app`, `src/components` |
| Crew | `src/lib/agents` |
| LLM | `src/lib/llm/complete.ts` |
| Agent instructions | `AGENTS.md` |

Coding agents should read **AGENTS.md** first.
