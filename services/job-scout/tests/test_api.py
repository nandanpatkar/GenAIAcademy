"""The console's API: tokens minted server-side, tools dispatched, state read.

Everything here runs against a fresh in-process bridge and a faked checkpoint —
no graph, no network, no ElevenLabs.
"""

from __future__ import annotations

import asyncio
import json
import re
from pathlib import Path

import httpx
import pytest
from fastapi.testclient import TestClient

import job_scout.api as api_module
import job_scout.voice.bridge as bridge_module
import job_scout.voice.persona as persona
from job_scout.graph.schemas import CVContent, RankedJob, TailoringPack
from job_scout.runner import RunResult
from job_scout.voice.bridge import VoiceBridge
from job_scout.voice.tools import CLIENT_TOOL_HANDLERS
from tests.conftest import make_job


@pytest.fixture
def bridge(monkeypatch) -> VoiceBridge:
    fresh = VoiceBridge()
    monkeypatch.setattr(bridge_module, "_BRIDGE", fresh)
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {})
    return fresh


@pytest.fixture
def client(bridge) -> TestClient:
    return TestClient(api_module.create_app())


def voice_on(monkeypatch, agent_id: str = "agent-123", key: str = "xi-test-key") -> None:
    """Pretend Jobvis is configured, without touching the developer's real .env."""

    class _Key:
        def get_secret_value(self) -> str:
            return key

    class _Settings:
        elevenlabs_agent_id = agent_id
        elevenlabs_api_key = _Key()

    monkeypatch.setattr(api_module, "is_voice_available", lambda: (True, ""))
    monkeypatch.setattr(api_module, "get_settings", lambda: _Settings())


def test_config_reports_voice_off_with_a_hint(client):
    body = client.get("/api/config").json()
    assert body["voice_ok"] is False
    assert "ELEVENLABS_API_KEY" in body["voice_hint"]
    assert body["has_candidate"] is False


def test_token_refused_when_voice_is_not_configured(client):
    response = client.post("/api/voice/token")
    assert response.status_code == 503
    assert "ELEVENLABS_API_KEY" in response.json()["detail"]


def test_token_is_minted_server_side(client, monkeypatch, respx_mock):
    """The browser gets a short-lived token; the API key never leaves the server."""
    voice_on(monkeypatch)
    route = respx_mock.get(api_module.TOKEN_URL).mock(return_value=httpx.Response(200, json={"token": "conv-token-abc"}))

    body = client.post("/api/voice/token").json()

    assert body["token"] == "conv-token-abc"
    sent = route.calls.last.request
    assert sent.headers["xi-api-key"] == "xi-test-key"
    assert sent.url.params["agent_id"] == "agent-123"


def test_token_carries_the_greeting_variables(client, bridge, monkeypatch, respx_mock, sample_profile):
    """FIRST_MESSAGE is a template. Unfilled, Jobvis says "{{part_of_day}}" out loud."""
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    voice_on(monkeypatch)
    respx_mock.get(api_module.TOKEN_URL).mock(return_value=httpx.Response(200, json={"token": "conv-token-abc"}))

    body = client.post("/api/voice/token").json()

    variables = body["dynamic_variables"]
    assert variables["user_name_suffix"] == ", Test"  # first name only, from the stored profile
    assert variables["part_of_day"] in {"morning", "afternoon", "evening"}
    for placeholder in re.findall(r"\{\{(\w+)\}\}", persona.FIRST_MESSAGE):
        assert placeholder in variables, f"greeting placeholder {placeholder} has nothing to fill it"


def test_token_seeds_the_session_so_a_cold_visit_still_knows_your_name(client, monkeypatch, respx_mock, sample_profile):
    """Engaging before anything else loaded must not cost you the personal greeting."""
    import job_scout.candidate_store as candidate_store

    candidate_store.save_candidate(sample_profile, "cv text", None)
    voice_on(monkeypatch)
    respx_mock.get(api_module.TOKEN_URL).mock(return_value=httpx.Response(200, json={"token": "t"}))

    body = client.post("/api/voice/token").json()
    assert body["dynamic_variables"]["user_name_suffix"] == ", Test"


