You can use the LangSmith Python, TypeScript, and Java SDKs to manage prompts programmatically.


> [!NOTE]
>
> Previously this functionality lived in the `langchainhub` package which is now deprecated. All functionality going forward will live in the `langsmith` package.


## Install packages

In Python, you can directly use the LangSmith SDK (*recommended, full functionality*) or you can use through the LangChain package (limited to pushing and pulling prompts).

In TypeScript, you must use the LangChain npm package for pulling prompts (it also allows pushing). For all other functionality, use the LangSmith package.

```lc-tabs
[
 {
  "label": "pip",
  "lang": "bash",
  "code": "pip install -U langsmith # version >= 0.1.99"
 },
 {
  "label": "uv",
  "lang": "bash",
  "code": "uv add langsmith  # version >= 0.1.99"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add langsmith langchain # langsmith version >= 0.1.99 and langchain version >= 0.2.14"
 },
 {
  "label": "Java/Kotlin (Gradle)",
  "lang": "kotlin",
  "code": "implementation(\"com.langchain.smith:langsmith-java:0.1.0-beta.4\")"
 }
]
```

## Configure environment variables

If you already have `LANGSMITH_API_KEY` set to your current workspace's api key from LangSmith, you can skip this step.

Otherwise, get an API key for your workspace by navigating to `Settings > API Keys > Create API Key` in LangSmith.

Set your environment variable.

```bash
export LANGSMITH_API_KEY="lsv2_..."
```


> [!NOTE]
>
> What we refer to as "prompts" used to be called "repos", so any references to "repo" in the code are referring to a prompt.


## Push a prompt

To create a new prompt or update an existing prompt, you can use the `push prompt` method.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\nfrom langchain_core.prompts import ChatPromptTemplate\n\nclient = Client()\nprompt = ChatPromptTemplate.from_template(\"tell me a joke about {topic}\")\nurl = client.push_prompt(\"joke-generator\", object=prompt)\n# url is a link to the prompt in the UI\nprint(url)"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "from langchain_classic import hub as prompts\nfrom langchain_core.prompts import ChatPromptTemplate\n\nprompt = ChatPromptTemplate.from_template(\"tell me a joke about {topic}\")\nurl = prompts.push(\"joke-generator\", prompt)\n# url is a link to the prompt in the UI\nprint(url)"
 }
]
```


You can also push a prompt as a RunnableSequence of a prompt and a model. This is useful for storing the model configuration you want to use with this prompt. The provider must be supported by the Playground, see [supported model providers](lc:langsmith/playground-model-providers).

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_openai import ChatOpenAI\n\nclient = Client()\nmodel = ChatOpenAI(model=\"gpt-5.4-mini\")\nprompt = ChatPromptTemplate.from_template(\"tell me a joke about {topic}\")\nchain = prompt | model\nclient.push_prompt(\"joke-generator-with-model\", object=chain)"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "from langchain_classic import hub as prompts\nfrom langchain_core.prompts import ChatPromptTemplate\nfrom langchain_openai import ChatOpenAI\n\nmodel = ChatOpenAI(model=\"gpt-5.4-mini\")\nprompt = ChatPromptTemplate.from_template(\"tell me a joke about {topic}\")\nchain = prompt | model\nurl = prompts.push(\"joke-generator-with-model\", chain)\n# url is a link to the prompt in the UI\nprint(url)"
 }
]
```

## Push a StructuredPrompt

A `StructuredPrompt` combines a prompt template with an output schema, ensuring the model returns data in a defined structure. Use `StructuredPrompt.from_messages_and_schema` (Python) or `StructuredPrompt.fromMessagesAndSchema` (TypeScript) to create one, then push it to the hub like any other prompt.

### Without a model

Push the structured prompt on its own when you want to store the template and schema independently of any model configuration.

