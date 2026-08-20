# Prompt: Build the GenAI Academy Documentation Site

## Role

You are a **Senior Software Architect, Developer Experience Engineer, and Technical Writer**.

Your task is to analyze the `GenAIAcademy` repository and build a **professional, multi-page documentation website** that lets a new contributor become productive without reading `src/App.jsx` first.

The documentation must answer:

1. What this project is, and what is *one product* vs. what is *a separate product sharing this git history*
2. How the SPA, the serverless functions, Supabase, and the edge workers fit together
3. How to install, configure, and run it locally (including the build-time content pipeline)
4. How navigation, AI providers, and persistence actually work
5. What every serverless endpoint, edge function, and Supabase table does
6. How to add a new panel, provider, endpoint, lab, or content pipeline
7. How the project is deployed across Vercel, Supabase, Cloudflare, and Render
8. How to troubleshoot the failure modes this repo actually has

---

## CRITICAL RULE: ANALYZE BEFORE WRITING

Do **not** start writing pages. Complete Phases 1–5 first, then implement.

This repository has an unusually detailed root `README.md` (~1,000 lines, 18 sections, with Mermaid diagrams, an environment-variable reference, a DB schema reference, and a "known quirks" list). **Use it as a map, not as truth.** It is the best starting index in the repo, but every claim you carry into the documentation must be re-verified against the implementation. Where the README and the code disagree, document the code and record the discrepancy in the analysis report.

Do not modify application code during any phase. This task adds documentation only.

---

## VERIFIED PROJECT CONTEXT

This section is a starting orientation so you don't rediscover it from zero. **Confirm each item against the code before documenting it.**

**GenAI Academy** is a monorepo whose primary product is a large client-heavy learning platform for AI/ML, DSA, system design, and cloud certifications.

| Layer | Reality |
|---|---|
| Frontend | Vite 5 + React 18 SPA, `src/` (~1,650 files). **No router library** — navigation is a hand-rolled state machine of `useState` flags in `src/App.jsx` (~2,300 lines) toggling ~90 `React.lazy()` panels |
| Backend | 12 plain Vercel serverless handlers in `api/*.js` (no framework), sharing helpers in `api/_lib/` and baked data in `api/_data/` |
| Local backend | `vite.config.js` defines an `apiMiddleware()` plugin that dynamically imports the matching `api/*.js` handler during `vite dev` — no `vercel dev` needed |
| Data | Supabase Postgres + Auth, RLS-enforced; migrations in `supabase/migrations/`; three Deno edge functions (`ai-chat`, `notion-fetch`, `web-search`) |
| AI | Client-orchestrated multi-provider dispatch: registry in `src/config/aiProviders.js` (adapters: `gemini`, `azure`, `openai`-compatible), dispatcher in `src/services/aiService.js`; plus Gemini Live, Retell voice, and the ApiBeam browser-relay path |
| Python agent | `services/job-scout/` — a graph agent (`graph/` with `nodes/`, `prompts/`, `state.py`), FastAPI + Gradio, Opik tracing, deployed separately to Render via `render.yaml` |
| Edge | Cloudflare Workers + R2: `av-cdn-worker/`, `docs-cdn-worker/`, `jobscout-keepwarm-worker/`, plus the simulator's pricing worker |
| Desktop | Tauri 2 shell (`src-tauri/`) wrapping the same Vite build; built by `.github/workflows/desktop-build.yml` on `v*` tags |
| Content pipeline | ~40 Python/Node generators in `scripts/` that bake datasets into `src/data/` and `public/data/` at build time; chained in the root `build` script |
| Vendored bundles | Pre-built third-party/self-built apps in `public/` (`editor/`, `aws-simulator/`, `git-visualizer/`, `codeflow/`, `k8sgames/`, `flow-design/`, `codelab/`) iframed by the SPA |
| Independent sub-projects | `system-design-simulator/` (Angular), `themissingmanual/` (Rust + SvelteKit + Docker), `Claude Certeficate 3/` (React), `api_beam/` (browser extension + NestJS relay) |
| Tests | Four `node --test` files in `tests/`; only some are wired to npm scripts — check which |

**Things this repository does NOT have.** Do not look for them, do not write pages about them, and do not invent them:

