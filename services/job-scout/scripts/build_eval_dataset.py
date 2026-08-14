"""Build the ranking-cases / tailoring-cases datasets from production traces.

Eval step 2: real Opik traces (not synthetic prompts) become dataset items, with
provenance (trace id, thread id, span id, source tag, export time) kept in each
item so any dataset row can be traced back to the run that produced it.

    uv run python scripts/build_eval_dataset.py --kind ranking            # dry: print items
    uv run python scripts/build_eval_dataset.py --kind ranking --push     # push to Opik
    uv run python scripts/build_eval_dataset.py --kind tailoring --push

ranking-cases  (~30): one item per ranked job, from ``baseline-batch`` traces.
tailoring-cases (~20): one item per tailoring run, from ``tailor-batch`` traces.

Needs OPIK_API_KEY; makes no LLM calls.
"""

from __future__ import annotations

import argparse
import sys
from datetime import UTC, datetime
from typing import Any

RANKING_DATASET = "job-scout-ranking-cases"
TAILORING_DATASET = "job-scout-tailoring-cases"
RANKING_TAG = "baseline-batch"
TAILORING_TAG = "tailor-batch"
MAX_RANKING_ITEMS = 30
MAX_TAILORING_ITEMS = 20


def _client():
    from job_scout.tracing import configure_opik

    if not configure_opik():
        sys.exit("Opik is not configured (OPIK_API_KEY / OPIK_ENABLED) — cannot read traces.")
    import opik

    return opik.Opik()


def _as_dict(value: Any) -> dict:
    return value if isinstance(value, dict) else {}


def _provenance(trace, span_id: str | None, tag: str) -> dict:
    return {
        "trace_id": str(trace.id),
        "thread_id": getattr(trace, "thread_id", None),
        "span_id": span_id,
        "source_tag": tag,
        "exported_at": datetime.now(UTC).isoformat(timespec="seconds"),
    }


def _find_spans(client, trace_id: str, name: str) -> list:
    spans = client.search_spans(project_name=_project(), trace_id=trace_id, truncate=False)
    return [s for s in spans if getattr(s, "name", "") == name]


def _project() -> str:
    from job_scout.config import get_settings

    return get_settings().opik_project_name


def build_ranking_items(client, max_items: int) -> list[dict]:
    """One item per ranked job, sampled from the traces' final state.

    The trace OUTPUT carries the final graph state (profile + the full sorted
    ``ranked_jobs``); per-trace we sample the best, middle, and worst-ranked
    job so the dataset spans the score range instead of exhausting one run.
    """
    traces = client.search_traces(project_name=_project(), filter_string=f'tags contains "{RANKING_TAG}"', truncate=False)
    print(f"found {len(traces)} '{RANKING_TAG}' traces")
    items: list[dict] = []
    for trace in traces:
        state = _as_dict(getattr(trace, "output", None))
        profile = _as_dict(state.get("profile"))
        ranked = [_as_dict(r) for r in state.get("ranked_jobs") or []]
        if not profile or not ranked:
            continue
        picks = sorted({0, len(ranked) // 2, len(ranked) - 1})
        for index in picks:
            entry = ranked[index]
            job = _as_dict(entry.get("job"))
            if not job:
                continue
            items.append(
                {
                    "profile": profile,
                    "job_title": job.get("title", ""),
                    "job_company": job.get("company", ""),
                    "job_location": job.get("location", ""),
                    "job_description": job.get("description", ""),
                    "fit_score": entry.get("fit_score"),
                    "fit_explanation": entry.get("fit_explanation", ""),
                    "matched_skills": entry.get("matched_skills", []),
                    "gaps": entry.get("gaps", []),
                    "rank_index": index,
                    "provenance": _provenance(trace, None, RANKING_TAG),
                }
            )
            if len(items) >= max_items:
                return items
    return items


def build_tailoring_items(client, max_items: int) -> list[dict]:
    """One item per tailoring run: the checkpointed inputs + the generated pack."""
    traces = client.search_traces(project_name=_project(), filter_string=f'tags contains "{TAILORING_TAG}"', truncate=False)
    print(f"found {len(traces)} '{TAILORING_TAG}' traces")
    items: list[dict] = []
    for trace in traces:
        for span in _find_spans(client, str(trace.id), "tailor"):
            # A LangGraph node span's input is the full checkpointed state, so
            # the search-invocation fields (cv_text, ranked_jobs) are available
            # even though the tailor invocation only passed selected_job_id.
            state = _as_dict(getattr(span, "input", None))
            pack = _as_dict(getattr(span, "output", None)).get("tailoring")
            cv_text = state.get("cv_text", "")
            job_id = state.get("selected_job_id")
            ranked = [_as_dict(r) for r in state.get("ranked_jobs") or []]
            job = next((_as_dict(r.get("job")) for r in ranked if _as_dict(r.get("job")).get("job_id") == job_id), {})
            if not cv_text or pack is None:
                continue
            items.append(
                {
                    "cv_text": cv_text,
                    "profile": _as_dict(state.get("profile")),
                    "selected_job_id": job_id,
                    "job_title": job.get("title", ""),
                    "job_company": job.get("company", ""),
                    "job_description": job.get("description", ""),
                    "pack": _as_dict(pack),
                    "provenance": _provenance(trace, str(span.id), TAILORING_TAG),
                }
            )
            if len(items) >= max_items:
                return items
    return items


def main() -> None:
    parser = argparse.ArgumentParser(description="Build eval datasets from Opik traces")
    parser.add_argument("--kind", choices=["ranking", "tailoring"], required=True)
    parser.add_argument("--max", type=int, default=None, help="max items (defaults: 30 ranking / 20 tailoring)")
    parser.add_argument("--push", action="store_true", help="push to Opik (default: dry run, print only)")
    args = parser.parse_args()

    client = _client()
    if args.kind == "ranking":
        items = build_ranking_items(client, args.max or MAX_RANKING_ITEMS)
        dataset_name, description = RANKING_DATASET, "Ranked-job cases exported from baseline-batch traces (Phase 2)."
    else:
        items = build_tailoring_items(client, args.max or MAX_TAILORING_ITEMS)
        dataset_name, description = TAILORING_DATASET, "Tailoring cases exported from tailor-batch traces (Phase 2)."

    print(f"built {len(items)} {args.kind} items")
    if not items:
        sys.exit("No items — run the corresponding batch first (run_batch.py / run_tailor_batch.py).")
    if not args.push:
        preview = {k: (str(v)[:80] + "…" if len(str(v)) > 80 else v) for k, v in items[0].items()}
        print("dry run; first item preview:")
        for key, value in preview.items():
            print(f"  {key}: {value}")
        return

    dataset = client.get_or_create_dataset(dataset_name, description=description)
    dataset.insert(items)  # Opik dedupes identical items — safe to re-run
    print(f"Pushed {len(items)} items to Opik dataset '{dataset_name}'.")


if __name__ == "__main__":
    main()
