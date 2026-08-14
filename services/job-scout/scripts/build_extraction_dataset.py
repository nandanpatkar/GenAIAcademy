"""Build the hand-labeled extraction-correctness dataset (eval step 1).

Two-phase, deliberately human-in-the-loop:

    uv run python scripts/build_extraction_dataset.py --scaffold
        Runs profile extraction over the 4 fixture CVs (4 LLM calls, ~cents)
        and writes DRAFT labels to data/labels/expected_profiles.yaml with
        ``verified: false``. The drafts are a starting point ONLY — the whole
        lesson is that labels are yours, not the model's. Correct them by hand,
        then flip each entry to ``verified: true``.

    uv run python scripts/build_extraction_dataset.py --push
        Refuses unless every entry is verified, then pushes items to the Opik
        dataset ``job-scout-extraction-cases`` (needs OPIK_API_KEY; no LLM cost).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
CV_DIR = ROOT / "data" / "fixture_cvs"
LABELS_PATH = ROOT / "data" / "labels" / "expected_profiles.yaml"
DATASET_NAME = "job-scout-extraction-cases"

_HEADER = """\
# Hand-verified expected Profile fields for the fixture CVs.
# Scaffolded by build_extraction_dataset.py --scaffold (LLM DRAFTS — correct them!),
# then hand-edited. An entry only enters the dataset once `verified: true`.
# Fields mirror job_scout.graph.schemas.Profile.
"""


def scaffold() -> None:
    """Extract draft profiles for each fixture CV and write the label file."""
    from job_scout.profile import extract_profile
    from job_scout.tools.cv_reader import extract_cv_text

    entries = []
    for pdf in sorted(CV_DIR.glob("*.pdf")):
        print(f"extracting {pdf.name}…", flush=True)
        profile = extract_profile(extract_cv_text(pdf))
        entries.append(
            {
                "cv_file": pdf.name,
                "verified": False,  # human must review and flip this
                "expected": {
                    "name": profile.name,
                    "seniority": profile.seniority,
                    "primary_roles": profile.primary_roles,
                    "skills": profile.skills,
                    "years_experience": profile.years_experience,
                    "locations": profile.locations,
                    "languages": profile.languages,
                    "remote_ok": profile.remote_ok,
                },
            }
        )

    LABELS_PATH.parent.mkdir(parents=True, exist_ok=True)
    LABELS_PATH.write_text(_HEADER + yaml.safe_dump(entries, sort_keys=False, allow_unicode=True))
    print(f"\nWrote {len(entries)} DRAFT entries to {LABELS_PATH}")
    print("Now hand-correct the labels and set `verified: true` on each entry, then run with --push.")


def push() -> None:
    """Validate the label file and push it as an Opik dataset."""
    from job_scout.tools.cv_reader import extract_cv_text
    from job_scout.tracing import configure_opik

    if not LABELS_PATH.exists():
        sys.exit(f"{LABELS_PATH} not found — run with --scaffold first.")
    entries = yaml.safe_load(LABELS_PATH.read_text())
    unverified = [e["cv_file"] for e in entries if not e.get("verified")]
    if unverified:
        sys.exit(
            "Refusing to push: these entries are not hand-verified yet "
            f"({', '.join(unverified)}). Correct the labels, set `verified: true`, and re-run."
        )
    if not configure_opik():
        sys.exit("Opik is not configured (OPIK_API_KEY / OPIK_ENABLED) — cannot push the dataset.")

    import opik

    client = opik.Opik()
    dataset = client.get_or_create_dataset(
        DATASET_NAME, description="Hand-labeled expected Profile fields for the 4 fixture CVs (Phase 2, eval step 1)."
    )
    items = [
        {
            "cv_file": e["cv_file"],
            "cv_text": extract_cv_text(CV_DIR / e["cv_file"]),
            "expected": e["expected"],
        }
        for e in entries
    ]
    dataset.insert(items)  # Opik dedupes identical items, so re-pushing is safe
    print(f"Pushed {len(items)} items to Opik dataset '{DATASET_NAME}'.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the extraction-cases dataset")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--scaffold", action="store_true", help="draft labels from the current extractor (4 LLM calls)")
    group.add_argument("--push", action="store_true", help="push hand-verified labels to Opik")
    args = parser.parse_args()

    if args.scaffold:
        scaffold()
    else:
        push()


if __name__ == "__main__":
    main()
