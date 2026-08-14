"""Phase 2 offline evaluation harness (eval steps 3-4) + judge calibration.

Suites (each logs an Opik experiment; run one suite with two --model values to
populate the experiment-comparison view):

    uv run python scripts/run_evals.py --suite extraction --yes
        ProfileFieldAccuracy (deterministic) over job-scout-extraction-cases.
        Re-extracts each CV with the current prompt/model (4 LLM calls).

    uv run python scripts/run_evals.py --suite ranking --yes
        FitExplanationQuality (custom G-Eval) + Hallucination + AnswerRelevance
        (built-in judges) over the fit explanations in job-scout-ranking-cases.
        Judges the LOGGED explanations — no re-ranking, ~3 judge calls/item.

    uv run python scripts/run_evals.py --suite tailoring --yes
        Re-tailors each case with the current prompt/model, then FabricationRate
        (deterministic) + Hallucination on the cover letter. Links the tailor
        prompt version to the experiment.

    uv run python scripts/run_evals.py --trajectory --yes
        Built-in agent trajectory judges (TrajectoryAccuracy, tool correctness,
        task completion) over >= 20 baseline-batch + tailor-batch traces;
        scores are written back onto the traces as feedback scores.

    uv run python scripts/run_evals.py --calibration
        Judge-vs-human agreement on data/labels/ranking_calibration.csv
        (see scripts/README note in docs; the CSV is hand-labeled).

All suites need OPIK_API_KEY. LLM-judge suites cost money; every run prints a
projection and requires --yes.
"""

from __future__ import annotations

import argparse
import csv
import statistics
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CALIBRATION_CSV = ROOT / "data" / "labels" / "ranking_calibration.csv"

EXTRACTION_DATASET = "job-scout-extraction-cases"
RANKING_DATASET = "job-scout-ranking-cases"
TAILORING_DATASET = "job-scout-tailoring-cases"

# The custom G-Eval judge binarization point for calibration: scores >= this
# count as "judge says the ranking explanation is reasonable".
JUDGE_BINARY_THRESHOLD = 0.5

_COST_HINTS = {
    "extraction": "~4 extraction LLM calls (~$0.01)",
    "ranking": "~3 judge calls per item, ~30 items (~$0.30-1.00)",
    "tailoring": "1 tailor + 2 judge calls per item, ~20 items (~$0.30-1.00)",
    "trajectory": "3 judge calls per trace, ~20+ traces (~$0.50-1.50)",
}


def _client():
    from job_scout.llm import _export_openai_key
    from job_scout.tracing import configure_opik

    if not configure_opik():
        sys.exit("Opik is not configured (OPIK_API_KEY / OPIK_ENABLED).")
    _export_openai_key()  # Opik's LLM judges (LiteLLM) read os.environ, not .env
    import opik

    return opik.Opik()


def _experiment_config(model: str, judge_model: str | None = None) -> dict:
    from job_scout.tracing import git_sha

    config = {"model": model, "git_sha": git_sha()}
    if judge_model:
        config["judge_model"] = judge_model
    return config


def _judge_model_name(judge_model: str | None) -> str:
    # GEval/Hallucination accept LiteLLM-style names; None = library default.
    return judge_model or "gpt-4o-mini"


def _print_experiment(result) -> None:
    try:
        result.print()
    except Exception:  # noqa: BLE001 - printing is cosmetic
        print(f"experiment logged: {getattr(result, 'experiment_name', '?')}")


def run_extraction(model: str) -> None:
    from opik.evaluation import evaluate

    from job_scout.evals.metrics import ProfileFieldAccuracy
    from job_scout.profile import extract_profile

    client = _client()
    dataset = client.get_or_create_dataset(EXTRACTION_DATASET)

    def task(item: dict) -> dict:
        profile = extract_profile(item["cv_text"], model=model)
        return {"output": profile.model_dump(), "expected": item["expected"]}

    result = evaluate(
        dataset=dataset,
        task=task,
        scoring_metrics=[ProfileFieldAccuracy()],
        experiment_name=f"extraction-{model.split(':')[-1]}",
        experiment_config=_experiment_config(model),
        task_threads=2,
    )
    _print_experiment(result)
    _per_field_table(result)


def _per_field_table(result) -> None:
    """Aggregate the per-field metadata across test results into a table."""
    per_field: dict[str, list[float]] = {}
    try:
        for test_result in result.test_results:
            for score in test_result.score_results:
                for field, value in (score.metadata or {}).get("per_field", {}).items():
                    per_field.setdefault(field, []).append(value)
    except Exception:  # noqa: BLE001 - table is a convenience
        return
    if not per_field:
        return
    print("\n| field | mean accuracy |\n|---|---|")
    for field, values in sorted(per_field.items()):
        print(f"| {field} | {statistics.mean(values):.3f} |")


