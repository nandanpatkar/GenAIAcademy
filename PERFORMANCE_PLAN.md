# GenAI Academy — Performance & Memory Remediation Plan

**Target app:** `genai-roadmap-src` (the `genai-roadmap` Vite + React 18 SPA).
**Date:** 2026-08-09
**Basis:** static analysis of `src/`, `vite.config.js`, `index.html`, `vercel.json`, and the committed `dist/` build (`Aug 9 00:03`). No browser profiling session was run — every number below is measured from files on disk; conclusions marked *(inferred)* are architectural reasoning, not measurements.

> **Note on hosting.** The repo contains `vercel.json` and a `.vercel/` directory, so the deployment config I analyzed is Vercel's. If the live site is actually on a different host, everything in Phases 1–4 still applies unchanged (it is all app-side); only §5 (Delivery/host settings) needs its equivalents looked up for that platform.

> ### Implementation status (2026-08-09)
>
> Phases 1, 2, 4 and 5 are implemented; Phase 3 is partially implemented. Measured on a real `vite build`:
>
> | | Before | After |
> |---|---|---|
> | Entry JS | 1,304 KB raw / 343 KB gzip | **116 KB raw / 37 KB gzip** |
> | Full critical path (entry + static imports + CSS) | 1,450 KB / 378 KB gzip | **736 KB / 206 KB gzip** |
> | Bundled images | 7.1 MB | **88 KB** |
> | Palette search data | 13.4 MB | **137 KB** |
>
> | Phase | State | Notes |
> |---|---|---|
> | 1.1 per-view Suspense | done | Boundary inside `<main>`, plus `OverlayBoundary` for every lazy modal/palette/walkthrough and a dedicated one for the sidebar — all of which previously unwound to root. |
> | 1.2 transitions | done | New `useViewState` hook wraps 47 navigation flags in `startTransition`. Deliberately NOT applied to `showModuleDetails` (a mobile tap toggle) or any input state. |
> | 1.3 gate the palette | done | Mounted only while open; Cmd+K moved into the shell. |
> | 2.1 data modules → fetch | done | `blogData` deleted; `PATHS` (~600 KB) made a dynamic import — the single biggest entry win. `manualData` pushed out of the entry via a pre-built `manual_path.generated.json`. |
> | 2.2 split `global.css` | **not done** | See "Deliberately left undone" below. |
> | 2.3 font chain | done | The chained `@import` is gone; all four families load in one `<link>`. |
> | 2.4 manualChunks | done | react/supabase/framer-motion split out. **An `icons` chunk was tried and reverted** — grouping lucide-react defeated per-chunk tree-shaking and put ~900 KB of unused icons on the startup path. |
> | 2.5 Monaco out of entry | done | `config/monacoLoader.js`, called by the 8 components that mount an editor. |
> | 2.6 images | done | 4 bundled images → WebP at display resolution: 7.1 MB → 88 KB. |
> | 3.4 memoize sidebar | done | `React.memo` on both sidebars; the 4 inline-arrow props and `closeAllPanels` are now `useCallback`-stable, so the memo actually holds. |
> | 3.1/3.2/3.3/3.5 | **not done** | See below. |
> | 4.1 WebGL teardown | done | New `utils/disposeThreeScene.js`. None of the four three.js surfaces released their GL context; the two `ogl` surfaces already did it correctly. |
> | 4.2 interview JSON | done | `scripts/build_interview_index.mjs` emits a 137 KB titles-only manifest for the palette. |
> | 4.3 gate PGlite / 4.4 memory CI | **not done** | |
> | 5.1 cache headers | done | |
> | 5.2 verify Brotli / 5.3 shrink `dist/` | **needs you** | Both require checking the live deployment. |
>
> **Deliberately left undone**, because each needs a running browser to verify and
> the risk of a blind change outweighs the remaining gain:
> **§2.2** (hand-splitting 185 KB of CSS invites visual regressions for ~27 KB gzip),
> **§3.1–3.3** (collapsing ~90 booleans into a router is the multi-day refactor this
> plan itself says to do last, on a branch), **§3.5** (incremental curriculum saves —
> needs the `curriculum_progress` schema change and a backfill), and **§4.3/4.4**.
>
> **Scope.** This document covers the client: bundle, render architecture, and memory. The **Supabase request pattern** is covered separately in **[`SUPABASE_PERFORMANCE_PLAN.md`](SUPABASE_PERFORMANCE_PLAN.md)** — most importantly the fact that `AuthContext.jsx:297` gates the entire app's first render on a network round-trip, which is the other half of the reported "buffering on open" symptom and is a ~30-minute fix. That document's steps D5.1, D5.2, D5.6 and D5.7 are independent of everything here and can ship alongside Phase 1.

