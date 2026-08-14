"""Bridge between the Gradio wizard and the Jobvis voice session.

The wizard owns the session (thread_id, profile, CV text); the voice tools need
to read it and to launch runs on the SAME LangGraph thread. This module is their
single meeting point: a process-wide registry the wizard handlers update, plus a
run manager that executes voice-triggered search/tailor runs on a background
thread so an ElevenLabs tool call can return immediately while the graph works.

Two invariants worth naming:
- the profile is NOT in the checkpoint until a search has run (extraction happens
  before the graph), so it must live here, not be read back from the thread;
- one voice run at a time — the wizard stays the only other writer, and a second
  trigger is refused with a speakable note instead of racing the first.
"""

from __future__ import annotations

import queue
import threading
from dataclasses import dataclass, replace
from typing import cast

from job_scout.graph import get_compiled_graph
from job_scout.graph.schemas import Profile, RankedJob
from job_scout.runner import RunResult, TailorResult, stream_search, stream_tailor

VOICE_TAGS = ["phase-2", "voice"]


def checkpoint_values(thread_id: str) -> dict:
    """The current values of a thread's checkpoint (empty when absent)."""
    if not thread_id:
        return {}
    snapshot = get_compiled_graph().get_state({"configurable": {"thread_id": thread_id}})
    return dict(snapshot.values) if snapshot and snapshot.values else {}


def ranked_jobs(thread_id: str) -> list[RankedJob]:
    """The fit-sorted ranked jobs currently in the thread's checkpoint."""
    return list(checkpoint_values(thread_id).get("ranked_jobs") or [])


@dataclass(frozen=True)
class WizardSnapshot:
    """What the voice layer may know about the wizard, without touching Gradio."""

    thread_id: str = ""
    step: str = "start"  # start | profile | results | tailor
    profile: Profile | None = None
    cv_text: str = ""
    linkedin_zip_path: str | None = None


@dataclass
class VoiceRun:
    """One voice-triggered background run and its observable progress."""

    kind: str  # "search" | "tailor"
    status: str = "starting…"
    done: bool = False
    failed: bool = False
    error: str = ""
    search_result: RunResult | None = None
    tailor_result: TailorResult | None = None
    ui_pushed: bool = False


@dataclass(frozen=True)
class BridgeEvent:
    """Something a listening console should hear about.

    Two kinds, because ElevenLabs treats them differently and so should we:
    ``run_finished`` is news the agent should SAY (the console replays it as a
    user message), while ``screen`` is something that merely happened in the
    wizard — context the agent should know but not react to out loud.
    """

    kind: str  # "run_finished" | "screen"
    run: VoiceRun | None = None
    text: str = ""