```python Python
from langsmith import Client
from langchain_core.prompts.structured import StructuredPrompt
from pydantic import BaseModel, Field

class ResponseSchema(BaseModel):
    positive_sentiment: bool = Field(description="Was the user sentiment positive?")

prompt = StructuredPrompt.from_messages_and_schema(
    [
        ("system", "Evaluate the sentiment of the following conversation."),
        ("human", "{conversation}"),
    ],
    schema=ResponseSchema.model_json_schema(),
)

client = Client()
url = client.push_prompt("sentiment-evaluator", object=prompt)
print(url)
```

### With a model

Push the structured prompt as a RunnableSequence with a model to store the full pipeline, including model configuration, in the hub.

```python Python
from langsmith import Client
from langchain_core.prompts.structured import StructuredPrompt
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field

class ResponseSchema(BaseModel):
    positive_sentiment: bool = Field(description="Was the user sentiment positive?")

prompt = StructuredPrompt.from_messages_and_schema(
    [
        ("system", "Evaluate the sentiment of the following conversation."),
        ("human", "{conversation}"),
    ],
    schema=ResponseSchema.model_json_schema(),
)

model = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | model

client = Client()
url = client.push_prompt("sentiment-evaluator-with-model", object=chain)
print(url)
```

## Pull a prompt

To pull a prompt, you can use the `pull prompt` method, which returns the prompt as a langchain `PromptTemplate`.

To pull a **private prompt** you do not need to specify the owner handle (though you can, if you have one set).

To pull a **public prompt** from the LangChain Hub, you need to specify the handle of the prompt's author.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\nfrom langchain_openai import ChatOpenAI\n\nclient = Client()\nprompt = client.pull_prompt(\"joke-generator\")\nmodel = ChatOpenAI(model=\"gpt-5.4-mini\")\nchain = prompt | model\nchain.invoke({\"topic\": \"cats\"})"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "from langchain_classic import hub as prompts\nfrom langchain_openai import ChatOpenAI\n\nprompt = prompts.pull(\"joke-generator\")\nmodel = ChatOpenAI(model=\"gpt-5.4-mini\")\nchain = prompt | model\nchain.invoke({\"topic\": \"cats\"})"
 }
]
```


Similar to pushing a prompt, you can also pull a prompt as a RunnableSequence of a prompt and a model. Just specify include\_model when pulling the prompt. If the stored prompt includes a model, it will be returned as a RunnableSequence. Make sure you have the proper environment variables set for the model you are using.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "from langsmith import Client\n\nclient = Client()\nchain = client.pull_prompt(\"joke-generator-with-model\", include_model=True)\nchain.invoke({\"topic\": \"cats\"})"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "from langchain_classic import hub as prompts\n\nchain = prompts.pull(\"joke-generator-with-model\", include_model=True)\nchain.invoke({\"topic\": \"cats\"})"
 }
]
```

When pulling a prompt, you can also specify a specific commit hash or [commit tag](lc:langsmith/manage-prompts#commit-tags) to pull a specific version of the prompt.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "prompt = client.pull_prompt(\"joke-generator:12344e88\")"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "prompt = prompts.pull(\"joke-generator:12344e88\")"
 }
]
```


To pull a public prompt from the LangChain Hub, you need to specify the handle of the prompt's author.

```lc-tabs
[
 {
  "label": "Python",
  "lang": "python",
  "code": "prompt = client.pull_prompt(\"efriis/my-first-prompt\")"
 },
 {
  "label": "LangChain (Python)",
  "lang": "python",
  "code": "prompt = prompts.pull(\"efriis/my-first-prompt\")"
 }
]
```


> [!NOTE]
>
> For pulling prompts, if you are using Node.js or an environment that supports dynamic imports, we recommend using the `langchain/hub/node` entrypoint, as it handles deserialization of models associated with your prompt configuration automatically.
>
> If you are in a non-Node environment, "includeModel" is not supported for non-OpenAI models and you should use the base `langchain/hub` entrypoint.


## Prompt caching

The LangSmith SDK includes built-in in-memory caching for prompts. When enabled, LangSmith will cache pulled prompts in memory, reducing latency and API calls for frequently used prompts. The cache uses a global singleton instance that is shared across all clients and persists for the lifetime of the process. It implements a stale-while-revalidate pattern, ensuring your application always gets a fast response while keeping prompts up-to-date in the background.

**Requirements:**
- Python SDK: `langsmith >= 0.7.0`
- TypeScript SDK: `langsmith >= 0.5.0`

### Default behavior

Caching is **enabled by default**. When enabled, the default settings are:

| Setting | Default | Description |
|---------|---------|-------------|
| `max_size` | 100 | Maximum number of prompts to cache |
| `ttl_seconds` | 300 (5 minutes) | Time before a cached prompt is considered stale |
| `refresh_interval_seconds` | 60 | How often to check for stale prompts and refresh them in the background |

When refreshing, the global cache will use the last client that requested a given prompt to fetch new data.

### Using the cache

By default, all clients use the global prompt cache. No configuration is needed:

```python Python
from langsmith import Client
# Obtain a reference to the global cache just for logging metrics
from langsmith.prompt_cache import prompt_cache_singleton

