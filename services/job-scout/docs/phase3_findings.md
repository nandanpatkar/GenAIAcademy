# Phase 3 findings — self-improvement, measured

Phase 2 ended with documented weaknesses and the promise: fix them in Phase 3
and prove it. This report is the proof ledger. Every number here comes from
the same 15-case tailoring batch harness (`scripts/run_tailor_batch.py`) and
the same eval suites (`scripts/run_evals.py`) Phase 2 used.

## Experiment design

Three measured stages, so every gain is attributable:

| Stage | Code | What it isolates |
|-------|------|------------------|
| B0 | Phase 2 code, unchanged | fresh baseline at today's knobs |
| B1 | + segmenter v2 + validator v2 | the false-positive fixes (weaknesses #8, #9, #12) |
| B2 | + optimizer-tuned tailor prompt | the true-drift fix (weakness #7) |

Knobs held constant across all three (recorded from `.env` at run time):
`SCOUT_TAILOR_MODEL=openai:gpt-4.1-mini` (matches the Phase 2 committed
baseline model), `SCOUT_MODEL=openai:gpt-4o-mini`,
`SCOUT_FETCH_MODEL=openai:gpt-4.1-nano`, `SCOUT_MAX_REFORMULATIONS=0`,
thresholds at the shipped defaults 0.65 / 0.85 / 0.55 (the Phase 2 committed
batch was measured at 0.75 / 0.9 / 0.55 — see `docs/tailor_batch.json` —
which is why B0 is re-measured here rather than compared against it directly).

Raw run snapshots: `docs/phase3/b0_tailor_batch.json`, `b1_...`, `b2_...`.

## The before/after table

| Metric | B0 (baseline) | B1 (segmenter+validator v2) | B2 (+optimized prompt) |
|--------|---------------|------------------------------|------------------------|
| Fabrication rate | 0.2768 (62/224) | 0.2555 (58/227) | **0.1288 (30/233)** |
| Runs flagged | 14 of 14 | 14 of 14 | **13 of 14** (first-ever clean run) |
| Flags: cv_bullet / letter / skill | 29 / 30 / 3 | 28 / 27 / 3 | **1** / 29 / **0** |
| Flags in 0.55-0.65 near-miss band | 17 | 18 | 1 |
| Mean cover letter words | 195.4 | 197.2 | 203.6 |
| Batch cost (USD) | 0.049 | 0.049 | 0.049 |

The live batches are noisy (fresh searches, fresh generations), so the
validator's isolated effect was also measured the deterministic way: the 15
UNCHANGED packs stored in `job-scout-tailoring-cases` (Phase 2's traces),
re-validated under both stacks at identical thresholds:

| Stack | Same 15 stored packs |
|-------|----------------------|
| v1 segmenter + v1 validator | 0.2664 (65/244) |
| v2 segmenter + v2 validator | 0.2500 (61/244) |

Honest reading: better matching reclaims only ~6% of flags (the unit-spelling
near-misses it was built for). The bulk of the flag load is real rewrite
drift — which is the prompt's fault, not the validator's. That is what the
optimizer is for. (Reproduce: `git show <validator-v2-commit>~2:` both files,
revalidate the dataset's stored packs with each stack.)

## The optimizer run

`scripts/optimize_tailor_prompt.py --yes`: HierarchicalReflectiveOptimizer,
task + reasoning model gpt-4.1-mini, 5 trials x 12 samples, 92 LLM calls.
Metric: 1 - fabrication rate from the live `validate_pack` (deterministic; a
parse failure scores zero with the reason attached). Grounded score
0.772 -> 0.868 on the derived dataset; full history in
`docs/phase3/optimizer_result.json`; the winning instruction block now IS
`prompts/tailor.py` (Opik versions the change via `register_prompts()`).

Offline confirmation, same suite + model + dataset as Phase 2's committed
number: `fabrication_rate` (experiment `tailoring-gpt-4.1-mini`)
**0.309 -> 0.1423 (-54%)**. On gpt-4o-mini: 0.1749. Live batch agreement: B2
0.1288 vs B0 0.2768 (-53%).

## Regression gates

- `make gates`: deterministic — re-validates the stored tailoring packs and
  fails above rate 0.27 (the paired measurement 0.2500 + margin). Zero LLM
  calls, ~3s.
- Opik Test Suite `job-scout-tailoring-suite` (8 items, 3 judged assertions,
  `scripts/setup_test_suite.py`): the dashboard-visible gate; exits nonzero
  under 75% pass rate. Judged, therefore reported, never blindly trusted.

## Latency: the fan-out

`SCOUT_CONCURRENT_SOURCES` (default on) collapses the source cascade's
stacked waits to the slowest single source: 3.01s -> 2.01s in the
deterministic thin-primary bench, no-op within noise when the primary is
rich. Details + trade-off in `docs/optimizing_latency.md` (Phase 3
addendum).

## The cost of the optimizer win, found 2026-08-05

The tailor prompt optimization is reported above as fabrication 0.309 -> 0.1423.
That is true and it is half the story. The **same experiment**
(`tailoring-gpt-4.1-mini`, 30 Jul, dataset `job-scout-tailoring-cases`) also
carries a second feedback score we never wrote down:

| metric | prompt v1 | prompt v2 (optimized) |
|---|---|---|
| `fabrication_rate` (our deterministic validator) | 0.309 | **0.14** |
| `hallucination_metric` (Opik built-in judge) | 0.227 | **0.37** |

Fabrication **-54%**, hallucination **+64%**, same 15 packs. The optimizer's
objective was `1 - fabrication_rate`, so it optimized exactly what it was asked
to and moved a metric nobody was watching.

Plausible mechanism (hypothesis, not measured): "reword only from source" pushes
the model into tighter paraphrase, and tight paraphrase is what the hallucination
judge flags. **Next optimizer run should put both metrics in the objective.**

Found because Ollie surfaced it; confirmed by opening the experiment header,
where both scores sit side by side. The figure was in Opik the whole time — the
gap was our own notes, not our telemetry.

## Contained, not repaired: the 15-second JSearch timeout

Per-source spans (`traced_call`) exposed one on their first real run:
`source.jsearch` spends **15.3s** — exactly its timeout — and returns **zero
jobs**, on every search. Reproduced three times directly (15 264 / 15 265 /
15 244 ms). With the concurrent fan-out, wall time is the slowest source, so
every search pays that tax for a result the cascade then discards
(`sources_used: ['adzuna']`).

It was left open deliberately as the subject of the Ollie codebase loop in
[`ollie.md`](ollie.md), and resolved there on 2026-08-05.

**What JSearch actually does.** It is not uselessly slow, it is *unreliably*
slow. On 2026-08-04 it burned 15.2s and returned `[]` while Adzuna carried the
search; on 2026-08-05 it took 8.8s and was the **only** source that returned
anything. A plain short timeout would have made the first day fast and the
second day empty. Observed range across every trace we have: 8.8 / 9.0 / 11.8 /
15.2 / 15.3 / 15.4 s. It has never once returned under 8s.

**The fix (Ollie's design, our number).** A two-phase soft deadline in
`run_search`, not a timeout. Phase 1 gives JSearch `SCOUT_SOURCE_SOFT_DEADLINE`
and otherwise falls through to sources that are already finished; phase 2 goes
back and waits for it in full if the cascade is still short and JSearch was
never consumed. The HTTP timeout stays at 15s, and the cascade's consumption
order and thresholds (5 / 5 / 3) are unchanged. `pool.shutdown(wait=False)` was
already in place, so the abandoned future does not block the return.

Ollie proposed a default of `5.0`. Measurement rejected it: the deadline is
paid in full on every search (wall clock == deadline for any value above ~1s,
because Adzuna is finished by then), and no value under 8s ever gives JSearch a
chance to win. Default is **1.0s**, with the reasoning recorded in `config.py`.

**Measured, paired, same process, 5 runs per mode, deadline as the only variable:**

| search (n=5 each) | before median | after median | before range | after range |
|---|---|---|---|---|
| "data scientist", Berlin | 15 294 ms | **1 008 ms** | 11 234 – 16 114 | 1 004 – 1 011 |
| "machine learning engineer", remote US | 10 085 ms | **1 006 ms** | 9 312 – 14 157 | 1 001 – 1 268 |

All runs returned 10 jobs (the cap), but from different sources: `['jsearch']`
or `['adzuna']` before, consistently `['adzuna']` after. The variance collapse
is arguably the bigger win — a 4.9s-wide spread becomes 7ms. Within those five
Berlin runs the blocking mode resolved from JSearch on some and Adzuna on
others, which reproduces Ollie's "reliability wildcard" reading in one sitting.

**`job-scout-search-suite`, before → after:**

| assertion | before | after |
|---|---|---|
| no source over 8000 ms | 33% | 33% |
| every used source contributed ≥1 job | 67% | **100%** |
| search returned ≥1 job | 100% | 100% |
| **suite pass rate** | **33%** | **33%** |

The suite pass rate not moving is **correct, not a gap in the fix**. Assertion 1
measures raw per-source latency (`source_timings` calls each adapter directly,
outside `run_search`), and nothing here made JSearch faster. Assertion 2 went
green because JSearch no longer lands in `sources_used` having contributed
nothing. The search is 14x faster and the source is still slow; the gate can
tell those apart because it was written before the fix.

**Still open:** JSearch itself. Containing it is not repairing it. Worth
revisiting whether the adapter's query shape is what makes it slow, or whether
it should be demoted below Adzuna in the cascade entirely.

## Weakness-by-weakness status

Filled in as the work lands; every Phase 2 weakness gets a verdict here.

| # | Weakness (Phase 2) | Status |
|---|--------------------|--------|
| 7 | Tailor prompt drifts, every run flagged | **FIXED by the optimizer**: HRPO against the deterministic grounding metric, 0.772 -> 0.868 on the optimization set (92 LLM calls, `docs/phase3/optimizer_result.json`); live batch bullet flags 28 -> 1, rate 0.2555 -> 0.1288, one run fully clean. Residual: cover-letter claims (29 flags) are now ~all of the flag load |
| 8 | Thresholds flag honest rewrites (near-miss band) | **FIXED (validator v2)**: unit canonicalization + skill containment; paired revalidation of identical packs 0.2664 -> 0.2500; near-miss band 17 -> 1 by B2 |
| 9 | Compositional truths flagged / embedded lies pass | partially fixed (pair references); embedded-lie false negative remains, documented |
| 10 | Judgment depends on the judge (0.44 vs 0.84) | calibration pending hand labels |
| 11 | Online rules cannot read attachments | **expired upstream**: Opik ships attachment-reading LLM-judge rules since 2026-06-23 (agentic tool loop, up to 8 attachments). The cv_text fallback can retire; docs updated in Part 3 packaging |
| 12 | Naive segmentation pollutes the corpus | **FIXED (segmenter v2)**: wrapped-line joining, flexible skill headings, pipe rows kept as content. Still a heuristic by design |
| 1-6 | Phase 1 carryovers (Adzuna underuse, ignored locations, reformulation churn, cost/latency, score compression, matched_skills grounding) | latency addressed in `docs/optimizing_latency.md` + concurrent source fan-out (this phase); rest re-measured at wrap |
