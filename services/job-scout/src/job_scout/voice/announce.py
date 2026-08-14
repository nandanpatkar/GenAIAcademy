"""What Jobvis says, unprompted, when a background run finishes.

A voice-triggered search or tailoring returns to the agent immediately and then
works for a minute or two. When it lands, somebody has to tell Jobvis — the
agent has no way to notice on its own. These "System note:" lines are that
telling: the browser console reads them off the SSE stream and replays them as
user messages, which is the one thing that makes the agent speak (a contextual
update is silent context only).

Pure text assembly, no I/O, so the API layer and its tests can both use it.
"""

from __future__ import annotations

from job_scout.voice.bridge import VoiceRun


def run_announcement(run: VoiceRun) -> str:
    """The 'System note' that makes Jobvis speak, unprompted, about a finished run."""
    if run.failed:
        return f"System note: the {run.kind} failed ({run.error or 'unknown error'}). Apologize briefly and suggest trying again."
    if run.kind == "search" and run.search_result is not None:
        ranked = run.search_result.ranked_jobs
        if not ranked:
            return (
                "System note: the job search finished but found no matching jobs. "
                "Break it gently; suggest a more detailed resume or trying again later."
            )
        top = ranked[0]
        return (
            f"System note: the job search just finished — {len(ranked)} jobs ranked, now on screen. "
            f"Top match: {top.job.title} at {top.job.company}, {top.fit_score} out of 100. "
            "Brief the user in one or two sentences and offer to run through the top three."
        )
    if run.kind == "tailor" and run.tailor_result is not None:
        result = run.tailor_result
        if result.pack is None:
            return "System note: tailoring finished but produced no application. Apologize and suggest trying again."
        flags = result.fabrication_flags
        verdict = (
            "every claim checked against the CV, no flags"
            if flags == 0
            else f"{flags} statement{'s' if flags != 1 else ''} could not be verified — advise an on-screen review"
        )
        return (
            "System note: the application pack is ready and on screen — cover letter and tailored CV with downloads. "
            f"Fabrication check: {verdict}. Announce it and offer the highlights."
        )
    return f"System note: the {run.kind} finished; the results are on screen."
