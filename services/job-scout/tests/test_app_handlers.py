"""App handler wiring: on_find/on_tailor generators (Gradio-free, mocked runner)."""

from __future__ import annotations

from dataclasses import replace

import job_scout.app as app_mod
from job_scout.app import on_find, on_tailor, on_zip, reset
from job_scout.graph.schemas import CVContent, RankedJob, TailoringPack
from job_scout.runner import RunResult, TailorResult
from tests.conftest import make_job


def _search_result() -> RunResult:
    ranked = [RankedJob(job=make_job("j1", "Data Scientist", "Acme"), fit_score=88, fit_explanation="fits")]
    return RunResult(ranked_jobs=ranked, jobs_sources=["cache"], n_jobs_ranked=1)


def _tailor_result(flags: int = 0) -> TailorResult:
    pack = TailoringPack(cv=CVContent(headline="DS", summary="s"), cover_letter="Dear team,", honesty_note="Gap: SQL.")
    return TailorResult(pack=pack, fabrication_flags=flags)


def _fake_stream(result):
    def stream(*args, **kwargs):
        yield ("status", "working…")
        yield ("result", result)

    return stream


def test_on_find_populates_job_dropdown(monkeypatch, sample_profile):
    monkeypatch.setattr(app_mod, "stream_search", _fake_stream(_search_result()))
    final = list(on_find("cv text", sample_profile, "t1", []))[-1]
    select = final[4]
    assert select["choices"] == [("Data Scientist — Acme (fit 88)", "j1")]
    assert select["visible"] is True


def test_on_tailor_renders_pack_and_honesty_note(monkeypatch, sample_profile):
    monkeypatch.setattr(app_mod, "stream_tailor", _fake_stream(_tailor_result()))
    final = list(on_tailor("j1", "t1", None, sample_profile))[-1]
    html = final[2]
    assert "Dear team," in html
    assert "Honesty note" in html
    assert "traced back to your CV" in html  # zero flags → quiet green line
    # .tex download becomes visible (PDF depends on tectonic availability).
    assert final[5]["visible"] is True


def test_on_tailor_shows_fabrication_warning(monkeypatch, sample_profile):
    result = _tailor_result(flags=2)
    monkeypatch.setattr(app_mod, "stream_tailor", _fake_stream(result))
    final = list(on_tailor("j1", "t1", None, sample_profile))[-1]
    assert "could not be verified against your CV" in final[2]


def test_on_tailor_without_selection_stays_on_results(monkeypatch, sample_profile):
    monkeypatch.setattr(app_mod.gr, "Warning", lambda *a, **k: None)
    final = list(on_tailor(None, "t1", None, sample_profile))[-1]
    assert final[0]["visible"] is True  # page_results stays visible
    assert final[1]["visible"] is False


def test_on_tailor_renders_graceful_error(monkeypatch, sample_profile):
    result = replace(TailorResult(), errors=["tailor: no search state on this thread — run a job search first"])
    monkeypatch.setattr(app_mod, "stream_tailor", _fake_stream(result))
    final = list(on_tailor("j1", "t1", None, sample_profile))[-1]
    assert "Could not tailor this job" in final[2]
    assert "run a job search first" in final[2]


def test_reset_issues_fresh_thread_id():
    first, second = reset(), reset()
    thread_index = 9  # position of thread_id in the reset outputs
    assert first[thread_index] != second[thread_index]


def test_on_zip_passes_path_through():
    assert on_zip("/tmp/export.zip") == "/tmp/export.zip"
    assert on_zip(None) is None
