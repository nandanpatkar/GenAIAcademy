# LangGraph - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-langgraph.html

---

# LangGraph

This page explains how to instrument a [LangGraph](<https://langchain-ai.github.io/langgraph/>) agent, how spans are identified, and how evaluation fields are extracted. It closes with best practices for structuring a LangGraph agent so that it can be evaluated reliably.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From span attributes

  * Example spans in split telemetry

  * Example spans in unified telemetry

  * Best practices for LangGraph agents


## Instrument your agent

You can instrument a LangGraph agent with either of two instrumentation libraries: **OpenTelemetry** (`opentelemetry-instrumentation-langchain`) or **OpenInference** (`openinference-instrumentation-langchain`). Amazon Bedrock AgentCore Evaluations supports both libraries. The libraries emit different scope names and use different span attributes. The evaluation service extracts the same values from each.

When your agent runs with the AWS Distro for OpenTelemetry (ADOT), such as on Amazon Bedrock AgentCore Runtime, you do not need to add explicit instrumentation code. Adding the instrumentation library to your project’s dependencies is enough. ADOT discovers it at startup and activates it automatically.

Add the instrumentation library for the path you want to your dependencies. The following examples pin a minimum version; use the latest available version unless you have a reason to pin.

###### Example

OpenTelemetry
    

NOTE: Use version `0.55.0` or later. Version 0.55.0 added support for the newer OpenTelemetry [generative-AI agent span conventions](<https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-agent-spans.md>) on the GitHub website, which the evaluation service relies on.

Add `opentelemetry-instrumentation-langchain` to your dependencies. The scope name emitted is `opentelemetry.instrumentation.langchain`.

`requirements.txt`:

```text
opentelemetry-instrumentation-langchain>=0.55.0
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "opentelemetry-instrumentation-langchain>=0.55.0",
]
```
OpenInference
    

Add `openinference-instrumentation-langchain` to your dependencies. The scope name emitted is `openinference.instrumentation.langchain`.

`requirements.txt`:

```text
openinference-instrumentation-langchain>=0.1.62
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "openinference-instrumentation-langchain>=0.1.62",
]
```
###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

The attribute used to classify spans differs between the two instrumentation libraries.

###### Example

OpenTelemetry
    

The OpenTelemetry instrumentation library classifies spans using the `traceloop.span.kind` attribute, and recent versions also set `gen_ai.operation.name`.

Span type | Identifying attribute  
---|---  
Invoke agent |  `traceloop.span.kind` = `workflow` (also `gen_ai.operation.name` = `invoke_agent`)  
Execute tool |  `traceloop.span.kind` = `tool` (also `gen_ai.operation.name` = `execute_tool`)  
Inference |  `gen_ai.operation.name` = `chat`  
  
OpenInference
    

The OpenInference instrumentation library classifies spans using the `openinference.span.kind` attribute.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `CHAIN` or `AGENT`  
Execute tool |  `openinference.span.kind` = `TOOL`  
Inference |  `openinference.span.kind` = `LLM`  
  
## How evaluation fields are extracted

For the invoke agent span, the input and output do not contain a clean per-message list. Instead, the content is the **serialized LangChain graph state** : a JSON string that wraps the full state. The exact shape of this serialized state differs between the two instrumentation libraries. In both cases, the service parses it to find the user prompt (the human message) and the agent response (the AI message).

LangGraph also serializes message roles in more than one form. A role can appear as a lowercase value (`human`, `ai`, `tool`) or as a LangChain message class name (`HumanMessage`, `AIMessage`, `ToolMessage`). The service recognizes both forms.

The location of this content depends on how telemetry was collected. The identifying attribute (`traceloop.span.kind` or `openinference.span.kind`) is on the span in both cases. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

### From event records

With split telemetry, the service reads content from the event record correlated to each span:

  * **User prompt** and **agent response** : from the invoke agent span’s event record, in `body.input` and `body.output`.

  * **Tool call** : the tool name from the execute tool span. The tool arguments and result come from that span’s event record, in `body.input` and `body.output`.


For more information, see Example spans in split telemetry.

### From span attributes

With unified telemetry, the same content stays on the span as attributes. The attributes depend on the instrumentation library:

  * **OpenTelemetry** :

    * **User prompt** and **agent response** : from `gen_ai.task.input` and `gen_ai.task.output` on the invoke agent span.

    * **Tool call** : the tool name from `gen_ai.tool.name`, and the arguments and result from `gen_ai.tool.call.arguments` and `gen_ai.tool.call.result`, on the execute tool span.

  * **OpenInference** :

    * **User prompt** and **agent response** : from `input.value` and `output.value` on the invoke agent span.

    * **Tool call** : the tool name from `tool.name`, and the arguments and result from `input.value` and `output.value`, on the execute tool span.


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from a LangGraph travel-planning agent deployed on Amazon Bedrock AgentCore Runtime. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Invoke agent span
    

The `traceloop.span.kind` attribute (`workflow`) identifies this as an invoke agent span; recent library versions also set `gen_ai.operation.name` = `invoke_agent`.

```json
{
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "spanId": "ba1833fa7f097041",
  "parentSpanId": "836a5ccf9a2186cc",
  "name": "travel_agent.workflow",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.60.0"
  },
  "startTimeUnixNano": 1778511607308521744,
  "endTimeUnixNano": 1778511610930280395,
  "durationNano": 3621758651,
  "attributes": {
    "traceloop.span.kind": "workflow",
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.agent.name": "travel_agent",
    "gen_ai.provider.name": "langgraph",
    "traceloop.workflow.name": "travel_agent",
    "session.id": "sea-nyc-trip-2-turns-adot_v17_opentelemetry_0_60_0"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the conversation. Each message’s `content` is the serialized LangChain graph state. The input wraps the state under an `inputs` key. The output wraps it under an `outputs` key, with each message as a LangChain constructor object. The user prompt is the human message and the agent response is the AI message inside that serialized state.

```json
{
  "spanId": "ba1833fa7f097041",
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain"
  },
  "body": {
    "input": {
      "messages": [
        {
          "content": "{\"inputs\": {\"messages\": [{\"role\": \"user\", \"content\": \"Hey, how can you help me\"}]}, \"tags\": [], \"metadata\": {\"ls_integration\": \"langchain_create_agent\", \"lc_agent_name\": \"travel_agent\", \"thread_id\": \"sea-nyc-trip-2-turns-adot_v17_opentelemetry_0_60_0\"}, \"kwargs\": {\"name\": \"travel_agent\"}}",
          "role": "user"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "content": "{\"outputs\": {\"messages\": [{\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"HumanMessage\"], \"kwargs\": {\"content\": \"Hey, how can you help me\", \"type\": \"human\", \"id\": \"12345678-1234-1234-1234-123456789012\"}}, {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"AIMessage\"], \"kwargs\": {\"content\": \"Hello! I'm your travel planning assistant ...\", \"type\": \"ai\"}}]}, \"kwargs\": {\"tags\": []}}",
          "role": "assistant"
        }
      ]
    }
  }
}
```
Execute tool span
    

The `traceloop.span.kind` attribute (`tool`) identifies this as an execute tool span; `gen_ai.tool.name` holds the tool name and `gen_ai.operation.name` = `execute_tool`.

```json
{
  "traceId": "6a01eefa5c52f3d86a35038f35f5ba30",
  "spanId": "5b332f3cd15ace04",
  "parentSpanId": "922a21edc04eba29",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.60.0"
  },
  "startTimeUnixNano": 1778511614892698232,
  "endTimeUnixNano": 1778511614893399618,
  "durationNano": 701386,
  "attributes": {
    "traceloop.span.kind": "tool",
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.type": "function",
    "gen_ai.tool.description": "Search for available flights between cities.",
    "gen_ai.provider.name": "langgraph",
    "traceloop.workflow.name": "travel_agent",
    "session.id": "sea-nyc-trip-2-turns-adot_v17_opentelemetry_0_60_0"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the tool input (arguments) and output (result, serialized as a LangChain `ToolMessage`).

```json
{
  "spanId": "5b332f3cd15ace04",
  "traceId": "6a01eefa5c52f3d86a35038f35f5ba30",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain"
  },
  "body": {
    "input": {
      "messages": [
        { "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}" }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "tool",
          "name": "search_flights",
          "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}"
        }
      ]
    }
  }
}
```
### OpenInference

With the OpenInference library, the span type is carried in the `openinference.span.kind` attribute, and the agent input and output are serialized in the correlated event record.

###### Example

Invoke agent span
    

The `openinference.span.kind` attribute (`CHAIN`, or `AGENT` when the graph is compiled with a name) identifies this as an invoke agent span.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "0a7990d804132a9b",
  "parentSpanId": "29ae22014173881c",
  "name": "LangGraph",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.langchain",
    "version": "0.1.66"
  },
  "startTimeUnixNano": 1782087405949310976,
  "endTimeUnixNano": 1782087408945828864,
  "durationNano": 2996517888,
  "attributes": {
    "openinference.span.kind": "CHAIN",
    "input.mime_type": "application/json",
    "output.mime_type": "application/json",
    "llm.input_messages.0.message.role": "user",
    "session.id": "sea-nyc-trip-2-turns-oi-0-1-66"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the conversation. The user prompt is the human-role message and the agent response is the AI-role message in the serialized messages.

```json
{
  "spanId": "0a7990d804132a9b",
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "scope": {
    "name": "openinference.instrumentation.langchain"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "{\"messages\": [{\"role\": \"user\", \"content\": \"Hey, how can you help me\"}]}"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "content": "{\"messages\": [{\"type\": \"human\", \"data\": {\"content\": \"Hey, how can you help me\", ...}}, {\"type\": \"ai\", \"data\": {\"content\": \"Hello! I'm your travel planning assistant ...\", ...}}]}",
          "role": "assistant"
        }
      ]
    }
  }
}
```
Execute tool span
    

The `openinference.span.kind` attribute (`TOOL`) identifies this as an execute tool span; `tool.name` holds the tool name.

```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "ab105c12cc40048f",
  "parentSpanId": "9b2d4e72760690b4",
  "name": "search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.langchain",
    "version": "0.1.66"
  },
  "startTimeUnixNano": 1782087411724620032,
  "endTimeUnixNano": 1782087411725306880,
  "durationNano": 686848,
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "tool.description": "Search for available flights between cities.",
    "input.mime_type": "application/json",
    "output.mime_type": "application/json",
    "session.id": "sea-nyc-trip-2-turns-oi-0-1-66"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the tool input (arguments) and output (result, serialized as a LangChain `ToolMessage`).

```json
{
  "spanId": "ab105c12cc40048f",
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "scope": {
    "name": "openinference.instrumentation.langchain"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "content": "{\"type\": \"tool\", \"data\": {\"content\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\", \"type\": \"tool\", \"name\": \"search_flights\", \"tool_call_id\": \"toolu_bdrk_01LzXXJCfpfuS7Bpf7e1qLMg\", \"status\": \"success\"}}",
          "role": "assistant"
        }
      ]
    }
  }
}
```
## Example spans in unified telemetry

With unified telemetry, the same content stays on the span attributes and no separate event record is produced. The following examples are from a LangGraph travel-planning agent. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Invoke agent span
    

The `gen_ai.task.input` attribute holds the user prompt, and the `gen_ai.task.output` attribute holds the serialized state with the agent response. Both are the serialized LangChain graph state.

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "31ea3d5882dac680",
  "name": "LangGraph.workflow",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.62.1"
  },
  "attributes": {
    "traceloop.span.kind": "workflow",
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.agent.name": "LangGraph",
    "gen_ai.task.input": "{\"inputs\": {\"messages\": [{\"role\": \"user\", \"content\": \"Hey, how can you help me\"}]}, \"tags\": [], \"metadata\": { ... }, \"kwargs\": {\"name\": \"LangGraph\"}}",
    "gen_ai.task.output": "{\"outputs\": {\"messages\": [{\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"HumanMessage\"], \"kwargs\": {\"content\": \"Hey, how can you help me\", \"type\": \"human\"}}, {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"AIMessage\"], \"kwargs\": {\"content\": \"Hello! I'm your travel planning assistant ...\", \"type\": \"ai\"}}]}, \"kwargs\": {\"tags\": []}}",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `gen_ai.tool.call.arguments` attribute holds the tool arguments, and the `gen_ai.tool.call.result` attribute holds the tool result, serialized as a LangChain `ToolMessage`.

```json
{
  "traceId": "6a4de7c376913db82e6f0f336a16731d",
  "spanId": "b64c37adefae74f0",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.62.1"
  },
  "attributes": {
    "traceloop.span.kind": "tool",
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.description": "Search for available flights between cities.",
    "gen_ai.tool.call.arguments": "{\"input_str\": \"{'origin': 'SEA', 'destination': 'NYC', 'date': '2025-03-15'}\", \"inputs\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}, \"metadata\": { ... }}",
    "gen_ai.tool.call.result": "{\"output\": {\"lc\": 1, \"type\": \"constructor\", \"id\": [\"langchain\", \"schema\", \"messages\", \"ToolMessage\"], \"kwargs\": {\"content\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\", \"type\": \"tool\", \"name\": \"search_flights\", \"status\": \"success\"}}}",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
### OpenInference

###### Example

Invoke agent span
    

The `input.value` attribute holds the user prompt, and the `output.value` attribute holds the serialized state with the agent response.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "b8c0b67876b78b91",
  "name": "LangGraph",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.langchain",
    "version": "0.1.66"
  },
  "attributes": {
    "openinference.span.kind": "CHAIN",
    "input.value": "{\"messages\": [{\"role\": \"user\", \"content\": \"Hey, how can you help me\"}]}",
    "output.value": "{\"messages\": [{\"type\": \"human\", \"data\": {\"content\": \"Hey, how can you help me\"}}, {\"type\": \"ai\", \"data\": {\"content\": \"Hello! I'm your travel planning assistant ...\"}}]}",
    "session.id": "sea-nyc-trip-2-turns-oi-0-1-66"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `input.value` attribute holds the tool arguments, and the `output.value` attribute holds the tool result, serialized as a LangChain `ToolMessage`.

```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "58752612d9b22ae1",
  "name": "search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.langchain",
    "version": "0.1.66"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "tool.description": "Search for available flights between cities.",
    "input.value": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "output.value": "{\"type\": \"tool\", \"data\": {\"content\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\", \"name\": \"search_flights\"}}",
    "session.id": "sea-nyc-trip-2-turns-oi-0-1-66"
  },
  "status": {
    "code": "OK"
  }
}
```
## Best practices for LangGraph agents

How you build and invoke a LangGraph agent affects what appears in its telemetry, and therefore how reliably the agent can be evaluated. The following practices help ensure the user prompt, agent response, and tool activity are recoverable.

### 1\. Choose an agent construction pattern

There are two common ways to build a LangGraph agent:

  * **Prebuilt`create_agent` **: the quickest way to get started. It produces a single invoke agent span per turn, with the conversation passed through LangGraph’s built-in execution loop. Use this when you want a standard reason-act agent without custom control flow.

```python
from langchain.agents import create_agent

agent = create_agent(model=model, tools=[search_flights, book_flight])
```
  * **Custom`StateGraph` **: gives you full control over nodes, edges, and conditional routing. Each node execution becomes its own span, so traces are more granular. Use this when you need custom orchestration.

```python
from langgraph.graph import StateGraph, START, END
from typing_extensions import TypedDict

class State(TypedDict):
    messages: list

graph = StateGraph(State)
graph.add_node("generate_response", generate_response)
graph.add_node("tools", run_tools)
graph.add_edge(START, "generate_response")
agent = graph.compile()
```
Both patterns are evaluated the same way; the difference is the granularity of the trace.

### 2\. Use `messages` in your graph State (recommended)

The evaluation service reconstructs the conversation from the agent’s input and output messages. Using a `messages` field is not mandatory, but it enables the most reliable extraction. For a custom `StateGraph`, keep the conversation in a `messages` field in your State:

  * **Include`messages` in your State (recommended).** You can add other custom fields (such as `user_id` or metadata). When `messages` is present, the standard extraction finds the user prompt and agent response directly. If `messages` is absent, the service falls back to reconstructing the conversation from individual inference spans, which is less reliable.

  * **Append, don’t replace.** Follow the LangGraph convention of appending new messages to the list rather than overwriting it, so the full conversation history is preserved.

  * **Use canonical LangChain message types** (`HumanMessage`, `AIMessage`, `ToolMessage`, `SystemMessage`). The instrumentation serializes these correctly, and the service recognizes their roles.


### 3\. Pass the user message in a supported format

When you invoke a LangGraph agent, you add the user message to the graph’s `messages` state. LangGraph accepts the message in three interchangeable formats, and AgentCore Evaluations supports all of them. Each produces spans and event records that the service can read.

  * **Tuple** : a `(role, content)` pair:

```text
agent.invoke({"messages": [("user", user_message)]}, config=config)
```
  * **LangChain message object** : a `HumanMessage` (or other message class):

```python
from langchain_core.messages import HumanMessage

agent.invoke({"messages": [HumanMessage(content=user_message)]}, config=config)
```
  * **Dictionary** : a `{"role", "content"}` dictionary:

```text
agent.invoke({"messages": [{"role": "user", "content": user_message}]}, config=config)
```
All three formats result in the same `messages` state, so the user prompt and agent response are extracted identically regardless of which you choose.

