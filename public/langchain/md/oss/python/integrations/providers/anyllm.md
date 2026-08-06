> [any-llm](https://github.com/mozilla-ai/any-llm) is a unified interface for calling OpenAI, Anthropic, Google, local models (via Ollama/LocalAI), and [more](https://mozilla-ai.github.io/any-llm/providers/). Switch between providers just by changing a string.

## Installation and setup

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langchain-anyllm"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langchain-anyllm"
 }
]
```

You need the appropriate API key for your chosen provider. API keys can be passed via the `api_key` parameter or set as environment variables (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`). See the [any-llm documentation](https://mozilla-ai.github.io/any-llm/providers/) for provider-specific requirements.

## Chat models

```python
from langchain_anyllm import ChatAnyLLM
```

---

## API reference

For detailed documentation of all `ChatAnyLLM` features and configurations, head to the API reference: https://github.com/mozilla-ai/langchain-any-llm