---

## 1. Measured facts

### Build output

| Item | Size |
|---|---|
| `dist/` total | **626 MB** |
| `dist/assets/` (app chunks) | 57 MB across **932 files** |
| Entry JS `index-DV5P_u8p.js` | **1,304 KB** raw / **343 KB** gzip |
| Entry CSS `index-1U98-yHW.css` | **146 KB** raw / **26 KB** gzip |
| All CSS in `assets/` | 1.1 MB |
| `dist/data/interview-prep.json` | **14.1 MB** |

### Largest single assets

| Asset | Size | Pulled in by |
|---|---|---|
| `pglite-*.wasm` | 10.1 MB | `@electric-sql/pglite` (SQL Lab) |
| `pglite-*.data` | 6.3 MB | same |
| `GenAIPlayground2-*.js` | 4.8 MB | `pages/playground2` |
| `blogData-*.js` | **2.9 MB** | **`components/FeatureHome.jsx:9`** ← a home screen |
| `quantom_hacker-*.png` | 3.0 MB | unoptimized PNG |
| `syntax_sage-*.png` | 2.2 MB | unoptimized PNG |
| `kubestellar-*.svg` | 1.8 MB | unoptimized SVG |
| `runtine_rouge-*.png` | 1.7 MB | unoptimized PNG |
| `atlantis-*.svg` | 1.0 MB | unoptimized SVG |
| `mermaid.core-*.js` | 595 KB | mermaid |
| `three.module-*.js` | 548 KB | three.js |
| `cytoscape.esm-*.js` | 444 KB | mermaid dependency |

### Static sub-apps shipped inside `dist/`

`editor/` 235 MB · `agentcore-samples/` 108 MB · `langchain/` 89 MB · `flow-design/` 37 MB · `guides/` 18 MB · `agentcore/` 18 MB · `data/` 13 MB · `strands/` 12 MB · `uploads/` 9.3 MB · `labs/` 7.1 MB.

These are separate pre-built apps copied into `public/`. They do **not** load on the main route, so they don't hurt first paint — but they are why deploys are slow, why the build is 626 MB, and they carry their own unoptimized media (`public/flow-design/readme/*.png` alone is ~13 MB of screenshots that ship to production for no user-facing reason).

### Source-level facts

| Fact | Location |
|---|---|
| `App.jsx` is **1,962 lines / 101 KB** — one component | `src/App.jsx` |
| **86 `useState` calls** in that one component | `src/App.jsx` |
| **Exactly one `<Suspense>` boundary**, wrapping the entire app | `src/App.jsx:1954` |
| ~90 `showX` boolean flags drilled into the sidebar as props | `src/App.jsx:1405–1477` |
| **2 of 153** component files use `React.memo` | `src/components`, `src/pages` |
| `src/data/` is **8.2 MB** of JS modules | `src/data/` |
| `src/styles/` is **1.1 MB**, `global.css` alone is **185 KB** | `src/styles/global.css` |
| A **second** Google Fonts `@import` inside `global.css:1` | `src/styles/global.css:1` |
| Whole curriculum blob upserted to Supabase on every edit | `src/App.jsx:457–483` |
| Monaco configured to load from `cdn.jsdelivr.net` in the entry file | `src/main.jsx:1–9` |

---

## 2. Why it is slow

### 2.1 The single root `<Suspense>` boundary — the biggest cause of *"lags"*

`src/App.jsx:1951–1961`:

```jsx
export default function App() {
  return (
    <AuthProvider><ThemeProvider>
      <React.Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg, #0b1020)" }} />}>
        <MainApp />
      </React.Suspense>
    </ThemeProvider></AuthProvider>
  );
}
```

There are **~95 `React.lazy()` components** and **one** boundary for all of them (plus a second inline one at `App.jsx:1531` for `GenAIPlayground2` only).

Every navigation is a plain `setState` on a `showX` flag, not a transition. When that flag flips to a lazy component whose chunk isn't loaded yet, React suspends — and with no nearer boundary, it unwinds to the **root** fallback: a blank coloured `<div>`. So clicking any sidebar item does this:

1. Entire UI is replaced by a blank screen.
2. Chunk downloads (some are 500 KB–4.8 MB).
3. The **whole tree remounts** — sidebar, header, providers' children, everything.
4. All component-local state below the boundary is destroyed and rebuilt.

That is precisely the "feels slow and sometimes lags" symptom: a full-app white flash and remount on every click. *(Inferred from the code structure — verifiable in one click with the React DevTools Profiler.)*

### 2.2 One component owns all state, so everything re-renders

86 `useState` hooks live in `MainApp`. `MainApp` also renders the sidebar (`SidebarModern`, 59 KB source / 62 KB chunk), the header, and the active view. Since React re-renders a component and its children on any state change, **every** toggle, hover flag, search keystroke, and modal open re-renders the entire application tree.

Two things turn that from "wasteful" into "janky":

- **No memoization.** 2 out of 153 components use `React.memo`. Nothing stops the cascade.
- **Memoization wouldn't work anyway**, because props are inline arrows and object literals recreated every render:
  ```jsx
  setActivePath={p => { setActivePath(p); closeAllPanels(); }}   // App.jsx:1407
  ```
  A new function identity every render defeats `React.memo` on the child.

The sidebar receives ~90 flag/setter pairs. Every one of them is re-evaluated and re-diffed on every state change anywhere in the app.

### 2.3 Home screens eagerly import megabytes of content data

```
components/FeatureHome.jsx:9      import { CHRONOLOGICAL_DB } from "../data/blogData";       // 3.3 MB source → 2.9 MB chunk
components/HomeDashboard.jsx:10   import { MANUAL_STRUCTURE } from "../data/manualData";     // 866 KB
components/Home2Dashboard.jsx:7   import { MANUAL_STRUCTURE } from "../data/manualData";     // 866 KB
```

These are **home screens** — among the first things a user sees. The lazy-loading of `FeatureHome` is real, but the moment it loads it drags in a 2.9 MB JSON-as-JS chunk that must be downloaded, parsed, and turned into live JS objects before the screen paints. Static ESM imports cannot be tree-shaken here because the data is a single exported object.

### 2.4 The entry bundle is 343 KB gzip before any feature loads

`dist/assets/index-DV5P_u8p.js` (1.3 MB raw / 343 KB gzip) contains, per string-signature scan: Supabase client, Monaco's loader, lucide-react icons, Prism, framer-motion's animation runtime pulled by `AnimatePresence` in `App.jsx:18`. All of it must be parsed and executed before the first pixel.

`build.modulePreload: false` in `vite.config.js` was set deliberately (the comment explains why) but has a cost: lazy chunks are discovered only *after* the entry script executes, so every navigation pays a fresh serial round-trip instead of a preloaded one.

### 2.5 Render-blocking CSS and a chained font request

- `index.html` loads a Google Fonts stylesheet (Inter + Space Grotesk).
- `src/styles/global.css:1` contains **a second** `@import url('https://fonts.googleapis.com/...Syne...DM+Mono...')`.

A CSS `@import` inside a stylesheet is a **chained** request: the browser must download `index-1U98-yHW.css` (146 KB), parse line 1, *then* start a fresh connection to Google Fonts, *then* download font files. Nothing paints until that chain finishes. The `preconnect` hints in `index.html` don't help the second request because it's discovered too late.

The 146 KB entry CSS is itself mostly unused on any given screen — it's `global.css` (185 KB source) plus everything imported eagerly.

### 2.6 No router

Navigation is `showX` booleans in React state, persisted to `localStorage` on every change (`App.jsx:626–650`). Consequences:

- No URL-based code splitting — the bundler cannot know what a given entry point needs.
- No browser back/forward, no deep links, no bfcache.
- **The page never reloads.** In a normal multi-page app, navigation frees memory. Here, a session accumulates everything it has ever touched until the tab is closed. This is the mechanism behind §3.

### 2.7 Data sync writes the whole curriculum on every edit

`App.jsx:457–483` debounces 1.5 s, then `upsert`s the **entire** `paths_data` blob. Every checkbox tick re-serializes and re-uploads the full curriculum tree. Combined with `App.jsx:485+`, each update also deep-spreads the whole tree to create a new object.

---

## 3. Why it consumes so much memory

### 3.1 Module-scope data is never garbage collected

ES module bindings live for the lifetime of the page. Once a chunk is imported, its data is permanently reachable:

| Module | Source size | Retained after first visit |
|---|---|---|
| `data/blogData.js` | 3.3 MB | forever |
| `data/agentcoreSamplesData.js` | 877 KB | forever |
| `data/manualData.js` | 866 KB | forever |
| `data/langchainDocsData.js` | 681 KB | forever |
| `data/agentcoreData.js` | 252 KB | forever |
| `data/strandsDocsData.js` | 250 KB | forever |

Closing the panel unmounts the component but does **not** release the data. As established in §2.6, there is no page reload to reset this. Memory is monotonically increasing across a session.

Also note: JS objects are considerably larger in heap than their JSON source — strings, object headers, and hidden-class overhead typically multiply the on-disk size. A 3.3 MB data module is not 3.3 MB of heap.

### 3.2 `interview-prep.json` — 14 MB fetched and parsed into the heap

`components/GlobalSearchPalette.jsx:30` and `components/InterviewPrep.jsx:22` both fetch `/data/interview-prep.json` (**14.1 MB**). It is parsed into a live JS object graph and held.

The aggravating factor: **`GlobalSearchPalette` is rendered unconditionally** at `App.jsx:1377`, outside every conditional. It is mounted for the entire session on every screen. The comment in `utils/buildSearchIndex.js:28–31` correctly identifies this file as too big for the search index and defers it — but the deferral is only until the palette is first opened, after which it is resident permanently.

### 3.3 PGlite — a full Postgres compiled to WASM, in the tab

`pglite-*.wasm` (10.1 MB) + `pglite-*.data` (6.3 MB) = **16.4 MB** of WASM payload for the SQL Lab. WebAssembly linear memory **grows but never shrinks** — once allocated, the memory is not returned to the OS for the tab's lifetime. Opening the SQL Lab once costs tens of megabytes for the rest of the session.

### 3.4 Six WebGL surfaces with unverified teardown

`three` / `ogl` are used in `components/Orb.jsx`, `VoiceOrb3D.jsx`, `Home2Voyage.jsx`, `KnowledgeGalaxy.jsx`, `pages/HomePage3.jsx`, `pages/roadmap/Roadmap3.jsx`. I count 12 `dispose()` calls across all component files combined.

WebGL geometries, materials, textures, and render targets are **not** garbage collected — they are GPU-side handles that require explicit `.dispose()` and `renderer.forceContextLoss()`. Browsers also cap live WebGL contexts (typically ~16); exceeding it silently kills the oldest context. Given six surfaces, a `<canvas>`-per-mount pattern, and the root-Suspense remount behaviour from §2.1 causing **repeated** mounts, this is a strong leak candidate. *(Inferred — needs a heap-snapshot pass to confirm per component; see §7.)*

### 3.5 Curriculum state churn

`pathsData` holds the merged curriculum in root state. Every mutation (`App.jsx:485+` and similar) deep-spreads the whole tree, allocating a full new object graph and orphaning the old one. At the same time the merge logic at `App.jsx:379–416` builds several intermediate copies (defaults, saved, merged, plus `searchItems` derived from it). Frequent large short-lived allocations mean frequent major GC pauses — which the user experiences as intermittent stutter, matching the reported "sometimes lags".

---

## 4. What is *not* the problem

Worth stating so effort isn't misdirected:

- **Lazy loading is already in place and correct in principle.** ~95 `React.lazy()` calls in `App.jsx:24–100`. The splitting works; it's the missing Suspense boundaries and the eager data imports that undo the benefit.
- **`buildSearchIndex` is properly memoized** (`App.jsx:969`) and deliberately excludes the 14 MB file.
- **The 626 MB `dist/` is not a first-paint problem.** Those static sub-apps are only served on their own routes. It is a build-time and deploy-time problem.

---

## 5. Implementation plan

Ordered by **user-visible improvement per hour of work**. Phase 1 alone should resolve most of the perceived lag.

### Phase 1 — Stop the full-app blank flash (highest impact, ~half a day)

**1.1 Add per-view Suspense boundaries.** Wrap each lazily-rendered view in its own boundary so a suspending view never unwinds past the shell. Extract the view-selection block (`App.jsx:1479–1900`) into a `<ViewRouter>` component and give it a single boundary *inside* `<main className="app-primary-content">`:

```jsx
<main className="app-primary-content">
  <Suspense fallback={<ViewSkeleton />}>
    <ViewRouter {...} />
  </Suspense>
</main>
```

The sidebar and header now sit outside the boundary and survive navigation. Replace the blank-div fallback with a skeleton matching the target layout.

