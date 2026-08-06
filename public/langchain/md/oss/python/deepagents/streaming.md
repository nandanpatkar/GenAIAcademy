> [!TIP]
>
> For new applications, we recommend [event streaming](lc:oss/python/deepagents/event-streaming)—the typed-projection API introduced in Deep Agents v0.6. Event streaming gives you separate iterators per projection (subagents, messages, tool calls, values) so you can consume them independently instead of branching on `stream_mode` chunks.


Deep Agents build on LangGraph's streaming infrastructure with first-class support for subagent streams. When a deep agent delegates work to subagents, you can stream updates from each subagent independently—tracking progress, LLM tokens, and tool calls in real time.

What's possible with deep agent streaming:

*  [**Stream subagent progress**](#subagent-progress)—track each subagent's execution as it runs in parallel.
*  [**Stream LLM tokens**](#llm-tokens)—stream tokens from the main agent and each subagent.
*  [**Stream tool calls**](#tool-calls)—see tool calls and results from within subagent execution.
*  [**Stream custom updates**](#custom-updates)—emit user-defined signals from inside subagent nodes.

## Enable subgraph streaming

Deep Agents use LangGraph's subgraph streaming to surface events from subagent execution. To receive subagent events, enable `stream_subgraphs` when streaming.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=\"You are a helpful research assistant\",\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches a topic in depth\",\n            \"system_prompt\": \"You are a thorough researcher.\",\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing advances\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,  # [!code highlight]\n    version=\"v2\",  # [!code highlight]\n):\n    if chunk[\"type\"] == \"updates\":\n        if chunk[\"ns\"]:\n            # Subagent event - namespace identifies the source\n            print(f\"[subagent: {chunk['ns']}]\")\n        else:\n            # Main agent event\n            print(\"[main agent]\")\n        print(chunk[\"data\"])"
 }
]
```


## Namespaces

When `subgraphs` is enabled, each streaming event includes a **namespace** that identifies which agent produced it. The namespace is a path of node names and task IDs that represents the agent hierarchy.

| Namespace | Source |
| --------- | ------ |
| `()` (empty) | Main agent |
| `("tools:abc123",)` | A subagent spawned by the main agent's `task` tool call `abc123` |
| `("tools:abc123", "model_request:def456")` | The model request node inside a subagent |

Use namespaces to route events to the correct UI component:


```python
for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Plan my vacation"}]},
    stream_mode="updates",
    subgraphs=True,
    version="v2",
):
    if chunk["type"] == "updates":
        # Check if this event came from a subagent
        is_subagent = any(
            segment.startswith("tools:") for segment in chunk["ns"]
        )

        if is_subagent:
            # Extract the tool call ID from the namespace
            tool_call_id = next(
                s.split(":")[1] for s in chunk["ns"] if s.startswith("tools:")
            )
            print(f"Subagent {tool_call_id}: {chunk['data']}")
        else:
            print(f"Main agent: {chunk['data']}")
```


## Subagent progress

Use `stream_mode="updates"` to track subagent progress as each step completes. This is useful for showing which subagents are active and what work they've completed.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=(\n        \"You are a project coordinator with no research knowledge. \"\n        \"For every user request, you must call the task() tool with \"\n        \"subagent_type set to researcher. Never answer research questions yourself. \"\n        \"Keep your final response to one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"researcher\",\n            \"description\": \"Researches topics thoroughly\",\n            \"system_prompt\": (\n                \"You are a thorough researcher. Research the given topic \"\n                \"and provide a concise summary in 2-3 sentences.\"\n            ),\n        },\n    ],\n)\n\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Write a short summary about AI safety\"}]},\n    stream_mode=\"updates\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"updates\":\n        # Main agent updates (empty namespace)\n        if not chunk[\"ns\"]:\n            for node_name, data in chunk[\"data\"].items():\n                if node_name == \"tools\":\n                    # Subagent results returned to main agent\n                    for msg in data.get(\"messages\", []):\n                        if msg.type == \"tool\":\n                            print(f\"\\nSubagent complete: {msg.name}\")\n                            print(f\"  Result: {str(msg.content)[:200]}...\")\n                else:\n                    print(f\"[main agent] step: {node_name}\")\n\n        # Subagent updates (non-empty namespace)\n        else:\n            for node_name, data in chunk[\"data\"].items():\n                print(f\"  [{chunk['ns'][0]}] step: {node_name}\")"
 },
 {
  "label": "title=\"Output\"",
  "lang": "shell",
  "code": "[main agent] step: model_request\n  [tools:call_abc123] step: model_request\n  [tools:call_abc123] step: tools\n  [tools:call_abc123] step: model_request\n\nSubagent complete: task\n  Result: ## AI Safety Report...\n[main agent] step: model_request"
 }
]
```


## LLM tokens

Use `stream_mode="messages"` to stream individual tokens from both the main agent and subagents. Each message event includes metadata that identifies the source agent.


```python
current_source = ""

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Research quantum computing advances"}]},
    stream_mode="messages",
    subgraphs=True,
    version="v2",
):
    if chunk["type"] == "messages":
        token, metadata = chunk["data"]

        # Check if this event came from a subagent (namespace contains "tools:")
        is_subagent = any(s.startswith("tools:") for s in chunk["ns"])

        if is_subagent:
            # Token from a subagent
            subagent_ns = next(s for s in chunk["ns"] if s.startswith("tools:"))
            if subagent_ns != current_source:
                print(f"\n\n--- [subagent: {subagent_ns}] ---")
                current_source = subagent_ns
            if token.content:
                print(token.content, end="", flush=True)
        else:
            # Token from the main agent
            if "main" != current_source:
                print("\n\n--- [main agent] ---")
                current_source = "main"
            if token.content:
                print(token.content, end="", flush=True)

print()
```


## Tool calls

When subagents use tools, you can stream tool call events to display what each subagent is doing. Tool call chunks appear in the `messages` stream mode.


```python
from langchain.messages import AIMessageChunk, ToolMessage

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Research recent quantum computing advances"}]},
    stream_mode="messages",
    subgraphs=True,
    version="v2",
):
    if chunk["type"] == "messages":
        token, metadata = chunk["data"]

        # Identify source: "main" or the subagent namespace segment
        is_subagent = any(s.startswith("tools:") for s in chunk["ns"])
        source = next((s for s in chunk["ns"] if s.startswith("tools:")), "main") if is_subagent else "main"

        # Tool call chunks (streaming tool invocations)
        if isinstance(token, AIMessageChunk) and token.tool_call_chunks:
            for tc in token.tool_call_chunks:
                if tc.get("name"):
                    print(f"\n[{source}] Tool call: {tc['name']}")
                # Args stream in chunks - write them incrementally
                if tc.get("args"):
                    print(tc["args"], end="", flush=True)

        # Tool results
        if isinstance(token, ToolMessage):
            print(f"\n[{source}] Tool result [{token.name}]: {str(token.content)[:150]}")

        # Regular AI content (skip tool call messages)
        if (
            isinstance(token, AIMessageChunk)
            and token.content
            and not token.tool_call_chunks
        ):
            print(token.content, end="", flush=True)

print()
```


## Custom updates

Use `get_stream_writer` inside your subagent tools to emit custom progress events:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from langchain.tools import tool\nfrom langgraph.config import get_stream_writer\nfrom deepagents import create_deep_agent\n\n\n@tool\ndef analyze_data(topic: str) -> str:\n    \"\"\"Run a data analysis on a given topic.\n\n    This tool performs the actual analysis and emits progress updates.\n    You MUST call this tool for any analysis request.\n    \"\"\"\n    writer = get_stream_writer()\n\n    writer({\"status\": \"starting\", \"topic\": topic, \"progress\": 0})\n    time.sleep(0.5)\n\n    writer({\"status\": \"analyzing\", \"progress\": 50})\n    time.sleep(0.5)\n\n    writer({\"status\": \"complete\", \"progress\": 100})\n    return (\n        f'Analysis of \"{topic}\": Customer sentiment is 85% positive, '\n        \"driven by product quality and support response times.\"\n    )\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=(\n        \"You are a coordinator. For any analysis request, you MUST delegate \"\n        \"to the analyst subagent using the task tool. Never try to answer directly. \"\n        \"After receiving the result, summarize it in one sentence.\"\n    ),\n    subagents=[\n        {\n            \"name\": \"analyst\",\n            \"description\": \"Performs data analysis with real-time progress tracking\",\n            \"system_prompt\": (\n                \"You are a data analyst. You MUST call the analyze_data tool \"\n                \"for every analysis request. Do not use any other tools. \"\n                \"After the analysis completes, report the result.\"\n            ),\n            \"tools\": [analyze_data],\n        },\n    ],\n)\n\ncustom_event_count = 0\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Analyze customer satisfaction trends\"}]},\n    stream_mode=\"custom\",\n    subgraphs=True,\n    version=\"v2\",\n):\n    if chunk[\"type\"] == \"custom\":\n        custom_event_count += 1\n        is_subagent = any(s.startswith(\"tools:\") for s in chunk[\"ns\"])\n        if is_subagent:\n            subagent_ns = next(s for s in chunk[\"ns\"] if s.startswith(\"tools:\"))\n            print(f\"[{subagent_ns}]\", chunk[\"data\"])\n        else:\n            print(\"[main]\", chunk[\"data\"])"
 },
 {
  "label": "title=\"Output\"",
  "lang": "shell",
  "code": "[tools:call_abc123] {'status': 'starting', 'topic': 'customer satisfaction trends', 'progress': 0}\n[tools:call_abc123] {'status': 'analyzing', 'progress': 50}\n[tools:call_abc123] {'status': 'complete', 'progress': 100}"
 }
]
```


## Stream multiple modes

Combine multiple stream modes to get a complete picture of agent execution:


```python
# Skip internal middleware steps - only show meaningful node names
INTERESTING_NODES = {"model", "tools"}

