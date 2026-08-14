"""Paired benchmark of the source cascade's soft deadline.

Reproduces the Phase 3 latency numbers. Both modes run in one process, back to
back, with ``SCOUT_SOURCE_SOFT_DEADLINE`` as the only variable, because
comparing against a run from yesterday compares two different days of JSearch
weather rather than two code paths.

Setting the deadline absurdly high reproduces the pre-fix blocking behaviour
exactly, so "before" is a real measurement rather than a remembered one.

Run it more than once. A single pair suggested 16.1s -> 1.1s; five pairs showed
the honest 10-15x *and* the variance collapse, which is the better result and
which one run cannot see.

    uv run python scripts/bench_search.py            # 5 runs per mode
    uv run python scripts/bench_search.py -n 1       # quick look
"""

from __future__ import annotations

import argparse
import os
import statistics
import time

# The cascade only applies a deadline when something else is already in flight.
os.environ.setdefault("SCOUT_CONCURRENT_SOURCES", "true")

BLOCKING = 999.0  # stands in for "wait for jsearch however long it takes"

CASES = [
    ("data scientist", "Berlin, Germany", "de", False),
    ("machine learning engineer", "", "us", True),
]


def _run_once(query: str, location: str, country: str, remote: bool, deadline: float):
    """One search at one deadline, returning (ms, job count, sources used)."""
    from job_scout.config import get_settings
    from job_scout.tools.jobs_api import run_search

    os.environ["SCOUT_SOURCE_SOFT_DEADLINE"] = str(deadline)
    get_settings.cache_clear()  # the settings object is an lru_cache singleton

    started = time.monotonic()
    jobs, used = run_search(query, location, country, remote, 10)
    return (time.monotonic() - started) * 1000, len(jobs), tuple(used)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("-n", "--runs", type=int, default=5, help="runs per mode per case (default: 5)")
    parser.add_argument("--deadline", type=float, default=1.0, help="the deadline under test (default: 1.0)")
    args = parser.parse_args()

    from job_scout.graph.schemas import Profile  # noqa: F401 - breaks the cold-import cycle

    print(f"paired search benchmark: {args.runs} run(s) per mode, deadline {args.deadline}s vs blocking\n")

    for query, location, country, remote in CASES:
        print(f"=== {query!r} / {location or 'anywhere'} ===")
        for label, deadline in (("blocking", BLOCKING), (f"{args.deadline}s deadline", args.deadline)):
            runs = [_run_once(query, location, country, remote, deadline) for _ in range(args.runs)]
            ms = [r[0] for r in runs]
            jobs = sorted({r[1] for r in runs})
            sources = sorted({r[2] for r in runs})
            spread = max(ms) - min(ms)
            print(
                f"  {label:16} median {statistics.median(ms):8.0f} ms   "
                f"spread {spread:7.0f} ms   jobs {jobs}   sources {sources}"
            )
        print()

    print("The spread column is the point: a predictable second beats an average hiding a 15s tail.")


if __name__ == "__main__":
    main()
