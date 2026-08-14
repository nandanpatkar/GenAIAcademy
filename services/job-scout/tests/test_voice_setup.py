"""Tests for the Jobvis agent provisioning payload (scripts/setup_jobvis_agent.py)."""

from __future__ import annotations

import importlib.util
from pathlib import Path

from job_scout.voice.persona import FIRST_MESSAGE, JOBVIS_SYSTEM_PROMPT, TOOL_SPECS
from job_scout.voice.tools import CLIENT_TOOL_HANDLERS

_SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "setup_jobvis_agent.py"
_spec = importlib.util.spec_from_file_location("setup_jobvis_agent", _SCRIPT)
setup_script = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(setup_script)


def test_agent_payload_carries_persona_and_all_tools():
    payload = setup_script.build_agent_payload(voice_id=None)
    assert payload["name"] == "Jobvis"
    agent = payload["conversation_config"]["agent"]
    assert agent["first_message"] == FIRST_MESSAGE
    assert "{{part_of_day}}" in agent["first_message"]  # dynamic-variable greeting template
    assert agent["prompt"]["prompt"] == JOBVIS_SYSTEM_PROMPT
    tools = agent["prompt"]["tools"]
    assert sorted(t["name"] for t in tools) == sorted(CLIENT_TOOL_HANDLERS)
    assert all(t["type"] == "client" for t in tools)
    assert all(t["expects_response"] is True for t in tools)  # wait-for-response: results must reach the agent


def test_agent_payload_latency_tuning():
    config = setup_script.build_agent_payload(voice_id=None)["conversation_config"]
    assert config["tts"] == {"model_id": "eleven_flash_v2"}  # English agents must use turbo/flash v2
    assert config["agent"]["prompt"]["llm"] == "gemini-2.5-flash"
    assert config["turn"]["turn_eagerness"] == "eager"
    assert config["turn"]["soft_timeout_config"]["message"] == "One moment."
    assert "Jobvis" in config["asr"]["keywords"]
    assert "optimize_streaming_latency" not in config["tts"]  # deprecated no-op — never send it


def test_agent_payload_sets_voice_when_given():
    payload = setup_script.build_agent_payload(voice_id="v123")
    assert payload["conversation_config"]["tts"] == {"model_id": "eleven_flash_v2", "voice_id": "v123"}


def test_tool_payload_parameter_schema():
    spec = next(s for s in TOOL_SPECS if s["name"] == "get_top_jobs")
    tool = setup_script.build_tool_payload(spec)
    params = tool["parameters"]
    assert params["type"] == "object"
    assert params["properties"]["count"]["type"] == "integer"
    assert params["required"] == []

    spec = next(s for s in TOOL_SPECS if s["name"] == "start_tailoring")
    tool = setup_script.build_tool_payload(spec)
    assert tool["parameters"]["required"] == ["job_ref"]


def test_parameterless_tools_omit_schema():
    spec = next(s for s in TOOL_SPECS if s["name"] == "start_search")
    assert "parameters" not in setup_script.build_tool_payload(spec)
