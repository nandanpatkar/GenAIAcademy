# GenAI Academy — Data Layer (Supabase) Performance Plan

**Companion to `PERFORMANCE_PLAN.md`**, which covers the client/bundle/render side.
**Date:** 2026-08-09
**Status: IMPLEMENTED (2026-08-09).** D5.1–D5.7 are all in the working tree. See
"Implementation status" below for what shipped, what changed shape, and the one
step that still needs a human (running the migration).

> ### Implementation status
>
> | Step | State | Notes |
> |---|---|---|
> | D5.1 ungate auth | done | `AuthContext.jsx` renders children unconditionally; session hydrates synchronously from `localStorage` via `readPersistedSession()` in `config/supabaseClient.js`. `loading` is exposed on the context for consumers that need a confirmed identity. |
> | D5.2 narrow selects | done | `AdminManagement` projects JSONB instead of `select("*")`; the registry export refetches full rows on click so its output is unchanged. |
> | D5.3 de-duplicate load | done | New `services/curriculumCache.js`; `ThemeContext` and `App.jsx` share one read. Distinguishes `error` from `missing` so a failed read can never seed defaults over real data. |
> | D5.4 split the blob | done | `appearance` moved to its own column, with a fallback to `paths_data->'appearance'` so it works before and after the migration runs. |
> | D5.5 bound Community | done | `active_chat_users` RPC with a bounded client fallback; `profiles` narrowed to `id, nickname, bio`. |
> | D5.6 indexes | **needs you** | Written to `supabase/migrations/20260809_perf_indexes_and_split.sql`. **Not applied** — run it against the project. |
> | D5.7 region | **needs you** | Still requires looking up the project's region in the dashboard. |
**Basis:** static analysis of `src/contexts/`, `src/App.jsx`, `src/components/Community/`, `src/services/`, and `supabase/migrations/`. No live query profiling was run — latency figures are marked *(estimate)* and should be confirmed against the Supabase dashboard's Query Performance page.

`PERFORMANCE_PLAN.md` correctly identifies the client-side causes of lag (single root Suspense boundary, 86 `useState` in one component, multi-MB eager data imports). It touches the database only at §2.7 and §3.5. This document covers what it does not: **the request pattern between the browser and Supabase**, which is the main cause of the *"buffers a lot"* and *"blank on load"* half of the symptom.

---

## D1. Measured facts — the load sequence

Reading `AuthContext.jsx`, `ThemeContext.jsx`, and `App.jsx` together, here is what happens between the user hitting the URL and seeing content:

| # | Step | Location | Blocking? |
|---|---|---|---|
| 1 | Entry JS downloads + parses (343 KB gzip) | — | yes |
| 2 | `supabase.auth.getSession()` | `AuthContext.jsx:180` | **yes — gates all render** |
| 3 | `setLoading(false)` | `AuthContext.jsx:198` | releases render |
| 4 | `fetchGlobalConfig()` — reads `user_curriculum` sentinel row | `AuthContext.jsx:155` | after 3 |
| 5 | `ThemeContext` reads `user_curriculum.paths_data` for this user | `ThemeContext.jsx:261` | parallel |
| 6 | `App.jsx` reads `user_curriculum.paths_data` for this user | `App.jsx:365` | parallel |
| 7 | Curriculum merge (~4 nested loops over the whole tree) | `App.jsx:379–416` | main thread |

### D1.1 The whole app is gated on a network round-trip

`src/contexts/AuthContext.jsx:297`:

```jsx
return (
  <AuthContext.Provider value={value}>
    {!loading && children}
  </AuthContext.Provider>
);
```

`loading` starts `true` and only clears when `supabase.auth.getSession()` resolves (`AuthContext.jsx:180–198`). Until then **`children` is `null`** — nothing below `AuthProvider` renders. That is the entire application, including the landing page and the shell.

`getSession()` is not always local. When the persisted access token is expired — which it is on any visit more than one hour after the last one — supabase-js performs a token refresh against `/auth/v1/token` before resolving. So a returning user's first paint waits on a full round-trip to the Supabase project *(estimate: 200–800 ms depending on region distance; more on a cold free-tier project)*.

**This is the single biggest cause of the "blank / buffering on open" symptom, and it is roughly a ten-line fix.** It is not covered in `PERFORMANCE_PLAN.md`.

### D1.2 The same row is read three times per load

`user_curriculum` is queried by three independent consumers on every load:

- `AuthContext.jsx:155` — sentinel row `00000000-…`, `select('paths_data')`
- `ThemeContext.jsx:261` — this user's row, `select('paths_data')`, used **only** to read `.appearance`
- `App.jsx:365` — this user's row, `select('paths_data')`, used for the curriculum

