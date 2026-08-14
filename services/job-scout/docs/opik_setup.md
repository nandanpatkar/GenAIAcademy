# Opik setup

Job Scout traces every run in [Opik](https://www.comet.com/docs/opik/) (Comet's
LLM observability tool). This guide covers Phase 1. Later sections are stubs that
Phases 2 and 3 fill in.

## 1. Account & keys

1. Sign up at [comet.com](https://www.comet.com/) (free tier is enough).
2. Grab your **API key** from account settings and your **workspace** name.
3. Put them in `.env`:
   ```
   OPIK_API_KEY=...
   OPIK_WORKSPACE=your-workspace
   OPIK_PROJECT_NAME=job-scout
   OPIK_ENABLED=true
   ```

Pinned SDK version: **opik 2.1.x** (see `pyproject.toml`). Opik ships weekly; if
an integration call changes, check <https://www.comet.com/docs/opik/latest>.

## 2. What gets traced

The SDK is configured once at startup (`src/job_scout/tracing.py::configure_opik`).
Each run wraps the compiled graph with `track_langgraph`, which:

- Produces a **span tree per graph node** (fetch_jobs →
  rank_jobs → …).
- Enables **Show Agent Graph** in the trace sidebar (graph auto-extracted).
- Auto-computes **per-run cost** for OpenAI models (e.g. gpt-4o-mini).

Per run we also attach:

- **The uploaded CV PDF** as a trace attachment (`attach_cv`) — Phase 2's
  PDF-aware judge reasons over it.
- **Metadata**: `git_sha`, `model`, `jobs_source`, reformulation count, job
  counts.
- **Tags**: `phase-1`, and `ui` (app) or `batch` (baseline runner).
- **thread_id**: the Gradio session id, so Phase 2's second invocation lands on
  the same thread.

## 3. Prompt library

The prompt constants in `src/job_scout/graph/prompts/` are registered in the Opik
prompt library at startup (`register_prompts`). The local constants remain the
source of truth; Opik mirrors them and versions on content change. Phase 3's
optimizer depends on this version history.

## 4. Verifying it works

Run the app (`make app`), upload a fixture CV, and open the project in Opik. You
should see: the span tree, a working **Show Agent Graph**, a cost > $0 (for API
models), and the CV attached to the trace.

## 5. Online evaluation rules — Phase 2

Online rules run an LLM judge on a **sample of live traces** as they arrive —
no batch job, no code change. Configured in the Opik UI (verified against the
Opik docs at the time of writing — the UI ships weekly, expect drift):

1. Open the **job-scout** project → **Rules** tab → **Create new rule**.
2. **Rule 1 — Hallucination (built-in template):**
   - Name: `hallucination-on-ranking`.
   - Sampling rate: `20%` (judges cost money on every sampled trace — start low).
   - Model: `gpt-4o-mini` (any configured LLM provider works).
   - Prompt: pick the built-in **Hallucination** template.
   - Variable mapping: `{{input}}` → the trace input, `{{output}}` → the trace
     output (the final state includes `ranked_jobs` with the explanations).
3. **Rule 2 — FitExplanationQuality (custom):**
   - Same flow, but choose a custom prompt and paste the rubric from
     `src/job_scout/evals/metrics.py` (`FIT_EXPLANATION_TASK_INTRODUCTION` +
     `FIT_EXPLANATION_CRITERIA`) with `{{variable}}` placeholders mapped to the
     trace output. Keeping the rubric text identical to the offline metric is
     the point: one rubric, three uses (offline experiments, online rule,
     calibration).
4. **Rule 3 — cover letter vs CV (the grounding judge):**
   - Runs on tailoring traces. Map `{{cv}}` → `output.cv_text` and
     `{{letter}}` → `output.tailoring.cover_letter` (the tailor invocation's
     final state carries both — a payoff of the single-graph, checkpointed
     design), with a prompt like: *"Does the letter claim experience, tools,
     or numbers that the CV does not support? List unsupported claims and
     score 0 (fabricated) to 1 (fully grounded)."*

**Honest limitation (found while building, kept as a finding):** we attach the
CV **PDF** to every trace (`attach_cv`) intending a PDF-attachment-aware judge,
but online rules can currently only map **trace input/output variables** — they
cannot read trace attachments. Rule 3 above is the fallback: it judges against
the extracted `cv_text` instead of the original PDF, which means PDF-extraction
errors are invisible to it. Documented in `docs/phase2_findings.md`; revisit
as Opik ships (the docs already mention vision-capable models for images).

Rules score only traces that arrive **after** the rule is created; use the
brain icon on the rule to backfill historical traces.

## 6. Annotation queues — Phase 2

The human layer: a reviewer works through a focused queue instead of spelunking
traces. Everything is scripted:

```bash
uv run python scripts/setup_annotation_queue.py --queue
```

This creates two **feedback definitions** — `ranking_reasonable` (categorical
0/1) and `letter_quality` (numerical 1–5) — and the traces queue
**job-scout-phase2-review**, pre-loaded with the review-worthy traces:
tailor-batch runs with `fabrication_flags > 0` and baseline runs whose best fit
score is under 60.

Reviewer workflow (UI): open **Annotation Queues** → `job-scout-phase2-review`
(shareable link) → for each trace, read the run, score the defined feedback
metrics, add comments, **Submit and continue**. Scores land on the traces as
feedback scores, filterable in the project view.

The related judge-vs-human calibration lives in
`data/labels/ranking_calibration.csv` (scaffolded via
`setup_annotation_queue.py --scaffold-calibration`, hand-labeled, scored by
`run_evals.py --calibration`); results go in `docs/phase2_eval_report.md`.
