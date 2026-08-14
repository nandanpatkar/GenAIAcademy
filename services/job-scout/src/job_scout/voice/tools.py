"""Jobvis client tools — the only things the voice agent can "know".

Each function is an ElevenLabs client-tool handler: it receives the tool-call
parameters as one dict and returns a JSON-serializable dict the agent speaks
from. Payloads are small and rounded because they are written to be SAID, not
displayed. Every fact comes from the wizard bridge or the LangGraph checkpoint,
never from the model's imagination — the Phase 2 grounding contract (the
fabrication validator) applied to a new modality.
"""

from __future__ import annotations

import job_scout.voice.bridge as _bridge
from job_scout.graph.schemas import RankedJob, TailoringPack

_MAX_JOBS = 5
_DEFAULT_JOBS = 3
_GAPS_PER_JOB = 3
_SKILLS_PER_JOB = 4
_WHY_CHARS = 350

_NO_CV_NOTE = "No CV uploaded yet — ask the user to drop a PDF resume into the app, then try again."
_NO_RESULTS_NOTE = "No ranked jobs yet — offer to start the search, or point the user at the Find jobs button."
_NO_PACK_NOTE = "No application has been tailored yet — offer to start one with start_tailoring."

# Spoken references arrive as words at least as often as digits.
_ORDINALS = {
    "first": 1, "one": 1, "top": 1,
    "second": 2, "two": 2,
    "third": 3, "three": 3,
    "fourth": 4, "four": 4,
    "fifth": 5, "five": 5,
}  # fmt: skip


def get_session_status(parameters: dict | None = None) -> dict:
    """Where the wizard stands: step, profile, results, application, run."""
    bridge = _bridge.get_bridge()
    snap = bridge.snapshot()
    values = _bridge.checkpoint_values(snap.thread_id)
    ranked = list(values.get("ranked_jobs") or [])
    status = {
        "step": snap.step,
        "has_profile": snap.profile is not None,
        "has_results": bool(ranked),
        "has_application": values.get("tailoring") is not None,
        "n_ranked": len(ranked),
        "candidate_name": (snap.profile.name if snap.profile else None) or "",
        "run_in_progress": bridge.run_in_progress(),
    }
    if snap.profile is None:
        status["note"] = _NO_CV_NOTE
    elif not ranked:
        status["note"] = _NO_RESULTS_NOTE
    return status


def get_top_jobs(parameters: dict | None = None) -> dict:
    """The top ranked jobs, fit-sorted, trimmed to a speakable brief."""
    snap = _bridge.get_bridge().snapshot()
    ranked = _bridge.ranked_jobs(snap.thread_id)
    if not ranked:
        return {"jobs": [], "total_ranked": 0, "note": _NO_CV_NOTE if snap.profile is None else _NO_RESULTS_NOTE}
    count = _clamp_count((parameters or {}).get("count"))
    return {"jobs": [_job_brief(r, i) for i, r in enumerate(ranked[:count], 1)], "total_ranked": len(ranked)}


def get_job_details(parameters: dict | None = None) -> dict:
    """One ranked job in detail, resolved from a spoken reference."""
    snap = _bridge.get_bridge().snapshot()
    ranked = _bridge.ranked_jobs(snap.thread_id)
    if not ranked:
        return {"found": False, "note": _NO_CV_NOTE if snap.profile is None else _NO_RESULTS_NOTE}
    index, candidates = _resolve_job_ref((parameters or {}).get("job_ref"), ranked)
    if index is None:
        if candidates:
            return {"found": False, "candidates": candidates, "note": "Several jobs match — ask which one they meant."}
        return {"found": False, "note": "No job matched that reference — use the rank number from get_top_jobs."}
    r = ranked[index]
    return {
        "found": True,
        "rank": index + 1,
        "title": r.job.title,
        "company": r.job.company,
        "location": r.job.location,
        "remote": r.job.remote,
        "score": r.fit_score,
        "why": _trim(r.fit_explanation),
        "matched_skills": r.matched_skills[:_SKILLS_PER_JOB],
        "gaps": r.gaps[:_GAPS_PER_JOB],
        "has_url": bool(r.job.url),
    }


def read_application(parameters: dict | None = None) -> dict:
    """The finished application pack, in speakable portions."""
    snap = _bridge.get_bridge().snapshot()
    values = _bridge.checkpoint_values(snap.thread_id)
    pack: TailoringPack | None = values.get("tailoring")
    if pack is None:
        return {"found": False, "note": _NO_PACK_NOTE}

    flags = int(values.get("fabrication_flags") or 0)
    if flags == 0:
        verdict = "Every claim was checked against the CV — no flags."
    else:
        plural = "s" if flags != 1 else ""
        verdict = f"{flags} statement{plural} could not be verified against the CV — worth reviewing on screen."

    part = str((parameters or {}).get("part") or "summary").strip().lower()
    if part == "cover_letter":
        text = pack.cover_letter
    elif part == "cv_highlights":
        text = _cv_highlights(pack)
    else:
        part = "summary"
        text = _pack_summary(pack, values, verdict)
    return {"found": True, "part": part, "text": text, "fabrication_note": verdict}