def test_greeting_variables_cover_the_day_and_a_missing_name():
    assert persona.greeting_variables("Shirin Khosravi Jam", 9) == {"part_of_day": "morning", "user_name_suffix": ", Shirin"}
    assert persona.greeting_variables(None, 14)["part_of_day"] == "afternoon"
    assert persona.greeting_variables("", 21) == {"part_of_day": "evening", "user_name_suffix": ""}


def test_the_console_registers_exactly_the_tools_the_agent_declares():
    """persona → Python handlers → TypeScript. Three lists, hand-kept, one truth.

    The TS names are hardcoded (the console cannot import Python), so drift here
    means the agent calls a tool nothing answers — silently, mid-demo.
    """
    web_tools = Path(__file__).resolve().parent.parent / "web" / "lib" / "tools.ts"
    declared = re.search(r"TOOL_NAMES = \[(.*?)\]", web_tools.read_text(), re.S)
    assert declared is not None, "TOOL_NAMES not found in web/lib/tools.ts"
    typescript = sorted(re.findall(r'"(\w+)"', declared.group(1)))

    assert sorted(spec["name"] for spec in persona.TOOL_SPECS) == typescript
    assert sorted(CLIENT_TOOL_HANDLERS) == typescript


def test_last_error_relays_the_quota_reason(client, monkeypatch, respx_mock):
    """The SDK says "Unknown error" for everything; ElevenLabs knows better."""
    voice_on(monkeypatch)
    respx_mock.get("https://api.elevenlabs.io/v1/convai/conversations").mock(
        return_value=httpx.Response(200, json={"conversations": [{"conversation_id": "conv_1", "status": "failed"}]})
    )
    respx_mock.get("https://api.elevenlabs.io/v1/convai/conversations/conv_1").mock(
        return_value=httpx.Response(200, json={"metadata": {"termination_reason": "This request exceeds your quota limit."}})
    )

    body = client.get("/api/voice/last-error").json()
    assert body["quota"] is True
    assert "quota" in body["reason"]


def test_last_error_is_quiet_when_the_last_call_was_fine(client, monkeypatch, respx_mock):
    voice_on(monkeypatch)
    respx_mock.get("https://api.elevenlabs.io/v1/convai/conversations").mock(
        return_value=httpx.Response(200, json={"conversations": [{"conversation_id": "conv_1", "status": "done"}]})
    )
    assert client.get("/api/voice/last-error").json() == {"reason": "", "quota": False}


def test_last_error_never_raises_when_elevenlabs_is_unreachable(client, monkeypatch, respx_mock):
    """A diagnostic that fails must not become a second fault on screen."""
    voice_on(monkeypatch)
    respx_mock.get("https://api.elevenlabs.io/v1/convai/conversations").mock(side_effect=httpx.ConnectError("down"))
    assert client.get("/api/voice/last-error").json() == {"reason": "", "quota": False}


def test_token_upstream_failure_is_reported_not_swallowed(client, monkeypatch, respx_mock):
    voice_on(monkeypatch)
    respx_mock.get(api_module.TOKEN_URL).mock(return_value=httpx.Response(401, text="missing convai scope"))
    response = client.post("/api/voice/token")
    assert response.status_code == 502
    assert "401" in response.json()["detail"] and "convai scope" in response.json()["detail"]


def test_token_network_error_is_reported(client, monkeypatch, respx_mock):
    voice_on(monkeypatch)
    respx_mock.get(api_module.TOKEN_URL).mock(side_effect=httpx.ConnectError("no route"))
    response = client.post("/api/voice/token")
    assert response.status_code == 502
    assert "unreachable" in response.json()["detail"]


def test_missing_token_field_is_an_error(client, monkeypatch, respx_mock):
    voice_on(monkeypatch)
    respx_mock.get(api_module.TOKEN_URL).mock(return_value=httpx.Response(200, json={}))
    assert client.post("/api/voice/token").status_code == 502


def test_tool_dispatch_runs_the_python_handler(client):
    body = client.post("/api/tools/get_session_status", json={}).json()
    assert body["has_profile"] is False
    assert "CV" in body["note"]  # the grounded refusal, unchanged by the HTTP hop


