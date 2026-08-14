# Job Scout Integration

The Observable Job Agent, vendored into this project and embedded in the app. **The agent's own code is unmodified** — every `.py` file is byte-identical to `/Users/nandanpatkar/observable-job-agent`.

Status: **built and verified locally.** One step left — deploy the container and point the rewrite at it.

---

## What's in the repo now

| Path | What |
|---|---|
| `services/job-scout/` | The agent, copied from your working tree (3.2 MB) |
| `services/job-scout/Dockerfile` | **new file** — container + nginx sidecar |
| `services/job-scout/deploy/nginx.conf` | **new file** — one public port in front of two loopback servers |
| `services/job-scout/.dockerignore` | **new file** |
| `src/pages/jobscout/JobScoutPage.jsx` | The embedded view, modelled on `AWSSystemDesignSimulator.jsx` |
| `src/App.jsx` | Lazy import, `showJobScout` view state, `closeAllPanels`, render chain, exclusion list |
| `src/config/sidebarRegistry.js` | `job_scout` item in the **Career** group, `defaultVisibility: "admin"` |
| `src/config/sidebarNav.js`, `src/components/Sidebar.jsx` | Launcher + active-state wiring |
| `vercel.json`, `.vercelignore`, `.env.example` | Rewrite, build exclusion, `JOBSCOUT_TARGET` |
| `render.yaml` | **new file** — Render Blueprint for the container (free instance) |
| `jobscout-keepwarm-worker/` | **new file** — cron Worker that stops the free instance sleeping |

### Copied from your working tree, not `git subtree`

You had **30 uncommitted lines adding Azure OpenAI support** across `config.py`, `llm.py` and `.env.example`. `git subtree add` pulls from committed `HEAD` and would have silently dropped all of it. Copying preserves exactly what you're running.

Excluded on the way in: `.env` (secrets), `data/candidate/` (your CV and profile), `.venv`, `__pycache__`, `node_modules`, `web/out`. Verified none of them landed.

---

## Why the nginx sidecar exists

Both servers bind loopback, hardcoded:

```python
# app.py:main()   → server_name="127.0.0.1", port 7860
# api.py:379      → host="127.0.0.1", port 8000
```

`launch()` passes `server_name` explicitly, so `GRADIO_SERVER_NAME` cannot override it. Containerise this naively and nothing outside reaches it — every host expecting a bind on `0.0.0.0` fails its health check. And you can't split the two servers, because `app.py:main()` states the single process is *"not a convenience here, it is a correctness requirement"* — the voice bridge and the LangGraph `MemorySaver` are both process-wide.

Loopback *is* reachable from inside the container. So nginx runs in there with the agent:

```
nginx :8080 (0.0.0.0)   ← only exposed port
  ├─ /api/*, /_next/*, /jobvis  → 127.0.0.1:8000   FastAPI
  └─ /*                          → 127.0.0.1:7860   Gradio wizard
python -m job_scout.app  ← ONE process, unmodified
```

That fixes the loopback bind, collapses two ports into one, preserves the single-process requirement, and makes the `localhost:3000`-only CORS rule at `api.py:239` irrelevant since everything is one origin.

---

## Verified locally

Through the dev proxy, which is the path the browser actually takes:

```
GET /jobscout/                        → 200, gradio-app markup (not the SPA)
    advertised root                   → http://localhost:5199/jobscout  ← this origin
GET /jobscout/gradio_api/app_id       → 200 {"app_id":...}
GET /jobscout/assets/index-*.js       → 200, 87 KB, application/javascript
GET /jobscout/theme.css               → 200
GET /jobscout/api/config              → 200 {"voice_ok":true,...}
GET /jobscout/api/state               → 200
GET /jobscout/gradio_api/queue/data   → connection held open (SSE unbuffered)
GET /jobscout/jobvis                  → 200, the Jobvis console
GET /_next/static/chunks/*.js         → 200
POST /jobscout/api/voice/token        → 200, real ElevenLabs JWT
agent stopped                         → 500 text/plain, zero SPA markup
npx vite build                        → passes, JobScoutPage chunk emitted
diff -r agent src                     → identical apart from __pycache__
```

### Serving Gradio under /jobscout/

Gradio hands the browser an **absolute** API root, derived from the `Host` header
plus its configured root path. Three things have to line up or the wizard renders
and then fails to talk to its backend:

1. **`GRADIO_ROOT_PATH=/jobscout`** (set in the Dockerfile). `app.py:main()` never
   passes `root_path` to `launch()`, and Gradio falls back to this env var when it
   is `None` — so the prefix is configurable without touching the agent.
2. **nginx forwards `$http_host`, not `$host`.** `$host` drops the port, so Gradio
   advertised `http://localhost` and the browser hammered a refused connection
   on :80.
3. **The dev proxy uses `changeOrigin: false`.** Rewriting `Host` to the container
   makes Gradio advertise `localhost:8080`, sending the browser off this origin,
   past the proxy and into CORS.

**In production**, whatever Host your platform forwards decides that root. If the
wizard loads but its requests go to the container's hostname, pin it explicitly —
`GRADIO_ROOT_PATH` also accepts a complete URL (verified):

```bash
-e GRADIO_ROOT_PATH=https://your-domain.com/jobscout
```

### Jobvis, the voice console

`web/` is a Next.js static export that upstream gitignores as a build artifact, so
the Dockerfile builds it in a Node stage rather than vendoring it. Two things had
to be handled without editing the agent:

