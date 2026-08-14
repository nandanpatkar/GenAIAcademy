"""Build data/cached_jobs.json — the committed offline jobs dataset.

This snapshot is the app's offline fallback AND a test fixture, so it ships in
the repo. It is assembled from live sources:

  - Adzuna across several countries (us, gb, de, in, au) — needs free API keys.
    Provides the international coverage. Skipped automatically if keys are unset.
  - Remotive (keyless) — worldwide remote roles, so offline mode still returns
    remote jobs even for a reader with zero keys.

Run:  uv run python scripts/snapshot_jobs.py
With no Adzuna keys you still get a real remote-jobs cache; re-run after adding
ADZUNA_APP_ID / ADZUNA_APP_KEY to enrich it with country-specific postings.
"""

from __future__ import annotations

import json
import time
from collections import Counter
from pathlib import Path

from job_scout.graph.schemas import JobPosting
from job_scout.tools.jobs_api import AdzunaSource, RemotiveSource, _dedupe

OUT_PATH = Path(__file__).resolve().parent.parent / "data" / "cached_jobs.json"

QUERIES = [
    "machine learning engineer",
    "data scientist",
    "software engineer python",
    "data analyst",
    "data engineer",
    "backend engineer",
    "product manager data",
]
ADZUNA_COUNTRIES = ["us", "gb", "de", "in", "au"]
PER_QUERY = 15
PER_COUNTRY = 42  # balanced quota per country so no single country dominates
REMOTE_QUOTA = 40  # reserved slots for Remotive remote jobs


def collect() -> list[JobPosting]:
    """Sample a balanced quota per country + a reserved remote slice.

    A naive "gather everything then truncate" biases the cache toward whichever
    country is fetched first. Instead we cap each country independently and
    reserve slots for remote roles, so the committed cache spans >=5 countries
    AND includes remote jobs.
    """
    jobs: list[JobPosting] = []

    adzuna = AdzunaSource()
    if adzuna.available:
        print("Adzuna keys found — pulling international postings.")
        for country in ADZUNA_COUNTRIES:
            country_jobs: list[JobPosting] = []
            for q in QUERIES:
                batch = adzuna.fetch(q, location=None, country=country, remote=False, limit=PER_QUERY)
                country_jobs.extend(batch)
                time.sleep(0.3)  # be polite to the free tier
            capped = _dedupe(country_jobs)[:PER_COUNTRY]
            print(f"  adzuna/{country}: {len(capped)} (from {len(country_jobs)})")
            jobs.extend(capped)
    else:
        print("No Adzuna keys — skipping (cache will be Remotive-only, all remote).")

    remotive = RemotiveSource()
    remote_jobs: list[JobPosting] = []
    for q in QUERIES:
        remote_jobs.extend(remotive.fetch(q, location=None, country=None, remote=True, limit=PER_QUERY * 3))
        time.sleep(0.3)
    capped_remote = _dedupe(remote_jobs)[:REMOTE_QUOTA]
    print(f"  remotive (remote): {len(capped_remote)} (from {len(remote_jobs)})")
    jobs.extend(capped_remote)

    return _dedupe(jobs)


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(
        description="Rebuild data/cached_jobs.json from live job sources (OVERWRITES the committed cache)."
    )
    parser.parse_args()
    jobs = collect()
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUT_PATH.write_text(json.dumps([j.model_dump() for j in jobs], indent=2, ensure_ascii=False))

    by_source = Counter(j.source for j in jobs)
    remote = sum(1 for j in jobs if j.remote)
    print(f"\nwrote {len(jobs)} postings to {OUT_PATH}")
    print(f"  by source: {dict(by_source)}")
    print(f"  remote: {remote}")


if __name__ == "__main__":
    main()
