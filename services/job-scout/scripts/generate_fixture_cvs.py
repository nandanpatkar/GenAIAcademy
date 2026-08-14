"""Generate the synthetic fixture CV PDFs used by tests and the batch runner.

Four deliberately-different profiles, all fictional, committed to the repo so a
reader needs zero setup:

  - junior_ds_us.pdf        junior Data Scientist, United States
  - senior_mle_eu.pdf       senior ML Engineer, Berlin / EU
  - career_changer_in.pdf   teacher pivoting into data, India (thin experience)
  - german_pm_de.pdf        product/data role, written in German (non-English)

Run:  uv run python scripts/generate_fixture_cvs.py
Output is deterministic, so regenerating produces byte-stable-ish PDFs (fpdf2
embeds a creation date; we pin it below so diffs stay clean).

These are synthetic personas — names, companies and contact details are made up.
"""

from __future__ import annotations

from datetime import UTC, datetime
from pathlib import Path

from fpdf import FPDF

OUT_DIR = Path(__file__).resolve().parent.parent / "data" / "fixture_cvs"

# Pin metadata so regenerated PDFs don't churn git diffs on every run.
_PIN_DATE = datetime(2026, 1, 1, tzinfo=UTC)


def _pdf() -> FPDF:
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_title("CV")
    return pdf


