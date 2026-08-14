"""Jobvis — the voice concierge (ElevenLabs Agents over the Job Scout graph).

The conversation itself lives in the browser now: the console holds the WebRTC
session, which is what buys real barge-in and the browser's own echo
cancellation. Python keeps everything the agent may *know* — ``bridge``,
``tools`` and ``persona`` are plain Python over the existing graph and runner,
with no SDK and no audio device anywhere in the package.

That is why availability is only a question of credentials now: there is no
extra to install and no portaudio to build.
"""

from __future__ import annotations

from job_scout.config import get_settings


def is_voice_available() -> tuple[bool, str]:
    """Whether Jobvis can run, and when it cannot, a one-line hint saying why."""
    settings = get_settings()
    if not settings.elevenlabs_api_key.get_secret_value():
        return False, "Jobvis is off — set ELEVENLABS_API_KEY in .env to enable the voice concierge."
    if not settings.elevenlabs_agent_id:
        return False, "Jobvis is off — run `make jobvis-agent` and put the printed ELEVENLABS_AGENT_ID in .env."
    return True, ""
