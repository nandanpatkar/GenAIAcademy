# Understanding input spans - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/understanding-input-spans.html

---

# Understanding input spans

The `evaluate` API accepts a list of `sessionSpans` , which consists of two types of entities: spans and events

###### Topics

  * Spans and events

  * Example spans and events


## Spans and events

The evaluation service processes two types of telemetry data to understand your agent’s behavior and performance.

###### Topics

  * Spans

  * Events

  * Span structure

  * Event structure


### Spans

Spans contain metadata about individual operations, including attributes, scope information, timestamps, and resource identifiers. Spans are available in `aws/spans` log group.

### Events

Events contain payload information in the `body` field, including inputs and outputs from models, tools, and the agent. For agent hosted on AgentCore Runtime, events are stored in `/aws/bedrock-agentcore/runtimes/agent_id-endpoint_name` log group. For agents hosted outside AgentCore Runtime, events are stored in the log group configured by `OTEL_EXPORTER_OTLP_LOGS_HEADERS` environment variable.

###### Note

To evaluate a session, both spans and the corresponding events are required. Not all spans will have events, but the ones with the supported scopes should include corresponding events, else the service will throw a `ValidationException`.

### Span structure

Spans follow a standardized structure with required and optional fields that provide context about operations in your agent workflow.

###### Topics

  * Attribute variations

  * Supported scopes


#### Attribute variations

The information present in span attributes varies based on the agent framework and instrumentation library used.

#### Supported scopes

The scope name determines whether the service can process the span. The following scopes are currently supported:

  * `strands.telemetry.tracer`

  * `opentelemetry.instrumentation.langchain`

  * `openinference.instrumentation.langchain`


```json
{
    "spanId": "string"                 ## required
    "traceId": "string",               ## required
    "parentSpanId": "string",
    "name": "string"                   ## required
    "scope": {
        "name": "string"               ## required
    },
    "startTimeUnixNano": "epoch time", ## required
    "endTimeUnixNano": "epoch time",   ## required
    "durationNano": "epoch time",
    "attributes": {                    ## required
        "session.id": "string",        ## required
        "string": "string"
    },
    "status": {
        "code": "string"
    },
    "kind": "string",
    "resource": {
        "attributes": {
            "string": "string",
            "string": "string"
        }
    },
}
```
### Event structure

Span events are associated with spans using `spanId` and `traceId` . The event’s scope name is used to determine whether it contains the information required for evaluation.

```json
{
    "spanId": "string",         ## required
    "traceId": "string",        ## required
    "scope": {
        "name": "string"        ## required
    },
    "body": "Any",              ## required for supported scopes (refer below section)
    "attributes": {
        "event.name": "string", ## required
        "session.id": "string"  ## required
    },
    "resource": {
        "attributes": {
            "string": "string",
            "string": "string"
        }
    },
    "timeUnixNano": "epoch time",
    "observedTimeUnixNano": "epoch time",
    "severityNumber": "int",
    "severityText": "string",
}
```
###### Topics

  * Event body schema


#### Event body schema

For events with supported scopes, the `body` field follows this schema. **The actual values in the content field vary depending on the framework and instrumentation library used.**

```json
{
    "body": {
        "output": {
            "messages": [
                {
                    "content": "string/dict" # depends on framework/instrumentation
                    "role": "string"
                }
            ]
        },
        "input": {
            "messages": [
                {
                    "content": "string/dict" # depends on framework/instrumentation
                    "role": "string"
                }
            ]
        }
    }
}
```
## Example spans and events

Below are example spans and their corresponding events for the demo agent created and deployed in AgentCore Runtime as per the getting started guide. The examples demonstrate

  * InvokeAgent spans used for trace level evaluations

  * ExecuteTool spans used for tool level evaluations


###### Example

Strands Agents
    

  1. Attribute `"gen_ai.operation.name": "invoke_agent"` is used to identify agent-invocation spans