Steps 2 and 3 fetch the **identical row** and transfer the **entire `paths_data` JSONB blob** twice. The blob holds the merged curriculum for every path (`data/roadmap.js` composes `dsa_path` + 3 `aicxm_*` paths + `manual_path`), plus `videoIntelligence` video progress and notes, plus `appearance`, plus `onboarding`. A moderately active account's blob is realistically hundreds of KB to a few MB of JSON *(estimate — check with `select pg_column_size(paths_data) from user_curriculum;`)*.

`ThemeContext` downloads all of that to read a ~40-field theme object.

### D1.3 Every appearance change costs two round-trips and a full blob rewrite

`ThemeContext.jsx:311–325`, inside `updateAppearance`:

```js
const { data } = await supabase.from('user_curriculum').select('paths_data').eq('id', user.id).single();
const existing = data?.paths_data || {};
await supabase.from('user_curriculum').upsert({
  id: user.id,
  paths_data: { ...existing, appearance: next },
  updated_at: new Date().toISOString(),
});
```

Toggling dark mode: download the whole blob, spread it in JS, upload the whole blob. Two serial round-trips, two full transfers of the entire curriculum, to change one string.

Worse, this is a **read-modify-write race** against `App.jsx:457–483`, which upserts the whole `paths_data` on a 1.5 s debounce. If a user ticks a module and changes the theme within the same window, one write silently overwrites the other. This is a correctness bug, not just a performance one.

The same read-modify-write pattern appears again at `ThemeContext.jsx:343–355` and in `AuthContext.persistSidebarConfig` (`AuthContext.jsx:110–128`), whose own comment acknowledges the hazard: *"always rewrites the whole `paths_data` blob, so every field it knows about must be included or a concurrent save from the other admin surface would wipe it out."*

### D1.4 Write amplification on the curriculum

`App.jsx:457–483` (also `PERFORMANCE_PLAN.md` §2.7): every checkbox tick re-serialises and re-uploads the *entire* curriculum tree after 1.5 s. For a user working through a module list, that is one multi-hundred-KB `PUT` every ~2 seconds. On a slow uplink these queue up and contend with the reads the UI is waiting on — which is exactly what "buffers" feels like.

Postgres also rewrites the whole row on each update (JSONB has no partial update in place), and a large JSONB value is TOASTed — meaning each write touches the TOAST table too, and each read detoasts it.

---

## D2. Unbounded queries

19 `select('*')` call sites. Most are fine (single-row lookups by primary key). These are not:

| Location | Query | Problem |
|---|---|---|
| `Community.jsx:135` | `from('profiles').select('*')` | **No filter, no limit.** Fetches every profile row in the database on every Community mount. Grows linearly with your user count. |
| `Community.jsx:173` | `from('messages').select('user_email, user_id').not('user_email','is',null)` | **No limit.** Fetches every message ever sent, just to build a distinct list of emails for DM suggestions. Grows linearly with total message volume — this one will get bad fastest. |
| `Community.jsx:155` | `from('channels').select('id, group_id')` | No limit; acceptable while channel count is small, but unbounded by design. |
| `AdminManagement.jsx:58` | `from('user_curriculum').select('*')` | Selects `*`, which includes every user's **full `paths_data` blob**, for a list view. Should select `id, updated_at` only. |
| `BlogPage.jsx:49` | `select('*')` | Check for a `.limit()` / pagination; blog lists should page. |

Only two `.limit()` calls exist in the entire `src/` tree (`Community.jsx:237`, `:514`).

`Community.jsx:173` and `Community.jsx:135` run together in one `useEffect` on mount. On a database with any real message history, that single effect is a multi-megabyte download before the chat renders.

---

## D3. Indexes

`supabase/migrations/` contains six migrations covering `projects`, `exam_bank`, `editor_snapshots`, `module_notes`, `shared_labs`. Those files define indexes properly:

```sql
idx_projects_user_id       ON projects (user_id, updated_at DESC)
idx_project_files_project  ON project_files (project_id, file_path)
idx_file_versions_file_id  ON file_versions (file_id, version DESC)
module_notes_user_updated_at_idx
editor_snapshots_user_updated_at_idx
shared_labs_updated_at_idx
```

But there is **no migration for any of the tables the main app actually reads on load**: `user_curriculum`, `profiles`, `messages`, `channels`, `community_groups`, `community_members`, `quiz_metrics`, `user_links`. These were created through the dashboard, so their index state is unknown and unversioned.

The ones that matter, given the queries above:

