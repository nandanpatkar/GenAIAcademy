"""Application configuration loaded from the environment and ``.env``.

A single ``Settings`` object holds every setting. Secrets use ``SecretStr`` so
they never appear in logs or trace metadata by accident. Each field's ``.env``
name is documented in ``.env.example``.
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# The repo-root .env, resolved from this file so notebooks and scripts running
# from subdirectories (e.g. notebooks/) still find it. A CWD-local .env, when
# present, is read second and wins.
_REPO_ENV = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    """Runtime configuration, read once from the environment or ``.env``."""

    model_config = SettingsConfigDict(
        env_file=(_REPO_ENV, ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    scout_model: str = Field(default="openai:gpt-4o-mini", alias="SCOUT_MODEL")
    scout_tailor_model: str = Field(default="openai:gpt-4o-mini", alias="SCOUT_TAILOR_MODEL")

    openai_api_key: SecretStr = Field(default=SecretStr(""), alias="OPENAI_API_KEY")

    azure_openai_api_key: SecretStr = Field(default=SecretStr(""), alias="AZURE_OPENAI_API_KEY")
    azure_openai_endpoint: str = Field(default="", alias="AZURE_OPENAI_ENDPOINT")
    openai_api_version: str = Field(default="", alias="OPENAI_API_VERSION")

    opik_api_key: SecretStr = Field(default=SecretStr(""), alias="OPIK_API_KEY")
    opik_workspace: str = Field(default="", alias="OPIK_WORKSPACE")
    opik_project_name: str = Field(default="job-scout", alias="OPIK_PROJECT_NAME")
    opik_enabled: bool = Field(default=True, alias="OPIK_ENABLED")

    jsearch_api_key: SecretStr = Field(default=SecretStr(""), alias="JSEARCH_API_KEY")
    adzuna_app_id: SecretStr = Field(default=SecretStr(""), alias="ADZUNA_APP_ID")
    adzuna_app_key: SecretStr = Field(default=SecretStr(""), alias="ADZUNA_APP_KEY")

    tavily_api_key: SecretStr = Field(default=SecretStr(""), alias="TAVILY_API_KEY")

    elevenlabs_api_key: SecretStr = Field(default=SecretStr(""), alias="ELEVENLABS_API_KEY")
    elevenlabs_agent_id: str = Field(default="", alias="ELEVENLABS_AGENT_ID")
    elevenlabs_voice_id: str = Field(default="", alias="ELEVENLABS_VOICE_ID")

    max_llm_calls_per_run: int = Field(default=25, alias="MAX_LLM_CALLS_PER_RUN")
    scout_max_jobs: int = Field(default=10, alias="SCOUT_MAX_JOBS")
    scout_max_reformulations: int = Field(default=2, alias="SCOUT_MAX_REFORMULATIONS")
    scout_fetch_model: str = Field(default="", alias="SCOUT_FETCH_MODEL")
    scout_rank_batch: int = Field(default=4, alias="SCOUT_RANK_BATCH")
    scout_concurrent_sources: bool = Field(default=True, alias="SCOUT_CONCURRENT_SOURCES")
    # 1.0s is measured, not guessed. The deadline is paid in full on every
    # search (adzuna is already finished by ~1s, so wall clock == deadline),
    # and jsearch has never once returned under 8s across every trace we have.
    # So a longer deadline buys jsearch no real chance and bills us the
    # difference. Phase 2 in run_search is what protects the results.
    scout_source_soft_deadline: float = Field(
        default=1.0,
        alias="SCOUT_SOURCE_SOFT_DEADLINE",
        description="Seconds to wait for the first concurrent source before falling through to faster ones.",
    )

    fab_bullet_ratio: float = Field(default=0.65, alias="SCOUT_FAB_BULLET_RATIO")
    fab_skill_ratio: float = Field(default=0.85, alias="SCOUT_FAB_SKILL_RATIO")
    fab_letter_ratio: float = Field(default=0.55, alias="SCOUT_FAB_LETTER_RATIO")

    @field_validator(
        "opik_workspace",
        "opik_project_name",
        "scout_model",
        "scout_tailor_model",
        "scout_fetch_model",
        "elevenlabs_agent_id",
        "elevenlabs_voice_id",
        mode="before",
    )
    @classmethod
    def _drop_inline_comment(cls, value: object) -> object:
        """Treat a value that is only a ``# comment`` as empty.

        Guards the common ``.env`` mistake of leaving a key blank but keeping its
        trailing comment, which some parsers read as the value.
        """
        if isinstance(value, str):
            value = value.strip()
            if value.startswith("#"):
                return ""
        return value

    @property
    def has_jsearch(self) -> bool:
        """Whether a JSearch API key is configured."""
        return bool(self.jsearch_api_key.get_secret_value())

    @property
    def has_adzuna(self) -> bool:
        """Whether both Adzuna credentials are configured."""
        return bool(self.adzuna_app_id.get_secret_value() and self.adzuna_app_key.get_secret_value())

    @property
    def has_tavily(self) -> bool:
        """Whether a Tavily API key is configured (optional company research)."""
        return bool(self.tavily_api_key.get_secret_value())

    @property
    def has_opik(self) -> bool:
        """Whether Opik tracing is enabled and has an API key."""
        return self.opik_enabled and bool(self.opik_api_key.get_secret_value())

    @property
    def has_voice(self) -> bool:
        """Whether Jobvis has both an ElevenLabs API key and an agent id."""
        return bool(self.elevenlabs_api_key.get_secret_value() and self.elevenlabs_agent_id)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide settings singleton."""
    return Settings()