```text
## Example invoke_agent span for strands agent
{
  "spanId": "e79d2156ac138f63",
  "traceId": "691e400b638f5225711e80da37a4b0bd",
  "resource": {
      "attributes": {
          "deployment.environment.name": "bedrock-agentcore:default",
          "aws.local.service": "agentcore_evaluation_demo.DEFAULT",
          "service.name": "agentcore_evaluation_demo.DEFAULT",
          "cloud.region": "us-east-1",
          "aws.log.stream.names": "otel-rt-logs",
          "telemetry.sdk.name": "opentelemetry",
          "aws.service.type": "gen_ai_agent",
          "telemetry.sdk.language": "python",
          "cloud.provider": "aws",
          "cloud.resource_id": "agent-arn",
          "aws.log.group.names": "/aws/bedrock-agentcore/runtimes/agent-id",
          "telemetry.sdk.version": "1.33.1",
          "cloud.platform": "aws_bedrock_agentcore",
          "telemetry.auto.version": "0.12.2-aws"
      }
  },
  "scope": {
      "name": "strands.telemetry.tracer",
      "version": ""
  },

  "parentSpanId": "ec3c4c7fb2603f7a",
  "flags": 256,
  "name": "invoke_agent Strands Agents",
  "kind": "INTERNAL",
  "startTimeUnixNano": 1763590155895947177,
  "endTimeUnixNano": 1763590165204959446,
  "durationNano": 9309012269,
  "attributes": {
      "aws.local.service": "agentcore_evaluation_demo.DEFAULT",
      "gen_ai.usage.prompt_tokens": 2021,
      "gen_ai.usage.output_tokens": 320,
      "gen_ai.usage.cache_write_input_tokens": 0,
      "gen_ai.agent.name": "Strands Agents",
      "gen_ai.usage.total_tokens": 2341,
      "gen_ai.usage.completion_tokens": 320,
      "gen_ai.event.start_time": "2025-11-19T22:09:15.895962+00:00",
      "aws.local.environment": "bedrock-agentcore:default",
      "gen_ai.operation.name": "invoke_agent",
      "gen_ai.event.end_time": "2025-11-19T22:09:25.204930+00:00",
      "gen_ai.usage.input_tokens": 2021,
      "gen_ai.request.model": "us.anthropic.claude-3-7-sonnet-20250219-v1:0",
      "gen_ai.usage.cache_read_input_tokens": 0,
      "gen_ai.agent.tools": "[\"analyze_text\", \"get_word_frequency\"]",
      "PlatformType": "AWS::BedrockAgentCore",
      "session.id": "test-ace-demo-session-18a1dba0-62a0-462g",
      "gen_ai.system": "strands-agents",
      "gen_ai.tool.definitions": "[{\"name\": \"analyze_text\", \"description\": \"Analyze text and provide statistics about it.\", \"inputSchema\": {\"json\": {\"properties\": {\"text\": {\"description\": \"Parameter text\", \"type\": \"string\"}}, \"required\": [\"text\"], \"type\": \"object\"}}, \"outputSchema\": null}, {\"name\": \"get_word_frequency\", \"description\": \"Get the frequency of words in the provided text.\", \"inputSchema\": {\"json\": {\"properties\": {\"text\": {\"description\": \"Parameter text\", \"type\": \"string\"}, \"top_n\": {\"default\": 5, \"description\": \"Parameter top_n\", \"type\": \"integer\"}}, \"required\": [\"text\"], \"type\": \"object\"}}, \"outputSchema\": null}]"
  },
  "status": {
      "code": "OK"
  }
}
```
Langgraph (with opentelemetry-instrumentation)
    

  1. Attribute `"traceloop.span.kind": "workflow"` is used to identify agent-invocation spans