# Caching is enabled by default using the global singleton
client = Client()

# First pull - fetches from API and caches
prompt = client.pull_prompt("joke-generator")

# Subsequent pulls - returns cached version instantly
prompt = client.pull_prompt("joke-generator")

# Check cache metrics
print(f"Cache hits: {prompt_cache_singleton.metrics.hits}")
print(f"Cache misses: {prompt_cache_singleton.metrics.misses}")
print(f"Hit rate: {prompt_cache_singleton.metrics.hit_rate:.1%}")
```

### Configuring the global cache

You can configure the global prompt cache that all clients use by default. This is useful when you want to customize caching behavior across your entire application:

```python Python
from langsmith import Client
from langsmith.prompt_cache import (
    configure_global_prompt_cache,
    prompt_cache_singleton,
)

# Configure global cache before creating any clients
configure_global_prompt_cache(
    max_size=200,  # Cache up to 200 prompts
    ttl_seconds=7200,  # Consider prompts stale after 2 hours
    refresh_interval_seconds=600,  # Check for stale prompts every 10 minutes
)

# All clients will use these settings
client1 = Client()
client2 = Client()

# Both clients share the same global cache with your custom settings
prompt1 = client1.pull_prompt("prompt-1")
prompt2 = client2.pull_prompt("prompt-2")

# Check global cache metrics
print(f"Global cache hits: {prompt_cache_singleton.metrics.hits}")
print(f"Global cache misses: {prompt_cache_singleton.metrics.misses}")
```

### Disabling the cache

To disable caching for a specific client, pass `disable_prompt_cache=True`. You can also configure a max size of zero globally:

```python Python
from langsmith import Client

# Disable caching for this client
client = Client(disable_prompt_cache=True)

# Every pull will fetch from the API
prompt = client.pull_prompt("joke-generator")
```

### Skipping the cache

To bypass the cache and fetch a fresh prompt from the API for an individual request, use the `skip_cache` parameter:

```python Python
# Force a fresh fetch, ignoring any cached version
prompt = client.pull_prompt("joke-generator", skip_cache=True)
```

This is useful when you need to ensure you have the latest version of a prompt, such as after making changes in the LangSmith UI.

### Offline mode

For environments with limited or no network connectivity, you can pre-populate the cache and use it offline. Set `ttl_seconds` to `None` (Python) or `null` (TypeScript) to prevent cache entries from expiring and disable background refresh.

**Step 1: Export your prompts to a cache file (while online)**

```python Python
from langsmith import Client
from langsmith.prompt_cache import prompt_cache_singleton

# Create client (caching is enabled by default)
client = Client()

# Pull the prompts you need
client.pull_prompt("prompt-1")
client.pull_prompt("prompt-2")
client.pull_prompt("prompt-3")

# Export cache to a file
prompt_cache_singleton.dump("prompts_cache.json")
```

**Step 2: Load the cache file in your offline environment**

```python Python
from langsmith import Client
from langsmith.prompt_cache import (
    configure_global_prompt_cache,
    prompt_cache_singleton,
)

