"""Chat-model factory and the per-run LLM call budget.

The call budget is a simple circuit breaker: every node reads the running
``llm_calls`` counter from state, checks it against ``MAX_LLM_CALLS_PER_RUN``
before calling the model, and returns the incremented total. The graph runs
sequentially, so returning the cumulative total (not a delta) keeps the counter
correct.
"""

from __future__ import annotations

import os
from functools import lru_cache

from langchain.chat_models import init_chat_model
from langchain_core.language_models.chat_models import BaseChatModel

from job_scout.config import get_settings


class LLMBudgetExceededError(RuntimeError):
    """Raised when a run would exceed ``MAX_LLM_CALLS_PER_RUN``."""


def _export_openai_key() -> None:
    """Copy the OpenAI key from settings into the environment for LangChain.

    ``pydantic-settings`` reads ``.env`` into the ``Settings`` object but does not
    export to ``os.environ``, which is where the OpenAI client looks for its key.
    """
    if os.environ.get("OPENAI_API_KEY"):
        return
    key = get_settings().openai_api_key.get_secret_value()
    if key:
        os.environ["OPENAI_API_KEY"] = key


def _export_azure_openai_settings() -> None:
    """Copy the Azure OpenAI key, endpoint, and API version into the environment.

    ``AzureChatOpenAI`` reads ``AZURE_OPENAI_API_KEY``, ``AZURE_OPENAI_ENDPOINT``, and
    ``OPENAI_API_VERSION`` from ``os.environ``, same gap as the plain OpenAI key above.
    """
    settings = get_settings()
    if not os.environ.get("AZURE_OPENAI_API_KEY"):
        key = settings.azure_openai_api_key.get_secret_value()
        if key:
            os.environ["AZURE_OPENAI_API_KEY"] = key
    if not os.environ.get("AZURE_OPENAI_ENDPOINT") and settings.azure_openai_endpoint:
        os.environ["AZURE_OPENAI_ENDPOINT"] = settings.azure_openai_endpoint
    if not os.environ.get("OPENAI_API_VERSION") and settings.openai_api_version:
        os.environ["OPENAI_API_VERSION"] = settings.openai_api_version


@lru_cache(maxsize=8)
def get_chat_model(model: str, temperature: float = 0.0) -> BaseChatModel:
    """Return a cached chat model for a LangChain provider string (e.g. ``openai:gpt-4o-mini``)."""
    if model.startswith("openai:"):
        _export_openai_key()
    elif model.startswith("azure_openai:"):
        _export_azure_openai_settings()
    return init_chat_model(model, temperature=temperature)


def ensure_budget(current_calls: int, planned: int, max_calls: int) -> None:
    """Raise ``LLMBudgetExceededError`` if ``planned`` more calls would exceed ``max_calls``."""
    if current_calls + planned > max_calls:
        raise LLMBudgetExceededError(
            f"Run would make {current_calls + planned} LLM calls, exceeding MAX_LLM_CALLS_PER_RUN={max_calls}."
        )