```sql
-- messages: every channel read filters + orders on these
create index if not exists messages_channel_created_idx
  on messages (channel_id, created_at desc);

-- channels: fetched per active group
create index if not exists channels_group_idx
  on channels (group_id, created_at);

-- community_members: two different access paths
create index if not exists community_members_user_idx  on community_members (user_id);
create index if not exists community_members_group_idx on community_members (group_id);

-- quiz_metrics: QuizApp.jsx:74 filters by user_id, orders by created_at desc
create index if not exists quiz_metrics_user_created_idx
  on quiz_metrics (user_id, created_at desc);
```

`user_curriculum` and `profiles` are keyed by `id` and read by primary key, so they are already covered by the PK index — their problem is payload size (D1.2), not lookup cost.

### D3.1 RLS policy cost

Check the policies on `messages`, `profiles`, and `community_members`. The common mistake is:

```sql
using (auth.uid() = user_id)          -- re-evaluates auth.uid() per row
```

versus:

```sql
using ((select auth.uid()) = user_id)  -- evaluated once, as an InitPlan
```

The `(select …)` wrapper lets the planner hoist the call out of the per-row filter. On the unbounded scans in D2 this is the difference between one function call and one per row. Verify with `explain analyze` in the SQL editor.

---

## D4. Region

`.vercel/project.json` sets no `regions`, and `vercel.json` has no `regions` key — so serverless functions under `api/` run in Vercel's default region (`iad1`, Washington DC).

The Supabase project is `twcsujjshudwgpihkwyz.supabase.co`; its region is not recorded in the repo. **Check it in the Supabase dashboard.** If the project sits in, say, `ap-south-1` (Mumbai) while functions run in `iad1`, every function-mediated query pays ~200 ms of transatlantic round-trip, and chained queries multiply it.

Note this affects the `api/**` functions only — the browser talks to Supabase directly for everything in `src/`, so for those calls what matters is the distance from **your users** to the Supabase region, which no config change fixes. If your users are concentrated in one region and the project is in another, migrating the Supabase project is the only real fix.

---

## D5. Implementation plan

Ordered by impact per hour. **D5.1 is a ~10-line change and should ship today.**

### D5.1 Stop gating the app on auth — *30 minutes, highest impact*

`src/contexts/AuthContext.jsx:297`. Render children immediately and expose `loading` through context so the few components that genuinely need a resolved session can wait on it themselves:

```jsx
return (
  <AuthContext.Provider value={{ ...value, loading }}>
    {children}
  </AuthContext.Provider>
);
```

Then in the handful of places that must not render for an unknown user (the signed-in shell, admin surfaces), branch on `loading` locally and show a skeleton. The landing page, theme, and static shell paint immediately.

Pair it with an optimistic hydrate so the shell knows who the user probably is before the network answers — supabase-js already persists the session in `localStorage` under `sb-<ref>-auth-token`:

```jsx
const [user, setUser] = useState(() => {
  try {
    const raw = localStorage.getItem(`sb-twcsujjshudwgpihkwyz-auth-token`);
    return raw ? JSON.parse(raw)?.user ?? null : null;
  } catch { return null; }
});
```

`onAuthStateChange` (already wired at `AuthContext.jsx:207`) corrects it a moment later if the token turned out to be invalid. **Treat this value as a UI hint only — never as an authorisation decision.** All real authorisation must stay in RLS policies server-side, which is where it already is.

*Expected: removes a full round-trip from the critical path of every single page load. This is the "buffering on open" fix.*

### D5.2 Read only what you need — *1 hour*

Postgres can project into JSONB, so stop shipping the whole blob to read one key.

`ThemeContext.jsx:261`:

```js
const { data } = await supabase
  .from('user_curriculum')
  .select('appearance:paths_data->appearance')
  .eq('id', user.id)
  .maybeSingle();
```

`AdminManagement.jsx:58` — never select `*` from `user_curriculum` for a list:

```js
.select('id, updated_at')
```

Also replace `.single()` with `.maybeSingle()` at `App.jsx:368` and `ThemeContext.jsx:264`. `.single()` returns an error (`PGRST116`) when a row is absent, which both call sites then have to special-case; `maybeSingle()` returns `null` cleanly.

*Expected: removes one full-blob download from every load.*

### D5.3 De-duplicate the load — *2 hours*

Fetch `user_curriculum` **once**, in one place, and let `ThemeContext` and `App` read from that. Since `ThemeProvider` is already nested inside `AuthProvider` (`App.jsx:1951–1961`), the natural home is a single `useCurriculum()` provider between them that owns the row, or a small promise-cache module:

```js
// src/services/curriculumCache.js
let inflight = null;
export const loadCurriculum = (userId) => {
  if (!inflight) inflight = supabase.from('user_curriculum')
    .select('paths_data').eq('id', userId).maybeSingle();
  return inflight;
};
export const resetCurriculumCache = () => { inflight = null; };
```

Call `resetCurriculumCache()` on sign-out (`AuthContext.signOut`) so the next user doesn't inherit the previous one's promise.

