Base class for intervention handlers.

Handlers override the lifecycle methods they care about. Default implementations return Proceed. The framework detects which methods are overridden and only registers hook callbacks for those.

#### OnError

What to do when a handler throws during evaluation.

-   `'throw'` — rethrow the error (default, safest: a broken policy check blocks execution)
-   `'proceed'` — log the error and continue as if the handler returned Proceed. **This mode is fail-open**: a broken handler silently stops enforcing its policy. Use only when availability matters more than enforcement.
-   `'deny'` — log the error and treat it as a Deny (fail-closed)

## InterventionHandler

```python
class InterventionHandler(ABC)
```

Defined in: [src/strands/interventions/handler.py:43](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L43)

Base class for intervention handlers.

Subclasses must define a `name` attribute and override the lifecycle methods they care about at the **class level**. The framework detects which methods are overridden and only calls those. Instance-level assignments (e.g., `handler.before_tool_call = my_func`) are not detected.

Lifecycle methods may be implemented as either sync or `async` functions. The registry awaits any override that returns an awaitable, so an `async` handler can await I/O (a database lookup, an HTTP authorization call, a human approval prompt) before deciding on an action. The return annotations use `_MaybeAwaitable` to reflect that an override is free to return its action directly or as a coroutine.

**Example**:

```python
class CedarAuth(InterventionHandler):
    name = "cedar-auth"

    def before_tool_call(self, event):
        if not self.is_authorized(event):
            return Deny(reason="not authorized")
        return Proceed()
```

#### name

```python
@property
@abstractmethod
def name() -> str
```

Defined in: [src/strands/interventions/handler.py:72](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L72)

Unique name identifying this handler.

#### on\_error

```python
@property
def on_error() -> OnError
```

Defined in: [src/strands/interventions/handler.py:77](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L77)

What to do when this handler throws. Defaults to ‘throw’.

#### before\_invocation

```python
def before_invocation(
        event: BeforeInvocationEvent,
        **kwargs: Any) -> _MaybeAwaitable[Proceed | Deny | Guide | Transform]
```

Defined in: [src/strands/interventions/handler.py:81](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L81)

Called before an agent invocation begins.

#### before\_tool\_call

```python
def before_tool_call(
    event: BeforeToolCallEvent, **kwargs: Any
) -> _MaybeAwaitable[Proceed | Deny | Guide | Confirm | Transform]
```

Defined in: [src/strands/interventions/handler.py:87](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L87)

Called before a tool is executed.

#### after\_tool\_call

```python
def after_tool_call(event: AfterToolCallEvent,
                    **kwargs: Any) -> _MaybeAwaitable[Proceed | Transform]
```

Defined in: [src/strands/interventions/handler.py:93](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L93)

Called after a tool execution completes.

#### before\_model\_call

```python
def before_model_call(
        event: BeforeModelCallEvent,
        **kwargs: Any) -> _MaybeAwaitable[Proceed | Deny | Guide | Transform]
```

Defined in: [src/strands/interventions/handler.py:97](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L97)

Called before the model is invoked.

#### after\_model\_call

```python
def after_model_call(
        event: AfterModelCallEvent,
        **kwargs: Any) -> _MaybeAwaitable[Proceed | Guide | Transform]
```

Defined in: [src/strands/interventions/handler.py:103](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/handler.py#L103)

Called after the model invocation completes.
