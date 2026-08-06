> [!NOTE]
>
> `RubricMiddleware` requires `deepagents>=0.6.5`. It is in [**beta**](lc:oss/python/versioning); the API may change in the future.


Some agent tasks have a clear definition of "done" that the working model alone cannot reliably hit on the first try: a haiku in the right syllable pattern, a refactor with all tests passing, or a report that hits every required section. `RubricMiddleware` lets you declare *what done looks like* as a rubric and have the agent **self-evaluate and iterate** until the rubric is satisfied, or until a configured maximum iteration cap is hit.

**LLM-as-a-judge** is a pattern where one language model evaluates another model's output against defined criteria. In [LangSmith evaluations](lc:langsmith/evaluation-concepts#llm-as-judge), LLM-as-a-judge evaluators score application outputs offline in batch. `RubricMiddleware` applies the same pattern at runtime: after the deep agent produces output, a dedicated grader model reviews the transcript against your rubric and drives revision until every criterion passes (or a configured iteration cap is hit).

When the deep agent finishes reasoning, the LLM-as-a-judge grader sub-agent reviews the output and returns a verdict. If it returns `needs_revision`, per-criterion feedback is injected back into the conversation and the agent runs again. The loop terminates on `satisfied`, `max_iterations_reached`, `failed`, or `grader_error`.

```mermaid
graph LR
    Start[User invokes<br/>with rubric] --> Agent[Deep agent]
    Agent --> Grader{Grader<br/>verdict}

    Grader --> |satisfied| Done[Finish execution]
    Grader --> |failed| Done
    Grader --> |grader_error| Done
    Grader --> |needs_revision| Cap{Iterations < <br/> max_iterations?}

    Cap --> |yes| Inject[Re-prompt deep agent with per-criterion feedback]
    Cap --> |no| Done

    Inject --> Agent

    classDef trigger fill:#F6FFDB,stroke:#6E8900,stroke-width:2px,color:#2E3900
    classDef process fill:#E5F4FF,stroke:#006DDD,stroke-width:2px,color:#030710
    classDef decision fill:#FDF3FF,stroke:#7E65AE,stroke-width:2px,color:#504B5F
    classDef alert fill:#F8E8E6,stroke:#B27D75,stroke-width:2px,color:#634643

    class Start trigger
    class Agent,Inject process
    class Grader,Cap decision
    class Done,MaxOut alert
```

## Configure the middleware

Add `RubricMiddleware` to the `middleware` list when you call `create_deep_agent`:


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            max_iterations=3,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)"
 }
]
```


| Argument | Required | Default | Description |
| --- | --- | --- | --- |
| `model` | Yes | `None` | Chat model used by the LLM-as-a-judge grader sub-agent. Accepts a `"provider:model-id"` string or a `BaseChatModel` instance. Often a smaller or cheaper model than the deep agent's working model. |
| `system_prompt` | No | Built-in grader prompt | Custom grading instructions. Falls back to a default system prompt that teaches the grader the verdict format and what tools it has at its disposal. |
| `tools` | No | `None` | Tools the grader may call to gather evidence (run tests, count tokens, read files) before producing a verdict. With none, the grader reasons from the transcript alone. |
| `max_iterations` | No | `3` | Maximum grader iterations per rubric attempt; must be a positive integer. When the cap is reached without a `satisfied` verdict, the agent terminates with status `max_iterations_reached`. |
| `on_evaluation` | No | `None` | Optional callback invoked with each `RubricEvaluation` after every grading iteration, whether you use `invoke()`, `stream()` or `stream_events()`. Useful for logging, custom metrics, eval datasets, or UI updates. |

## Pass rubric on invocation

Pass a `rubric` string on invocation state to start the self-evaluation loop. Use `invoke()` for a single blocking call, or [`stream_events(..., version="v3")`](lc:oss/python/langchain/event-streaming) with [`CustomTransformer`](lc:oss/python/langchain/event-streaming#custom-updates) to receive grading events on `stream.custom` as they occur:

    #### Tab: invoke()

        
```python
from langchain.messages import HumanMessage

config = {"configurable": {"thread_id": "my-rubric-thread"}}
result = agent.invoke(
    {
        "messages": [HumanMessage("Write a haiku about spring.")],
        "rubric": (
            "- The poem has three lines\n"
            "- Lines follow a 5-7-5 syllable pattern\n"
            "- The theme is spring"
        ),
    },
    config=config,
)
```

    
    #### Tab: stream_events()

        
```python
from langchain.messages import HumanMessage
from langgraph.stream import CustomTransformer

config = {"configurable": {"thread_id": "my-rubric-thread"}}
stream = agent.stream_events(
    {
        "messages": [HumanMessage("Write a haiku about spring.")],
        "rubric": (
            "- The poem has three lines\n"
            "- Lines follow a 5-7-5 syllable pattern\n"
            "- The theme is spring"
        ),
    },
    config=config,
    version="v3",
    transformers=[CustomTransformer],
)