last_source = ""
mid_line = False  # True when we've written tokens without a trailing newline

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Analyze the impact of remote work on team productivity"}]},
    stream_mode=["updates", "messages", "custom"],
    subgraphs=True,
    version="v2",
):
    is_subagent = any(s.startswith("tools:") for s in chunk["ns"])
    source = "subagent" if is_subagent else "main"

    if chunk["type"] == "updates":
        for node_name in chunk["data"]:
            if node_name not in INTERESTING_NODES:
                continue
            if mid_line:
                print()
                mid_line = False
            print(f"[{source}] step: {node_name}")

    elif chunk["type"] == "messages":
        token, metadata = chunk["data"]
        if token.content:
            # Print a header when the source changes
            if source != last_source:
                if mid_line:
                    print()
                    mid_line = False
                print(f"\n[{source}] ", end="")
                last_source = source
            print(token.content, end="", flush=True)
            mid_line = True

    elif chunk["type"] == "custom":
        if mid_line:
            print()
            mid_line = False
        print(f"[{source}] custom event:", chunk["data"])

print()
```


## Common patterns

### Track subagent lifecycle

Monitor when subagents start, run, and complete:


```python
active_subagents = {}

for chunk in agent.stream(
    {"messages": [{"role": "user", "content": "Research the latest AI safety developments"}]},
    stream_mode="updates",
    subgraphs=True,
    version="v2",
):
    if chunk["type"] == "updates":
        for node_name, data in chunk["data"].items():
            # ─── Phase 1: Detect subagent starting ────────────────────────
            # When the main agent's model node contains task tool calls,
            # a subagent has been spawned.
            if not chunk["ns"] and node_name == "model":
                for msg in data.get("messages", []):
                    for tc in getattr(msg, "tool_calls", []):
                        if tc["name"] == "task":
                            active_subagents[tc["id"]] = {
                                "type": tc["args"].get("subagent_type"),
                                "description": tc["args"].get("description", "")[:80],
                                "status": "pending",
                            }
                            print(
                                f'[lifecycle] PENDING  → subagent "{tc["args"].get("subagent_type")}" '
                                f'({tc["id"]})'
                            )

            # ─── Phase 2: Detect subagent running ─────────────────────────
            # When we receive events from a tools:UUID namespace, that
            # subagent is actively executing.
            if chunk["ns"] and chunk["ns"][0].startswith("tools:"):
                pregel_id = chunk["ns"][0].split(":")[1]
                # Check if any pending subagent needs to be marked running.
                # Note: the pregel task ID differs from the tool_call_id,
                # so we mark any pending subagent as running on first subagent event.
                for sub_id, sub in active_subagents.items():
                    if sub["status"] == "pending":
                        sub["status"] = "running"
                        print(
                            f'[lifecycle] RUNNING  → subagent "{sub["type"]}" '
                            f"(pregel: {pregel_id})"
                        )
                        break

            # ─── Phase 3: Detect subagent completing ──────────────────────
            # When the main agent's tools node returns a tool message,
            # the subagent has completed and returned its result.
            if not chunk["ns"] and node_name == "tools":
                for msg in data.get("messages", []):
                    if msg.type == "tool":
                        sub = active_subagents.get(msg.tool_call_id)
                        if sub:
                            sub["status"] = "complete"
                            print(
                                f'[lifecycle] COMPLETE → subagent "{sub["type"]}" '
                                f"({msg.tool_call_id})"
                            )
                            print(f"  Result preview: {str(msg.content)[:120]}...")

