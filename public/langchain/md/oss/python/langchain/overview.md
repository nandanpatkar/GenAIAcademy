**Agent = Model + Harness.** LangChain provides `create_agent`: a minimal, highly configurable harness. The harness is everything around the model loop: the prompt, the tools, and any middleware that shapes behavior. Start with the primitives and compose exactly what your use case needs. Supports [OpenAI, Anthropic, Google, and more](lc:oss/python/integrations/providers/overview).


> [!TIP]
>
> **LangChain vs. LangGraph vs. Deep Agents**
>
> Start with [Deep Agents](lc:oss/python/deepagents/overview) for a "batteries-included" agent with features like automatic context compression, a virtual filesystem, and subagent-spawning. Deep Agents are built on LangChain [agents](lc:oss/python/langchain/agents) which you can also use directly.
>
> Use [LangChain](lc:oss/python/langchain/agents) (`create_agent`) for a highly customizable harness, easily tailored to your use case and data.
>
> Use [LangGraph](lc:oss/python/langgraph/overview), our low-level orchestration framework, for advanced needs combining deterministic and agentic workflows.
>
> Use [LangSmith](lc:langsmith/observability) to trace, debug, and evaluate agents built with any of these frameworks. Follow the [tracing quickstart](lc:langsmith/trace-with-langchain) to get set up. We recommend you also set up [LangSmith Engine](lc:langsmith/engine) which monitors your traces, detects issues, and proposes fixes.


##  Create an agent

This example demonstrates how to create a simple LangChain agent with a custom tool:


    ```lc-tabs
    [
     {
      "label": "OpenAI",
      "lang": "python",
      "code": "# pip install -qU langchain \"langchain[openai]\"\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"openai:gpt-5.5\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Google Gemini",
      "lang": "python",
      "code": "# pip install -qU langchain \"langchain[google-genai]\"\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"google_genai:gemini-2.5-flash-lite\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Claude (Anthropic)",
      "lang": "python",
      "code": "# pip install -qU langchain \"langchain[anthropic]\"\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "OpenRouter",
      "lang": "python",
      "code": "# pip install -qU langchain langchain-openrouter\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"openrouter:anthropic/claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Fireworks",
      "lang": "python",
      "code": "# pip install -qU langchain langchain-fireworks\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"fireworks:accounts/fireworks/models/qwen3p5-397b-a17b\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Baseten",
      "lang": "python",
      "code": "# pip install -qU langchain langchain-baseten\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Ollama",
      "lang": "python",
      "code": "# pip install -qU langchain langchain-ollama\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"ollama:devstral-2\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "Azure",
      "lang": "python",
      "code": "# pip install -qU langchain \"langchain[openai]\"\n\nfrom langchain.agents import create_agent\nfrom langchain.chat_models import init_chat_model\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nmodel = init_chat_model(\n    \"azure_openai:gpt-5.5\",\n    azure_deployment=os.environ[\"AZURE_OPENAI_DEPLOYMENT_NAME\"],\n)\nagent = create_agent(\n    model=model,\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "AWS Bedrock",
      "lang": "python",
      "code": "# pip install -qU langchain langchain-aws\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\n# US cross-region inference profile; use global.anthropic.claude-sonnet-4-6 for worldwide routing.\nagent = create_agent(\n    model=\"bedrock_converse:us.anthropic.claude-sonnet-4-6\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     },
     {
      "label": "HuggingFace",
      "lang": "python",
      "code": "# pip install -qU langchain \"langchain[huggingface]\"\nfrom langchain.agents import create_agent\n\ndef get_weather(city: str) -> str:\n    \"\"\"Get weather for a given city.\"\"\"\n    return f\"It's always sunny in {city}!\"\n\nagent = create_agent(\n    model=\"huggingface:microsoft/Phi-3-mini-4k-instruct\",\n    tools=[get_weather],\n    system_prompt=\"You are a helpful assistant\",\n)\n\nresult = agent.invoke(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"What's the weather in San Francisco?\"}]}\n)\nprint(result[\"messages\"][-1].content_blocks)"
     }
    ]
    ```


See the [Installation instructions](lc:oss/python/langchain/install) and [Quickstart guide](lc:oss/python/langchain/quickstart) to get started building your own agents and applications with LangChain.


> [!TIP]
>
> Use [LangSmith](lc:langsmith/observability) to trace requests, debug agent behavior, and evaluate outputs. Set `LANGSMITH_TRACING=true` and your API key to get started.


##  Core benefits


### [Standard model interface](#)
Use one interface for chat models, embeddings, and more across providers. Switch models with minimal code changes and keep your application portable as requirements evolve.

    ### [Highly configurable harness](#)
Start with `create_agent` as a minimal harness and add capabilities incrementally through middleware. Compose only what your use case needs, from guardrails and retries to routing and custom tool policies.

    ### [Built on top of LangGraph](#)
LangChain's agents are built on top of LangGraph. This allows us to take advantage of LangGraph's durable execution, human-in-the-loop support, persistence, and more.

    ### [Debug with LangSmith](#)
Inspect traces, tool calls, state transitions, and latency in one place. Find failure modes, evaluate quality, and improve agent behavior with execution data.
