"""Generate SYNTHETIC LinkedIn data-export ZIPs used as test fixtures.

These mimic the CSV layout of an official LinkedIn export ("Get a copy of your
data") for two of the fixture personas, with the same fictional employers as
their fixture CVs so a merged corpus is coherent. No real user data, ever —
real exports must never be committed (see ``job_scout.corpus``).

Run:  uv run python scripts/generate_fixture_linkedin.py
Output is deterministic (pinned ZIP timestamps) so regeneration is diff-stable.
"""

from __future__ import annotations

import csv
import io
import zipfile
from pathlib import Path

OUT_DIR = Path(__file__).resolve().parent.parent / "data" / "fixture_linkedin"

# Pinned timestamp for every ZIP member (year, month, day, h, m, s).
_PIN_DATE = (2026, 1, 1, 0, 0, 0)


def _csv_bytes(rows: list[dict[str, str]]) -> bytes:
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)
    return buffer.getvalue().encode("utf-8")


def _write_zip(filename: str, files: dict[str, list[dict[str, str]]]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / filename
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as archive:
        for name, rows in files.items():
            info = zipfile.ZipInfo(name, date_time=_PIN_DATE)
            archive.writestr(info, _csv_bytes(rows))
    print(f"wrote {path}")


def senior_mle_eu() -> None:
    """Matches data/fixture_cvs/senior_mle_eu.pdf (Lukas Vogel)."""
    _write_zip(
        "senior_mle_eu_li_export.zip",
        {
            "Profile.csv": [
                {
                    "First Name": "Lukas",
                    "Last Name": "Vogel",
                    "Headline": "Senior ML Engineer — production ML systems and MLOps",
                    "Summary": (
                        "Eight years shipping machine learning systems to production, from ranking "
                        "models to real-time recommendations. Team lead and MLOps owner."
                    ),
                }
            ],
            "Positions.csv": [
                {
                    "Company Name": "DeepMobility GmbH",
                    "Title": "Senior ML Engineer",
                    "Description": (
                        "Designed a real-time recommendation service on Kubernetes.\n"
                        "Built the MLOps stack with MLflow and a feature store.\n"
                        "Ran the ML platform on-call rotation and mentored engineers."
                    ),
                    "Location": "Berlin, Germany",
                    "Started On": "Mar 2020",
                    "Finished On": "",
                },
                {
                    "Company Name": "Zalando",
                    "Title": "ML Engineer",
                    "Description": (
                        "Trained search ranking models with distributed PyTorch.\nImproved click-through rate by nine percent."
                    ),
                    "Location": "Berlin, Germany",
                    "Started On": "Jun 2018",
                    "Finished On": "Feb 2020",
                },
            ],
            "Skills.csv": [
                {"Name": "Python"},
                {"Name": "PyTorch"},
                {"Name": "Kubernetes"},
                {"Name": "MLflow"},
                {"Name": "Apache Kafka"},
                {"Name": "Terraform"},
            ],
            "Education.csv": [
                {
                    "School Name": "TU Munich",
                    "Degree Name": "M.Sc. Computer Science",
                    "Notes": "",
                    "Start Date": "2016",
                    "End Date": "2018",
                }
            ],
        },
    )


def junior_ds_us() -> None:
    """Matches data/fixture_cvs/junior_ds_us.pdf (Maya Chen)."""
    _write_zip(
        "junior_ds_us_li_export.zip",
        {
            "Profile.csv": [
                {
                    "First Name": "Maya",
                    "Last Name": "Chen",
                    "Headline": "Data Analyst — forecasting, dashboards, A/B testing",
                    "Summary": (
                        "Data analyst moving into data science. Builds forecasting models and "
                        "automated reporting in Python and SQL."
                    ),
                }
            ],
            "Positions.csv": [
                {
                    "Company Name": "BrightRetail Inc",
                    "Title": "Data Analyst",
                    "Description": (
                        "Built weekly sales forecasting models in scikit-learn.\n"
                        "Automated a Python and SQL reporting pipeline feeding Tableau.\n"
                        "Ran A/B tests on the checkout funnel."
                    ),
                    "Location": "San Francisco, CA",
                    "Started On": "Jul 2024",
                    "Finished On": "",
                }
            ],
            "Skills.csv": [
                {"Name": "Python"},
                {"Name": "SQL"},
                {"Name": "scikit-learn"},
                {"Name": "Tableau"},
                {"Name": "Airflow"},
            ],
            "Education.csv": [
                {
                    "School Name": "UC Davis",
                    "Degree Name": "B.S. Statistics",
                    "Notes": "Relevant coursework: machine learning, regression, databases.",
                    "Start Date": "2019",
                    "End Date": "2023",
                }
            ],
        },
    )


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Regenerate the synthetic LinkedIn export ZIPs under data/fixture_linkedin/.")
    parser.parse_args()
    senior_mle_eu()
    junior_ds_us()
    print(f"\n2 synthetic LinkedIn export fixtures written to {OUT_DIR}")


if __name__ == "__main__":
    main()
