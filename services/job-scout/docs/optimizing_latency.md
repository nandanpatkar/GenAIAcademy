# Optimizing search latency — measured in Opik

*A worked example of the series' core habit: measure first, change one thing,
measure again. Every number below comes from a traced run you can reproduce.*

The complaint that started it: a voice-triggered job search felt endless —
the user asks Jobvis for jobs and waits the better part of a minute. The wrong
move is guessing. The right move is opening the trace: every run is traced in
Opik with one span per graph node, so the span tree already says where the
time goes — and it was not where intuition pointed. The job API (RapidAPI
JSearch) answers in ~2–3s. The LLM calls dominate.

## The starting span tree (measured: 52.3s)

```
extract_profile        5.1s   (once per upload, not per search)
fetch_jobs             5.5s   = ~3s LLM picks search args + ~2.5s job APIs
rank_jobs             17.5s   = 2 sequential batches × ~8.7s (gpt-4.1-mini)
reformulate_query      1.1s
fetch_jobs             5.0s   (loop 1)
rank_jobs              2.1s
reformulate_query      1.6s
fetch_jobs             7.0s   (loop 2)
rank_jobs             12.5s
```

Worse: before this snapshot, ranking was capped at 25 jobs (5 sequential
batches) and each broaden-the-search loop **re-scored every job from
scratch** — the arithmetic worst case ran minutes.

## The changes, one knob each

| # | Change | Knob (env) | Effect (measured) |
|---|--------|-----------|-------------------|
| 1 | Cap jobs fetched/ranked at 10 | `SCOUT_MAX_JOBS=10` | 5 ranking batches → 2 |
| 2 | Never re-score already-ranked jobs across loops | (always on) | loop re-rank: ~17s → **2.1s** |
| 3 | Rank batches in parallel — latency is the slowest batch, not the sum | (always on) | ranking ≈ one batch's time |
| 4 | Demo mode: skip broaden-the-search loops | `SCOUT_MAX_REFORMULATIONS=0` | −2 fetch+rank rounds |
| 5 | Ranking model: gpt-4.1-mini → gpt-4o-mini | `SCOUT_MODEL` | batch ~8.7s → ~5.6s |
| 6 | Tiny model for the trivial pick-search-args call | `SCOUT_FETCH_MODEL` | ~3s → ~1s |
| 7 | Smaller ranking batches (output tokens ∝ jobs/batch) | `SCOUT_RANK_BATCH=4` | slowest batch shrinks |

Measured checkpoints along the way, same fixture CV, live sources:
**52.3s** (loops on, 4.1-mini, changes 1–2) → **24.0s** (parallel, no loops,
4.1-mini) → **10.6s at $0.0015** (4o-mini).

An honest footnote: our first run after changes 6–7 measured **10.5s — no
visible gain**. The trace showed why: JSearch returned nothing that run, so
the sequential source fallback (JSearch → Adzuna → Remotive) spent ~3s
failing forward before Remotive answered, swallowing the nano-model saving —
and 1–2s effects drown in single-run variance regardless. Two lessons for the
price of one: small optimizations need several runs to measure, and the next
real latency target is querying the job sources **concurrently** instead of
as a fallback chain. That experiment is left for you.

## The observability gotcha worth the whole chapter

Change 3 nearly broke the thing this repo is about. LangChain carries its
callbacks — the Opik tracer and the token/cost counter — in **contextvars**,
and contextvars do not cross thread boundaries. Naively parallelizing the
batches keeps the speed but silently detaches the spans and drops the cost
numbers. The fix is one line per task: `contextvars.copy_context().run(...)`
inside the executor (see `rank_jobs.py`), which carries the callback context
into each worker. If you parallelize LLM calls anywhere else, this is the
pattern — and the way you notice you forgot it is an Opik trace with missing
children and a cost of $0.00.

## Reproduce it

1. Run one search in the app (or `scripts/run_batch.py`) with your current
   `.env`; note the trace.
2. Change ONE knob from the table. Run again.
3. In Opik, open both traces side by side: compare the `fetch_jobs` and
   `rank_jobs` span durations and the per-run cost. The tags on each trace
   record which surface triggered it (`ui`, `voice`, batch).

## What we deliberately did not do

- **Hardcode the search query** (−1s): `fetch_jobs` choosing its own tool
  arguments is the agent lesson; a lookup table is not an agent.
- **A dumber ranking model**: scores and gaps are the product. If you want to
  try it, the eval stack exists precisely to measure what it costs.
- **Prefetch on app start**: burns JSearch quota and LLM budget on every
  restart of a dev day.
