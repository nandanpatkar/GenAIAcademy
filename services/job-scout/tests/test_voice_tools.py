"""Tests for the Jobvis client tools: grounding, trimming, and spoken job refs."""

from __future__ import annotations

import pytest

import job_scout.voice.bridge as bridge_module
from job_scout.graph.schemas import CVContent, ExperienceEntry, RankedJob, TailoredBullet, TailoringPack
from job_scout.voice import tools
from job_scout.voice.bridge import VoiceBridge
from job_scout.voice.persona import TOOL_SPECS
from tests.conftest import make_job


def ranked(job_id: str, title: str, company: str, score: int, gaps: list[str] | None = None) -> RankedJob:
    return RankedJob(
        job=make_job(job_id, title, company),
        fit_score=score,
        fit_explanation=f"{title} fits the profile well.",
        matched_skills=["python", "sql", "pandas", "airflow", "docker"],
        gaps=gaps if gaps is not None else ["kubernetes", "spark", "scala", "go"],
    )


@pytest.fixture
def bridge(monkeypatch) -> VoiceBridge:
    """A fresh bridge as the process singleton, with an empty checkpoint."""
    fresh = VoiceBridge()
    monkeypatch.setattr(bridge_module, "_BRIDGE", fresh)
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {})
    return fresh


@pytest.fixture
def bridge_with_results(monkeypatch, sample_profile) -> VoiceBridge:
    """A bridge mid-wizard: profile recorded, three ranked jobs in the checkpoint."""
    fresh = VoiceBridge()
    monkeypatch.setattr(bridge_module, "_BRIDGE", fresh)
    fresh.register_thread("t1")
    fresh.record_profile(sample_profile, "cv text", "t1")
    jobs = [
        ranked("j1", "Data Scientist", "Acme", 91),
        ranked("j2", "ML Engineer", "Globex", 84),
        ranked("j3", "Data Engineer", "Initech", 62),
    ]
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {"ranked_jobs": jobs} if thread_id == "t1" else {})
    return fresh


def test_tool_specs_match_handlers():
    assert sorted(tools.CLIENT_TOOL_HANDLERS) == sorted(spec["name"] for spec in TOOL_SPECS)


def test_session_status_empty(bridge):
    status = tools.get_session_status()
    assert status["has_profile"] is False
    assert status["has_results"] is False
    assert "drop a PDF" in status["note"]


def test_session_status_with_results(bridge_with_results):
    status = tools.get_session_status()
    assert status == {
        "step": "profile",
        "has_profile": True,
        "has_results": True,
        "has_application": False,
        "n_ranked": 3,
        "candidate_name": "Test Candidate",
        "run_in_progress": False,
    }


def test_top_jobs_empty(bridge):
    result = tools.get_top_jobs()
    assert result["jobs"] == []
    assert "drop a PDF" in result["note"]


def test_top_jobs_default_three_and_speakable_caps(bridge_with_results):
    result = tools.get_top_jobs()
    assert [j["rank"] for j in result["jobs"]] == [1, 2, 3]
    assert result["total_ranked"] == 3
    top = result["jobs"][0]
    assert top["title"] == "Data Scientist" and top["score"] == 91
    assert len(top["top_gaps"]) == 3  # capped from 4
    assert len(top["matched_skills"]) == 4  # capped from 5


@pytest.mark.parametrize(("count", "expected"), [(1, 1), (2, 2), (99, 3), (0, 1), ("nope", 3), (None, 3)])
def test_top_jobs_count_clamped(bridge_with_results, count, expected):
    assert len(tools.get_top_jobs({"count": count})["jobs"]) == expected


@pytest.mark.parametrize("job_ref", ["2", "second", "two", "Globex", "ml engineer"])
def test_job_details_resolves_spoken_refs(bridge_with_results, job_ref):
    details = tools.get_job_details({"job_ref": job_ref})
    assert details["found"] is True
    assert details["rank"] == 2 and details["company"] == "Globex"