- No Kubernetes manifests, Helm charts, or Terraform (`public/k8sgames/` is a game, not infrastructure)
- No RAG pipeline, vector store, embeddings, or agent memory anywhere in the SPA
- No message queue, job queue, or background worker beyond the Cloudflare keep-warm cron
- No root `.env.example` (one is referenced in help text but absent — this is a real gap to document)
- No root Dockerfile or docker-compose (Dockerfiles exist only inside `services/job-scout/` and `themissingmanual/`)
- No existing documentation framework — nothing to reuse, so you will introduce one
- No authentication layer on most `api/*.js` handlers — auth is Supabase-client-side and enforced by RLS

---

## PHASE 1 — REPOSITORY DISCOVERY

Build a repository map before reading deeply. Work incrementally; do not load the whole tree into context.

Inspect, at minimum:

- Root config: `package.json` (every script), `vite.config.js`, `vercel.json`, `.vercelignore`, `render.yaml`, `.gitignore`, `.github/workflows/`
- `src/`: `App.jsx`, `config/`, `contexts/`, `services/`, `store/`, `hooks/`, `data/`, `pages/`, `prompts/`, `labs/`, and the largest `components/` clusters
- `api/`: all 12 handlers plus `_lib/` and `_data/`
- `supabase/`: every migration and edge function
- `scripts/`: group the generators by what they produce and which npm script runs them
- `services/job-scout/`: the graph, config, and API surface
- The three Cloudflare worker directories and their `wrangler.jsonc`
- Existing docs: root `README.md`, `GEMINI.md`, the root `*_PLAN.md` files, `README/documentation/`, `docs/`, and each sub-project's own README

Establish the real technology stack from imports and config, not from badges or prose.

**Monorepo boundary rule.** For every top-level directory, classify it as one of: *primary product*, *build-time input*, *vendored runtime bundle*, *independently deployed sub-project*, or *orphaned/unused*. Documentation must state which bucket each thing is in — this is the single most confusing aspect of the repo for a newcomer.

**Absent-directory rule.** `.gitignore` excludes source directories whose built output *is* committed (e.g. the Code Lab corpus, and the sources behind `public/flow-design/` and `public/git-visualizer/`). Verify which. Any build command that cannot run on a fresh clone must be documented as such rather than presented as a working step.

---

## PHASE 2 — ARCHITECTURE RECONSTRUCTION

Reconstruct the system from the code. The layering to verify and refine:

```text
Browser / Tauri WebView
        ↓
React 18 SPA (state-machine navigation, lazy panels)
        ↓                    ↓                      ↓
  fetch /api/*        supabase-js (RLS)      iframe → public/ bundles
        ↓                    ↓
Vercel functions      Postgres + Auth + Deno edge functions
        ↓                    ↓
  LLM providers · JDoodle · S3 · YouTube · Cloudflare KV · Notion · Tavily
```

Determine and document:

- SPA entry (`src/main.jsx` → `App.jsx`) and the provider nesting order (`AuthProvider`, `ThemeProvider`, `ProjectsProvider`)
- How a sidebar click becomes a rendered panel: `sidebarRegistry.js` → `sidebarNav.js` → `App.jsx` view flags → lazy import
- `pathRegistry.js` and how curriculum paths are gated and loaded
- Which state is React context, which is Supabase, which is `localStorage` (`src/store/*`)
- The AI dispatch path: user-stored credentials in `AuthContext` → provider entry in `aiProviders.js` → adapter branch in `aiService.js` → provider HTTP call
- Where the client calls providers directly vs. where a serverless function or edge function proxies the key
- What `api/graphql.js` and `api/copilot.js` actually emulate, and for which vendored bundle
- Deliberate lazy-loading and data-fetching decisions (heavy datasets kept out of the bundle); the root `PERFORMANCE_PLAN.md` and `SUPABASE_PERFORMANCE_PLAN.md` record the reasoning
- Error handling (`ErrorBoundary` usage) and the absence of centralized observability in the SPA

---

## PHASE 3 — FUNCTIONAL FLOW ANALYSIS

Trace these specific flows end to end, from user action to final state. Add others you find that carry equal weight.