- **API base.** `web/lib/api.ts:6` reads `NEXT_PUBLIC_API_BASE`, which Next bakes
  in at build time. Left empty it would call `/api/...` at the host origin — and
  this app *has* its own `/api/*`, so the console would have been talking to
  `api/copilot.js`. The stage sets `NEXT_PUBLIC_API_BASE=/jobscout`; verified in
  the bundle as `Cr="/jobscout"` with every endpoint built as `${Cr}/api/...`.
- **Assets.** The export requests chunks at the absolute path `/_next/...`, which
  can't be changed without editing `next.config.ts`. Nothing else serves `/_next`
  (Vite emits `/assets`), so that prefix is routed to the agent in both
  `vite.config.js` and `vercel.json`.

Keys live in `services/job-scout/.env`, copied from your original checkout and
git-ignored via the vendored `.gitignore:14`. **Mount it, don't use `--env-file`**:
pydantic-settings parses dotenv with its own rules, and `.env.example` warns that
inline comments after a value get read as part of the value.

### Bugs the build and the browser actually caught

1. **`tectonic` is not in Debian trixie**, which `python:3.12-slim` is now based on, so the Dockerfile pulled the upstream static musl build instead. That block has since been **removed** — see [JOB_AGENT_DEPLOY.md](JOB_AGENT_DEPLOY.md) step 4 — because a LaTeX compile is unusable at 0.1 CPU and the bundle would be re-downloaded after every deploy. Tailoring degrades to `.tex` + Overleaf, which is what your Mac already does. The exact block to re-add is kept in a Dockerfile comment.
2. **`uv run` re-resolves at container start** and was re-downloading the whole dev group — jupyter, ruff, debugpy — on every boot, undoing the build-time `--no-dev` install. Now runs `/app/.venv/bin/python` directly.

---

## Running it

### Locally, right now

```bash
docker run --rm -p 8080:8080 \
  -v "$PWD/services/job-scout/.env:/app/.env:ro" \
  job-scout:local                                    # ~8s to boot
```

The image deliberately contains **no** `.env` — mount it at runtime. Then `npm run dev`
and open Job Scout from the sidebar under **Career** (admin-only). No extra
configuration: `vite.config.js` proxies `/jobscout/` to `localhost:8080`, override
with `JOBSCOUT_TARGET`.

### The embed is always same-origin

The browser only ever requests the path `/jobscout/` — proxied by `vite.config.js`
in development, rewritten by `vercel.json` in production. Pointing the iframe
straight at the container instead would hit the CORS allowlist in `api.py:239`,
which permits only `localhost:3000`.

`JobScoutPage` probes `/jobscout/api/config` and renders the iframe only once it
gets JSON back from the agent. That guard matters: when nothing proxies that
path, a dev server or SPA host answers with `index.html` rather than a 404, and
iframing that loads this app **inside itself, recursively**. If the agent is
down the page now shows the `docker run` command and a retry button instead.

### Deploying

**[JOB_AGENT_DEPLOY.md](JOB_AGENT_DEPLOY.md) is the step-by-step plan: Render free tier, kept awake by a Cloudflare Worker cron, no credit card.** HF Spaces is no longer an option — the Docker SDK now requires PRO ($9/mo), so the "free" claim below was wrong.

Push the image to any container host — Render (free), Google Cloud Run (free tier, card required), Cloudflare Containers ($5/mo Workers Paid), HF Spaces (PRO). Then replace the placeholder in `vercel.json`:

```json
{ "source": "/jobscout/(.*)", "destination": "https://REPLACE-WITH-YOUR-JOB-SCOUT-HOST/$1" }
```

`JOBSCOUT_TARGET` is development-only and is not needed in production.

Fastest possible check with no deploy at all: `cloudflared tunnel --url http://localhost:7860` — cloudflared reaches loopback directly, so it needs neither Docker nor nginx.

---

## Keys

Runs with **zero** keys using Remotive (keyless) plus the committed `data/cached_jobs.json`, but nothing meaningful happens without an LLM key.

| Key | Free tier | Without it |
|---|---|---|
| `OPENAI_API_KEY` | pay-as-you-go | Nothing runs. Free routes: `SCOUT_MODEL=groq:llama-3.3-70b-versatile`, `ollama:llama3.2`, or your Azure additions |
| `ADZUNA_APP_ID` / `_KEY` | free registration | Lose ~20 countries **including India** (`in`, Bengaluru/Mumbai/Delhi pre-mapped) |
| `JSEARCH_API_KEY` | ~200 req/month | Lose best city-level results |
| `TAVILY_API_KEY` | free tier | Cover letters lose grounded company facts |
| `OPIK_API_KEY` | free at comet.com | No tracing — the point of the project |

Job search is **three job-board APIs plus an offline cache**, not web search or scraping (`jobs_api.py:15`: *"No scraping sources are included"*). Tavily is the only real web search, used once per *tailoring* run for company research.

---

## The one thing to keep in mind

Preserving behaviour exactly also preserves the single-user design — one profile file (`candidate_store.py:27`), one global bridge (`voice/bridge.py:253`), one in-process `MemorySaver` (`graph/graph.py:73`). **Two concurrent visitors would share a session and see each other's resumes.**

That's why the sidebar item is registered `defaultVisibility: "admin"`. Add Cloudflare Access on the hostname as a second lock before it's reachable from the internet.

---

## Proving the agent is still untouched

```bash
diff -r /Users/nandanpatkar/observable-job-agent/src services/job-scout/src   # only __pycache__
cd services/job-scout && uv sync --all-groups && uv run pytest               # 230 tests, no keys or network
```