for event in stream.custom:
    event_type = event.get("type")
    if event_type == "rubric_evaluation_start":
        print(
            f"Grading iteration {event['iteration']} "
            f"(run {event['grading_run_id']})"
        )
    elif event_type == "rubric_evaluation_end":
        print(f"Verdict: {event['result']} — {event.get('explanation', '')}")
```


        Rubric grading emits the following custom events on `stream.custom`:

        | Event | When fired | Payload fields |
        | --- | --- | --- |
        | `rubric_evaluation_start` | Before the grader runs. | <ul><li>`type`: event name</li><li>`grading_run_id`: shared across all events within one rubric attempt</li><li>`iteration`: zero-based index of the current grading run</li></ul> |
        | `rubric_evaluation_end` | After the grader returns or after a grader exception. | <ul><li>`type`: event name</li><li>`grading_run_id`: shared across all events within one rubric attempt</li><li>`iteration`: zero-based index of the current grader pass</li><li>`result`: terminal verdict for this pass</li><li>`explanation`: summary from the grader</li><li>`criteria`: per-criterion verdicts</li></ul> |
    

### Rubric verdicts

When the deep agent finishes reasoning and has an output, the LLM-as-a-judge grader sub-agent reviews the output against the rubric and produces one of the following verdicts:

| Status | Meaning | Loops back? |
| --- | --- | --- |
| `satisfied` | Every criterion in the rubric passes. | No |
| `needs_revision` | At least one criterion fails; grader feedback is injected and the agent runs again. | Yes |
| `max_iterations_reached` | Grader still wants revisions, but `max_iterations` has been hit. | No |
| `failed` | The grader judged the rubric malformed or impossible to evaluate against the transcript. | No |
| `grader_error` | The LLM-as-a-judge grader sub-agent itself raised an exception (provider timeout, missing credentials, malformed structured response, etc.). | No |

## Observe iteration progress

`on_evaluation` is a callback that fires after each grading iteration with the grader's verdict, whether you call `invoke()` or `stream_events()`. If you are not reading rubric events from `stream.custom` (with `CustomTransformer`) or [tracing the run with LangSmith](lc:langsmith/trace-with-langgraph), it is the main way to inspect what happened during grading.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware, create_deep_agent\nfrom deepagents.middleware.rubric import RubricEvaluation\nfrom langchain.messages import HumanMessage\nfrom langgraph.checkpoint.memory import InMemorySaver\n\n\ndef log_evaluation(ev: RubricEvaluation) -> None:\n    print(f\"iteration {ev['iteration']}: {ev['result']} \u2014 {ev['explanation']}\")\n\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    middleware=[\n        RubricMiddleware(\n            model=\"anthropic:claude-haiku-4-5\",\n            on_evaluation=log_evaluation,\n        ),\n    ],\n    checkpointer=InMemorySaver(),\n)\n\nconfig = {\"configurable\": {\"thread_id\": \"rubric-eval-session\"}}\nagent.invoke(\n    {\n        \"messages\": [HumanMessage(\"Write a one-sentence summary of photosynthesis.\")],\n        \"rubric\": (\n            \"- The answer is one sentence\\n\"\n            \"- The answer mentions light and chlorophyll\"\n        ),\n    },\n    config=config,\n)"
 }
]
```