def run_ranking(model: str, judge_model: str | None) -> None:
    from opik.evaluation import evaluate
    from opik.evaluation.metrics import AnswerRelevance, Hallucination

    from job_scout.evals.metrics import fit_explanation_quality

    client = _client()
    dataset = client.get_or_create_dataset(RANKING_DATASET)
    judge = _judge_model_name(judge_model or model)

    def task(item: dict) -> dict:
        profile = item.get("profile", {})
        profile_text = f"skills: {', '.join(profile.get('skills', []))}; roles: {', '.join(profile.get('primary_roles', []))}"
        return {
            "input": f"Job: {item['job_title']} at {item['job_company']}. Candidate: {profile_text}",
            "output": item["fit_explanation"],
            "context": [profile_text, item.get("job_description", "")[:2000]],
        }

    result = evaluate(
        dataset=dataset,
        task=task,
        scoring_metrics=[
            fit_explanation_quality(judge),
            Hallucination(model=judge),
            AnswerRelevance(model=judge),
        ],
        experiment_name=f"ranking-judge-{judge.split('/')[-1]}",
        experiment_config=_experiment_config(model, judge),
        task_threads=4,
    )
    _print_experiment(result)


def run_tailoring(model: str, judge_model: str | None) -> None:
    import opik
    from opik.evaluation import evaluate
    from opik.evaluation.metrics import Hallucination

    from job_scout.corpus import build_corpus
    from job_scout.evals.metrics import FabricationRate
    from job_scout.graph.nodes.tailor import _render_job  # reuse the exact prompt rendering
    from job_scout.graph.prompts.tailor import TAILOR_PROMPT, TAILOR_PROMPT_NAME
    from job_scout.graph.schemas import Profile, RankedJob, TailoringPack
    from job_scout.llm import get_chat_model

    client = _client()
    dataset = client.get_or_create_dataset(TAILORING_DATASET)
    judge = _judge_model_name(judge_model)
    llm = get_chat_model(model, temperature=0.3).with_structured_output(TailoringPack)

    def task(item: dict) -> dict:
        from job_scout.graph.nodes.rank_jobs import _render_profile

        corpus = build_corpus(item["cv_text"])
        profile = Profile.model_validate(item["profile"])
        ranked = RankedJob.model_validate(
            {
                "job": {
                    "job_id": item["selected_job_id"] or "job",
                    "title": item["job_title"],
                    "company": item["job_company"],
                    "location": "",
                    "description": item.get("job_description", ""),
                    "source": "cache",
                },
                "fit_score": 50,
                "fit_explanation": "n/a (offline eval)",
            }
        )
        prompt = TAILOR_PROMPT.format(
            research_rule="",
            profile=_render_profile(profile),
            corpus=corpus.render_for_prompt(),
            job=_render_job(ranked),
            research="none",
        )
        pack: TailoringPack = llm.invoke(prompt)
        return {
            # FabricationRate reads `pack` (the whole thing); the Hallucination
            # judge reads input/output/context (the cover letter vs the CV).
            "pack": pack.model_dump(),
            "cv_text": item["cv_text"],
            "job_context": [f"{item['job_title']} at {item['job_company']}", item["job_company"]],
            "input": f"Write a cover letter for {item['job_title']} at {item['job_company']}",
            "output": pack.cover_letter,
            "context": [item["cv_text"][:3000]],
        }

    result = evaluate(
        dataset=dataset,
        task=task,
        scoring_metrics=[FabricationRate(), Hallucination(model=judge)],
        experiment_name=f"tailoring-{model.split(':')[-1]}",
        experiment_config=_experiment_config(model, judge),
        task_threads=2,
        prompts=[opik.Prompt(name=TAILOR_PROMPT_NAME, prompt=TAILOR_PROMPT)],
    )
    _print_experiment(result)


def _trajectory_from_spans(spans: list) -> list[dict]:
    steps = []
    for span in sorted(spans, key=lambda s: str(getattr(s, "start_time", ""))):
        if getattr(span, "parent_span_id", None) is not None:
            continue
        name = getattr(span, "name", "step")
        if name == "__start__":
            continue
        steps.append(
            {
                "thought": f"run graph node {name}",
                "action": name,
                "observation": str(getattr(span, "output", ""))[:1500],
            }
        )
    return steps


