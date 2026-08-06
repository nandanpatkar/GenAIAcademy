# Generic framework support - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/supported-frameworks-generic.html

---

# Generic framework support

Amazon Bedrock AgentCore Evaluations reads telemetry through two open standards: the OpenTelemetry generative AI semantic conventions and the OpenInference semantic conventions. Alongside the frameworks that have their own page in this section, the service supports any agent that emits telemetry in one of these two conventions. This is **generic framework support**.

Use generic framework support when you build with a framework that has no page in this section, or when you write your own instrumentation for a custom agent. Configure your instrumentation to emit the scope name, span attributes, and identifying attributes described on this page, and the service identifies your spans and extracts the values that evaluators need, using the same span classification and field extraction as the named frameworks.

Because your framework’s own data structures are not known in advance, the service extracts each value as a string rather than parsing it into a framework-specific structure. Keep prompts, responses, and tool arguments in the attributes listed in How evaluation fields are extracted, rather than wrapped in your own structure such as a nested request object or a custom message envelope, so that evaluators receive clean values.

**Topics**

  * Supported conventions

  * How spans are identified

  * How evaluation fields are extracted

    * OpenTelemetry convention

    * OpenInference convention

  * Configuration requirements


## Supported conventions

The service selects how to read each span from the span’s `scope.name`. Set your instrumentation’s scope name to one of the following prefixes, and the service reads the span with the matching convention:

Convention | Scope name prefix  
---|---  
OpenTelemetry |  `–0—`  
OpenInference |  `–0—`  
  
If a scope has a page of its own in this section, the service uses the handling described on that page instead. Generic framework support applies to every other scope that matches one of these prefixes.

Some scopes match the OpenTelemetry prefixes but are not GenAI agent frameworks. These are transport and infrastructure instrumentation, such as HTTP clients (`httpx`, `urllib3`, `urllib`, `aiohttp_client`), web frameworks (`starlette`, `fastapi`), the Model Context Protocol (MCP) instrumentation, and the AWS SDK (`botocore`) instrumentation, including its `bedrock-agentcore` and `bedrock-runtime` scopes. The service excludes these scopes from generic framework support so that their spans do not produce spurious agent, tool, or inference spans.

## How spans are identified

The service classifies each span into one of three types using the standard identifying attribute for its convention. Set this attribute on every span you want evaluated. Its value tells the service what the span represents, and the service reads it from the span itself, regardless of where the conversation content is stored.

###### Example

OpenTelemetry
    

The service classifies spans using `gen_ai.operation.name`, and falls back to `traceloop.span.kind` when the operation name is absent.

Span type | Identifying attribute  
---|---  
Invoke agent |  `gen_ai.operation.name` = `invoke_agent` (or `traceloop.span.kind` = `workflow`)  
Execute tool |  `gen_ai.operation.name` = `execute_tool` (or `traceloop.span.kind` = `tool`)  
Inference |  `gen_ai.operation.name` = `chat` (or `llm.request.type` = `chat`)  
  
OpenInference
    

The service classifies spans using `openinference.span.kind`.

Span type | Identifying attribute  
---|---  
Invoke agent |  `openinference.span.kind` = `AGENT` or `CHAIN`  
Execute tool |  `openinference.span.kind` = `TOOL`  
Inference |  `openinference.span.kind` = `LLM`  
  
## How evaluation fields are extracted

For each classified span, the service reads the values it needs, such as the user prompt, agent response, and tool inputs and outputs. As with the named frameworks, where the conversation content sits depends on the telemetry delivery mode. With split telemetry, the content lives in the correlated event record. With unified telemetry, it stays on the span as attributes. For more information, see [Telemetry setup and delivery](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks-telemetry.html>).

The service tries several locations for each field and uses the first one that holds a value, so you can emit whichever attribute your instrumentation already sets. Each extracted value is stringified rather than parsed into a framework-specific structure.

### OpenTelemetry convention

For frameworks using the OpenTelemetry convention, the service reads each field from the following locations, in order:

  * **User prompt** (invoke agent span): from the event record `body.input`; then from the `gen_ai.task.input` span attribute.

  * **Agent response** (invoke agent span): from the event record `body.output`; then from the `gen_ai.task.output` span attribute. If neither is present, the service falls back to the first user message and last assistant message it collected from the trace’s inference spans.

  * **Inference messages** (inference span): from the event record `body.input.messages` and `body.output.messages`; then from the `gen_ai.input.messages` and `gen_ai.output.messages` span attributes.

  * **Tool name** (execute tool span): from the `gen_ai.tool.name` span attribute; then from the `traceloop.entity.name` span attribute.

  * **Tool arguments** (execute tool span): from the `gen_ai.tool.call.arguments` span attribute; then from the event record `body.input`; then from the `traceloop.entity.input` span attribute.

  * **Tool result** (execute tool span): from the `gen_ai.tool.call.result` span attribute; then from the event record `body.output`; then from the `traceloop.entity.output` span attribute.

  * **System prompt** (inference span): from the `gen_ai.system_instructions` span attribute.


### OpenInference convention

For frameworks using the OpenInference convention, the service reads each field from the following locations, in order:

  * **User prompt** (invoke agent span): from the `input.value` span attribute; then from the event record body input.

  * **Agent response** (invoke agent span): from the `output.value` span attribute; then from the event record body output.

  * **Inference messages** (inference span): from the span’s OpenInference message attributes (for example, `–0—` and `–1—`); then from `input.value` and `output.value`; then from the event record body.

  * **Tool arguments** (execute tool span): from the `input.value` span attribute; then from the event record body input.

  * **Tool result** (execute tool span): from the `output.value` span attribute; then from the event record body output.

  * **System prompt** (inference span): from the inference span attributes; then from the event record body.

  * **Available tools** : from the inference span’s tool-definition attributes (`llm.tools.*`); then parsed from the serialized request in the event record body or `input.value`.


## Configuration requirements

To get evaluated with generic framework support, configure your instrumentation as follows:

  * **Use a recognized scope name.** Emit spans under a scope name that starts with `–0—` or `–1—`. The service reads only these prefixes with generic framework support.

  * **Set an identifying attribute on every span.** Set `gen_ai.operation.name` or `traceloop.span.kind` for the OpenTelemetry convention, or `openinference.span.kind` for the OpenInference convention. The service skips a span that carries no recognized identifying attribute.

  * **Put content in the documented attributes.** Set the prompt, response, and tool attributes listed in How evaluation fields are extracted. If you wrap these values in your own structure, the extracted value includes that surrounding structure, because the service stringifies content rather than parsing your framework’s data model.


If you cannot set convention attributes, you can still evaluate the top-level agent turn. Set the `agentcore.invocation.user_prompt` and `agentcore.invocation.agent_response` span attributes, which the AgentCore SDK also emits. The service reads these attributes from any scope, and they cover the agent prompt and response only, not inference or tool spans.

