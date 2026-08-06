Cedar Authorization evaluates [Cedar](https://cedarpolicy.com) policies before each tool call, giving you declarative, identity-aware access control over agent behavior. It ships as a vended intervention handler in both the Python and TypeScript SDKs.

## How it works

The handler sits at the tool-call boundary. When the agent attempts to invoke a tool, Cedar Authorization maps the call to a Cedar authorization request and evaluates your policies. If no `permit` statement matches, the tool call is denied and the agent receives feedback explaining the denial.

| Cedar concept | Maps to | Example |
| --- | --- | --- |
| **Principal** | User identity | `User::"alice@acme.com"` |
| **Action** | Tool name | `Action::"search"` |
| **Resource** | Static (unconstrained) | `Resource::"agent"` |
| **Context.input** | Tool arguments | `{ query: "quarterly report" }` |
| **Context.session** | Invocation metadata | `{ hour_utc: 14, call_count: 3, role: "admin" }` |

The design is fail-closed: if principal identity cannot be resolved, all tool calls are denied.

## Basic usage

Permit specific tools and deny everything else:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n@tool\ndef delete_record(record_id: str) -> str:\n    \"\"\"Delete a record by ID.\"\"\"\n    return f\"Deleted {record_id}\"\n\ncedar = CedarAuthorization(\n    policies=(\n        'permit(principal, action == Action::\"search\",'\n        \" resource);\"\n    ),\n)\n\nagent = Agent(\n    tools=[search, delete_record],\n    interventions=[cedar],\n)\n\nagent(\n    \"Search for quarterly reports then delete record 42\"\n)\n# search is permitted; delete_record is denied\n# (no matching permit)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst deleteTool = tool({\n  name: 'delete_record',\n  description: 'Delete a record by ID',\n  inputSchema: z.object({ record_id: z.string() }),\n  callback: (input) => `Deleted ${input.record_id}`,\n})\n\nconst cedar = new CedarAuthorization({\n  policies: `\n    permit(principal, action == Action::\"search\", resource);\n  `,\n})\n\nconst agent = new Agent({\n  tools: [searchTool, deleteTool],\n  interventions: [cedar],\n})\n\nawait agent.invoke('Search for quarterly reports then delete record 42')\n// If the agent calls search, it's permitted; a delete_record call is denied (no matching permit)\n```"
 }
]
```

Cedar uses default-deny semantics. Tools without a matching `permit` statement are automatically blocked.

## Role-based access control

For multi-tenant agents where each request carries user identity, use `principal_resolver``principalResolver` to extract the principal from `invocation_state``invocationState` and `context_enricher``contextEnricher` to forward role information into Cedar context:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\n@tool\ndef delete_record(record_id: str) -> str:\n    \"\"\"Delete a record by ID.\"\"\"\n    return f\"Deleted {record_id}\"\n\ncedar = CedarAuthorization(\n    policies=\"\"\"\n      permit(principal, action, resource)\n      when { context.session.role == \"admin\" };\n\n      permit(\n        principal,\n        action == Action::\"search\",\n        resource\n      )\n      when { context.session.role == \"analyst\" };\n    \"\"\",\n    principal_resolver=lambda state: (\n        {\"type\": \"User\", \"id\": state[\"user_id\"]}\n        if state.get(\"user_id\")\n        else None\n    ),\n    context_enricher=lambda ctx: {\n        \"role\": ctx[\"invocation_state\"].get(\n            \"role\", \"none\"\n        ),\n    },\n)\n\nagent = Agent(\n    tools=[search, delete_record],\n    interventions=[cedar],\n)\n\n# admin can use any tool\nagent(\n    \"Delete record 42\",\n    invocation_state={\n        \"user_id\": \"alice\",\n        \"role\": \"admin\",\n    },\n)\n\n# analyst can only search\nagent(\n    \"Delete record 42\",\n    invocation_state={\n        \"user_id\": \"bob\",\n        \"role\": \"analyst\",\n    },\n)\n# denied: no permit for delete_record with \"analyst\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst deleteTool = tool({\n  name: 'delete_record',\n  description: 'Delete a record by ID',\n  inputSchema: z.object({ record_id: z.string() }),\n  callback: (input) => `Deleted ${input.record_id}`,\n})\n\nconst cedar = new CedarAuthorization({\n  policies: `\n    permit(principal, action, resource)\n    when { context.session.role == \"admin\" };\n\n    permit(principal, action == Action::\"search\", resource)\n    when { context.session.role == \"analyst\" };\n  `,\n  principalResolver: (state) => {\n    if (!state.user_id) return undefined\n    return { type: 'User', id: String(state.user_id) }\n  },\n  contextEnricher: ({ invocationState }) => ({\n    role: String(invocationState.role ?? 'none'),\n  }),\n})\n\nconst agent = new Agent({\n  tools: [searchTool, deleteTool],\n  interventions: [cedar],\n})\n\n// admin can use any tool\nawait agent.invoke('Delete record 42', {\n  invocationState: { user_id: 'alice', role: 'admin' },\n})\n\n// analyst can only search\nawait agent.invoke('Delete record 42', {\n  invocationState: { user_id: 'bob', role: 'analyst' },\n})\n// denied: no permit matches for delete_record with role \"analyst\"\n```"
 }
]
```

When `principal_resolver``principalResolver` returns `None``undefined` (no identity found), the handler denies all tool calls for that request.

## Rate limiting

Cedar policies can reference `context.session.call_count`, which tracks how many times each tool has been invoked successfully during the session:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\n@tool\ndef send_email(to: str, body: str) -> str:\n    \"\"\"Send an email.\"\"\"\n    return f\"Sent to {to}\"\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\ncedar = CedarAuthorization(\n    policies=\"\"\"\n      permit(\n        principal,\n        action == Action::\"send_email\",\n        resource\n      )\n      when { context.session.call_count < 5 };\n\n      permit(\n        principal,\n        action == Action::\"search\",\n        resource\n      );\n    \"\"\",\n)\n\nagent = Agent(\n    tools=[send_email, search],\n    interventions=[cedar],\n)\n\n# send_email permitted for calls 1-4, denied on 5th\n# search is unlimited\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst sendEmailTool = tool({\n  name: 'send_email',\n  description: 'Send an email',\n  inputSchema: z.object({ to: z.string(), body: z.string() }),\n  callback: (input) => `Sent to ${input.to}`,\n})\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst cedar = new CedarAuthorization({\n  policies: `\n    permit(principal, action == Action::\"send_email\", resource)\n    when { context.session.call_count < 5 };\n\n    permit(principal, action == Action::\"search\", resource);\n  `,\n})\n\nconst agent = new Agent({\n  tools: [sendEmailTool, searchTool],\n  interventions: [cedar],\n})\n\n// send_email is permitted for the first 4 calls, then denied on the 5th\n// search is unlimited\n```"
 }
]
```

Call counts persist with the agent’s state and survive session reloads. Only successful tool calls increment the counter.

## Schema validation

Pass your tool definitions to catch policy typos at construction time. The handler generates a Cedar schema from tool definitions and validates policies against it:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n    ToolDefinition,\n)\n\nsearch_def: ToolDefinition = {\n    \"name\": \"search\",\n    \"inputSchema\": {\n        \"type\": \"object\",\n        \"properties\": {\n            \"query\": {\"type\": \"string\"}\n        },\n    },\n}\n\ndelete_def: ToolDefinition = {\n    \"name\": \"delete_record\",\n    \"inputSchema\": {\n        \"type\": \"object\",\n        \"properties\": {\n            \"record_id\": {\"type\": \"string\"}\n        },\n    },\n}\n\n# Valid policies pass schema validation\ncedar = CedarAuthorization(\n    policies=\"\"\"\n      permit(\n        principal,\n        action == Action::\"search\",\n        resource\n      );\n      permit(\n        principal,\n        action == Action::\"delete_record\",\n        resource\n      )\n      when { context.session.role == \"admin\" };\n    \"\"\",\n    tools=[search_def, delete_def],\n    context_enricher=lambda ctx: {\n        \"role\": ctx[\"invocation_state\"].get(\n            \"role\", \"none\"\n        ),\n    },\n)\n\n# A typo in the action name raises at construction:\n# CedarAuthorization(\n#     policies='permit(principal, action == Action::\"deleet_record\", resource);',\n#     tools=[search_def, delete_def],\n# )\n# raises ValueError: Cedar policy validation failed:\n#   unrecognized action \"deleet_record\"\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst deleteTool = tool({\n  name: 'delete_record',\n  description: 'Delete a record by ID',\n  inputSchema: z.object({ record_id: z.string() }),\n  callback: (input) => `Deleted ${input.record_id}`,\n})\n\n// Valid policies pass schema validation\nconst cedar = new CedarAuthorization({\n  policies: `\n    permit(principal, action == Action::\"search\", resource);\n    permit(principal, action == Action::\"delete_record\", resource)\n    when { context.session.role == \"admin\" };\n  `,\n  tools: [searchTool, deleteTool],\n  contextEnricher: ({ invocationState }) => ({\n    role: String(invocationState.role ?? 'none'),\n  }),\n})\n\n// A typo in the action name throws at construction:\n// new CedarAuthorization({\n//   policies: 'permit(principal, action == Action::\"deleet_record\", resource);',\n//   tools: [searchTool, deleteTool],\n// })\n// throws \"Cedar policy validation failed: unrecognized action\"\n```"
 }
]
```

Schema validation integrates with the [`cedar-for-agents`](https://github.com/cedar-policy/cedar-for-agents) ecosystem via `@cedar-policy/mcp-schema-generator-wasm` (TypeScript) and `cedar-policy-mcp-schema-generator` (Python).

## Namespaced policies

When using policy generators like [`cedar-agent-policy-builder`](https://github.com/cedar-policy/cedar-for-agents) that produce namespaced Cedar policies (e.g. `Agent::Action::"search"` instead of `Action::"search"`), set the `namespace` option to match:

```sa-tabs
[
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst cedar = new CedarAuthorization({\n  namespace: 'Agent',\n  policies: `\n    permit(principal, action == Agent::Action::\"search\", resource);\n  `,\n  tools: [searchTool],\n  entities: [{ uid: { type: 'Agent::Resource', id: 'default' }, attrs: {}, parents: [] }],\n  principalResolver: (state) => {\n    if (!state.user_id) return undefined\n    return { type: 'Agent::User', id: String(state.user_id) }\n  },\n})\n\nconst agent = new Agent({\n  tools: [searchTool],\n  interventions: [cedar],\n})\n\nawait agent.invoke('Search for reports', {\n  invocationState: { user_id: 'alice' },\n})\n```"
 }
]
```

When `namespace` is set:

| Cedar concept | Unnamespaced (default) | Namespaced (`namespace: 'Agent'`) |
| --- | --- | --- |
| **Action** | `Action::"search"` | `Agent::Action::"search"` |
| **Resource** | `Resource::"agent"` | `Agent::Resource::"default"` |
| **Default principal** | `User::"anonymous"` | `Agent::User::"anonymous"` |

Schema generation also uses the configured namespace, so `tools` and `namespace` work together correctly.

Note

> [!NOTE]
>
> The `namespace` option is currently available in the TypeScript SDK only. Python support is planned.

## Environment gating

Block tools based on deployment context by forwarding environment metadata through `context_enricher``contextEnricher`:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\n@tool\ndef deploy(version: str) -> str:\n    \"\"\"Deploy the service.\"\"\"\n    return f\"Deployed {version}\"\n\ncedar = CedarAuthorization(\n    policies=\"\"\"\n      permit(\n        principal,\n        action == Action::\"deploy\",\n        resource\n      )\n      when {\n        context.session has environment &&\n        context.session.environment != \"production\"\n      };\n    \"\"\",\n    context_enricher=lambda ctx: {\n        \"environment\": ctx[\"invocation_state\"].get(\n            \"environment\", \"unknown\"\n        ),\n    },\n)\n\nagent = Agent(\n    tools=[deploy],\n    interventions=[cedar],\n)\n\n# works in staging\nagent(\n    \"Deploy the service\",\n    invocation_state={\"environment\": \"staging\"},\n)\n\n# denied in production\nagent(\n    \"Deploy the service\",\n    invocation_state={\"environment\": \"production\"},\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst deployTool = tool({\n  name: 'deploy',\n  description: 'Deploy the service',\n  inputSchema: z.object({ version: z.string() }),\n  callback: (input) => `Deployed ${input.version}`,\n})\n\nconst cedar = new CedarAuthorization({\n  policies: `\n    permit(principal, action == Action::\"deploy\", resource)\n    when { context.session has environment &&\n           context.session.environment != \"production\" };\n  `,\n  contextEnricher: ({ invocationState }) => ({\n    environment: String(invocationState.environment ?? 'unknown'),\n  }),\n})\n\nconst agent = new Agent({\n  tools: [deployTool],\n  interventions: [cedar],\n})\n\n// works in staging\nawait agent.invoke('Deploy the service', {\n  invocationState: { environment: 'staging' },\n})\n\n// denied in production\nawait agent.invoke('Deploy the service', {\n  invocationState: { environment: 'production' },\n})\n```"
 }
]
```

## File-based policies

For production deployments, keep policies in `.cedar` files rather than inline strings:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\ncedar = CedarAuthorization(\n    policies=\"./policies/agent.cedar\",\n    entities=\"./policies/entities.json\",\n)\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\n\nconst cedar = new CedarAuthorization({\n  policies: './policies/agent.cedar',\n  entities: './policies/entities.json',\n})\n```"
 }
]
```

The handler reads and parses files at construction time. Invalid syntax throws immediately.

## Hot reload

Update policies without restarting your agent process:

```sa-tabs
[
 {
  "label": "Python",
  "body": "```python\nfrom strands import Agent, tool\nfrom strands.vended_interventions.cedar import (\n    CedarAuthorization,\n)\n\n@tool\ndef search(query: str) -> str:\n    \"\"\"Search for information.\"\"\"\n    return f\"Results for: {query}\"\n\ncedar = CedarAuthorization(\n    policies=\"./policies/agent.cedar\",\n)\n\nagent = Agent(\n    tools=[search],\n    interventions=[cedar],\n)\n\n# After editing agent.cedar on disk:\ncedar.reload()\n# Validates new policies before applying.\n# Raises ValueError if invalid.\n```"
 },
 {
  "label": "TypeScript",
  "body": "```typescript\nimport { Agent, tool } from '@strands-agents/sdk'\nimport { CedarAuthorization } from '@strands-agents/sdk/vended-interventions/cedar'\nimport { z } from 'zod'\n\nconst searchTool = tool({\n  name: 'search',\n  description: 'Search for information',\n  inputSchema: z.object({ query: z.string() }),\n  callback: (input) => `Results for: ${input.query}`,\n})\n\nconst cedar = new CedarAuthorization({\n  policies: './policies/agent.cedar',\n})\n\nconst agent = new Agent({\n  tools: [searchTool],\n  interventions: [cedar],\n})\n\n// After editing agent.cedar on disk:\ncedar.reload()\n// Validates new policies before applying. Throws if invalid.\n```"
 }
]
```

`reload()` reads fresh policy, entity, and schema files, validates them, and atomically swaps the active policy set. If validation fails, the previous policies remain in effect and the method throws.

## Context structure

Every authorization request includes a structured context object:

```json
{
  "input": { "query": "quarterly report" },
  "session": {
    "hour_utc": 14,
    "call_count": 3,
    "role": "admin"
  }
}
```

-   `context.input` contains the tool’s input arguments, accessible in policies via `context.input.fieldName`
-   `context.session.hour_utc` is auto-populated with the current UTC hour (0-23)
-   `context.session.call_count` tracks per-tool invocation count
-   Additional `context.session` fields come from your `context_enricher``contextEnricher`

## Error handling

Cedar engine failures (malformed policies, evaluation errors) are always fail-closed: the tool call is denied regardless of configuration.

The `on_error``onError` option controls what happens when your user-supplied callbacks (`principal_resolver``principalResolver` or `context_enricher``contextEnricher`) raise an exception:

-   `'throw'` (default): re-raises the exception to the caller
-   `'deny'`: treats the callback failure as a denial (fail-closed)
-   `'proceed'`: allows the tool call despite the callback error (fail-open, use with caution)

## Installation

```sa-tabs
[
 {
  "label": "Python",
  "body": "```bash\npip install strands-agents[cedar]\n```\n\nRequires `cedarpy` and `cedar-policy-mcp-schema-generator` (installed automatically with the extra)."
 },
 {
  "label": "TypeScript",
  "body": "```bash\nnpm install @strands-agents/sdk\n```\n\nCedar support is included in the core package via `@cedar-policy/mcp-schema-generator-wasm`."
 }
]
```

## Cedar policy syntax

For the full policy language grammar, operators, and built-in functions, see the [Cedar policy language reference](https://docs.cedarpolicy.com/syntax-policy.html).

## Related pages

- [Human in the Loop](lc:user-guide/concepts/agents/interventions/human-in-the-loop) (2 shared tags)
- [Interventions](lc:user-guide/concepts/agents/interventions) (2 shared tags)
- [Creating a Custom Model Provider](lc:user-guide/concepts/model-providers/custom_model_provider) (1 shared tag)
- [Attack Strategies](lc:user-guide/evals-sdk/red-teaming/strategies) (1 shared tag)
- [Harmfulness Evaluator](lc:user-guide/evals-sdk/evaluators/harmfulness_evaluator) (1 shared tag)
- [Reading the Report](lc:user-guide/evals-sdk/red-teaming/reading_the_report) (1 shared tag)
- [Red Teaming](lc:user-guide/evals-sdk/red-teaming) (1 shared tag)
- [Refusal Evaluator](lc:user-guide/evals-sdk/evaluators/refusal_evaluator) (1 shared tag)
- [Responsible AI](lc:user-guide/safety-security/responsible-ai) (1 shared tag)
- [Scoring Attacks](lc:user-guide/evals-sdk/red-teaming/evaluators) (1 shared tag)


## Implementation

### Python

- [harness-sdk/strands-py/src/strands/vended_interventions/cedar/cedar_authorization.py](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_interventions/cedar/cedar_authorization.py)

### TypeScript

- [harness-sdk/strands-ts/src/vended-interventions/cedar/cedar.ts](https://github.com/strands-agents/harness-sdk/blob/main/strands-ts/src/vended-interventions/cedar/cedar.ts)