def test_tool_parameters_reach_the_handler(client, bridge, monkeypatch, sample_profile):
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    jobs = [
        RankedJob(job=make_job("j1", "Data Scientist", "Acme"), fit_score=91, fit_explanation="fits"),
        RankedJob(job=make_job("j2", "ML Engineer", "Globex"), fit_score=84, fit_explanation="fits too"),
    ]
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {"ranked_jobs": jobs})

    body = client.post("/api/tools/get_top_jobs", json={"count": 1}).json()
    assert len(body["jobs"]) == 1 and body["jobs"][0]["title"] == "Data Scientist"


def test_unknown_tool_is_a_404_not_a_silent_empty_dict(client):
    response = client.post("/api/tools/delete_everything", json={})
    assert response.status_code == 404
    assert "delete_everything" in response.json()["detail"]


def test_state_is_empty_before_a_candidate_exists(client):
    body = client.get("/api/state").json()
    assert body["candidate"] is None and body["jobs"] == [] and body["pack"] is None
    assert body["run"]["running"] is False


def test_state_carries_candidate_jobs_and_pack(client, bridge, monkeypatch, sample_profile):
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    pack = TailoringPack(cv=CVContent(headline="DS", summary="s"), cover_letter="Dear team,", honesty_note="Gap: SQL.")
    values = {
        "ranked_jobs": [RankedJob(job=make_job("j1", "Data Scientist", "Acme"), fit_score=91, fit_explanation="fits")],
        "tailoring": pack,
        "fabrication_flags": 2,
    }
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: values)

    body = client.get("/api/state").json()

    assert body["candidate"]["name"] == "Test Candidate" and body["candidate"]["role"] == "Data Scientist"
    assert body["jobs"][0] == {
        "rank": 1,
        "job_id": "j1",
        "title": "Data Scientist",
        "company": "Acme",
        "location": "Berlin",
        "url": "https://example.com",
        "fit_score": 91,
        "why": "fits",
    }
    assert body["pack"]["headline"] == "DS" and body["pack"]["flags"] == 2
    assert "2 statements could not be verified" in body["pack"]["verdict"]


def test_state_claims_a_thread_and_seeds_the_stored_candidate(client, bridge, sample_profile):
    """A cold console visit restores the saved candidate, like the wizard does."""
    import job_scout.candidate_store as candidate_store

    candidate_store.save_candidate(sample_profile, "cv text", {"locations": ["Munich"], "remote": False})

    body = client.get("/api/state").json()

    assert body["thread_id"]  # a session was claimed
    assert body["candidate"]["name"] == "Test Candidate"
    # the SEARCH sees the chosen location, not the extracted one
    assert bridge.snapshot().profile.locations == ["Munich"]


def test_console_sees_a_search_the_wizard_ran(client, bridge, monkeypatch, sample_profile):
    """Two surfaces, ONE session — the whole premise, pinned.

    The wizard's click path never touches the bridge's run manager, so it is
    easy for the console to sit on "say find me jobs" while the wizard is
    already showing results. It reads the same checkpoint or it is lying.
    """
    import job_scout.app as app_module

    bridge.register_thread("t1")
    jobs = [RankedJob(job=make_job("j1", "Data Scientist", "Acme"), fit_score=91, fit_explanation="fits")]
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {"ranked_jobs": jobs})
    bridge.record_profile(sample_profile, "cv text", "t1")
    bridge.record_step("results")
    app_module._voice_context("Screen event: an on-screen job search just finished.")

    body = client.get("/api/state").json()
    assert body["thread_id"] == "t1"  # the wizard's thread, not one of our own
    assert body["step"] == "results"
    assert body["jobs"][0]["title"] == "Data Scientist"


def test_event_stream_repaints_after_a_click_path_run(bridge, monkeypatch, sample_profile):
    """A screen event forces a state frame; run status alone would never change."""
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")

    async def go() -> list[str]:
        gen = api_module.event_stream(_never_disconnected, poll=0.01)
        frames = [await gen.__anext__()]  # the initial state frame
        bridge.note_screen_event("Screen event: an on-screen job search just finished.")
        for _ in range(400):
            frames.append(await gen.__anext__())
            if frames[-1].startswith("event: state") and len(frames) > 2:
                break
        await gen.aclose()
        return frames

    frames = asyncio.run(go())
    assert any(f.startswith("event: context") for f in frames)
    assert sum(f.startswith("event: state") for f in frames) >= 2  # repainted, not just announced


