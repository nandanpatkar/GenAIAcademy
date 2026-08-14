"""The browser console's server side: tokens, tools, state, events, downloads.

Jobvis moved into the browser. The conversation itself now runs there over
WebRTC — which is what buys real barge-in and the browser's own echo
cancellation — but nothing the agent may *know* moved with it. The client tools
it calls are still the Python functions in ``voice.tools``, reading the same
LangGraph checkpoint the wizard reads; the browser only forwards the call. That
split is the point: a new modality, the same grounding contract.

The ElevenLabs key never leaves this process. The browser asks for a
short-lived conversation token, and that is the only credential it ever holds.

Routes, all under ``/api``: ``config`` (what the console may assume),
``voice/token``, ``tools/{name}``, ``state``, ``events`` (SSE), and the two
pack downloads. Everything else is the built console, served from ``web/out``.
"""

from __future__ import annotations

import asyncio
import json
import os
import queue
import tempfile
from collections.abc import AsyncIterator, Awaitable, Callable
from datetime import datetime
from pathlib import Path
from typing import Annotated, Any
from uuid import uuid4

import httpx
from fastapi import Body, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from job_scout import candidate_store
from job_scout.config import get_settings
from job_scout.graph.schemas import Profile, RankedJob, TailoringPack
from job_scout.renderer import render_pdf
from job_scout.voice import bridge as voice_bridge
from job_scout.voice import is_voice_available
from job_scout.voice.announce import run_announcement
from job_scout.voice.persona import greeting_variables
from job_scout.voice.tools import CLIENT_TOOL_HANDLERS

TOKEN_URL = "https://api.elevenlabs.io/v1/convai/conversation/token"  # noqa: S105 - an endpoint, not a credential

# The console is a static export, built into web/out. JOBVIS_WEB_DIR overrides
# it (a different build output, or a checkout that is not the repo root).
_REPO_ROOT = Path(__file__).resolve().parents[2]


def web_dir() -> Path:
    return Path(os.environ.get("JOBVIS_WEB_DIR") or _REPO_ROOT / "web" / "out")


def ensure_session() -> None:
    """Claim a thread for this console and seed the saved candidate into it.

    The bridge is process-wide, so when the wizard already registered a thread
    this is a no-op and the console simply views the same session.
    """
    bridge = voice_bridge.get_bridge()
    if bridge.snapshot().thread_id:
        return
    thread_id = str(uuid4())
    bridge.register_thread(thread_id)
    stored = candidate_store.load_candidate()
    if stored is not None:
        profile = candidate_store.effective_profile(stored.profile, stored.preferences)
        bridge.record_profile(profile, stored.cv_text, thread_id)


def _job_row(ranked: RankedJob, rank: int) -> dict:
    return {
        "rank": rank,
        "job_id": ranked.job.job_id,
        "title": ranked.job.title,
        "company": ranked.job.company,
        "location": ranked.job.location,
        "url": ranked.job.url,
        "fit_score": ranked.fit_score,
        "why": ranked.fit_explanation,
    }


def _verdict(flags: int) -> str:
    if flags == 0:
        return "Every claim checked against the CV — no flags."
    plural = "s" if flags != 1 else ""
    return f"{flags} statement{plural} could not be verified — review before sending."


def _pack_payload(values: dict) -> dict | None:
    pack: TailoringPack | None = values.get("tailoring")
    if pack is None:
        return None
    flags = int(values.get("fabrication_flags") or 0)
    return {
        "headline": pack.cv.headline,
        "summary": pack.cv.summary,
        "cover_letter": pack.cover_letter,
        "honesty_note": pack.honesty_note,
        "flags": flags,
        "verdict": _verdict(flags),
    }


def _candidate_payload(profile: Profile | None) -> dict | None:
    if profile is None:
        return None
    return {
        "name": profile.name or "",
        "role": (profile.primary_roles or [""])[0],
        "seniority": profile.seniority,
        "locations": list(profile.locations),
        "remote_ok": profile.remote_ok,
    }


def current_state() -> dict:
    """Everything the console paints, read straight from the bridge + checkpoint."""
    ensure_session()
    bridge = voice_bridge.get_bridge()
    snap = bridge.snapshot()
    values = voice_bridge.checkpoint_values(snap.thread_id)
    ranked = list(values.get("ranked_jobs") or [])
    return {
        "step": snap.step,
        "thread_id": snap.thread_id,
        "candidate": _candidate_payload(snap.profile),
        "jobs": [_job_row(r, i) for i, r in enumerate(ranked[:5], 1)],
        "pack": _pack_payload(values),
        "run": bridge.run_status(),
    }


# One render per pack, keyed by cover letter, so repeated download clicks (and
# the tex/pdf pair) do not recompile the same LaTeX twice.
_RENDER_CACHE: dict = {"key": None, "pdf": None, "tex": None}


