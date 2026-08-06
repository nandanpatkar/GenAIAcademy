> [!NOTE] Where this runs in the docs
>
> [Models](lc:oss/python/deepagents/models)

```python models-configure-params.py
"""Models: configure model parameters."""

from langchain.chat_models import init_chat_model
from deepagents import create_deep_agent

model = init_chat_model(
    model="google_genai:gemini-3.6-flash",
    thinking_level="medium",  # [!code highlight]
)
agent = create_deep_agent(model=model)

from langchain_google_genai import ChatGoogleGenerativeAI
from deepagents import create_deep_agent

model = ChatGoogleGenerativeAI(
    model="gemini-3.1-pro-preview",
    thinking_level="medium",  # [!code highlight]
)
agent = create_deep_agent(model=model)
```
