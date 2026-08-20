# Data & persistence

State lives in three places, and knowing which one owns a piece of data tells you where to look when it is wrong.

| Store | Owns | Survives |
|---|---|---|
| React context | Session, theme, open projects | Until reload |
| `localStorage` | View flags, sidebar layout, per-user favourites and drafts | Reload, same browser |
| Supabase Postgres | Curriculum progress, IDE projects, notes, community, exam cache | Everywhere, per user |

## Supabase client

`src/config/supabaseClient.js` creates the client and exports two helpers alongside it.

> [!WARNING]
> The project URL and anon key are **hardcoded in this file**, not read from `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`. An anon key is designed to be public and is safe to ship — the protection is Row Level Security, not secrecy — but it does mean forking the app requires editing this source file directly.

### The optimistic session read

`readPersistedSession()` reads the session `supabase-js` has already written to `localStorage` and returns it synchronously. The reason is a performance one, recorded in the file itself: `supabase.auth.getSession()` returns a promise and, once the access token has expired, performs a refresh round-trip before resolving. Blocking first render on that made every page load wait on the network.

The rule that comes with it is absolute, and the code says so:

> The result is a UI hint ONLY — it is unverified client-side data and must never be used for an authorisation decision. Every real access check stays in RLS.

The helper also handles two shapes `supabase-js` has used over versions: a base64-prefixed payload, and a session wrapped as `{ currentSession }`.

## Auth

`src/contexts/AuthContext.jsx` provides `session`, `user`, `loading`, `isAdmin`, and the sign-in helpers. `loading` stays true until `getSession()` resolves; because `user` is populated optimistically, most consumers can ignore it, and it exists for the few that must not act on an unconfirmed identity.

Admin state is mirrored into `localStorage` under `genai_isAdmin`, and admin-gated sidebar items are filtered through `resolveItemVisibility`.

> [!CAUTION]
> `src/components/AuthInterface.jsx` compares the submitted admin credentials against an email and password written literally in the source. Anyone reading this repository can read that password. Treat it as compromised: rotate it, and move the check to a server-side or RLS-backed role rather than a client-side string comparison. See [Troubleshooting](doc:troubleshooting) for the local-development consequence.

## Schema

Migrations live in `supabase/migrations/`, named by date. Tables created there:

| Table | Purpose |
|---|---|
| `projects`, `project_files`, `file_versions` | Cloud IDE workspaces, files and version history |
| `module_notes` | Per-module learner notes |
| `editor_snapshots` | Saved state for the embedded editor |
| `shared_labs` | Shared lab configurations |
| `blog_favorites` | Saved blog posts |
| `user_custom_resources` | Learner-added resources |
| `cached_exam_questions`, `cached_exam_resources` | Server-side exam-bank cache |
| `app_admins` | Admin allow-list |

> [!NOTE]
> The migrations directory does **not** cover the whole schema. The client also reads and writes `user_curriculum`, `profiles`, `user_links`, `quiz_sessions`, `user_quizzes`, `quiz_metrics`, `blogs`, `community_members`, `community_groups`, `channels` and `messages`, none of which have a migration here. Those tables were created directly against the project and must be recreated by hand when forking. This is a real gap, not an omission in this page.

## Row Level Security

Every migration that creates a user-scoped table also enables RLS and defines policies in the same file. That pairing is the pattern to copy: a table without a policy is unreadable rather than public, so a missing policy shows up as empty results for a signed-in user rather than as a leak.

`20260809_perf_indexes_and_split.sql` adds indexes and splits a table for performance; `20260815_global_config_rls.sql` tightens policy on global configuration. The reasoning behind the performance work is recorded in `SUPABASE_PERFORMANCE_PLAN.md` at the repo root.

Server-side handlers that must bypass RLS — `api/exam.js`, `api/graphql.js`, `api/copilot.js` — use `SUPABASE_SERVICE_ROLE_KEY`, falling back to the anon key if it is unset.

## Local stores

`src/store/` holds four small `localStorage`-backed stores: `customProblemsStore`, `customResourcesStore`, `favoriteBlogsStore` and `savedStudyStore`. They are plain modules, not context providers, and they exist for data that is per-device rather than per-account.

Separately, `App.jsx` persists the full set of view flags under `genai_active_views`, and `curriculumCache.js` caches the curriculum row so a reload does not refetch it.

## Curriculum loading

The default curriculum (`PATHS`) is roughly 600 KB and was the largest single item in the entry chunk, even though every use of it happens inside an async function that runs after auth resolves. It is now loaded on demand through a shared promise so its three call sites fetch it once:

```javascript
let pathsModulePromise = null;
const loadDefaultPaths = () => {
  if (!pathsModulePromise) {
    pathsModulePromise = import("./data/roadmap").then((m) => m.PATHS);
  }
  return pathsModulePromise;
};
```

This is the general pattern for heavy data in this codebase — see [Content pipeline](doc:content-pipeline).