def run_trajectory(judge_model: str | None, min_traces: int = 20) -> None:
    from opik.evaluation.metrics import AgentTaskCompletionJudge, AgentToolCorrectnessJudge, TrajectoryAccuracy

    from job_scout.config import get_settings

    client = _client()
    project = get_settings().opik_project_name
    judge = _judge_model_name(judge_model)

    traces = []
    for tag in ("baseline-batch", "tailor-batch"):
        traces.extend(client.search_traces(project_name=project, filter_string=f'tags contains "{tag}"', truncate=False))
    # Keep graph-run traces only (they have node spans), newest first.
    traces = traces[: max(min_traces * 2, 40)]
    print(f"scoring trajectories on up to {len(traces)} traces with judge {judge}")

    metrics = {
        "trajectory_accuracy": TrajectoryAccuracy(model=judge, track=False),
        "agent_tool_correctness": AgentToolCorrectnessJudge(model=judge, track=False),
        "agent_task_completion": AgentTaskCompletionJudge(model=judge, track=False),
    }
    rows: list[dict] = []
    scored = 0
    for trace in traces:
        spans = client.search_spans(project_name=project, trace_id=str(trace.id), truncate=False)
        steps = _trajectory_from_spans(spans)
        if not steps:
            continue
        goal = str(getattr(trace, "input", ""))[:1500]
        final = str(getattr(trace, "output", ""))[:1500]
        feedback = []
        row = {"trace_id": str(trace.id), "n_steps": len(steps)}
        transcript = "\n".join(f"[{s['action']}] {s['observation'][:300]}" for s in steps)
        for name, metric in metrics.items():
            try:
                if name == "trajectory_accuracy":
                    score = metric.score(goal=goal, trajectory=steps, final_result=final)
                else:
                    score = metric.score(output=f"goal: {goal}\n{transcript}\nfinal: {final}")
                row[name] = score.value
                feedback.append({"id": str(trace.id), "name": name, "value": score.value, "reason": (score.reason or "")[:500]})
            except Exception as exc:  # noqa: BLE001 - one bad trace must not kill the sweep
                row[name] = None
                print(f"  {name} failed on {str(trace.id)[:8]}: {exc}")
        if feedback:
            client.log_traces_feedback_scores(feedback, project_name=project)
            rows.append(row)
            scored += 1
        if scored >= min_traces:
            break

    print(f"\nscored {scored} traces (feedback written back to Opik)")
    for name in metrics:
        values = [r[name] for r in rows if r.get(name) is not None]
        if values:
            print(f"| {name} | mean {statistics.mean(values):.3f} | n={len(values)} |")


def run_calibration(judge_model: str | None) -> None:
    """Judge-vs-human agreement on the 10 hand-labeled ranking cases."""
    if not CALIBRATION_CSV.exists():
        sys.exit(f"{CALIBRATION_CSV} not found — scaffold it via scripts/setup_annotation_queue.py --scaffold-calibration.")
    with CALIBRATION_CSV.open() as fh:
        rows = [r for r in csv.DictReader(fh) if r.get("human_ranking_reasonable", "").strip() != ""]
    if len(rows) < 5:
        sys.exit("Calibration CSV has fewer than 5 hand-labeled rows — label it first (human_ranking_reasonable = 0/1).")

    from job_scout.evals.metrics import fit_explanation_quality

    judge = _judge_model_name(judge_model)
    metric = fit_explanation_quality(judge)
    pairs: list[tuple[int, int]] = []
    for row in rows:
        score = metric.score(
            input=f"Job: {row['job_title']}. Candidate profile: {row['profile_summary']}",
            output=row["fit_explanation"],
        )
        judge_bin = 1 if score.value >= JUDGE_BINARY_THRESHOLD else 0
        human_bin = int(row["human_ranking_reasonable"])
        pairs.append((human_bin, judge_bin))
        print(f"  {row['case_id']}: human={human_bin} judge={judge_bin} (raw {score.value:.2f})")

    agree = sum(1 for h, j in pairs if h == j)
    n = len(pairs)
    p_o = agree / n
    p_h = sum(h for h, _ in pairs) / n
    p_j = sum(j for _, j in pairs) / n
    p_e = p_h * p_j + (1 - p_h) * (1 - p_j)
    kappa = 0.0 if p_e == 1 else (p_o - p_e) / (1 - p_e)
    print(f"\nagreement: {agree}/{n} ({p_o:.0%}) · Cohen's kappa: {kappa:.2f}")
    print("Report this honestly in reports/phase2_eval_report.md, whatever it says.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Phase 2 evaluation harness")
    parser.add_argument("--suite", choices=["extraction", "ranking", "tailoring"], default=None)
    parser.add_argument("--trajectory", action="store_true", help="run agent trajectory metrics over recent traces")
    parser.add_argument("--calibration", action="store_true", help="judge-vs-human agreement on the labeled CSV")
    parser.add_argument("--model", default=None, help="task model override (default: SCOUT_MODEL)")
    parser.add_argument("--judge-model", default=None, help="judge model (default: gpt-4o-mini)")
    parser.add_argument("--yes", action="store_true", help="run without the cost confirmation prompt")
    args = parser.parse_args()

    if not (args.suite or args.trajectory or args.calibration):
        parser.error("pick one of --suite, --trajectory, --calibration")

    from job_scout.config import get_settings

    model = args.model or get_settings().scout_model

    if args.suite or args.trajectory:
        hint = _COST_HINTS["trajectory" if args.trajectory else args.suite]
        print(f"model: {model} · judge: {_judge_model_name(args.judge_model)}\nprojected cost: {hint}")
        if not args.yes:
            print("\nRe-run with --yes to execute.")
            sys.exit(0)

    if args.suite == "extraction":
        run_extraction(model)
    elif args.suite == "ranking":
        run_ranking(model, args.judge_model)
    elif args.suite == "tailoring":
        run_tailoring(model, args.judge_model)
    if args.trajectory:
        run_trajectory(args.judge_model)
    if args.calibration:
        run_calibration(args.judge_model)


if __name__ == "__main__":
    main()
