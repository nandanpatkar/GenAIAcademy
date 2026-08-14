"""The wizard builds with voice on or off, and mirrors voice-triggered runs.

Jobvis itself lives in the browser console now, so nothing here starts a
session — the wizard's only remaining voice duty is to keep its pages in sync
with a run somebody started by talking.
"""

from __future__ import annotations

import time

import job_scout.app as app_module
import job_scout.voice.bridge as bridge_module
from job_scout.runner import RunResult, TailorResult
from job_scout.voice.bridge import VoiceBridge


def test_build_app_without_voice(monkeypatch):
    monkeypatch.setattr(app_module, "is_voice_available", lambda: (False, "Jobvis is off — set ELEVENLABS_API_KEY."))
    assert app_module.build_app() is not None


def test_build_app_with_voice_points_at_the_console(monkeypatch):
    monkeypatch.setattr(app_module, "is_voice_available", lambda: (True, ""))
    assert app_module.build_app() is not None


def run_and_finish(bridge: VoiceBridge, monkeypatch, kind: str, result) -> None:
    if kind == "search":
        monkeypatch.setattr(bridge_module, "stream_search", lambda p, **kw: iter([("result", result)]))
        assert bridge.start_search() is None
    else:
        monkeypatch.setattr(bridge_module, "stream_tailor", lambda **kw: iter([("result", result)]))
        assert bridge.start_tailoring("j1") is None
    for _ in range(200):
        if bridge.run_status()["done"]:
            return
        time.sleep(0.01)
    raise AssertionError("run did not finish")


def fresh_bridge(monkeypatch, sample_profile) -> VoiceBridge:
    bridge = VoiceBridge()
    monkeypatch.setattr(bridge_module, "_BRIDGE", bridge)
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    return bridge


def test_tick_pops_a_finished_tailor_run_onto_the_page(monkeypatch, sample_profile):
    """A finished voice-triggered tailoring pops step 4, exactly once."""
    bridge = fresh_bridge(monkeypatch, sample_profile)
    run_and_finish(bridge, monkeypatch, "tailor", TailorResult())  # pack=None → error card, still pops

    outputs = app_module.on_run_tick()
    assert len(outputs) == 10
    page_profile, page_results, page_tailor = outputs[0], outputs[1], outputs[2]
    assert page_tailor["visible"] is True
    assert page_profile["visible"] is False and page_results["visible"] is False

    outputs = app_module.on_run_tick()
    assert "visible" not in outputs[2]  # popped once; the next tick leaves the pages alone


def test_tick_pops_a_finished_search_run(monkeypatch, sample_profile):
    bridge = fresh_bridge(monkeypatch, sample_profile)
    run_and_finish(bridge, monkeypatch, "search", RunResult())
    assert app_module.on_run_tick()[1]["visible"] is True  # page_results pops


def test_tick_shows_live_progress_while_running(monkeypatch, sample_profile):
    """While a voice-triggered run is in flight, the screen mirrors it — never frozen."""
    import threading

    bridge = fresh_bridge(monkeypatch, sample_profile)
    release = threading.Event()

    def slow_stream(profile, **kw):
        yield ("status", "ranking 12 jobs…")
        release.wait(timeout=5)
        yield ("result", RunResult())

    monkeypatch.setattr(bridge_module, "stream_search", slow_stream)
    assert bridge.start_search() is None
    for _ in range(200):
        if bridge.run_status().get("latest_status") == "ranking 12 jobs…":
            break
        time.sleep(0.01)

    outputs = app_module.on_run_tick()
    assert outputs[1]["visible"] is True  # step 3 already shown while the search runs
    assert "ranking 12 jobs…" in outputs[3]  # the runner's live status line, on screen

    release.set()
    for _ in range(200):
        if bridge.run_status()["done"]:
            break
        time.sleep(0.01)
    assert app_module.on_run_tick()[1]["visible"] is True  # the finished pop still renders


def test_screen_events_go_to_the_console_not_a_session(monkeypatch, sample_profile):
    """The wizard whispers to whoever is listening; it no longer owns a session."""
    bridge = fresh_bridge(monkeypatch, sample_profile)
    console = bridge.subscribe()

    app_module._voice_context("Screen event: the user just uploaded a CV.")

    event = console.get(timeout=2)
    assert event.kind == "screen" and "uploaded a CV" in event.text
