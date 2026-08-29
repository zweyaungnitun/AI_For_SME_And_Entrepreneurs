# Foundry

### Multi-Agent AI Counsel for SMEs & Entrepreneurs

**Foundry** is an AI-powered multi-agent workspace designed to help small businesses and entrepreneurs think through complex business decisions.

Instead of relying on a single AI response, Foundry uses a **crew of specialized AI agents** that analyze a problem from different perspectives and combine their reasoning into a practical recommendation.

> **One business problem. Multiple AI specialists. One actionable outcome.**

---

## 🚀 What Foundry Solves

SMEs and entrepreneurs often need to make decisions involving areas such as:

* Business strategy
* Finance
* Marketing
* Operations
* Risk
* Growth opportunities

Getting useful advice across all of these areas can be expensive, time-consuming, or difficult to access.

**Foundry brings multiple specialist perspectives into a single AI workflow.**

---

## 🧠 How It Works

```text
User Business Problem
        ↓
   Foundry Console
        ↓
 ┌──────────────────────┐
 │   AI Specialist Crew │
 ├──────────────────────┤
 │ Strategy Agent       │
 │ Finance Agent        │
 │ Marketing Agent      │
 │ Risk Agent           │
 │ Operations Agent     │
 └──────────────────────┘
        ↓
   Combined Analysis
        ↓
 Actionable Recommendation
```

Each specialist focuses on a different aspect of the problem before the final response is presented to the user.

---

## ✨ Core Features

### Multi-Agent Counsel

Instead of asking one general-purpose AI for an answer, Foundry coordinates multiple specialized agents.

### Streaming Responses

Agent responses are streamed into the console so users can see the analysis happen progressively.

### Business-Focused Reasoning

The workflow is designed around real-world SME and entrepreneurial decision-making rather than generic chat.

### Demo Mode

Foundry can run without an API key, making the prototype easy to demonstrate during the hackathon.

### Live LLM Mode

An OpenAI-compatible model can be connected through environment variables for real AI-generated specialist responses.

---

## 🖥️ Application

### Landing Page

```text
http://localhost:3000
```

Introduces Foundry and its value proposition.

### AI Counsel Console

```text
http://localhost:3000/console
```

The main workspace where users submit business problems and interact with the multi-agent workflow.

---

## 🛠️ Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 15                             |
| Frontend         | React / App Router                     |
| Styling          | Project UI components                  |
| AI Orchestration | Multi-Agent Crew                       |
| LLM Integration  | OpenAI-compatible API                  |
| Language         | TypeScript                             |
| Development      | Cursor                                 |
| Deployment       | Compatible with modern Next.js hosting |

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── page.tsx
│   └── console/
│
├── components/
│   └── UI components
│
└── lib/
    ├── agents/
    │   └── Multi-agent crew
    │
    └── llm/
        └── complete.ts

AGENTS.md
```

### Key Areas

| Path                      | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `src/app`                 | Application routes and pages               |
| `src/components`          | Reusable UI components                     |
| `src/lib/agents`          | Multi-agent orchestration                  |
| `src/lib/llm/complete.ts` | LLM integration                            |
| `AGENTS.md`               | Development instructions for coding agents |

---

## ⚡ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

### 3. Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

or

```text
http://localhost:3000/console
```

---

## 🔑 AI Configuration

Foundry uses **Google Gemini** as its primary LLM provider.

### Demo Mode

Foundry can run without an API key for hackathon demonstrations.

```env
GEMINI_API_KEY=
```

When no API key is provided, Foundry uses its demo workflow so the core product experience can still be demonstrated.

### Live AI Mode

To enable real Gemini-powered responses, configure your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_model_name
```

The selected Gemini model can be configured through the environment variables.

---

## 🤖 AI Architecture

Foundry uses a **multi-agent AI architecture powered by Google Gemini**.

Instead of asking one general-purpose model to handle every task, Foundry assigns the business problem to multiple specialist agents.

```text
                    Business Problem
                           ↓
              ┌─────────────────────┐
              │   Gemini AI Crew     │
              └─────────────────────┘
                           ↓
        ┌──────────┬──────────┬──────────┐
        │ Strategy │ Finance  │ Marketing│
        ├──────────┼──────────┼──────────┤
        │   Risk   │Operations│   Other  │
        └──────────┴──────────┴──────────┘
                           ↓
                 Combined Analysis
                           ↓
                 Actionable Counsel
```

Each specialist provides a focused perspective, and the crew combines those perspectives into a structured response for the user.

---

## 🧠 AI Utilization

AI is the core of Foundry rather than an optional feature.

Google Gemini is used to:

* Analyze business problems
* Generate specialist perspectives
* Evaluate risks and opportunities
* Provide structured recommendations
* Stream responses progressively through the console

The multi-agent approach allows Foundry to approach a single business problem from multiple specialized perspectives.

---

## 🧑‍💻 Cursor Usage

**Cursor** was used as the primary AI-native development environment during the hackathon build window.

It was used for:

* Architecture and implementation planning
* Code generation
* React / Next.js development
* Multi-agent workflow implementation
* Gemini integration
* Debugging
* Refactoring
* Testing
* Iterative development

The core implementation was created during the official **4-hour Build Window**.


## 🏆 Hackathon Focus

Foundry was built as a working prototype for the **Cursor Myanmar AI Hackathon**.

The project focuses on:

**Problem & Impact**
Making multi-perspective business guidance more accessible to SMEs and entrepreneurs.

**Innovation**
Using a coordinated crew of specialized AI agents instead of a single general-purpose assistant.

**AI Utilization**
AI is not an optional feature; the core product workflow depends on specialist agents analyzing the same business problem from different perspectives.

**Execution**
A functional web prototype with an interactive console, streaming workflow, and demo mode.

**Practicality**
The concept can be extended to real business advisory workflows, planning, risk analysis, and decision support.

---

## 🔮 Future Direction

Potential future improvements include:

* Persistent business profiles
* Industry-specific specialist agents
* Financial planning and forecasting
* Document and spreadsheet analysis
* Business plan generation
* Team collaboration
* Decision history and comparison
* Additional LLM providers
* More advanced agent orchestration
* SME-specific integrations

These are future directions and are not part of the current prototype unless implemented.

---

## 📌 Current Prototype Scope

The hackathon prototype focuses on the **core workflow**:

```text
Submit a business problem
        ↓
Multi-agent analysis
        ↓
Streaming specialist responses
        ↓
Combined business counsel
```

The goal is to demonstrate the central idea clearly rather than build a complete production platform.

---

## 📄 License

Add your preferred license here.

---

## 👥 Team

**Foundry** was built by **Team Nextmind** for the **Cursor Myanmar AI Hackathon**.

| Member               | GitHub                                               |
| -------------------- | ---------------------------------------------------- |
| **Min Thway Khant**  | [@iz-dmo](https://github.com/iz-dmo)                 |
| **Hein Khant Phyoe** | [@Heinkhantphyoe](https://github.com/Heinkhantphyoe) |
| **Zwe Yaung Ni Tun** | [@zweyaungnitun](https://github.com/zweyaungnitun)   |

### Team Members

* **Min Thway Khant** — [GitHub](https://github.com/iz-dmo)
* **Hein Khant Phyoe** — [GitHub](https://github.com/Heinkhantphyoe)
* **Zwe Yaung Ni Tun** — [GitHub](https://github.com/zweyaungnitun)


## 🔗 Project Links

**Live Demo:** [https://deploy-preview-1--smeandentrepreneurshipcopilot.netlify.app/]

---

> **Foundry — Think through the decision before you make it.**