# Configure cache with infinite TTL (never expire, no background refresh)
configure_global_prompt_cache(ttl_seconds=None)

# Load the cache file
prompt_cache_singleton.load("prompts_cache.json")

# Create client (uses the loaded cache)
client = Client()

# Uses cached version without any API calls
prompt = client.pull_prompt("prompt-1")
```

### Cache operations

The cache supports several operations for managing cached prompts:

```python Python
from langsmith import Client
from langsmith.prompt_cache import prompt_cache_singleton

client = Client()

# Invalidate a specific prompt from cache
prompt_cache_singleton.invalidate("joke-generator:latest")

# Clear all cached prompts
prompt_cache_singleton.clear()

# Reset metrics
prompt_cache_singleton.reset_metrics()

# Check if cache is running background refresh
# (only runs if ttl_seconds is not None)
if prompt_cache_singleton._refresh_thread is not None:
    print("Background refresh is active")
```

### Cleanup

You can manually call `stop()` to stop the background refresh task:

```python Python
prompt_cache_singleton.stop()
```


> [!NOTE]
>
> The background refresh task is only started when you first set a value in the cache, and only if `ttl_seconds` is not `None`. If `ttl_seconds` is `None` (offline mode), no background task is created.


## Use a prompt without LangChain

If you want to store your prompts in LangSmith but use them directly with a model provider's API, you can use our conversion methods. These convert your prompt into the payload required for the OpenAI or Anthropic API.

These conversion methods rely on logic from within LangChain integration packages, and you will need to install the appropriate package as a dependency in addition to your official SDK of choice. Here are some examples:

### OpenAI

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install -U langchain_openai"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add @langchain/openai @langchain/core # @langchain/openai version >= 0.3.2"
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "from openai import OpenAI\nfrom langsmith.client import Client, convert_prompt_to_openai_format\n\n# langsmith client\nclient = Client()\n# openai client\noai_client = OpenAI()\n\n# pull prompt and invoke to populate the variables\nprompt = client.pull_prompt(\"joke-generator\")\nprompt_value = prompt.invoke({\"topic\": \"cats\"})\nopenai_payload = convert_prompt_to_openai_format(prompt_value)\nopenai_response = oai_client.chat.completions.create(**openai_payload)"
 }
]
```


### Anthropic

```lc-tabs
[
 {
  "label": "Python",
  "lang": "bash",
  "code": "pip install -U langchain_anthropic"
 },
 {
  "label": "TypeScript",
  "lang": "bash",
  "code": "yarn add @langchain/anthropic @langchain/core # @langchain/anthropic version >= 0.3.3"
 },
 {
  "label": "Python",
  "lang": "python",
  "code": "from anthropic import Anthropic\nfrom langsmith.client import Client, convert_prompt_to_anthropic_format\n\n# langsmith client\nclient = Client()\n# anthropic client\nanthropic_client = Anthropic()\n\n# pull prompt and invoke to populate the variables\nprompt = client.pull_prompt(\"joke-generator\")\nprompt_value = prompt.invoke({\"topic\": \"cats\"})\nanthropic_payload = convert_prompt_to_anthropic_format(prompt_value)\nanthropic_response = anthropic_client.messages.create(**anthropic_payload)"
 }
]
```


## List, delete, and like prompts

You can also list, delete, and like/unlike prompts using the `list prompts`, `delete prompt`, `like prompt` and `unlike prompt` methods. See the [LangSmith SDK client](https://github.com/langchain-ai/langsmith-sdk) for extensive documentation on these methods.

```python Python
# List all prompts in my workspace
prompts = client.list_prompts()

# List my private prompts that include "joke"
prompts = client.list_prompts(query="joke", is_public=False)

# Delete a prompt
client.delete_prompt("joke-generator")

# Like a prompt
client.like_prompt("efriis/my-first-prompt")

# Unlike a prompt
client.unlike_prompt("efriis/my-first-prompt")
```
