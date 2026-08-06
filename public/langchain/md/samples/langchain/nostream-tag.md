> [!NOTE] Where this runs in the docs
>
> [Streaming](lc:oss/python/langgraph/streaming)

```python nostream-tag.py
"""Example of using nostream tag to exclude LLM output from the stream."""

from typing import Any, TypedDict

from langchain_anthropic import ChatAnthropic
from langgraph.graph import START, StateGraph

stream_model = ChatAnthropic(model_name="claude-haiku-4-5-20251001")
internal_model = ChatAnthropic(model_name="claude-haiku-4-5-20251001").with_config(
    {"tags": ["nostream"]}
)


class State(TypedDict):
    topic: str
    answer: str
    notes: str


def answer(state: State) -> dict[str, Any]:
    r = stream_model.invoke(
        [{"role": "user", "content": f"Reply briefly about {state['topic']}"}]
    )
    return {"answer": r.content}


def internal_notes(state: State) -> dict[str, Any]:
    # Tokens from this model are omitted from stream_mode="messages" because of nostream
    r = internal_model.invoke(
        [{"role": "user", "content": f"Private notes on {state['topic']}"}]
    )
    return {"notes": r.content}


graph = (
    StateGraph(State)
    .add_node("write_answer", answer)
    .add_node("internal_notes", internal_notes)
    .add_edge(START, "write_answer")
    .add_edge("write_answer", "internal_notes")
    .compile()
)

initial_state: State = {"topic": "AI", "answer": "", "notes": ""}
stream = graph.stream_events(initial_state, version="v3")

# Drain the stream; v3 stream.messages yields only tokens from un-tagged models,
# so the internal_notes node (tagged nostream) should not appear.
message_count = 0
for message in stream.messages:
    message_count += 1
# At least one message (from stream_model) should be present
assert message_count >= 1, "Expected at least one streamed message from stream_model"
final_state = stream.output
assert final_state["answer"], "Expected a non-empty answer in the final state"

if __name__ == "__main__":
    print("\n✓ nostream tag example works as expected")
```
