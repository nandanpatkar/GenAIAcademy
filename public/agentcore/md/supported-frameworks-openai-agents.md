# OpenAI Agents - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-openai-agents.html

---

# OpenAI Agents

This page explains how to instrument an [OpenAI Agents](<https://openai.github.io/openai-agents-python/>) agent, how spans are identified, and how evaluation fields are extracted.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From span attributes

  * Example spans in split telemetry

  * Example spans in unified telemetry


## Instrument your agent

You can instrument an OpenAI Agents agent with either of two instrumentation libraries: **OpenTelemetry** (`opentelemetry-instrumentation-openai-agents`) or **OpenInference** (`openinference-instrumentation-openai-agents`). Amazon Bedrock AgentCore Evaluations supports both libraries. The libraries emit different scope names and use different span attributes. The evaluation service extracts the same values from each.

When your agent runs with the AWS Distro for OpenTelemetry (ADOT), such as on Amazon Bedrock AgentCore Runtime, you do not need to add explicit instrumentation code. Adding the instrumentation library to your project’s dependencies is enough. ADOT discovers it at startup and activates it automatically.

Add the instrumentation library for the path you want to your dependencies. Use the latest available version unless you have a reason to pin.

###### Example

OpenTelemetry
    

NOTE: Use version `0.61.0` or later. This is the earliest version tested with the evaluation service.

Add `opentelemetry-instrumentation-openai-agents` to your dependencies. The scope name emitted is `opentelemetry.instrumentation.openai_agents`.

`requirements.txt`:

```text
opentelemetry-instrumentation-openai-agents>=0.61.0
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "opentelemetry-instrumentation-openai-agents>=0.61.0",
]
```
OpenInference
    

NOTE: Use version `1.5.0` or later. This is the earliest version tested with the evaluation service.

Add `openinference-instrumentation-openai-agents` to your dependencies. The scope name emitted is `openinference.instrumentation.openai_agents`.

`requirements.txt`:

```text
openinference-instrumentation-openai-agents>=1.5.0
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "openinference-instrumentation-openai-agents>=1.5.0",
]
```
###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

The attribute used to classify spans differs between the two instrumentation libraries.

###### Example

OpenTelemetry
    

The OpenTelemetry instrumentation library classifies spans using the `gen_ai.operation.name` attribute.

Span type | Identifying attribute  
---|---  
Invoke agent |  `gen_ai.operation.name` = `invoke_agent`  
Execute tool |  `gen_ai.operation.name` = `execute_tool`  
Inference |  `gen_ai.operation.name` = `chat`  
  
###### Note

OpenAI Agents also emits internal turn-boundary spans with `gen_ai.operation.name` = `unknown`. The evaluation service skips these.

OpenInference
    

The OpenInference instrumentation library classifies spans using the `openinference.span.kind` attribute.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `AGENT` or `CHAIN`  
Execute tool |  `openinference.span.kind` = `TOOL`  
Inference |  `openinference.span.kind` = `LLM`  
  
###### Note

With the OpenInference library, the `AGENT` and `CHAIN` spans are empty structural containers: they carry no conversation content. The user prompt and agent response are reconstructed from the inference (`LLM`) spans in the same trace.

## How evaluation fields are extracted

OpenAI Agents serializes messages in a parts-based format, in which each message carries a `parts` array of typed content blocks (for example, `[{"role": "user", "parts": [{"type": "text", "content": "…​"}]}]`). With the OpenTelemetry library, AgentCore Evaluations parses the text out of these parts. With the OpenInference library, the model output is the full OpenAI Response object, and AgentCore Evaluations reads the response text from `output[].content[].text`.

The location of this content depends on how telemetry was collected. The identifying attribute (`gen_ai.operation.name` or `openinference.span.kind`) is on the span in both cases. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

### From event records

With split telemetry, AgentCore Evaluations reads conversation content from the event record correlated to each span. The location of tool inputs and outputs differs between the two libraries:

  * **OpenTelemetry** :

    * **User prompt** and **agent response** : from the invoke agent span’s event record, in `body.input` and `body.output`.

    * **Tool call** : the tool name from `gen_ai.tool.name`, and the arguments and result from `gen_ai.tool.call.arguments` and `gen_ai.tool.call.result` on the execute tool span. With the OpenTelemetry library, tool arguments and results remain on the span attributes even with split telemetry.

  * **OpenInference** :

    * **User prompt** and **agent response** : reconstructed from the inference span’s event record. AgentCore Evaluations reads the messages from `body.input` and `body.output`, then backfills the empty invoke agent span with the user prompt and agent response.

    * **Tool call** : the tool name from `tool.name` on the execute tool span. The tool arguments and result come from that span’s event record, in `body.input` and `body.output`.


For more information, see Example spans in split telemetry.

### From span attributes

With unified telemetry, the same content stays on the span as attributes. The attributes depend on the instrumentation library:

  * **OpenTelemetry** :

    * **User prompt** and **agent response** : from `gen_ai.input.messages` and `gen_ai.output.messages` on the invoke agent span.

    * **Tool call** : the tool name from `gen_ai.tool.name`, and the arguments and result from `gen_ai.tool.call.arguments` and `gen_ai.tool.call.result`, on the execute tool span.

  * **OpenInference** :

    * **User prompt** and **agent response** : from the indexed message attributes on the inference span (`–0—` and `–1—`), then backfilled onto the empty invoke agent span.

    * **Tool call** : the tool name from `tool.name`, and the arguments and result from `input.value` and `output.value`, on the execute tool span.


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from an OpenAI Agents travel-planning agent deployed on Amazon Bedrock AgentCore Runtime. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Invoke agent span
    

The `gen_ai.operation.name` attribute (`invoke_agent`) identifies this as an invoke agent span.

```json
{
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "spanId": "3a300b0b3fe650e4",
  "name": "invoke_agent openaiOtelTravel",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.agent.name": "openaiOtelTravel",
    "gen_ai.system": "openai",
    "gen_ai.provider.name": "openai",
    "gen_ai.request.model": "gpt-4o-mini-2024-07-18",
    "session.id": "sea-nyc-trip-2-turns-openai-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the conversation. Each message’s `content` is the OpenAI parts-format array; the user prompt is the text of the user message and the agent response is the text of the assistant message.

```json
{
  "spanId": "3a300b0b3fe650e4",
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "[{\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Hey, how can you help me\"}]}]"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"text\", \"content\": \"I can assist you with planning your trips ...\"}]}]"
        }
      ]
    }
  }
}
```
Execute tool span
    

The `gen_ai.operation.name` attribute (`execute_tool`) identifies this as an execute tool span; `gen_ai.tool.name` holds the tool name. With the OpenTelemetry library, the tool arguments and result stay on the span attributes even with split telemetry.

```json
{
  "traceId": "6a01eefa5c52f3d86a35038f35f5ba30",
  "spanId": "3cbc4ea5f73fef81",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.type": "function",
    "gen_ai.tool.call.arguments": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "gen_ai.tool.call.result": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}",
    "session.id": "sea-nyc-trip-2-turns-openai-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The `gen_ai.operation.name` attribute (`chat`) identifies this as an inference span. This span carries the model metadata and, in `gen_ai.tool.definitions`, the list of tools available to the agent. The conversation messages for the model call live in the correlated event record, in `body.input` and `body.output`.