class VoiceBridge:
    """Thread-safe registry of the active wizard session + voice-run manager."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._snapshot = WizardSnapshot()
        self._run: VoiceRun | None = None
        self._subscribers: list[queue.SimpleQueue[BridgeEvent]] = []

    def register_thread(self, thread_id: str) -> None:
        """A fresh wizard session: forget everything from the previous one."""
        with self._lock:
            self._snapshot = WizardSnapshot(thread_id=thread_id)
            self._run = None

    def record_profile(self, profile: Profile, cv_text: str, thread_id: str) -> None:
        with self._lock:
            self._snapshot = replace(self._snapshot, thread_id=thread_id, step="profile", profile=profile, cv_text=cv_text)

    def record_step(self, step: str) -> None:
        with self._lock:
            self._snapshot = replace(self._snapshot, step=step)

    def record_linkedin_zip(self, path: str | None) -> None:
        with self._lock:
            self._snapshot = replace(self._snapshot, linkedin_zip_path=path)

    def snapshot(self) -> WizardSnapshot:
        with self._lock:
            return self._snapshot

    def run_in_progress(self) -> bool:
        with self._lock:
            return self._run is not None and not self._run.done

    def start_search(self) -> str | None:
        """Kick a background search; returns a speakable refusal, or None on start."""
        snap = self.snapshot()
        if snap.profile is None or not snap.cv_text:
            return "No profile yet — the user needs to drop their CV (a PDF) into the app first."
        return self._launch("search", lambda run: self._drive_search(snap, run))

    def start_tailoring(self, selected_job_id: str) -> str | None:
        """Kick background tailoring for a job id; returns a refusal, or None on start."""
        snap = self.snapshot()
        if not snap.thread_id:
            return "No session yet — the user needs to open the app first."
        return self._launch("tailor", lambda run: self._drive_tailor(snap, run, selected_job_id))

    def run_status(self) -> dict:
        with self._lock:
            run = self._run
            if run is None:
                return {"running": False, "note": "Nothing is running right now."}
            return {
                "running": not run.done,
                "kind": run.kind,
                "latest_status": run.status,
                "done": run.done,
                "failed": run.failed,
                "error": run.error,
            }

    def pop_finished_run(self) -> VoiceRun | None:
        """Hand a finished run to the UI exactly once (the Timer's 'pop')."""
        with self._lock:
            run = self._run
            if run is None or not run.done or run.ui_pushed:
                return None
            run.ui_pushed = True
            return run

    def subscribe(self) -> queue.SimpleQueue[BridgeEvent]:
        """A private event feed, for consumers that must not race each other.

        `pop_finished_run` hands a run to whoever asks FIRST — fine when the
        Gradio wizard was the only listener, wrong now that the browser console
        listens too: one surface would render the run and the other would never
        hear about it. Each subscriber gets its own queue instead, so an event
        reaches every listener exactly once. The wizard keeps popping.
        """
        with self._lock:
            feed: queue.SimpleQueue[BridgeEvent] = queue.SimpleQueue()
            self._subscribers.append(feed)
            return feed

    def unsubscribe(self, feed: queue.SimpleQueue[BridgeEvent]) -> None:
        """Drop a feed when its consumer goes away (a closed SSE connection)."""
        with self._lock:
            if feed in self._subscribers:
                self._subscribers.remove(feed)

    def note_screen_event(self, text: str) -> None:
        """Tell listening consoles what just happened in the wizard.

        The click path and the voice path drive the same session, so a person
        who uploads a CV on screen while talking to Jobvis should not have to
        narrate it. Silent context, never speech.
        """
        self._publish(BridgeEvent("screen", text=text))

    def _publish(self, event: BridgeEvent) -> None:
        with self._lock:
            for feed in self._subscribers:
                feed.put(event)

    def _launch(self, kind: str, drive) -> str | None:
        with self._lock:
            if self._run is not None and not self._run.done:
                return f"I'm still busy with the current {self._run.kind} — ask me how it's going instead."
            run = VoiceRun(kind=kind)
            self._run = run
        threading.Thread(target=drive, args=(run,), daemon=True, name=f"jobvis-{kind}").start()
        return None

    def _set_status(self, run: VoiceRun, status: str) -> None:
        with self._lock:
            run.status = status

    def _finish(self, run: VoiceRun, *, failed: bool, error: str, step: str) -> None:
        with self._lock:
            run.failed = failed
            run.error = error
            run.status = "failed" if failed else "done"
            run.done = True
            if not failed:
                self._snapshot = replace(self._snapshot, step=step)
        # Callers set search_result/tailor_result before finishing, so what
        # subscribers receive here is always a complete run.
        self._publish(BridgeEvent("run_finished", run=run))

    def _drive_search(self, snap: WizardSnapshot, run: VoiceRun) -> None:
        assert snap.profile is not None  # guarded by start_search
        result = RunResult()
        try:
            stream = stream_search(
                snap.profile, cv_text=snap.cv_text, thread_id=snap.thread_id, tags=VOICE_TAGS, selected_job_id=None
            )
            for kind, payload in stream:
                if kind == "status":
                    self._set_status(run, str(payload))
                elif kind == "result":
                    result = cast(RunResult, payload)
        except Exception as exc:  # noqa: BLE001 - a voice run must never take the app down
            result.failed, result.error_message = True, f"{type(exc).__name__}: {exc}"
        with self._lock:
            run.search_result = result
        self._finish(run, failed=result.failed, error=result.error_message, step="results")

    def _drive_tailor(self, snap: WizardSnapshot, run: VoiceRun, selected_job_id: str) -> None:
        result = TailorResult()
        try:
            stream = stream_tailor(
                thread_id=snap.thread_id,
                selected_job_id=selected_job_id,
                tags=[*VOICE_TAGS, "tailor"],
                linkedin_zip_path=snap.linkedin_zip_path,
            )
            for kind, payload in stream:
                if kind == "status":
                    self._set_status(run, str(payload))
                elif kind == "result":
                    result = cast(TailorResult, payload)
        except Exception as exc:  # noqa: BLE001 - a voice run must never take the app down
            result.failed, result.error_message = True, f"{type(exc).__name__}: {exc}"
        with self._lock:
            run.tailor_result = result
        self._finish(run, failed=result.failed, error=result.error_message, step="tailor")


_BRIDGE = VoiceBridge()


def get_bridge() -> VoiceBridge:
    """The process-wide bridge instance."""
    return _BRIDGE