def _render_paths() -> tuple[Path | None, Path | None]:
    ensure_session()
    bridge = voice_bridge.get_bridge()
    snap = bridge.snapshot()
    values = voice_bridge.checkpoint_values(snap.thread_id)
    pack: TailoringPack | None = values.get("tailoring")
    if pack is None:
        return None, None
    key = hash(pack.cover_letter)
    if _RENDER_CACHE["key"] != key:
        name = (snap.profile.name if snap.profile else None) or "Candidate"
        result = render_pdf(pack.cv, name, Path(tempfile.mkdtemp(prefix="job_scout_render_")))
        _RENDER_CACHE.update(key=key, pdf=result.pdf_path, tex=result.tex_path)
    return _RENDER_CACHE["pdf"], _RENDER_CACHE["tex"]


def _jsonable(value: Any, path: str = "") -> Any:
    """Coerce a payload to something json.dumps accepts, loudly.

    One unserializable leaf used to raise straight out of the SSE generator,
    which kills the connection — the console then sits there looking fine while
    every live update silently stops. A degraded frame beats a dead stream, so
    the offender becomes its repr and says where it was.
    """
    if isinstance(value, dict):
        return {k: _jsonable(v, f"{path}.{k}") for k, v in value.items()}
    if isinstance(value, list | tuple):
        return [_jsonable(v, f"{path}[{i}]") for i, v in enumerate(value)]
    if value is None or isinstance(value, str | int | float | bool):
        return value
    print(f"jobvis: {path or 'payload'} is not JSON-serializable ({type(value).__name__}); sending its repr")
    return repr(value)


def _sse(event: str, payload: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(_jsonable(payload, event))}\n\n"


async def event_stream(disconnected: Callable[[], Awaitable[bool]], poll: float = 0.25) -> AsyncIterator[str]:
    """Finished runs and run-status changes, as server-sent events.

    A voice-triggered search returns to the agent immediately and lands a
    minute later; this stream is how the agent finds out. The console replays
    `run_finished` as a user message, which is the only thing that makes Jobvis
    actually speak, and `context` as a contextual update, which is silent by
    design — the wizard's screen events should inform the agent, not interrupt
    it.

    Takes its disconnect check as an argument rather than reading the Request,
    so it can be driven directly in tests: TestClient buffers a whole response
    body before returning, and an SSE stream never has one.
    """
    bridge = voice_bridge.get_bridge()
    feed = bridge.subscribe()
    last_run: str | None = None
    idle = 0
    try:
        while not await disconnected():
            forced = False
            try:
                event = feed.get_nowait()
            except queue.Empty:
                pass
            else:
                if event.kind == "run_finished" and event.run is not None:
                    yield _sse("run_finished", {"kind": event.run.kind, "text": run_announcement(event.run)})
                elif event.kind == "screen":
                    yield _sse("context", {"text": event.text})
                # Any event means the checkpoint may have moved. Run status alone
                # is not enough to notice: a search started by CLICKING in the
                # wizard never touches the run manager, so without this the
                # console would sit on "say find me jobs" while the wizard is
                # already showing ranked results.
                forced = True
            snapshot = json.dumps(bridge.run_status(), sort_keys=True)
            if forced or snapshot != last_run:
                last_run = snapshot
                yield _sse("state", current_state())
                idle = 0
            idle += 1
            if idle >= 60:  # ~15s of quiet: keep proxies from reaping the connection
                idle = 0
                yield ": heartbeat\n\n"
            await asyncio.sleep(poll)
    finally:
        bridge.unsubscribe(feed)


