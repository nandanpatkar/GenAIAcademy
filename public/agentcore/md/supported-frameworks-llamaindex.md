# LlamaIndex - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-llamaindex.html

---

# LlamaIndex

This page explains how to instrument a [LlamaIndex](<https://docs.llamaindex.ai/>) agent, how spans are identified, and how evaluation fields are extracted. It closes with best practices for structuring a LlamaIndex agent so that it can be evaluated reliably.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From span attributes

  * Example spans in split telemetry

  * Example spans in unified telemetry

  * Best practices for LlamaIndex agents


## Instrument your agent

You can instrument a LlamaIndex agent with either of two instrumentation libraries: **OpenTelemetry** (`opentelemetry-instrumentation-llamaindex`) or **OpenInference** (`openinference-instrumentation-llama-index`). Amazon Bedrock AgentCore Evaluations supports both libraries. The libraries emit different scope names and use different span attributes. The evaluation service extracts the same values from each.

When your agent runs with the AWS Distro for OpenTelemetry (ADOT), such as on Amazon Bedrock AgentCore Runtime, you do not need to add explicit instrumentation code. Adding the instrumentation library to your project’s dependencies is enough. ADOT discovers it at startup and activates it automatically.

Add the instrumentation library for the path you want to your dependencies. Use the latest available version unless you have a reason to pin.

###### Example

OpenTelemetry
    

NOTE: Use version `0.61.0` or later. This is the earliest version tested with the evaluation service.

Add `opentelemetry-instrumentation-llamaindex` to your dependencies. The scope name emitted is `opentelemetry.instrumentation.llamaindex`.

`requirements.txt`:

```text
opentelemetry-instrumentation-llamaindex>=0.61.0
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "opentelemetry-instrumentation-llamaindex>=0.61.0",
]
```
OpenInference
    

NOTE: Use version `4.4.1` or later. This is the earliest version tested with the evaluation service.

Add `openinference-instrumentation-llama-index` to your dependencies. The scope name emitted is `openinference.instrumentation.llama_index`.

`requirements.txt`:

```text
openinference-instrumentation-llama-index>=4.4.1
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "openinference-instrumentation-llama-index>=4.4.1",
]
```
###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

The attribute used to classify spans differs between the two instrumentation libraries.

###### Example

OpenTelemetry
    

The OpenTelemetry instrumentation library classifies spans using the `traceloop.span.kind` attribute. Because LlamaIndex tags both inference and tool operations as `task`, AgentCore Evaluations disambiguates them by the `traceloop.entity.name` attribute: a `task` whose entity name ends in `Tool.task` is an execute tool span; any other `task` is an inference span.

Span type | Identifying attribute  
---|---  
Invoke agent |  `traceloop.span.kind` = `workflow`  
Execute tool |  `traceloop.span.kind` = `tool`, or `traceloop.span.kind` = `task` with `traceloop.entity.name` ending in `Tool.task`  
Inference |  `traceloop.span.kind` = `task` (not a tool task)  
  
OpenInference
    

The OpenInference instrumentation library classifies spans using the `openinference.span.kind` attribute. LlamaIndex emits `CHAIN`, `LLM`, and `TOOL` spans; it does not emit `AGENT` spans. The root workflow span (a `CHAIN`) acts as the invoke agent span.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `CHAIN` (root workflow span)  
Execute tool |  `openinference.span.kind` = `TOOL`  
Inference |  `openinference.span.kind` = `LLM`  
  
###### Note

LlamaIndex emits several intermediate `CHAIN` spans (for example, for output parsing and tool routing). AgentCore Evaluations treats only the root workflow span as the invoke agent span and reconstructs the user prompt and agent response from the inference (`LLM`) spans in the trace.

## How evaluation fields are extracted

The LlamaIndex agent is a **workflow** , and its top-level span is emitted before its child spans. That workflow span carries no usable conversation content of its own, so AgentCore Evaluations reconstructs the user prompt and agent response from the child spans (the inference and tool spans) and attaches them to the invoke agent span.

LlamaIndex also serializes content as nested JSON. Tool arguments are wrapped as `{"kwargs": {…​}}`, and tool results are wrapped as `{"blocks": [{"text": "…​"}], …​}`. AgentCore Evaluations unwraps these forms. When a LlamaIndex ReAct agent produces output in the form `Thought: …​ Answer: <response>`, AgentCore Evaluations extracts the text after `Answer:` as the agent response.

The location of this content depends on how telemetry was collected. The identifying attribute (`traceloop.span.kind` or `openinference.span.kind`) is on the span in both cases. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

### From event records

With split telemetry, AgentCore Evaluations reads content from the event record correlated to each span:

  * **User prompt** and **agent response** : reconstructed from the inference spans' event records, in `body.output`. With the OpenTelemetry library, the user prompt comes from the chat-history content and the agent response from the model-result content. With the OpenInference library, the user prompt is the plain-text input message and the agent response is the model output (with the text after `Answer:` used for a ReAct agent).

  * **Tool call** : the tool name from the execute tool span. The tool arguments and result come from that span’s event record, in `body.input` (unwrapped from `{"kwargs": {…​}}`) and `body.output` (unwrapped from `{"blocks": […​]}`).


For more information, see Example spans in split telemetry.

### From span attributes

With unified telemetry, the same content stays on the span as attributes. The attributes depend on the instrumentation library:

  * **OpenTelemetry** : the content is on the `traceloop.entity.input` and `traceloop.entity.output` attributes of each span. AgentCore Evaluations applies the same chat-history, result, and tool unwrapping to these values.

  * **OpenInference** : the inference content is on the indexed message attributes (`–0—` and `–1—`). Tool arguments come from `input.value` (unwrapped from `{"kwargs": {…​}}`) and the tool result from `output.value` (unwrapped from `{"blocks": […​]}`).


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from a LlamaIndex ReAct travel-planning agent deployed on Amazon Bedrock AgentCore Runtime. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Invoke agent span
    

The `traceloop.span.kind` attribute (`workflow`) identifies this as an invoke agent span. The workflow span carries no conversation content; AgentCore Evaluations reconstructs the user prompt and agent response from the child spans.

```json
{
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "spanId": "ba1833fa7f097041",
  "name": "ReActAgent.workflow",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex",
    "version": "0.61.0"
  },
  "attributes": {
    "traceloop.span.kind": "workflow",
    "traceloop.entity.name": "ReActAgent.workflow",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `traceloop.span.kind` attribute (`task`) with a `traceloop.entity.name` ending in `Tool.task` identifies this as an execute tool span. The correlated event record carries the tool arguments (wrapped in `kwargs`) and the tool result (wrapped in `blocks`), along with the tool name.


```json
{
  "traceId": "6a01eefa5c52f3d86a35038f35f5ba30",
  "spanId": "5b332f3cd15ace04",
  "name": "FunctionTool.task",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex",
    "version": "0.61.0"
  },
  "attributes": {
    "traceloop.span.kind": "task",
    "traceloop.entity.name": "FunctionTool.task",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "5b332f3cd15ace04",
  "traceId": "6a01eefa5c52f3d86a35038f35f5ba30",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "{\"kwargs\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}}" }
      ]
    },
    "output": {
      "messages": [
        { "content": "{\"blocks\": [{\"block_type\": \"text\", \"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}], \"tool_name\": \"search_flights\"}" }
      ]
    }
  }
}
```
 
Inference span
    

The `traceloop.span.kind` attribute (`task`), with a `traceloop.entity.name` that does not end in `Tool.task`, identifies this as an inference span. A LlamaIndex agent produces several of these spans per turn. In each one, the content is packed into `body.output` (there is no `body.input`), as a serialized JSON string. AgentCore Evaluations reads the **user prompt** from the chat-history string (a `{"input": […​]}` object) on the first inference span, and the **agent response** from the model-result string (a `{"result": {"response": …​}}` object) on the last inference span.

The following is the inference span itself.

```json
{
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "spanId": "d9a1f0c7b3e64a20",
  "name": "BaseWorkflowAgent.task",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex",
    "version": "0.61.0"
  },
  "attributes": {
    "traceloop.span.kind": "task",
    "traceloop.entity.name": "BaseWorkflowAgent.task",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
On the first inference span, the event record’s `body.output` content is the chat history. The user prompt is the `user`-role text inside the nested `input` array.

```json
{
  "spanId": "d9a1f0c7b3e64a20",
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex"
  },
  "body": {
    "output": {
      "messages": [
        {
          "content": "{\"input\": [{\"role\": \"user\", \"blocks\": [{\"block_type\": \"text\", \"text\": \"Hey, how can you help me\"}]}], \"current_agent_name\": \"Agent\"}"
        }
      ]
    }
  }
}
```
On the last inference span, the event record’s `body.output` content is the model result. The agent response is the `assistant`-role text inside the nested `result.response` object.

```json
{
  "spanId": "826bc829697a9610",
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex"
  },
  "body": {
    "output": {
      "messages": [
        {
          "content": "{\"result\": {\"response\": {\"role\": \"assistant\", \"blocks\": [{\"block_type\": \"text\", \"text\": \"Here are the available flights from Seattle to New York City ...\"}]}}, \"current_agent_name\": \"Agent\"}"
        }
      ]
    }
  }
}
```
### OpenInference

###### Example

Invoke agent span
    

The `openinference.span.kind` attribute (`CHAIN`) on the root workflow span identifies this as an invoke agent span. The span carries no usable conversation content; AgentCore Evaluations reconstructs the user prompt and agent response from the inference spans.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "0a7990d804132a9b",
  "name": "ReActAgent.run",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.llama_index",
    "version": "4.4.1"
  },
  "attributes": {
    "openinference.span.kind": "CHAIN",
    "input.mime_type": "application/json",
    "output.mime_type": "text/plain",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `openinference.span.kind` attribute (`TOOL`) identifies this as an execute tool span; `tool.name` holds the tool name. The tool arguments and result live in the correlated event record, wrapped in `kwargs` and `blocks` respectively.


```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "ab105c12cc40048f",
  "name": "FunctionTool.acall",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.llama_index",
    "version": "4.4.1"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "tool.description": "search_flights(origin: str, destination: str, date: str) -> str ...",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "ab105c12cc40048f",
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "scope": {
    "name": "openinference.instrumentation.llama_index"
  },
  "body": {
    "input": {
      "messages": [
        { "content": "{\"kwargs\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}}" }
      ]
    },
    "output": {
      "messages": [
        { "content": "{\"blocks\": [{\"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}], \"tool_name\": \"search_flights\"}" }
      ]
    }
  }
}
```
 
Inference span
    

The `openinference.span.kind` attribute (`LLM`) identifies this as an inference span. Message roles are on the span attributes; the content lives in the correlated event record. ADOT flattens the input roles to `user`, so AgentCore Evaluations uses the last plain-text input message as the user prompt. LlamaIndex emits a duplicate `assistant:`-prefixed output message, which AgentCore Evaluations skips in favor of the clean copy.


```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "1221a062c7f90a8e",
  "name": "OpenAI.astream_chat",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.llama_index",
    "version": "4.4.1"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "llm.system": "openai",
    "llm.model_name": "gpt-4o-mini",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.1.message.role": "user",
    "llm.output_messages.0.message.role": "assistant",
    "session.id": "sea-nyc-trip-2-turns-llamaindex-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "1221a062c7f90a8e",
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "scope": {
    "name": "openinference.instrumentation.llama_index"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "{\"messages\": [ ... ]}" },
        { "role": "user", "content": "You are designed to help with a variety of tasks ..." },
        { "role": "user", "content": "Hey, how can you help me" }
      ]
    },
    "output": {
      "messages": [
        { "role": "assistant", "content": "assistant: Thought: ... Answer: I can help you plan your trip ..." },
        { "role": "assistant", "content": "Thought: ... Answer: I can help you plan your trip ..." }
      ]
    }
  }
}
```
 

## Example spans in unified telemetry

With unified telemetry, the same content stays on the span attributes and no separate event record is produced. The following examples are from a LlamaIndex ReAct travel-planning agent. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Execute tool span
    

The `traceloop.entity.input` attribute holds the tool arguments (wrapped in `kwargs`), and the `traceloop.entity.output` attribute holds the tool result (wrapped in `blocks`).

```json
{
  "traceId": "6a4de7c376913db82e6f0f336a16731d",
  "spanId": "b64c37adefae74f0",
  "name": "FunctionTool.task",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex",
    "version": "0.61.0"
  },
  "attributes": {
    "traceloop.span.kind": "task",
    "traceloop.entity.name": "FunctionTool.task",
    "traceloop.entity.input": "{\"kwargs\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}}",
    "traceloop.entity.output": "{\"blocks\": [{\"block_type\": \"text\", \"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"flights\\\": [ ... ]}\"}], \"tool_name\": \"search_flights\"}",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The `traceloop.entity.output` attribute holds the chat history, from which AgentCore Evaluations reads the user prompt. The response comes from the model result on the last inference span.

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "31ea3d5882dac680",
  "name": "BaseWorkflowAgent.task",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.llamaindex",
    "version": "0.61.0"
  },
  "attributes": {
    "traceloop.span.kind": "task",
    "traceloop.entity.name": "BaseWorkflowAgent.task",
    "traceloop.entity.output": "{\"input\": [{\"role\": \"user\", \"blocks\": [{\"block_type\": \"text\", \"text\": \"Hey, how can you help me\"}]}], \"current_agent_name\": \"Agent\"}",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
### OpenInference

###### Example

Execute tool span
    

The `input.value` attribute holds the tool arguments (wrapped in `kwargs`), and the `output.value` attribute holds the tool result (wrapped in `blocks`).

```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "d5a1c9e70b46f312",
  "name": "FunctionTool.acall",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.llama_index",
    "version": "4.4.2"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "input.value": "{\"kwargs\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}}",
    "output.value": "{\"blocks\": [{\"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"flights\\\": [ ... ]}\"}], \"tool_name\": \"search_flights\"}",
    "session.id": "sea-nyc-trip-2-turns-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The message content is inline on the indexed attributes. The `–0—` attributes hold the system prompt and user prompt, and the `–1—` attributes hold the model output, from which AgentCore Evaluations extracts the text after `Answer:` as the agent response.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "c9f0a2b41d773e88",
  "name": "OpenAI.astream_chat",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.llama_index",
    "version": "4.4.2"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "llm.model_name": "gpt-4o-mini",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.0.message.content": "You are designed to help with a variety of tasks ...",
    "llm.input_messages.1.message.role": "user",
    "llm.input_messages.1.message.content": "Hey, how can you help me",
    "llm.output_messages.0.message.role": "assistant",
    "llm.output_messages.0.message.content": "Thought: ... Answer: I can help you plan your trip ...",
    "session.id": "sea-nyc-trip-2-turns-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
## Best practices for LlamaIndex agents

How you build and invoke a LlamaIndex agent affects what appears in its telemetry, and therefore how reliably the agent can be evaluated. The following practices help ensure the user prompt, agent response, and tool activity are recoverable.

  * **Use a LlamaIndex agent workflow.** Build your agent as a LlamaIndex agent workflow (for example, a `ReActAgent` or `FunctionAgent`) so that the framework emits a top-level workflow span with inference and tool child spans. AgentCore Evaluations reconstructs the invoke agent span from these child spans.

  * **Register tools as`FunctionTool` objects.** Define each tool as a LlamaIndex `FunctionTool` (or use `@tool`-style helpers that produce one). Tool spans are identified by their entity name, and their arguments and results are serialized in the `kwargs` and `blocks` structures AgentCore Evaluations unwraps.

  * **Keep tool results text-serializable.** Return tool results as strings or JSON-serializable values. LlamaIndex wraps them in a text block; keeping them serializable ensures the tool result is captured cleanly.

  * **For ReAct agents, use the standard output format.** AgentCore Evaluations extracts the final answer from the `Answer:` section of a ReAct agent’s output. Using the standard ReAct prompt (the LlamaIndex default) keeps the agent response recoverable.



