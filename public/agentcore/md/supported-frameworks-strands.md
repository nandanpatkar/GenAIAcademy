# Strands Agents - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-strands.html

---

# Strands Agents

This page explains how to instrument a [Strands Agents](<https://strandsagents.com/latest/>) agent, how spans are identified, and how evaluation fields are extracted.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From inline span events

  * Example spans in split telemetry

  * Example spans in unified telemetry


## Instrument your agent

The Strands Agents SDK includes built-in telemetry and requires no additional instrumentation library. It produces spans and event records under the scope name `strands.telemetry.tracer`. When deployed on Amazon Bedrock AgentCore Runtime with the AWS Distro for OpenTelemetry (ADOT), the Runtime injects the `session.id` attribute and exports spans and event records automatically.

###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

Strands sets the `gen_ai.operation.name` attribute on each span. The evaluation service uses this attribute to classify spans:

Span type | Identifying attribute | Example span name  
---|---|---  
Invoke agent |  `gen_ai.operation.name` = `invoke_agent` |  `invoke_agent TravelAgent`  
Execute tool |  `gen_ai.operation.name` = `execute_tool` |  `execute_tool search_flights`  
Inference |  `gen_ai.operation.name` = `chat` |  `chat`  
  
## How evaluation fields are extracted

Where the conversation content sits depends on the telemetry delivery mode. With split telemetry, the content is in a separate event record. With unified telemetry, the content stays on the span, as events attached to it. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>). The identifying attribute (`gen_ai.operation.name`) is on the span in both modes.

### From event records

With split telemetry, the service reads content from the event record correlated to each span:

  * **User prompt** : from the agent input messages (`input.messages`), the content of the message with a user role.

  * **Agent response** : from the agent output messages (`output.messages`), the content of the message with an assistant role.

  * **Tool call** : the tool name from the `gen_ai.tool.name` attribute on the execute tool span. The tool arguments and result come from that span’s event record (`input` and `output`).


For more information, see Example spans in split telemetry.

### From inline span events

With unified telemetry, the same content is carried in inline span events instead of a separate event record:

  * **User prompt** : from the `gen_ai.user.message` event, the `content` attribute.

  * **Agent response** : from the `gen_ai.choice` event, the `message` attribute.

  * **Tool call** : the tool name from the `gen_ai.tool.name` attribute on the span. The tool arguments come from the `gen_ai.tool.message` event, and the result comes from the `gen_ai.choice` event.


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from a Strands travel-planning agent deployed on Amazon Bedrock AgentCore Runtime.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `gen_ai.operation.name` attribute (`invoke_agent`) identifies this as an invoke agent span. The `gen_ai.agent.tools` attribute lists the tools available to the agent.

