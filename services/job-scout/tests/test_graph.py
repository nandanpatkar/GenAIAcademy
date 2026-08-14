"""Graph routing, loop guard, and the LLM call budget."""

from __future__ import annotations

import pytest

from job_scout.graph.graph import END, get_compiled_graph, should_reformulate
from job_scout.graph.schemas import JobPosting, RankedJob
from job_scout.llm import LLMBudgetExceededError, ensure_budget


def _ranked(score: int) -> RankedJob:
    job = JobPosting(job_id="x", title="t", company="c", location="l", source="cache")
    return RankedJob(job=job, fit_score=score, fit_explanation="e")


def test_route_loops_when_few_good_and_under_cap():
    state = {"ranked_jobs": [_ranked(70)], "reformulation_count": 0}
    assert should_reformulate(state) == "reformulate_query"


def test_route_ends_when_enough_good_jobs():
    state = {"ranked_jobs": [_ranked(70)] * 5, "reformulation_count": 0}
    assert should_reformulate(state) == END


def test_route_ends_when_reformulation_cap_hit():
    state = {"ranked_jobs": [_ranked(70)], "reformulation_count": 2}
    assert should_reformulate(state) == END


def test_route_ignores_low_scores_toward_quota():
    # 5 jobs but none >= 60 -> still loops (under cap)
    state = {"ranked_jobs": [_ranked(50)] * 5, "reformulation_count": 1}
    assert should_reformulate(state) == "reformulate_query"


def test_budget_allows_under_limit():
    ensure_budget(current_calls=10, planned=5, max_calls=25)  # no raise


def test_budget_raises_over_limit():
    with pytest.raises(LLMBudgetExceededError):
        ensure_budget(current_calls=24, planned=2, max_calls=25)


def test_get_compiled_graph_is_process_singleton():
    # One graph + one checkpointer per process is what lets the tailor
    # invocation read the search invocation's thread state.
    assert get_compiled_graph() is get_compiled_graph()


def test_should_reformulate_respects_demo_mode(monkeypatch, sample_profile):
    """SCOUT_MAX_REFORMULATIONS=0 → one pass, no loops, regardless of thin fits."""
    from job_scout.config import get_settings

    monkeypatch.setenv("SCOUT_MAX_REFORMULATIONS", "0")
    get_settings.cache_clear()
    state = {"profile": sample_profile, "ranked_jobs": [], "reformulation_count": 0}
    assert should_reformulate(state) == END