def test_job_details_ambiguous_lists_candidates(bridge_with_results):
    details = tools.get_job_details({"job_ref": "Data"})  # Data Scientist + Data Engineer
    assert details["found"] is False
    assert len(details["candidates"]) == 2
    assert details["candidates"][0].startswith("1: Data Scientist")


def test_job_details_miss_and_out_of_range(bridge_with_results):
    assert tools.get_job_details({"job_ref": "astronaut"})["found"] is False
    assert tools.get_job_details({"job_ref": "9"})["found"] is False


def test_job_details_trims_long_explanations(bridge_with_results, monkeypatch):
    jobs = [ranked("j1", "Data Scientist", "Acme", 91)]
    jobs[0].fit_explanation = "word " * 200
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {"ranked_jobs": jobs})
    details = tools.get_job_details({"job_ref": "1"})
    assert len(details["why"]) <= 360 and details["why"].endswith("…")


def make_pack() -> TailoringPack:
    return TailoringPack(
        cv=CVContent(
            headline="Data Scientist with 3 years in production ML",
            summary="Ships models end to end.",
            experience=[
                ExperienceEntry(
                    role="DS", company="Acme", bullets=[TailoredBullet(text="Built a churn model", corpus_ref="cv:1")]
                )
            ],
            skills=["python", "sql"],
        ),
        cover_letter="Dear team, I would like to apply. " * 10,
        honesty_note="No production Kubernetes experience.",
    )


def test_read_application_before_tailoring(bridge_with_results):
    result = tools.read_application()
    assert result["found"] is False and "tailored" in result["note"]


def test_read_application_parts(bridge_with_results, monkeypatch):
    values = {
        "ranked_jobs": [ranked("j2", "ML Engineer", "Globex", 84)],
        "selected_job_id": "j2",
        "tailoring": make_pack(),
        "fabrication_flags": 0,
    }
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: values)

    summary = tools.read_application()
    assert summary["part"] == "summary"
    assert "ML Engineer at Globex" in summary["text"]
    assert "no flags" in summary["fabrication_note"]
    assert "Honesty note" in summary["text"]

    letter = tools.read_application({"part": "cover_letter"})
    assert letter["text"].startswith("Dear team")

    highlights = tools.read_application({"part": "cv_highlights"})
    assert "Built a churn model" in highlights["text"]
    assert "Key skills" in highlights["text"]


def test_read_application_reports_flags(bridge_with_results, monkeypatch):
    values = {"tailoring": make_pack(), "fabrication_flags": 2, "ranked_jobs": []}
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: values)
    result = tools.read_application()
    assert "2 statements could not be verified" in result["fabrication_note"]


def test_start_search_needs_profile(bridge):
    result = tools.start_search()
    assert result["started"] is False and "CV" in result["note"]


def test_start_tailoring_needs_results(bridge):
    result = tools.start_tailoring({"job_ref": "1"})
    assert result["started"] is False


def test_start_tailoring_resolves_then_starts(bridge_with_results, monkeypatch):
    started: dict = {}
    monkeypatch.setattr(bridge_with_results, "start_tailoring", lambda job_id: started.setdefault("job_id", job_id) and None)
    result = tools.start_tailoring({"job_ref": "second"})
    assert result["started"] is True
    assert result["title"] == "ML Engineer" and result["rank"] == 2
    assert started["job_id"] == "j2"


def test_start_tailoring_ambiguous(bridge_with_results):
    result = tools.start_tailoring({"job_ref": "Data"})
    assert result["started"] is False and len(result["candidates"]) == 2


def test_run_status_idle(bridge):
    assert tools.get_run_status()["running"] is False


def test_run_status_unambiguous_when_nothing_started(bridge):
    status = tools.get_run_status()
    assert status["running"] is False
    assert status["has_results"] is False
    assert "nothing has completed" in status["note"]  # an agent once hallucinated completion from silence


def test_run_status_notes_existing_results_without_a_run(bridge_with_results):
    status = tools.get_run_status()
    assert status["running"] is False
    assert status["has_results"] is True
    assert "DO exist on screen" in status["note"]
