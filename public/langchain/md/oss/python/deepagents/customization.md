#### Tab: OpenAI

        👉 Read the [OpenAI chat model integration docs](lc:oss/python/integrations/chat/openai)

        ```shell
        pip install -U "langchain[openai]"
        ```

        
            ```lc-tabs
            [
             {
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nagent = create_deep_agent(model=\"openai:gpt-5.5\")\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(model=\"openai:gpt-5.5\")\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import ChatOpenAI\nfrom deepagents import create_deep_agent\n\nos.environ[\"OPENAI_API_KEY\"] = \"sk-...\"\n\nmodel = ChatOpenAI(model=\"gpt-5.5\")\nagent = create_deep_agent(model=model)"
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
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nagent = create_deep_agent(model=\"anthropic:claude-sonnet-4-6\")\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = init_chat_model(model=\"claude-sonnet-4-6\")\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_anthropic import ChatAnthropic\nfrom deepagents import create_deep_agent\n\nos.environ[\"ANTHROPIC_API_KEY\"] = \"sk-...\"\n\nmodel = ChatAnthropic(model=\"claude-sonnet-4-6\")\nagent = create_deep_agent(model=model)"
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
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nagent = create_deep_agent(model=\"azure_openai:gpt-5.5\")\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = init_chat_model(\n    model=\"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_openai import AzureChatOpenAI\nfrom deepagents import create_deep_agent\n\nos.environ[\"AZURE_OPENAI_API_KEY\"] = \"...\"\nos.environ[\"AZURE_OPENAI_ENDPOINT\"] = \"...\"\nos.environ[\"OPENAI_API_VERSION\"] = \"2025-03-01-preview\"\n\nmodel = AzureChatOpenAI(\n    model=\"gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)\nagent = create_deep_agent(model=model)"
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
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nagent = create_deep_agent(model=\"google_genai:gemini-3.6-flash\")\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = init_chat_model(model=\"google_genai:gemini-3.6-flash\")\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_google_genai import ChatGoogleGenerativeAI\nfrom deepagents import create_deep_agent\n\nos.environ[\"GOOGLE_API_KEY\"] = \"...\"\n\nmodel = ChatGoogleGenerativeAI(model=\"gemini-3.6-flash\")\nagent = create_deep_agent(model=model)"
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
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nagent = create_deep_agent(\n    model=\"anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n)\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nmodel = init_chat_model(\n    model=\"anthropic.claude-sonnet-4-6\",\n    model_provider=\"bedrock_converse\",\n)\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_aws import ChatBedrock\nfrom deepagents import create_deep_agent\n\n# Follow the steps here to configure your credentials:\n# https://docs.aws.amazon.com/bedrock/latest/userguide/getting-started.html\n\nmodel = ChatBedrock(model=\"anthropic.claude-sonnet-4-6\")\nagent = create_deep_agent(model=model)"
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
              "label": "default parameters",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nagent = create_deep_agent(\n    model=\"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.7,\n    max_tokens=1024,\n)\n# this calls init_chat_model for the specified model with default parameters\n# to use specific model parameters, use init_chat_model directly"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from langchain.chat_models import init_chat_model\nfrom deepagents import create_deep_agent\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nmodel = init_chat_model(\n    model=\"microsoft/Phi-3-mini-4k-instruct\",\n    model_provider=\"huggingface\",\n    temperature=0.7,\n    max_tokens=1024,\n)\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "Model Class",
              "lang": "python",
              "code": "from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint\nfrom deepagents import create_deep_agent\n\nos.environ[\"HUGGINGFACEHUB_API_TOKEN\"] = \"hf_...\"\n\nllm = HuggingFaceEndpoint(\n    repo_id=\"microsoft/Phi-3-mini-4k-instruct\",\n    temperature=0.7,\n    max_length=1024,\n)\nmodel = ChatHuggingFace(llm=llm)\nagent = create_deep_agent(model=model)"
             }
            ]
            ```
        
    
    #### Tab: Other

        Pass any [supported model string](lc:oss/python/deepagents/models#supported-models), or an initialized model instance:

        
            ```lc-tabs
            [
             {
              "label": "model string",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(model=\"provider:model-name\")"
             },
             {
              "label": "init_chat_model",
              "lang": "python",
              "code": "from deepagents import create_deep_agent\nfrom langchain.chat_models import init_chat_model\n\nmodel = init_chat_model(\"provider:model-name\")\nagent = create_deep_agent(model=model)"
             },
             {
              "label": "model class",
              "lang": "python",
              "code": "from langchain_<provider> import Chat<Provider>\nfrom deepagents import create_deep_agent\n\nmodel = Chat<Provider>(model=\"model-name\")\nagent = create_deep_agent(model=model)"
             }
            ]
            ```

        
    


  


#### Tab: LangSmith

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install \"langsmith[sandbox]\""
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add \"langsmith[sandbox]\""
             }
            ]
            ```
        

        ```python
        from deepagents import create_deep_agent
        from deepagents.backends import LangSmithSandbox
        from langchain_anthropic import ChatAnthropic
        from langsmith.sandbox import SandboxClient

        client = SandboxClient()
        ls_sandbox = client.create_sandbox()
        backend = LangSmithSandbox(sandbox=ls_sandbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )
        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            client.delete_sandbox(ls_sandbox.name)
        ```

    
    #### Tab: Daytona

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install langchain-daytona"
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add langchain-daytona"
             }
            ]
            ```
        

        ```python
        from daytona import Daytona
        from deepagents import create_deep_agent
        from langchain_anthropic import ChatAnthropic
        from langchain_daytona import DaytonaSandbox

        sandbox = Daytona().create()
        backend = DaytonaSandbox(sandbox=sandbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )

        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            sandbox.stop()
        ```

    
    #### Tab: E2B

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install langchain-e2b"
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add langchain-e2b"
             }
            ]
            ```
        

        ```python
        from e2b import Sandbox
        from deepagents import create_deep_agent
        from langchain_anthropic import ChatAnthropic
        from langchain_e2b import E2BSandbox

        e2b_sandbox = Sandbox.create()
        backend = E2BSandbox(sandbox=e2b_sandbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )

        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            e2b_sandbox.kill()
        ```

    
    #### Tab: Modal

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install langchain-modal"
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add langchain-modal"
             }
            ]
            ```
        

        ```python

        from deepagents import create_deep_agent
        from langchain_anthropic import ChatAnthropic
        from langchain_modal import ModalSandbox

        app = modal.App.lookup("your-app")
        modal_sandbox = modal.Sandbox.create(app=app)
        backend = ModalSandbox(sandbox=modal_sandbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )
        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            modal_sandbox.terminate()
        ```

    
    #### Tab: Runloop

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install langchain-runloop"
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add langchain-runloop"
             }
            ]
            ```
        

        ```python

        from deepagents import create_deep_agent
        from langchain_anthropic import ChatAnthropic
        from langchain_runloop import RunloopSandbox
        from runloop_api_client import RunloopSDK

        client = RunloopSDK(bearer_token=os.environ["RUNLOOP_API_KEY"])

        devbox = client.devbox.create()
        backend = RunloopSandbox(devbox=devbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )

        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            devbox.shutdown()
        ```

    
    #### Tab: Vercel

        
            ```lc-tabs
            [
             {
              "label": "pip",
              "lang": "bash",
              "code": "pip install langchain-vercel-sandbox"
             },
             {
              "label": "uv",
              "lang": "bash",
              "code": "uv add langchain-vercel-sandbox"
             }
            ]
            ```
        

        ```python
        from deepagents import create_deep_agent
        from langchain_anthropic import ChatAnthropic
        from langchain_vercel_sandbox import VercelSandbox
        from vercel.sandbox import Sandbox

        sandbox = Sandbox.create(runtime="python3.13")
        backend = VercelSandbox(sandbox=sandbox)

        agent = create_deep_agent(
            model=ChatAnthropic(model="claude-sonnet-4-6"),
            system_prompt="You are a Python coding assistant with sandbox access.",
            backend=backend,
        )

        try:
            result = agent.invoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": "Create a small Python package and run pytest",
                        }
                    ]
                }
            )
        finally:
            sandbox.stop()
        ```


    


Build the harness around your goal. `create_deep_agent` gives you a production-ready foundation: connect it to your data, shape its behavior, and add the capabilities your use case needs.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=\"You are a helpful assistant.\",\n    tools=[search, fetch_url],\n    memory=[\"./AGENTS.md\"],\n    skills=[\"./skills/\"],\n)"
 }
]
```


