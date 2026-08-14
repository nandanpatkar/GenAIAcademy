"""Create or update the Jobvis agent on ElevenLabs — agent config as code.

The persona, greeting, and client-tool schemas live in job_scout.voice.persona;
this script pushes them so the dashboard never holds hand-edited state. It is
idempotent: an existing agent named "Jobvis" (or ELEVENLABS_AGENT_ID when set)
is updated in place, otherwise one is created.

Endpoints used (ElevenLabs ConvAI API, 2026-07):
  GET   /v1/voices
  GET   /v1/convai/agents
  POST  /v1/convai/agents/create
  PATCH /v1/convai/agents/{agent_id}
If the API shape has drifted, run with --dry-run and enter the printed config
in the dashboard (Agents → New agent) by hand.

Run:  make jobvis-agent          (or: uv run python scripts/setup_jobvis_agent.py [--dry-run])
"""

from __future__ import annotations

import argparse
import json
import sys

import httpx

from job_scout.config import get_settings
from job_scout.voice.persona import AGENT_NAME, FIRST_MESSAGE, JOBVIS_SYSTEM_PROMPT, PREFERRED_VOICE_NAMES, TOOL_SPECS

API = "https://api.elevenlabs.io"
TOOL_TIMEOUT_S = 5


def build_tool_payload(spec: dict) -> dict:
    """Convert one neutral TOOL_SPEC into the ConvAI client-tool config shape."""
    payload = {
        "type": "client",
        "name": spec["name"],
        "description": spec["description"],
        "expects_response": spec["wait_for_response"],
        "response_timeout_secs": TOOL_TIMEOUT_S,
    }
    if spec["parameters"]:
        payload["parameters"] = {
            "type": "object",
            "properties": {p["name"]: {"type": p["type"], "description": p["description"]} for p in spec["parameters"]},
            "required": [p["name"] for p in spec["parameters"] if p["required"]],
        }
    return payload


def build_agent_payload(voice_id: str | None) -> dict:
    """The full agent configuration pushed to ElevenLabs.

    Latency choices are deliberate: flash_v2 TTS (~75ms; the API requires
    turbo/flash v2 for English-language agents — flash_v2_5 is multilingual
    only), an explicit fast LLM, eager turn-taking, and a spoken "One moment."
    filler instead of dead air on slow thinks. asr.keywords boosts recognition
    of the coinages the demo lives on. (tts.optimize_streaming_latency is
    deprecated — a no-op.)
    """
    payload = {
        "name": AGENT_NAME,
        "conversation_config": {
            "agent": {
                "first_message": FIRST_MESSAGE,
                "language": "en",
                "prompt": {
                    "prompt": JOBVIS_SYSTEM_PROMPT,
                    "llm": "gemini-2.5-flash",
                    "tools": [build_tool_payload(spec) for spec in TOOL_SPECS],
                },
            },
            "tts": {"model_id": "eleven_flash_v2"},
            "turn": {
                "turn_timeout": 7,
                "turn_eagerness": "eager",
                "soft_timeout_config": {"timeout_seconds": 3, "message": "One moment."},
            },
            "asr": {"keywords": ["Jobvis", "tailor", "CV", "cover letter"]},
        },
    }
    if voice_id:
        payload["conversation_config"]["tts"]["voice_id"] = voice_id
    return payload


def pick_voice(client: httpx.Client) -> str | None:
    """A configured ELEVENLABS_VOICE_ID, else the first preferred stock voice."""
    settings = get_settings()
    if settings.elevenlabs_voice_id:
        return settings.elevenlabs_voice_id
    voices = client.get(f"{API}/v1/voices").raise_for_status().json().get("voices", [])
    by_name = {str(v.get("name", "")).lower(): v.get("voice_id") for v in voices}
    for name in PREFERRED_VOICE_NAMES:
        if by_name.get(name.lower()):
            print(f"voice: {name}")
            return by_name[name.lower()]
    print(f"note: none of {PREFERRED_VOICE_NAMES} found; keeping the agent's default voice")
    return None


def find_agent_id(client: httpx.Client) -> str | None:
    """ELEVENLABS_AGENT_ID when it still exists, else an agent named Jobvis.

    The configured id is checked rather than trusted: rotating to a different
    ElevenLabs account leaves a perfectly valid-looking id in .env that belongs
    to the old one, and patching it 404s. Falling through to creation is what
    somebody in that position actually wants.
    """
    settings = get_settings()
    if settings.elevenlabs_agent_id:
        probe = client.get(f"{API}/v1/convai/agents/{settings.elevenlabs_agent_id}")
        if probe.status_code == 200:
            return settings.elevenlabs_agent_id
        if probe.status_code == 404:
            print(f"ELEVENLABS_AGENT_ID={settings.elevenlabs_agent_id} does not exist on this account — creating a new agent.")
        else:
            probe.raise_for_status()
    agents = client.get(f"{API}/v1/convai/agents", params={"page_size": 100}).raise_for_status().json().get("agents", [])
    for agent in agents:
        if agent.get("name") == AGENT_NAME:
            return agent.get("agent_id")
    return None


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--dry-run", action="store_true", help="print the agent payload and exit (no API calls)")
    args = parser.parse_args()

    if args.dry_run:
        print(json.dumps(build_agent_payload(voice_id=None), indent=2))
        return 0

    settings = get_settings()
    api_key = settings.elevenlabs_api_key.get_secret_value()
    if not api_key:
        print("ELEVENLABS_API_KEY is not set — add it to .env first (see .env.example).", file=sys.stderr)
        return 1

    with httpx.Client(headers={"xi-api-key": api_key}, timeout=30) as client:
        try:
            payload = build_agent_payload(pick_voice(client))
            agent_id = find_agent_id(client)
            if agent_id:
                client.patch(f"{API}/v1/convai/agents/{agent_id}", json=payload).raise_for_status()
                print(f"updated agent {agent_id}")
            else:
                response = client.post(f"{API}/v1/convai/agents/create", json=payload).raise_for_status()
                agent_id = response.json().get("agent_id", "")
                print(f"created agent {agent_id}")
        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            print(f"ElevenLabs rejected the request: {status} {exc.response.text}", file=sys.stderr)
            if status in (401, 403):
                print(
                    "Your API key lacks Agents-platform permissions. In the ElevenLabs dashboard open "
                    "Developers → API Keys → your key, and enable the Agents Platform (Conversational AI) "
                    "read + write scopes — or create a new key with no restrictions.",
                    file=sys.stderr,
                )
            else:
                print("The API shape may have drifted — run with --dry-run and configure the agent by hand.", file=sys.stderr)
            return 1

    print("\nPut this in .env:")
    print(f"ELEVENLABS_AGENT_ID={agent_id}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
