# Analytics Vidhya Archive — Integration Plan

Integrating the scraped Analytics Vidhya corpus (2013 → 2026) into the genai-roadmap
app as a first-class, readable, searchable archive, deployed on Vercel.

Raw input lives at `../Claude Certeficate/analytics vidya/` (sibling of this repo,
already covered by the `/Claude Certeficate/` entry in `.gitignore`).

---

## 1. What is actually in the corpus (measured, not estimated)

| Fact | Value |
|---|---|
| Blog folders on disk | **10,840** (`blogs/<YYYY>-<MM>-<slug>/`) |
| `manifest.json` entries | 10,840 — 10,837 `success`, **3 `failed`** (no folder content) |
| `index.md` files | **10,837** — **147.5 MB** raw, ~56 MB gzipped, median 13.3 KB |
| Images | **65,544** files — **7.68 GB** |
| Image formats | png 28,945 (4.03 GB) · webp 25,938 (1.13 GB) · jpg 8,773 (1.70 GB) · gif 834 (**1.27 GB**) · jpeg 1,020 · svg 34 |
| Image size profile | p50 32 KB · p90 220 KB · p99 1.6 MB · max 23 MB |
| Size concentration | top 10% of images = **67%** of all bytes |
| Duplicate images (sampled) | ~4.7% |
| Slug collisions | **0** (after stripping the `YYYY-MM-` prefix) |
| Folder-name URL safety | 100% `[a-z0-9._-]`, max length 158 chars |
| Posts with zero images | ~12.5% |
| Posts with a category footer | **99.7%** — ~184 distinct categories |
| Posts with an author-link footer | **98%** |
| Posts containing code fences | **43%** |
| Months covered | 161 (2013-04 → 2026-xx); busiest month 374 posts |

Measured recompression (resize to max width 1280, WebP q80), by bucket:

| Bucket | Files | Now | After | Ratio |
|---|---|---|---|---|
| < 32 KB | 32,595 | 0.39 GB | ~0.27 GB | 0.69 |
| 32–220 KB | 26,361 | 2.33 GB | ~0.79 GB | 0.34 |
| > 220 KB | 6,588 | 5.53 GB | ~0.39 GB | 0.07 |
| **Total** | 65,544 | **7.68 GB** | **~1.4 GB** | ~0.18 |

> The `> 220 KB` ratio is optimistic: it was measured with a single-frame encode,
> and 834 animated GIFs (1.27 GB, avg 1.5 MB) live mostly in that bucket. They need
> their own path (§6.3). Realistic optimized total: **1.2–1.6 GB.**

---

## 2. The constraint that drives every decision

**7.68 GB of images cannot go in this repo or in a Vercel deployment.** Even after
optimization at ~1.4 GB it is a non-starter:

- `public/` is already **574 MB / 12,630 files**; `dist/` builds to **13,567 files**.
  Adding 65,544 images + 10,837 markdown files puts the deployment near **90,000 files**.
  Vercel enforces a per-deployment file-count limit — verify the current number for
  your plan before relying on any static layout that adds five figures of files.
- GitHub's per-repo soft limit is 5 GB; a ~2 GB repo makes every clone, CI checkout,
  and Vercel build materially slower, forever.
- Vercel build containers would spend minutes just copying image bytes.

So: **bulk content is served from object storage behind a CDN, not from the deployment.**
Only a compact index ships in the build.

There is a second constraint worth stating up front: **this app has no router.**
`package.json` has no `react-router`, and views are selected by boolean state in
`src/App.jsx` (`showBlog ? <BlogPage .../> : ...`, line 1580). Per-post shareable URLs
therefore need an explicit decision — see §7.

---

## 3. Target architecture

