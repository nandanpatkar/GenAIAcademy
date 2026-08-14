"""Tailor node: guards, budget, corpus grounding, research degradation."""

from __future__ import annotations

import pytest

import job_scout.graph.nodes.tailor as tailor_mod
from job_scout.graph.nodes.tailor import tailor
from job_scout.graph.schemas import CVContent, ExperienceEntry, RankedJob, TailoredBullet, TailoringPack
from job_scout.llm import LLMBudgetExceededError
from tests.conftest import make_job, structured_llm
from tests.test_corpus import SAMPLE_CV


def _ranked(job_id: str = "j1") -> RankedJob:
    return RankedJob(job=make_job(job_id, "Data Engineer", "Initech"), fit_score=80, fit_explanation="good fit")


def _pack() -> TailoringPack:
    return TailoringPack(
        cv=CVContent(
            headline="Data Engineer",
            summary="Builds pipelines.",
            skills=["Python"],
        ),
        cover_letter="Dear team,",
        honesty_note="No Kubernetes experience.",
    )


def _state(**overrides) -> dict:
    state = {
        "cv_text": SAMPLE_CV,
        "profile": overrides.pop("profile"),
        "ranked_jobs": [_ranked()],
        "selected_job_id": "j1",
        "llm_calls": 3,
        "errors": [],
    }
    state.update(overrides)
    return state


def test_happy_path_returns_pack_and_increments_budget(monkeypatch, sample_profile):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    update = tailor(_state(profile=sample_profile))

    assert isinstance(update["tailoring"], TailoringPack)
    assert update["llm_calls"] == 4
    assert update["research_notes"] is None  # keyless env skips Tavily
    prompt = llm.with_structured_output().invoke.call_args[0][0]
    assert "[cv-bullet-001]" in prompt  # corpus rendered with ids
    assert "Initech" in prompt


def test_unknown_job_id_errors_without_llm_call(monkeypatch, sample_profile):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    update = tailor(_state(profile=sample_profile, selected_job_id="nope"))

    assert update["tailoring"] is None
    assert any("'nope'" in e for e in update["errors"])
    llm.with_structured_output().invoke.assert_not_called()


def test_virgin_thread_errors_without_llm_call(monkeypatch):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    update = tailor({"selected_job_id": "j1"})

    assert update["tailoring"] is None
    assert any("run a job search first" in e for e in update["errors"])
    llm.with_structured_output().invoke.assert_not_called()


def test_empty_cv_text_errors_gracefully(monkeypatch, sample_profile):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    update = tailor(_state(profile=sample_profile, cv_text=""))

    assert update["tailoring"] is None
    assert any("empty candidate corpus" in e for e in update["errors"])


def test_bad_linkedin_zip_degrades_to_cv_only(monkeypatch, sample_profile, tmp_path):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)
    bogus = tmp_path / "export.zip"
    bogus.write_text("not a zip")

    update = tailor(_state(profile=sample_profile, linkedin_zip_path=str(bogus)))

    assert isinstance(update["tailoring"], TailoringPack)
    assert any("continuing with the CV only" in e for e in update["errors"])


def test_budget_exceeded_raises(monkeypatch, sample_profile):
    llm = structured_llm(_pack())
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    with pytest.raises(LLMBudgetExceededError):
        tailor(_state(profile=sample_profile, llm_calls=25))


def test_bullet_requiring_corpus_ref_flows_through(monkeypatch, sample_profile):
    pack = _pack()
    pack.cv.experience = [
        # Schema-level guarantee exercised end to end: bullets carry refs.
        ExperienceEntry(
            role="Data Engineer",
            company="PipeCorp",
            bullets=[TailoredBullet(text="Built streaming ingestion handling 2M events/day", corpus_ref="cv-bullet-002")],
        )
    ]
    llm = structured_llm(pack)
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)

    update = tailor(_state(profile=sample_profile))
    bullets = update["tailoring"].cv.experience[0].bullets
    assert bullets[0].corpus_ref == "cv-bullet-002"
