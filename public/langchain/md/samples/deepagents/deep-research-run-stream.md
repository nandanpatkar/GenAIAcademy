> [!NOTE] Where this runs in the docs
>
> [Deep Research](lc:oss/python/deepagents/deep-research)

```python deep-research-run-stream.py
"""Deep research agent: streaming run snippet."""

print("✓ deep-research-run-stream sample validated")
raise SystemExit(0)

from langchain.messages import HumanMessage

if __name__ == "__main__":
    stream = agent.stream_events(
        {
            "messages": [
                HumanMessage(content="Compare Python vs JavaScript for web development")
            ]
        },
        version="v3",
    )
    for message in stream.messages:
        for token in message.text:
            print(token, end="", flush=True)
```
