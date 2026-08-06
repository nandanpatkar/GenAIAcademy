[Tavily](https://tavily.com) is a search engine built specifically for AI agents (LLMs), delivering real-time, accurate, and factual results at speed. Tavily offers a [Map](https://docs.tavily.com/documentation/api-reference/endpoint/map) endpoint that traverses websites and returns a list of discovered URLs without extracting page content, which is ideal for understanding site structure or locating specific pages on a large site.

## Overview

### Integration details

| Class                                                          | Package                                                          | Serializable | [JS support](https://js.langchain.com/docs/integrations/tools/tavily_map) |  Version |
|:---------------------------------------------------------------|:-----------------------------------------------------------------| :---: | :---: | :---: |
| `TavilyMap` | `langchain-tavily` | ✅ | ✅  |  ![PyPI - Version](https://img.shields.io/pypi/v/langchain-tavily?style=flat-square&label=%20) |

### Tool features

| [Returns artifact](lc:oss/python/langchain/tools) | Native async |                       Return data                        | Pricing |
| :---: | :---: |:--------------------------------------------------------:| :---: |
| ❌ | ✅ | list of discovered URLs | 1,000 free credits / month |

## Setup

The integration lives in the `langchain-tavily` package.

```python
pip install -qU langchain-tavily
```

### Credentials

We also need to set our Tavily API key. You can get an API key by visiting [this site](https://app.tavily.com/sign-in) and creating an account.

```python

if not os.environ.get("TAVILY_API_KEY"):
    os.environ["TAVILY_API_KEY"] = getpass.getpass("Tavily API key:\n")
```

## Instantiation

The tool accepts the following parameters during instantiation:

- `max_depth` (optional, int): Maximum number of hops from the starting URL. Default is 1.
- `max_breadth` (optional, int): Maximum number of URLs returned per level. Default is 20.
- `limit` (optional, int): Maximum total number of URLs to return. Default is 50.
- `instructions` (optional, str): Natural-language instructions that guide the map traversal.
- `select_paths` (optional, list[str]): Only include URLs containing these path regexes.
- `select_domains` (optional, list[str]): Only include URLs from these domain regexes.
- `exclude_paths` (optional, list[str]): Skip URLs containing these path regexes.
- `exclude_domains` (optional, list[str]): Skip URLs from these domain regexes.
- `allow_external` (optional, bool): Allow the map to follow external links.

For a comprehensive overview of the available parameters, refer to the [Tavily Map API documentation](https://docs.tavily.com/documentation/api-reference/endpoint/map).

```python
from langchain_tavily import TavilyMap

tool = TavilyMap(
    max_depth=1,
    max_breadth=20,
    limit=50,
    # allow_external=False,
)
```

## Invocation

### [Invoke directly with args](lc:oss/python/langchain/tools)

The Tavily map tool accepts the following arguments during invocation:

- `url` (required): The base URL to start mapping from.
- The following arguments can also be set during invocation: `instructions`, `select_paths`, `select_domains`, `exclude_paths`, `exclude_domains`, `allow_external`.

NOTE: The optional arguments are available for agents to dynamically set. If you set an argument during instantiation and then invoke the tool with a different value, the tool will use the value you passed during invocation.

```python
tool.invoke({"url": "https://docs.tavily.com"})
```

```json
{
  "base_url": "https://docs.tavily.com",
  "results": [
    "https://docs.tavily.com/",
    "https://docs.tavily.com/changelog",
    "https://docs.tavily.com/welcome",
    "https://docs.tavily.com/documentation/mcp",
    "https://docs.tavily.com/documentation/about",
  ],
  "response_time": 0.37
}
```

### [Invoke with ToolCall](lc:oss/python/langchain/tools)

We can also invoke the tool with a model-generated ToolCall, in which case a ToolMessage will be returned:

```python
model_generated_tool_call = {
    "args": {"url": "https://docs.tavily.com", "instructions": "Find API reference pages"},
    "id": "1",
    "name": "tavily_map",
    "type": "tool_call",
}
tool_msg = tool.invoke(model_generated_tool_call)

print(tool_msg.content[:400])
```

## Use within an agent

We can use the map tool directly with an agent by binding it to the model. The agent can then dynamically set instructions and filters to discover the URLs it needs.


#### Tab: OpenAI

        👉 Read the [OpenAI chat model integration docs](lc:oss/python/integrations/chat/openai)

        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"gpt-5.5\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import ChatOpenAI\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenAI(model=\"gpt-5.5\")"
             }
            ]
            ```
        
    
    #### Tab: Anthropic

        👉 Read the [Anthropic chat model integration docs](lc:oss/python/integrations/chat/anthropic)
        ```shell
        pip install -U "langchain[anthropic]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\"claude-sonnet-4-6\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_anthropic import ChatAnthropic\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = ChatAnthropic(model=\"claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: Azure

        👉 Read the [Azure chat model integration docs](lc:oss/python/integrations/chat/azure_chat_openai)
        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import AzureChatOpenAI\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = AzureChatOpenAI(\n    model=\"gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"]\n)"
             }
            ]
            ```
        
    
    #### Tab: Google Gemini

        👉 Read the [Google GenAI chat model integration docs](lc:oss/python/integrations/chat/google_generative_ai)
        ```shell
        pip install -U "langchain[google-genai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = init_chat_model(\"google_genai:gemini-2.5-flash-lite\")"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_google_genai import ChatGoogleGenerativeAI\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = ChatGoogleGenerativeAI(model=\"gemini-2.5-flash-lite\")"
             }
            ]
            ```
        
    
    #### Tab: AWS Bedrock

        👉 Read the [AWS Bedrock chat model integration docs](lc:oss/python/integrations/chat/bedrock)
        ```shell
        pip install -U "langchain[aws]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nmodel = init_chat_model(\n    \"us.anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_aws import ChatBedrock\n\nmodel = ChatBedrock(model=\"us.anthropic.claude-sonnet-4-6\")"
             }
            ]
            ```
        
    
    #### Tab: HuggingFace

        👉 Read the [HuggingFace chat model integration docs](lc:oss/python/integrations/chat/huggingface)

        ```shell
        pip install -U "langchain[huggingface]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nmodel = init_chat_model(\n    \"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.7,\n    max_tokens=1024,\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nllm = HuggingFaceEndpoint(\n    repo_id=\"microsoft/Phi-3-mini-4k-instruct\",\n    temperature=0.7,\n    max_length=1024,\n)\nmodel = ChatHuggingFace(llm=llm)"
             }
            ]
            ```
        
    
    #### Tab: OpenRouter

        👉 Read the [OpenRouter chat model integration docs](lc:oss/python/integrations/chat/openrouter)

        ```shell
        pip install -U "langchain-openrouter"
        ```

        
            ```lc-tabs
            [
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(\n    \"auto\",\n    model_provider=\"openrouter\",\n)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openrouter import ChatOpenRouter\n\nos.environ[\"OPENROUTER_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenRouter(model=\"auto\")"
             }
            ]
            ```


```python
if not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("OPENAI_API_KEY:\n")
```

```python
from langchain.chat_models import init_chat_model

model = init_chat_model(model="gpt-5.5", model_provider="openai", temperature=0)
```

```python
from langchain_tavily import TavilyMap
from langchain.agents import create_agent

tavily_map_tool = TavilyMap(max_depth=2, max_breadth=20, limit=30)

agent = create_agent(model, [tavily_map_tool])

user_input = "Map https://docs.tavily.com and list URLs that look like API reference pages."

stream = agent.stream_events({"messages": user_input}, version="v3")
for snapshot in stream.values:
    snapshot["messages"][-1].pretty_print()
```

---

## API reference

For detailed documentation of all Tavily Map API features and configurations head to the API reference: [docs.tavily.com/documentation/api-reference/endpoint/map](https://docs.tavily.com/documentation/api-reference/endpoint/map)
