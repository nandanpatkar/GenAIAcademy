# Claude Agent SDK - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-claude-agent-sdk.html

---

# Claude Agent SDK

This page explains how to instrument a [Claude Agent SDK](<https://docs.claude.com/en/api/agent-sdk/overview>) agent, how spans are identified, and how evaluation fields are extracted.

**Topics**

  * Instrument your agent

  * How spans are identified

  * How evaluation fields are extracted

    * From event records

    * From span attributes

  * Example spans in split telemetry

  * Example spans in unified telemetry


## Instrument your agent

You can instrument a Claude Agent SDK agent with the **OpenInference** instrumentation library (`openinference-instrumentation-claude-agent-sdk`). This library emits telemetry under the scope name `openinference.instrumentation.claude_agent_sdk`, which Amazon Bedrock AgentCore Evaluations reads.

When your agent runs with the AWS Distro for OpenTelemetry (ADOT), such as on Amazon Bedrock AgentCore Runtime, you do not need to add explicit instrumentation code. Adding the instrumentation library to your project’s dependencies is enough. ADOT discovers it at startup and activates it automatically.

Add the instrumentation library to your dependencies.

###### Note

Use version `0.1.3` or later. This is the earliest version tested with the evaluation service.

`requirements.txt`:

```text
openinference-instrumentation-claude-agent-sdk>=0.1.3
```
`pyproject.toml`:

```text
[project]
dependencies = [
    "openinference-instrumentation-claude-agent-sdk>=0.1.3",
]
```
###### Note

Instrumentation is one step in setting up observability. To export telemetry for evaluation, complete the full setup in [Set up observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html#supported-frameworks-setup>).

## How spans are identified

Claude Agent SDK is instrumented with the OpenInference convention, so AgentCore Evaluations classifies spans using the `openinference.span.kind` attribute.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `AGENT`  
Execute tool |  `openinference.span.kind` = `TOOL`  
  
The Claude Agent SDK emits only `AGENT` and `TOOL` spans; it does not emit separate inference (`LLM`) spans. The model metadata (model name, token usage) and the agent response are carried on the `AGENT` span itself.

## How evaluation fields are extracted

The Claude Agent SDK produces clean, plain-text agent input and output, so the user prompt and agent response require no special parsing. Tool results, however, arrive as Anthropic content blocks in the form `[{"type": "text", "text": "…​"}]`. AgentCore Evaluations unwraps these blocks and concatenates their text.

The location of this content depends on how telemetry was collected. The identifying attribute (`openinference.span.kind`) is on the span in both cases. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

### From event records

With split telemetry, AgentCore Evaluations reads content from the event record correlated to each span:

  * **User prompt** and **agent response** : from the invoke agent span’s event record, in `body.input` and `body.output`.

  * **Tool call** : the tool name from the `tool.name` attribute and the tool call ID from `tool.id` on the execute tool span. The tool arguments and result come from that span’s event record, in `body.input` and `body.output`. AgentCore Evaluations unwraps the Anthropic content blocks in the tool result.


For more information, see Example spans in split telemetry.

### From span attributes

With unified telemetry, the same content stays on the span as attributes:

  * **User prompt** and **agent response** : from `input.value` and `output.value` on the invoke agent span.

  * **Tool call** : the tool name from `tool.name`, the tool call ID from `tool.id`, the arguments from `input.value`, and the result from `output.value`, on the execute tool span. AgentCore Evaluations unwraps the Anthropic content blocks in the tool result.


For more information, see Example spans in unified telemetry.

## Example spans in split telemetry

With split telemetry, the span carries the identifying attributes and the content lives in a correlated event record. The following examples are from a Claude Agent SDK travel-planning agent deployed on Amazon Bedrock AgentCore Runtime.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `openinference.span.kind` attribute (`AGENT`) identifies this as an invoke agent span. The span carries the model metadata; the conversation content lives in the correlated event record.


```json
{
  "traceId": "6a292d74406894815807e2751e61dd49",
  "spanId": "a63aab3320ed8718",
  "name": "ClaudeAgentSDK.ClaudeSDKClient.receive_response",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk",
    "version": "0.1.5"
  },
  "attributes": {
    "openinference.span.kind": "AGENT",
    "llm.system": "anthropic",
    "llm.model_name": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "input.mime_type": "text/plain",
    "output.mime_type": "text/plain",
    "session.id": "sea-nyc-trip-2-turns-claude-adot"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "a63aab3320ed8718",
  "traceId": "6a292d74406894815807e2751e61dd49",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk"
  },
  "body": {
    "input": {
      "messages": [
        { "role": "user", "content": "Hey, how can you help me" }
      ]
    },
    "output": {
      "messages": [
        { "role": "assistant", "content": "Hello! I'm your travel planning assistant ..." }
      ]
    }
  }
}
```
 
Execute tool span
    

The `openinference.span.kind` attribute (`TOOL`) identifies this as an execute tool span; `tool.name` holds the tool name and `tool.id` the tool call ID. The tool result lives in the correlated event record as Anthropic content blocks, which AgentCore Evaluations unwraps.


```json
{
  "traceId": "6a292deb7450b3155895da4f38cb579a",
  "spanId": "909dcb4eb5f851ae",
  "name": "mcp__travel__search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk",
    "version": "0.1.5"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "mcp__travel__search_flights",
    "tool.id": "toolu_bdrk_01KmJhCRuEJJo6fswHbjCgFp",
    "tool.parameters": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "input.mime_type": "application/json",
    "output.mime_type": "application/json",
    "session.id": "sea-nyc-trip-2-turns-claude-adot"
  },
  "status": {
    "code": "OK"
  }
}
```
 
```json
{
  "spanId": "909dcb4eb5f851ae",
  "traceId": "6a292deb7450b3155895da4f38cb579a",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk"
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
          "content": "[{\"type\": \"text\", \"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}]"
        }
      ]
    }
  }
}
```
 

## Example spans in unified telemetry

With unified telemetry, the same content stays on the span attributes and no separate event record is produced. The following examples are from a Claude Agent SDK travel-planning agent.

###### Note

These examples are not complete spans. They show representative data from a real agent interaction, with some fields omitted and long values truncated for readability.

###### Example

Invoke agent span
    

The `input.value` attribute holds the user prompt, and the `output.value` attribute holds the agent response, both as plain text.

```json
{
  "traceId": "561876bb17e9eaeb2f194ee515742b2f",
  "spanId": "3b6815f5b3909a51",
  "name": "ClaudeAgentSDK.ClaudeSDKClient.receive_response",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk",
    "version": "0.1.3"
  },
  "attributes": {
    "openinference.span.kind": "AGENT",
    "llm.system": "anthropic",
    "llm.model_name": "us.anthropic.claude-sonnet-4-5-20250929-v1:0",
    "input.value": "Hey, how can you help me",
    "input.mime_type": "text/plain",
    "output.value": "Hi there! ... How can I help you plan your next adventure?",
    "output.mime_type": "text/plain",
    "session.id": "sea-nyc-trip-2-turns-claude-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
Execute tool span
    

The `input.value` attribute holds the tool arguments, and the `output.value` attribute holds the tool result as Anthropic content blocks, which AgentCore Evaluations unwraps.

```json
{
  "traceId": "7bb7e59a30d03fc0b9da5bf009a3b429",
  "spanId": "d27b488965bbba99",
  "name": "mcp__travel__search_flights",
  "kind": "INTERNAL",
  "scope": {
    "name": "openinference.instrumentation.claude_agent_sdk",
    "version": "0.1.3"
  },
  "attributes": {
    "openinference.span.kind": "TOOL",
    "tool.name": "mcp__travel__search_flights",
    "tool.id": "toolu_bdrk_019yE7Gne1rZKE3UnVPAWjLq",
    "tool.parameters": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "input.value": "{\"origin\": \"SEA\", \"destination\": \"NYC\", \"date\": \"2025-03-15\"}",
    "input.mime_type": "application/json",
    "output.value": "[{\"type\": \"text\", \"text\": \"{\\\"origin\\\": \\\"SEA\\\", \\\"destination\\\": \\\"NYC\\\", \\\"flights\\\": [ ... ]}\"}]",
    "output.mime_type": "application/json",
    "session.id": "sea-nyc-trip-2-turns-claude-unified"
  },
  "status": {
    "code": "OK"
  }
}
```
