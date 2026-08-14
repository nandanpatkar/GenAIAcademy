# Job Scout — deploying for free

Companion to [JOB_AGENT_PLAN.md](JOB_AGENT_PLAN.md), which covers what was built and why.
This is the plan to get it running in production without paying anything and
without putting a credit card anywhere. Nothing here has been applied yet.

---

## Verdict

**Yes, this can run free — on Render, kept awake by a Cloudflare Worker cron.**
No credit card at any step. The Dockerfile needs no changes at all.

Hugging Face is genuinely out. The docs and the HF forums agree: as of 2026 the
Docker SDK is marked *Paid*, and new free accounts can only create Gradio Spaces on
ZeroGPU — CPU Basic is not offered.

> Gradio and Docker Spaces run on compute and require a paid plan to create: PRO for
> personal accounts, Team or Enterprise for organizations.
> — [Spaces Overview](https://huggingface.co/docs/hub/spaces-overview)

The Gradio SDK is not a way round it: it runs `python app.py` from a
`requirements.txt` with no Dockerfile, which means no nginx, no Node build stage for
the Jobvis console, and no second port — and `app.py:main()` binds `127.0.0.1`, so HF
could not reach it anyway. Every one of those would mean editing the agent.

---

## What I measured

I ran the real image under Render's exact free-tier ceiling
(`docker run --cpus 0.1 --memory 512m`) against an unthrottled container:

| | unthrottled | **0.1 CPU / 512 MB** |
|---|---|---|
| cold boot until `/api/config` answers | ~8 s | **286 s** |
| `GET /api/config` warm | 34 ms | 379 ms |
| `GET /api/state` warm | 5 ms | 878 ms |
| `GET /jobscout/` warm | 18 ms | 477 ms |
| `GET /gradio_api/app_id` warm | 4 ms | 74 ms |
| resident memory, warm | 179 MB | 172 MB |

Two conclusions, and they point in opposite directions:

- **Memory is a non-issue.** 172 MB against a 512 MB cap is 3× headroom. I expected
  this to be the blocker and it isn't.
- **CPU is fine once warm and fatal when cold.** Sub-second interactions are
  perfectly usable for a wizard whose real cost is waiting on LLM and job-board APIs.
  But a 286-second boot — 35× slower than unthrottled — is not something anyone will
  sit through.

So the entire deployment strategy reduces to one thing: **never let it go cold.**

---

## Why keep-warm makes the free tier work

Render's free instance is 512 MB / 0.1 CPU with 750 instance-hours per month, and
it spins down after 15 minutes without inbound traffic. Ping it every 10 minutes and
it never spins down — and the arithmetic works out:

```
744 hours in the longest month  <  750 free instance-hours
```

It fits, with 6 hours to spare. Two caveats that follow directly from that:

- **This must be your only free Render service.** The 750 hours are per workspace,
  not per service. A second one and both get suspended before month end.
- The 286-second boot still happens **after every deploy**, because the new container
  starts cold. That is a deploy cost, not a per-visit cost.

The pinger has to be free too, and Cloudflare Workers already covers it: Cron
Triggers are on the free plan, 5 per account, 100,000 requests/day. Pinging every 10
minutes is 144 requests/day. You are already using Workers for `docs-cdn`.

---

## Step 1 — Commit `services/job-scout`

Render deploys from GitHub, and the directory is currently untracked (140 files).
Two things I verified before writing this, because `nandanpatkar/GenAIAcademy` is a
**public** repo:

```
git check-ignore -v services/job-scout/.env
  → services/job-scout/.gitignore:14:.env    ✓ ignored
```

`data/candidate/` — your CV text and extracted profile — is ignored by the same file.
What *does* become public is the agent's source (your own project, already carrying a
LICENSE) and `data/cached_jobs.json`. No keys.

```bash
git add services/job-scout JOB_AGENT_PLAN.md JOB_AGENT_DEPLOY.md
git commit -m "Vendor Job Scout agent for container deploy"
```

