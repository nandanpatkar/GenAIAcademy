ContextInjector plugin for injecting just-in-time context into the model input.

This module provides the ContextInjector plugin, which folds just-in-time text into the model input before each call without touching durable history.

**Example**:

```python
import datetime

from strands import Agent
from strands.vended_plugins.context_injector import ContextInjector

agent = Agent(
    plugins=[
        ContextInjector(lambda context: f"<now>\{datetime.datetime.now().isoformat()}</now>")
    ]
)
```

## ContextInjector

```python
class ContextInjector(Plugin)
```

Defined in: [src/strands/vended\_plugins/context\_injector/plugin.py:37](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/context_injector/plugin.py#L37)

Plugin that injects just-in-time context into the model input before each call.

Before each model call, the plugin asks `render_content` for text and makes it available to the model for that call, gated by `trigger`. The injected text is ephemeral: it augments the model input for that one call and never persists into the durable conversation or session.

Multiple injectors may be registered; each contributes its text independently, in plugin-registration order.

**Arguments**:

-   `render_content` - Renders the text to inject for this call, or `None`/`""` to skip. Sync or async. The text reaches the model verbatim, so it is a prompt-injection
-   `surface` - escape any attacker-influenced fields yourself. A callback that raises fails open (injection is skipped, the model call proceeds).
-   `name` - Plugin name, for logging and duplicate detection. Defaults to `"strands:context-injector"`. Set a distinct name when registering more than one injector so they can be told apart.
-   `trigger` - When to inject. An `InjectionTrigger` name selects a built-in policy (`"userTurn"` — default — or `"everyTurn"`); a predicate over the `InjectionContext` is the escape hatch. A predicate that raises fails open (injection is skipped). Defaults to `"userTurn"`.

**Example**:

```python
from strands import Agent
from strands.vended_plugins.context_injector import ContextInjector

agent = Agent(
    plugins=[
        ContextInjector(lambda context: f"<context>\{derive(context.messages)}</context>")
    ]
)
```

#### \_\_init\_\_

```python
def __init__(render_content: RenderContent,
             *,
             name: str | None = None,
             trigger: InjectionTriggerPredicate | None = None) -> None
```

Defined in: [src/strands/vended\_plugins/context\_injector/plugin.py:76](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/context_injector/plugin.py#L76)

Initialize the ContextInjector plugin.

**Arguments**:

-   `render_content` - Renders the text to inject for this call. Sync or async.
-   `name` - Plugin name. Defaults to `"strands:context-injector"`.
-   `trigger` - When to inject. Defaults to `"userTurn"`.

#### init\_agent

```python
def init_agent(agent: Agent) -> None
```

Defined in: [src/strands/vended\_plugins/context\_injector/plugin.py:95](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/vended_plugins/context_injector/plugin.py#L95)

Register the injection middleware on the agent’s `InvokeModelStage` input phase.
