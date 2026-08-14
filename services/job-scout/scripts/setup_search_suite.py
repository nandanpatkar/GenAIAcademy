"""Create and run the Opik Test Suite for job SEARCH — the gate Ollie can pull.

The tailoring suite (scripts/setup_test_suite.py) grades what the model wrote.
This one grades what the cascade *did*: which sources answered, which of them
actually contributed, and how long each one took. That is the shape of the
open finding in docs/ollie.md — JSearch spending its full 15s timeout and
returning nothing, on every search — so this is the suite that can tell you
whether a fix to it worked.

Deliberately NOT a pytest gate. gates/ is deterministic and offline by
contract; this one queries live job APIs, so its numbers move with the network
and it belongs where you can see the run history and compare experiments — and
where Ollie can trigger it after proposing a fix.

The assertions read numbers out of the task output rather than judging prose.
That is a slightly odd use of an LLM judge, and it is the honest trade: the
suite is the dashboard-visible, Ollie-runnable surface, and the deterministic
version of the same question lives in tests/test_jobs_api.py.

Usage:
    uv run python scripts/setup_search_suite.py --create     # build/refresh (free)
    uv run python scripts/setup_search_suite.py --run        # cost estimate only
    uv run python scripts/setup_search_suite.py --run --yes  # live searches + judged assertions
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

SUITE_NAME = "job-scout-search-suite"
COST_HINT = 0.04  # judge calls only; the job APIs are free within their quotas
SLOW_SOURCE_MS = 8000

# One case per shape the cascade has to handle: a rich local market, a
# remote-only search, and a query thin enough to fall through to the cache.
CASES = [
    {"query": "data scientist", "location": "Berlin, Germany", "country": "de", "remote": False},
    {"query": "machine learning engineer", "location": "", "country": "us", "remote": True},
    {"query": "quantitative palaeobotanist", "location": "Reykjavik, Iceland", "country": "is", "remote": False},
]

ASSERTIONS = [
    f"Every entry in source_timings has duration_ms below {SLOW_SOURCE_MS}. "
    "A source that spends longer than that is holding up the whole search.",
    "Every source named in sources_used returned at least one job, according to source_timings. "
    "A source that was queried, took time, and contributed nothing is wasted work.",
    "The search returned at least one job.",
]


def _suite(client):
    return client.get_or_create_test_suite(
        name=SUITE_NAME,
        global_assertions=ASSERTIONS,
        global_execution_policy={"runs_per_item": 1, "pass_threshold": 1},
    )


def _task(item: dict) -> dict:
    """Time each live source, then run the cascade that consumes them.

    Timing the sources individually is the point: `run_search` alone reports a
    total, and a total cannot tell you which source to go and look at.
    """
    from job_scout.graph.schemas import Profile  # noqa: F401 - breaks the cold-import cycle
    from job_scout.tools.jobs_api import AdzunaSource, JSearchSource, RemotiveSource, run_search

    data = item.get("data", item)
    query, location = data["query"], data["location"]
    country, remote = data["country"], data["remote"]

    timings = []
    for name, source in (("jsearch", JSearchSource()), ("adzuna", AdzunaSource()), ("remotive", RemotiveSource())):
        if not getattr(source, "available", True):
            continue
        started = time.monotonic()
        try:
            found = len(source.fetch(query, location, country, remote, 10))
        except Exception:  # noqa: BLE001 - a dead source is an empty source, and still a timing
            found = 0
        timings.append({"source": name, "duration_ms": round((time.monotonic() - started) * 1000), "jobs": found})

    started = time.monotonic()
    jobs, used = run_search(query, location, country, remote, 10)
    return {
        "input": data,
        "output": {
            "query": query,
            "jobs_returned": len(jobs),
            "sources_used": used,
            "search_ms": round((time.monotonic() - started) * 1000),
            "source_timings": timings,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Create/run the Opik search Test Suite.")
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
        rows = [{"data": case} for case in CASES]
        suite.insert(rows)  # type: ignore[arg-type] - documented dict form
        print(f"suite '{SUITE_NAME}': {len(rows)} items, {len(ASSERTIONS)} global assertions")

    if args.run:
        print(f"run estimate: ~${COST_HINT:.2f} ({len(CASES)} live searches + judged assertions)")
        if not args.yes:
            print("Re-run with --yes to spend.")
            sys.exit(0)
        import opik

        result = opik.run_tests(test_suite=suite, task=_task, experiment_name="search-suite-gate")
        rate = result.pass_rate if result.pass_rate is not None else 0.0
        print(f"pass rate: {rate:.0%} ({result.items_passed}/{result.items_total})")
        sys.exit(0 if rate >= 0.75 else 1)


if __name__ == "__main__":
    main()
