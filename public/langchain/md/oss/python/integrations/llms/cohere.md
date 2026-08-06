> [!WARNING]
>
> **You are currently on a page documenting the use of Cohere models as text completion models. Many popular Cohere models are [chat completion models](lc:oss/python/langchain/models).**
>
> You may be looking for [this page instead](lc:oss/python/integrations/chat/cohere).


>[Cohere](https://cohere.ai/about) is a Canadian startup that provides natural language processing models that help companies improve human-machine interactions.

Head to the [API reference](https://reference.langchain.com/python/langchain-community/llms/cohere/Cohere) for detailed documentation of all attributes and methods.

## Setup

The integration lives in the `langchain-community` package. We also need to install the `cohere` package itself. We can install these with:


> [!WARNING]
>
> The `langchain-community` package is no longer maintained. Examples that import from `langchain_community` may be outdated or broken. Use with caution.


### Credentials

We'll need to get a [Cohere API key](https://cohere.com/) and set the `COHERE_API_KEY` environment variable:

```python

if "COHERE_API_KEY" not in os.environ:
    os.environ["COHERE_API_KEY"] = getpass.getpass()
```

### Installation

```python
pip install -U langchain-community langchain-cohere
```

It's also helpful (but not needed) to set up [LangSmith](https://smith.langchain.com) for best-in-class observability

```python
os.environ["LANGSMITH_TRACING"] = "true"
# os.environ["LANGSMITH_API_KEY"] = getpass.getpass()
```

## Invocation

Cohere supports all [LLM](lc:oss/python/langchain/models) functionality:

```python
from langchain_cohere import Cohere
from langchain.messages import HumanMessage
```

```python
model = Cohere(max_tokens=256, temperature=0.75)
```

```python
message = "Knock knock"
model.invoke(message)
```

```text
" Who's there?"
```

```python
await model.ainvoke(message)
```

```text
" Who's there?"
```

```python
stream = model.stream_events(message, version="v3")
for token in stream.text:
    print(token, end="", flush=True)
```

```text
 Who's there?
```

```python
model.batch([message])
```

```text
[" Who's there?"]
```

---

## API reference

For detailed documentation of all `Cohere` llm features and configurations head to the [API reference](https://reference.langchain.com/python/langchain-community/llms/cohere/Cohere)
