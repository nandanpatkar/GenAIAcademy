"""CV text extraction."""

from __future__ import annotations

import pytest

from job_scout.tools.cv_reader import CVReadError, extract_cv_text
from tests.conftest import FIXTURE_CVS


@pytest.mark.parametrize(
    "filename",
    ["junior_ds_us.pdf", "senior_mle_eu.pdf", "career_changer_in.pdf", "german_pm_de.pdf"],
)
def test_extract_fixture_cvs(filename):
    text = extract_cv_text(FIXTURE_CVS / filename)
    assert len(text) > 100


def test_german_umlauts_preserved():
    text = extract_cv_text(FIXTURE_CVS / "german_pm_de.pdf")
    assert "Krüger" in text or "München" in text


def test_missing_file_raises():
    with pytest.raises(CVReadError):
        extract_cv_text(FIXTURE_CVS / "does_not_exist.pdf")


def test_non_pdf_raises(tmp_path):
    bad = tmp_path / "notpdf.pdf"
    bad.write_text("this is not a pdf")
    with pytest.raises(CVReadError):
        extract_cv_text(bad)