```
../Claude Certeficate/analytics vidya/     raw corpus, gitignored, never deployed
  blogs/<YYYY>-<MM>-<slug>/index.md
  blogs/<YYYY>-<MM>-<slug>/images/*
  manifest.json
        │
        │  scripts/build_av_archive.py        (normalize + derive, idempotent)
        ▼
  .av-build/                                 local staging, gitignored
    <year>/md/<slug>.md                      cleaned bodies, CDN image URLs
    <year>/img/<slug>/<n>.webp               optimized derivatives
    <year>/img/<slug>/hero.webp              400px card thumbnail
    index/                                   per-year browse indexes
        │
        ├── scripts/upload_av_archive.mjs ──► Cloudflare R2  (md + images)
        │                                     av/<year>/md/<slug>.md
        │
        └── public/data/av-years.json ──────► ships in the Vercel deployment
            public/data/av-<year>.json        (15 files, ~2 MB total)
            public/data/av-preview.json
                                                    │
                                                    ▼
                                        src/components/AVArchive.jsx
                                        src/services/avArchiveService.js
```

**Deployment cost: 2 new files.** Everything else is CDN.

### 3.1 Why Cloudflare R2

- **Zero egress fees.** With ~1.4 GB of images served to readers, egress is the whole
  cost question, and R2 makes it $0.
- Free tier: 10 GB storage, 1M Class-A ops/mo. The corpus (~1.6 GB, ~76k objects,
  one-time write) fits inside it. Steady-state cost ≈ **$0**.
- S3-compatible, and **`@aws-sdk/client-s3` is already a dependency** — no new package.

**Alternative already wired in this repo:** Supabase Storage (`supabase/` migrations,
`@supabase/supabase-js`). Viable, but Supabase bills egress against the plan quota and
the free tier caps storage at 1 GB, so the archive alone would force a Pro plan. Use it
only if you want a single vendor.

**Vercel Blob** also works and needs no new account, but it bills both storage and
egress — the worst fit of the three for a read-heavy image archive.

### 3.2 Why the markdown also goes to the CDN

147 MB / 10,837 files is small in bytes but large in *file count*, which is the binding
Vercel limit. Serving `md/<slug>.md` from the same R2 bucket:

- keeps the deployment file count flat (+2 files instead of +10,837),
- keeps the per-post on-demand fetch pattern already used by `LangChainDocs.jsx`
  (`fetch(activePage.file)`, line 169) — same code shape, different base URL,
- costs 5 KB gzipped per post open.

**Option B (git-tracked content):** if you want the bodies in version control the way
`public/langchain/md/` is, ship them to `public/av/md/<slug>.md` instead and only put
images on R2. This adds 147 MB and 10,837 files to the repo and deployment. Confirm
the Vercel file-count ceiling first. Everything else in this plan is unchanged —
only `AV_CDN_BASE` for markdown differs.

---

## 4. Phases

### Phase 0 — Decide and provision (blocking, ~30 min)

1. Confirm R2 vs Supabase Storage vs Option B.
2. Create the R2 bucket `av-archive`, attach a custom domain (`cdn.<yourdomain>`),
   enable public read.
3. Add to `.env.local` and Vercel project env:
   ```
   R2_ACCOUNT_ID=…
   R2_ACCESS_KEY_ID=…
   R2_SECRET_ACCESS_KEY=…
   R2_BUCKET=av-archive
   VITE_AV_CDN_BASE=https://cdn.<yourdomain>/av
   ```
   Credentials are build/upload-time only — the browser never sees them. Mirror the
   keys (names only) into `.env.example`.
4. Set the bucket's CORS to allow `GET` from your Vercel domains and `localhost:5173`
   (required because the app `fetch()`es markdown cross-origin).
5. Add `/.av-build/` to `.gitignore`.

### Phase 1 — `scripts/build_av_archive.py` (the core deliverable)

Follows the established shape of `scripts/build_langchain_docs.py`: reads a gitignored
raw input dir, emits normalized output plus an index, idempotent, re-runnable.

Responsibilities, in order:

1. **Enumerate** `blogs/*/`, join against `manifest.json`. Skip the 3 `failed` entries
   and any folder with no `index.md`. Reconcile the 3 on-disk folders missing from the
   manifest (log them; include if they have content).
2. **Parse** frontmatter (`title`, `author`, `date`, `url`, `images_count` — present on
   100% of sampled posts) + body.