```json
{
  "resource": {
    "attributes": {
      "deployment.environment.name": "bedrock-agentcore:default",
      "aws.local.service": "agentcore_evaluation_demo_lg.DEFAULT",
      "service.name": "agentcore_evaluation_demo_lg.DEFAULT",
      "cloud.region": "us-east-1",
      "aws.log.stream.names": "otel-rt-logs",
      "telemetry.sdk.name": "opentelemetry",
      "aws.service.type": "gen_ai_agent",
      "telemetry.sdk.language": "python",
      "cloud.provider": "aws",
      "cloud.resource_id": "<agent-arn>",
      "aws.log.group.names": "/aws/bedrock-agentcore/runtimes/<agent-id>",
      "telemetry.sdk.version": "1.33.1",
      "cloud.platform": "aws_bedrock_agentcore",
      "telemetry.auto.version": "0.14.0-aws"
    }
  },
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.48.1"
  },
  "traceId": "691f4a5c0a7ab761407a1a9a36991613",
  "spanId": "298f3169bdca46d8",
  "parentSpanId": "737921ed52222e5d",
  "flags": 256,
  "name": "LangGraph.workflow",
  "kind": "INTERNAL",
  "startTimeUnixNano": 1763658333042983700,
  "endTimeUnixNano": 1763658340533358800,
  "durationNano": 7490375269,
  "attributes": {
    "aws.local.service": "agentcore_evaluation_demo_lg.DEFAULT",
    "traceloop.span.kind": "workflow",
    "traceloop.workflow.name": "LangGraph",
    "traceloop.entity.name": "LangGraph",
    "PlatformType": "AWS::BedrockAgentCore",
    "session.id": "test-ace-demo-session-18a1dba0-62a0-462g",
    "traceloop.entity.path": "",
    "aws.local.environment": "bedrock-agentcore:default"
  },
  "status": {
    "code": "UNSET"
  }
}
```
ExecuteTool span
    

  1. Attribute `"traceloop.span.kind": "tool"` is used to identify tool-execution spans

```text
## tool span
{
  "traceId": "691f4a5c0a7ab761407a1a9a36991613",
  "spanId": "b58bd6568e00fc64",
  "parentSpanId": "aaee94b5bd16f3b0",
  "scope": {
    "name": "opentelemetry.instrumentation.langchain",
    "version": "0.48.1"
  },
  "flags": 256,
  "name": "get_word_frequency.tool",
  "kind": "INTERNAL",
  "startTimeUnixNano": 1763658336583727000,
  "endTimeUnixNano": 1763658336584260400,
  "durationNano": 533416,
  "attributes": {
    "aws.local.service": "agentcore_evaluation_demo_lg.DEFAULT",
    "traceloop.span.kind": "tool",
    "traceloop.workflow.name": "LangGraph",
    "traceloop.entity.name": "get_word_frequency",
    "PlatformType": "AWS::BedrockAgentCore",
    "session.id": "test-ace-demo-session-18a1dba0-62a0-462g",
    "traceloop.entity.path": "tools",
    "aws.local.environment": "bedrock-agentcore:default"
  },
  "status": {
    "code": "UNSET"
  },
  "resource": {
    "attributes": {
      "deployment.environment.name": "bedrock-agentcore:default",
      "aws.local.service": "agentcore_evaluation_demo_lg.DEFAULT",
      "service.name": "agentcore_evaluation_demo_lg.DEFAULT",
      "cloud.region": "us-east-1",
      "aws.log.stream.names": "otel-rt-logs",
      "telemetry.sdk.name": "opentelemetry",
      "aws.service.type": "gen_ai_agent",
      "telemetry.sdk.language": "python",
      "cloud.provider": "aws",
      "cloud.resource_id": "<agent-arn>",
      "aws.log.group.names": "/aws/bedrock-agentcore/runtimes/<agent-id>",
      "telemetry.sdk.version": "1.33.1",
      "cloud.platform": "aws_bedrock_agentcore",
      "telemetry.auto.version": "0.14.0-aws"
    }
  }
}
```
