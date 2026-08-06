The LangSmith connector lets browsers and other untrusted callers invoke an allowlisted set of LangSmith operations without ever receiving `LANGSMITH_API_KEY`. The key stays server-side: Managed Deep Agents runs each call with the workspace key, enforces ownership before calling LangSmith, and returns only the allowlisted response fields.


> [!NOTE]
>
> Managed Deep Agents is in **private [beta](lc:langsmith/release-stages)**, available on [LangSmith Cloud](lc:langsmith/cloud) in the US region only. [Join the waitlist](https://www.langchain.com/langsmith-managed-deep-agents-waitlist) to request access.


A capability is a single allowlisted LangSmith operation the connector exposes. Because each capability runs server-side and is scoped to the caller, the connector requires [identity](lc:langsmith/managed-deep-agents-identity). Identity lets each capability route resolve who is calling and confirm they own the resource, such as the thread or run, before the operation runs.

For other connector types, and how connectors differ from channels and identity connect, see [Connectors](lc:langsmith/managed-deep-agents-connectors/index) and [Choose the right integration](lc:langsmith/managed-deep-agents-connectors/index#choose-the-right-integration).

## Add a LangSmith connector

Add `connectors/langsmith.py` or `connectors/langsmith.ts` next to your [agent entry file](lc:langsmith/managed-deep-agents-cli#agent-entry). Export the connector as `connector` in Python or as the module default in TypeScript. Start with [presets](#presets) for the common browser surfaces, or compose [custom grants](#custom-capability-grants) when you need different scopes or constraints.

The following declaration mounts one HTTP route per capability id on your deployment.

```python connectors/langsmith.py
from managed_deepagents.connectors import langsmith

connector = langsmith.connector(
    langsmith.chat_feedback(dataset="public-feedback"),
    langsmith.trace_viewer(),
)
```

## Presets

Presets expand to stable capability ids that you then call over HTTP. Each preset is a set of builders, the `langsmith.*` functions that define one capability each.

### Chat feedback

`chatFeedback` / `chat_feedback` exposes two capabilities. The first lets each actor create, update, and delete a single feedback key on a run. The second saves the conversation as an example in a fixed dataset.

```python
langsmith.chat_feedback(dataset="public-feedback")
```

```ts
langsmith.chatFeedback({ dataset: "public-feedback" })
```

  LangSmith dataset name used by `langsmith:chat-feedback-examples`.

- **`langsmith:chat-feedback`**: run-scoped feedback for browsers. Key `user_score`, scores `positive` / `negative`, comments up to 2000 characters, `onePerActor`. Response fields: `id`, `run_id`, `key`, `score`, `created_at`.
- **`langsmith:chat-feedback-examples`**: thread-scoped example create. Allowed fields: `messages`, `answer`, `feedback`, `source`. Response fields: `id`, `dataset_id`, `created_at`.

The accordion shows the equivalent builder calls.

### Equivalent builders

  

  ```python
  langsmith.connector(
      langsmith.feedback(
          id="langsmith:chat-feedback",
          expose_to=["browser"],
          actions=["create", "update", "delete"],
          scope="run",
          keys=["user_score"],
          scores=["positive", "negative"],
          max_comment_chars=2000,
          one_per_actor=True,
      ),
      langsmith.examples(
          id="langsmith:chat-feedback-examples",
          expose_to=["browser"],
          actions=["create"],
          scope="thread",
          dataset="public-feedback",
          allowed_fields=["messages", "answer", "feedback", "source"],
      ),
  )
  ```

  ```ts
  langsmith.connector(
    langsmith.feedback({
      id: "langsmith:chat-feedback",
      exposeTo: ["browser"],
      actions: ["create", "update", "delete"],
      scope: "run",
      keys: ["user_score"],
      scores: ["positive", "negative"],
      maxCommentChars: 2000,
      onePerActor: true,
    }),
    langsmith.examples({
      id: "langsmith:chat-feedback-examples",
      exposeTo: ["browser"],
      actions: ["create"],
      scope: "thread",
      dataset: "public-feedback",
      allowedFields: ["messages", "answer", "feedback", "source"],
    }),
  );
  ```

  

### Trace viewer

`traceViewer` / `trace_viewer` exposes a read-only, redacted run summary and share link for the caller's thread.

```python
langsmith.trace_viewer()
```

```ts
langsmith.traceViewer()
```

Expands to **`langsmith:trace-viewer`**: thread-scoped `runs` with actions `read` and `share`, exposed to `browser`.

### Equivalent builder

  

  ```python
  langsmith.connector(
      langsmith.runs(
          id="langsmith:trace-viewer",
          expose_to=["browser"],
          actions=["read", "share"],
          scope="thread",
      )
  )
  ```

  ```ts
  langsmith.connector(
    langsmith.runs({
      id: "langsmith:trace-viewer",
      exposeTo: ["browser"],
      actions: ["read", "share"],
      scope: "thread",
    }),
  );
  ```

  

## Custom capability grants

When a preset is too narrow, compose builders yourself: `runs`, `feedback`, `examples`, `threads`, `prompts`, and `annotationQueues` / `annotation_queues`.

Each grant needs:

- A stable `id`: becomes `{capability_id}` in the HTTP path
- `exposeTo` / `expose_to`: who may call it (`browser`, `trusted_backend`, `channel`, `schedule`)
- `actions`: allowed values for the body's `action` field
- `scope`: ownership boundary (`agent`, `tenant`, `actor`, `thread`, `run`)

Each grant also takes optional response-shaping fields that keep browser responses small and fail closed on sensitive data (withhold it unless a grant opts in):

- `include`: an allowlist of response fields to return. Each resource has a conservative, browser-safe default when you omit it.
- `redact`: fields stripped from the response even if they appear in `include`. Acts as a backstop over the allowlist.
- `allowSensitive` / `allow_sensitive`: explicit opt-in to return a resource's sensitive fields (for example a run's `inputs`, `outputs`, and `events`), which are withheld otherwise.

Custom grants use the same HTTP route as presets; only the capability id and allowed body fields differ.


> [!TIP]
>
> Start from a preset, then copy the equivalent builders from the accordion above and adjust only the fields you need.


## Call the HTTP API

Each capability id maps to one route, and every route shares the same endpoint shape on the Agent Server:

```http
POST {deployment_url}/connectors/langsmith/capabilities/{capability_id}
Content-Type: application/json
```

`{deployment_url}` is your deployment's API base URL. Find it in LangSmith in the **Resource URL** column of the Deployments table, or under **API URL** in the Deployment details panel. This is not the deployment dashboard URL that [`mda deploy`](lc:langsmith/managed-deep-agents-deploy) prints on success.

If the `{capability_id}` contains a colon, URL-encode it as `%3A` in the path. For example, `langsmith:chat-feedback` becomes `langsmith%3Achat-feedback`.

### Authenticate

The route uses the same [identity ingress](lc:langsmith/managed-deep-agents-identity#ingress-identify-the-caller) as agent runs. Include identity headers on every request:

| Ingress | Headers |
| --- | --- |
| Validated token (browser-direct) | `Authorization: Bearer <token>` |
| Trusted backend | `X-MDA-Ingress-Secret`, `X-MDA-Actor-Id`, and `X-MDA-Tenant-Id` when multi-tenant |

Unauthenticated calls return `401`. Ownership failures return `403`.

### Body shape

Always send JSON with an `action` field. Other fields depend on the capability and action. CamelCase and snake_case keys are both accepted (`runId` / `run_id`, `threadId` / `thread_id`, and so on).

### Endpoints opened by the presets

With the connector example from [Add a LangSmith connector](#add-a-langsmith-connector), the deployment exposes three capability endpoints:

| Capability id | Preset | Allowed actions | Typical use |
| --- | --- | --- | --- |
| `langsmith:chat-feedback` | `chatFeedback` | `create`, `update`, `delete` | Thumbs up/down on a run |
| `langsmith:chat-feedback-examples` | `chatFeedback` | `create` | Save the conversation into a dataset |
| `langsmith:trace-viewer` | `traceViewer` | `read`, `share` | Redacted run summary / share link |

### Example: create feedback

```lc-tabs
[
 {
  "label": "curl",
  "lang": "bash",
  "code": "curl -X POST \\\n  \"$DEPLOYMENT_URL/connectors/langsmith/capabilities/langsmith%3Achat-feedback\" \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer $USER_TOKEN\" \\\n  -d '{\n    \"action\": \"create\",\n    \"runId\": \"<langsmith-run-id>\",\n    \"threadId\": \"<langgraph-thread-id>\",\n    \"key\": \"user_score\",\n    \"score\": \"positive\",\n    \"comment\": \"Helpful answer\"\n  }'"
 },
 {
  "label": "Fetch",
  "lang": "ts",
  "code": "await fetch(\n  `${deploymentUrl}/connectors/langsmith/capabilities/${encodeURIComponent(\"langsmith:chat-feedback\")}`,\n  {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\",\n      Authorization: `Bearer ${userToken}`,\n    },\n    body: JSON.stringify({\n      action: \"create\",\n      runId,\n      threadId,\n      key: \"user_score\",\n      score: \"positive\",\n      comment: \"Helpful answer\",\n    }),\n  },\n);"
 }
]
```

`create` requires `runId`, `key`, and (for this preset) a `score` of `positive` or `negative`. Optional: `comment`, `feedbackId`. Update and delete require `feedbackId` instead.

The two ids come from different systems: `runId` is the LangSmith run id for the traced turn, and `threadId` is the LangGraph thread id for the conversation. In the LangSmith UI, open the tracing project, then click **Runs** to find the run id or **Threads** to find the thread id.

From a trusted backend, replace the `Authorization: Bearer` header with the trusted-backend ingress headers:

```bash curl
curl -X POST \
  "$DEPLOYMENT_URL/connectors/langsmith/capabilities/langsmith%3Achat-feedback" \
  -H "Content-Type: application/json" \
  -H "X-MDA-Ingress-Secret: $MDA_INGRESS_SECRET" \
  -H "X-MDA-Actor-Id: $ACTOR_ID" \
  -H "X-MDA-Tenant-Id: $TENANT_ID" \
  -d '{
    "action": "create",
    "runId": "<langsmith-run-id>",
    "key": "user_score",
    "score": "positive"
  }'
```

Send `X-MDA-Tenant-Id` only for multi-tenant deployments. For how the runtime resolves these headers, see [identity ingress](lc:langsmith/managed-deep-agents-identity#ingress-identify-the-caller).

### Example: read a redacted trace

```lc-tabs
[
 {
  "label": "curl",
  "lang": "bash",
  "code": "curl -X POST \\\n  \"$DEPLOYMENT_URL/connectors/langsmith/capabilities/langsmith%3Atrace-viewer\" \\\n  -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer $USER_TOKEN\" \\\n  -d '{\n    \"action\": \"read\",\n    \"runId\": \"<langsmith-run-id>\",\n    \"threadId\": \"<langgraph-thread-id>\"\n  }'"
 },
 {
  "label": "Fetch",
  "lang": "ts",
  "code": "await fetch(\n  `${deploymentUrl}/connectors/langsmith/capabilities/${encodeURIComponent(\"langsmith:trace-viewer\")}`,\n  {\n    method: \"POST\",\n    headers: {\n      \"Content-Type\": \"application/json\",\n      Authorization: `Bearer ${userToken}`,\n    },\n    body: JSON.stringify({\n      action: \"read\",\n      runId,\n      threadId,\n    }),\n  },\n);"
 }
]
```

Use `"action": "share"` with the same ids to get a share URL. Responses include `id`, `status`, `start_time`, `end_time`, `url`, and `metadata`. Sensitive fields (`inputs`, `outputs`, `events`) stay redacted unless you build a custom grant with `allowSensitive` / `allow_sensitive`.

## Test and deploy


Test the project locally with [`mda dev`](lc:langsmith/managed-deep-agents-cli#develop-locally), then deploy it with [`mda deploy`](lc:langsmith/managed-deep-agents-deploy). Open deployment traces in LangSmith to inspect model calls, tool calls, errors, and latency.


Capability calls return 401 without a resolved identity and 403 when ownership checks fail. Confirm [identity](lc:langsmith/managed-deep-agents-identity) is declared and that callers authenticate through the configured ingress mode.

## Next steps

  ### [Identity](#)
Authenticate callers and scope threads before exposing capabilities.

  ### [Connectors](#)
Compare LangSmith and MCP connector types.

  ### [Deploy an agent](#)
Deploy the connector-enabled agent.
