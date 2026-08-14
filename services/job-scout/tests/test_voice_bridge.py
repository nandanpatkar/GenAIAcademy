"""Tests for the wizard⇄voice bridge: registry semantics and background runs."""

from __future__ import annotations

import threading
import time

import job_scout.voice.bridge as bridge_module
from job_scout.graph.schemas import RankedJob
from job_scout.runner import RunResult, TailorResult
from job_scout.voice.bridge import VoiceBridge
from tests.conftest import make_job


def wait_until(predicate, timeout: float = 2.0) -> bool:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate():
            return True
        time.sleep(0.01)
    return False


def search_stream(result: RunResult):
    def fake(profile, **kwargs):
        yield ("status", "searching jobs…")
        yield ("result", result)

    return fake


def tailor_stream(result: TailorResult):
    def fake(**kwargs):
        yield ("status", "drafting the application…")
        yield ("result", result)

    return fake


def test_registry_snapshot_semantics(sample_profile):
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    bridge.record_linkedin_zip("/tmp/li.zip")
    bridge.record_step("results")

    snap = bridge.snapshot()
    assert snap.thread_id == "t1"
    assert snap.step == "results"
    assert snap.profile is sample_profile
    assert snap.linkedin_zip_path == "/tmp/li.zip"

    bridge.register_thread("t2")  # reset: forget the previous candidate entirely
    snap = bridge.snapshot()
    assert snap.thread_id == "t2" and snap.profile is None and snap.step == "start"


def test_start_search_requires_profile():
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    refusal = bridge.start_search()
    assert refusal is not None and "CV" in refusal
    assert not bridge.run_in_progress()


def test_search_run_completes_and_pops_once(monkeypatch, sample_profile):
    result = RunResult(ranked_jobs=[RankedJob(job=make_job("j1", "DS", "Acme"), fit_score=90, fit_explanation="fits")])
    monkeypatch.setattr(bridge_module, "stream_search", search_stream(result))

    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")

    assert bridge.start_search() is None
    assert wait_until(lambda: bridge.run_status()["done"])

    status = bridge.run_status()
    assert status == {"running": False, "kind": "search", "latest_status": "done", "done": True, "failed": False, "error": ""}
    assert bridge.snapshot().step == "results"

    run = bridge.pop_finished_run()
    assert run is not None and run.search_result is result
    assert bridge.pop_finished_run() is None  # the pop hands over exactly once


def test_second_run_refused_while_busy(monkeypatch, sample_profile):
    release = threading.Event()

    def slow_stream(profile, **kwargs):
        yield ("status", "searching jobs…")
        release.wait(timeout=5)
        yield ("result", RunResult())

    monkeypatch.setattr(bridge_module, "stream_search", slow_stream)
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")

    assert bridge.start_search() is None
    assert wait_until(bridge.run_in_progress)
    refusal = bridge.start_search()
    assert refusal is not None and "busy" in refusal

    release.set()
    assert wait_until(lambda: bridge.run_status()["done"])


def test_failed_run_reports_error(monkeypatch, sample_profile):
    failed = RunResult(failed=True, error_message="RateLimitError: too many requests")
    monkeypatch.setattr(bridge_module, "stream_search", search_stream(failed))
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    bridge.record_step("profile")

    assert bridge.start_search() is None
    assert wait_until(lambda: bridge.run_status()["done"])
    status = bridge.run_status()
    assert status["failed"] is True and "RateLimitError" in status["error"]
    assert bridge.snapshot().step == "profile"  # a failed run does not advance the wizard


def test_tailor_run_uses_same_thread_and_zip(monkeypatch, sample_profile):
    seen: dict = {}
    result = TailorResult()

    def fake(**kwargs):
        seen.update(kwargs)
        yield ("status", "drafting the application…")
        yield ("result", result)

    monkeypatch.setattr(bridge_module, "stream_tailor", fake)
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    bridge.record_linkedin_zip("/tmp/li.zip")

    assert bridge.start_tailoring("j2") is None
    assert wait_until(lambda: bridge.run_status()["done"])
    assert seen["thread_id"] == "t1"
    assert seen["selected_job_id"] == "j2"
    assert seen["linkedin_zip_path"] == "/tmp/li.zip"
    assert seen["tags"] == ["phase-2", "voice", "tailor"]
    assert bridge.snapshot().step == "tailor"
    run = bridge.pop_finished_run()
    assert run is not None and run.tailor_result is result


def test_subscribers_all_see_the_run_and_the_pop_still_works(monkeypatch, sample_profile):
    """Two listeners plus the wizard: everyone gets the finished run, nobody races."""
    result = RunResult(ranked_jobs=[RankedJob(job=make_job("j1", "DS", "Acme"), fit_score=90, fit_explanation="fits")])
    monkeypatch.setattr(bridge_module, "stream_search", search_stream(result))

    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    console, second = bridge.subscribe(), bridge.subscribe()

    assert bridge.start_search() is None
    assert wait_until(lambda: bridge.run_status()["done"])

    for feed in (console, second):
        event = feed.get(timeout=2)
        assert event.kind == "run_finished"
        assert event.run is not None and event.run.search_result is result
    assert bridge.pop_finished_run() is not None  # the wizard's pop is untouched


def test_screen_events_reach_listeners_as_silent_context():
    """A wizard click while Jobvis listens is context, not news to announce."""
    bridge = VoiceBridge()
    console = bridge.subscribe()

    bridge.note_screen_event("Screen event: the user just uploaded a CV.")

    event = console.get(timeout=2)
    assert event.kind == "screen" and event.run is None
    assert "uploaded a CV" in event.text


def test_unsubscribe_stops_the_feed(monkeypatch, sample_profile):
    monkeypatch.setattr(bridge_module, "stream_search", search_stream(RunResult()))
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")

    feed = bridge.subscribe()
    bridge.unsubscribe(feed)
    bridge.unsubscribe(feed)  # a second disconnect must not explode

    assert bridge.start_search() is None
    assert wait_until(lambda: bridge.run_status()["done"])
    assert feed.empty()


def test_exploding_stream_is_contained(monkeypatch, sample_profile):
    def exploding(profile, **kwargs):
        yield ("status", "searching jobs…")
        raise RuntimeError("boom")

    monkeypatch.setattr(bridge_module, "stream_search", exploding)
    bridge = VoiceBridge()
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")

    assert bridge.start_search() is None
    assert wait_until(lambda: bridge.run_status()["done"])
    status = bridge.run_status()
    assert status["failed"] is True and "RuntimeError: boom" in status["error"]
