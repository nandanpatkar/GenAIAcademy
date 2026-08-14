"""The Job Scout job-finding graph.

The graph takes an already-extracted ``Profile`` as input (extraction is a
separate step — see ``job_scout.profile``) and focuses on finding jobs:

    START -> fetch_jobs -> rank_jobs -> [should_reformulate]
                ^                              |
                └──── reformulate_query ◄──────┘
                                               |
                                              END

The conditional edge after ranking is what makes this an agent rather than a
straight-line workflow: if too few strong matches came back, it loops through
``reformulate_query`` to broaden the search — capped at 2 reformulations.

Phase 2 adds a conditional ENTRY router and the tailoring pipeline::

    START -> [route_entry] -- selected_job_id unset --> fetch_jobs -> ... (above)
                  └───────── selected_job_id set ────> tailor -> validate_tailoring -> END

Why one graph, not two (do not split this):

- One checkpointer, one thread namespace: the tailor invocation reads the
  search invocation's ``profile``/``ranked_jobs`` straight from the thread's
  checkpoint — nothing re-runs. Two graphs would need a side channel.
- One trace lineage in Opik: search and tailor land on the same thread_id and
  one agent-graph visualization shows the whole product.
- The router IS the lesson: entry is driven by state, not by which graph the
  caller picked.

As-built note: profile extraction runs BEFORE the graph (``job_scout.profile``),
so the search entry target is ``fetch_jobs``, not an extract node.
"""

from __future__ import annotations

from functools import lru_cache

from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from langgraph.graph import END, START, StateGraph

from job_scout.graph.nodes.fetch_jobs import fetch_jobs
from job_scout.graph.nodes.rank_jobs import rank_jobs
from job_scout.graph.nodes.reformulate_query import reformulate_query
from job_scout.graph.nodes.tailor import tailor
from job_scout.graph.nodes.validate_tailoring import validate_tailoring
from job_scout.graph.state import AgentState

GOOD_FIT_THRESHOLD = 60
MIN_GOOD_JOBS = 5
MAX_REFORMULATIONS = 2

# Our Pydantic state models, explicitly allow-listed for checkpoint
# (de)serialization — LangGraph warns on (and will eventually block)
# unregistered types coming back out of a checkpoint.
_CHECKPOINT_TYPES = [
    ("job_scout.graph.schemas", name)
    for name in (
        "Profile",
        "JobPosting",
        "RankedJob",
        "TailoredBullet",
        "ExperienceEntry",
        "CVContent",
        "TailoringPack",
        "FlaggedClaim",
        "FabricationReport",
    )
]


def _checkpointer() -> MemorySaver:
    return MemorySaver(serde=JsonPlusSerializer(allowed_msgpack_modules=_CHECKPOINT_TYPES))


def route_entry(state: AgentState) -> str:
    """Phase 2 entry router: tailor a selected job, or run the job search.

    Callers must pass ``selected_job_id`` explicitly on EVERY invocation
    (``None`` for a search) — state persists on the thread, so omitting it
    after a tailoring run would route a fresh search into ``tailor`` against a
    stale job. The runner enforces this; the Phase 2 notebook demonstrates the
    bug on purpose.
    """
    return "tailor" if state.get("selected_job_id") else "fetch_jobs"


def should_reformulate(state: AgentState) -> str:
    """Route after ranking: loop to broaden the search, or finish.

    Loops only if there are fewer than ``MIN_GOOD_JOBS`` jobs scoring at least
    ``GOOD_FIT_THRESHOLD`` and we are under the reformulation cap. Reaching the
    cap with thin results is expected, not an error. The cap defaults to
    ``MAX_REFORMULATIONS`` but SCOUT_MAX_REFORMULATIONS can lower it (0 = one
    pass, no loops — demo/latency mode); the conditional edge itself is the
    lesson and stays.
    """
    from job_scout.config import get_settings

    cap = min(MAX_REFORMULATIONS, get_settings().scout_max_reformulations)
    ranked = state.get("ranked_jobs", [])
    good = sum(1 for r in ranked if r.fit_score >= GOOD_FIT_THRESHOLD)
    if good < MIN_GOOD_JOBS and state.get("reformulation_count", 0) < cap:
        return "reformulate_query"
    return END


def build_graph(checkpointer: MemorySaver | None = None):
    """Build and compile the job-finding graph (starts from the profile input)."""
    builder = StateGraph(AgentState)
    builder.add_node("fetch_jobs", fetch_jobs)
    builder.add_node("rank_jobs", rank_jobs)
    builder.add_node("reformulate_query", reformulate_query)
    builder.add_node("tailor", tailor)
    builder.add_node("validate_tailoring", validate_tailoring)

    builder.add_conditional_edges(START, route_entry, ["fetch_jobs", "tailor"])
    builder.add_edge("fetch_jobs", "rank_jobs")
    builder.add_conditional_edges("rank_jobs", should_reformulate, ["reformulate_query", END])
    builder.add_edge("reformulate_query", "fetch_jobs")
    builder.add_edge("tailor", "validate_tailoring")
    builder.add_edge("validate_tailoring", END)

    return builder.compile(checkpointer=checkpointer or _checkpointer())


@lru_cache(maxsize=1)
def get_compiled_graph():
    """One compiled graph + one ``MemorySaver`` for the process lifetime.

    The Phase 2 tailoring flow is two invocations on the same ``thread_id``:
    invocation A (job search) writes profile and ranked jobs into the thread's
    checkpoint; invocation B (``{"selected_job_id": ...}``) reads them back and
    runs only the tailor pipeline. That contract requires the checkpointer to
    outlive a single run — a fresh ``MemorySaver`` per call (the Phase 1
    behavior) would silently lose the thread state between invocations.

    ``MemorySaver`` is in-process, so the sharing scope is one process: the
    Gradio app, a batch script, or a notebook each get exactly one instance,
    which is also the widest scope ``MemorySaver`` can honor. Tests that need
    isolation keep calling ``build_graph()`` directly.
    """
    return build_graph()