**1.2 Mark navigation as a transition.** In the sidebar click handlers:

```jsx
const [isPending, startTransition] = useTransition();
const navigate = useCallback(fn => startTransition(fn), []);
```

React 18 keeps the *current* UI on screen while the next view's chunk loads, instead of showing a fallback at all. Use `isPending` for a subtle loading indicator. This is the single change that turns "blank flash" into "smooth".

**1.3 Stop rendering `GlobalSearchPalette` unconditionally.** `App.jsx:1377` mounts it on every screen. Gate it behind its open state so its chunk — and, more importantly, the 14 MB interview JSON it can pull in — is never touched unless the palette is actually opened.

*Expected: eliminates full-tree remounts and the white flash on every navigation.*

### Phase 2 — Cut the first-paint payload (~1 day)

**2.1 Convert heavy data modules to runtime `fetch`.** Move `blogData`, `manualData`, `agentcoreSamplesData`, `langchainDocsData`, `agentcoreData`, `strandsDocsData` out of `src/data/*.js` and into `public/data/*.json`, loaded with `fetch()` inside the component that needs them. Two wins: they leave the bundle graph entirely, and — critically for §3.1 — a `fetch` result is **garbage-collectable** when the component unmounts, whereas a module import is not.

Start with `blogData` (2.9 MB, imported by a home screen) — biggest single win in the whole plan.

**2.2 Split `global.css`.** 185 KB is loaded on every screen. Extract genuinely global rules (reset, tokens, layout primitives, theme variables) into a small `global.css`; move the rest into the per-component CSS files that already exist alongside them, so Vite ships them with their component's chunk.

**2.3 Fix the font chain.** Delete the `@import` at `src/styles/global.css:1` and move those families into the existing `<link>` in `index.html`, merged into the single Google Fonts request. Add `&display=swap` (already present) and consider self-hosting the four families as `woff2` in `public/fonts/` to remove the third-party round-trip entirely.

**2.4 Add `manualChunks`** in `vite.config.js` so React, Supabase, and lucide land in a stable vendor chunk that survives app-code deploys and stays cached across releases:

```js
build: {
  modulePreload: false,
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'supabase': ['@supabase/supabase-js'],
        'icons': ['lucide-react'],
      },
    },
  },
}
```

**2.5 Move the Monaco loader out of `main.jsx`.** `src/main.jsx:1–9` runs `loader.config()` at the app entry purely to set a CDN path, which forces `@monaco-editor/react` into the entry chunk. Move this configuration into the lazy module that first mounts an editor.

**2.6 Compress the images.** `quantom_hacker.png` (3.0 MB), `syntax_sage.png` (2.2 MB), `runtine_rouge.png` (1.7 MB) → WebP/AVIF at display resolution; expect 10–20× reduction. Run `svgo` on `kubestellar.svg` (1.8 MB) and `atlantis.svg` (1.0 MB). Delete `public/flow-design/readme/*.png` (~13 MB of README screenshots being served to users).

*Expected: entry payload down from 343 KB gzip; home screens no longer pull multi-MB data chunks.*

### Phase 3 — Fix the render architecture (~2–3 days)

**3.1 Collapse the ~90 booleans into one view value.** Replace `showCurriculumMap`, `showRoadmap2`, … with a single `activeView` string (plus a small `viewParams` object). This alone removes ~90 `useState` calls, ~90 prop pairs on the sidebar, the `closeAllPanels()` dance, and the `genai_active_views` localStorage blob at `App.jsx:626–650`.

**3.2 Introduce `react-router`.** Map each `activeView` to a URL. This gives real per-route code splitting, working back/forward, deep links, and bfcache. It is also the structural fix for §3.1's "memory never resets" — though note an SPA router still doesn't reload the page, so Phase 2.1 remains necessary.

**3.3 Move shared state into context, split by update frequency.** `pathsData` + progress in one context; UI/panel state in another. Consumers subscribe only to what they use, so a panel toggle stops re-rendering the curriculum tree. Keep them separate — a single mega-context reproduces the current problem.

**3.4 Memoize the sidebar.** Wrap `SidebarModern` in `React.memo` and wrap every handler passed to it in `useCallback`. Do these together — `React.memo` is a no-op while inline arrows like `App.jsx:1407` recreate props each render.

