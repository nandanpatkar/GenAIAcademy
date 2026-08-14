"""Phase 2 tailoring batch: generate real tailoring traces + fabrication numbers.

For each case: run the job search on a fresh thread, pick a ranked job, then
invoke tailoring ON THE SAME THREAD in the same process — the two-invocation
checkpoint-reuse flow that ``get_compiled_graph()`` (one compiled graph + one
``MemorySaver`` per process) makes possible in a batch script at all.

Every run is tagged ``phase-2`` + ``tailor-batch``; these traces are the raw
material for the ``tailoring-cases`` dataset (scripts/build_eval_dataset.py)
and the first real fabrication-flag numbers for reports/phase2_findings.md.

Usage:
    uv run python scripts/run_tailor_batch.py          # prints projected cost, stops
    uv run python scripts/run_tailor_batch.py --yes    # actually runs (~$0.5-0.8)
"""

from __future__ import annotations

import argparse
import json
import statistics
import sys
from dataclasses import dataclass
from pathlib import Path
from uuid import uuid4

from job_scout.config import get_settings
from job_scout.runner import TailorResult, run_once, stream_tailor
from job_scout.tools.cv_reader import extract_cv_text

ROOT = Path(__file__).resolve().parent.parent
CV_DIR = ROOT / "data" / "fixture_cvs"
LINKEDIN_DIR = ROOT / "data" / "fixture_linkedin"
REPORT_PATH = ROOT / "reports" / "tailor_batch.json"

# One search (~$0.01-0.03) + one tailor call (~$0.005) per case.
COST_PER_CASE_ESTIMATE = 0.03

TAGS = ["phase-2", "tailor-batch"]


@dataclass
class Case:
    case_id: str
    cv_file: str
    pick_rank: int  # 0 = tailor the top job, 2 = the third-ranked, ...
    linkedin_zip: str | None = None
    note: str = ""


def build_matrix(limit: int | None = None) -> list[Case]:
    """~20 cases: every fixture CV × top-1/mid/lower picks; LinkedIn on two."""
    cvs = ["junior_ds_us.pdf", "senior_mle_eu.pdf", "career_changer_in.pdf", "german_pm_de.pdf"]
    li = {
        "junior_ds_us.pdf": str(LINKEDIN_DIR / "junior_ds_us_li_export.zip"),
        "senior_mle_eu.pdf": str(LINKEDIN_DIR / "senior_mle_eu_li_export.zip"),
    }
    cases: list[Case] = []
    for pick in (0, 2, 4):  # rotate picks first so a --limit prefix spans CVs and ranks
        for cv in cvs:
            stem = cv.replace(".pdf", "")
            cases.append(Case(f"{stem}|top{pick + 1}", cv, pick, note=f"pick #{pick + 1}"))
    for cv, zip_path in li.items():  # CV+LinkedIn corpus cases (acceptance criterion)
        stem = cv.replace(".pdf", "")
        cases.append(Case(f"{stem}|top1+linkedin", cv, 0, linkedin_zip=zip_path, note="with LinkedIn export"))
    # A deliberate failure case: unknown job id must degrade gracefully.
    cases.append(Case("junior_ds_us|unknown_job", "junior_ds_us.pdf", -1, note="unknown job id (graceful error)"))
    return cases[:limit] if limit else cases


