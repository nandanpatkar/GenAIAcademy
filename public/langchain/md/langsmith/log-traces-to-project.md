This page covers how to control where LangSmith sends your traces:

- [Set the destination project statically](#set-the-destination-project-statically)
- [Set the destination project dynamically](#set-the-destination-project-dynamically)
- [Set the destination workspace dynamically](#set-the-destination-workspace-dynamically)
- [Write traces to multiple destinations with replicas](#write-traces-to-multiple-destinations-with-replicas)
- [Leave feedback on all replica instances](#leave-feedback-on-all-replica-instances)

## Set the destination project statically

LangSmith uses the concept of a [_project_](lc:langsmith/observability-concepts#projects) to group traces. If left unspecified, the project is set to `default`.

You can set the `LANGSMITH_PROJECT` environment variable to configure a custom project name for an entire application run. Set this before running your application:

```bash
export LANGSMITH_PROJECT=my-custom-project
```


> [!WARNING]
>
> The `LANGSMITH_PROJECT` flag is only supported in JS SDK versions >= 0.2.16, use `LANGCHAIN_PROJECT` instead if you are using an older version.


If the project specified does not exist, LangSmith will automatically create it when the first trace is ingested.

## Set the destination project dynamically

You can also set the project name at program runtime in various ways, depending on how you are [annotating your code for tracing](lc:langsmith/annotate-code). This is useful when you want to log traces to different projects within the same application:

- Pass the project name at decoration or configuration time.
- Override it per individual call.
- Set it when constructing a run directly.


> [!NOTE]
>
> Setting the project name dynamically using one of the following methods overrides the project name set by the `LANGSMITH_PROJECT` environment variable.


```lc-tabs
[
 {
  "label": "Python expandable wrap",
  "lang": "python",
  "code": "from langsmith import traceable\nfrom langsmith.run_trees import RunTree\n\nclient = openai.Client()\nmessages = [\n  {\"role\": \"system\", \"content\": \"You are a helpful assistant.\"},\n  {\"role\": \"user\", \"content\": \"Hello!\"}\n]\n\n# Use the @traceable decorator with the 'project_name' parameter to log traces to LangSmith\n# Ensure that the LANGSMITH_TRACING environment variables is set for @traceable to work\n@traceable(\n  run_type=\"llm\",\n  name=\"OpenAI Call Decorator\",\n  project_name=\"My Project\"\n)\ndef call_openai(\n  messages: list[dict], model: str = \"gpt-5.4-mini\"\n) -> str:\n  return client.chat.completions.create(\n      model=model,\n      messages=messages,\n  ).choices[0].message.content\n\n# Call the decorated function\ncall_openai(messages)\n\n# You can also specify the Project via the project_name parameter\n# This will override the project_name specified in the @traceable decorator\ncall_openai(\n  messages,\n  langsmith_extra={\"project_name\": \"My Overridden Project\"},\n)\n\n# The wrapped OpenAI client accepts all the same langsmith_extra parameters\n# as @traceable decorated functions, and logs traces to LangSmith automatically.\n# Ensure that the LANGSMITH_TRACING environment variables is set for the wrapper to work.\nfrom langsmith import wrappers\nwrapped_client = wrappers.wrap_openai(client)\nwrapped_client.chat.completions.create(\n  model=\"gpt-5.4-mini\",\n  messages=messages,\n  langsmith_extra={\"project_name\": \"My Project\"},\n)\n\n# Alternatively, create a RunTree object\n# You can set the project name using the project_name parameter\nrt = RunTree(\n  run_type=\"llm\",\n  name=\"OpenAI Call RunTree\",\n  inputs={\"messages\": messages},\n  project_name=\"My Project\"\n)\nchat_completion = client.chat.completions.create(\n  model=\"gpt-5.4-mini\",\n  messages=messages,\n)\n# End and submit the run\nrt.end(outputs=chat_completion)\nrt.post()"
 },
 {
  "label": "Java expandable wrap",
  "lang": "java",
  "code": "/**\n * Simple example: Send a single OpenTelemetry trace to LangSmith.\n *\n * Usage:\n *   export LANGSMITH_API_KEY=your_api_key\n *   export LANGSMITH_PROJECT=your_project_name  # Optional, defaults to \"default\"\n */\npublic class OtelLangSmithSimpleExample {\n    public static void main(String[] args) throws Exception {\n        // Get API key and project name\n        String apiKey = System.getenv(\"LANGSMITH_API_KEY\");\n        if (apiKey == null || apiKey.isEmpty()) {\n            System.err.println(\"ERROR: LANGSMITH_API_KEY environment variable is required!\");\n            return;\n        }\n\n        String projectName = System.getenv(\"LANGSMITH_PROJECT\");\n        if (projectName == null || projectName.isEmpty()) {\n            projectName = \"default\";\n        }\n\n        // Configure exporter\n        Map<String, String> headers = new HashMap<>();\n        headers.put(\"x-api-key\", apiKey);\n        headers.put(\"Langsmith-Project\", projectName);\n\n        OtelConfig config = OtelConfig.builder()\n                .enabled(true)\n                .endpoint(\"https://api.smith.langchain.com/otel/v1/traces\")\n                .headers(headers)\n                .timeout(Duration.ofSeconds(30))\n                .serviceName(\"langsmith-java-simple\")\n                .build();\n\n        OtelTraceExporter exporter = OtelTraceExporter.fromConfig(config);\n        Tracer tracer = exporter.getTracer();\n\n        // Create a simple span\n        Span span = OtelSpanCreator.createLlmSpan(\n                tracer, \"simple.llm.call\", \"openai\", \"gpt-4\", projectName, null);\n\n        try {\n            OtelSpanCreator.setInput(span, \"Hello, world!\");\n            Thread.sleep(100); // Simulate processing\n            OtelSpanCreator.setOutput(span, \"Hello! How can I help you?\");\n            OtelSpanCreator.setTokenUsage(span, 5, 8);\n            span.setStatus(StatusCode.OK);\n        } finally {\n            span.end();\n        }\n\n        // Flush and shutdown\n        exporter.flush().join(5, java.util.concurrent.TimeUnit.SECONDS);\n        exporter.shutdown().join(2, java.util.concurrent.TimeUnit.SECONDS);\n\n        System.out.println(\"\u2713 Trace sent to LangSmith!\");\n    }\n}"
 }
]
```

## Set the destination workspace dynamically

If you need to route traces dynamically to different LangSmith [workspaces](lc:langsmith/administration-overview#workspaces) based on runtime configuration (e.g., routing different users or tenants to separate workspaces), the approach differs by language:

- **Python**: use workspace-specific LangSmith clients with [`tracing_context`](lc:langsmith/annotate-code#use-the-trace-context-manager-python-only).
- **TypeScript**: pass a custom client to [`traceable`](lc:langsmith/annotate-code#use-%40traceable-%2F-traceable), or use `LangChainTracer` with callbacks.

This approach is useful for multi-tenant applications where you want to isolate traces by customer, environment, or team at the workspace level. It works with any LangSmith-compatible tracing, including LangChain, OpenAI, and custom functions decorated with `@traceable`.

### Prerequisites

- A [LangSmith API key](lc:langsmith/create-account-api-key) with access to multiple workspaces.
- The [workspace IDs](lc:langsmith/set-up-hierarchy#set-up-a-workspace) for each target workspace.

### Generic cross-workspace tracing

Use this approach for general applications where you want to dynamically route traces to different workspaces based on runtime logic (e.g., customer ID, tenant, or environment).

**Key components:**

1. Initialize separate `Client` instances for each workspace with their respective `workspace_id`.
2. Use `tracing_context` (Python) or pass the workspace-specific `client` to `traceable` (TypeScript) to route traces.
3. Pass workspace configuration through your application's runtime config.
4. Override both the workspace and project name per route to organize traces further within each workspace.

```python Python
from langsmith import Client, traceable, tracing_context

# API key with access to multiple workspaces
api_key = os.getenv("LS_CROSS_WORKSPACE_KEY")

# Initialize clients for different workspaces
workspace_a_client = Client(
    api_key=api_key,
    api_url="https://api.smith.langchain.com",
    workspace_id="<YOUR_WORKSPACE_A_ID>"  # e.g., "abc123..."
)

workspace_b_client = Client(
    api_key=api_key,
    api_url="https://api.smith.langchain.com",
    workspace_id="<YOUR_WORKSPACE_B_ID>"  # e.g., "def456..."
)

# Example: Route based on customer ID
def get_workspace_client(customer_id: str):
    """Route to appropriate workspace based on customer."""
    if customer_id.startswith("premium_"):
        return workspace_a_client, "premium-customer-traces"
    else:
        return workspace_b_client, "standard-customer-traces"

@traceable
def process_request(data: dict, customer_id: str):
    """Process a customer request with workspace-specific tracing."""
    # Your business logic here
    return {"status": "success", "data": data}

# Use tracing_context to route to the appropriate workspace
def handle_customer_request(customer_id: str, request_data: dict):
    client, project_name = get_workspace_client(customer_id)

    # Everything within this context will be traced to the selected workspace
    with tracing_context(enabled=True, client=client, project_name=project_name):
        result = process_request(request_data, customer_id)

    return result

# Example usage
handle_customer_request("premium_user_123", {"query": "Hello"})
handle_customer_request("standard_user_456", {"query": "Hi"})
```

### Override default workspace for LangSmith deployments

When [deploying agents](lc:langsmith/deployment) to LangSmith, you can override the default workspace that traces are sent to by using a graph lifespan context manager. This is useful when you want to route traces from a deployed agent to different workspaces based on runtime configuration passed through the `config` parameter.

```python Python
from typing_extensions import TypedDict
from langgraph.graph import StateGraph
from langgraph.graph.state import RunnableConfig
from langsmith import Client, tracing_context

# API key with access to multiple workspaces
api_key = os.getenv("LS_CROSS_WORKSPACE_KEY")

# Initialize clients for different workspaces
workspace_a_client = Client(
    api_key=api_key,
    api_url="https://api.smith.langchain.com",
    workspace_id="<YOUR_WORKSPACE_A_ID>"
)

workspace_b_client = Client(
    api_key=api_key,
    api_url="https://api.smith.langchain.com",
    workspace_id="<YOUR_WORKSPACE_B_ID>"
)

# Define configuration schema for workspace routing
class Configuration(TypedDict):
    workspace_id: str

# Define the graph state
class State(TypedDict):
    response: str

def greeting(state: State, config: RunnableConfig) -> State:
    """Generate a workspace-specific greeting."""
    workspace_id = config.get("configurable", {}).get("workspace_id", "workspace_a")

    if workspace_id == "workspace_a":
        response = "Hello from Workspace A!"
    elif workspace_id == "workspace_b":
        response = "Hello from Workspace B!"
    else:
        response = "Hello from the default workspace!"

    return {"response": response}

# Build the base graph
base_graph = (
    StateGraph(state_schema=State, config_schema=Configuration)
    .add_node("greeting", greeting)
    .set_entry_point("greeting")
    .set_finish_point("greeting")
    .compile()
)

@contextlib.asynccontextmanager
async def graph(config):
    """Dynamically route traces to different workspaces based on configuration."""
    # Extract workspace_id from the configuration
    workspace_id = config.get("configurable", {}).get("workspace_id", "workspace_a")

    # Route to the appropriate workspace
    if workspace_id == "workspace_a":
        client = workspace_a_client
        project_name = "production-traces"
    elif workspace_id == "workspace_b":
        client = workspace_b_client
        project_name = "development-traces"
    else:
        client = workspace_a_client
        project_name = "default-traces"

    # Apply the tracing context for the selected workspace
    with tracing_context(enabled=True, client=client, project_name=project_name):
        yield base_graph

# Usage: Invoke with different workspace configurations
# await graph({"configurable": {"workspace_id": "workspace_a"}})
# await graph({"configurable": {"workspace_id": "workspace_b"}})
```


> [!NOTE]
>
> When deploying with cross-workspace tracing, ensure your service key or PAT has the necessary permissions for all target workspaces. We recommend using a multi-workspace service key for production deployments. For LangSmith deployments, you must add a service key with cross-workspace access to your environment variables (e.g., `LS_CROSS_WORKSPACE_KEY`) to override the default service key generated by your deployment.


## Write traces to multiple destinations with replicas

Replicas let you send every trace to multiple projects or workspaces **at the same time**. Unlike the dynamic routing patterns where each trace goes to one destination, replicas duplicate the trace to all configured destinations in parallel.

Replicas can be useful for:

- Mirror production traces into a staging or personal project for debugging.
- Write to multiple workspaces for multi-tenant isolation without changing any application code.
- Send traces to the same server under different projects, with per-replica metadata overrides.

### Configure replicas via environment variable

Set the `LANGSMITH_RUNS_ENDPOINTS` environment variable to a JSON value. Two formats are supported:

- **Object format**: maps each endpoint URL to its API key:

    ```bash
    export LANGSMITH_RUNS_ENDPOINTS='{
    "https://api.smith.langchain.com": "ls__key_workspace_a",
    "https://api.smith.langchain.com": "ls__key_workspace_b"
    }'
    ```

- **Array format**: a list of replica objects, useful when you need multiple replicas pointing at the same URL or when you want to set a `project_name` per replica:

    ```bash
    export LANGSMITH_RUNS_ENDPOINTS='[
    {"api_url": "https://api.smith.langchain.com", "api_key": "ls__key1", "project_name": "project-prod"},
    {"api_url": "https://api.smith.langchain.com", "api_key": "ls__key2", "project_name": "project-staging"}
    ]'
    ```


> [!WARNING]
>
> You cannot use `LANGSMITH_RUNS_ENDPOINTS` alongside `LANGSMITH_ENDPOINT`. If you set both, LangSmith raises an error. Use only one to configure your endpoint.


### Configure replicas at runtime

You can also pass replicas directly in code, which is useful when destinations vary per request or tenant.

```python Python
from langsmith import traceable, tracing_context
from langsmith.run_trees import WriteReplica, ApiKeyAuth

@traceable
def my_pipeline(query: str) -> str:
    # Your application logic here
    return f"Answer to: {query}"

replicas = [
    WriteReplica(
        api_url="https://api.smith.langchain.com",
        auth=ApiKeyAuth(api_key="ls__key_workspace_a"),
        project_name="project-prod",
    ),
    WriteReplica(
        api_url="https://api.smith.langchain.com",
        auth=ApiKeyAuth(api_key="ls__key_workspace_b"),
        project_name="project-staging",
        # Optionally override fields on the replicated run
        updates={"metadata": {"environment": "staging"}},
    ),
]

with tracing_context(replicas=replicas):
    my_pipeline("What is LangSmith?")
```

You can also use the `updates` field to merge additional fields (such as [metadata or tags](lc:langsmith/ls-metadata-parameters)) into a run for a specific replica only—the primary trace is unchanged. Replica errors are non-fatal: if a replica endpoint is unavailable, LangSmith logs the error without affecting the primary trace.


> [!WARNING]
>
> Auth does not propagate in distributed traces. When a trace spans multiple services, LangSmith forwards replica `project_name` and `updates` to downstream services automatically, but not API keys or credentials. Each service must configure its own credentials for replica destinations.


### Replicate within the same server (project-only replicas)

If all your replicas use the same LangSmith server, you can omit `api_url` and `auth` and specify only a `project_name`. The SDK reuses the default client credentials:

```python Python
from langsmith import traceable, tracing_context
from langsmith.run_trees import WriteReplica

@traceable
def my_pipeline(query: str) -> str:
    return f"Answer to: {query}"

with tracing_context(
    replicas=[
        WriteReplica(project_name="project-prod"),
        WriteReplica(project_name="project-staging", updates={"metadata": {"env": "staging"}}),
    ]
):
    my_pipeline("What is LangSmith?")
```

### Leave feedback on all replica instances

When you use replicas, each replica receives a copy of every run. To submit feedback for a run on a specific replica, you need that replica's run ID. Starting in **Python SDK 0.10.8** and **JS SDK 0.8.5**, you can designate one replica as the **primary** and use `compute_run_id_for_secondary_replica` to deterministically calculate the run IDs for all other replicas.

The **primary** replica keeps the original run ID unchanged. Each **secondary** replica receives a deterministic run ID derived from the original run ID and the secondary replica's project name. Use `compute_run_id_for_secondary_replica(original_run_id, project_name)` to compute the secondary run ID and pass it when calling `create_feedback`.

```python Python
from langsmith import (
    Client,
    compute_run_id_for_secondary_replica,
    trace,
    tracing_context,
)

primary_client = Client(api_key="primary-key")
secondary_client = Client(api_key="secondary-key")

primary_project = "production"
secondary_project = "backup-project"

with tracing_context(
    replicas=[
        {
            "project_name": primary_project,
            "primary": True,
            "client": primary_client,
        },
        {
            "project_name": secondary_project,
            "primary": False,
            "client": secondary_client,
        },
    ]
):
    with trace("answer-question", inputs={"question": "Capital of France?"}) as run:
        run.outputs = {"answer": "Paris"}

# Compute the secondary replica's run ID from the original run ID and project name
secondary_run_id = compute_run_id_for_secondary_replica(
    run.id,
    secondary_project,
)

# Each replica has its own project; resolve the corresponding project UUIDs
primary_session_id = primary_client.create_project(project_name=primary_project, upsert=True).id
secondary_session_id = secondary_client.create_project(project_name=secondary_project, upsert=True).id

# Submit feedback to the primary replica using the original run ID
primary_client.create_feedback(
    trace_id=run.id,
    key="user-rating",
    score=1,
    session_id=primary_session_id,
)

# Submit feedback to the secondary replica using the computed run ID
secondary_client.create_feedback(
    trace_id=secondary_run_id,
    key="user-rating",
    score=1,
    session_id=secondary_session_id,
)
```


> [!NOTE]
>
> The `compute_run_id_for_secondary_replica` / `computeRunIdForSecondaryReplica` helper is available in Python SDK >= 0.10.8 and JS SDK >= 0.8.5. If you are using an earlier SDK version, upgrade to use this feature.


### Route between LangSmith and OpenTelemetry destinations

You can decide at runtime whether a given invocation sends traces to LangSmith, to an OpenTelemetry (OTel) backend, or to both, without redeploying or modifying application logic. This is useful when you want to toggle between observability backends per environment, or even per request, making the decision at runtime.

Set the tracing mode using the `tracing_mode` constructor argument or the `LANGSMITH_TRACING_MODE` environment variable. Both accept the same values; an explicit `tracing_mode` argument always takes precedence over the env var:

- **`"langsmith"` (default)**: sends traces natively to LangSmith.
- **`"otel"`**: exports traces as OpenTelemetry spans to a configured OTel backend.
- **`"hybrid"` (Python only)**: sends to both LangSmith and an OTel backend from a single replica.


> [!NOTE]
>
> If you are using the deprecated `otel_enabled` parameter on `Client` (Python only), migrate to `tracing_mode`: `Client(otel_enabled=True)` → `Client(tracing_mode="hybrid")`. The `otel_enabled` parameter will be removed in the next minor version.


Pass a configured `Client` directly into a replica to apply the desired mode at runtime:

```python Python expandable wrap
from langsmith import Client, traceable, tracing_context
from langsmith.run_trees import WriteReplica
from langsmith.wrappers import wrap_openai

# Create clients with different tracing modes
ls_client = Client()                            # tracing_mode="langsmith" (default)
otel_client = Client(tracing_mode="otel")       # tracing_mode="otel"
hybrid_client = Client(tracing_mode="hybrid")   # tracing_mode="hybrid" (both)

openai_client = wrap_openai(openai.Client())

@traceable()
def joke():
    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": "Tell me a short joke."}],
    )
    return response.choices[0].message.content

# Mix tracing modes across replicas in a single invocation:
# one replica sends via LangSmith's native format, another as OTel spans.
with tracing_context(replicas=[
    WriteReplica(client=ls_client),    # tracing_mode="langsmith"
    WriteReplica(client=otel_client),  # tracing_mode="otel"
]):
    joke()

# Alternatively, a single hybrid replica sends to both simultaneously.
with tracing_context(replicas=[WriteReplica(client=hybrid_client)]):
    joke()

# Swap replica lists at runtime — e.g. based on a feature flag or environment.
def get_replicas(send_to_otel: bool):
    replicas = [WriteReplica(client=ls_client)]
    if send_to_otel:
        replicas.append(WriteReplica(client=otel_client))
    return replicas

with tracing_context(replicas=get_replicas(send_to_otel=True)):   # LangSmith + OTel
    joke()

with tracing_context(replicas=get_replicas(send_to_otel=False)):  # LangSmith only
    joke()
```

The `tracing_mode` on each `Client` determines that replica's export path. In Python, `"hybrid"` mode handles both destinations within a single replica. In TypeScript, the "send to both" case uses two separate replicas, one for each client, because there is no `"hybrid"` mode. Since each replica resolves its own client independently, you can also mix modes within a single `tracing_context`, for example keeping one replica sending to LangSmith while forwarding the same trace to an OTel collector via a second replica.
