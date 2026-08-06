# Telemetry setup and delivery - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-telemetry.html

---

# Telemetry setup and delivery

Your agent emits spans that Amazon Bedrock AgentCore Evaluations uses to reconstruct each session. For how AgentCore represents sessions, traces, and spans, see [Understand observability for agentic resources in AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-telemetry.html>).

To score a session, the service needs the conversation content: the model prompts, the model completions, and the tool inputs and outputs. Where that content sits depends on how your agent delivers telemetry, and that is what this page explains.

**Topics**

  * Set up observability

  * Telemetry delivery modes

    * Unified telemetry (recommended)

    * Split telemetry

  * What the service reads from a span

  * References


## Set up observability

Instrumenting your agent is one part of producing telemetry that the evaluation service can read. Your agent must also have observability enabled, so that it exports its telemetry to Amazon CloudWatch. Complete the following steps:

  1. **Enable Amazon CloudWatch Transaction Search.** Evaluation requires it in both delivery modes. See [Enabling AgentCore observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-builtin>).

  2. **Enable observability for your agent** , based on where you host it:

     * **On Amazon Bedrock AgentCore Runtime** : see [Enabling observability in agent code for AgentCore-hosted agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-custom>).

     * **Hosted outside AgentCore Runtime** (Amazon ECS, Amazon EKS, AWS Lambda, or another environment): see [Enabling observability for agents hosted outside of AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-3p>). This is also where you set the log group that receives your telemetry.

  3. **Check which delivery mode your agent uses** , so that you know where your telemetry lands. Agents that you created on or after July 20, 2026 use unified telemetry by default, and agents that you created before that date use split telemetry. Unified telemetry needs ADOT version 0.18.0 or later (`aws-opentelemetry-distro>=0.18.0`). Earlier versions send spans to the shared `aws/spans` log group.

For an agent on AgentCore Runtime, you switch modes with the `UNIFIED_TRACES_DESTINATION_ENABLED` environment variable: set it to `true` for unified telemetry, or `false` for split telemetry. For the environment variables, the IAM permissions, and the full procedure for each hosting option, see [Span destination for agents hosted in Amazon Bedrock AgentCore runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-unified-traces>).


Changing the delivery mode does not move telemetry that AgentCore already delivered. Older spans stay in the log group they were written to, so the service still evaluates a session that you recorded before the change.

## Telemetry delivery modes

AgentCore delivers your agent’s telemetry in one of two modes:

  * **Unified telemetry** (recommended) keeps everything together. The attributes carrying the model payloads and the tool requests and responses stay on the span, and all of your agent’s telemetry goes to one log group.

  * **Split telemetry** separates the two. The AWS Distro for OpenTelemetry (ADOT) moves those attributes off the span into separate records, which go to a different log group than the spans.


AgentCore Evaluations reads both modes. You do not choose between them in the evaluation service, and the same evaluators give you the same results either way. We recommend unified telemetry, which is available in all AWS commercial Regions where AgentCore Runtime is available.

### Unified telemetry (recommended)

With unified telemetry, all of your agent’s telemetry goes to one log group. Spans go to the `spans` log stream in that log group, next to the agent’s own logs and console output. The span keeps the attributes that carry the model payloads and the tool requests and responses, so the service reads everything it needs from the span itself.

![Unified telemetry: ADOT sends each span with its content to one log group](/agentcore/images/evaluations-unified-telemetry.png)

Which log group holds the spans depends on where you host the agent:

  * **On Amazon Bedrock AgentCore Runtime** : the agent’s log group, `/aws/bedrock-agentcore/runtimes/<agent_id>-<endpoint_name>`. AgentCore sets this up for you.

  * **Hosted outside AgentCore Runtime** : the log group that you name in the `OTEL_EXPORTER_OTLP_TRACES_HEADERS` environment variable.


Keeping spans and logs in one place helps beyond evaluation. You can look at traces and logs together, you can write AWS Identity and Access Management (IAM) policies and set up customer managed key (CMK) encryption for a single agent, and you can export everything an agent produces by subscribing to one log group.

### Split telemetry

With split telemetry, ADOT takes the large payloads off the span. As it exports each span, it pulls out the attributes carrying the model payloads and the tool requests and responses, and sends them as separate **event records** , leaving the span with its metadata and its smaller attributes. Event records exist only in this mode, and they follow the OpenTelemetry events convention.

Each event record links back to its span through a shared `traceId` and `spanId`, and the content sits in the record `body`, for example in `body.input.messages` and `body.output.messages`.

![Split telemetry: ADOT sends spans to aws/spans and conversation content to the agent log group as event records](/agentcore/images/evaluations-split-telemetry.png)

The two kinds of record then go to different places:

  * **Spans** go to the shared `aws/spans` log group. CloudWatch creates this log group when you turn on Transaction Search.

  * **Event records** go to a separate log group. On AgentCore Runtime, that is the agent’s log group, in the `otel-rt-logs` log stream, which AgentCore sets up for you. Outside AgentCore Runtime, it is the log group that you name in the `OTEL_EXPORTER_OTLP_LOGS_HEADERS` environment variable.


To evaluate a session, the service reads spans from `aws/spans` and matches them to their event records.

## What the service reads from a span

For each span in a session, the service does the following:

  1. Works out what kind of span it is, based on the attributes the framework set. A span can be an **invoke agent span** (the top-level agent run), an **execute tool span** (a single tool call), or an **inference span** (a single model call).

  2. Reads the values it needs, such as the user prompt, the agent response, and tool inputs and outputs. For example, the user prompt comes from the user-role message in the agent input, and the agent response comes from the assistant-role message in the agent output.


The attributes that identify a span always stay on the span, in both delivery modes. Only the conversation content moves. Where that content sits within the span also depends on your instrumentation library: most libraries record it as span attributes, and some attach it to the span as events. For each library, the per-framework pages list the identifying attributes, say where the content sits, and show example spans for both modes.

## References

AgentCore Evaluations builds on the following OpenTelemetry specifications:

  * [Trace semantic conventions](<https://opentelemetry.io/docs/specs/semconv/general/trace/>) on the OpenTelemetry website: how spans and traces are structured and what they mean.

  * [Event semantic conventions](<https://opentelemetry.io/docs/specs/semconv/general/events/>) on the OpenTelemetry website: how event records are structured and what they mean.

  * [Generative-AI semantic conventions](<https://github.com/open-telemetry/semantic-conventions-genai>) on the GitHub website: the `gen_ai.*` attributes that describe agent, model, and tool operations.