| Parameter | What it does |
|---|---|
| [`model=`](#model) | Which model to use |
| [`system_prompt=`](#system-prompt) | Custom instructions for the agent |
| [`tools=`](#tools) | Domain tools the agent can call |
| [`memory=`](#memory) | AGENTS.md files loaded at startup |
| [`skills=`](#skills) | Skills directory for on-demand knowledge |
| [`backend=`](#backends) | Filesystem backend (StateBackend by default) |
| [`permissions=`](lc:oss/python/deepagents/permissions) | Path-level access control for the filesystem |
| [`subagents=`](#subagents) | Custom subagents for delegated tasks |
| [`middleware=`](#middleware) | Extra middleware merged into the [Deep Agents stack](#deep-agents-stack); an instance whose `.name` matches a built-in entry replaces it in place, anything else lands after the last core middleware entry and before the profile, prompt-caching, and memory |
| [`interrupt_on=`](#human-in-the-loop) | Pause before tool calls for human approval |
| [`response_format=`](#structured-output) | Structured output schema |
| [`state_schema=`](lc:oss/python/deepagents/context-engineering#custom-state-schema) | Custom graph state schema |
| [`context_schema=`](lc:oss/python/deepagents/context-engineering#runtime-context) | Per-run runtime context schema (user IDs, API keys, feature flags) |
| [profiles](#profiles) | Per-model defaults as a reusable bundle |

### Full function signature


```python
create_deep_agent(
    model: str | BaseChatModel | None = None,
    tools: Sequence[BaseTool | Callable | dict[str, Any]] | None = None,
    *,
    system_prompt: str | SystemMessage | None = None,
    middleware: Sequence[AgentMiddleware[StateT_co, ContextT]] = (),
    subagents: Sequence[SubAgent | CompiledSubAgent | AsyncSubAgent] | None = None,
    skills: list[str] | None = None,
    memory: list[str] | None = None,
    permissions: list[FilesystemPermission] | None = None,
    backend: BackendProtocol | None = None,
    interrupt_on: dict[str, bool | InterruptOnConfig] | None = None,
    response_format: ResponseFormat[ResponseT] | type[ResponseT] | dict[str, Any] | None = None,
    state_schema: type[DeepAgentState] | None = None,
    context_schema: type[ContextT] | None = None,
    checkpointer: Checkpointer | None = None,
    store: BaseStore | None = None,
    debug: bool = False,
    name: str | None = None,
    cache: BaseCache | None = None
) -> CompiledStateGraph[AgentState[ResponseT], ContextT, InputAgentState, OutputAgentState[ResponseT]]
```


For the full parameter list, see the `create_deep_agent` API reference. To compose a fully custom harness from scratch, see [Configure the harness](lc:oss/python/langchain/agents#configure-the-harness) or follow the step-by-step [Build a deep agent from scratch](lc:oss/python/langchain/deep-agent-from-scratch) guide.


> [!TIP]
>
> As you add tools, subagents, and backends, use [LangSmith](https://smith.langchain.com) to trace how each piece behaves together. Follow the [observability quickstart](lc:langsmith/observability-quickstart) to get set up, and see [Going to production](lc:oss/python/deepagents/going-to-production) for deployment on LangSmith.
>
> We recommend you also set up [LangSmith Engine](lc:langsmith/engine), which monitors your traces, detects issues, and proposes fixes.


## Model

Pass a `model` string in `provider:model` format, or an initialized model instance. See [supported models](lc:oss/python/deepagents/models#supported-models) for all providers and [suggested models](lc:oss/python/deepagents/models#suggested-models) for tested recommendations.


> [!TIP]
>
> Use the `provider:model` format (for example `openai:gpt-5.5`) to quickly switch between models.


> [!TIP]
>
> Chat models automatically retry transient API failures (with exponential backoff). For defaults, limits, and code samples for tuning `max_retries` / `timeout` live on the LangChain [Models](lc:oss/python/langchain/models#connection-resilience) page.


## Tools

In addition to [built-in tools](lc:oss/python/deepagents/overview#execution-environment) for file management and subagent spawning, you can provide custom tools:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[internet_search],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from typing import Literal\nfrom tavily import TavilyClient\nfrom deepagents import create_deep_agent\n\ntavily_client = TavilyClient(api_key=os.environ[\"TAVILY_API_KEY\"])\n\n\ndef internet_search(\n    query: str,\n    max_results: int = 5,\n    topic: Literal[\"general\", \"news\", \"finance\"] = \"general\",\n    include_raw_content: bool = False,\n):\n    \"\"\"Run a web search\"\"\"\n    return tavily_client.search(\n        query,\n        max_results=max_results,\n        include_raw_content=include_raw_content,\n        topic=topic,\n    )\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[internet_search],\n)"
 }
]
```


### MCP tools


> [!TIP]
>
> Deep Agents fully support [Model Context Protocol (MCP)](lc:oss/python/langchain/mcp) tools. You can load tools from any MCP server—databases, APIs, file systems, and more—and pass them directly to `create_deep_agent`.


Install `langchain-mcp-adapters` to connect to MCP servers:

```bash
pip install langchain-mcp-adapters
```


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"google_genai:gemini-3.6-flash\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"openai:gpt-5.5\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"anthropic:claude-sonnet-4-6\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"openrouter:z-ai/glm-5.2\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"baseten:zai-org/GLM-5.2\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain_mcp_adapters.client import MultiServerMCPClient\nfrom deepagents import create_deep_agent\n\n\nasync def main():\n    async with MultiServerMCPClient(\n        {\n            \"my_server\": {\n                \"transport\": \"http\",\n                \"url\": \"http://localhost:8000/mcp\",\n            }\n        }\n    ) as client:\n        tools = await client.get_tools()\n\n        agent = create_deep_agent(\n            model=\"ollama:north-mini-code-1.0\",\n            tools=tools,\n        )\n\n        result = await agent.ainvoke(\n            {\"messages\": [{\"role\": \"user\", \"content\": \"Use the MCP server to help me.\"}]},\n            config={\"configurable\": {\"thread_id\": \"1\"}},\n        )\n\n\nasyncio.run(main())"
 }
]
```


For detailed configuration options including stdio servers, OAuth authentication, tool filtering, and stateful sessions, see the full [MCP guide](lc:oss/python/langchain/mcp).

## System prompt

Pass `system_prompt=` to give the agent your own instructions:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=research_instructions,\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nresearch_instructions = \"\"\"\\\nYou are an expert researcher. Your job is to conduct \\\nthorough research, and then write a polished report. \\\n\"\"\"\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=research_instructions,\n)"
 }
]
```


> [!NOTE]
>
> Besides a string, the main agent also accepts a `SystemMessage` with structured [content blocks](lc:oss/python/langchain/messages#standard-content-blocks); Deep Agents preserve those blocks ([subagent](lc:oss/python/deepagents/subagents) dictionary specs remain strings).


    ### Subagent prompts

        Declarative [subagents](lc:oss/python/deepagents/subagents) resolve profile overlays against their own model, then apply the resolved profile's `base_system_prompt` / `system_prompt_suffix` to the subagent's authored `system_prompt`. A profile that ships only a `system_prompt_suffix` (the common case for built-in Anthropic / OpenAI profiles) appends to the authored prompt. A profile that sets `base_system_prompt` replaces it outright.
    
    ### General-purpose subagent prompt

        The auto-added [general-purpose subagent](lc:oss/python/deepagents/subagents#the-general-purpose-subagent) resolves its base prompt as **`general_purpose_subagent.system_prompt` (if set) -> `HarnessProfile.base_system_prompt` (if set) -> SDK general-purpose default**, with the profile suffix layered on top. When both override fields are set, the general-purpose-specific one wins so a caller tuning both fields never sees their GP override silently dropped:

        
```python
from deepagents import (
    GeneralPurposeSubagentProfile,
    HarnessProfile,
    register_harness_profile,
)

register_harness_profile(
    "anthropic",
    HarnessProfile(
        base_system_prompt="You are ACME's support orchestrator.",  # main agent
        general_purpose_subagent=GeneralPurposeSubagentProfile(
            system_prompt="You are a research subagent. Cite sources.",  # GP subagent
        ),
        system_prompt_suffix="Always think step by step.",
    ),
)
```


        | Stack | Final system prompt |
        | ----- | ------------------- |
        | Main agent | `"You are ACME's support orchestrator." + SUFFIX` |
        | GP subagent | `"You are a research subagent. Cite sources." + SUFFIX` |
    

## Middleware

Deep Agents support any [middleware](lc:oss/python/langchain/middleware/overview), including the built-in middleware listed below, prebuilt middleware from LangChain, provider-specific middleware, and custom middleware you write yourself.

Pass middleware to the `middleware` argument of `create_deep_agent`. Each instance is merged into the [Deep Agents stack](#deep-agents-stack) by matching its `.name` against built-in entries already in the stack: a match replaces that instance in place, and anything that does not match is inserted after `PatchToolCallsMiddleware`. See [Override a default middleware instance](#override-a-default-middleware-instance).


### Deep Agents stack

`create_deep_agent` builds middleware in a fixed order. The [bare stack](#bare-stack) is what you get with only a model. The [full stack](#full-stack) is the complete assembly order, including slots that appear only when you pass optional arguments or when the resolved [harness profile](lc:oss/python/deepagents/profiles) contributes them.


#### Bare stack

With only a `model` (no other optional arguments), the main agent typically includes:

1. `FilesystemMiddleware`
2. `SubAgentMiddleware` (because the [general-purpose subagent](lc:oss/python/deepagents/subagents#default-subagent) is auto-added unless a harness profile disables it)
3. `SummarizationMiddleware`
4. `PatchToolCallsMiddleware`
5. **Prompt caching** middleware (always registered; each entry no-ops on models it does not support)
6. **Harness profile extras** and **excluded-tool filtering**, if the resolved model profile defines them


#### Full stack

From first to last:


1. `SkillsMiddleware`: Only when you pass `skills`. Injected **before** filesystem middleware so skill metadata is available before file tools run.
2. `FilesystemMiddleware`: Handles file system operations such as reading, writing, and navigating directories. When you pass `permissions`, filesystem permissions enforcement is included here so it can evaluate every tool the agent might call.
3. `SubAgentMiddleware`: Only when at least one synchronous subagent is available. Spawns and coordinates subagents for delegating tasks. Included in the [bare stack](#bare-stack) because the general-purpose subagent is auto-added by default; omit it by disabling that subagent and passing no synchronous `subagents`. See [Running without subagents](lc:oss/python/deepagents/subagents#running-without-subagents).
4. `SummarizationMiddleware`: Condenses message history to stay within context limits when conversations grow long (via `create_summarization_middleware`).
5. `PatchToolCallsMiddleware`: Repairs dangling tool calls in message history when a run resumes after an interruption or receives malformed tool-call arguments. Runs **before** Anthropic prompt caching and the tail stack below.
6. `AsyncSubAgentMiddleware`: Only when you configure async subagents.
7. **Your middleware argument**: Optional middleware you pass as the `middleware` argument is merged after Patch but before the rest of the stack. An instance whose `.name` matches one of the built-in entries above replaces that instance in place instead of duplicating it; anything else lands here. See [Override a default middleware instance](#override-a-default-middleware-instance).
8. **Harness profile extras**: Provider-specific middleware from the resolved model profile, if any.
9. **Excluded-tool filtering**: When the harness profile lists excluded tools, middleware removes those tools from the agent.
10. **Prompt caching** (`AnthropicPromptCachingMiddleware` and `BedrockPromptCachingMiddleware`): Both are always registered and run **after** Patch and after your middleware so the cached prefix matches what is actually sent to the model. Each no-ops on models it does not support (`unsupported_model_behavior="ignore"`), so the Anthropic middleware applies on Anthropic models and the Bedrock middleware on AWS Bedrock models with cache support.
11. `MemoryMiddleware`: Only when you pass `memory`.

    

> [!NOTE]
>
> `MemoryMiddleware` is placed **after** profile extras and the prompt caching middleware so updates to injected memory are less likely to invalidate the cache prefix. The same ordering concern is called out in the `create_deep_agent` implementation comments.


12. `HumanInTheLoopMiddleware`: Only when you pass `interrupt_on`. Pauses for human approval or input at configured tool calls.


### Synchronous subagent stack


The built-in **general-purpose** subagent and each declarative synchronous `SubAgent` graph use a stack that `create_deep_agent` builds in code. It matches the main agent in broad shape (filesystem, summarization, Patch, profile extras, Anthropic and Bedrock caching, optional permissions) but differs in two ways:

- **Skills run after** `PatchToolCallsMiddleware` on these inner agents (on the main agent, skills run **before** filesystem middleware when `skills` is set).
- There is **no** `SubAgentMiddleware` inside a subagent graph (only the parent agent exposes the `task` tool).

When a declarative subagent sets `interrupt_on`, that value is forwarded to `create_agent` for the subagent, which wires up human-in-the-loop handling for the configured tool calls.


### Prebuilt middleware

LangChain exposes additional prebuilt middleware that let you add-on various features, such as retries, fallbacks, or PII detection. See [Prebuilt middleware](lc:oss/python/langchain/middleware/built-in) for more.


The `deepagents` library also exposes `create_summarization_tool_middleware`, enabling agents to trigger summarization at opportune times—such as between tasks—instead of at fixed token intervals. For more detail, see [Summarization](lc:oss/python/deepagents/context-engineering#summarization).


### Provider-specific middleware

For provider-specific middleware that is optimized for specific LLM providers, see [Middleware integrations](lc:oss/python/integrations/middleware/index).

### Custom middleware

You can provide additional middleware to extend functionality, add tools, or implement custom hooks:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.agents.middleware import wrap_tool_call\nfrom langchain.tools import tool\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef get_weather(city: str) -> str:\n    \"\"\"Get the weather in a city.\"\"\"\n    return f\"The weather in {city} is sunny.\"\n\n\ncall_count = [0]  # Use list to allow modification in nested function\n\n\n@wrap_tool_call\ndef log_tool_calls(request, handler):\n    \"\"\"Intercept and log every tool call - demonstrates cross-cutting concern.\"\"\"\n    call_count[0] += 1\n    tool_name = request.name if hasattr(request, \"name\") else str(request)\n\n    print(f\"[Middleware] Tool call #{call_count[0]}: {tool_name}\")\n    print(f\"[Middleware] Arguments: {request.args if hasattr(request, 'args') else 'N/A'}\")\n\n    # Execute the tool call\n    result = handler(request)\n\n    # Log the result\n    print(f\"[Middleware] Tool call #{call_count[0]} completed\")\n\n    return result\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[get_weather],\n    middleware=[log_tool_calls],\n)"
 }
]
```


> [!WARNING]
>
> **Do not mutate attributes after initialization**
>
> If you need to track values across hook invocations (for example, counters or accumulated data), use graph state.
> Graph state is scoped to a thread by design, so updates are safe under concurrency.
>
> **Do this:**
>
>
> ```python
> from langchain.agents.middleware import AgentMiddleware
>
> class CustomMiddleware(AgentMiddleware):
>     def __init__(self):
>         pass
>
>     def before_agent(self, state, runtime):
>         return {"x": state.get("x", 0) + 1}  # Update graph state instead
> ```
>
>
>
> Do **not** do this:
>
>
> ```python
> class CustomMiddlewareBad(AgentMiddleware):
>     def __init__(self):
>         self.x = 1
>
>     def before_agent(self, state, runtime):
>         self.x += 1  # Mutation causes race conditions
> ```
>
>
>
> Mutation in place, such as modifying `self.x` in `before_agent` or changing other shared values in hooks, can lead to subtle bugs and race conditions because many operations run concurrently (subagents, parallel tools, and parallel invocations on different threads).
>
> For full details on extending state with custom properties, see [Custom middleware - Custom state schema](lc:oss/python/langchain/middleware/custom#custom-state-schema).
>
> If you must use mutation in custom middleware, consider what happens when subagents, parallel tools, or concurrent agent invocations run at the same time.


### Override a default middleware instance


> [!NOTE]
>
> Overriding a default middleware by matching `.name` requires `deepagents>=0.7`.


Pass a middleware instance whose `.name` matches an entry in the [Deep Agents stack](#deep-agents-stack), such as `SummarizationMiddleware`, to replace that built-in instance in place instead of appending a duplicate. Any middleware you pass whose `.name` does **not** match a built-in entry is not replaced, it lands after the last core middleware entry and before the profile, prompt-caching, and memory. See [Full stack](#full-stack) for the complete ordering.

```python
from deepagents import create_deep_agent
from deepagents.backends import StateBackend
from deepagents.middleware import SummarizationMiddleware

backend = StateBackend()
model = "openai:gpt-5.5"

custom_summarization = SummarizationMiddleware(
    model=model,
    backend=backend,
    summary_prompt="Your custom summary prompt here.",
)

agent = create_deep_agent(
    model=model,
    middleware=[custom_summarization],  # replaces the default SummarizationMiddleware
)
```


> [!NOTE]
>
> An override **replaces** the default middleware instance, it is not merged with it. That means your replacement must be fully configured with any settings it needs. This is especially important for `FilesystemMiddleware`: if you override it, you must pass the `backend` (and `permissions`, if applicable) directly to your custom instance, since it won't inherit the `backend=` and `permissions=` passed to `create_deep_agent()`. To restrict the available filesystem tools, pass a `tools` allowlist to your custom `FilesystemMiddleware` instance; see [Virtual filesystem access](lc:oss/python/deepagents/overview#virtual-filesystem-access) for the "Restricting filesystem tools" example.


The general-purpose subagent, which Deep Agents adds automatically, inherits overrides for its default middleware from the main agent, without carrying over middleware that's specific to the main agent.

Declarative subagents defined via `subagents=` do not inherit the main agent's middleware customization. Pass the override directly in that subagent's own [`middleware`](lc:oss/python/deepagents/subagents#subagent-dictionary-based) field to apply it there; that field is matched against the [synchronous subagent stack](#synchronous-subagent-stack), the same way `middleware=` is matched against the main agent's.

#### Examples

    ### Adjust when summarization triggers

        Override `SummarizationMiddleware` with custom `trigger` and `keep` thresholds to compact conversation history earlier or later than the default, and control how many recent messages survive each compaction.

        ```python
        from deepagents import create_deep_agent
        from deepagents.backends import StateBackend
        from deepagents.middleware import SummarizationMiddleware

        backend = StateBackend()
        model = "anthropic:claude-sonnet-4-6"

        agent = create_deep_agent(
            model=model,
            middleware=[
                SummarizationMiddleware(
                    model=model,
                    backend=backend,
                    trigger=("tokens", 100000),  # summarize once the conversation exceeds 100k tokens
                    keep=("messages", 20),  # keep the most recent 20 messages verbatim
                ),
            ],
        )
        ```

        `trigger` also accepts `("fraction", ...)` for a percentage of the model's context window, and a list of thresholds combines them with OR semantics. See the `SummarizationMiddleware` reference for the full set of options.
    
    ### Update the prompt cache TTL

        Override `AnthropicPromptCachingMiddleware` to extend the cache lifetime beyond the default `5m` TTL, useful for agents with long gaps between turns. See [Prompt caching](lc:oss/python/deepagents/overview#prompt-caching) for how caching is applied by default.

        ```python
        from deepagents import create_deep_agent
        from langchain_anthropic.middleware import AnthropicPromptCachingMiddleware

        agent = create_deep_agent(
            model="anthropic:claude-sonnet-4-6",
            middleware=[
                AnthropicPromptCachingMiddleware(ttl="1h"),  # replaces the default 5m TTL
            ],
        )
        ```
    
    ### Restrict the enabled filesystem tools

        

> [!NOTE]
>
> The `tools` allowlist on `FilesystemMiddleware` requires `deepagents>=0.7`.


        Override `FilesystemMiddleware` with a `tools` allowlist to expose only a subset of the filesystem tools to the model, instead of the full default set.
        ```python
        from deepagents import create_deep_agent
        from deepagents.backends import StateBackend
        from deepagents.middleware import FilesystemMiddleware

        backend = StateBackend()

        # Read-only agent: write_file, edit_file, delete, and execute are never shown
        agent = create_deep_agent(
            model="anthropic:claude-sonnet-4-6",
            backend=backend,
            middleware=[
                FilesystemMiddleware(backend=backend, tools=["read_file", "ls", "glob", "grep"]),
            ],
        )
        ```

        See [Restricting filesystem tools](lc:oss/python/deepagents/overview#virtual-filesystem-access) for more details.
    


### Interpreters

Use [interpreters](lc:oss/python/deepagents/interpreters) to add an `eval` tool that runs JavaScript in a scoped QuickJS runtime. Interpreters are useful when the agent needs to compose tools programmatically, batch work, handle errors in code, or transform structured data without a full shell environment.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langchain_quickjs import CodeInterpreterMiddleware\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    middleware=[CodeInterpreterMiddleware()],\n)"
 }
]
```


For setup, programmatic tool calling, subagent orchestration, and limits, see [Interpreters](lc:oss/python/deepagents/interpreters).

## Subagents

To isolate detailed work and avoid context bloat, use subagents:


```python

from typing import Literal

from deepagents import create_deep_agent
from tavily import TavilyClient

tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def internet_search(
    query: str,
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = False,
):
    """Run a web search"""
    return tavily_client.search(
        query,
        max_results=max_results,
        include_raw_content=include_raw_content,
        topic=topic,
    )

research_subagent = {
    "name": "research-agent",
    "description": "Used to research more in depth questions",
    "system_prompt": "You are a great researcher",
    "tools": [internet_search],
    "model": "openai:gpt-5.5",  # Optional override, defaults to main agent model
}
subagents = [research_subagent]

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    subagents=subagents,
)
```


For more information, see [Subagents](lc:oss/python/deepagents/subagents).

{/* TODO(https://github.com/langchain-ai/docs/pull/2368/) ## Structured response format */}

{/* ## Context - You can persist agent state between runs to store information like user IDs. */}

## Backends

Tools for a deep agent can make use of virtual file systems to store, access, and edit files. By default, deep agents use a `StateBackend`.

If you are using [skills](#skills) or [memory](#memory), you must add the expected skill or memory files to the backend before creating the agent.

    #### Tab: StateBackend

        A thread-scoped filesystem backend stored in `langgraph` state.

        Files persist across turns within a thread (via your checkpointer) and are not shared across threads.

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"google_genai:gemini-3.6-flash\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"openai:gpt-5.5\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"anthropic:claude-sonnet-4-6\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"openrouter:z-ai/glm-5.2\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"fireworks:accounts/fireworks/models/glm-5p2\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"baseten:zai-org/GLM-5.2\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\n\n# By default we provide a StateBackend\nagent = create_deep_agent(model=\"ollama:north-mini-code-1.0\")\n\n# Under the hood, it looks like\nagent2 = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StateBackend(),\n)"
 }
]
```


    
    #### Tab: FilesystemBackend

        The local machine's filesystem.

        

> [!WARNING]
>
> This backend grants agents direct filesystem read/write access.
>             Use with caution and only in appropriate environments.
>             For more information, see [`FilesystemBackend`](lc:oss/python/deepagents/backends#filesystembackend-local-disk).


        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=FilesystemBackend(root_dir=\".\", virtual_mode=True),\n)"
 }
]
```


        

> [!TIP]
>
> Wrap `FilesystemBackend` in a `CompositeBackend` to prevent internal agent data (offloaded tool results, conversation history) from being written to disk alongside your project files. See the [recommended pattern](lc:oss/python/deepagents/backends#filesystembackend-local-disk).


    
    #### Tab: LocalShellBackend

        A filesystem with shell execution directly on the host. Provides filesystem tools plus the `execute` tool for running commands.

        

> [!WARNING]
>
> This backend grants agents direct filesystem read/write access **and** unrestricted shell execution on your host.
>             Use with extreme caution and only in appropriate environments.
>             For more information, see [`LocalShellBackend`](lc:oss/python/deepagents/backends#localshellbackend-local-shell).


        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import LocalShellBackend\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=LocalShellBackend(root_dir=\".\", virtual_mode=True, env={\"PATH\": \"/usr/bin:/bin\"}),\n)"
 }
]
```


    
    #### Tab: StoreBackend

        A filesystem that provides long-term storage that is _persisted across threads_.

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=StoreBackend(\n        namespace=lambda rt: (rt.server_info.user.identity,),\n    ),\n    store=InMemoryStore(),  # Good for local dev; omit for LangSmith Deployment\n)"
 }
]
```


        

> [!NOTE]
>
> When deploying to [LangSmith Deployment](lc:langsmith/deployment), omit the `store` parameter. The platform automatically provisions a store for your agent.


        

> [!TIP]
>
> The `namespace` parameter controls data isolation. For multi-user deployments, always set a [namespace factory](lc:oss/python/deepagents/backends#namespace-factories) to isolate data per user or tenant.


    
    #### Tab: ContextHubBackend

        Durable filesystem storage in a LangSmith Hub repo.

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import ContextHubBackend\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=ContextHubBackend(\"my-agent\"),\n)"
 }
]
```


        For more details, see [`ContextHubBackend`](lc:oss/python/deepagents/backends#contexthubbackend).
    
    #### Tab: CompositeBackend

        A flexible backend where you can specify different routes in the filesystem to point towards different backends.

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import CompositeBackend, StateBackend, StoreBackend\nfrom langgraph.store.memory import InMemoryStore\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=CompositeBackend(\n        default=StateBackend(),\n        routes={\n            \"/memories/\": StoreBackend(namespace=lambda _rt: (\"memories\",)),\n        },\n    ),\n    store=InMemoryStore(),  # Store passed to create_deep_agent, not backend\n)"
 }
]
```


    

For more information, see [Backends](lc:oss/python/deepagents/backends).

### Sandboxes

Sandboxes are specialized [backends](lc:oss/python/deepagents/backends) that run agent code in an isolated environment with their own filesystem and an `execute` tool for shell commands.
Use a sandbox backend when you want your deep agent to write files, install dependencies, and run commands without changing anything on your local machine.

You configure sandboxes by passing a sandbox backend to `backend` when creating your deep agent:


For more information, see [Sandboxes](lc:oss/python/deepagents/sandboxes).

## Human-in-the-loop

Some tool operations may be sensitive and require human approval before execution.
You can configure the approval for each tool:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import MemorySaver\n\n\n@tool\ndef remove_file(path: str) -> str:\n    \"\"\"Delete a file from the filesystem.\"\"\"\n    return f\"Deleted {path}\"\n\n\n@tool\ndef fetch_file(path: str) -> str:\n    \"\"\"Read a file from the filesystem.\"\"\"\n    return f\"Contents of {path}\"\n\n\n@tool\ndef notify_email(to: str, subject: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent email to {to}\"\n\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    tools=[remove_file, fetch_file, notify_email],\n    interrupt_on={\n        \"remove_file\": True,  # Default: approve, edit, reject, respond\n        \"fetch_file\": False,  # No interrupts needed\n        \"notify_email\": {\"allowed_decisions\": [\"approve\", \"reject\"]},  # No editing\n    },\n    checkpointer=checkpointer,  # Required!\n)"
 }
]
```


You can configure interrupt for agents and subagents on tool call as well as from within tool calls.
For more information, see [Human-in-the-loop](lc:oss/python/deepagents/human-in-the-loop).

## Skills

You can use [skills](lc:oss/python/deepagents/overview) to provide your deep agent with new capabilities and expertise.
While [tools](lc:oss/python/deepagents/customization#tools) tend to cover lower level functionality like native file system actions, skills can contain detailed instructions on how to complete tasks, reference info, and other assets, such as templates.
These files are only loaded by the agent when the agent has determined that the skill is useful for the current prompt.
This progressive disclosure reduces the amount of tokens and context the agent has to consider upon startup.

For example skills, see [Deep Agents example skills](https://github.com/langchain-ai/deepagentsjs/tree/main/examples/skills).

To add skills to your deep agent, pass them as an argument to `create_deep_agent`:


<!-- Inlined Snippet: skills-usage-state-py.mdx -->

    ```lc-tabs
    [
     {
      "label": "Google",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "OpenAI",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "Anthropic",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "OpenRouter",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "Fireworks",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "Baseten",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     },
     {
      "label": "Ollama",
      "lang": "python",
      "code": "from urllib.request import urlopen\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StateBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\ncheckpointer = MemorySaver()\nbackend = StateBackend()\n\nskill_url = \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md\"\nwith urlopen(skill_url) as response:\n    skill_content = response.read().decode('utf-8')\n\nskills_files = {\n    \"/skills/langgraph-docs/SKILL.md\": create_file_data(skill_content),\n}\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=backend,\n    skills=[\"/skills/\"],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [{\"role\": \"user\", \"content\": \"What is langgraph?\"}],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": skills_files,\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
     }
    ]
    ```

<!-- Inlined Snippet: skills-usage-store-py.mdx -->
```python
from urllib.request import urlopen
from deepagents import create_deep_agent
from deepagents.backends import StoreBackend
from deepagents.backends.utils import create_file_data
from langgraph.store.memory import InMemoryStore

store = InMemoryStore()
backend = StoreBackend(namespace=lambda _rt: ("filesystem",))

skill_url = "https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/libs/cli/examples/skills/langgraph-docs/SKILL.md"
with urlopen(skill_url) as response:
    skill_content = response.read().decode('utf-8')

store.put(
    namespace=("filesystem",),
    key="/skills/langgraph-docs/SKILL.md",
    value=create_file_data(skill_content),
)

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    backend=backend,
    store=store,
    skills=["/skills/"],
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What is langgraph?"}]},
    config={"configurable": {"thread_id": "12345"}},
)
```

<!-- Inlined Snippet: skills-usage-filesystem-py.mdx -->
```python
from deepagents import create_deep_agent
from deepagents.backends.filesystem import FilesystemBackend
from langgraph.checkpoint.memory import MemorySaver

# Checkpointer is REQUIRED for human-in-the-loop
checkpointer = MemorySaver()
root_dir = "/Users/user/{project}"
backend = FilesystemBackend(root_dir=root_dir)

agent = create_deep_agent(
    model="google_genai:gemini-3.6-flash",
    backend=backend,
    skills=[str(Path(root_dir) / "skills")],
    interrupt_on={
        "write_file": True,
        "read_file": False,
        "edit_file": True,
    },
    checkpointer=checkpointer, # Required!
)

result = agent.invoke(
    {"messages": [{"role": "user", "content": "What is langgraph?"}]},
    config={"configurable": {"thread_id": "12345"}},
)
```

  #### Tab: StateBackend

    <SkillsUsageStatePy />
  
  #### Tab: StoreBackend

    <SkillsUsageStorePy />
  
  #### Tab: FilesystemBackend

    <SkillsUsageFilesystemPy />


## Memory

Use [`AGENTS.md` files](https://agents.md/) to provide extra context to your deep agent.


> [!TIP]
>
> To generate a repository wiki that coding agents discover through `AGENTS.md`, see [OpenWiki](lc:oss/openwiki/overview).


You can pass one or more file paths to the `memory` parameter when creating your deep agent:


    #### Tab: StateBackend

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.checkpoint.memory import MemorySaver\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    memory=[\n        \"/AGENTS.md\"\n    ],\n    checkpointer=checkpointer,\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        # Seed the default StateBackend's in-state filesystem (virtual paths must start with \"/\").\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"123456\"}},\n)"
 }
]
```

    
    #### Tab: StoreBackend

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from urllib.request import urlopen\n\nfrom deepagents import create_deep_agent\nfrom deepagents.backends import StoreBackend\nfrom deepagents.backends.utils import create_file_data\nfrom langgraph.store.memory import InMemoryStore\n\nwith urlopen(\n    \"https://raw.githubusercontent.com/langchain-ai/deepagents/refs/heads/main/examples/text-to-sql-agent/AGENTS.md\"\n) as response:\n    agents_md = response.read().decode(\"utf-8\")\n\n# Create the store and add the file to it\nstore = InMemoryStore()\nfile_data = create_file_data(agents_md)\nstore.put(\n    namespace=(\"filesystem\",),\n    key=\"/AGENTS.md\",\n    value=file_data,\n)\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=StoreBackend(namespace=lambda _rt: (\"filesystem\",)),\n    store=store,\n    memory=[\"/AGENTS.md\"],\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n        \"files\": {\"/AGENTS.md\": create_file_data(agents_md)},\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 }
]
```

    
    #### Tab: FilesystemBackend

        
```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom deepagents.backends import FilesystemBackend\nfrom langgraph.checkpoint.memory import MemorySaver\n\n# Checkpointer is REQUIRED for human-in-the-loop\ncheckpointer = MemorySaver()\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    backend=FilesystemBackend(root_dir=\"/Users/user/{project}\"),\n    memory=[\n        \"./AGENTS.md\"\n    ],\n    interrupt_on={\n        \"write_file\": True,  # Default: approve, edit, reject\n        \"read_file\": False,  # No interrupts needed\n        \"edit_file\": True,   # Default: approve, edit, reject\n    },\n    checkpointer=checkpointer,  # Required!\n)\n\nresult = agent.invoke(\n    {\n        \"messages\": [\n            {\n                \"role\": \"user\",\n                \"content\": \"Please tell me what's in your memory files.\",\n            }\n        ],\n    },\n    config={\"configurable\": {\"thread_id\": \"12345\"}},\n)"
 }
]
```

    


## Profiles

A [harness profile](lc:oss/python/deepagents/profiles#harness-profiles) is a reusable bundle of per-model configuration that `create_deep_agent` applies automatically when the matching model is selected. Profiles are the right tool when you want behaviour that follows the model—not the call site—such as a system prompt suffix tuned for Claude's instruction style, tool descriptions rewritten for GPT, or extra middleware that only makes sense with a specific provider.

A single profile can carry: a custom base system prompt (`base_system_prompt`), an appended suffix (`system_prompt_suffix`), tool description overrides, tools or middleware to exclude, additional middleware to inject, and edits to the auto-added general-purpose subagent.


```python
from deepagents import HarnessProfile, register_harness_profile

# Append a system-prompt suffix whenever gpt-5.5 is selected.
register_harness_profile(
    "openai:gpt-5.5",
    HarnessProfile(system_prompt_suffix="Respond in under 100 words."),
)
```


See [Profiles](lc:oss/python/deepagents/profiles) for registration keys, merge semantics, and plugin packaging. A narrower companion API, [provider profiles](lc:oss/python/deepagents/profiles#provider-profiles), packages model-construction arguments (API keys, timeouts, retry settings) for a provider.


## Structured output

Deep Agents support [structured output](lc:oss/python/langchain/structured-output).
You can set a desired structured output schema by passing it as the `response_format` argument to the call to `create_deep_agent()`.
When the model generates the structured data, it's captured, validated, and returned in the 'structured_response' key of the deep agent's state.


```python

from typing import Literal

from pydantic import BaseModel, Field
from tavily import TavilyClient

from deepagents import create_deep_agent

tavily_client = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

def internet_search(
    query: str,
    max_results: int = 5,
    topic: Literal["general", "news", "finance"] = "general",
    include_raw_content: bool = False,
):
    """Run a web search"""
    return tavily_client.search(
        query,
        max_results=max_results,
        include_raw_content=include_raw_content,
        topic=topic,
    )

class WeatherReport(BaseModel):
    """A structured weather report with current conditions and forecast."""
    location: str = Field(description="The location for this weather report")
    temperature: float = Field(description="Current temperature in Celsius")
    condition: str = Field(
        description="Current weather condition (e.g., sunny, cloudy, rainy)"
    )
    humidity: int = Field(description="Humidity percentage")
    wind_speed: float = Field(description="Wind speed in km/h")
    forecast: str = Field(description="Brief forecast for the next 24 hours")

agent = create_deep_agent(
    model=model,
    response_format=WeatherReport,
    tools=[internet_search],
)

result = agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": "What's the weather like in San Francisco?",
            }
        ]
    }
)

print(result["structured_response"])
# location='San Francisco, California' temperature=18.3 condition='Sunny' humidity=48 wind_speed=7.6 forecast='Pleasant sunny conditions expected to continue with temperatures around 64°F (18°C) during the day, dropping to around 52°F (11°C) at night. Clear skies with minimal precipitation expected.'
```


For more information and examples, see [response format](lc:oss/python/langchain/structured-output#response-format).

## Advanced


`create_deep_agent` pre-assembles a middleware stack on top of `create_agent`. To build a fully custom agent—choosing exactly which capabilities to include—see [Configure the harness](lc:oss/python/langchain/agents#configure-the-harness).
