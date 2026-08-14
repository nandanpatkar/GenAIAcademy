"""Opik instrumentation: tracing, CV attachments, and the prompt registry.

Every run (UI or batch) is traced: a span tree per graph node, the agent graph
visualization, per-run cost, and the uploaded CV attached to the trace.

Everything here is offline-safe: with ``OPIK_ENABLED=false`` or no API key, the
functions degrade to no-ops, so tests and keyless runs work. The local prompt
constants remain the source of truth; Opik mirrors them.
"""

from __future__ import annotations

import contextlib
import subprocess
from collections.abc import Callable
from functools import lru_cache
from pathlib import Path
from typing import Any

from job_scout.config import get_settings
from job_scout.graph.prompts.rank_jobs import RANK_JOBS_PROMPT, RANK_JOBS_PROMPT_NAME
from job_scout.graph.prompts.reformulate import REFORMULATE_PROMPT, REFORMULATE_PROMPT_NAME
from job_scout.graph.prompts.tailor import TAILOR_PROMPT, TAILOR_PROMPT_NAME
from job_scout.profile import EXTRACT_PROFILE_PROMPT, EXTRACT_PROFILE_PROMPT_NAME

_CONFIGURED = False


@lru_cache(maxsize=1)
def git_sha() -> str:
    """Short git sha for trace metadata (``unknown`` outside a checkout)."""
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],  # noqa: S607 - git resolved from PATH is intended
            capture_output=True,
            text=True,
            cwd=Path(__file__).resolve().parent,
            timeout=5,
        )
        return out.stdout.strip() or "unknown"
    except Exception:  # noqa: BLE001
        return "unknown"


def configure_opik() -> bool:
    """Configure the Opik SDK once. Returns True if tracing is active."""
    global _CONFIGURED
    settings = get_settings()
    if not settings.has_opik:
        return False
    if _CONFIGURED:
        return True
    import opik

    opik.configure(
        api_key=settings.opik_api_key.get_secret_value(),
        workspace=settings.opik_workspace or None,
        project_name=settings.opik_project_name,
        use_local=False,
        force=True,
    )
    _CONFIGURED = True
    return True


def get_tracer(thread_id: str, tags: list[str], metadata: dict[str, Any] | None = None):
    """Return an OpikTracer for this run, or ``None`` when tracing is disabled."""
    if not configure_opik():
        return None
    from opik.integrations.langchain import OpikTracer

    settings = get_settings()
    meta = {"git_sha": git_sha(), "model": settings.scout_model, **(metadata or {})}
    return OpikTracer(
        tags=tags,
        metadata=meta,
        thread_id=thread_id,
        project_name=settings.opik_project_name,
    )


def traced_call[T](name: str, fn: Callable[[], T], metadata: dict[str, Any] | None = None) -> Callable[[], T]:
    """Give ``fn`` its own span, named, or hand it back untouched.

    A trace that shows only the total search time cannot answer "which source
    was slow" — which is the first question anybody (Ollie included) asks of a
    waterfall. One span per source turns that guess into a reading.

    Untouched when tracing is off, deliberately: ``opik.track`` still tries to
    ship spans without an API key and answers 401 into the reader's terminal.
    Wrapping only when configured keeps the keyless path silent, which is the
    same promise the rest of this module makes.
    """
    if not configure_opik():
        return fn
    import opik

    return opik.track(name=name, type="tool", metadata=metadata, capture_input=False)(fn)


def trace_graph(compiled_graph, tracer):
    """Prepare a per-run tracer for a compiled graph. No-op if disabled.

    Phase 1 used ``track_langgraph``, which injects the tracer into the compiled
    graph's default config *in place* — and refuses to replace one that is
    already there. With Phase 2's shared process-lifetime graph (see
    ``get_compiled_graph``) that would pin the FIRST run's tracer, giving every
    later run the wrong thread_id and tags. So instead we only copy the graph
    structure onto the per-run tracer (this powers "Show Agent Graph" in the
    trace sidebar) and the runner passes the tracer via ``config["callbacks"]``.

    Returns the graph unchanged.
    """
    if tracer is None:
        return compiled_graph
    # The viz is a nice-to-have, never fatal.
    with contextlib.suppress(Exception):
        tracer.set_graph(compiled_graph.get_graph(xray=True))
    return compiled_graph


def attach_cv(tracer, pdf_path: str | Path) -> None:
    """Attach the uploaded CV PDF to the run's trace (best effort, post-run)."""
    if tracer is None:
        return
    try:
        import opik

        traces = tracer.created_traces()
        if not traces:
            return
        trace_id = getattr(traces[-1], "id", None)
        if not trace_id:
            return
        settings = get_settings()
        opik.Opik().queue_attachment_upload(
            entity_type="trace",
            entity_id=trace_id,
            project_name=settings.opik_project_name,
            file_path=str(pdf_path),
            file_name=Path(pdf_path).name,
            mime_type="application/pdf",
        )
    except Exception:  # noqa: BLE001, S110 - attachment is a nice-to-have, never fatal
        pass


def opik_url() -> str:
    """Best-effort dashboard link for the run footer."""
    settings = get_settings()
    ws = settings.opik_workspace
    if ws:
        return f"https://www.comet.com/opik/{ws}/projects"
    return "https://www.comet.com/opik/"


_PROMPTS = [
    (EXTRACT_PROFILE_PROMPT_NAME, EXTRACT_PROFILE_PROMPT),
    (RANK_JOBS_PROMPT_NAME, RANK_JOBS_PROMPT),
    (REFORMULATE_PROMPT_NAME, REFORMULATE_PROMPT),
    (TAILOR_PROMPT_NAME, TAILOR_PROMPT),
]


def register_prompts() -> int:
    """Register/version the prompt constants in the Opik prompt library.

    Idempotent: creating a prompt whose content is unchanged is a no-op; changed
    content creates a new version. Returns the count registered (0 if disabled).
    """
    if not configure_opik():
        return 0
    import opik

    client = opik.Opik()
    project = get_settings().opik_project_name
    count = 0
    for name, text in _PROMPTS:
        try:
            # project_name scopes the prompt to the project so it shows in the
            # project's Prompt library view; without it prompts are workspace-
            # level (project_id=None) and the project-scoped UI hides them.
            client.create_prompt(name=name, prompt=text, project_name=project)
            count += 1
        except Exception:  # noqa: BLE001, S110 - never block a run on prompt sync
            pass
    return count
