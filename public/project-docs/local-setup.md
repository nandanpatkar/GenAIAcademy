# Local setup

## Prerequisites

| Requirement | Why |
|---|---|
| Node.js 22 | The version the desktop workflow pins; the repo is ESM throughout |
| Python 3 | Several `build:*` generators are Python, including the one needed before first run |
| A Supabase project | Auth and all persisted data; see the caveat below |
| Provider API keys | Optional — AI features prompt for a key at runtime rather than requiring one at boot |

Rust and the Tauri CLI are needed **only** for the desktop build. Docker is needed **only** inside `services/job-scout/` and `themissingmanual/`.

## Install and run

```bash
git clone <repository-url> && cd GenAIAcademy
npm install
npm run build:reference   # generates src/data/referenceData.js
npm run dev               # http://localhost:5173
```

> [!IMPORTANT]
> `npm run build:reference` is not optional on a fresh clone. It writes `src/data/referenceData.js`, which is imported at module scope — without it the dev server starts and then fails on an unresolved import. `predev` handles `build:apibeam-extension` for you, but not this one.

There is no need for `vercel dev`. The `apiMiddleware()` plugin in `vite.config.js` serves `api/*.js` in-process during `vite dev`, including the `/graphql`, `/api/copilot/*` and `/api/auth/*` rewrites.

## Environment variables

No `.env.example` exists at the repo root, despite being referenced in setup text. Create `.env.local` yourself using the tables below. Every value here is a placeholder.

### Client — `VITE_*`, exposed to the browser bundle

| Variable | Required | Read by | Purpose |
|---|---|---|---|
| `VITE_RETELL_API_KEY` | No | `aiService.js` | Retell voice-interview key |
| `VITE_RETELL_AGENT_ID` | No | `aiService.js` | English interview agent id |
| `VITE_RETELL_HINDI_AGENT_ID` | No | `aiService.js` | Hinglish interview agent id |
| `VITE_GITHUB_TOKEN` | No | `githubService.js` | Optional PAT for higher GitHub API rate limits |
| `VITE_AV_CDN_BASE` | No | `avArchiveService.js` | Base URL for archive images on R2 |
| `VITE_GEMINI_API_KEY` | No | Legacy | Per-user keys stored through the provider registry are the current path |

> [!WARNING]
> `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are **not** read from the environment by the client. They are hardcoded in `src/config/supabaseClient.js`. To point a fork at your own project, edit that file.

### Server — Vercel functions, `process.env.*`

| Variable | Read by | Purpose |
|---|---|---|
| `JDOODLE_CLIENT_ID`, `JDOODLE_CLIENT_SECRET` | `api/execute.js`, `api/_lib/leetcodeJudge.js` | Default code-execution provider |
| `HACKEREARTH_CLIENT_SECRET` | `api/execute.js`, `api/_lib/hackerearth.js` | Alternate execution provider |
| `GEMINI_API_KEY` | `api/gemini-live-token.js`, `api/copilot.js` | Live-session tokens and copilot fallback |
| `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET_NAME` | `api/blob.js`, `api/upload.js` | Editor and IDE object storage |
| `CF_ACCOUNT_ID`, `CF_KV_NAMESPACE_ID`, `CF_API_TOKEN` | `api/prices.js` | Cloudflare KV pricing cache |
| `YOUTUBE_API_KEY` | `api/youtube-playlist.js` | Playlist import |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | `api/exam.js`, `api/graphql.js`, `api/copilot.js` | RLS-bypassing cache writes |

### Supabase edge secrets

Set with `supabase secrets set NAME=value`: `GEMINI_API_KEY` (`ai-chat`), `NOTION_API_KEY` (`notion-fetch`), `TAVILY_API_KEY` (`web-search`).

### Build and upload only

`R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` — used by `scripts/check_r2.mjs` and the two archive upload scripts. Never read at app runtime.

## Verifying the setup

**The app boots.** Open `http://localhost:5173/`. You should get the landing page, then a sign-in screen.

![The sign-in screen. Learner and Admin are separate modes.](/docs-shots/sign-in.jpg)

**A serverless function answers.** With the dev server running:

```bash
curl -X POST http://localhost:5173/api/execute \
  -H "Content-Type: application/json" \
  -d '{"script":"print(1+1)","language":"python3"}'
```

Without JDoodle credentials this returns a provider error rather than a result — that is still a working round-trip through `apiMiddleware()`. A `404` means the middleware did not pick the request up.

**Static content resolves.** `curl -I http://localhost:5173/project-docs/overview.md` should return `200` with markdown, not HTML.

**An edge function responds.** From the browser console, once signed in:

```javascript
const { data, error } = await supabase.functions.invoke('web-search', { body: { query: 'test' } });
console.log(data, error);
```

## Windows

Run a fresh `npm install` on the machine — do not copy `node_modules` across platforms. Then `npm run build:reference` and `npm run dev` as above. `WINDOWS_SETUP.md` at the repo root carries the platform-specific notes.

## Production build

```bash
npm run build     # the full generator chain, then vite build
npm run preview   # serve dist/ locally
```

## Desktop

```bash
npm run desktop:dev     # Tauri dev window
npm run desktop:build   # native installer
```

The desktop app has no native Rust logic — it is a WebView around the same build. Anything OS-level would need to be added to `src-tauri/src/lib.rs`.
