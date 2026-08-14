"""Schema invariants."""

from __future__ import annotations

import pytest
from pydantic import ValidationError

from job_scout.graph.schemas import CVContent, JobPosting, RankedJob, TailoredBullet, TailoringPack
from tests.conftest import make_job


def test_ranked_job_score_bounds():
    job = make_job("j1", "Data Scientist", "Acme")
    RankedJob(job=job, fit_score=0, fit_explanation="x")
    RankedJob(job=job, fit_score=100, fit_explanation="x")
    with pytest.raises(ValidationError):
        RankedJob(job=job, fit_score=101, fit_explanation="x")
    with pytest.raises(ValidationError):
        RankedJob(job=job, fit_score=-1, fit_explanation="x")


def test_job_posting_source_literal():
    JobPosting(job_id="1", title="t", company="c", location="l", source="adzuna")
    with pytest.raises(ValidationError):
        JobPosting(job_id="1", title="t", company="c", location="l", source="linkedin")


def test_tailored_bullet_requires_corpus_ref():
    TailoredBullet(text="Built a model", corpus_ref="cv-bullet-001")
    with pytest.raises(ValidationError):
        TailoredBullet(text="Built a model")


def test_tailoring_pack_v2_shape():
    pack = TailoringPack(
        cv=CVContent(headline="ML Engineer", summary="Builds models."),
        cover_letter="Dear team,",
    )
    assert pack.cv.experience == []
    assert pack.honesty_note == ""
