This guide shows you how to trace and log [Google's Gemini](https://ai.google.dev/gemini-api/docs) models in LangSmith. You'll instrument Gemini calls using the latest [`google-genai` SDK](https://googleapis.github.io/python-genai/) (Python) or [`@google/genai` SDK](https://googleapis.github.io/js-genai/release_docs/index.html) (JavaScript), wrap the Gemini client for tracing, and try examples including basic prompts, metadata tagging, and multi-turn conversations.


> [!NOTE]
>
> The LangSmith Gemini wrappers are in **[beta](lc:langsmith/release-stages)**. The API may change in future releases.


## Installation

Install the required packages using your preferred package manager:

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install langsmith google-genai"
 },
 {
  "label": "npm",
  "lang": "bash",
  "code": "npm install langsmith@latest @google/genai"
 }
]
```

## Setup

Set your [API keys](lc:langsmith/create-account-api-key) and project name:

```bash
export LANGSMITH_API_KEY=<your_langsmith_api_key>
export LANGSMITH_PROJECT=<your_project_name>
export LANGSMITH_TRACING=true
export GOOGLE_API_KEY=<your_google_api_key>
```

To create a Google API key, refer to [Google AI Studio](https://aistudio.google.com/apikey).

## Configure tracing

To trace Gemini API calls, use LangSmith's `wrap_gemini`[wrap_gemini] (Python) or `wrapGemini`[wrapGemini] (JavaScript) wrapper function. This wrapper intercepts calls to the Gemini client and automatically logs them as traces in LangSmith. The wrapper preserves all of the original client's functionality while adding observability:

```python Python
from google import genai
from langsmith import wrappers

def main():
    # genai.Client() reads GOOGLE_API_KEY / GEMINI_API_KEY from the environment
    gemini_client = genai.Client()

    # Wrap the Gemini client to enable LangSmith tracing
    client = wrappers.wrap_gemini(
        gemini_client,
        tracing_extra={
            "tags": ["gemini", "python"],
            "metadata": {
                "integration": "google-genai",
            },
        },
    )

    # Make a traced Gemini call
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Explain quantum computing in simple terms.",
    )

    print(response.text)

if __name__ == "__main__":
    main()
```

#### Tab: Python

You can customize tracing by passing `tracing_extra`[wrap_gemini] when calling `wrap_gemini()`. This parameter applies to all subsequent requests you make with that wrapped client, which allows you to attach tags and metadata for filtering and organizing traces in the [LangSmith UI](https://smith.langchain.com). The `tracing_extra` parameter accepts:

- `tags`: A list of strings to categorize traces (for example, `["production", "gemini"]`).
- `metadata`: A dictionary of key-value pairs for additional context (for example, `{"team": "ml-research", "integration": "google-genai"}`).
- `client`: An optional custom LangSmith client instance.

These settings apply consistently across all traces from the wrapped client, so that you can include environment-level tags or team metadata that should remain constant throughout your application.

#### Tab: JavaScript

You can customize tracing by passing configuration options to `wrapGemini`[wrapGemini]. These options apply to all subsequent requests you make with that wrapped client, which allows you to attach tags and metadata for filtering and organizing traces in the [LangSmith UI](https://smith.langchain.com). The configuration accepts:

- `tags`: An array of strings to categorize traces (for example, `["production", "gemini"]`).
- `metadata`: An object with key-value pairs for additional context (for example, `{ team: "ml-research", integration: "google-genai" }`).
- `client`: An optional custom LangSmith client instance.

These settings apply consistently across all traces from the wrapped client, so that you can include environment-level tags or team metadata that should remain constant throughout your application.

## View traces in LangSmith

After running your application, you can view traces in the [LangSmith UI](https://smith.langchain.com) that include:

- **Model requests**: Complete prompts sent to Gemini models
- **Model responses**: Generated text and structured outputs
- **Function calls**: Tool invocations and results when using function calling
- **Chat sessions**: Multi-turn conversation context
- **Performance metrics**: Latency and token usage information
