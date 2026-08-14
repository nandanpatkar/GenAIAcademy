"""Set up the Phase 2 human-review layer in Opik (eval step 6).

    uv run python scripts/setup_annotation_queue.py --queue
        Creates the feedback definitions (ranking_reasonable 0/1,
        letter_quality 1-5) and the annotation queue
        ``job-scout-phase2-review``, then adds the review-worthy traces:
        tailor-batch traces with fabrication flags, and baseline traces whose
        best fit score is under 60.

    uv run python scripts/setup_annotation_queue.py --scaffold-calibration
        Samples 10 rows from the ``job-scout-ranking-cases`` dataset into
        data/labels/ranking_calibration.csv for HAND labeling
        (fill human_ranking_reasonable with 0/1, add human_notes), consumed by
        ``run_evals.py --calibration``.

Needs OPIK_API_KEY; makes no LLM calls.
"""

from __future__ import annotations

import argparse
import contextlib
import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CALIBRATION_CSV = ROOT / "data" / "labels" / "ranking_calibration.csv"

QUEUE_NAME = "job-scout-phase2-review"
RANKING_DATASET = "job-scout-ranking-cases"
LOW_FIT_THRESHOLD = 60
CALIBRATION_ROWS = 10


def _client():
    from job_scout.tracing import configure_opik

    if not configure_opik():
        sys.exit("Opik is not configured (OPIK_API_KEY / OPIK_ENABLED).")
    import opik

    return opik.Opik()


def _project() -> str:
    from job_scout.config import get_settings

    return get_settings().opik_project_name


def create_feedback_definitions(client) -> None:
    """Create the two feedback definitions (idempotent-ish: duplicates are skipped by the API or harmless)."""
    from opik.rest_api.types import (
        CategoricalFeedbackDetailCreate,
        FeedbackCreate_Categorical,
        FeedbackCreate_Numerical,
        NumericalFeedbackDetailCreate,
    )

    with contextlib.suppress(Exception):  # already exists -> keep going
        client.rest_client.feedback_definitions.create_feedback_definition(
            request=FeedbackCreate_Categorical(
                name="ranking_reasonable",
                details=CategoricalFeedbackDetailCreate(categories={"no": 0.0, "yes": 1.0}),
            )
        )
    with contextlib.suppress(Exception):
        client.rest_client.feedback_definitions.create_feedback_definition(
            request=FeedbackCreate_Numerical(
                name="letter_quality",
                details=NumericalFeedbackDetailCreate(min=1.0, max=5.0),
            )
        )
    print("feedback definitions ensured: ranking_reasonable (0/1), letter_quality (1-5)")


def _review_worthy_traces(client) -> list:
    """Traces a human should look at: fabrication-flagged or low-fit runs."""
    project = _project()
    picked: list = []

    for trace in client.search_traces(project_name=project, filter_string='tags contains "tailor-batch"', truncate=False):
        output = trace.output if isinstance(trace.output, dict) else {}
        if output.get("fabrication_flags", 0) > 0:
            picked.append(trace)

    for trace in client.search_traces(project_name=project, filter_string='tags contains "baseline-batch"', truncate=False):
        output = trace.output if isinstance(trace.output, dict) else {}
        ranked = output.get("ranked_jobs") or []
        scores = [r.get("fit_score", 0) for r in ranked if isinstance(r, dict)]
        if scores and max(scores) < LOW_FIT_THRESHOLD:
            picked.append(trace)

    return picked


def create_queue(client) -> None:
    create_feedback_definitions(client)
    queue = client.create_traces_annotation_queue(
        name=QUEUE_NAME,
        project_name=_project(),
        description="Phase 2 human review: fabrication-flagged tailoring runs and low-fit searches.",
        instructions=(
            "For search traces: is the ranking reasonable for this candidate (ranking_reasonable)? "
            "For tailoring traces: rate the cover letter 1-5 (letter_quality) and check the flagged claims."
        ),
        comments_enabled=True,
        feedback_definition_names=["ranking_reasonable", "letter_quality"],
    )
    traces = _review_worthy_traces(client)
    if traces:
        queue.add_traces(traces)
    print(f"queue '{QUEUE_NAME}' ready with {len(traces)} traces (fabrication-flagged or max fit < {LOW_FIT_THRESHOLD}).")


def scaffold_calibration(client) -> None:
    """Sample dataset items into the hand-labeling CSV (does not overwrite labels)."""
    if CALIBRATION_CSV.exists():
        sys.exit(f"{CALIBRATION_CSV} already exists — refusing to overwrite hand labels. Delete it to re-scaffold.")
    dataset = client.get_or_create_dataset(RANKING_DATASET)
    items = dataset.get_items()
    if len(items) < CALIBRATION_ROWS:
        sys.exit(f"Dataset '{RANKING_DATASET}' has only {len(items)} items — build it first (build_eval_dataset.py).")

    # Deterministic spread: every k-th item across the score range.
    step = max(1, len(items) // CALIBRATION_ROWS)
    sample = items[::step][:CALIBRATION_ROWS]

    CALIBRATION_CSV.parent.mkdir(parents=True, exist_ok=True)
    with CALIBRATION_CSV.open("w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(
            [
                "case_id",
                "dataset_item_id",
                "trace_id",
                "job_title",
                "profile_summary",
                "fit_score",
                "fit_explanation",
                "human_ranking_reasonable",
                "human_notes",
            ]
        )
        for n, item in enumerate(sample, start=1):
            profile = item.get("profile", {})
            summary = (
                f"{profile.get('seniority', '?')} {'/'.join(profile.get('primary_roles', [])[:2])}; "
                f"skills: {', '.join(profile.get('skills', [])[:8])}"
            )
            writer.writerow(
                [
                    f"cal-{n:02d}",
                    item.get("id", ""),
                    (item.get("provenance") or {}).get("trace_id", ""),
                    item.get("job_title", ""),
                    summary,
                    item.get("fit_score", ""),
                    item.get("fit_explanation", ""),
                    "",  # human fills 0/1
                    "",
                ]
            )
    print(f"Wrote {len(sample)} rows to {CALIBRATION_CSV} — hand-label human_ranking_reasonable (0/1), then run:")
    print("  uv run python scripts/run_evals.py --calibration")


def main() -> None:
    parser = argparse.ArgumentParser(description="Phase 2 annotation queue + calibration scaffold")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--queue", action="store_true", help="create feedback definitions + queue, add traces")
    group.add_argument("--scaffold-calibration", action="store_true", help="sample the calibration CSV for hand labeling")
    args = parser.parse_args()

    client = _client()
    if args.queue:
        create_queue(client)
    else:
        scaffold_calibration(client)


if __name__ == "__main__":
    main()