3. **Normalize** the body (§6).
4. **Extract** the trailing author/category block into structured fields, then strip it
   from the body (§6.2). This is where the real taxonomy comes from.
5. **Optimize** images into `.av-build/img/<slug>/` (§6.3), dedupe by content hash.
6. **Rewrite** `./images/image_N.ext` → `${AV_CDN_BASE}/img/<slug>/N.webp`.
7. **Emit** `.av-build/md/<slug>.md`, `.av-build/index.json`, and a
   `.av-build/build-report.json` (counts, skips, warnings, byte totals) — same
   reporting habit as `public/langchain/build-report.json`.

Wire it as `"build:av": "python3 scripts/build_av_archive.py"` in `package.json`.
**Do not add it to the `build` script** — it must not run on every Vercel build. It is
a manual, occasional content build; the deployment consumes only its committed output.

Runtime expectation: image processing dominates. Pillow over 65k images ≈ 20–40 min
single-threaded; use `multiprocessing.Pool` and a content-hash cache keyed on
`(src_path, mtime, size)` so re-runs are near-instant.

### Phase 2 — `scripts/upload_av_archive.mjs`

Node + `@aws-sdk/client-s3` (already a dependency).

- Walks `.av-build/`, uploads to `av/md/…` and `av/img/…`.
- **Idempotent:** keeps a local `.av-build/.uploaded.json` of `key → sha256`; skips
  unchanged objects. A re-run after a content fix uploads only the delta.
- Concurrency ~32 with retry/backoff; ~76k objects on a normal connection ≈ 30–60 min
  for the first full push.
- Sets `Content-Type` correctly (`text/markdown; charset=utf-8`, `image/webp`,
  `video/mp4`) and `Cache-Control: public, max-age=31536000, immutable` — safe because
  filenames are content-derived.
- `--dry-run` flag that reports object count and total bytes before writing anything.

Wire as `"upload:av": "node scripts/upload_av_archive.mjs"`.

### Phase 3 — Index + service layer

`build_av_archive.py` writes two files into `public/data/` (already covered by the
`/data/(.*)` cache header in `vercel.json`):

- **`av-index.json`** — one entry per post, no bodies. ~10,837 × ~220 B ≈ **2.4 MB**,
  ~700 KB gzipped. Fetched only when the archive view opens.
- **`av-preview.json`** — 12 recent posts for the home screen, ~8 KB. Exactly mirrors
  the existing `blog-preview.json` split that `FeatureHome.jsx:15` relies on.

New `src/services/avArchiveService.js`, copying the deliberate design of
`blogCatalogService.js` (module-scope in-flight promise, no retained parsed result so
it stays garbage-collectable, retry on failure):

```js
loadAVIndex()            // → Promise<AVIndex>       fetch /data/av-index.json
loadAVPost(slug)         // → Promise<string>        fetch ${CDN}/av/md/<slug>.md, LRU-cached (~20)
searchAV(index, query, filters)   // client-side, over the index only
```

### Phase 4 — `scripts/process_blogs.py` retirement

This script currently derives the catalog from `links.txt` by Title-Casing URL slugs —
so the UI shows `"Ai Agents Vs Apps"` and every description is the generated string
`"Deep-dive into … within the {year} Research Repository."`.

The new corpus has **real titles, real authors, real dates, real categories, and real
bodies**. Rewrite `process_blogs.py` to source `blog-catalog.json` / `blog-preview.json`
from `manifest.json` + the extracted footers, or retire it and repoint the two consumers
(`FeatureHome.jsx:15`, `blogCatalogService.js:18`) at the new index. Either way the
existing archive UI immediately gets accurate metadata.

### Phase 5 — Reader UI

**`src/components/AVArchive.jsx`** (lazy-loaded, registered next to the other
`React.lazy` imports in `src/App.jsx`):

- Browse by year → month, filter by category and difficulty (Beginner / Intermediate /
  Advanced come free from the extracted taxonomy), filter by author.
