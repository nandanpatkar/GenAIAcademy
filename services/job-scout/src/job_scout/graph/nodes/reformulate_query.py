"""Broaden the search query when too few good matches came back.

Increments the reformulation counter (the loop guard) and writes a new
``search_query`` that fetch_jobs will use as guidance on the next pass.
"""

from __future__ import annotations

from job_scout.config import get_settings
from job_scout.graph.prompts.reformulate import REFORMULATE_PROMPT
from job_scout.graph.state import AgentState
from job_scout.llm import ensure_budget, get_chat_model


def reformulate_query(state: AgentState) -> dict:
    """Ask the LLM for a broader search query and bump the loop counter."""
    settings = get_settings()
    calls = state.get("llm_calls", 0)
    ensure_budget(calls, 1, settings.max_llm_calls_per_run)
    profile = state["profile"]

    prompt = REFORMULATE_PROMPT.format(
        profile=", ".join(profile.primary_roles + profile.skills[:10]),
        previous_query=state.get("search_query") or "",
    )
    new_query = get_chat_model(settings.scout_model, temperature=0.0).invoke(prompt).content.strip()

    return {
        "search_query": new_query,
        "reformulation_count": state.get("reformulation_count", 0) + 1,
        "llm_calls": calls + 1,
    }