def _render(pdf: FPDF, name: str, contact: str, sections: list[tuple[str, list[str]]]) -> None:
    width = pdf.epw  # effective page width (page minus left/right margins)
    pdf.set_font("Helvetica", "B", 18)
    pdf.cell(width, 10, name, new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(width, 6, contact, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(3)
    for heading, lines in sections:
        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(width, 8, heading, new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        for line in lines:
            pdf.multi_cell(width, 5, line)
        pdf.ln(2)


def _save(pdf: FPDF, filename: str) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / filename
    # fpdf2 stamps a creation date; pin it to keep output stable across runs.
    pdf.creation_date = _PIN_DATE  # type: ignore[attr-defined]
    pdf.output(str(path))
    print(f"wrote {path}")


def junior_ds_us() -> None:
    pdf = _pdf()
    _render(
        pdf,
        "Maya Chen",
        "San Francisco, CA, USA  |  maya.chen@example.com  |  English",
        [
            (
                "Summary",
                [
                    "Junior Data Scientist with ~1.5 years of experience building models and dashboards. "
                    "Comfortable with Python, SQL and scikit-learn. Looking for a data science role in the US.",
                ],
            ),
            (
                "Skills",
                [
                    "Python, SQL, pandas, scikit-learn, matplotlib, Jupyter, Git, basic AWS, Tableau.",
                ],
            ),
            (
                "Experience",
                [
                    "Data Analyst, BrightRetail Inc (2024-2026)",
                    "- Built weekly sales forecasting models in scikit-learn, reducing stockouts by 12%.",
                    "- Automated reporting pipeline in Python and SQL feeding Tableau dashboards.",
                    "- Ran A/B tests on the checkout funnel and reported lift to product managers.",
                ],
            ),
            (
                "Education",
                [
                    "B.S. Statistics, UC Davis (2023). Relevant coursework: ML, regression, databases.",
                ],
            ),
        ],
    )
    _save(pdf, "junior_ds_us.pdf")


def senior_mle_eu() -> None:
    pdf = _pdf()
    _render(
        pdf,
        "Lukas Vogel",
        "Berlin, Germany  |  lukas.vogel@example.com  |  English, German",
        [
            (
                "Summary",
                [
                    "Senior Machine Learning Engineer with 8 years of experience shipping ML systems to "
                    "production. Leads small teams, owns MLOps, and is open to remote or Berlin-based roles.",
                ],
            ),
            (
                "Skills",
                [
                    "Python, PyTorch, TensorFlow, Kubernetes, Docker, AWS, GCP, MLflow, Kafka, Spark, "
                    "feature stores, model serving, CI/CD, distributed training, LLM fine-tuning.",
                ],
            ),
            (
                "Experience",
                [
                    "Senior ML Engineer, DeepMobility GmbH (2020-2026)",
                    "- Designed a real-time recommendation service serving 10M requests/day on Kubernetes.",
                    "- Built the team's MLOps stack (MLflow, feature store, CI/CD) from scratch.",
                    "- Mentored 4 engineers and owned on-call for the ML platform.",
                    "ML Engineer, Zalando (2018-2020)",
                    "- Trained ranking models for search; improved CTR by 9% via distributed PyTorch.",
                ],
            ),
            (
                "Education",
                [
                    "M.Sc. Computer Science, TU Munich (2018).",
                ],
            ),
        ],
    )
    _save(pdf, "senior_mle_eu.pdf")


def career_changer_in() -> None:
    pdf = _pdf()
    _render(
        pdf,
        "Priya Nair",
        "Bengaluru, India  |  priya.nair@example.com  |  English, Hindi, Malayalam",
        [
            (
                "Summary",
                [
                    "High-school mathematics teacher transitioning into data. Completed an online data "
                    "analytics certificate. Strong on statistics and communication; limited professional "
                    "software experience. Seeking an entry-level data analyst or data science role.",
                ],
            ),
            (
                "Skills",
                [
                    "Statistics, Excel, basic Python, basic SQL, data visualization, teaching, communication.",
                ],
            ),
            (
                "Experience",
                [
                    "Mathematics Teacher, Vidya Public School (2015-2026)",
                    "- Taught statistics and probability to 200+ students per year.",
                    "- Built spreadsheet trackers to analyze student performance trends.",
                    "Data Analytics Certificate, Coursera (2025)",
                    "- Capstone: analyzed public health data in Python and presented findings.",
                ],
            ),
            (
                "Education",
                [
                    "B.Ed. Mathematics, University of Kerala (2014).",
                ],
            ),
        ],
    )
    _save(pdf, "career_changer_in.pdf")


def german_pm_de() -> None:
    pdf = _pdf()
    _render(
        pdf,
        "Sophie Krüger",
        "München, Deutschland  |  sophie.krueger@example.com  |  Deutsch, Englisch",
        [
            (
                "Zusammenfassung",
                [
                    "Data Product Manager mit 5 Jahren Erfahrung an der Schnittstelle von Produkt und "
                    "Datenanalyse. Erfahrung mit SQL, Dashboards und der Zusammenarbeit mit Data-Science-Teams. "
                    "Offen für Remote-Stellen oder Positionen in München.",
                ],
            ),
            (
                "Kenntnisse",
                [
                    "SQL, Python (Grundkenntnisse), Tableau, Produktstrategie, A/B-Tests, Stakeholder-Management, "
                    "Datenanalyse, agile Methoden.",
                ],
            ),
            (
                "Berufserfahrung",
                [
                    "Data Product Manager, HandelsWerk AG (2021-2026)",
                    "- Leitung der Roadmap für die interne Analytics-Plattform.",
                    "- Definition von KPIs und Erstellung von Dashboards in Tableau.",
                    "- Enge Zusammenarbeit mit Data Scientists zur Priorisierung von Modellen.",
                    "Business Analyst, StadtLogistik GmbH (2019-2021)",
                    "- Analyse von Lieferketten-Daten mit SQL und Excel.",
                ],
            ),
            (
                "Ausbildung",
                [
                    "M.Sc. Wirtschaftsinformatik, Universität Mannheim (2019).",
                ],
            ),
        ],
    )
    _save(pdf, "german_pm_de.pdf")


def main() -> None:
    import argparse

    parser = argparse.ArgumentParser(description="Regenerate the synthetic fixture CVs under data/fixture_cvs/.")
    parser.parse_args()
    junior_ds_us()
    senior_mle_eu()
    career_changer_in()
    german_pm_de()
    print(f"\n4 fixture CVs written to {OUT_DIR}")


if __name__ == "__main__":
    main()