- Card grid using `hero.webp` thumbnails with `loading="lazy"` + `width`/`height` set
  to avoid layout shift.
- Virtualized list — 10,837 cards cannot all be in the DOM.
- Client-side search over title + author + categories + the 200-char excerpt in the
  index. Do **not** attempt full-body search client-side; 56 MB gzipped of bodies is
  not a client-side index. If full-text search is wanted later, §9.

**Reader view** reuses what is already installed: `react-markdown` v10 + `remark-gfm`
(both dependencies), `react-syntax-highlighter` for the 43% of posts with code fences.
Mirror `LangChainDocs.jsx`'s fetch-and-cache pattern. Render an app-styled header from
the structured metadata (title, cleaned author, date, categories, original-link
attribution) rather than the duplicated H1/author block that sits at the top of every
raw file — which §6.1 strips.

Note: `rehype-raw` is **not** currently a dependency. ~1% of posts contain raw HTML
tags. Either add it, or let react-markdown escape them (safer default — recommended).

### Phase 6 — Deploy config

Append to `vercel.json`:

```jsonc
// headers — the index is regenerated only on content builds
{
  "source": "/data/av-(.*)",
  "headers": [{ "key": "Cache-Control",
                "value": "public, max-age=3600, stale-while-revalidate=86400" }]
}
```

Also extend the existing `functions.*.excludeFiles` globs with `.av-build/**` so the
staging directory can never be pulled into a serverless function bundle if it exists
locally at deploy time.

---

## 5. Data contracts — partitioned by year

The archive is split by publication year end to end: storage keys, index files, and the
browse UI. Three reasons beyond it being the requested organisation:

- **Nothing loads the whole archive.** Opening the archive fetches a ~1 KB summary; a
  year is only fetched when clicked. A single 2 MB index would be paid for on every visit.
- **Rebuilds stay cheap.** Re-running the build for one year touches one prefix, and the
  uploader diffs one prefix.
- **The year is free and reliable.** It is the `YYYY-MM-` folder-name prefix, present and
  correct on 100% of posts — unlike the frontmatter `date:`, which is last-update and
  formatted inconsistently (`"24 Apr, 2015"` vs `"2024-01"`).

### `public/data/av-years.json` — the only file loaded up front (~1 KB)

```jsonc
{
  "version": 1,
  "generated": "2026-08-09T00:00:00Z",
  "cdn": "https://av-cdn.<sub>.workers.dev/av",
  "total": 8632,
  "years": [
    { "y": 2026, "n":  315, "f": "/data/av-2026.json" },
    { "y": 2025, "n":  951, "f": "/data/av-2025.json" },
    { "y": 2024, "n": 2018, "f": "/data/av-2024.json" }
    // … 14 years, newest first, down to 2013
  ]
}
```

### `public/data/av-<year>.json` — one per year, fetched on demand

```jsonc
{
  "y": 2024,
  "categories": ["Advanced", "Beginner", "Generative AI", "…"],  // year-local, interned
  "posts": [
    {
      "s": "2024-12-multi-vector-chatbot",     // slug = folder name = stable id
      "t": "Building a Multi-Vector Chatbot with LangChain, Milvus, and Cohere",
      "d": "2024-12-04",
      "c": [3, 7, 19],                          // indices into `categories`
      "x": "A chatbot that retrieves across …", // 200-char excerpt
      "h": 1,                                   // 1 = hero.webp exists
      "n": 6                                    // image count
    }
  ]
}
```

Sorted newest-first so the UI never sorts. Short keys and interned categories keep the
largest year (2024, 2,018 posts) near 440 KB raw / ~130 KB gzipped.

**No `a` (author) and no `u` (original URL) field** — per §6.7 neither is rendered, and
an index is a public file, so they are not written into it at all. The build still parses
both internally; they just never reach the client.

### CDN URL shapes

```
${AV_CDN_BASE}/<year>/md/<slug>.md
${AV_CDN_BASE}/<year>/img/<slug>/<n>.webp
${AV_CDN_BASE}/<year>/img/<slug>/hero.webp
${AV_CDN_BASE}/<year>/img/<slug>/<n>.mp4      // animated GIF replacements
```

