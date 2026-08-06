Interventions are a composable control layer for agents. They provide a typed action model for common control concerns — authorization, guardrails, steering, and content transformation — with ordered evaluation and short-circuiting. Unlike raw [hooks](lc:user-guide/concepts/agents/hooks) and [plugins](lc:user-guide/concepts/plugins) which mutate event objects directly, intervention handlers return typed decisions (`proceed`, `deny`, `guide`, `confirm`, `transform`) that the framework applies with well-defined semantics — enabling automatic short-circuiting, feedback accumulation, and conflict resolution.

## Basic Usage

Create an intervention handler by extending `InterventionHandler` and overriding the lifecycle methods you need. Register handlers via the `interventions` option in agent configuration:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.interventions import Deny, InterventionHandler, Proceed\n\nclass ToolGuard(InterventionHandler):\n    name = \"tool-guard\"\n\n    def __init__(self, blocked_tools: list[str]):\n        self.blocked_tools = blocked_tools\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] in self.blocked_tools:\n            name = event.tool_use[\"name\"]\n            return Deny(\n                reason=f\"Tool '{name}' is not allowed\"\n            )\n        return Proceed()\n\nagent = Agent(\n    tools=[search, delete_file],\n    interventions=[ToolGuard(blocked_tools=[\"delete_file\"])],\n)\n\n# The agent can search freely, but any attempt to call delete_file\n# is blocked before execution \u2014 the model sees the denial reason\n# and adjusts its approach\nagent(\"Clean up the temp directory\")\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, InterventionHandler, InterventionActions } from '@strands-agents/sdk'\nimport type { BeforeToolCallEvent } from '@strands-agents/sdk'\n\nclass ToolGuard extends InterventionHandler {\n  readonly name = 'tool-guard'\n  private blockedTools: string[]\n\n  constructor(blockedTools: string[]) {\n    super()\n    this.blockedTools = blockedTools\n  }\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    if (this.blockedTools.includes(event.toolUse.name)) {\n      return InterventionActions.deny(\n        `Tool '${event.toolUse.name}' is not allowed in this environment`\n      )\n    }\n    return InterventionActions.proceed()\n  }\n}\n\nconst agent = new Agent({\n  tools: [searchTool, deleteTool],\n  interventions: [new ToolGuard(['delete_file'])],\n})\n\n// The agent can search freely, but any attempt to call delete_file\n// is blocked before execution \u2014 the model sees the denial reason\n// and adjusts its approach\nawait agent.invoke('Clean up the temp directory')\n```"
 }
]
```

Handlers only need to override the lifecycle methods relevant to their concern — all methods default to `Proceed()``proceed()`.

## Action Types

Each lifecycle method returns one of five typed actions:

```sa-tabs
[
 {
  "label": "Python",
  "body": "| Action | Class | Description |\n| --- | --- | --- |\n| Proceed | `Proceed()` | Allow the operation to continue unchanged |\n| Deny | `Deny(reason=\"...\")` | Block the operation. Short-circuits remaining handlers |\n| Guide | `Guide(feedback=\"...\")` | Cancel and provide feedback for the model to retry with |\n| Confirm | `Confirm(prompt=\"...\")` | Pause for human approval |\n| Transform | `Transform(apply=fn)` | Modify event content in-place before execution continues |"
 },
 {
  "label": "TypeScript",
  "body": "| Action | Factory | Description |\n| --- | --- | --- |\n| Proceed | `InterventionActions.proceed()` | Allow the operation to continue unchanged |\n| Deny | `InterventionActions.deny(reason)` | Block the operation. Short-circuits remaining handlers |\n| Guide | `InterventionActions.guide(feedback)` | Cancel and provide feedback for the model to retry with |\n| Confirm | `InterventionActions.confirm(prompt)` | Pause for human approval |\n| Transform | `InterventionActions.transform(apply)` | Modify event content in-place before execution continues |"
 }
]
```

The following examples show each action type in a realistic handler:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.interventions import (\n    Confirm, Deny, Guide, InterventionHandler,\n    Proceed, Transform,\n)\n\n# Deny \u2014 block tool calls that access production resources\nclass EnvironmentGuard(InterventionHandler):\n    name = \"environment-guard\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        tool_input = event.tool_use.get(\"input\", {})\n        if \"prod\" in tool_input.get(\"database\", \"\"):\n            return Deny(reason=\"Production database access is not allowed\")\n        return Proceed()\n\n# Guide \u2014 steer the model when it tries to send emails without a subject\nclass EmailValidator(InterventionHandler):\n    name = \"email-validator\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] == \"send_email\":\n            tool_input = event.tool_use.get(\"input\", {})\n            if not tool_input.get(\"subject\"):\n                return Guide(feedback=\"All emails must include a subject line.\")\n        return Proceed()\n\n# Confirm \u2014 require human approval before deleting files\nclass DeleteApproval(InterventionHandler):\n    name = \"delete-approval\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] == \"delete_file\":\n            tool_input = event.tool_use.get(\"input\", {})\n            return Confirm(prompt=f\"Approve deleting \\\"{tool_input.get('path')}\\\"?\")\n        return Proceed()\n\n# Transform \u2014 redact PII from outgoing email bodies\nclass PiiRedactor(InterventionHandler):\n    name = \"pii-redactor\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] == \"send_email\":\n            import re\n\n            def redact(e: BeforeToolCallEvent):\n                tool_input = e.tool_use.get(\"input\", {})\n                body = tool_input.get(\"body\", \"\")\n                ssn_pattern = r\"\\b\\d{3}-\\d{2}-\\d{4}\\b\"\n                tool_input[\"body\"] = re.sub(\n                    ssn_pattern, \"[REDACTED]\", body\n                )\n\n            return Transform(apply=redact)\n        return Proceed()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { InterventionHandler, InterventionActions } from '@strands-agents/sdk'\nimport type { BeforeToolCallEvent } from '@strands-agents/sdk'\n\n// deny \u2014 block tool calls that access production resources\nclass EnvironmentGuard extends InterventionHandler {\n  readonly name = 'environment-guard'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    const input = event.toolUse.input as Record<string, string>\n    if (input.database?.includes('prod')) {\n      return InterventionActions.deny('Production database access is not allowed')\n    }\n    return InterventionActions.proceed()\n  }\n}\n\n// guide \u2014 steer the model when it tries to send emails without a subject\nclass EmailValidator extends InterventionHandler {\n  readonly name = 'email-validator'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    if (event.toolUse.name === 'send_email') {\n      const input = event.toolUse.input as Record<string, string>\n      if (!input.subject) {\n        return InterventionActions.guide('All emails must include a subject line.')\n      }\n    }\n    return InterventionActions.proceed()\n  }\n}\n\n// confirm \u2014 require human approval before deleting files\nclass DeleteApproval extends InterventionHandler {\n  readonly name = 'delete-approval'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    if (event.toolUse.name === 'delete_file') {\n      const input = event.toolUse.input as Record<string, string>\n      return InterventionActions.confirm(\n        `Approve deleting \"${input.path}\"?`\n      )\n    }\n    return InterventionActions.proceed()\n  }\n}\n\n// transform \u2014 redact PII from outgoing email bodies\nclass PiiRedactor extends InterventionHandler {\n  readonly name = 'pii-redactor'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    if (event.toolUse.name === 'send_email') {\n      return InterventionActions.transform((e) => {\n        const toolEvent = e as BeforeToolCallEvent\n        const input = toolEvent.toolUse.input as Record<string, string>\n        input.body = input.body.replace(/\\b\\d{3}-\\d{2}-\\d{4}\\b/g, '[REDACTED]')\n      })\n    }\n    return InterventionActions.proceed()\n  }\n}\n```"
 }
]
```

## Lifecycle Methods

Intervention handlers can override five lifecycle methods. Each method supports a specific subset of actions:

| Method | Valid Actions | When it Runs |
| --- | --- | --- |
| `before_invocation``beforeInvocation` | Proceed, Deny, Guide, Transform | Before the agent loop starts |
| `before_tool_call``beforeToolCall` | Proceed, Deny, Guide, Confirm, Transform | Before each tool execution |
| `after_tool_call``afterToolCall` | Proceed, Transform | After each tool execution |
| `before_model_call``beforeModelCall` | Proceed, Deny, Guide, Transform | Before each model API call |
| `after_model_call``afterModelCall` | Proceed, Guide, Transform | After each model response |

How actions behave depends on the lifecycle method:

| Action | Before events | After events |
| --- | --- | --- |
| **Deny** | Sets `event.cancel`, short-circuits remaining handlers | No effect (warns at runtime) |
| **Guide** | On `before_tool_call``beforeToolCall`/`before_invocation``beforeInvocation`: cancels with accumulated feedback. On `before_model_call``beforeModelCall`: injects feedback as user message | Injects feedback and retries |
| **Confirm** | Pauses agent via interrupt/resume for human approval; denied responses set `event.cancel` | Not supported |
| **Transform** | Calls `action.apply(event)` — later handlers see modified content | Calls `action.apply(event)` |

On `after_model_call``afterModelCall`, `Guide` triggers a model retry. Handlers must ensure convergence (e.g., by tracking retry count and escalating to `Deny` after repeated failures). The framework imposes no retry cap on guide-triggered retries.

## Evaluation Order and Short-Circuiting

Handlers evaluate in **registration order**. If any handler returns `Deny`, remaining handlers are skipped — the operation is blocked immediately. This enables efficient pipelines where fast checks (like authorization) run first and prevent expensive evaluations (like LLM-based steering) from running unnecessarily.

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent\nfrom strands.interventions import Deny, Guide, InterventionHandler, Proceed\n\nclass RateLimiter(InterventionHandler):\n    name = \"rate-limiter\"\n\n    def __init__(self):\n        self.call_count = 0\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        self.call_count += 1\n        if self.call_count > 10:\n            # Deny short-circuits: handlers registered after this one are skipped\n            return Deny(reason=\"Rate limit exceeded\")\n        return Proceed()\n\nclass ToneSteering(InterventionHandler):\n    name = \"tone-steering\"\n\n    def after_model_call(self, event: AfterModelCallEvent):\n        # This handler never runs for denied tool calls\n        return Guide(feedback=\"Use a more professional tone.\")\n\n# Handlers evaluate in registration order\nagent = Agent(\n    tools=[search],\n    interventions=[\n        RateLimiter(),    # Evaluates first\n        ToneSteering(),   # Skipped if RateLimiter denies\n    ],\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, InterventionHandler, InterventionActions } from '@strands-agents/sdk'\nimport type { BeforeToolCallEvent, AfterModelCallEvent } from '@strands-agents/sdk'\n\nclass RateLimiter extends InterventionHandler {\n  readonly name = 'rate-limiter'\n  private callCount = 0\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    this.callCount++\n    if (this.callCount > 10) {\n      // deny() short-circuits: handlers registered after this one are skipped\n      return InterventionActions.deny('Rate limit exceeded')\n    }\n    return InterventionActions.proceed()\n  }\n}\n\nclass ToneSteeringHandler extends InterventionHandler {\n  readonly name = 'tone-steering'\n\n  override afterModelCall(event: AfterModelCallEvent) {\n    // This handler never runs for denied tool calls\n    return InterventionActions.guide('Use a more professional tone.')\n  }\n}\n\n// Handlers evaluate in registration order\nconst agent = new Agent({\n  tools: [searchTool],\n  interventions: [\n    new RateLimiter(),         // Evaluates first\n    new ToneSteeringHandler(), // Skipped if RateLimiter denies\n  ],\n})\n```"
 }
]
```

For `Guide` actions, all handlers continue to run and their feedback is accumulated — the model receives combined guidance from all guiding handlers.

## Error Handling

The `on_error``onError` property controls what happens when a handler throws an exception:

| Value | Behavior |
| --- | --- |
| `'throw'` | Rethrow the error (default). The invocation fails. |
| `'proceed'` | Log the error and continue as if `Proceed()` was returned. |
| `'deny'` | Log the error and treat it as a `Deny` (fail-closed). |

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.interventions import Deny, InterventionHandler, OnError, Proceed\n\n# 'proceed' \u2014 if this handler throws, continue as if Proceed() was returned\nclass BestEffortLogger(InterventionHandler):\n    name = \"best-effort-logger\"\n\n    @property\n    def on_error(self) -> OnError:\n        return \"proceed\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        # If the logging service is unreachable, the agent continues normally\n        print(f\"Tool called: {event.tool_use['name']}\")\n        return Proceed()\n\n# 'deny' \u2014 if this handler throws, treat it as a Deny (fail-closed)\nclass StrictAuth(InterventionHandler):\n    name = \"strict-auth\"\n\n    @property\n    def on_error(self) -> OnError:\n        return \"deny\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        # If the auth service is down (throws), the operation is denied\n        if not self._check_permission(event.tool_use[\"name\"]):\n            return Deny(reason=\"Unauthorized\")\n        return Proceed()\n\n    def _check_permission(self, tool_name: str) -> bool:\n        # ... call external auth service\n        return True\n\n# 'throw' (default) \u2014 errors propagate and fail the invocation\nclass CriticalValidator(InterventionHandler):\n    name = \"critical-validator\"\n    # on_error defaults to 'throw'\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        # If this throws, the entire invocation fails\n        return Proceed()\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { InterventionHandler, InterventionActions } from '@strands-agents/sdk'\nimport type { OnError, BeforeToolCallEvent } from '@strands-agents/sdk'\n\n// 'proceed' \u2014 if this handler throws, continue as if proceed() was returned\nclass BestEffortLogger extends InterventionHandler {\n  readonly name = 'best-effort-logger'\n  readonly onError: OnError = 'proceed'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    // If the logging service is unreachable, the agent continues normally\n    console.log(`Tool called: ${event.toolUse.name}`)\n    return InterventionActions.proceed()\n  }\n}\n\n// 'deny' \u2014 if this handler throws, treat it as a deny (fail-closed)\nclass StrictAuth extends InterventionHandler {\n  readonly name = 'strict-auth'\n  readonly onError: OnError = 'deny'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    // If the auth service is down (throws), the operation is denied\n    if (!this.checkPermission(event.toolUse.name)) {\n      return InterventionActions.deny('Unauthorized')\n    }\n    return InterventionActions.proceed()\n  }\n\n  private checkPermission(toolName: string): boolean {\n    // ... call external auth service\n    return true\n  }\n}\n\n// 'throw' (default) \u2014 errors propagate and fail the invocation\nclass CriticalValidator extends InterventionHandler {\n  readonly name = 'critical-validator'\n  // onError defaults to 'throw'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    // If this throws, the entire invocation fails\n    return InterventionActions.proceed()\n  }\n}\n```"
 }
]
```

Use `'deny'` for security-critical handlers where a failure should block execution. Use `'proceed'` for non-critical handlers like logging where availability is more important than enforcement.

## Confirm Action

The `Confirm` action is only supported on `before_tool_call``beforeToolCall`. It integrates with the SDK’s interrupt/resume system to pause for human approval before a tool executes.

```sa-tabs
[
 {
  "label": "Python",
  "body": "`Confirm` supports two modes depending on whether `response` is provided:\n\n-   **With `response`**: the value is passed directly to the `evaluate` function \u2014 the agent never pauses.\n-   **Without `response`**: breaks out of the agent loop to pause for external resume via the interrupt system.\n\nThe `evaluate` function determines whether the response counts as approval. The default accepts `True`, `\"y\"`, or `\"yes\"` (case-insensitive).\n\n```python\nfrom strands.interventions import Confirm, InterventionHandler, Proceed\n\nclass SensitiveToolApproval(InterventionHandler):\n    name = \"sensitive-tool-approval\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] in (\"delete_file\", \"send_email\"):\n            return Confirm(\n                prompt=f\"Allow {event.tool_use['name']}?\"\n            )\n        return Proceed()\n\n# Preemptive approval \u2014 agent doesn't pause\nclass AutoApprove(InterventionHandler):\n    name = \"auto-approve\"\n\n    def before_tool_call(self, event: BeforeToolCallEvent):\n        if event.tool_use[\"name\"] == \"search\":\n            return Confirm(\n                prompt=\"Allow search?\",\n                response=\"yes\",\n            )\n        return Proceed()\n```"
 },
 {
  "label": "TypeScript",
  "body": "`Confirm` pauses the agent loop via the interrupt system. The agent resumes when the interrupt is resolved externally.\n\n```typescript\nimport { InterventionHandler, InterventionActions } from '@strands-agents/sdk'\nimport type { BeforeToolCallEvent } from '@strands-agents/sdk'\n\nclass DeleteApproval extends InterventionHandler {\n  readonly name = 'delete-approval'\n\n  override beforeToolCall(event: BeforeToolCallEvent) {\n    if (event.toolUse.name === 'delete_file') {\n      const input = event.toolUse.input as Record<string, string>\n      return InterventionActions.confirm(\n        `Approve deleting \"${input.path}\"?`\n      )\n    }\n    return InterventionActions.proceed()\n  }\n}\n```\n\nSee [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) for ready-to-use approval workflows with configurable modes for CLI, web, and custom UIs."
 }
]
```

## Relationship to Hooks and Plugins

Interventions are built on top of the [hooks](lc:user-guide/concepts/agents/hooks) system — under the hood, each lifecycle method registers a hook callback. The difference is in how they communicate with the framework.

[Hooks](lc:user-guide/concepts/agents/hooks) and [plugins](lc:user-guide/concepts/plugins) mutate event properties directly (e.g., setting `event.cancel = "reason"`). The framework doesn’t know *why* something was cancelled — was it a hard authorization denial or soft guidance to retry differently? Multiple plugins modifying the same event can conflict silently with last-write-wins semantics.

Interventions return typed actions that the framework interprets. This enables:

-   **Short-circuiting** — a `Deny` from an authorization handler skips all remaining handlers automatically. With hooks, each plugin must independently check `event.cancel` before doing work.
-   **Feedback accumulation** — multiple handlers can return `Guide` and their feedback is combined into a single message to the model, rather than overwriting each other.
-   **Human-in-the-loop** — `Confirm` integrates with the SDK’s interrupt/resume system to pause for approval without the handler needing to manage interrupt lifecycle.
-   **Ordered evaluation** — handlers always run in registration order with well-defined precedence (deny > confirm > guide > transform > proceed).
-   **Error policies** — each handler declares its own failure mode via `on_error``onError`. A logging handler can use `'proceed'` (skip on failure), while an auth handler can use `'deny'` (fail closed). Hooks have no equivalent — a thrown error always propagates.

## Related topics

-   [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization) — Declarative, identity-aware access control using Cedar policies
-   [Steering](lc:user-guide/concepts/agents/interventions/steering) — LLM-based contextual guidance using the steering handler
-   [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) — Ready-to-use intervention handler for tool approval workflows
-   [Hooks](lc:user-guide/concepts/agents/hooks) — Low-level event callbacks for observing and modifying agent behavior
-   [Plugins](lc:user-guide/concepts/plugins) — Bundle related hooks and tools into reusable modules
-   [Interrupts](lc:user-guide/concepts/interrupts) — The interrupt/resume system that `Confirm` builds on

## Related pages

- [Agent Loop](lc:user-guide/concepts/agents/agent-loop) (3 shared tags)
- [Hooks](lc:user-guide/concepts/agents/hooks) (3 shared tags)
- [Steering (Interventions)](lc:user-guide/concepts/agents/interventions/steering) (3 shared tags)
- [Interrupts](lc:user-guide/concepts/interrupts) (3 shared tags)
- [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) (2 shared tags)
- [Plugins](lc:user-guide/concepts/plugins) (2 shared tags)
- [Tool Executors](lc:user-guide/concepts/tools/executors) (2 shared tags)
- [Cedar Authorization](lc:user-guide/concepts/agents/interventions/cedar-authorization) (2 shared tags)
- [GoalLoop](lc:user-guide/concepts/plugins/goal-loop) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/interventions/handler.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py)
- [harness-sdk/strands-py/src/strands/interventions/actions.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py)
- [harness-sdk/strands-py/src/strands/interventions/registry.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/registry.py)

### TypeScript

- [harness-sdk/strands-ts/src/interventions/handler.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/interventions/handler.ts)
- [harness-sdk/strands-ts/src/interventions/actions.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/interventions/actions.ts)
- [harness-sdk/strands-ts/src/interventions/registry.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/interventions/registry.ts)