1. **Cold load and auth resolution** — persisted-session read, curriculum cache priming, first paint
2. **Panel navigation** — sidebar/global search palette → view flag → lazy chunk → render
3. **AI chat / study companion** — provider selection → credential lookup → adapter call → JSON-safety parsing
4. **Code execution** — editor → `/api/execute` → JDoodle or HackerEarth provider selection → result
5. **Code Lab / LeetCode judge** — problem manifest → `/api/leetcode-judge` → `api/_lib/leetcodeJudge.js` harness → test-case verdict
6. **Cloud IDE project persistence** — `ProjectsContext` → Supabase tables → S3 blobs via `/api/blob` and `/api/upload`
7. **Voice interview** — Retell or Gemini Live token issuance (`/api/gemini-live-token`) → session
8. **Web search** — SPA → `supabase.functions.invoke('web-search')` → Tavily
9. **Exam bank** — request → `/api/exam` → scraper in `api/_lib/examScraper.js` → Supabase cache write with the service-role key
10. **Docs content delivery** — build script → R2 upload → `docs-cdn-worker` → same-origin rewrite in `vercel.json` → in-app markdown viewer
11. **Job Scout** — SPA page → `/jobscout/` rewrite → Render container → graph nodes (reformulate → fetch → rank → tailor → validate)
12. **Build-time content generation** — script → generated data file → import path in the SPA

For each: trigger, entry file, key functions, external calls, state changes, error paths, output. Use Mermaid sequence diagrams where a diagram beats prose.

---

## PHASE 4 — SETUP AND CONFIGURATION VALIDATION

Read `package.json`, `vite.config.js`, and the startup code, and document what actually works.

**Prerequisites** — derive them: Node version (check the workflow and any `.nvmrc`), Python 3 (required by several `build:*` scripts), a Supabase project, and provider API keys. Note Rust/Tauri as *desktop-only* and Docker as *sub-project-only*.

**Installation and first run** — document the real ordering constraint: which generated data files must exist before `npm run dev` succeeds, and what `predev` does automatically. Separate the minimum path to a running app from the full production pipeline.

**Environment variables** — build a reference table, split by scope, with placeholder values only:

| Variable | Scope | Required | Read by | Purpose |
|---|---|---|---|---|

Scopes: client `VITE_*`, Vercel function `process.env.*`, Supabase edge secrets, Render service vars (`render.yaml`), and build/upload-only vars. Source them from the code (`import.meta.env`, `process.env`, `os.getenv`, `Deno.env`), from `render.yaml`, and from the sub-project `.env.example` files — then cross-check against README §13 and reconcile.

Explicitly document that the Supabase URL and anon key are **hardcoded** in `src/config/supabaseClient.js` rather than read from env, and what a fork must change.

**Running locally** — cover: SPA dev, production build + preview, desktop dev/build, edge-function deploy, and the Job Scout service. Include only commands the repo supports.

**Verification** — give a concrete "it works" check for each: the dev URL, an `/api/*` request with a real payload shape, an authenticated Supabase read, and an edge-function invoke.

---

## PHASE 5 — INFORMATION ARCHITECTURE

Design the sitemap before writing. Start from this structure, which is shaped to this repository, and adjust it to what you actually find:

```text
docs/
├── Home
├── Getting Started
│   ├── Introduction
│   ├── Prerequisites
│   ├── Installation
│   ├── Environment Configuration
│   ├── Running Locally
│   └── Verifying Your Setup
├── Architecture
│   ├── Overview
│   ├── Monorepo Layout (what is one product vs. many)
│   ├── SPA Navigation Model
│   ├── Data Flow & State Ownership
│   └── Deployment Topology
├── Frontend
│   ├── App Shell & Providers
│   ├── Panel & Sidebar Registry
│   ├── Services Layer
│   ├── Contexts & Stores
│   └── Design System Conventions
├── Backend
│   ├── Serverless Functions Overview
│   ├── Endpoint Reference
│   ├── Shared Libraries (api/_lib)
│   └── Local API Middleware
├── Data Layer
│   ├── Supabase Overview
│   ├── Schema & Migrations
│   ├── Row Level Security
│   └── Edge Functions
├── AI Layer
│   ├── Provider Registry & Adapters
│   ├── aiService Dispatch
│   ├── Prompts
│   ├── Voice (Retell & Gemini Live)
│   └── ApiBeam Relay
├── Content Pipeline
│   ├── Overview
│   ├── Generator Scripts Reference
│   ├── CDN & R2 Distribution
│   └── Adding a Content Source
├── Sub-Projects
│   ├── Job Scout Agent
│   ├── System Design Simulator
│   ├── The Missing Manual
│   ├── ApiBeam
│   └── Vendored public/ Bundles
├── Guides
│   ├── Adding a New Panel
│   ├── Adding an AI Provider
│   ├── Adding a Serverless Endpoint
│   ├── Adding a Supabase Table (with RLS)
│   ├── Adding a Lab or Simulator
│   └── Adding a Content Generator
├── Deployment
│   ├── Vercel (SPA + functions)
│   ├── Supabase (migrations + edge functions)
│   ├── Cloudflare Workers & R2
│   ├── Render (Job Scout)
│   └── Desktop Releases (Tauri + Actions)
└── Reference
    ├── Environment Variables
    ├── npm Scripts
    ├── Repository Map
    ├── Troubleshooting
    └── Glossary
```

