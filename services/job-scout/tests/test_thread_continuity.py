"""The Phase 2 headline lesson: two invocations, one thread, no recomputation.

Invocation A (job search) writes profile/ranked_jobs into the thread's
checkpoint. Invocation B passes ONLY ``selected_job_id`` on the same thread and
must run just ``tailor`` → ``validate_tailoring`` — the search nodes never run
again. Uses ``build_graph()`` (fresh checkpointer) for test isolation; the app
gets the same behavior through the ``get_compiled_graph()`` singleton.
"""

from __future__ import annotations

import job_scout.graph.nodes.fetch_jobs as fetch_mod
import job_scout.graph.nodes.rank_jobs as rank_mod
import job_scout.graph.nodes.tailor as tailor_mod
from job_scout.graph import build_graph
from job_scout.graph.graph import route_entry
from job_scout.graph.schemas import CVContent, JobScore, JobScores, TailoringPack
from tests.conftest import make_job, structured_llm, tool_calling_llm
from tests.test_corpus import SAMPLE_CV


def _wire_search_mocks(monkeypatch, jobs):
    monkeypatch.setattr(
        fetch_mod,
        "get_chat_model",
        lambda *a, **k: tool_calling_llm([{"name": "search_jobs", "args": {"query": "data engineer"}}]),
    )
    monkeypatch.setattr(fetch_mod, "run_search", lambda *a, **k: (jobs, ["cache"]))
    scores = JobScores(scores=[JobScore(job_id=j.job_id, fit_score=80, fit_explanation="fits") for j in jobs])
    monkeypatch.setattr(rank_mod, "get_chat_model", lambda *a, **k: structured_llm(scores))


def _wire_tailor_mock(monkeypatch):
    pack = TailoringPack(cv=CVContent(headline="DE", summary="s"), cover_letter="Dear team,")
    llm = structured_llm(pack)
    monkeypatch.setattr(tailor_mod, "get_chat_model", lambda *a, **k: llm)
    return llm


def test_route_entry_branches():
    assert route_entry({"selected_job_id": "j1"}) == "tailor"
    assert route_entry({"selected_job_id": None}) == "fetch_jobs"
    assert route_entry({}) == "fetch_jobs"


def test_tailor_invocation_reuses_checkpoint_without_rerunning_search(monkeypatch, sample_profile):
    jobs = [make_job(f"j{i}", f"Role {i}", f"Co{i}") for i in range(1, 6)]
    _wire_search_mocks(monkeypatch, jobs)
    tailor_llm = _wire_tailor_mock(monkeypatch)

    graph = build_graph()
    config = {"configurable": {"thread_id": "t-continuity"}}

    # Invocation A: the job search. selected_job_id explicitly nulled.
    search_nodes = []
    for chunk in graph.stream(
        {"profile": sample_profile, "cv_text": SAMPLE_CV, "selected_job_id": None}, config=config, stream_mode="updates"
    ):
        search_nodes.extend(chunk.keys())
    assert "fetch_jobs" in search_nodes and "rank_jobs" in search_nodes
    assert "tailor" not in search_nodes

    # Invocation B: ONLY the selected job id — everything else from the checkpoint.
    tailor_nodes = []
    for chunk in graph.stream({"selected_job_id": "j3"}, config=config, stream_mode="updates"):
        tailor_nodes.extend(chunk.keys())

    assert set(tailor_nodes) == {"tailor", "validate_tailoring"}  # NO fetch/rank spans

    final = graph.get_state(config).values
    assert isinstance(final["tailoring"], TailoringPack)
    assert final["fabrication_report"] is not None
    # The tailor prompt was built from the CHECKPOINTED profile and job.
    prompt = tailor_llm.with_structured_output().invoke.call_args[0][0]
    assert "Role 3" in prompt
    assert sample_profile.name in prompt


def test_stale_selected_job_id_routes_search_into_tailor(monkeypatch, sample_profile):
    """The teachable bug: omitting selected_job_id on a used thread misroutes.

    This is why the runner nulls it explicitly on every search invocation. The
    Phase 2 notebook demonstrates the same thing against a live trace.
    """
    jobs = [make_job(f"j{i}", f"Role {i}", f"Co{i}") for i in range(1, 6)]
    _wire_search_mocks(monkeypatch, jobs)
    _wire_tailor_mock(monkeypatch)

    graph = build_graph()
    config = {"configurable": {"thread_id": "t-stale"}}
    graph.invoke({"profile": sample_profile, "cv_text": SAMPLE_CV, "selected_job_id": None}, config=config)
    graph.invoke({"selected_job_id": "j1"}, config=config)

    # "New upload" that forgets to null selected_job_id → routed into tailor.
    nodes = []
    for chunk in graph.stream({"profile": sample_profile, "cv_text": SAMPLE_CV}, config=config, stream_mode="updates"):
        nodes.extend(chunk.keys())
    assert "tailor" in nodes and "fetch_jobs" not in nodes

    # The fix (what stream_search always does): pass selected_job_id=None.
    nodes = []
    for chunk in graph.stream(
        {"profile": sample_profile, "cv_text": SAMPLE_CV, "selected_job_id": None}, config=config, stream_mode="updates"
    ):
        nodes.extend(chunk.keys())
    assert "fetch_jobs" in nodes and "tailor" not in nodes
