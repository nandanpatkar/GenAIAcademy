"""Run the deterministic fabrication validator on the tailoring pack (Phase 2).

A separate node (not folded into ``tailor``) on purpose: it gets its own span
in the trace, making "every claim was checked against the CV" a first-class
observable step — the hook for online eval rules and Phase 3 comparisons. It
costs zero LLM calls. It logs; it never retries (there is deliberately no edge
back to ``tailor``).
"""

from __future__ import annotations

from job_scout.corpus import build_corpus
from job_scout.graph.state import AgentState
from job_scout.validation import validate_pack


def validate_tailoring(state: AgentState) -> dict:
    """Check the generated pack against the corpus; write flags into state."""
    pack = state.get("tailoring")
    if pack is None:  # tailor already recorded why in state["errors"]
        return {"fabrication_flags": 0, "fabrication_report": None}

    try:
        corpus = build_corpus(state.get("cv_text", ""), state.get("linkedin_zip_path"))
    except ValueError:  # same degradation as the tailor node
        corpus = build_corpus(state.get("cv_text", ""))

    job_id = state.get("selected_job_id")
    ranked = next((r for r in state.get("ranked_jobs", []) if r.job.job_id == job_id), None)
    job_context = [f"{ranked.job.title} at {ranked.job.company}", ranked.job.company] if ranked else []

    report = validate_pack(pack, corpus, research_notes=state.get("research_notes"), job_context=job_context)
    return {"fabrication_flags": report.flags, "fabrication_report": report}
