Intervention action types.

Each action represents a typed decision that a handler returns after evaluating an event. The framework uses these to compose decisions across multiple handlers.

#### default\_evaluate

```python
def default_evaluate(response: Any) -> bool
```

Defined in: [src/strands/interventions/actions.py:26](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L26)

Default evaluate function for the confirm action.

Accepts: True, ‘y’/‘yes’ (case-insensitive, whitespace-trimmed).

**Arguments**:

-   `response` - The human’s response value to evaluate.

**Returns**:

True if the response is considered an approval, False otherwise.

## Proceed

```python
@dataclass(frozen=True)
class Proceed()
```

Defined in: [src/strands/interventions/actions.py:45](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L45)

Allow the operation to continue unchanged.

**Arguments**:

-   `reason` - Optional metadata for debugging/logging. Not shown to the model.

## Deny

```python
@dataclass(frozen=True)
class Deny()
```

Defined in: [src/strands/interventions/actions.py:57](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L57)

Block the operation. The reason is shown to the model as the cancellation message.

## Guide

```python
@dataclass(frozen=True)
class Guide()
```

Defined in: [src/strands/interventions/actions.py:65](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L65)

Provide feedback to steer behavior.

On beforeToolCall/beforeInvocation, sets cancel so the model sees the feedback. On beforeModelCall, injects feedback as a user message. On afterModelCall, the response is discarded and the model retries with feedback.

.. warning:: On `after_model_call`, Guide triggers a model retry. Handlers **must** ensure convergence (e.g., by tracking retry count and escalating to Deny after repeated failures). The framework imposes no retry cap on guide-triggered retries.

.. note:: On `before_model_call` and `after_model_call`, guidance messages are injected directly into `agent.messages` and bypass session management. Session managers will not track these injected messages.

## Confirm

```python
@dataclass(frozen=True)
class Confirm()
```

Defined in: [src/strands/interventions/actions.py:89](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L89)

Request human approval before proceeding. Only supported on beforeToolCall.

Two modes depending on whether response is provided:

-   With response: passed as a preemptive value to the interrupt system, agent never pauses.
-   Without response: breaks out of the agent loop to pause for external resume.

## Transform

```python
@dataclass(frozen=True)
class Transform()
```

Defined in: [src/strands/interventions/actions.py:105](https://github.com/strands-agents/harness-sdk/blob/main/strands-py/src/strands/interventions/actions.py#L105)

Modify event content in-place.

The apply function mutates the event before execution proceeds. Later handlers in the pipeline see the transformed content.

#### InterventionAction

Union of all intervention actions a handler can return.

Action-to-event compatibility matrix::

| Action | before\_invocation | before\_tool\_call | before\_model\_call | after\_tool\_call | after\_model\_call |
| --- | --- | --- | --- | --- | --- |
| Proceed | — | — | — | — | — |
| Deny | cancel | cancel | cancel | — | — |
| Guide | cancel+ | cancel+ | inject | — | inject + retry |
| Confirm | — | confirm | — | — | — |
| Transform | apply | apply | apply | apply | apply |

— = no-op (warns at runtime) cancel = sets event.cancel/cancel\_tool, short-circuits (remaining handlers skipped) cancel+ = sets cancel with accumulated feedback from all guiding handlers confirm = uses preemptive response or interrupt, checks with evaluate, sets cancel if denied inject = appends accumulated feedback as a user message so the model sees it on this call inject + retry = appends accumulated feedback and retries so the model sees guidance apply = calls action.apply(event) for in-place mutation, later handlers see the change