Do not create empty categories to fill out the shape. Merge or drop anything the repository does not support.

---

## PHASE 6 — BUILD THE SITE

No documentation framework exists in this repo, so introduce one.

**Use VitePress**, under `docs/`. Rationale: it is Vite-native (matching the primary stack), ships sidebar navigation, local search, dark mode, and Mermaid-capable markdown with minimal configuration, and adds no runtime weight to the SPA. Do not introduce a heavier framework without a stated technical reason.

*(Alternative, if the intent is instead an in-app documentation panel rendered inside the SPA: the repo already has that pattern — build scripts publish markdown to R2, `docs-cdn-worker` serves it, and viewer components render it. Follow that pattern rather than mixing the two. Default to the standalone VitePress site unless told otherwise.)*

Hard constraints for the integration:

- **Do not break the Vercel build.** The root `build` script and the `functions.excludeFiles` glob in `vercel.json` are load-bearing. Docs dependencies must not be pulled into the SPA bundle or turned into serverless functions — keep them isolated (a `docs/package.json`, or clearly separated devDependencies plus explicit ignore entries). Verify `vercel.json` and `.vercelignore` still behave.
- **Do not touch application code.** Documentation is additive.
- Preserve the existing files in `docs/` (`LEETCODE_JUDGE_COVERAGE.md`, `MOBILE_REDESIGN.md`) — fold them into the site's navigation rather than deleting them.
- Decide and state whether the root `README.md` stays authoritative or becomes a short pointer into the docs site. Do not leave two contradicting sources.

### Design

Clean, technical, minimal, readable. Persistent sidebar, on-page table of contents, prev/next links, syntax-highlighted code blocks with copy buttons, callouts for warnings and gotchas, tables, search, responsive layout, dark/light mode. No marketing styling, no decorative animation.

### Homepage

- Hero: project name, one honest sentence, links to Getting Started / Architecture / Endpoint Reference
- What it is — including the monorepo caveat, stated plainly
- Core capabilities as concise cards
- A simplified architecture diagram
- Shortest path from clone to running app
- Next steps

---

## COMPONENT DOCUMENTATION FORMAT

For each significant module, cover: **Purpose · Location · Responsibilities · Key exports/functions · Dependencies · Used by · Runtime behavior · Extension points**.

Reference implementation paths (e.g. `src/services/aiService.js`) instead of pasting large code blocks. Explain public behavior and contracts; do not narrate line by line.

---

## EXTENSION GUIDES

These are the highest-value pages in the whole site, because every one of them is currently tribal knowledge. Each must document the *actual* pattern used, with: files to create, registrations required, an example, how to test, and common mistakes.

- **Add a new panel/page** — the lazy import, the view flag in `App.jsx`, the `sidebarRegistry` entry, `getActiveNavId`, and search-index registration. Be exact; this is a multi-file ritual with no framework enforcing it.
- **Add an AI provider** — one entry in `aiProviders.js` if it speaks an existing adapter dialect; what changes if it needs a new adapter in `aiService.js`.
- **Add a serverless endpoint** — handler shape, `api/_lib` reuse, how the dev middleware routes it, `vercel.json` rewrite rules, and the function-count/`excludeFiles` constraint that made the region allowlist move under `api/_lib/`.
- **Add a Supabase table** — migration file naming, RLS policy requirements, and the client access path.
- **Add a lab/simulator** — the `LabKit` / labs catalog pattern.
- **Add a content generator** — script conventions, output location, npm script wiring, and CDN upload if the payload is large.

---

## API REFERENCE

Document all three server surfaces separately:

1. **Vercel functions** (`api/*.js`) — for each: method(s), path, purpose, auth expectations (state plainly where there are none), request body shape, response shape, status codes, error cases, and a `curl` example matching the real schema.
2. **Supabase edge functions** — invoke signature via `supabase.functions.invoke`, payload, response, required secrets.
3. **Job Scout service** (`services/job-scout/src/job_scout/api.py`) — its FastAPI routes and how the `/jobscout/` rewrite reaches them.

Note explicitly that `api/graphql.js` and `api/copilot.js` implement a compatibility subset of an external product's API for a vendored bundle, not a general-purpose API.

