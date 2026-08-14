"""The unprompted 'System note' lines: right facts, right tone, every branch."""

from __future__ import annotations

from job_scout.graph.schemas import CVContent, RankedJob, TailoringPack
from job_scout.runner import RunResult, TailorResult
from job_scout.voice.announce import run_announcement
from job_scout.voice.bridge import VoiceRun
from tests.conftest import make_job


def _search_run(ranked_jobs):
    return VoiceRun(kind="search", done=True, search_result=RunResult(ranked_jobs=ranked_jobs))


def _tailor_run(flags: int) -> VoiceRun:
    pack = TailoringPack(cv=CVContent(headline="DS", summary="s"), cover_letter="Dear team,")
    return VoiceRun(kind="tailor", done=True, tailor_result=TailorResult(pack=pack, fabrication_flags=flags))


def test_search_announcement_names_the_top_match():
    top = RankedJob(job=make_job("j1", "ML Engineer", "Acme"), fit_score=87, fit_explanation="fits")
    text = run_announcement(_search_run([top]))
    assert text.startswith("System note:")
    assert "ML Engineer at Acme, 87 out of 100" in text


def test_empty_search_is_broken_gently():
    assert "found no matching jobs" in run_announcement(_search_run([]))


def test_failed_run_carries_the_error():
    text = run_announcement(VoiceRun(kind="tailor", done=True, failed=True, error="RateLimitError"))
    assert "failed" in text and "RateLimitError" in text


def test_flagged_pack_asks_for_an_on_screen_review():
    assert "2 statements could not be verified" in run_announcement(_tailor_run(2))


def test_clean_pack_says_no_flags():
    assert "no flags" in run_announcement(_tailor_run(0))


def test_packless_tailoring_apologizes():
    run = VoiceRun(kind="tailor", done=True, tailor_result=TailorResult())
    assert "produced no application" in run_announcement(run)


def test_unknown_shape_still_says_something_speakable():
    """A run with no result attached must not hand the agent an empty string."""
    assert run_announcement(VoiceRun(kind="search", done=True)).startswith("System note:")
