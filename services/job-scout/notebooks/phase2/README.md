# Phase 2 — Tailoring + the Evaluation Stack

Companion notes for [`../phase2_evaluation.ipynb`](../phase2_evaluation.ipynb).

## What this phase adds

- **Application preparation:** pick a ranked job → get a cover letter + a
  tailored one-page CV (LaTeX → PDF via tectonic), where every bullet carries a
  `corpus_ref` back to the candidate's real experience.
- **The CandidateCorpus:** CV text + an optional official LinkedIn data export
  (stdlib ZIP/CSV parsing only — no API clients, no scrapers, real exports
  never committed or traced).
- **A deterministic fabrication validator:** flags any claim it cannot ground.
  Logs, never retries — flags are shown to the user and become eval data.
- **The evaluation stack:** hand-labeled + trace-exported datasets, verifiable
  metrics vs LLM judges, trajectory metrics, online rules, judge-vs-human
  calibration, and an annotation queue.

## Learning objectives

1. **Checkpointed multi-invocation agents.** One compiled graph, one
   `MemorySaver`, one `thread_id`: the tailor invocation reads the search
   invocation's state and re-runs nothing. Includes the stale-state bug demo
   (§7 of the notebook) — why the runner explicitly nulls `selected_job_id`.
2. **Verifiable checks vs unverifiable judgments.** Field accuracy and
   fabrication rate are computable and exact; explanation quality needs an LLM
   judge — whose agreement with humans must be *measured* (calibration), not
   assumed.
3. **Datasets from production traces.** `ranking-cases` and `tailoring-cases`
   are exported from real tagged runs, with provenance on every item.
4. **The human layer.** Feedback definitions, an annotation queue over the
   review-worthy traces, and a 10-case calibration table.

## Run it

```bash
uv sync --all-groups
cp .env.example .env       # add OPENAI_API_KEY + OPIK_API_KEY for the full lesson
uv run jupyter lab notebooks/phase2_evaluation.ipynb
```

Scripted counterparts (each prints a cost projection and needs `--yes`):

```bash
make tailor-batch                                   # ~20 search+tailor runs
make eval-datasets                                  # traces → Opik datasets
uv run python scripts/run_evals.py --suite ranking --judge-model gpt-4o-mini --yes
uv run python scripts/run_evals.py --suite ranking --judge-model gpt-4.1-mini --yes
uv run python scripts/run_evals.py --trajectory --yes
make queue                                          # annotation queue
```

Hand-labeling steps (yours, deliberately): correct
`data/labels/expected_profiles.yaml` (then `build_extraction_dataset.py
--push`), and fill `data/labels/ranking_calibration.csv` (then `run_evals.py
--calibration`).

## Learning materials

- [LangGraph persistence & threads](https://langchain-ai.github.io/langgraph/concepts/persistence/)
- [Opik evaluation concepts](https://www.comet.com/docs/opik/evaluation/overview)
- [Opik online evaluation rules](https://www.comet.com/docs/opik/production/rules)
- [G-Eval: LLM-as-judge with chain-of-thought rubrics](https://arxiv.org/abs/2303.16634)
- [tectonic (single-binary LaTeX)](https://tectonic-typesetting.github.io/)

## Next

Phase 3 closes the loop: test suites lock in expectations, the documented
weaknesses get fixed through a trace-driven workflow, and the deliberately
unpolished ranking + tailoring prompts get optimized — with before/after
numbers. The weaknesses carried forward live in `docs/phase2_findings.md`.
