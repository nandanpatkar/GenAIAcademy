"""The tracing helpers must be free when tracing is off — and silent."""

from __future__ import annotations

import job_scout.tracing as tracing
from job_scout.tools import jobs_api


def test_traced_call_is_identity_when_tracing_is_off(monkeypatch):
    """No key, no wrapper. opik.track would answer 401 into a reader's terminal."""
    monkeypatch.setattr(tracing, "configure_opik", lambda: False)

    def fetch() -> str:
        return "jobs"

    assert tracing.traced_call("source.adzuna", fetch) is fetch


def test_traced_call_wraps_when_tracing_is_on(monkeypatch):
    monkeypatch.setattr(tracing, "configure_opik", lambda: True)
    marker: list[str] = []

    def fake_track(**kwargs):
        marker.append(kwargs["name"])

        def decorate(fn):
            return fn

        return decorate

    import opik

    monkeypatch.setattr(opik, "track", fake_track)

    def fetch() -> str:
        return "jobs"

    tracing.traced_call("source.adzuna", fetch, metadata={"source": "adzuna"})
    assert marker == ["source.adzuna"]


def test_each_live_source_gets_its_own_span(monkeypatch, sample_jobs):
    """Ollie can only name the slow source if the trace has a span per source."""
    named: list[str] = []

    def fake_traced_call(name, fn, metadata=None):
        named.append(name)
        assert metadata is not None and metadata["source"] == name.removeprefix("source.")
        return fn

    monkeypatch.setattr(tracing, "traced_call", fake_traced_call)

    class Source:
        available = True

        def fetch(self, *args, **kwargs):
            return sample_jobs

    jobs, used = jobs_api.run_search(
        "data scientist",
        "Berlin",
        "de",
        False,
        5,
        jsearch=Source(),
        adzuna=Source(),
        remotive=Source(),
        cache=Source(),
    )

    assert named == ["source.jsearch", "source.adzuna", "source.remotive"]
    # Spans wrap the QUERY; the cascade still decides consumption. Three deduped
    # jobs is under the <5 threshold, so every live source is merged in — and
    # cache is not, because three is not under the <3 one.
    assert used == ["jsearch", "adzuna", "remotive"]
    assert len(jobs) == 3
