# Troubleshooting

Every entry here comes from something actually present in the codebase — an error path, a guard, a comment, or a documented constraint.

## Dev server starts, then the app fails on a missing import

**Cause.** `src/data/referenceData.js` is generated, not committed. It is imported at module scope, so its absence is a hard failure rather than an empty panel.

**Check**

```bash
ls src/data/referenceData.js
```

**Fix**

```bash
npm run build:reference
```

## A `build:*` script fails immediately on a fresh clone

**Cause.** Its source directory is gitignored while its output is committed. `flow-design/` and `Git Visualizer/` are the two that fail outright; `dsanew/` makes `build:codelab` no-op silently instead.

**Fix.** Don't run them. `public/flow-design/`, `public/git-visualizer/`, `src/data/codelab/` and `api/_data/` already hold the built output, and production relies on those copies.

## `/api/*` returns 404 locally but works deployed

**Cause.** `apiMiddleware()` in `vite.config.js` reproduces the production rewrites separately from `vercel.json`. A path shape added to one and not the other works in exactly one environment.

**Check.** Look for the path prefix in both files. `/graphql`, `/api/copilot/*` and `/api/auth/*` are the existing special cases.

## An `api/*.js` handler 500s on every request

**Cause.** `package.json` sets `"type": "module"`. A `require` call is undefined at module load and takes the whole file down before your code runs. A relative import missing its `.js` extension does the same — Node's ESM resolver does not guess extensions.

**Check.** The Vercel function log shows a module-load error, not a request error.

## Vercel deploy fails on function count or bundle size

**Cause.** Either a thirteenth file directly under `api/`, or a large directory pulled into a function bundle.

**Fix.** Move shared code to `api/_lib/` — the underscore prefix keeps it from counting as a function. For size, check the `excludeFiles` glob in `vercel.json`; that is why the region allow-list was moved under `api/_lib/`.

## A signed-in user sees empty data

**Cause.** Row Level Security with no matching policy. Access control is entirely in Postgres, so a missing policy returns zero rows rather than an error.

**Check.** Confirm the table has RLS enabled *and* a policy for the operation. Note that several tables the client uses have no migration in this repo at all — `user_curriculum`, `profiles`, `quiz_metrics` and others were created directly against the project.

## An AI call fails or returns nothing

**Causes, in the order worth checking**

1. No credential stored for the selected provider. Keys are per-user in `AuthContext`, not environment variables.
2. Adapter mismatch — an OpenAI-compatible provider pointed at a non-compatible endpoint.
3. Structured output parsed directly. Model responses arrive fenced or truncated; use the `extractJSON` path in `aiService.js` rather than `JSON.parse`.

## Code execution returns a provider error

**Cause.** `JDOODLE_CLIENT_ID` / `JDOODLE_CLIENT_SECRET` unset, or `HACKEREARTH_CLIENT_SECRET` unset when `provider` is `hackerearth`.

**Expected responses.** `/api/leetcode-judge` returns `503` when the runner is not configured and `502` when the upstream execution fails — these are distinguishable on purpose.

## Code Lab: "Too many runs" or "Too many submissions"

**Cause.** Not a bug. `allowRequest()` rate-limits runs and submissions separately and returns `429` with a message naming which one.

## Code Lab: a problem cannot be submitted

**Cause.** `422` with "not judge-enabled" means the manifest exists but has no judge configuration. `404` means the `problemId` is not in `api/_data/`.

## Job Scout: the first request hangs for minutes

**Cause.** Documented behaviour. The Render free instance has a measured 286-second cold boot and sleeps after 15 minutes idle. `jobscout-keepwarm-worker/` pings it every 10 minutes so that boot never lands on a visitor.

**If it still happens.** Check the keep-warm worker is deployed and its schedule is active.

## Job Scout: the UI loads but its API calls fail cross-origin

**Cause.** `GRADIO_ROOT_PATH` is unset in Render. Gradio derives the API root from the `Host` header, and Vercel's external rewrite replaces `Host` with the destination's — so the browser is told to call the Render domain directly and hits the service's CORS rule.

**Fix.** Set `GRADIO_ROOT_PATH` to `https://<your-vercel-domain>/jobscout`.

## Documentation pages show "temporarily unavailable"

**Cause.** `fetchMarkdown()` refuses anything that looks like an HTML document, because Vite serves `index.html` for unknown paths and a CDN can serve an error page. Passing that to the renderer would display an HTML error page as prose.

**Check**

```bash
curl -I http://localhost:5173/project-docs/overview.md
```

Expect `200` and markdown. Getting HTML means the file is missing or the path is wrong.

## Two panels fight, or the wrong one opens

**Cause.** More than one view flag is true. The render chain in `App.jsx` is an ordered ternary, so whichever appears first wins silently.

**Fix.** Make sure the new destination is reset alongside every other flag in the reset callback and in `Sidebar.jsx`'s `handleNavClick`.

## A new sidebar item appears under "More tools"

**Cause.** No migration block in `resolveEffectiveLayout()`. Orphan ids fall back to "More tools" by design. It looks correct on a fresh profile and wrong for every existing user.

## Security: the admin password is in the source

`src/components/AuthInterface.jsx` compares submitted admin credentials against an email and password written literally in the file. In a public repository that password is readable by anyone.

**Do.** Rotate the password, and replace the client-side comparison with a server-side or RLS-backed role check — the `app_admins` table already exists for this.

**Note for local work.** In admin mode, when the real sign-in fails the code falls through to `adminSignInMock()`, which sets a local admin identity without a valid session. That is a useful offline development path, but it is also why the client-side check must not be the real gate.