def run_case(case: Case) -> dict:
    thread_id = str(uuid4())
    cv_path = CV_DIR / case.cv_file
    search = run_once(extract_cv_text(cv_path), cv_path=str(cv_path), thread_id=thread_id, tags=TAGS)

    row = {
        "case_id": case.case_id,
        "cv_file": case.cv_file,
        "note": case.note,
        "thread_id": thread_id,
        "search_failed": search.failed,
        "n_jobs_ranked": search.n_jobs_ranked,
        "search_cost_usd": search.cost_usd,
        "search_latency_s": search.latency_s,
    }
    if search.failed or not search.ranked_jobs:
        row.update({"tailored": False, "skip_reason": search.error_message or "no ranked jobs"})
        return row

    if case.pick_rank < 0:
        job_id = "no-such-job-id"
    else:
        job_id = search.ranked_jobs[min(case.pick_rank, len(search.ranked_jobs) - 1)].job.job_id

    result = TailorResult()
    for kind, payload in stream_tailor(
        thread_id=thread_id, selected_job_id=job_id, tags=TAGS, linkedin_zip_path=case.linkedin_zip
    ):
        if kind == "result":
            result = payload  # type: ignore[assignment]

    pack = result.pack
    row.update(
        {
            "tailored": pack is not None,
            "selected_job_id": job_id,
            "tailor_failed": result.failed,
            "tailor_errors": result.errors,
            "fabrication_flags": result.fabrication_flags,
            "claims_checked": result.fabrication_report.claims_checked if result.fabrication_report else 0,
            "flagged": [f.model_dump() for f in result.fabrication_report.flagged] if result.fabrication_report else [],
            "research_used": result.research_used,
            "cover_letter_words": len(pack.cover_letter.split()) if pack else 0,
            "n_bullets": sum(len(e.bullets) for e in pack.cv.experience) if pack else 0,
            "tailor_cost_usd": result.cost_usd,
            "tailor_latency_s": result.latency_s,
        }
    )
    return row


def summarize(rows: list[dict]) -> dict:
    tailored = [r for r in rows if r.get("tailored")]
    flags = [r["fabrication_flags"] for r in tailored]
    claims = sum(r["claims_checked"] for r in tailored)
    return {
        "cases": len(rows),
        "tailored": len(tailored),
        "search_failures": sum(1 for r in rows if r["search_failed"]),
        "graceful_tailor_errors": sum(1 for r in rows if not r.get("tailored") and not r["search_failed"]),
        "runs_with_fabrication_flags": sum(1 for f in flags if f > 0),
        "total_fabrication_flags": sum(flags),
        "total_claims_checked": claims,
        "fabrication_rate": round(sum(flags) / claims, 4) if claims else 0.0,
        "mean_cover_letter_words": round(statistics.mean([r["cover_letter_words"] for r in tailored]), 1) if tailored else 0,
        "total_cost_usd": round(sum(r["search_cost_usd"] + r.get("tailor_cost_usd", 0.0) for r in rows), 4),
    }


def _checkpoint(rows: list[dict]) -> None:
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps({"summary": summarize(rows), "runs": rows}, indent=2, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser(description="Phase 2 tailoring batch")
    parser.add_argument("--yes", action="store_true", help="run without the cost confirmation prompt")
    parser.add_argument("--limit", type=int, default=None, help="cap the number of cases")
    parser.add_argument("--resume", action="store_true", help="skip case_ids already in the report (crash recovery)")
    args = parser.parse_args()

    cases = build_matrix(limit=args.limit)
    done_rows: list[dict] = []
    if args.resume and REPORT_PATH.exists():
        done_rows = json.loads(REPORT_PATH.read_text())["runs"]
        done_ids = {row["case_id"] for row in done_rows}
        cases = [c for c in cases if c.case_id not in done_ids]
        print(f"resume: {len(done_rows)} cases already done, {len(cases)} remaining")
    settings = get_settings()
    print(f"Search model: {settings.scout_model} · tailor model: {settings.scout_tailor_model}")
    print(f"Planned cases: {len(cases)} (search + tailor each)")
    print(f"Projected cost: ~${len(cases) * COST_PER_CASE_ESTIMATE:.2f}")
    if not args.yes:
        print("\nRe-run with --yes to execute.")
        sys.exit(0)

    rows: list[dict] = list(done_rows)
    for i, case in enumerate(cases, 1):
        print(f"[{i}/{len(cases)}] {case.case_id} ({case.note})…", flush=True)
        rows.append(run_case(case))
        _checkpoint(rows)  # crash-safe

    summary = summarize(rows)
    print("\n## Tailor batch summary\n")
    for key, value in summary.items():
        print(f"| {key} | {value} |")
    print(f"\nWrote {REPORT_PATH}")


if __name__ == "__main__":
    main()