def test_pack_downloads_404_before_tailoring(client):
    assert client.get("/api/pack/pdf").status_code == 404
    assert client.get("/api/pack/tex").status_code == 404


async def _never_disconnected() -> bool:
    return False


def test_event_stream_pushes_state_then_the_finished_run(bridge, monkeypatch, sample_profile):
    """The SSE stream is how a finished background run reaches the agent's mouth."""
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    result = RunResult(ranked_jobs=[RankedJob(job=make_job("j1", "ML Engineer", "Acme"), fit_score=87, fit_explanation="f")])
    monkeypatch.setattr(bridge_module, "stream_search", lambda p, **kw: iter([("result", result)]))

    async def go() -> list[str]:
        gen = api_module.event_stream(_never_disconnected, poll=0.01)
        frames = [await gen.__anext__()]  # first frame: state, and the subscription now exists
        assert bridge.start_search() is None
        for _ in range(400):
            frames.append(await gen.__anext__())
            if "run_finished" in frames[-1]:
                break
        await gen.aclose()
        return frames

    frames = asyncio.run(go())

    assert frames[0].startswith("event: state")
    finished = [f for f in frames if f.startswith("event: run_finished")]
    assert len(finished) == 1
    payload = json.loads(finished[0].split("data: ", 1)[1])
    assert payload["kind"] == "search"
    assert "ML Engineer at Acme, 87 out of 100" in payload["text"]


def test_event_stream_state_frame_carries_the_panels(bridge, monkeypatch, sample_profile):
    bridge.register_thread("t1")
    bridge.record_profile(sample_profile, "cv text", "t1")
    jobs = [RankedJob(job=make_job("j1", "Data Scientist", "Acme"), fit_score=91, fit_explanation="fits")]
    monkeypatch.setattr(bridge_module, "checkpoint_values", lambda thread_id: {"ranked_jobs": jobs})

    async def go() -> str:
        gen = api_module.event_stream(_never_disconnected, poll=0.01)
        frame = await gen.__anext__()
        await gen.aclose()
        return frame

    payload = json.loads(asyncio.run(go()).split("data: ", 1)[1])
    assert payload["candidate"]["name"] == "Test Candidate"
    assert payload["jobs"][0]["title"] == "Data Scientist"


def test_event_stream_stops_when_the_console_disconnects(bridge):
    """A closed tab must not leave a queue behind that fills forever."""

    async def go() -> list[str]:
        gone = {"yet": False}

        async def disconnected() -> bool:
            was, gone["yet"] = gone["yet"], True
            return was  # alive for one pass, then hung up

        return [f async for f in api_module.event_stream(disconnected, poll=0.01)]

    frames = asyncio.run(go())
    assert len(frames) == 1 and frames[0].startswith("event: state")
    assert bridge._subscribers == []  # the finally released it


def test_event_stream_heartbeats_through_a_quiet_connection(bridge):
    """Nothing happening for ~15s still writes to the socket, or proxies reap it."""

    async def go() -> list[str]:
        gen = api_module.event_stream(_never_disconnected, poll=0.0)
        frames = [await gen.__anext__() for _ in range(2)]
        await gen.aclose()
        return frames

    frames = asyncio.run(go())
    assert frames[0].startswith("event: state")
    assert frames[1] == ": heartbeat\n\n"


def test_api_runs_without_a_built_console(client, monkeypatch, tmp_path):
    """No web/out yet is a working API, not a crash — readers hit this first."""
    monkeypatch.setattr(api_module, "web_dir", lambda: tmp_path / "nope")
    app = api_module.create_app()
    assert TestClient(app).get("/api/config").status_code == 200


def test_built_console_is_served_at_the_root(monkeypatch, tmp_path):
    out = tmp_path / "out"
    out.mkdir()
    (out / "index.html").write_text("<h1>Jobvis</h1>", encoding="utf-8")
    monkeypatch.setattr(api_module, "web_dir", lambda: out)

    with TestClient(api_module.create_app()) as client:
        assert "Jobvis" in client.get("/").text
