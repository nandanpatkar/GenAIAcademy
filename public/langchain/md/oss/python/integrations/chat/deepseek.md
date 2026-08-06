This will help you get started with DeepSeek's hosted [chat models](lc:oss/python/langchain/models).


> [!TIP]
>
> **API Reference**
>
>     For detailed documentation of all features and configuration options, head to the `ChatDeepSeek` API reference.


> [!TIP]
>
> **DeepSeek's models are open source and can be run locally (e.g. in [Ollama](lc:oss/python/integrations/chat/ollama)) or on other inference providers (e.g. , [Together](lc:oss/python/integrations/chat/together)) as well.**


## Overview

### Integration details

| Class | Package | Serializable | [JS support](https://js.langchain.com/docs/integrations/chat/deepseek) | Downloads | Version |
| :--- | :--- | :---: |  :---: | :---: | :---: |
| `ChatDeepSeek` | `langchain-deepseek` | beta | ✅ | ![PyPI - Downloads](https://img.shields.io/pypi/dm/langchain-deepseek?style=flat-square&label=%20) | ![PyPI - Version](https://img.shields.io/pypi/v/langchain-deepseek?style=flat-square&label=%20) |

### Model features

| [Tool calling](lc:oss/python/langchain/tools) | [Structured output](lc:oss/python/langchain/structured-output) | [Image input](lc:oss/python/langchain/messages#multimodal) | Audio input | Video input | [Token-level streaming](lc:oss/python/langchain/streaming) | Native async | [Token usage](lc:oss/python/langchain/models#token-usage) | [Logprobs](lc:oss/python/langchain/models#log-probabilities) |
| :---: | :---: | :---: |  :---: | :---: | :---: | :---: | :---: | :---: |
| ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |


> [!NOTE]
>
> **DeepSeek-R1, specified via `model="deepseek-reasoner"`, does not support tool calling or structured output. Those features [are supported](https://api-docs.deepseek.com/guides/function_calling) by DeepSeek-V3 (specified via `model="deepseek-chat"`).**


## Setup

To access DeepSeek models you'll need to create a DeepSeek account, get an API key, and install the `langchain-deepseek` integration package.

### Credentials

Head to [DeepSeek's API Key page](https://platform.deepseek.com/api_keys) to sign up to DeepSeek and generate an API key. Once you've done this set the `DEEPSEEK_API_KEY` environment variable:

```python

if not os.getenv("DEEPSEEK_API_KEY"):
    os.environ["DEEPSEEK_API_KEY"] = getpass.getpass("Enter your DeepSeek API key: ")
```

To enable automated tracing of your model calls, set your [LangSmith](lc:langsmith/observability) API key:

```python
os.environ["LANGSMITH_TRACING"] = "true"
os.environ["LANGSMITH_API_KEY"] = getpass.getpass("Enter your LangSmith API key: ")
```

### Installation

The LangChain DeepSeek integration lives in the `langchain-deepseek` package:

```python
pip install -qU langchain-deepseek
```

## Instantiation

Now we can instantiate our model object and generate chat completions:

```python
from langchain_deepseek import ChatDeepSeek

llm = ChatDeepSeek(
    model="deepseek-chat",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
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
ai_msg.content
```

---

## API reference

For detailed documentation of all `ChatDeepSeek` features and configurations head to the [API Reference](https://reference.langchain.com/python/langchain-deepseek/chat_models/ChatDeepSeek).
