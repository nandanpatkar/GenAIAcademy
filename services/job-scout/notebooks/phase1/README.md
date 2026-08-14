# Phase 1 — Build the agent, instrumented from minute one

The companion notebook is [`../phase1_walkthrough.ipynb`](../phase1_walkthrough.ipynb).

## Contents

The notebook walks top-to-bottom:

1. **Environment check** — versions and settings load.
2. **Service / key checks** — what's configured (runs fine with none).
3. **Read a fixture CV** — text extraction from a synthetic PDF.
4. **Run the agent** — streamed node-level progress, same as the app.
5. **Explore profile + rankings** — the structured output.
6. **Explore the trace in Opik** — span tree, agent graph, cost, CV attachment.
7. **Baseline batch** — how to produce `reports/baseline.json`.

## Learning objectives

- See a LangGraph agent with a conditional reformulation loop end-to-end.
- Understand the tool-calling `fetch_jobs` node (the LLM chooses search args).
- Get Opik tracing working from the first run: cost, spans, agent graph.

## Run it

```bash
uv sync --all-groups
uv run jupyter notebook notebooks/phase1_walkthrough.ipynb
```

No keys are required to run the notebook (it falls back to Remotive + the cached
dataset and skips tracing). Add keys for live jobs and Opik traces.

## Next steps

Phase 2 adds the tailoring node and the full evaluation stack (datasets,
metrics, online rules). Tag `phase-1` marks this blog-ready checkpoint.
