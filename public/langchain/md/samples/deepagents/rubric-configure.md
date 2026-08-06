> [!NOTE] Where this runs in the docs
>
> [Grading rubrics](lc:oss/python/deepagents/rubric), [Prebuilt middleware](lc:oss/python/langchain/middleware/built-in)

```python rubric-configure.py
"""Deep Agents: configure RubricMiddleware and invoke with a rubric."""

from deepagents import RubricMiddleware, create_deep_agent
from langgraph.checkpoint.memory import InMemorySaver

agent = create_deep_agent(
    model="openai:gpt-5.5",
    middleware=[
        RubricMiddleware(
            model="anthropic:claude-haiku-4-5",
            max_iterations=3,
        ),
    ],
    checkpointer=InMemorySaver(),
)

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

from deepagents import RubricMiddleware, create_deep_agent
from deepagents.middleware.rubric import RubricEvaluation
from langchain.messages import HumanMessage
from langgraph.checkpoint.memory import InMemorySaver


def log_evaluation(ev: RubricEvaluation) -> None:
    print(f"iteration {ev['iteration']}: {ev['result']} — {ev['explanation']}")


agent = create_deep_agent(
    model="anthropic:claude-haiku-4-5",
    middleware=[
        RubricMiddleware(
            model="anthropic:claude-haiku-4-5",
            on_evaluation=log_evaluation,
        ),
    ],
    checkpointer=InMemorySaver(),
)

config = {"configurable": {"thread_id": "rubric-eval-session"}}
agent.invoke(
    {
        "messages": [HumanMessage("Write a one-sentence summary of photosynthesis.")],
        "rubric": (
            "- The answer is one sentence\n"
            "- The answer mentions light and chlorophyll"
        ),
    },
    config=config,
)

if __name__ == "__main__":
    assert agent is not None
    assert hasattr(agent, "stream_events")
    print("✓ rubric configure sample completed")
```