The `api/regions.js` and `api/prices.js` ESM fixes are unrelated to any of this and
deserve their own commit.

## Step 2 — Create the Render service ✅ *codified in [render.yaml](render.yaml)*

The service is declared as a Blueprint rather than clicked together in the dashboard,
so the config is reviewable in git. At <https://dashboard.render.com> →
**New → Blueprint** → connect `GenAIAcademy` → it reads `render.yaml` and prompts for
every `sync: false` value.

No credit card is required to sign up or to deploy a free web service. If you later
blow through the included bandwidth, Render suspends the service rather than charging
you, precisely because there is no payment method on file.

Three decisions inside that file worth knowing about:

- **`PORT: 8080`** — nginx listens on a hardcoded 8080 and Render otherwise expects
  10000. This tells Render where to look; it does not require the app to read it.
- **No `healthCheckPath`.** Render would poll it through the ~5-minute cold boot,
  when nginx is answering but Python is not, and fail the deploy on the 502s. With no
  health check Render waits for the port to bind — which nginx does in about a second,
  because `CMD` starts it before the interpreter. That is the accurate signal here.
- **`region: singapore`**, the closest to the Indian roles this mostly searches.

**No Dockerfile changes were needed for Render.** It runs the image as whatever
`USER` the image declares (root, here), so none of the UID-1000 and non-root-nginx
work HF would have forced applies. That is the main practical reason Render is less
effort than HF even ignoring the money.

## Step 3 — Keys ✅ *declared `sync: false`*

`config.py` uses pydantic-settings, which reads **environment variables before**
`env_file`, so no `.env` is needed in the image. Render prompts for each of these on
Blueprint creation and stores them only on its side — nothing secret lands in this
public repo. Copy the values out of `services/job-scout/.env`.

Checked against your actual `.env`: `AZURE_OPENAI_*`, `ELEVENLABS_*` and
`TAVILY_API_KEY` have values. **`ADZUNA_*`, `JSEARCH_API_KEY`, `OPIK_API_KEY` and
`OPIK_WORKSPACE` are present but empty** — so job search runs on Remotive plus the
committed cache, and there is no Opik tracing, which is the thing the agent's README
calls the point of the project. All four are free to register. They are declared in
the Blueprint so you can fill them in later without editing anything.

The non-secret tuning values (`SCOUT_MAX_JOBS`, the fabrication ratios, and so on)
are pinned literally in `render.yaml` so production matches your local behaviour.

## Step 4 — Drop tectonic ✅ *done*

Removed from the Dockerfile, with the exact block to re-add left in a comment. At
0.1 CPU a LaTeX compile takes minutes, and tectonic downloads a ~300 MB TeX bundle on
first use onto a filesystem Render wipes on every deploy.

You lose nothing you have today: **your Mac has no tectonic either**, so every local
tailoring run already degrades to `.tex` + Overleaf. `renderer.py:7` states this as an
explicit *"degradation contract: rendering must never fail a run"*, so this is a
supported mode, not a workaround.

## Step 5 — The keep-warm Worker ✅ *[jobscout-keepwarm-worker/](jobscout-keepwarm-worker/)*

Follows the same layout as `docs-cdn-worker/`. One value to fill in — `TARGET` in
`wrangler.jsonc` — then:

```bash
cd jobscout-keepwarm-worker && npm install && npx wrangler deploy
```

**`TARGET` must be the `onrender.com` hostname, not your Vercel domain.** Vercel now
caches external rewrites by default (step 6), so a ping through the rewrite could be
answered from the CDN and never reach Render — the service would sleep while the
pinger reported success. It hits `/api/config` rather than `/` because that is served
by the FastAPI process, so a 200 proves the interpreter is alive; nginx would answer
`/` long before the agent is ready.

Verify the cron without waiting ten minutes:

```bash
npx wrangler dev --test-scheduled     # then curl http://localhost:8787/__scheduled
```

## Step 6 — Wire up Vercel — *header done, two values left*

The cache header is already in `vercel.json`. Since **April 6, 2026** Vercel honours
upstream `cache-control` on external rewrites by default — right for the content-hashed
Next.js chunks under `/_next/`, wrong for a stateful agent, where it would let one
visitor's `/api/state` be served to the next:

```json
{ "source": "/jobscout/(.*)", "headers": [{ "key": "x-vercel-enable-rewrite-caching", "value": "0" }] }
```

Two things still need the hostname Render assigns, so they wait for step 2. In
`vercel.json`, replace both placeholders:

```json
{ "source": "/jobscout/(.*)", "destination": "https://<your-service>.onrender.com/$1" },
{ "source": "/_next/(.*)",    "destination": "https://<your-service>.onrender.com/_next/$1" }
```

And set `GRADIO_ROOT_PATH` in Render. Gradio builds the absolute API root it hands the
browser from the `Host` header, and **Vercel external rewrites do not preserve
`Host`** — they send the destination's. Left alone, Gradio would advertise
`onrender.com`, the browser would leave your origin, and the console's fetches would
hit the `localhost:3000`-only CORS rule at `api.py:239`. `GRADIO_ROOT_PATH` accepts a
complete URL (verified):

```
GRADIO_ROOT_PATH = https://your-domain.vercel.app/jobscout
```

This overrides the `ENV GRADIO_ROOT_PATH=/jobscout` baked into the Dockerfile, which
stays as the local-development default.

## Step 7 — Probe timeout and cold-start copy ✅ *done*

`PROBE_TIMEOUT_MS` was 90 s against a measured 286 s boot, so the page would have
shown a failure during every deploy while the container was booting perfectly
normally. Now 330 s, and the waiting state counts elapsed seconds — a spinner with no
moving number for five minutes reads as a hung page.

`NOT_LISTENING_BUDGET_MS` is untouched. It is keyed to the `"source":"vite-dev-proxy"`
marker that only the local dev proxy emits, so the fast path for "you forgot to start
Docker" locally never fires in production and cannot cut the real boot short.

---

## What you are giving up, plainly

- **Every interaction is ~0.4–0.9 s slower.** Fine for a wizard that spends most of
  its time waiting on LLM calls; noticeable if you expected snappiness.
- **No persistent disk on Render free** — it is explicitly disallowed. `data/candidate/`
  is wiped on every deploy, so the CV gets re-uploaded and the wizard starts at step 1.
  Search results were never persisted by design, so nothing else is lost.
- **750 instance-hours is the entire budget.** One free service, and nothing else.
- **PDF output goes away** with tectonic (step 4) — same as your Mac today.
- **Deploys cost ~5 minutes of downtime**, during which the page shows its retry state.

---

## If you would accept a card on file

Both of these are free in practice and better technically; I am listing them because
"free tier" and "no credit card" are different constraints and only you know which
one you actually meant.