*Expected: 3 queries on load → 2 (the sentinel config row can stay separate, or be batched with an `.in('id', [userId, SENTINEL])` single query → 1).*

### D5.4 Split writes off the mega-blob — *half a day, fixes a real bug too*

The `paths_data` JSONB blob is doing four unrelated jobs: curriculum progress, appearance, onboarding state, and video progress. Three different components read-modify-write it concurrently, so they overwrite each other (D1.3).

Minimum viable fix — move appearance to its own column, which removes both the write race and the download:

```sql
alter table user_curriculum add column if not exists appearance jsonb;
```

Then `ThemeContext.updateAppearance` becomes a single write with no read first:

```js
await supabase.from('user_curriculum')
  .update({ appearance: next })
  .eq('id', user.id);
```

Do the same for `onboarding` and, if the volume justifies it, `video_progress`. Each column extracted is one fewer writer racing on the blob.

The full fix — `PERFORMANCE_PLAN.md` §3.5's `curriculum_progress` table keyed by `(user_id, module_id)` — is the right destination, but it needs a migration and a backfill. Schedule it separately; the column split above gets most of the benefit for a fraction of the risk.

### D5.5 Bound the Community queries — *2 hours*

`Community.jsx:173` — the "every message ever sent" query. Replace the client-side distinct with a server-side one. Add an RPC:

```sql
create or replace function active_chat_users(limit_n int default 100)
returns table (user_email text, user_id uuid)
language sql stable security invoker as $$
  select distinct on (user_email) user_email, user_id
  from messages
  where user_email is not null
  order by user_email, created_at desc
  limit limit_n;
$$;
```

Called as `supabase.rpc('active_chat_users')`. `security invoker` keeps RLS applied to the caller.

`Community.jsx:135` — `profiles.select('*')` — either page it, or (better) fetch only the profiles actually referenced by the loaded messages:

```js
.select('id, nickname, bio')
.in('id', [...new Set(messages.map(m => m.user_id))])
```

*Expected: Community mount goes from "download the whole chat history" to two bounded queries.*

### D5.6 Add the missing indexes and version the schema — *2 hours*

Write one migration containing the `create index if not exists` statements from D3, plus `create table if not exists` definitions for the dashboard-created tables so the schema is finally in version control. Run `explain analyze` on the `messages` channel query before and after.

While there: audit RLS policies for the `(select auth.uid())` form (D3.1).

### D5.7 Confirm the region — *15 minutes*

Look up the Supabase project's region in the dashboard. If it does not match where your users are, that is a migration decision worth making before optimising anything else at the query level. If it differs from `iad1`, pin the Vercel functions to match:

```json
{ "regions": ["bom1"] }
```

in `vercel.json`, substituting the region that matches Supabase.

---

## D6. Sequencing

| Step | Effort | Risk | Notes |
|---|---|---|---|
| D5.1 — ungate auth | 30 min | Low | **Do first.** Biggest single win on the reported symptom. |
| D5.2 — narrow selects | 1 h | Low | Mechanical. |
| D5.7 — check region | 15 min | None | Diagnostic; do it while D5.1 deploys. |
| D5.3 — de-duplicate load | 2 h | Low | |
| D5.6 — indexes + migration | 2 h | Low | Independent of the client work. |
| D5.5 — bound Community | 2 h | Medium | Touches chat behaviour; verify DM suggestions still populate. |
| D5.4 — split the blob | 0.5 d | **Medium** | Schema change. Fixes a live data-loss race. Do on a branch. |

D5.1, D5.2, D5.6 and D5.7 are independent of everything in `PERFORMANCE_PLAN.md` and can ship in parallel with its Phase 1.

---

## D7. How to verify

Before and after each step:

1. **Supabase Dashboard → Reports → Query Performance.** Sort by total time. The `user_curriculum` selects and the `messages` scan should be visible at the top today; they should drop off after D5.2/D5.5.
2. **Blob size:** `select id, pg_size_pretty(pg_column_size(paths_data)::bigint) from user_curriculum order by pg_column_size(paths_data) desc limit 10;` — this tells you how much D1.2 and D1.4 actually cost. Re-run after D5.4.
3. **DevTools Network, filtered to `supabase.co`, empty cache, hard reload.** Count requests and total transfer before first paint. Today: expect 3 `user_curriculum` hits plus an auth call. Target after D5.1–D5.3: one auth call that does not block paint, one curriculum read.
4. **`explain (analyze, buffers)`** on the `messages` channel query in the SQL editor, before and after D5.6. Look for `Seq Scan` becoming `Index Scan`.
5. **The race in D1.3:** in two tabs, tick a module in one and change the theme in the other within ~2 s. Reload. Today one change is lost. After D5.4 both should persist.
