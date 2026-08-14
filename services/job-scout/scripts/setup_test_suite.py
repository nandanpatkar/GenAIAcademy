"""Create and run the Opik Test Suite for tailoring (Phase 3 regression gate).

Test Suites are Opik's 2026 product answer to "experiments as gates": items
carry natural-language assertions graded by an LLM judge, an execution policy
absorbs non-determinism, and every run lands as an experiment you can compare
in the UI (and hand to Ollie: "run the tailoring suite against the new
prompt"). This suite complements — never replaces — the deterministic pytest
gate in gates/test_eval_gates.py: assertions here are judged, so they live on
the "unverifiable" side of Phase 2's line.

Usage:
    uv run python scripts/setup_test_suite.py --create        # build/refresh the suite (free)
    uv run python scripts/setup_test_suite.py --run           # cost estimate only
    uv run python scripts/setup_test_suite.py --run --yes     # regenerate packs + judge assertions
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

SUITE_NAME = "job-scout-tailoring-suite"
SOURCE_DATASET = "job-scout-tailoring-cases"
MAX_ITEMS = 8  # enough signal for a gate, small enough to stay cents
COST_HINT = 0.10

ASSERTIONS = [
    "Every bullet in the tailored CV names a corpus_ref id that appears in the corpus listing included in the input.",
    "The cover letter is under 350 words and mentions at least two specific requirements from the job description.",
    "The honesty_note names at least one real gap between the candidate and the job instead of being empty or generic praise.",
]


def _suite(client):
    return client.get_or_create_test_suite(
        name=SUITE_NAME,
        global_assertions=ASSERTIONS,
        global_execution_policy={"runs_per_item": 1, "pass_threshold": 1},
    )


def _items(client) -> list[dict]:
    from job_scout.corpus import build_corpus

    rows = []
    for item in client.get_dataset(SOURCE_DATASET).get_items():
        if not item.get("cv_text") or not item.get("job_description"):
            continue
        rows.append(
            {
                "data": {
                    "cv_text": item["cv_text"],
                    "corpus_text": build_corpus(item["cv_text"]).render_for_prompt(),
                    "job_title": item.get("job_title", ""),
                    "job_company": item.get("job_company", ""),
                    "job_description": (item.get("job_description") or "")[:4000],
                }
            }
        )
    return rows[:MAX_ITEMS]


def _task(item: dict) -> dict:
    """Live tailoring through the production prompt + structured output."""
    from job_scout.config import get_settings
    from job_scout.graph.prompts.tailor import TAILOR_PROMPT
    from job_scout.graph.schemas import TailoringPack
    from job_scout.llm import get_chat_model

    data = item.get("data", item)
    prompt = TAILOR_PROMPT.format(
        research_rule="",
        profile="(see corpus)",
        corpus=data["corpus_text"],
        job=f"title: {data['job_title']}\ncompany: {data['job_company']}\ndescription: {data['job_description']}",
        research="(none)",
    )
    model = get_chat_model(get_settings().scout_tailor_model, temperature=0.3)
    pack = TailoringPack.model_validate(model.with_structured_output(TailoringPack).invoke(prompt))
    # Both keys are required: run_tests rejects a result missing "input".
    return {"input": data, "output": pack.model_dump()}


def main() -> None:
    parser = argparse.ArgumentParser(description="Create/run the Opik tailoring Test Suite (LLM-judged gate).")
    parser.add_argument("--create", action="store_true")
    parser.add_argument("--run", action="store_true")
    parser.add_argument("--yes", action="store_true")
    args = parser.parse_args()
    if not (args.create or args.run):
        parser.error("pass --create and/or --run")

    from run_evals import _client

    client = _client()
    suite = _suite(client)

    if args.create:
        rows = _items(client)
        suite.insert(rows)  # type: ignore[arg-type] - documented dict form
        print(f"suite '{SUITE_NAME}': {len(rows)} items, {len(ASSERTIONS)} global assertions")

    if args.run:
        print(f"run estimate: ~${COST_HINT:.2f} ({MAX_ITEMS} regenerations + judged assertions)")
        if not args.yes:
            print("Re-run with --yes to spend.")
            sys.exit(0)
        import opik

        result = opik.run_tests(test_suite=suite, task=_task, experiment_name="tailoring-suite-gate")
        rate = result.pass_rate if result.pass_rate is not None else 0.0
        print(f"pass rate: {rate:.0%} ({result.items_passed}/{result.items_total})")
        sys.exit(0 if rate >= 0.75 else 1)


if __name__ == "__main__":
    main()
