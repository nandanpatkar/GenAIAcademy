A2A-compatible wrapper for Strands Agent.

This module provides the A2AServer class, which adapts a Strands Agent to the A2A protocol, allowing it to be used in A2A-compatible systems.

## A2AServer

```python
class A2AServer()
```

Defined in: [src/strands/multiagent/a2a/server.py:29](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L29)

A2A-compatible wrapper for Strands Agent.

#### \_\_init\_\_

```python
def __init__(agent: SAAgent | None = None,
             *,
             agent_factory: AgentFactory | None = None,
             max_contexts: int = StrandsA2AExecutor.DEFAULT_MAX_CONTEXTS,
             host: str = "127.0.0.1",
             port: int = 9000,
             http_url: str | None = None,
             serve_at_root: bool = False,
             version: str = "0.0.1",
             skills: list[AgentSkill] | None = None,
             task_store: TaskStore | None = None,
             queue_manager: QueueManager | None = None,
             push_config_store: PushNotificationConfigStore | None = None,
             push_sender: PushNotificationSender | None = None,
             enable_a2a_compliant_streaming: bool = False)
```

Defined in: [src/strands/multiagent/a2a/server.py:32](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L32)

Initialize an A2A-compatible server from a Strands agent.

Provide exactly one of `agent` or `agent_factory`:

-   `agent_factory` (recommended): a callable `(context_id) -> Agent` that builds a dedicated agent per A2A context. Contexts run concurrently and the factory is the place to wire per-context concerns such as a context-scoped `session_manager`. The factory is invoked once at construction (with a placeholder context id) solely to derive the agent card metadata (name, description, skills); that agent is not used for request handling. An expensive factory therefore pays its cost once at startup.
-   `agent` (deprecated): a single agent serving one conversation. Not multi-tenant safe — every A2A context reuses the same instance — so use `agent_factory` for multi-caller deployments.

**Arguments**:

-   `agent` - A single Strands Agent to wrap. Deprecated; prefer `agent_factory`.
-   `agent_factory` - Callable `(context_id) -> Agent` building a fresh agent per context.
-   `max_contexts` - Maximum number of per-context agents to retain concurrently (factory mode); the least-recently-used is evicted beyond this. Must be >= 1.
-   `host` - The hostname or IP address to bind the A2A server to. Defaults to “127.0.0.1”.
-   `port` - The port to bind the A2A server to. Defaults to 9000.
-   `http_url` - The public HTTP URL where this agent will be accessible. If provided, this overrides the generated URL from host/port and enables automatic path-based mounting for load balancer scenarios.
-   `Example` - “[http://my-alb.amazonaws.com/agent1](http://my-alb.amazonaws.com/agent1)”
-   `serve_at_root` - If True, forces the server to serve at root path regardless of http\_url path component. Use this when your load balancer strips path prefixes. Defaults to False.
-   `version` - The version of the agent. Defaults to “0.0.1”.
-   `skills` - The list of capabilities or functions the agent can perform.
-   `task_store` - Custom task store implementation for managing agent tasks. If None, uses InMemoryTaskStore.
-   `queue_manager` - Custom queue manager for handling message queues. If None, no queue management is used.
-   `push_config_store` - Custom store for push notification configurations. If None, no push notification configuration is used.
-   `push_sender` - Custom push notification sender implementation. If None, no push notifications are sent.
-   `enable_a2a_compliant_streaming` - If True, uses A2A-compliant streaming with artifact updates. If False, uses legacy status updates streaming behavior for backwards compatibility. Defaults to False.

**Raises**:

-   `ValueError` - If neither or both of `agent`/`agent_factory` are provided, or if `max_contexts` is less than 1.

#### public\_agent\_card

```python
@property
def public_agent_card() -> AgentCard
```

Defined in: [src/strands/multiagent/a2a/server.py:163](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L163)

Get the public AgentCard for this agent.

The AgentCard contains metadata about the agent, including its name, description, URL, version, skills, and capabilities. This information is used by other agents and systems to discover and interact with this agent.

**Returns**:

-   `AgentCard` - The public agent card containing metadata about this agent.

**Raises**:

-   `ValueError` - If name or description is None or empty.

#### agent\_card\_url

```python
@property
def agent_card_url() -> str
```

Defined in: [src/strands/multiagent/a2a/server.py:207](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L207)

Get the URL advertised in the AgentCard.

Defaults to http\_url. Can be overridden to advertise a custom URL (e.g., without trailing slash or with a different base).

#### agent\_card\_url

```python
@agent_card_url.setter
def agent_card_url(url: str) -> None
```

Defined in: [src/strands/multiagent/a2a/server.py:216](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L216)

Override the URL advertised in the AgentCard.

**Arguments**:

-   `url` - The URL to advertise in the AgentCard.

#### agent\_skills

```python
@property
def agent_skills() -> list[AgentSkill]
```

Defined in: [src/strands/multiagent/a2a/server.py:225](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L225)

Get the list of skills this agent provides.

#### agent\_skills

```python
@agent_skills.setter
def agent_skills(skills: list[AgentSkill]) -> None
```

Defined in: [src/strands/multiagent/a2a/server.py:230](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L230)

Set the list of skills this agent provides.

**Arguments**:

-   `skills` - A list of AgentSkill objects to set for this agent.

#### to\_starlette\_app

```python
def to_starlette_app(*, app_kwargs: dict[str, Any] | None = None) -> Starlette
```

Defined in: [src/strands/multiagent/a2a/server.py:238](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L238)

Create a Starlette application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http\_url parameter.

**Arguments**:

-   `app_kwargs` - Additional keyword arguments to pass to the Starlette constructor.

**Returns**:

-   `Starlette` - A Starlette application configured to serve this agent.

#### to\_fastapi\_app

```python
def to_fastapi_app(*, app_kwargs: dict[str, Any] | None = None) -> FastAPI
```

Defined in: [src/strands/multiagent/a2a/server.py:263](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L263)

Create a FastAPI application for serving this agent via HTTP.

Automatically handles path-based mounting if a mount path was derived from the http\_url parameter.

**Arguments**:

-   `app_kwargs` - Additional keyword arguments to pass to the FastAPI constructor.

**Returns**:

-   `FastAPI` - A FastAPI application configured to serve this agent.

#### serve

```python
def serve(app_type: Literal["fastapi", "starlette"] = "starlette",
          *,
          host: str | None = None,
          port: int | None = None,
          **kwargs: Any) -> None
```

Defined in: [src/strands/multiagent/a2a/server.py:288](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/multiagent/a2a/server.py#L288)

Start the A2A server with the specified application type.

This method starts an HTTP server that exposes the agent via the A2A protocol. The server can be implemented using either FastAPI or Starlette, depending on the specified app\_type.

**Arguments**:

-   `app_type` - The type of application to serve, either “fastapi” or “starlette”. Defaults to “starlette”.
-   `host` - The host address to bind the server to. Defaults to “0.0.0.0”.
-   `port` - The port number to bind the server to. Defaults to 9000.
-   `**kwargs` - Additional keyword arguments to pass to uvicorn.run.