- **The next real experiment — lazy explanations**: most ranking time is
  spent writing `fit_explanation` for all 10 jobs, but only the top 3 are
  ever read. Scoring first and explaining only the top 3 should roughly halve
  ranking latency — and it shifts `FitExplanationQuality` eval baselines, so
  it belongs in an eval-measured run, not a drive-by commit.

## Phase 3 addendum: the concurrent source fan-out

The honest footnote above named the next target: the sequential source
fallback that "fails forward" one network wait at a time, exactly when the
primary source returned nothing. Phase 3 shipped it as
`SCOUT_CONCURRENT_SOURCES` (default on): the live sources fire together via
`ThreadPoolExecutor` + `contextvars.copy_context()` (the same pattern
`rank_jobs` proved), while the CONSUMPTION policy — priority order, the <5
and <3 thresholds, the `sources_used` trace field — is unchanged. Only the
waiting overlaps.

Measured, deterministically (injected sources, 2.0s thin primary + 1.0s rich
fallback, identical results and `sources_used` in both modes):

| Mode | Wall time |
|------|-----------|
| sequential (Phase 1/2 behavior) | 3.01s |
| concurrent (Phase 3 default) | 2.01s |

The stacked waits collapse to the slowest single source: sum becomes max.

Measured against the live APIs, honestly: when the primary is rich (or only
one source answers at all), the two modes are within noise of each other
(medians 1.23s vs 1.16s on an Adzuna-only cascade) — the win only exists in
the multi-source fallback case, which is precisely the case that used to
hurt. Same lesson as changes 6-7 above: small optimizations need several
runs and a scenario you can actually reproduce, which is why the table above
uses injected sources instead of network luck.

Trade-off, stated plainly: concurrent mode queries lower-priority sources
whose results may go unused, spending Adzuna/Remotive quota to buy latency.
`SCOUT_CONCURRENT_SOURCES=false` restores the frugal sequential cascade.

## The soft deadline (`SCOUT_SOURCE_SOFT_DEADLINE`, default 1.0s)

Firing the sources together collapsed the *stacked* waits, but the cascade
still consumed them in priority order, so the search remained hostage to
whatever JSearch was doing — 8.8s on a good day, 15.4s on a bad one, and on
2026-08-04 it spent 15.2s to return `[]` while Adzuna carried the whole result.

Proposed by Opik's assistant from the per-source spans (see
[`ollie.md`](ollie.md)), in two phases so the primary is bounded without being
dropped:

1. wait at most `SCOUT_SOURCE_SOFT_DEADLINE` for JSearch, then fall through to
   the sources that have already finished
2. if the cascade is *still* short and JSearch was never consumed, wait for it
   in full — on 2026-08-05 it was the only source that returned anything

Consumption order and the <5/<3 thresholds are unchanged, the HTTP timeout stays
at 15s, and sequential mode is untouched (the deadline only exists when there is
something else already in flight).

Measured live, paired, same process, 5 runs per mode, deadline as the only
variable (medians; the ranges matter more than the medians here):

| search (n=5 each) | blocking | 1.0s deadline |
|---|---|---|
| "data scientist", Berlin | 15 294 ms (11 234 – 16 114) | **1 008 ms (1 004 – 1 011)** |
| "machine learning engineer", remote US | 10 085 ms (9 312 – 14 157) | **1 006 ms (1 001 – 1 268)** |

Same lesson as changes 6-7: run it more than once. A single pair suggested
16.1s → 1.1s; five pairs show the honest 10-15x spread *and* the variance
collapse, which is the more useful property. All runs returned 10 jobs (the
`limit`), sourced from Adzuna after the change rather than JSearch.

**Why 1.0 and not the 5.0 originally proposed.** The deadline is paid in full on
essentially every search, because Adzuna is finished by ~1s:

| deadline | wall clock | jobs |
|---|---|---|
| 1.0s | 1 007 ms | 10 |
| 2.0s | 2 020 ms | 10 |
| 5.0s | 5 013 ms | 10 |

Since JSearch has never once returned under 8s, no value in that range gives it
a chance to win; it only bills the user the difference. Phase 2 is what protects
the results, so the deadline should be as small as is still useful.

Trade-off, stated plainly: on a day when JSearch is both fast *and* the only
source with jobs, this pays `deadline + jsearch` instead of `jsearch`. That is a
1s tax on the rare good day to avoid a 15s tax on the common bad one. It also
does not make JSearch faster — `job-scout-search-suite` still fails its
"no source over 8s" assertion, correctly.