---

## TROUBLESHOOTING

Base every entry on failure modes visible in the code, config comments, or the existing planning docs. Do not invent error messages. Strong candidates to verify:

- Dev server starts but data is missing → required generated file not built yet
- `build:*` script fails on a fresh clone → gitignored source directory absent
- Supabase reads return empty for a logged-in user → RLS policy mismatch
- AI call fails → no credential stored for the selected provider, or adapter/endpoint mismatch
- Vercel deploy fails on function count or bundle size → `excludeFiles` / file placement under `api/`
- Job Scout first request hangs → documented cold-boot behavior on the free Render instance and the keep-warm worker's role
- ApiBeam relay timeouts → cross-reference the existing troubleshooting runbook

Format each as: symptom → likely cause → how to check → resolution.

---

## SOURCE OF TRUTH

When sources disagree, prefer in this order:

```text
Implementation → Configuration → Tests → Deployment files → Existing docs → README → Comments
```

The root `README.md` and `GEMINI.md` are unusually detailed but partly aged (for example, `GEMINI.md` describes a single-provider Gemini setup while the code now has a multi-provider registry). Document the implemented behavior and log every contradiction in the analysis report.

---

## NO HALLUCINATION

Every stated behavior must be traceable to the repository. Never invent endpoints, env vars, commands, tables, providers, or deployment steps.

Where something cannot be determined, write it plainly:

> This behavior could not be verified from the current repository.

or leave an explicit TODO. Do not guess silently.

---

## SECURITY RULES

Scan before writing. Never reproduce a secret value in documentation — use `YOUR_API_KEY`, `YOUR_ENDPOINT`, `YOUR_DATABASE_URL`.

Two known cases to handle correctly:

- The Supabase project URL and **anon** key are committed in `src/config/supabaseClient.js`. An anon key is designed to be public and is protected by RLS, so report it as a *configuration inflexibility* (a fork must edit source) and as a *prompt to verify RLS coverage on every table* — not as a leaked credential.
- `render.yaml` deliberately keeps every real secret as `sync: false`. Mirror that discipline: document variable names and purposes, never values.

If you find an actually sensitive committed credential (service-role key, private token, connection string), report it separately as a security finding in the analysis report and do not reproduce it.

---

## PHASE 7 — VALIDATION

The task is not complete until the docs site builds cleanly.

Verify:

- Every sidebar entry resolves to a real page; no dead internal links
- Every command appears in `package.json` or a documented sub-project
- Every environment variable name matches the code
- Every endpoint path and payload matches its handler
- Every architecture diagram matches the implementation
- All Mermaid blocks parse; no broken markdown/MDX
- The docs build succeeds **and** the root `npm run build` still succeeds afterward

Fix everything you break.

---

## DELIVERABLES

1. The documentation site under `docs/`.
2. `docs/README.md` — the framework chosen, how to install docs dependencies, run locally, build, add a page, and how navigation is configured.
3. `docs/DOCUMENTATION_ANALYSIS.md` — covering:
   - Project summary
   - Detected technology stack
   - Entry points
   - Architecture: components and relationships
   - Major functional flows
   - External dependencies and services
   - Configuration mechanisms
   - Documentation structure and the reasoning behind it
   - Unverified or ambiguous areas
   - Repository issues found: README/`GEMINI.md` drift, the missing root `.env.example`, gitignored-but-required source directories, orphaned directories (e.g. `micro-workspace-protocol-nextjs/`), unused config, test files not wired to npm scripts, and any security findings

---

## WRITING STYLE

Write for developers. Short paragraphs, descriptive headings, precise terms, real examples, tables and diagrams where they carry weight.

Prefer:

> `sidebarRegistry.js` maps each nav id to the view flag `App.jsx` toggles when the item is clicked.

Over:

> The sidebar registry is a powerful and flexible system designed to seamlessly orchestrate navigation.

Avoid marketing language, filler, repetition, and documenting the obvious.

---

## DEFINITION OF DONE

A new contributor can answer, from the documentation alone: what this project is and which parts are separate products; how the SPA, functions, database, and workers interact; how to install, configure, run, and verify it; how a request travels through each major flow; what every endpoint and table does; how AI providers are selected and invoked; how to add a panel, provider, endpoint, or content generator; how to deploy each surface; and how to diagnose the failures this repo actually produces.

Start with **Phase 1: Repository Discovery**. Present a concise implementation plan after the analysis, then build.
