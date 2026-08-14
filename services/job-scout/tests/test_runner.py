"""Runner contract: the search always passes selected_job_id explicitly.

This is the state-reset guarantee from the spec — a run must never route into
stale Phase-2 tailoring state on a reused checkpointer thread.
"""

from __future__ import annotations

from types import SimpleNamespace

import job_scout.runner as runner_mod
from job_scout.runner import run_once, stream_search, stream_tailor


class _FakeGraph:
    def __init__(self, values: dict | None = None):
        self.captured_inputs = None
        self.values = values if values is not None else {"profile": None, "ranked_jobs": [], "jobs_sources": ["cache"]}

    def stream(self, inputs, config, stream_mode):
        self.captured_inputs = inputs
        return iter([])  # no node updates

    def get_state(self, config):
        return SimpleNamespace(values=self.values)


def _patch(monkeypatch, fake):
    monkeypatch.setattr(runner_mod, "get_compiled_graph", lambda: fake)
    monkeypatch.setattr(runner_mod, "trace_graph", lambda g, t: g)
    monkeypatch.setattr(runner_mod, "get_tracer", lambda *a, **k: None)


def test_search_passes_profile_and_nulls_selected_job_id(monkeypatch, sample_profile):
    fake = _FakeGraph()
    _patch(monkeypatch, fake)
    monkeypatch.setattr(runner_mod, "extract_profile", lambda *a, **k: sample_profile)

    run_once("cv text here", thread_id="t1", tags=["batch"])

    assert fake.captured_inputs["profile"] is sample_profile
    assert fake.captured_inputs["selected_job_id"] is None


def test_stream_search_yields_result(monkeypatch, sample_profile):
    fake = _FakeGraph()
    _patch(monkeypatch, fake)

    events = list(stream_search(sample_profile, thread_id="t1", tags=["ui"]))
    assert events[-1][0] == "result"
    result = events[-1][1]
    assert result.jobs_sources == ["cache"]
    assert result.failed is False


def test_stream_tailor_passes_only_selection_inputs(monkeypatch):
    # The acceptance-criterion invocation: nothing but the selection (and the
    # optional LinkedIn path) goes in; the checkpoint supplies the rest.
    fake = _FakeGraph(values={"tailoring": None, "fabrication_flags": 2, "errors": ["e"]})
    _patch(monkeypatch, fake)

    events = list(stream_tailor(thread_id="t1", selected_job_id="j9", tags=["tailor"]))

    assert fake.captured_inputs == {"selected_job_id": "j9", "linkedin_zip_path": None}
    result = events[-1][1]
    assert result.fabrication_flags == 2
    assert result.errors == ["e"]
    assert result.failed is False