`<slug>` is the folder name verbatim — verified unique and URL-safe across all 10,840
folders — and it already begins with `<year>-<month>-`, so the year prefix is derivable
from the slug alone and no mapping table is needed. The Worker's `av/` guard is
unaffected.

---

## 6. Content filtering and normalization (all issues confirmed in the corpus)

### 6.0 Editorial filter — `scripts/av_filter.py`

Analytics Vidhya ran a **job board** and an **events/webinar calendar** under the same
`/blog/` path as its tutorials, so the scrape swept them up. `av_filter.py` classifies
every post and the build script skips the rejects. Run `python3 scripts/av_filter.py`
to audit, `--list-dropped` to dump slugs.

| Dropped | Count | Why |
|---|---|---|
| `job-or-announcement` | 1,322 | `jobs` / `announcement` categories. "Data Scientist – Amazon – Bangalore (2-6 years of experience)" |
| `failed-scrape` | 35 | Captured the site footer instead of an article — see below |
| `av-promo` | 29 | DataHour webinar promos, DataHack Summit marketing, AV/Fractal funding news |
| `event-listing` | 13 | "Predictive Analytics World, San Francisco, CA, USA, March 29th – April 2nd, 2015" |
| `news-pre-2024` | 796 | Stale industry news — see below |
| `stub` | 10 | Under 1,200 chars of body — all truncated job posts |
| **Kept** | **8,632 (79.7%)** | |

**News is filtered by age, not banned.** News ages badly where tutorials do not: a 2015
piece asking *"How Apple Watch would re-define Apple's products in next 3 years?"* is
noise, while *"6 Insights from OpenAI's Prompting Guide for Reasoning Models"* still has
reference value. So `news`/`avbytes` posts are dropped before `NEWS_CUTOFF_YEAR = 2024`
and kept from 2024 on — 796 dropped, **492 kept** (412 from 2024, 79 from 2025, 1 from
2026). The cutoff applies *only* to those two categories; a 2015 regression walkthrough
is still a regression walkthrough. `--keep-all-news` restores every year.

**The 35 failed scrapes are the important find.** The `quiz-of-the-day` and
`prompt-battle` URLs are interactive widgets, not articles. The scraper got the site's
navigation footer and, from the "latest post" widget, the wrong headline — all 35
claim to be titled *"GPT-5.6 Is Here: Sol, Terra, and Luna"*. They are caught by
requiring **two** signals at once (footer chrome present **and** body under 1,200 chars),
because 116 *real* articles also have footer chrome appended and must merely be trimmed,
not dropped.

Precision is deliberately favoured over recall. Any title shaped like teaching material
(`EDUCATIONAL_SHAPE`) vetoes a title-pattern drop, because losing a real tutorial costs
more than keeping a stray promo. That guard is what rescues *"Data Analyst Resume
Secrets – How to Stand Out from the Crowd in 2025"* from the job-title pattern and
*"Exclusive Interview with SRK … (DataHack Summit – Workshop Speaker)"* from the promo
pattern. Category-based drops are not vetoed — `jobs` is reliable.

**Nothing is deleted from disk.** The raw corpus is the only copy and is gitignored
build input; filtering happens on the way out, so a rule can be revised and the build
re-run.

### 6.01 Undecoded unicode escapes

**24.8% of posts** contain literal `–` / `’` sequences instead of the actual
characters — e.g. `Machine Learning/Research Scientist – Amazon`. Fixed by
`decode_escapes()`, which substitutes `\uXXXX` explicitly rather than using
`codecs.decode(s, "unicode_escape")` — the latter mangles genuine non-ASCII by
round-tripping through latin-1.


### 6.1 Header de-duplication

Every file repeats its frontmatter as body text:

```markdown
# Welcome to Analytics Vidhya!
**Author:** Kunal JainLast Updated :
**Date:** 24 Apr, 2015
**Original Link:** [https://…](https://…)
---
```