```json
{
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "spanId": "7c1f9a2b4d6e8a03",
  "name": "openai.response",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "chat",
    "gen_ai.provider.name": "openai",
    "gen_ai.request.model": "gpt-4o-mini-2024-07-18",
    "gen_ai.response.model": "gpt-4o-mini-2024-07-18",
    "gen_ai.usage.input_tokens": 269,
    "gen_ai.usage.output_tokens": 78,
    "gen_ai.tool.definitions": "[{\"type\": \"function\", \"function\": {\"name\": \"search_flights\", \"description\": \"Search for available flights between cities.\", \"parameters\": { ... }}}]",
    "session.id": "sea-nyc-trip-2-turns-openai-otel"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "7c1f9a2b4d6e8a03",
  "traceId": "6a01eef11066751d68f90def0da1f80a",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "[{\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Hey, how can you help me\"}]}]"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"text\", \"content\": \"I can assist you with planning your trips ...\"}]}]"
        }
      ]
    }
  }
}
```
 

### OpenInference

With the OpenInference library, the invoke agent (`AGENT`) span is an empty container. AgentCore Evaluations reconstructs the user prompt and agent response from the inference (`LLM`) span, whose content lives in a correlated event record.

###### Example

Invoke agent span
    

The `openinference.span.kind` attribute (`AGENT`) identifies this as an invoke agent span. The span carries no conversation content.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "9a1c7dce81b692cd",
  "name": "openaiOInfTravel",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.openai_agents",
    "version": "1.5.0"
  },
  "attributes": {
    "openinference.span.kind": "AGENT",
    "graph.node.id": "openaiOInfTravel",
    "llm.system": "openai",
    "session.id": "sea-nyc-trip-2-turns-openai-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `openinference.span.kind` attribute (`TOOL`) identifies this as an execute tool span; `tool.name` holds the tool name. The tool arguments and result live in the correlated event record.


```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "b4e78cb0a06a6fe2",
  "name": "search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.openai_agents",
    "version": "1.5.0"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "input.mime_type": "application/json",
    "output.mime_type": "application/json",
    "session.id": "sea-nyc-trip-2-turns-openai-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "b4e78cb0a06a6fe2",
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "scope": {
    "name": "openinference.instrumentation.openai_agents"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}" }
      ]
    },
    "output": {
      "messages": [
        { "role": "assistant", "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}" }
      ]
    }
  }
}
```
 
Inference span
    

The `openinference.span.kind` attribute (`LLM`) identifies this as an inference span. Message roles and tool definitions are on the span attributes; the message content lives in the correlated event record. ADOT flattens the input roles to `user`, so AgentCore Evaluations uses the last plain-text input message as the user prompt. The output message is the OpenAI Response object, from which AgentCore Evaluations reads the response text.


```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "1221a062c7f90a8e",
  "name": "response",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.openai_agents",
    "version": "1.5.0"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "llm.model_name": "gpt-4o-mini-2024-07-18",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.1.message.role": "user",
    "llm.output_messages.0.message.role": "assistant",
    "llm.tools.0.tool.json_schema": "{\"type\": \"function\", \"function\": {\"name\": \"search_flights\", ...}}",
    "session.id": "sea-nyc-trip-2-turns-openai-oi"
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
    "name": "openinference.instrumentation.openai_agents"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "[{\"content\": \"Hey, how can you help me\", \"role\": \"user\"}]" },
        { "role": "user", "content": "You are a travel planning assistant. Help users plan trips ..." },
        { "role": "user", "content": "Hey, how can you help me" }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": "{\"id\": \"resp_abc123...\", \"output\": [{\"type\": \"message\", \"content\": [{\"type\": \"output_text\", \"text\": \"I can assist you with planning your trips ...\"}]}]}"
        }
      ]
    }
  }
}
```
 

## Example spans in unified telemetry

With unified telemetry, the same content stays on the span attributes and no separate event record is produced. The following examples are from an OpenAI Agents travel-planning agent. The same agent is shown under each instrumentation library.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

### OpenTelemetry

###### Example

Invoke agent span
    

The `gen_ai.input.messages` attribute holds the user prompt, and the `gen_ai.output.messages` attribute holds the agent response. Both are OpenAI parts-format arrays.

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "50656fd77904d125",
  "name": "invoke_agent openaiOtelTravel",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.agent.name": "openaiOtelTravel",
    "gen_ai.system": "openai",
    "gen_ai.input.messages": "[{\"role\": \"user\", \"parts\": [{\"type\": \"text\", \"content\": \"Hey, how can you help me\"}]}]",
    "gen_ai.output.messages": "[{\"role\": \"assistant\", \"parts\": [{\"type\": \"text\", \"content\": \"I can assist you with planning your trips ...\"}]}]",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `gen_ai.tool.call.arguments` attribute holds the tool arguments, and the `gen_ai.tool.call.result` attribute holds the tool result.

```json
{
  "traceId": "6a4de7c376913db82e6f0f336a16731d",
  "spanId": "8840e8e23724ebd7",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.call.arguments": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "gen_ai.tool.call.result": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The `gen_ai.operation.name` attribute (`chat`) identifies this as an inference span. The model metadata and the `gen_ai.tool.definitions` attribute (the list of tools available to the agent) stay inline on the span.

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "9b2c1e5f7a3d0846",
  "name": "openai.response",
  "kind": "INTERNAL",
  "scope": {
    "name": "opentelemetry.instrumentation.openai_agents",
    "version": "0.62.1"
  },
  "attributes": {
    "gen_ai.operation.name": "chat",
    "gen_ai.provider.name": "openai",
    "gen_ai.request.model": "gpt-4o-mini-2024-07-18",
    "gen_ai.response.model": "gpt-4o-mini-2024-07-18",
    "gen_ai.usage.input_tokens": 269,
    "gen_ai.usage.output_tokens": 78,
    "gen_ai.tool.definitions": "[{\"type\": \"function\", \"function\": {\"name\": \"search_flights\", \"description\": \"Search for available flights between cities.\", \"parameters\": { ... }}}]",
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
    

The `input.value` attribute holds the tool arguments, and the `output.value` attribute holds the tool result.

```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "d5a1c9e70b46f312",
  "name": "search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.openai_agents",
    "version": "1.5.1"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "search_flights",
    "input.value": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "output.value": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}",
    "session.id": "sea-nyc-trip-2-turns-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The message content is inline on the indexed attributes. The `–0—` attributes hold the system prompt and user prompt, and the `–1—` attributes hold the agent response. AgentCore Evaluations reconstructs the user prompt and agent response from this span and backfills the empty invoke agent (`AGENT`) span.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "c9f0a2b41d773e88",
  "name": "response",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.openai_agents",
    "version": "1.5.1"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "llm.model_name": "gpt-4o-mini-2024-07-18",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.0.message.content": "You are a travel planning assistant ...",
    "llm.input_messages.1.message.role": "user",
    "llm.input_messages.1.message.content": "Hey, how can you help me",
    "llm.output_messages.0.message.role": "assistant",
    "llm.output_messages.0.message.contents.0.message_content.text": "I can assist you with planning your trips ...",
    "session.id": "sea-nyc-trip-2-turns-oi"
  },
  "status": {
    "code": "OK"
  }
}
```
