"""Tests for the persisted candidate and the app's restore-on-load path."""

from __future__ import annotations

import pytest

import job_scout.app as app_module
import job_scout.candidate_store as candidate_store
import job_scout.voice.bridge as bridge_module
from job_scout.voice.bridge import VoiceBridge


@pytest.fixture
def tmp_store(monkeypatch, tmp_path):
    monkeypatch.setattr(candidate_store, "_STORE_DIR", tmp_path)
    monkeypatch.setattr(candidate_store, "_STORE_PATH", tmp_path / "profile.json")
    return candidate_store


def test_save_load_roundtrip(tmp_store, sample_profile):
    tmp_store.save_candidate(sample_profile, "cv text here")
    stored = tmp_store.load_candidate()
    assert stored is not None
    assert stored.profile == sample_profile
    assert stored.cv_text == "cv text here"
    assert stored.preferences is None


def test_preferences_roundtrip(tmp_store, sample_profile):
    prefs = {"locations": ["Tokyo, Japan"], "remote": False}
    tmp_store.save_candidate(sample_profile, "cv", prefs)
    stored = tmp_store.load_candidate()
    assert stored.preferences == prefs


def test_v1_file_loads_without_preferences(tmp_store, tmp_path, sample_profile):
    import json

    payload = {"version": 1, "profile": sample_profile.model_dump(), "cv_text": "old cv"}
    (tmp_path / "profile.json").write_text(json.dumps(payload), encoding="utf-8")
    stored = tmp_store.load_candidate()
    assert stored is not None
    assert stored.cv_text == "old cv" and stored.preferences is None


def test_load_absent_and_corrupt_return_none(tmp_store, tmp_path):
    assert tmp_store.load_candidate() is None
    (tmp_path / "profile.json").write_text("{not json", encoding="utf-8")
    assert tmp_store.load_candidate() is None
    (tmp_path / "profile.json").write_text('{"version": 1}', encoding="utf-8")
    assert tmp_store.load_candidate() is None  # missing keys


def test_clear_candidate(tmp_store, sample_profile):
    tmp_store.save_candidate(sample_profile, "cv")
    tmp_store.clear_candidate()
    assert tmp_store.load_candidate() is None
    tmp_store.clear_candidate()  # idempotent on an empty store


@pytest.fixture
def fresh_bridge(monkeypatch) -> VoiceBridge:
    bridge = VoiceBridge()
    monkeypatch.setattr(bridge_module, "_BRIDGE", bridge)
    return bridge


def test_on_load_without_store_is_a_noop(tmp_store, fresh_bridge):
    updates = app_module._on_load("t1")
    assert all("visible" not in update for update in updates)
    assert fresh_bridge.snapshot().thread_id == "t1"
    assert fresh_bridge.snapshot().profile is None


def test_on_load_restores_candidate_and_opens_step_two(tmp_store, fresh_bridge, sample_profile):
    tmp_store.save_candidate(sample_profile, "cv text here", {"locations": ["Tokyo, Japan"], "remote": False})

    page_start, page_profile, profile_html, cv_text, profile, loc_choices, loc_group = app_module._on_load("t1")

    assert page_start["visible"] is False and page_profile["visible"] is True
    assert "Test Candidate" in profile_html and "Restored from your last session" in profile_html
    assert cv_text == "cv text here"
    assert profile == sample_profile  # the RAW profile — extraction stays what was measured
    assert "Tokyo, Japan" in loc_choices and loc_group["value"] == ["Tokyo, Japan"]  # stored choice wins, remote off
    snap = fresh_bridge.snapshot()
    assert snap.profile.locations == ["Tokyo, Japan"] and snap.profile.remote_ok is False  # Jobvis sees the choice
    assert snap.step == "profile"


def test_reset_forgets_the_stored_candidate(tmp_store, fresh_bridge, sample_profile):
    tmp_store.save_candidate(sample_profile, "cv")
    app_module.reset()
    assert tmp_store.load_candidate() is None


def test_on_find_searches_the_chosen_locations(tmp_store, fresh_bridge, sample_profile, monkeypatch):
    from job_scout.runner import RunResult

    seen = {}

    def fake_stream(profile, **kwargs):
        seen["profile"] = profile
        yield ("result", RunResult())

    monkeypatch.setattr(app_module, "stream_search", fake_stream)
    selection = ["Tokyo, Japan", app_module.REMOTE_CHOICE]
    list(app_module.on_find("cv text", sample_profile, "t1", selection))

    assert seen["profile"].locations == ["Tokyo, Japan"] and seen["profile"].remote_ok is True
    assert sample_profile.locations == ["Berlin, Germany"]  # the raw profile is never mutated
    assert tmp_store.load_candidate().preferences == {"locations": ["Tokyo, Japan"], "remote": True}


def test_on_add_location_ticks_and_persists(tmp_store, fresh_bridge, sample_profile):
    choices = ["Berlin, Germany", app_module.REMOTE_CHOICE]
    new_choices, group_update, cleared = app_module.on_add_location(
        "  Lisbon  ", choices, ["Berlin, Germany"], sample_profile, "cv", "t1"
    )
    assert new_choices == ["Berlin, Germany", "Lisbon", app_module.REMOTE_CHOICE]
    assert group_update["value"] == ["Berlin, Germany", "Lisbon"]
    assert cleared == ""
    assert tmp_store.load_candidate().preferences == {"locations": ["Berlin, Germany", "Lisbon"], "remote": False}

    unchanged, no_update, _ = app_module.on_add_location("Lisbon", new_choices, [], sample_profile, "cv", "t1")
    assert unchanged == new_choices and "value" not in no_update  # duplicates are a no-op