Strip this leading block. The viewer renders its own header from the index metadata.

### 6.2 Footer extraction → structured taxonomy

Every recent post ends with an author card and category links:

```markdown
![Subhadeep Mandal](./images/image_6.webp)
[Subhadeep Mandal](https://www.analyticsvidhya.com/blog/author/subhadeep56/)
A Machine Learning and Deep Learning practitioner …
[Advanced](…/category/advanced/)[Generative AI](…/category/generative-ai/)[LLMs](…)
```

Present on **99.7%** (categories) and **98%** (author link) of posts. Extract to fields,
strip from body. This is the single highest-value step in the whole build — it is the
only source of category, difficulty, and clean author data.

### 6.3 Author field repair

The scraped `author:` frontmatter is unreliable: **73%** carry a `"Last Updated :"`
suffix (`"K.C. Sabreena BasheerLast Updated :"`), and some are single-character garbage
(`"d"`, `"A"`, `"G"` — 151/900 in one sample). Resolution order:

1. author name from the footer link (§6.2) — clean, and available for 98% of posts;
2. frontmatter with `/Last Updated\s*:?\s*$/` stripped;
3. `"Analytics Vidhya"` fallback when the result is under 3 chars.

Also normalize `date` (`"24 Apr, 2015"` → `2015-04-24`) and reconcile against the
`YYYY-MM` folder prefix, which disagrees on older posts (the folder reflects publication,
the frontmatter reflects last update — keep both; sort by the folder date).

### 6.4 Image handling

- **Resize** to max width 1280 (median source width in the largest bucket is 1320).
- **Encode** WebP q80. Keep the original when it is already smaller — critical for the
  32,595 sub-32 KB files, which *grow* under naive re-encoding (measured ratio 0.69,
  and 25,938 files are already WebP).
- **Animated GIFs — handle separately.** 834 files, 1.27 GB, avg 1.5 MB. Convert to
  `.mp4` (H.264, `-crf 28`, `faststart`) via ffmpeg and render as
  `<video autoplay loop muted playsinline>`. Expect ~1.27 GB → ~120 MB. A single-frame
  WebP encode silently destroys the animation — this is the one case where the
  Pillow path must not be used.
- **Dedupe** by SHA-256; ~4.7% of images are exact duplicates. Point duplicate
  references at one object.
- **Hero derivative:** 400px-wide WebP from the first content image (skipping the
  footer author avatar, which is always the last image), for archive cards.
  ~10,837 × ~15 KB ≈ 160 MB.
- **~12.5% of posts have no images** — the UI needs a deterministic generated card
  (e.g. gradient keyed on slug hash), not a broken thumbnail.

### 6.5 Remote image references

**16%** of posts still reference `https://…` images that were never downloaded. Options:
leave them hotlinked (they may be blocked or rot), or add a fetch-and-localize pass to
the build script. Recommend a fetch pass with a `--fetch-remote` flag, run once, with
failures logged and the original URL retained as fallback.

### 6.6 WordPress shortcode residue

`[stextbox id="section"]…[/stextbox]` and similar appear in ~2% of posts (concentrated
in 2013–2016). Convert `stextbox` to a blockquote or `##` heading; strip other unmatched
`[shortcode attr=…]` patterns. Smart quotes inside them (`id=”section”`) mean the regex
must accept `"`, `”`, `“`, and bare values.

### 6.7 Author and source link — removed by request

Per the project owner's decision, rendered posts carry **no author name and no link to
the original article**. Concretely the build must:

- drop the `**Author:**` / `**Date:**` / `**Original Link:**` lines from the header block
  (§6.1 already strips this block wholesale);
- strip the entire trailing author card — avatar image, name, profile link, and bio (§6.2);
- omit `author` from the rendered header, and omit the "Originally published on…" line;
- **still parse both**, because the footer author link is the only reliable way to repair
  the corrupted `author:` frontmatter (§6.3) and the same footer block carries the
  categories the whole taxonomy depends on. Parse, use, discard — do not skip parsing.

