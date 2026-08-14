"""Deterministic eval metrics: ProfileFieldAccuracy and FabricationRate."""

from __future__ import annotations

from job_scout.evals.metrics import ProfileFieldAccuracy, _fuzzy_f1, _set_score
from job_scout.graph.schemas import CVContent, ExperienceEntry, TailoredBullet
from tests.test_corpus import SAMPLE_CV

EXPECTED = {
    "name": "Jane Doe",
    "seniority": "mid",
    "primary_roles": ["Data Engineer"],
    "skills": ["python", "sql", "airflow", "dbt"],
    "years_experience": 4.0,
    "locations": ["Berlin, Germany"],
    "languages": ["English"],
    "remote_ok": True,
}


def _metric() -> ProfileFieldAccuracy:
    return ProfileFieldAccuracy(track=False)


def test_perfect_extraction_scores_one():
    result = _metric().score(output=dict(EXPECTED), expected=EXPECTED)
    assert result.value == 1.0
    assert set(result.metadata["per_field"]) == {
        "seniority",
        "remote_ok",
        "locations",
        "languages",
        "primary_roles",
        "skills",
        "years_experience",
    }


def test_wrong_seniority_lowers_only_that_field():
    output = dict(EXPECTED) | {"seniority": "senior"}
    result = _metric().score(output=output, expected=EXPECTED)
    per_field = result.metadata["per_field"]
    assert per_field["seniority"] == 0.0
    assert per_field["skills"] == 1.0
    assert 0 < result.value < 1


def test_years_within_tolerance():
    assert (
        _metric()
        .score(output=dict(EXPECTED) | {"years_experience": 4.8}, expected=EXPECTED)
        .metadata["per_field"]["years_experience"]
        == 1.0
    )
    assert (
        _metric()
        .score(output=dict(EXPECTED) | {"years_experience": 7.0}, expected=EXPECTED)
        .metadata["per_field"]["years_experience"]
        == 0.0
    )


def test_years_skipped_when_no_label():
    expected = dict(EXPECTED) | {"years_experience": None}
    result = _metric().score(output=dict(EXPECTED), expected=expected)
    assert "years_experience" not in result.metadata["per_field"]


def test_fuzzy_roles_tolerate_near_matches():
    output = dict(EXPECTED) | {"primary_roles": ["data engineer "]}
    result = _metric().score(output=output, expected=EXPECTED)
    assert result.metadata["per_field"]["primary_roles"] == 1.0


def test_set_score_partial_overlap():
    assert _set_score(["a", "b"], ["b", "c"]) == 1 / 3
    assert _set_score([], []) == 1.0
    assert _set_score(["a"], []) == 0.0


def test_fuzzy_f1_bounds():
    assert _fuzzy_f1(["python"], ["Python"]) == 1.0
    assert _fuzzy_f1([], []) == 1.0
    assert _fuzzy_f1(["python"], []) == 0.0
    assert _fuzzy_f1(["golang"], ["haskell"]) == 0.0


def test_fabrication_rate_counts_flags_over_claims():
    from job_scout.evals.metrics import FabricationRate

    pack = {
        "cv": CVContent(
            headline="DE",
            summary="s",
            experience=[
                ExperienceEntry(
                    role="Data Engineer",
                    company="PipeCorp",
                    bullets=[
                        TailoredBullet(text="Built streaming ingestion handling 2M events/day", corpus_ref="cv-bullet-002"),
                        TailoredBullet(text="Invented a quantum database at NASA", corpus_ref="cv-bullet-999"),
                    ],
                )
            ],
            skills=["Python", "Kubernetes"],
        ).model_dump(),
        "cover_letter": "Dear team,\nBest, Jane",
        "honesty_note": "",
    }
    result = FabricationRate(track=False).score(pack=pack, cv_text=SAMPLE_CV)
    # 4 claims checked (2 bullets + 2 skills), 2 flagged (bad ref + foreign skill).
    assert result.metadata == {"flags": 2, "claims_checked": 4}
    assert result.value == 0.5


def test_fabrication_rate_zero_on_empty_pack():
    from job_scout.evals.metrics import FabricationRate

    pack = {"cv": CVContent(headline="x", summary="y").model_dump(), "cover_letter": "Hi", "honesty_note": ""}
    result = FabricationRate(track=False).score(pack=pack, cv_text=SAMPLE_CV)
    assert result.value == 0.0
