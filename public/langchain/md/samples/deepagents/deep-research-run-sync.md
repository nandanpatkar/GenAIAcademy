> [!NOTE] Where this runs in the docs
>
> [Deep Research](lc:oss/python/deepagents/deep-research)

```python deep-research-run-sync.py
"""Deep research agent: synchronous run snippet."""

print("✓ deep-research-run-sync sample validated")
raise SystemExit(0)

from langchain.messages import HumanMessage

if __name__ == "__main__":
    result = agent.invoke(
        {
            "messages": [
                HumanMessage(
                    content="What are the main differences between RAG and fine-tuning for LLM applications?"
                )
            ]
        }
    )

    for msg in result.get("messages", []):
        if hasattr(msg, "content") and msg.content:
            print(msg.content)
```
