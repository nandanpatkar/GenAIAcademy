"""Optimize the tailor prompt against the deterministic fabrication check.

Phase 3, weakness #7: the first-draft tailor prompt drifts (every Phase 2
batch run produced fabrication flags). This harness points Opik's Agent
Optimizer at the prompt with OUR OWN deterministic metric — the same
``validate_pack`` the live node runs — so the optimizer chases verifiable
grounding, not a judge's opinion. (Optimizing the ranking prompt against its
judge-based metric is deliberately NOT done: Phase 2 measured the judge split
0.44 vs 0.84, and optimizing against a judge chases the judge.)

The optimizable part is the instruction block only; the context blocks
(profile / corpus / job) and the JSON output contract stay fixed in the user
message, so the optimizer cannot bargain with the output schema.

Usage:
    uv run --extra optimize python scripts/optimize_tailor_prompt.py            # print plan + cost estimate
    uv run --extra optimize python scripts/optimize_tailor_prompt.py --yes      # run
Writes docs/phase3/optimizer_result.json and prints the optimized instructions.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from job_scout.corpus import build_corpus
from job_scout.graph.prompts.tailor import TAILOR_PROMPT
from job_scout.graph.schemas import TailoringPack
from job_scout.validation import validate_pack

ROOT = Path(__file__).resolve().parent.parent
RESULT_PATH = ROOT / "docs" / "phase3" / "optimizer_result.json"
SOURCE_DATASET = "job-scout-tailoring-cases"
DERIVED_DATASET = "job-scout-tailor-opt"

_SPLIT_MARKER = "\n\nCandidate profile:"
_FENCE = re.compile(r"^```(?:json)?\s*|\s*```$", re.MULTILINE)

JSON_CONTRACT = (
    "Return ONLY a JSON object (no markdown fences, no commentary) with exactly these keys: "
    '{"cv": {"headline": str, "summary": str, "experience": [{"role": str, "company": str, '
    '"dates": str, "bullets": [{"text": str, "corpus_ref": str}]}], "skills": [str], '
    '"education": [str]}, "cover_letter": str, "honesty_note": str}'
)


def _split_prompt() -> tuple[str, str]:
    """The instruction block (optimizable) and the context template (fixed)."""
    instructions, context = TAILOR_PROMPT.split(_SPLIT_MARKER, 1)
    instructions = instructions.replace("{research_rule}", "").rstrip()
    user_template = (
        "Candidate profile:\n{profile_text}\n\n"
        "Candidate corpus:\n{corpus_text}\n\n"
        "Target job:\n{job_text}\n\n"
        "Company research (may be empty):\n(none)\n\n" + JSON_CONTRACT
    )
    del context  # rebuilt above with derived-dataset placeholder names
    return instructions, user_template


def _render_profile(profile: dict) -> str:
    return "\n".join(f"{key}: {value}" for key, value in profile.items() if value not in (None, "", []))


def _render_job(item: dict) -> str:
    return (
        f"title: {item.get('job_title', '')}\n"
        f"company: {item.get('job_company', '')}\n"
        f"description: {(item.get('job_description') or '')[:4000]}"
    )


def _build_derived_dataset(client):
    """Derive prompt-ready rows from the Phase 2 tailoring dataset."""
    source = client.get_dataset(SOURCE_DATASET)
    rows = []
    for item in source.get_items():
        if not item.get("cv_text") or not item.get("job_description"):
            continue  # the deliberate unknown-job case has no job payload
        corpus = build_corpus(item["cv_text"])
        rows.append(
            {
                "cv_text": item["cv_text"],
                "job_title": item.get("job_title", ""),
                "job_company": item.get("job_company", ""),
                "profile_text": _render_profile(item.get("profile") or {}),
                "corpus_text": corpus.render_for_prompt(),
                "job_text": _render_job(item),
            }
        )
    dataset = client.get_or_create_dataset(name=DERIVED_DATASET)
    dataset.insert(rows)  # exact duplicates are deduplicated by Opik
    return dataset, len(rows)


def grounded_score(dataset_item: dict, llm_output: str):
    """1 - fabrication rate, straight from the live validator. Deterministic."""
    from opik.evaluation.metrics.score_result import ScoreResult

    try:
        pack = TailoringPack.model_validate(json.loads(_FENCE.sub("", llm_output.strip())))
    except Exception as exc:  # noqa: BLE001 - any parse failure is a zero, with the reason
        return ScoreResult(name="grounded_score", value=0.0, reason=f"output did not parse as a TailoringPack: {exc}")

    corpus = build_corpus(dataset_item["cv_text"])
    title, company = dataset_item.get("job_title", ""), dataset_item.get("job_company", "")
    report = validate_pack(pack, corpus, job_context=[f"{title} at {company}", company])
    if not report.claims_checked:
        return ScoreResult(name="grounded_score", value=0.0, reason="pack contained no checkable claims")
    rate = report.flags / report.claims_checked
    reasons = "; ".join(flag.reason for flag in report.flagged[:5]) or "fully grounded"
    return ScoreResult(
        name="grounded_score", value=1.0 - rate, reason=f"{report.flags}/{report.claims_checked} flagged: {reasons}"
    )


def main() -> None:
    parser = argparse.ArgumentParser(description="Optimize the tailor prompt with a deterministic grounding metric.")
    parser.add_argument("--yes", action="store_true", help="actually spend money")
    parser.add_argument("--optimizer", choices=("hrpo", "meta"), default="hrpo")
    parser.add_argument("--model", default="openai/gpt-4.1-mini", help="task model (LiteLLM id, matches production)")
    parser.add_argument("--reasoning-model", default="openai/gpt-4.1-mini")
    parser.add_argument("--max-trials", type=int, default=5)
    parser.add_argument("--n-samples", type=int, default=12)
    args = parser.parse_args()

    est_calls = (1 + args.max_trials) * args.n_samples
    print(f"plan: {args.optimizer} · task {args.model} · {args.max_trials} trials × {args.n_samples} samples")
    print(f"estimated task-model calls ≈ {est_calls} (plus reflection calls); expect roughly $0.5-2.")
    print("ground truth lands in result.llm_cost_total after the run.")
    if not args.yes:
        print("\nDry plan only. Re-run with --yes to spend.")
        sys.exit(0)

    sys.path.insert(0, str(ROOT / "scripts"))
    from run_evals import _client  # configure_opik + OPENAI key export

    client = _client()
    dataset, n_rows = _build_derived_dataset(client)
    print(f"derived dataset '{DERIVED_DATASET}': {n_rows} rows")

    from opik_optimizer import ChatPrompt, HierarchicalReflectiveOptimizer, MetaPromptOptimizer

    instructions, user_template = _split_prompt()
    prompt = ChatPrompt(system=instructions, user=user_template, model=args.model)
    optimizer_cls = HierarchicalReflectiveOptimizer if args.optimizer == "hrpo" else MetaPromptOptimizer
    optimizer = optimizer_cls(model=args.reasoning_model)

    result = optimizer.optimize_prompt(
        prompt=prompt,
        dataset=dataset,
        metric=grounded_score,
        max_trials=args.max_trials,
        n_samples=args.n_samples,
    )
    result.display()

    optimized = result.prompt.get_messages() if hasattr(result.prompt, "get_messages") else result.prompt
    RESULT_PATH.parent.mkdir(parents=True, exist_ok=True)
    RESULT_PATH.write_text(
        json.dumps(
            {
                "optimizer": args.optimizer,
                "task_model": args.model,
                "reasoning_model": args.reasoning_model,
                "max_trials": args.max_trials,
                "n_samples": args.n_samples,
                "initial_score": result.initial_score,
                "final_score": result.score,
                "llm_calls": result.llm_calls,
                "llm_cost_total": result.llm_cost_total,
                "optimized_messages": optimized,
                "history": result.history,
            },
            indent=2,
            default=str,
        )
        + "\n"
    )
    print(f"\nwrote {RESULT_PATH}")
    print("\n--- optimized instruction block (apply to prompts/tailor.py by hand) ---\n")
    system_message = next((m["content"] for m in optimized if m.get("role") == "system"), "")
    print(system_message)


if __name__ == "__main__":
    main()
