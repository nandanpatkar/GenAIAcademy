"""Extract a structured candidate profile from CV text.

This is a preprocessing step that runs *before* the job-finding graph: the graph
takes the resulting ``Profile`` as input and focuses on searching and ranking
jobs. Keeping extraction out of the graph keeps the graph about one thing —
finding jobs — and lets a caller (like the UI) extract once and reuse it.
"""

from __future__ import annotations

from job_scout.config import get_settings
from job_scout.graph.schemas import Profile
from job_scout.llm import get_chat_model

EXTRACT_PROFILE_PROMPT_NAME = "extract_profile"

EXTRACT_PROFILE_PROMPT = """You are a recruiting assistant. Read the CV text below and extract a structured candidate profile.

Fill in every field:
- name: the candidate's name, or null if not present.
- seniority: one of junior, mid, senior, lead, or unknown.
- primary_roles: the job titles/roles this person is a fit for, ordered with their current or most recent role first.
- skills: a list of their skills, lowercased.
- years_experience: total years of professional experience as a number, or null.
- locations: locations where they could work.
- languages: spoken languages.
- remote_ok: true if they are open to remote work.
- raw_summary: a 3-4 sentence summary, starting with their most recent experience.

CV text:
{cv_text}
"""


def extract_profile(
    cv_text: str, *, thread_id: str | None = None, tags: list[str] | None = None, model: str | None = None
) -> Profile:
    """Extract a structured profile from CV text with a single LLM call.

    Pass ``thread_id`` and ``tags`` to trace the call in Opik (grouped with the
    search run on the same thread). ``model`` overrides ``SCOUT_MODEL`` — used
    by the eval harness to compare extractors.
    """
    from job_scout.tracing import get_tracer

    settings = get_settings()
    llm = get_chat_model(model or settings.scout_model, temperature=0.0).with_structured_output(Profile)

    tracer = get_tracer(thread_id, tags or ["extract"]) if thread_id else None
    config = {"callbacks": [tracer]} if tracer else {}
    profile: Profile = llm.invoke(EXTRACT_PROFILE_PROMPT.format(cv_text=cv_text), config=config)
    if tracer:
        tracer.flush()
    return profile
