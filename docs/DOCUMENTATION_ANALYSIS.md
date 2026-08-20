# Documentation analysis

Findings from the repository analysis that produced the in-app **About →
Documentation** section. Everything here was verified against the implementation.

## Project summary

GenAI Academy is a learning platform for AI/ML, GenAI, DSA, system design and
cloud certifications, delivered as a single React SPA. The repository is a
monorepo: the SPA and its backend are one product, and several other products
share the git history without sharing a build.

## Technology stack

| Layer | Detected |
|---|---|
| Frontend | Vite 5, React 18, vanilla CSS, Framer Motion, lucide-react, Monaco, Three.js, ReactFlow, D3, Mermaid |
| Routing | None — a view-flag state machine in `src/App.jsx` |
| Backend | 12 plain ESM Node handlers in `api/`, deployed as Vercel functions |
| Local backend | `apiMiddleware()` plugin in `vite.config.js` |
| Data | Supabase Postgres + Auth + RLS; three Deno edge functions |
| AI | Client-side provider registry with `gemini` / `azure` / `openai` adapters, plus an ApiBeam browser relay |
| In-browser runtimes | Pyodide (`react-py`), PGlite |
| Edge | Cloudflare Workers + R2 (three workers) |
| Python service | `services/job-scout` — FastAPI + Gradio graph agent, Opik tracing, deployed to Render |
| Desktop | Tauri 2, built by GitHub Actions on `v*` tags |

## Entry points

- `src/main.jsx` → `src/App.jsx` (providers: Auth → Theme → Projects)
- `api/*.js` — one handler per file, `(req, res)`
- `supabase/functions/*/index.ts` — Deno edge functions
- `services/job-scout/src/job_scout/api.py` — `create_app()`
- `src-tauri/` — desktop shell, no native logic

## Architecture

The browser owns navigation state, provider selection and Supabase access.
Serverless functions exist for credential custody, RLS-bypassing cache writes,
and emulating an external product's API for a vendored bundle. Access control is
Row Level Security, not application code.

## Major functional flows traced

Cold load and auth resolution · panel navigation · AI dispatch · code execution ·
Code Lab judging · IDE project persistence · voice token issuance · web search ·
exam-bank caching · documentation delivery via R2 · Job Scout · build-time
content generation.

## External dependencies

Google Gemini (+ Live), Azure OpenAI, OpenAI-compatible providers (GLM, Kimi,
Grok, Groq, DeepSeek), Retell, JDoodle, HackerEarth, AWS S3, YouTube Data API,
Cloudflare KV/R2, Notion, Tavily, Supabase, Render, Opik.

## Configuration

Environment variables split across five scopes: client `VITE_*`, Vercel
`process.env.*`, Supabase edge secrets, Render service vars in `render.yaml`, and
build/upload-only vars. `vercel.json` (rewrites, function `excludeFiles`),
`.vercelignore` and `vite.config.js` are all load-bearing.

## Documentation structure

Twelve pages in three sections: **Start here** (Overview, Architecture, Feature
tour, Local setup), **How it works** (App shell & navigation, AI providers &
services, Backend & API reference, Data & persistence, Content pipeline), and
**Working on it** (Extending the app, Deployment, Troubleshooting).

The split follows how the repository is actually confusing: what is one product
versus many, how navigation works without a router, and which multi-file rituals
are unenforced by any framework.

## Repository issues found

### 1. Hardcoded admin credentials — act on this

`src/components/AuthInterface.jsx` compares submitted admin credentials against
an email and password written literally in the source. In a public repository
that password is readable by anyone who clones it.

**Recommended:** rotate the password, and replace the client-side string
comparison with a server-side or RLS-backed role check. The `app_admins` table
already exists for this.

### 2. Schema is only partly captured by migrations

`supabase/migrations/` creates eleven tables, but the client also reads and
writes `user_curriculum`, `profiles`, `user_links`, `quiz_sessions`,
`user_quizzes`, `quiz_metrics`, `blogs`, `community_members`, `community_groups`,
`channels` and `messages` — none of which have a migration. A fork cannot
reproduce a working database from this repository alone.

### 3. Supabase credentials are hardcoded rather than configured

`src/config/supabaseClient.js` hardcodes the project URL and anon key instead of
reading `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. The anon key is public by
design and safe to ship, so this is a configuration inflexibility rather than a
leak — but it does mean forking requires a source edit, and it makes RLS coverage
the only thing protecting the project.

### 4. No root `.env.example`

Referenced in setup text but absent. The variable tables in the Local setup page
are currently the only complete reference.

### 5. `GEMINI.md` has drifted

It describes a single-provider Gemini setup and lists `VITE_GEMINI_API_KEY` as
required. The code has had a multi-provider registry with per-user credentials
for some time. The implemented behaviour is documented; `GEMINI.md` should be
updated or pointed at the new section.

### 6. Tests are only partly wired

`tests/` holds four `node --test` files. Only `leetcodeJudge.test.mjs` and
`codelabTopicMap.test.mjs` have npm scripts; `concurrencyQuest.test.mjs` and
`examScraper.test.mjs` must be run directly and so are easy to forget.

### 7. Orphaned directory

`micro-workspace-protocol-nextjs/` is referenced by no build, route or script.

### 8. Mermaid labels clip in the shared renderer

Mermaid measures labels before the web font loads and paints them in the loaded
face, so the last character or two is cut off by the `foreignObject` bounds. The
new documentation viewer works around this with a scoped CSS rule; the LangChain,
Strands and AgentCore viewers still show the clipped output and would benefit
from the same fix applied in `LangChainDocs.css`.

## Unverified or ambiguous areas

- Which of the undocumented tables in §2 still exist in the live project.
- Whether `VITE_GEMINI_API_KEY` is read anywhere at runtime, or is purely legacy.
- The current deployment state of the ApiBeam relay and The Missing Manual, both
  of which deploy outside this repository's pipelines.