def start_search(parameters: dict | None = None) -> dict:
    """Fire-and-forget job search on the wizard's thread."""
    refusal = _bridge.get_bridge().start_search()
    if refusal:
        return {"started": False, "note": refusal}
    return {
        "started": True,
        "note": "Search started — it takes a minute or so, and the results appear on screen by themselves.",
    }


def start_tailoring(parameters: dict | None = None) -> dict:
    """Fire-and-forget tailoring for one ranked job, resolved from a spoken reference."""
    bridge = _bridge.get_bridge()
    ranked = _bridge.ranked_jobs(bridge.snapshot().thread_id)
    if not ranked:
        return {"started": False, "note": _NO_RESULTS_NOTE}
    index, candidates = _resolve_job_ref((parameters or {}).get("job_ref"), ranked)
    if index is None:
        if candidates:
            return {"started": False, "candidates": candidates, "note": "Several jobs match — ask which one they meant."}
        return {"started": False, "note": "No job matched that reference — use the rank number from get_top_jobs."}
    r = ranked[index]
    refusal = bridge.start_tailoring(r.job.job_id)
    if refusal:
        return {"started": False, "note": refusal}
    return {
        "started": True,
        "rank": index + 1,
        "title": r.job.title,
        "company": r.job.company,
        "note": "Tailoring started — the application pops up on screen when it is ready, about a minute.",
    }


def get_run_status(parameters: dict | None = None) -> dict:
    """Progress of the background search/tailor run.

    When nothing was ever started, the note says so UNAMBIGUOUSLY — an agent
    once spun a bare "nothing is running" into "the search has completed",
    announcing results that did not exist.
    """
    bridge = _bridge.get_bridge()
    status = bridge.run_status()
    if not status.get("running") and "kind" not in status:
        has_results = bool(_bridge.ranked_jobs(bridge.snapshot().thread_id))
        status["has_results"] = has_results
        status["note"] = "No background run has been started in this voice session." + (
            " Ranked results from earlier DO exist on screen."
            if has_results
            else " There are no results yet either — nothing has completed. If the user wants jobs, call start_search now."
        )
    return status


CLIENT_TOOL_HANDLERS = {
    "get_session_status": get_session_status,
    "get_top_jobs": get_top_jobs,
    "get_job_details": get_job_details,
    "read_application": read_application,
    "start_search": start_search,
    "start_tailoring": start_tailoring,
    "get_run_status": get_run_status,
}


def _clamp_count(raw: object) -> int:
    try:
        count = int(raw)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return _DEFAULT_JOBS
    return max(1, min(count, _MAX_JOBS))


def _job_brief(ranked: RankedJob, rank: int) -> dict:
    job = ranked.job
    return {
        "rank": rank,
        "title": job.title,
        "company": job.company,
        "location": job.location,
        "remote": job.remote,
        "score": ranked.fit_score,
        "matched_skills": ranked.matched_skills[:_SKILLS_PER_JOB],
        "top_gaps": ranked.gaps[:_GAPS_PER_JOB],
    }


def _resolve_job_ref(job_ref: object, ranked: list[RankedJob]) -> tuple[int | None, list[str]]:
    """Resolve a spoken job reference to a list index.

    Returns ``(index, [])`` on a match, ``(None, candidates)`` when ambiguous,
    and ``(None, [])`` when nothing matches.
    """
    text = str(job_ref or "").strip().lower()
    if not text:
        return None, []
    number = int(text) if text.isdigit() else _ORDINALS.get(text)
    if number is not None:
        return (number - 1, []) if 1 <= number <= len(ranked) else (None, [])
    hits = [i for i, r in enumerate(ranked) if text in r.job.title.lower() or text in r.job.company.lower()]
    if len(hits) == 1:
        return hits[0], []
    if hits:
        return None, [f"{i + 1}: {ranked[i].job.title} at {ranked[i].job.company}" for i in hits]
    return None, []


def _trim(text: str, limit: int = _WHY_CHARS) -> str:
    if len(text) <= limit:
        return text
    return text[:limit].rsplit(" ", 1)[0] + "…"


def _selected_job(values: dict) -> RankedJob | None:
    selected_id = values.get("selected_job_id")
    for r in values.get("ranked_jobs") or []:
        if r.job.job_id == selected_id:
            return r
    return None


def _pack_summary(pack: TailoringPack, values: dict, verdict: str) -> str:
    job = _selected_job(values)
    target = f"{job.job.title} at {job.job.company}" if job else "the selected job"
    words = len(pack.cover_letter.split())
    summary = (
        f"The application targets {target}. The cover letter runs about {words} words, "
        f"and the CV leads with: {pack.cv.headline}. {verdict}"
    )
    if pack.honesty_note:
        summary += f" Honesty note: {pack.honesty_note}"
    return summary


def _cv_highlights(pack: TailoringPack) -> str:
    parts = [pack.cv.headline, pack.cv.summary]
    for entry in pack.cv.experience[:3]:
        if entry.bullets:
            parts.append(f"At {entry.company}: {entry.bullets[0].text}")
    if pack.cv.skills:
        parts.append("Key skills: " + ", ".join(pack.cv.skills[:6]) + ".")
    return " ".join(p.rstrip(".") + "." for p in parts if p)
