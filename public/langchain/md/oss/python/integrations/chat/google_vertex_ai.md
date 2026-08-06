> [!DANGER]
>
> **Deprecated**
>
>     This integration is deprecated and will be removed in a future release. Please use [`ChatGoogleGenerativeAI`](lc:oss/python/integrations/chat/google_generative_ai) instead. See the full [release notes and migration guide](https://github.com/langchain-ai/langchain-google/discussions/1422).


Vertex AI exposes all foundational models available in Google Cloud, like `gemini-2.5-pro`, `gemini-2.5-flash`, etc. For a full and updated list of available models visit [VertexAI documentation](https://cloud.google.com/vertex-ai/generative-ai/docs/models).


> [!NOTE]
>
> **Google Cloud VertexAI vs Gemini API**
>
>     The Google Cloud VertexAI integration is separate from the [Google Gemini API](lc:oss/python/integrations/chat/google_generative_ai). This page showcases an enterprise version of Gemini through Google Cloud Platform (GCP).


> [!TIP]
>
> **API Reference**
>
>     For detailed documentation of all features and configuration options, head to the `ChatVertexAI` API reference.


## Overview

### Integration details

| Class | Package | Serializable | [JS support](https://js.langchain.com/docs/integrations/chat/google_vertex_ai) | Downloads | Version |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| `ChatVertexAI` | `langchain-google-vertexai` | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-google-vertexai?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-google-vertexai?style=flat-square&label=%20) |

### Model features

| [Tool calling](lc:oss/python/langchain/tools) | [Structured output](lc:oss/python/langchain/structured-output) | [Image input](lc:oss/python/langchain/messages#multimodal) | Audio input | Video input | [Token-level streaming](lc:oss/python/langchain/streaming) | Native async | [Token usage](lc:oss/python/langchain/models#token-usage) | [Logprobs](lc:oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## Setup

To access VertexAI models you'll need to create a Google Cloud Platform account, set up credentials, and install the `langchain-google-vertexai` integration package.

### Credentials

To use the integration you must either:

- Have credentials configured for your environment (gcloud, workload identity, etc...)
- Store the path to a service account JSON file as the `GOOGLE_APPLICATION_CREDENTIALS` environment variable

This codebase uses the `google.auth` library which first looks for the application credentials variable mentioned above, and then looks for system-level auth.

For more information, see the `google.auth` [API reference](https://googleapis.dev/python/google-auth/latest/reference/google.auth.html#module-google.auth).

To enable automated tracing of your model calls, set your [LangSmith](lc:langsmith/observability) API key:

```python
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
os.environ["LANGSMITH_TRACING"] = "true"
```

### Installation

The LangChain VertexAI integration lives in the `langchain-google-vertexai` package:

```python
pip install -qU langchain-google-vertexai
```

## Instantiation

Now we can instantiate our model object and generate chat completions:

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(
    model="gemini-2.5-flash",
    temperature=0,
    max_tokens=None,
    max_retries=6,
    stop=None,
    # other params...
)
```

## Invocation

```python
messages = [
    (
        "system",
        "You are a helpful assistant that translates English to French. Translate the user sentence.",
    ),
    ("human", "I love programming."),
]
ai_msg = llm.invoke(messages)
ai_msg
```

```text
AIMessage(content="J'adore programmer. \n", response_metadata={'is_blocked': False, 'safety_ratings': [{'category': 'HARM_CATEGORY_HATE_SPEECH', 'probability_label': 'NEGLIGIBLE', 'blocked': False}, {'category': 'HARM_CATEGORY_DANGEROUS_CONTENT', 'probability_label': 'NEGLIGIBLE', 'blocked': False}, {'category': 'HARM_CATEGORY_HARASSMENT', 'probability_label': 'NEGLIGIBLE', 'blocked': False}, {'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'probability_label': 'NEGLIGIBLE', 'blocked': False}], 'usage_metadata': {'prompt_token_count': 20, 'candidates_token_count': 7, 'total_token_count': 27}}, id='run-7032733c-d05c-4f0c-a17a-6c575fdd1ae0-0', usage_metadata={'input_tokens': 20, 'output_tokens': 7, 'total_tokens': 27})
```

```python
print(ai_msg.content)
```

```text
J'adore programmer.
```

## Built-in tools

Gemini supports a range of tools that are executed server-side.

### Google search


> [!NOTE]
>
> **Requires `langchain-google-vertexai>=2.0.11`**


Gemini can execute a Google search and use the results to [ground its responses](https://ai.google.dev/gemini-api/docs/grounding):

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(model="gemini-2.5-flash").bind_tools([{"google_search": {}}])

response = llm.invoke("What is today's news?")
```

### Code execution


> [!NOTE]
>
> **Requires `langchain-google-vertexai>=2.0.25`**


Gemini can [generate and execute Python code](https://ai.google.dev/gemini-api/docs/code-execution):

```python
from langchain_google_vertexai import ChatVertexAI

llm = ChatVertexAI(model="gemini-2.5-flash").bind_tools([{"code_execution": {}}])

response = llm.invoke("What is 3^3?")
```

---

## API reference

For detailed documentation of all features and configuration options, head to the `ChatVertexAI` API reference.
