# Backend & API reference

Three separate server surfaces exist. They are unrelated to each other, deploy independently, and are easy to confuse.

1. **Vercel serverless functions** — `api/*.js`, twelve handlers, deployed with the SPA.
2. **Supabase edge functions** — three Deno functions, deployed with `supabase functions deploy`.
3. **Job Scout** — a FastAPI service in `services/job-scout/`, deployed to Render and reached through a rewrite.

## Handler conventions

Every function in `api/` is a plain Node handler:

```javascript
export default async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  // ...
}
```

There is no framework, no shared middleware, and — on most handlers — no authentication. Access control for user data lives in Postgres RLS, reached directly by the browser, not in this layer.

> [!IMPORTANT]
> `package.json` sets `"type": "module"`, so these files are ESM. `require` is undefined and a CommonJS import fails the whole module at load time, producing a 500 rather than a build error. Relative imports also need their file extension — Node's ESM resolver does not guess.

### The twelve-function ceiling

Vercel's Hobby plan allows 12 serverless functions per deployment, and `api/` holds exactly twelve. Two consequences are visible in the code:

- `api/leetcode-judge.js` is a deliberate merge of two former handlers, dispatching on `body.action`.
- Shared code lives in `api/_lib/` and data in `api/_data/`. The underscore prefix keeps them from being treated as functions.

Adding a thirteenth file directly under `api/` breaks the deploy. Extend an existing handler or put the code in `api/_lib/`.

## Endpoint reference

### `POST /api/execute`

Code-execution proxy that keeps provider credentials server-side.

**Body**

| Field | Required | Notes |
|---|---|---|
| `script` | yes | Source to run |
| `language` | yes | Must be in the handler's allow-list, else `400` |
| `versionIndex` | no | Defaults to `"0"` |
| `stdin` | no | Defaults to `""` |
| `provider` | no | `"jdoodle"` (default) or `"hackerearth"`; anything else is `400` |

```bash
curl -X POST http://localhost:5173/api/execute \
  -H "Content-Type: application/json" \
  -d '{"script":"print(1+1)","language":"python3","stdin":""}'
```

### `POST /api/leetcode-judge`

The Code Lab judge. Dispatches on `body.action`, which is `"submit"` when set to exactly that and `"run"` otherwise.

**Body:** `action`, `problemId`, `code`, optional `provider`.

**Behaviour**

- Rate-limited per action — over the limit returns `429` with a message naming runs or submissions.
- Invalid payload returns `400`; unknown `problemId` returns `404`.
- On `submit`, a problem whose manifest is not judge-enabled returns `422`.
- Submissions run visible *and* hidden tests, then redact hidden-case detail before responding.
- A response carries `verdict` (`"accepted"` / `"rejected"`) and `accepted`; acceptance requires every test to pass and at least one test to exist.
- Runner misconfiguration returns `503`; an upstream execution failure returns `502`.

Problem manifests are read from `api/_data/leetcodeManifests.json` and `codelabManifests.json`, both committed.

### `GET /api/exam`

Exam-bank reader, dispatching on `req.query.resource` with `exam`, `name`, `path` and `format` as supporting parameters. `format` accepts `csv`, otherwise JSON. Results are cached back into Supabase using a service-role key, which is why this handler needs credentials the browser never sees.

### `GET /api/blob` · `POST /api/upload`

S3-backed storage for the cloud IDE and editor. `blob` takes a `key` query parameter; `upload` receives the payload. Both read `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_S3_BUCKET_NAME`.

### `GET /api/prices`

AWS pricing data for the system-design simulator, keyed by `req.query.region` and defaulting to `us-east-1`. Backed by a Cloudflare KV cache via `CF_ACCOUNT_ID`, `CF_KV_NAMESPACE_ID` and `CF_API_TOKEN`. The region allow-list lives in `api/_lib/regions.js` — it was moved there specifically so it stopped counting toward the function limit.

### `GET /api/youtube-playlist`

Expands a playlist URL passed as `req.query.url` into its videos via the YouTube Data API v3, using `YOUTUBE_API_KEY`. Powers the Resources panel's playlist import.

### `POST /api/gemini-live-token`

Mints a short-lived, single-use credential for a Gemini Live session so `GEMINI_API_KEY` stays server-side.

### `POST /api/ai-chat`

Server-side chat relay. Tolerates a body arriving as a string or a parsed object, which is a recurring difference between local dev and the deployed runtime.

### `POST /api/graphql` · `/api/copilot/*` · `/api/auth/*`

These three exist only to satisfy the vendored editor bundle in `public/editor/`, which is a self-hosted third-party workspace app repurposed as in-app notes. They implement a compatibility subset — a GraphQL schema slice, a copilot SSE contract, and a REST auth stub whose signed-out shape is `{ user: null }`.

> [!WARNING]
> These are not general-purpose APIs and are not safe to build new features on. Upgrading the vendored bundle can break the contract they emulate.

## Supabase edge functions

Deno functions in `supabase/functions/`, invoked from the client:

```javascript
const { data, error } = await supabase.functions.invoke('web-search', {
  body: { query: 'latest RAG techniques 2026' },
});
```

| Function | Secret it needs |
|---|---|
| `ai-chat` | `GEMINI_API_KEY` |
| `notion-fetch` | `NOTION_API_KEY` |
| `web-search` | `TAVILY_API_KEY` |

Secrets are set with `supabase secrets set NAME=value` and are not read from the repo.

## Job Scout

`services/job-scout/src/job_scout/api.py` builds a FastAPI app and mounts a Gradio UI. Its routes include `/api/config`, `/api/state`, `/api/events`, `/api/voice/token`, `/api/voice/last-error`, `/api/tools/{name}`, `/api/pack/pdf` and `/api/pack/tex`.

The SPA reaches it through the `/jobscout/` rewrite in `vercel.json`, which points at the Render deployment. See [Deployment](doc:deployment) for why `GRADIO_ROOT_PATH` must be set for that rewrite to work.

![The Learn API panel, which documents API concepts inside the product.](/docs-shots/learn-api.jpg)