# Print final state
print("\n--- Final subagent states ---")
for sub_id, sub in active_subagents.items():
    print(f"  {sub['type']}: {sub['status']}")
```


## v2 streaming format


> [!NOTE]
>
> Requires LangGraph >= 1.1.


All examples on this page use the v2 streaming format (`version="v2"`), which is the recommended approach. Every chunk is a `StreamPart` dict with `type`, `ns`, and `data` keys — the same shape regardless of stream mode, number of modes, or subgraph settings.

The v2 format eliminates nested tuple unpacking, making it straightforward to handle subgraph streaming in Deep Agents. Compare the two formats:

```lc-tabs
[
 {
  "label": "v2 (recommended)",
  "lang": "python",
  "code": "# Unified format \u2014 no nested tuple unpacking\nfor chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing\"}]},\n    stream_mode=[\"updates\", \"messages\", \"custom\"],\n    subgraphs=True,\n    version=\"v2\",\n):\n    print(chunk[\"type\"])  # \"updates\", \"messages\", or \"custom\"\n    print(chunk[\"ns\"])    # () for main agent, (\"tools:<id>\",) for subagent\n    print(chunk[\"data\"])  # payload"
 },
 {
  "label": "v1 (legacy)",
  "lang": "python",
  "code": "# Must handle (namespace, (mode, data)) nested tuples\nfor namespace, chunk in agent.stream(\n    {\"messages\": [{\"role\": \"user\", \"content\": \"Research quantum computing\"}]},\n    stream_mode=[\"updates\", \"messages\", \"custom\"],\n    subgraphs=True,\n):\n    mode, data = chunk[0], chunk[1]\n    print(mode)       # \"updates\", \"messages\", or \"custom\"\n    print(namespace)  # () for main agent, (\"tools:<id>\",) for subagent\n    print(data)       # payload"
 }
]
```

See the [LangGraph streaming docs](lc:oss/python/langgraph/streaming#stream-output-format-v2) for more details on the v2 format, including type narrowing and Pydantic/dataclass coercion.

## Related

- [Subagents](lc:oss/python/deepagents/subagents)—Configure and use subagents with Deep Agents
- [Frontend streaming](lc:oss/python/deepagents/frontend/overview)—Build React UIs with `useStream` for Deep Agents
- [LangChain Event Streaming](lc:oss/python/langchain/event-streaming)—General streaming concepts with LangChain agents