The middleware calls your function with a `RubricEvaluation` dictionary after each [grader pass](#grader-pass-events). The `RubricEvaluation` dictionary contains:

| Field | Type | Description |
| --- | --- | --- |
| `grading_run_id` | `str` | Identifier shared by every evaluation in one rubric attempt. A new run starts when the caller supplies a different `rubric`, or when the same `rubric` is invoked again after a terminal verdict. |
| `iteration` | `int` | Zero-based index of the current grader pass within that run. |
| `result` | `str` | The grader verdict for this pass: `satisfied`, `needs_revision`, `failed`, or `grader_error`. |
| `explanation` | `str` | Free-form summary from the grader. On infrastructure failures, this includes the exception type and message. |
| `criteria` | `list` | Per-criterion verdicts. Each entry is either `{name, passed: true}` or `{name, passed: false, gap}` where `gap` is actionable feedback for a failing criterion. |

### Grader pass events

| Event | Description |
| ----- | ------------- |
| **Successful grading** | Fires once per pass, including intermediate `needs_revision` verdicts and the final `satisfied` or `failed` verdict. <br /><br /> When the grader returns `needs_revision` but `max_iterations` has been reached, the callback still receives `result: "needs_revision"` (the grader's verdict). The run's terminal status is `max_iterations_reached` on private state `_rubric_status`, not on the evaluation record. Inspect `_rubric_status` after `invoke` completes, or read the last entry in `_rubric_evaluations` together with `_rubric_iterations`, to branch on cap exhaustion. |
| **Grader exceptions** | Fires with `result: "grader_error"`, an explanation derived from the exception, and an empty `criteria` list. |
| **Errors in your callback** | Exceptions are logged and suppressed. The grading loop continues. Do not use `on_evaluation` to enforce control flow (for example, raising to stop the agent). |

## Persist rubrics across invocations

A single `agent.invoke()` or `agent.stream_events()` call runs the rubric loop to completion and finishes with a terminal verdict: `satisfied`, `failed`, or `max_iterations_reached`.

To carry rubrics over to follow up invocations, attach a [checkpointer](lc:oss/python/langgraph/checkpointers#checkpoints) and pass the same `thread_id` alongside the invocation. In these cases, the same `rubric` persists across future `invoke()` or `stream_events()` calls until you pass a new one in.

Interrupts (`KeyboardInterrupt`, `asyncio.CancelledError`) propagate out of `agent.invoke()` and `agent.stream_events()` uncaught. On a checkpointed thread, the next call with the same rubric resumes the in-flight grading run.

## Example: generate vetted Python code

The following example builds a deep agent that writes a `find_duplicates` function. It defines `RubricMiddleware` once, attaches it to the agent, then passes a `rubric` string at invoke time.

Rather than asking the grader to reason abstractly about correctness, the example gives it a `run_test_suite` tool to verify behavior directly. The grader calls this tool for additional information before producing a verdict, and falls back to reasoning from the transcript when no tools are provided.

#### Step: Define RubricMiddleware

This middleware adds an LLM-as-a-judge grader loop on top of the base agent. Configure the grader model, optional custom prompt, tools for evidence gathering, and a maximum iteration cap.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"openai:gpt-5.5\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import RubricMiddleware\nfrom langchain.tools import tool\n\n\n@tool\ndef run_test_suite(code: str) -> dict:\n    \"\"\"Run the find_duplicates test suite against Python source code.\"\"\"\n    namespace: dict = {\"__builtins__\": __builtins__}\n    try:\n        exec(code, namespace)\n    except Exception as exc:\n        return {\"ok\": False, \"failures\": [f\"Failed to execute code: {exc}\"]}\n\n    find_duplicates = namespace.get(\"find_duplicates\")\n    if find_duplicates is None:\n        return {\"ok\": False, \"failures\": [\"Function find_duplicates is not defined\"]}\n\n    tests = [\n        (\"test_basic\", [1, 2, 2, 3, 1], [2, 1]),\n        (\"test_empty\", [], []),\n        (\"test_no_duplicates\", [1, 2, 3], []),\n        (\"test_unhashable\", [[1], [1], 2], [[1]]),\n    ]\n    failures: list[str] = []\n    for name, args, expected in tests:\n        try:\n            actual = find_duplicates(args)\n            if actual != expected:\n                failures.append(f\"{name}: expected {expected}, got {actual}\")\n        except Exception as exc:\n            failures.append(f\"{name}: {exc}\")\n\n    return {\"ok\": not failures, \"failures\": failures}\n\n\nrubric_middleware = RubricMiddleware(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=\"You are a code reviewer grading generated code against a rubric.\",\n    tools=[run_test_suite],\n    max_iterations=5,\n)"
 }
]
```


#### Step: Pass it to a deep agent

The agent's `system_prompt` tells it how to do the work, while the rubric tells the grader how to judge the work.


```lc-tabs
[
 {
  "label": "Google",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"google_genai:gemini-3.6-flash\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenAI",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openai:gpt-5.5\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Anthropic",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"anthropic:claude-sonnet-4-6\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "OpenRouter",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"openrouter:z-ai/glm-5.2\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Fireworks",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"fireworks:accounts/fireworks/models/glm-5p2\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Baseten",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"baseten:zai-org/GLM-5.2\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 },
 {
  "label": "Ollama",
  "lang": "python",
  "code": "from deepagents import create_deep_agent\nfrom langgraph.checkpoint.memory import InMemorySaver\n\nagent = create_deep_agent(\n    model=\"ollama:north-mini-code-1.0\",\n    system_prompt=(\n        \"You are a careful Python engineer. Write correct, readable code. \"\n        \"Follow the user's instructions exactly.\"\n    ),\n    middleware=[rubric_middleware],\n    checkpointer=InMemorySaver(),\n)"
 }
]
```


#### Step: Invoke with a human message and rubric

At invocation time, provide the user request in `messages` and a newline-delimited checklist in `rubric` that the grader must mark satisfied. When no `rubric` is supplied on input state, the middleware does not run.


```python
from langchain.messages import HumanMessage

result = agent.invoke(
    {
        "messages": [
            HumanMessage(
                content=(
                    "Write a Python function `find_duplicates(lst)` that returns a list of "
                    "all elements that appear more than once in the input list, in the order "
                    "they first appear."
                )
            )
        ],
        "rubric": (
            "- All tests pass in run_test_suite\n"
            "- The function is named `find_duplicates` and accepts a single list argument\n"
        ),
    },
    config={"configurable": {"thread_id": "code-generation-session"}},
)
print(result["messages"][-1].text)
```


After the agent produces output, the grader takes over and checks the output for each criterion: for example, that `test_unhashable` fails with a `TypeError` when the input contains unhashable types. If there are any issues the grader provides this feedback and the agent then revises its implementation and returns it to the grader.