```json
{
  "traceId": "69e9cc4771d7cabe0d8e8cea33b6b338",
  "spanId": "d24936b8989b6d42",
  "parentSpanId": "0ff3498548044e4b",
  "name": "invoke_agent TravelAgent",
  "kind": "INTERNAL",
  "scope": {
    "name": "strands.telemetry.tracer",
    "version": ""
  },
  "startTimeUnixNano": 1776929864011990383,
  "endTimeUnixNano": 1776929869634304466,
  "durationNano": 5622314083,
  "attributes": {
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.system": "strands-agents",
    "gen_ai.agent.name": "TravelAgent",
    "gen_ai.request.model": "us.anthropic.claude-sonnet-4-20250514-v1:0",
    "gen_ai.usage.input_tokens": 983,
    "gen_ai.usage.output_tokens": 232,
    "gen_ai.usage.total_tokens": 1215,
    "gen_ai.agent.tools": "[\"search_flights\", \"book_flight\", \"search_hotels\", \"book_hotel\", \"search_activities\", \"book_activity\"]",
    "session.id": "sea-nyc-trip-2-turns-adot_v17-20260423003743"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the conversation content. The user prompt is the user-role message in `input.messages`, and the agent response is the assistant-role message in `output.messages`.

```json
{
  "spanId": "d24936b8989b6d42",
  "traceId": "69e9cc4771d7cabe0d8e8cea33b6b338",
  "scope": {
    "name": "strands.telemetry.tracer"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "user",
          "content": "Hey, how can you help me"
        }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": {
            "message": "Hi there! I'm your travel planning assistant ...",
            "finish_reason": "end_turn"
          }
        }
      ]
    }
  }
}
```
Execute tool span
    

The `gen_ai.operation.name` attribute (`execute_tool`) identifies this as an execute tool span. The `gen_ai.tool.name` attribute holds the tool name.

```json
{
  "traceId": "69e9cc4d132b180909ba49f613f273dd",
  "spanId": "fff785ce12d6fda8",
  "parentSpanId": "96915bf5ecc78743",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "strands.telemetry.tracer",
    "version": ""
  },
  "startTimeUnixNano": 1776929872258292842,
  "endTimeUnixNano": 1776929872259611427,
  "durationNano": 1318585,
  "attributes": {
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.call.id": "tooluse_hiWwdtThuD67G5cK8cp5mj",
    "gen_ai.tool.status": "success",
    "gen_ai.tool.description": "Search for available flights between cities.",
    "session.id": "sea-nyc-trip-2-turns-adot_v17-20260423003743"
  },
  "status": {
    "code": "OK"
  }
}
```
The correlated event record carries the tool input (arguments) and output (result).

```json
{
  "spanId": "fff785ce12d6fda8",
  "traceId": "69e9cc4d132b180909ba49f613f273dd",
  "scope": {
    "name": "strands.telemetry.tracer"
  },
  "body": {
    "input": {
      "messages": [
        {
          "role": "tool",
          "content": {
            "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
            "role": "tool",
            "id": "tooluse_hiWwdtThuD67G5cK8cp5mj"
          }
        }
      ]
    },
    "output": {
      "messages": [
        {
          "role": "assistant",
          "content": {
            "message": "[{\"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}]",
            "id": "tooluse_hiWwdtThuD67G5cK8cp5mj"
          }
        }
      ]
    }
  }
}
```
## Example spans in unified telemetry

With unified telemetry, the same content is carried in inline span events on the span, with no separate event record. The following examples are from a Strands travel-planning agent.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `gen_ai.user.message` event holds the user prompt, and the `gen_ai.choice` event holds the agent response.

```json
{
  "traceId": "69e9cc4771d7cabe0d8e8cea33b6b338",
  "spanId": "d2ee0e4765cc773e",
  "name": "invoke_agent TravelAgent",
  "kind": "INTERNAL",
  "scope": {
    "name": "strands.telemetry.tracer"
  },
  "attributes": {
    "gen_ai.operation.name": "invoke_agent",
    "gen_ai.agent.name": "TravelAgent",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "events": [
    {
      "name": "gen_ai.user.message",
      "attributes": {
        "content": "[{\"text\": \"Hey, how can you help me\"}]"
      }
    },
    {
      "name": "gen_ai.choice",
      "attributes": {
        "message": "Hi there! I'm your travel planning assistant ...",
        "finish_reason": "end_turn"
      }
    }
  ]
}
```
Execute tool span
    

The `gen_ai.tool.message` event holds the tool arguments, and the `gen_ai.choice` event holds the tool result.

```json
{
  "traceId": "69e9cc4d132b180909ba49f613f273dd",
  "spanId": "0a988e27758ebb53",
  "name": "execute_tool search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "strands.telemetry.tracer"
  },
  "attributes": {
    "gen_ai.operation.name": "execute_tool",
    "gen_ai.tool.name": "search_flights",
    "gen_ai.tool.call.id": "tooluse_JuGterOaZfQV2c55Rp3S7C",
    "gen_ai.tool.status": "success",
    "session.id": "sea-nyc-trip-2-turns-unified"
  },
  "events": [
    {
      "name": "gen_ai.tool.message",
      "attributes": {
        "content": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
        "role": "tool",
        "id": "tooluse_JuGterOaZfQV2c55Rp3S7C"
      }
    },
    {
      "name": "gen_ai.choice",
      "attributes": {
        "message": "[{\"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}]",
        "id": "tooluse_JuGterOaZfQV2c55Rp3S7C"
      }
    }
  ]
}
```