The `url` field stays in `av-index.json` as a stable dedupe/debug key; it is simply not
rendered. Anything that would surface it (a "source" chip, a hover title) must be left out.

> Flagged once for the record: this is scraped third-party content, and stripping author
> and source is what separates a personal reading archive from republication. For a
> private or personal-use archive that is unremarkable; if this archive is ever made
> public, attribution and Analytics Vidhya's terms become a real question. Owner's call —
> implemented as specified.

Note that several posts carry an explicit "The media shown in this article is not owned by
Analytics Vidhya" line in the body. That is body content, not the footer card, so it
survives normalization by default.

---

## 7. Deep linking (needs a decision)

There is no router. Two options:

**A. Query param (recommended — zero new dependencies).** Read `?av=<slug>` on mount in
`App.jsx`, set `showAVArchive` + the selected slug; push state on navigation via
`history.pushState`. Works with the existing boolean view state, needs no Vercel rewrite
(the path is always `/`), and makes posts shareable.

**B. Add `react-router`.** Cleaner URLs (`/av/<slug>`) and better SEO, but it is a
structural change to a 2000-line `App.jsx` that currently has no routing, and it requires
an SPA fallback rewrite in `vercel.json` (`/(.*) → /index.html`) that must be ordered
after the existing `/api/*` and `/notion-api/*` rewrites.

Start with A. It is reversible.

---

## 8. Verification checklist

Run before the first upload and after each content rebuild:

- [ ] `build-report.json`: post count = 10,837 ± the 3 known failures, and every skip has a logged reason.
- [ ] Zero `./images/` references remain in any emitted `.md`.
- [ ] Every `${CDN}/img/...` URL in the emitted markdown resolves to a file in `.av-build/img/`.
- [ ] No emitted markdown still contains `Last Updated :`, `[stextbox`, or the leading duplicate header.
- [ ] Author is ≥ 3 chars for 100% of posts; categories non-empty for ≥ 99%.
- [ ] All 834 animated GIFs produced an `.mp4` (not a single-frame WebP).
- [ ] `.av-build/img` total is under 1.8 GB; if it is over 3 GB, the "keep smaller original" rule is not firing.
- [ ] `av-index.json` under 3 MB; `av-preview.json` under 20 KB.
- [ ] `npm run build` output file count has grown by ≤ 5 files vs. the previous build.
- [ ] Spot-check 10 posts across 2013 / 2018 / 2021 / 2024 / 2026: images load, code blocks highlight, tables render, no raw shortcodes visible.
- [ ] R2 CORS verified from both `localhost:5173` and the production domain.

---

## 9. Deferred (explicitly out of scope for v1)

- **Full-text search over bodies.** The right move if wanted: load the 147 MB of
  bodies into Supabase Postgres with a `tsvector` GIN index — Supabase is already
  wired here, and 147 MB of text is trivial for it. That is a separate phase with its
  own migration under `supabase/migrations/`.
- **AI summaries / TL;DR per post.** `generateAI_TLDR` already exists in
  `src/services/aiService.js` and `BlogPage.jsx` imports it — precomputing summaries at
  build time for 10,837 posts is a meaningful LLM spend and should be its own decision.
- **Roadmap cross-linking** (mapping AV categories onto existing roadmap nodes).
- **Incremental re-scrape** of new Analytics Vidhya posts.

---

## 10. Estimated effort

| Phase | Work | Wall clock |
|---|---|---|
| 0 | Provision R2 + env | 30 min |
| 1 | `build_av_archive.py` | 1–2 days dev · 20–40 min first run |
| 2 | `upload_av_archive.mjs` | half day dev · 30–60 min first push |
| 3 | Index + service layer | half day |
| 4 | Retire/rewrite `process_blogs.py` | 1–2 hours |
| 5 | `AVArchive.jsx` + reader | 2–3 days |
| 6 | Vercel config + deploy | 1 hour |

Steady-state hosting cost: **$0** (R2 free tier, zero egress). Vercel deployment size
and file count are effectively unchanged.
