# Phase 2 evaluation report

All experiments live in the Opik project `job-scout`; numbers below are the
run-time summaries. Task model for the underlying agent runs:
`openai:gpt-4.1-mini` (the Phase 1 baseline model).

## Datasets

| dataset | items | source | provenance |
|---|---|---|---|
| `job-scout-extraction-cases` | 4 | hand-verified labels (`data/labels/expected_profiles.yaml`) | fixture CVs |
| `job-scout-ranking-cases` | 30 | `baseline-batch` traces (best/middle/worst ranked job per trace) | trace_id + thread_id per item |
| `job-scout-tailoring-cases` | 15 | `tailor-batch` traces | trace_id + thread_id + span_id per item |

## 1. Extraction — ProfileFieldAccuracy (deterministic, zero judges)

**PENDING HAND LABELS.** `data/labels/expected_profiles.yaml` is scaffolded
with LLM drafts (`verified: false`); the experiments run after the labels are
hand-corrected:

```bash
uv run python scripts/build_extraction_dataset.py --push
uv run python scripts/run_evals.py --suite extraction --model openai:gpt-4o-mini --yes
uv run python scripts/run_evals.py --suite extraction --model openai:gpt-4.1-mini --yes
```

Known draft-label errors spotted during scaffolding (left in on purpose — the
human, not the model, owns the labels): career-changer `years_experience: 11.0`
(11 years of *teaching*, ~0 in data), junior-DS `remote_ok: true` (the CV never
says remote), German CV skills extracted in German (`produktstrategie`) which
the fuzzy matcher will not map to English labels.

## 2. Ranking explanations — judge suite (30 items, 2 experiments)

Same 30 logged explanations, two different judge models:

| metric | judge gpt-4o-mini | judge gpt-4.1-mini |
|---|---|---|
| fit_explanation_quality (custom G-Eval) | **0.44** | **0.84** |
| hallucination (built-in) | 0.58 | 0.53 |
| answer_relevance (built-in) | 0.81 | 0.92 |

Two things worth staring at:

- **The judges disagree wildly on quality (0.44 vs 0.84) while broadly agreeing
  on hallucination.** The unverifiable judgment is dominated by *which judge you
  picked* — this is exactly why the calibration step (below) exists before
  trusting either number.
- **Hallucination ≈ 0.5+ on both judges**: half the fit explanations contain
  claims the judges couldn't ground in the profile/job context — consistent
  with Phase 1 weakness #6 (`matched_skills` grounding is unchecked).

## 3. Tailoring — FabricationRate + Hallucination (15 items)

Experiment `tailoring-gpt-4.1-mini` (task model gpt-4.1-mini re-tailoring each
item, judge gpt-4o-mini, tailor prompt version linked):

| metric | mean |
|---|---|
| fabrication_rate (deterministic) | **0.309** |
| hallucination (built-in judge, cover letter vs CV) | 0.227 |

The deterministic rate reproduces the live batch (0.345 over 229 claims in
`reports/tailor_batch.json`) — verifiable checks agree with themselves across
offline and online paths, which is the point of building them. Note the
LLM judge is *milder* than the deterministic validator on the same letters;
see findings #8–9 for why neither is simply "right".

## 4. Agent trajectory metrics (20 traces, scores written back)

Judge: `gpt-4o-mini` over `baseline-batch` ∪ `tailor-batch` traces; scores are
attached to the traces as feedback scores (filter the project by
`trajectory_accuracy` etc.).

| metric | mean (n=20) |
|---|---|
| trajectory_accuracy | 0.685 |
| agent_tool_correctness | **0.675** |
| agent_task_completion | 0.826 |

`agent_tool_correctness` is the quantified version of Phase 1 weakness #1: the
`fetch_jobs` LLM frequently picks tool arguments (query/country) that defeat
the international-source design. Phase 3's optimizer inherits this number as a
baseline.

## 5. Judge-vs-human calibration (10 hand-labeled cases)

**PENDING HAND LABELS.** `data/labels/ranking_calibration.csv` is scaffolded
(10 rows spanning the fit-score range). After labeling
`human_ranking_reasonable` (0/1):

```bash
uv run python scripts/run_evals.py --calibration
```

Report the agreement % and Cohen's kappa here, honestly, whatever they say.
Given the 0.44-vs-0.84 judge split above, do not be surprised if agreement is
mediocre — that finding is the lesson.

## 6. Online rules & annotation queue

- Online rules: configured in the UI per `docs/opik_setup.md` §5 (including the
  honest limitation that rules cannot read the attached CV PDF — the grounding
  rule judges `cv_text` from the trace output instead).
- Annotation queue `job-scout-phase2-review` exists with feedback definitions
  `ranking_reasonable` and `letter_quality`, pre-loaded with fabrication-flagged
  and low-fit traces (`scripts/setup_annotation_queue.py --queue` re-syncs).