**3.5 Make curriculum saves incremental.** Replace the whole-blob upsert at `App.jsx:457–483` with a patch of just the changed module/subtopic row. Requires a schema change (a `curriculum_progress` table keyed by `(user_id, module_id)`), so schedule it as its own task.

*Expected: interactions stop triggering whole-tree re-renders; GC pressure from §3.5 drops sharply.*

### Phase 4 — Plug the memory leaks (~1–2 days)

**4.1 Audit every WebGL surface.** For each of the six files in §3.4, verify the unmount cleanup disposes geometries, materials, textures, and render targets, cancels the `requestAnimationFrame` loop, and calls `renderer.dispose()` + `forceContextLoss()`. Take a heap snapshot, mount/unmount each surface 5×, snapshot again — retained size should return to baseline.

**4.2 Never hold `interview-prep.json` in memory.** 14 MB of JSON is the wrong shape for this job. Either:
- **Preferred:** build a small search manifest at build time (titles + IDs + a lesson-file pointer, target < 200 KB) and fetch individual lesson files on demand; or
- **Interim:** cache the parsed blob in a module-level `WeakRef`/explicit cache that's cleared when the palette and Interview Prep are both closed.

**4.3 Gate PGlite behind an explicit user action.** 16.4 MB of WASM whose memory is never reclaimed should load only after an intentional "Start SQL Lab" click, never on route entry or prefetch. Add a size warning in the UI.

**4.4 Add a memory regression check.** A Playwright script that walks the ten main views in sequence and asserts `performance.memory.usedJSHeapSize` stays under a threshold. Run it in CI.

### Phase 5 — Delivery and host settings (~2 hours)

**5.1 Set explicit cache headers.** `vercel.json` currently defines no `headers` block. Hashed assets under `/assets/*` should be immutable:

```json
"headers": [
  { "source": "/assets/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" } ] },
  { "source": "/data/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=3600" } ] }
]
```

Without this, returning visitors revalidate dozens of files on every load — each a round-trip even when the answer is 304.

**5.2 Verify Brotli is active** on JS/CSS/JSON responses. Check `content-encoding: br` on the entry chunk in DevTools → Network. Brotli typically beats gzip by 15–20% on JS; on a 343 KB gzip entry that is ~50–70 KB saved on every cold load.

**5.3 Stop deploying the 626 MB `dist/`.** The static sub-apps (`editor/` 235 MB, `agentcore-samples/` 108 MB, `langchain/` 89 MB) should move to object storage or their own deployments behind a rewrite. This is about build and deploy time, not page speed — but a 626 MB artifact will hit platform limits on most hosts and makes every deploy slow.

---

## 6. Sequencing

| Phase | Effort | Blast radius | Do it |
|---|---|---|---|
| 1 — Suspense + transitions | ~0.5 day | Small, contained | **First.** Biggest felt improvement per hour. |
| 2 — Payload | ~1 day | Mechanical, low risk | Second. |
| 5 — Host settings | ~2 hours | Config only | Alongside Phase 2 — free wins. |
| 3 — Architecture | ~2–3 days | **Large** — touches `App.jsx` throughout | Third, on a branch, one sub-step per commit. |
| 4 — Leaks | ~1–2 days | Per-component | Fourth, after profiling confirms which surfaces actually leak. |

Phase 3 is a genuine refactor of a 1,962-line file. Do not start it until Phases 1 and 2 are merged and verified — otherwise you can't tell which change caused which result.

---

## 7. How to verify (do this before Phase 1, to get a baseline)

Everything above is derived from source and build artifacts. Confirm the runtime picture before and after each phase:

1. **Lighthouse** on the production URL, mobile preset, throttled. Record FCP, LCP, TBT, TTI.
2. **React DevTools Profiler** — record one sidebar navigation. Confirm §2.1 (whole tree unmounts/remounts) and §2.2 (unrelated components re-render).
3. **DevTools Performance panel** — record 30 s of normal use. Look for long GC pauses (§3.5) and long tasks over 50 ms.
4. **DevTools Memory panel** — heap snapshot at load; visit Blog, Manual, LangChain Docs, Knowledge Galaxy, SQL Lab; snapshot again. The delta quantifies §3.1–§3.4 and tells you which leaks are real.
5. **Network panel, empty cache** — count requests and total transfer for first paint; check `content-encoding` and `cache-control` on the entry chunk (§5.1, §5.2).

Re-run 1, 4, and 5 after each phase. Target for Phase 1+2: entry payload under 150 KB gzip and no blank flash on navigation.