def create_app() -> FastAPI:
    app = FastAPI(title="Jobvis", docs_url=None, redoc_url=None)

    # `npm run dev` serves the console from :3000 against this API. The built
    # console is same-origin, so this only ever matters in development.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/config")
    def config() -> dict:
        """What the console may assume before it renders anything."""
        voice_ok, hint = is_voice_available()
        return {
            "voice_ok": voice_ok,
            "voice_hint": hint,
            "wizard_url": "http://localhost:7860",
            "has_candidate": candidate_store.load_candidate() is not None,
        }

    @app.post("/api/voice/token")
    def voice_token() -> dict:
        """Mint a short-lived conversation token. The API key stays here."""
        voice_ok, hint = is_voice_available()
        if not voice_ok:
            raise HTTPException(status_code=503, detail=hint)
        settings = get_settings()
        try:
            response = httpx.get(
                TOKEN_URL,
                params={"agent_id": settings.elevenlabs_agent_id},
                headers={"xi-api-key": settings.elevenlabs_api_key.get_secret_value()},
                timeout=15,
            )
        except httpx.HTTPError as exc:
            raise HTTPException(status_code=502, detail=f"ElevenLabs unreachable: {exc}") from exc
        if response.status_code != 200:
            # 401 here almost always means the key lacks the Agents scopes.
            raise HTTPException(status_code=502, detail=f"token request failed ({response.status_code}): {response.text[:200]}")
        token = response.json().get("token")
        if not token:
            raise HTTPException(status_code=502, detail="ElevenLabs returned no token")
        # The greeting is a template (persona.FIRST_MESSAGE). Unfilled, the agent
        # opens the conversation by reading "{{part_of_day}}" out loud, so these
        # ride along with the token rather than being the console's to invent.
        # ensure_session() first: on a cold visit the stored candidate has not
        # been seeded yet, and "Good morning." is a sadder greeting than
        # "Good morning, Shirin."
        ensure_session()
        snap = voice_bridge.get_bridge().snapshot()
        name = snap.profile.name if snap.profile else None
        return {"token": token, "dynamic_variables": greeting_variables(name, datetime.now().hour)}

    @app.get("/api/voice/last-error")
    def voice_last_error() -> dict:
        """Why the last conversation died, in ElevenLabs' own words.

        The browser SDK reports a bare "Server error: Unknown error" for every
        failure, including the one readers will hit first — running out of free
        conversation minutes, which arrives as code 1002 with a perfectly clear
        reason attached. Asking after the fact is the only way to say something
        useful, so the console calls this when a session drops.
        """
        settings = get_settings()
        if not settings.elevenlabs_agent_id:
            return {"reason": "", "quota": False}
        headers = {"xi-api-key": settings.elevenlabs_api_key.get_secret_value()}
        try:
            listing = httpx.get(
                "https://api.elevenlabs.io/v1/convai/conversations",
                headers=headers,
                params={"agent_id": settings.elevenlabs_agent_id, "page_size": 1},
                timeout=10,
            )
            conversations = listing.json().get("conversations") or []
            if not conversations or conversations[0].get("status") != "failed":
                return {"reason": "", "quota": False}
            detail = httpx.get(
                f"https://api.elevenlabs.io/v1/convai/conversations/{conversations[0]['conversation_id']}",
                headers=headers,
                timeout=10,
            )
            reason = str(detail.json().get("metadata", {}).get("termination_reason") or "")
        except (httpx.HTTPError, ValueError, KeyError):
            return {"reason": "", "quota": False}
        return {"reason": reason, "quota": "quota" in reason.lower()}

    @app.post("/api/tools/{name}")
    def call_tool(name: str, parameters: Annotated[dict | None, Body()] = None) -> dict:
        """Run one client tool. Defined sync on purpose: FastAPI gives it a
        worker thread, and these handlers read the checkpoint synchronously."""
        handler = CLIENT_TOOL_HANDLERS.get(name)
        if handler is None:
            raise HTTPException(status_code=404, detail=f"unknown tool: {name}")
        ensure_session()
        return handler(parameters or {})

    @app.get("/api/state")
    def state() -> dict:
        # Same guard as the SSE frames: the console losing its state endpoint is
        # a worse failure than one field arriving as a repr.
        return _jsonable(current_state(), "state")

    @app.get("/api/events")
    async def events(request: Request) -> StreamingResponse:
        return StreamingResponse(event_stream(request.is_disconnected), media_type="text/event-stream")

    @app.get("/api/pack/pdf")
    def pack_pdf() -> FileResponse:
        pdf, _ = _render_paths()
        if pdf is None:
            raise HTTPException(status_code=404, detail="no tailored CV yet (tectonic missing? try the .tex)")
        return FileResponse(pdf, filename="tailored_cv.pdf", media_type="application/pdf")

    @app.get("/api/pack/tex")
    def pack_tex() -> FileResponse:
        _, tex = _render_paths()
        if tex is None:
            raise HTTPException(status_code=404, detail="no tailored CV yet")
        return FileResponse(tex, filename="tailored_cv.tex", media_type="application/x-tex")

    console = web_dir()
    if (console / "index.html").exists():
        app.mount("/", StaticFiles(directory=console, html=True), name="console")
    else:
        print(f"jobvis: no built console at {console} — API only. Build it with `make web-build`.")
    return app


CONSOLE_PORT = 8000


def serve_in_thread(port: int = CONSOLE_PORT) -> None:
    """Run the console's API on a daemon thread, for callers that own the main one.

    The wizard and the console MUST live in one process: the bridge and the
    LangGraph ``MemorySaver`` are both process-wide, so two processes would mean
    two sessions wearing the same name — the wizard would find jobs the console
    could not see. `job_scout.app` starts this before it launches Gradio.
    """
    import threading

    import uvicorn

    server = uvicorn.Server(uvicorn.Config(create_app(), host="127.0.0.1", port=port, log_level="warning"))
    threading.Thread(target=server.run, daemon=True, name="jobvis-api").start()


def main() -> None:
    """API only, on the main thread — for frontend work with `make web-dev`.

    Note that a console served this way sees an EMPTY session: the wizard is not
    running, so nothing has claimed a thread or extracted a profile. Use
    `make app` for the real thing.
    """
    import uvicorn

    uvicorn.run(create_app(), host="127.0.0.1", port=CONSOLE_PORT)


if __name__ == "__main__":
    main()
