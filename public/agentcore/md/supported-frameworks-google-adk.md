# Google ADK - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-google-adk.html

---

# Google ADK

This page explains how to instrument a [Google Agent Development Kit (ADK)](<https://google.github.io/adk-docs/>) agent, how spans are identified, and how evaluation fields are extracted.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From span attributes

  * Example spans in split telemetry

  * Example spans in unified telemetry


## Instrument your agent

You can instrument a Google ADK agent with the **OpenInference** instrumentation library (`openinference-instrumentation-google-adk`). This library emits telemetry under the scope name `openinference.instrumentation.google_adk`, which Amazon Bedrock AgentCore Evaluations reads.

When your agent runs with the AWS Distro for OpenTelemetry (ADOT), such as on Amazon Bedrock AgentCore Runtime, you do not need to add explicit instrumentation code. Adding the instrumentation library to your project’s dependencies is enough. ADOT discovers it at startup and activates it automatically.

Add the instrumentation library to your dependencies.

###### Note

Use version `0.1.13` or later. This is the earliest version tested with the evaluation service.

`requirements.txt`:

```text
openinference-instrumentation-google-adk>=0.1.13
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "openinference-instrumentation-google-adk>=0.1.13",
]
```
###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

Google ADK is instrumented with the OpenInference convention, so AgentCore Evaluations classifies spans using the `openinference.span.kind` attribute.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `CHAIN` or `AGENT`  
Execute tool |  `openinference.span.kind` = `TOOL`  
Inference |  `openinference.span.kind` = `LLM`  
  
Google ADK emits a nested span tree: an outer `invocation` span (`CHAIN`) wraps an `agent_run` span (`AGENT`), which in turn wraps the `call_llm` (`LLM`) and `execute_tool` (`TOOL`) spans. The outer `CHAIN` span carries the user prompt; AgentCore Evaluations uses it as the invoke agent span.

## How evaluation fields are extracted

Google ADK wraps its conversation content in the Gemini content format. The user prompt is nested under a `new_message` object as `{"new_message": {"parts": [{"text": "…​"}], "role": "user"}}`, and the agent response is nested under a `content` object as `{"content": {"parts": [{"text": "…​"}], "role": "model"}}`. AgentCore Evaluations unwraps these structures and joins the `parts` text with newlines. Tool definitions arrive as a serialized Gemini request; AgentCore Evaluations reads the available tools from `config.tools[].function_declarations[]`.

The location of this content depends on how telemetry was collected. The identifying attribute (`openinference.span.kind`) is on the span in both cases. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

### From event records

With split telemetry, AgentCore Evaluations reads content from the event record correlated to each span:

  * **User prompt** : from the invoke agent span’s event record, in `body.input`. AgentCore Evaluations unwraps the `new_message.parts` text.

  * **Agent response** : from the invoke agent span’s event record, in `body.output`. AgentCore Evaluations unwraps the `content.parts` text.

  * **Tool call** : the tool name from the `tool.name` attribute on the execute tool span. The tool arguments and result come from that span’s event record, in `body.input` and `body.output`.


For more information, see Example spans in split telemetry.

### From span attributes

With unified telemetry, the same content stays on the span as attributes:

  * **User prompt** and **agent response** : from `input.value` and `output.value` on the invoke agent span. AgentCore Evaluations unwraps the `new_message.parts` and `content.parts` text.

  * **Tool call** : the tool name from `tool.name`, and the arguments and result from `input.value` and `output.value`, on the execute tool span.


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from a Google ADK travel-planning agent deployed on Amazon Bedrock AgentCore Runtime.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `openinference.span.kind` attribute (`CHAIN`) on the outer `invocation` span identifies this as an invoke agent span. The span carries no conversation content; it lives in the correlated event record.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "70f2e87a30c34420",
  "name": "invocation",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.14"
  },
  "attributes": {
    "openinference.span.kind": "CHAIN",
    "input.mime_type": "application/json",
    "output.mime_type": "application/json",
    "user.id": "default_user",
    "session.id": "sea-nyc-trip-2-turns-google-adk-adot"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the conversation. The user prompt is nested under `new_message.parts`, and the agent response is nested under `content.parts`.

```json
{
  "spanId": "70f2e87a30c34420",
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "scope": {
    "name": "openinference.instrumentation.google_adk"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "{\"new_message\": {\"parts\": [{\"text\": \"Hey, how can you help me\"}], \"role\": \"user\"}, \"state_delta\": null, \"run_config\": null}"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": "{\"model_version\": \"gemini-2.5-flash\", \"content\": {\"parts\": [{\"text\": \"I can help you with your travel plans! I can:\\n- Search and book flights\\n- Find and book hotels\\n- Suggest and book activities\"}], \"role\": \"model\"}, \"finish_reason\": \"STOP\"}"
        }
      ]
    }
  }
}
```
Execute tool span
    

The `openinference.span.kind` attribute (`TOOL`) identifies this as an execute tool span; `tool.name` holds the tool name. The tool arguments and result live in the correlated event record.


```json
{
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "spanId": "9028a8dd94943456",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.14"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.type": "FunctionTool",
    "gen_ai.tool.call.id": "adk-12345678-1234-1234-1234-123456789012",
    "tool.name": "search_flights",
    "tool.parameters": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "session.id": "sea-nyc-trip-2-turns-google-adk-adot"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "9028a8dd94943456",
  "traceId": "6a387ef07b8f4f3732fab45d3c0b51ff",
  "scope": {
    "name": "openinference.instrumentation.google_adk"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}" }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": "{\"id\": \"adk-12345678-...\", \"name\": \"search_flights\", \"response\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}}"
        }
      ]
    }
  }
}
```
 
Inference span
    

The `openinference.span.kind` attribute (`LLM`) on the `call_llm` span identifies this as an inference span. It carries the model metadata and, in the indexed `–0—` and `–1—` attributes, the messages for the model call.

```json
{
  "traceId": "6a387ee61078243c1cc455ed45c6c313",
  "spanId": "1c4e5f8a2b9d0e73",
  "name": "call_llm",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.14"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "gen_ai.operation.name": "generate_content",
    "gen_ai.request.model": "gemini-2.5-flash",
    "llm.model_name": "gemini-2.5-flash",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.1.message.role": "user",
    "llm.input_messages.1.message.contents.0.message_content.text": "Hey, how can you help me",
    "llm.output_messages.0.message.role": "model",
    "llm.output_messages.0.message.contents.0.message_content.text": "I can help you plan your trip ...",
    "session.id": "sea-nyc-trip-2-turns-google-adk-adot"
  },
  "status": {
    "code": "OK"
  }
}
```
## Example spans in unified telemetry

With unified telemetry, the same content stays on the span attributes and no separate event record is produced. The following examples are from a Google ADK travel-planning agent.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `input.value` attribute holds the user prompt (nested under `new_message.parts`), and the `output.value` attribute holds the agent response (nested under `content.parts`).

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "31ea3d5882dac680",
  "name": "invocation",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.13"
  },
  "attributes": {
    "openinference.span.kind": "CHAIN",
    "input.value": "{\"user_id\": \"test_user\", \"session_id\": \"sea-nyc-trip-2-turns-google-adk-unified\", \"new_message\": {\"parts\": [{\"text\": \"Hey, how can you help me\"}], \"role\": \"user\"}}",
    "input.mime_type": "application/json",
    "output.value": "{\"model_version\": \"gemini-2.5-flash\", \"content\": {\"parts\": [{\"text\": \"I can help you plan your trip! I can:\\n- Search and book flights\\n- Find and book hotels\\n- Suggest and book activities\"}], \"role\": \"model\"}, \"finish_reason\": \"STOP\"}",
    "output.mime_type": "application/json",
    "session.id": "sea-nyc-trip-2-turns-google-adk-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `input.value` attribute holds the tool arguments, and the `output.value` attribute holds the tool result.

```json
{
  "traceId": "6a4de7c376913db82e6f0f336a16731d",
  "spanId": "b64c37adefae74f0",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.13"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.call.id": "adk-12345678-1234-1234-1234-123456789012",
    "tool.name": "search_flights",
    "tool.parameters": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "input.value": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "output.value": "{\"id\": \"adk-12345678-...\", \"name\": \"search_flights\", \"response\": {\"origin\": \"SEA\", \"destination\": \"NYC\", \"flights\": [ ... ]}}",
    "session.id": "sea-nyc-trip-2-turns-google-adk-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Inference span
    

The `openinference.span.kind` attribute (`LLM`) on the `call_llm` span identifies this as an inference span. The messages for the model call are inline on the indexed `–0—` and `–1—` attributes.

```json
{
  "traceId": "6a4de7b85e61747e6b568a1f4768e89d",
  "spanId": "2d5f6a9b3c0e1f84",
  "name": "call_llm",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.google_adk",
    "version": "0.1.13"
  },
  "attributes": {
    "openinference.span.kind": "LLM",
    "gen_ai.operation.name": "generate_content",
    "gen_ai.request.model": "gemini-2.5-flash",
    "llm.model_name": "gemini-2.5-flash",
    "llm.input_messages.0.message.role": "system",
    "llm.input_messages.1.message.role": "user",
    "llm.input_messages.1.message.contents.0.message_content.text": "Hey, how can you help me",
    "llm.output_messages.0.message.role": "model",
    "llm.output_messages.0.message.contents.0.message_content.text": "I can help you plan your trip ...",
    "session.id": "sea-nyc-trip-2-turns-google-adk-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
