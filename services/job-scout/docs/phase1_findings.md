# Phase 1 findings

The baseline batch (`scripts/run_batch.py`) surfaces failures and weaknesses.
**These are documented here, not fixed** — fixing happens in Phase 3 through the
Ollie / Test Suite workflow, so the fix itself becomes content. Phase 1's job is
to make the weaknesses observable.

## How to reproduce

```bash
uv run python scripts/run_batch.py --yes --limit 20
```

Writes `reports/baseline.json` at run time; the committed reference copy is
`docs/baseline.json`, which the numbers below come from.

## Baseline numbers

Model `openai:gpt-4.1-mini`. 19 runs completed (the 20th was interrupted; the
runner checkpoints after every run, so the report reflects all completed runs).
All traces tagged `baseline-batch` in the `job-scout` Opik project.

| metric | value |
|---|---|
| runs | 19 |
| failures | 0 |
| empty_result_runs | 0 |
| reformulation_triggered | 10 / 19 (53%) |
| latency mean / median / p95 (s) | 130.9 / 171.9 / 207.1 |
| cost mean / total (USD) | $0.0205 / $0.389 |
| fit-score mean | 31.6 |

**Fit-score distribution** (466 scored jobs):

| bucket | count |
|---|---|
| 0–19 | 155 |
| 20–39 | 135 |
| 40–59 | 99 |
| 60–79 | 40 |
| 80–100 | 37 |

Only ~16% of scored jobs clear the "good fit" bar (≥60). The ranking prompt is a
plain first draft — this low, left-skewed distribution is the **measurable
headroom** Phase 3's optimizer targets.

**Source usage:** Remotive served 16/19 runs, Adzuna only 3, cache 0.

## Confirmed weaknesses (observed — do NOT fix in Phase 1/2)

1. **Adzuna is almost never used (3/19), despite valid keys.** The LLM in
   `fetch_jobs` chooses tool arguments that return no Adzuna results, so the
   search falls through to Remotive. The "international, Adzuna-primary" design
   is silently defeated by poor argument choice. → Phase 2 `agent tool
   correctness`; Phase 3 prompt/tool-args optimization.
2. **Location constraints are ignored.** `junior_ds_us` was run with `us`, `uk`,
   `de`, and `in` location hints — **all four produced the same Remotive-only
   result and all reformulated twice.** The chosen country/query does not track
   the requested location, and ranking does not penalize location mismatch.
3. **Reformulation fires constantly and rarely helps (10/19).** Weaker profiles
   (`junior_ds_us`, `career_changer`) almost always fail to reach 5 jobs ≥60,
   loop to the 2-reformulation cap, and still top out at ~75–85 with the same
   source. The broadened query does not materially improve results — it mostly
   triples latency and cost (see below).
4. **Reformulation is the dominant cost/latency driver.** Runs that reformulate
   twice cost ~$0.030 and take ~170–210s; runs that don't cost ~$0.007–0.011 and
   take ~55–98s. ~3× on both axes for little quality gain.
5. **Ranking scores skew low and compress at the top.** Mean 31.6; strong
   profiles (`senior_mle_eu`) plateau at a flat 90 across every location while
   weak ones sit at 75. Little discrimination within the top band — a first-draft
   rubric artifact.
6. **`matched_skills` grounding is unchecked.** Nothing enforces that returned
   `matched_skills` appear in both the profile and the job text — a fabrication
   risk (notably on the career-changer CV). Phase 2 adds `MatchedSkillsGrounding`.

## Non-issues (worth noting)

- **0 failures, 0 empty results** — the graph never crashed and always returned
  ranked jobs; error handling + cache fallback hold up.
- **0 tool-call-skip fallbacks** — the `fetch_jobs` LLM always issued a tool
  call, so the no-tool-call path (#5 in the earlier design list) did not trigger
  in this batch. Kept for robustness.
- **Cache (offline) coverage is international** — the committed
  `data/cached_jobs.json` holds ~247 postings: 42 each from us/gb/de/in/au
  (Adzuna) plus ~37 remote (Remotive). Regenerate with `make snapshot`.

## Per-case highlights

- `senior_mle_eu|*` — never reformulates, tops at 90 everywhere; the senior
  profile matches broadly (arguably *too* generously — see #5).
- `junior_ds_us|{us,uk,de,in}` — reformulates twice every time, tops at 75; the
  clearest case of #2 (location ignored) and #3 (reformulation doesn't help).
- `hard|career_changer` and `career_changer_in|{no hint,us}` — the only runs
  that reached Adzuna, and among the cheapest/fastest (no reformulation).
- `hard|unmappable_loc` (location "Atlantis") — did not fail; fell through to
  Remotive and reformulated to the cap.