**Google Cloud Run** — 2M requests, 180,000 vCPU-seconds and 360,000 GiB-seconds per
month, perpetual, not a trial. Scale-to-zero with a startup CPU boost means a cold
start of roughly 15–25 s for this 1.52 GB image, so no keep-warm hack is needed at
all. But: *"A Google Cloud billing account is required to access the Google Cloud Free
Tier"*, and anything past the limits is billed at standard rates. Guard it with
`--max-instances=1` (which also preserves the agent's single-session assumption) and
a budget alert at $1.

**Oracle Cloud Always Free** — 4 ARM cores and 24 GB RAM, free forever, which would
run this at full speed. Costs: card verification, you manage the VM and TLS yourself,
and A1 capacity is frequently unavailable in popular regions. Your Dockerfile already
detects arm64, so the image itself would just work.

## And the zero-infrastructure option

```bash
cloudflared tunnel --url http://localhost:7860
```

Free, no card, no cold start, full CPU, and it reaches loopback directly so it needs
neither Docker nor nginx. It is only up when your Mac is, and a quick tunnel gets a
new random hostname on every restart, which means editing `vercel.json` and
redeploying each time. Good for showing someone the thing; not a live portfolio link.

---

## Before it is reachable from the internet

The agent is single-user by construction — one profile file, one process-wide voice
bridge, one in-process `MemorySaver`. **Two concurrent visitors share a session and
see each other's resumes**, and every visitor spends your Azure and ElevenLabs credit.

The sidebar entry is `defaultVisibility: "admin"`, which hides the door without
locking it: the `onrender.com` URL is open to anyone who finds it. The practical lock,
entirely in nginx and still not touching the agent, is to serve under an unguessable
prefix and have Vercel rewrite into it — the browser never sees it, because the
rewrite is server-side:

```nginx
location /s/8f3c…/ { rewrite ^/s/8f3c…/(.*)$ /$1 last; }
location /         { return 404; }
```

```json
{ "source": "/jobscout/(.*)", "destination": "https://<your-service>.onrender.com/s/8f3c…/$1" }
```

That is obscurity, not authentication — enough to stop drive-by traffic and crawlers,
not enough to be the only thing between the internet and your API keys if the URL
leaks. Remember to point the keep-warm Worker at the prefixed path too.

---

## Test it in this order

Against Render directly, no Vercel in the path:

```bash
R=https://<your-service>.onrender.com
curl -s  $R/api/config          # {"voice_ok":true,…}
curl -sI $R/                    # 200, gradio-app
curl -sI $R/jobvis              # 200
```

Then through production, which is where the interesting failures live:

```bash
D=https://your-domain.vercel.app
curl -s  $D/jobscout/api/config
curl -s  $D/jobscout/ | grep -o '"root":"[^"]*"'   # must be your domain, not onrender.com
curl -sN $D/jobscout/gradio_api/queue/data          # must stay open, not return instantly
curl -s -X POST $D/jobscout/api/voice/token         # a real ElevenLabs JWT
```

That third one is the one real unknown. Gradio streams run progress over
`/gradio_api/queue/data`, and a job search holds it open for tens of seconds. Vercel
documents no duration limit for proxied external rewrites, but no guarantee either —
and it explicitly does not proxy WebSockets. Nothing here needs a WS upgrade (Gradio 5
uses SSE; the voice session is browser-to-ElevenLabs over WebRTC), so SSE is the only
exposure. If that `curl -sN` returns immediately instead of hanging, the rewrite is
buffering and the wizard will appear to freeze mid-run; the fallback is to point the
iframe straight at `onrender.com` and let it be cross-origin, which does not trip CORS
because the iframe's own origin becomes Render.

Finally, open the app → sidebar → **Career → Job Scout**, and run one full pass:
upload a CV, search, tailor, start a voice session.

---

## What is left to do

Everything that can be done without a Render account is done: the tectonic removal,
`render.yaml`, `jobscout-keepwarm-worker/`, the Vercel cache header, and the probe
timeout. What remains needs the hostname Render assigns:

1. Push the commit to GitHub — Render deploys from there
2. **New → Blueprint** on Render, fill in the prompted secrets, wait out the ~5 min
   first build
3. Direct-to-Render curls (below) before involving Vercel at all
4. Put the hostname in `jobscout-keepwarm-worker/wrangler.jsonc`, `wrangler deploy`
5. Put the hostname in the two `vercel.json` rewrites; set `GRADIO_ROOT_PATH` in Render
6. Deploy Vercel, run the through-production curls, then a full pass in the UI
7. Decide on the secret prefix before telling anyone the app has a Job Scout tab

Nothing in this plan modifies a line of the agent's Python. `diff -r` against
`/Users/nandanpatkar/observable-job-agent/src` should still come back clean.
