# Overview

GenAI Academy is a learning platform for AI/ML, GenAI, data structures and algorithms, system design, and cloud certifications. Everything a learner touches — roadmaps, labs, a cloud IDE, a LeetCode-style judge, mock interviews, documentation archives — is delivered by one React single-page application.

![The Home 3.0 landing page, the first screen an unauthenticated visitor sees.](/docs-shots/landing.jpg)

## What this repository actually is

This is a monorepo, and that is the first thing to understand about it. A single directory listing mixes five different kinds of thing, and telling them apart saves hours.

| Bucket | What it means | Examples |
|---|---|---|
| Primary product | The SPA and the backend that serves it | `src/`, `api/`, `supabase/` |
| Build-time input | Generates data that is baked into the SPA | `scripts/`, `reference/`, `Data_science_interview_question.md` |
| Vendored runtime bundle | Pre-built app, iframed by the SPA at runtime | `public/editor/`, `public/aws-simulator/`, `public/git-visualizer/` |
| Independently deployed sub-project | Own package manager, own build, own deploy target | `services/job-scout/`, `themissingmanual/`, `api_beam/`, `system-design-simulator/` |
| Orphaned | Present in git history, wired to nothing | `micro-workspace-protocol-nextjs/` |

Running `npm run build` at the root builds the primary product only. It does not touch the Job Scout agent, The Missing Manual, or the ApiBeam relay server. Those have their own pipelines.

> [!NOTE]
> If you only remember one sentence: **one React SPA is the front door**, and almost everything else either generates data baked into it at build time, is a static bundle iframed inside it at runtime, or is a separate product that happens to share this git history.

## The stack

| Layer | Technology |
|---|---|
| Frontend | Vite 5, React 18, vanilla CSS, Framer Motion, lucide-react |
| Routing | None — a hand-rolled state machine in `src/App.jsx` |
| Backend | 12 plain Node handlers in `api/`, deployed as Vercel serverless functions |
| Database & auth | Supabase Postgres with Row Level Security, plus three Deno edge functions |
| AI | Multi-provider registry dispatched client-side; Gemini Live and Retell for voice |
| Edge | Cloudflare Workers backed by R2 object storage |
| Desktop | Tauri 2 shell wrapping the same web build |
| In-browser execution | Pyodide via `react-py`, PGlite for Postgres, Monaco for editing |

## What it looks like signed in

After sign-in the shell is a persistent sidebar plus one full-screen panel. The sidebar is grouped into sections — Learn, Practice, Labs, Agents, Library, Career, and so on — and each entry swaps the panel on the right.

![The signed-in shell: grouped sidebar on the left, active panel filling the rest.](/docs-shots/home-dashboard.jpg)

## Capability map

```lc-cards
[
  {"title": "Curriculum & roadmaps", "body": "Three visual roadmap treatments over a shared curriculum model, with per-user progress."},
  {"title": "Code Lab", "body": "322 problems mapped to 70 interview patterns, judged server-side against stored test cases."},
  {"title": "Interactive labs", "body": "Dozens of self-contained labs covering RAG, agents, ML, statistics and deep learning."},
  {"title": "Cloud IDE", "body": "Monaco-based project workspace with GitHub import, file versioning and an AI assistant."},
  {"title": "Documentation archives", "body": "LangChain, Strands, AWS AgentCore and exam guides, read in-app from a CDN."},
  {"title": "Career tooling", "body": "Interview prep, voice mock interviews, and a Python job-search agent."}
]
```

## Where to go next

- [Architecture](doc:architecture) — how the pieces connect and where a request goes.
- [Local setup](doc:local-setup) — get it running.
- [Feature tour](doc:feature-tour) — see each surface before reading its code.
- [Extending the app](doc:extending) — the multi-file rituals that are otherwise tribal knowledge.
