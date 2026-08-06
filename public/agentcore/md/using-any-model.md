# Use any foundation model - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/using-any-model.html

---

# Use any foundation model

You can use any foundation model with AgentCore Runtime The following are examples for Amazon Bedrock, Open AI, Gemini and Fireworks AI:

###### Topics

  * Amazon Bedrock

  * Open AI

  * Gemini

  * Fireworks AI


## Amazon Bedrock

```python
import boto3
from strands.models import BedrockModel

# Create a Bedrock model with the custom session
bedrock_model = BedrockModel(
    model_id="us.anthropic.claude-3-7-sonnet-20250219-v1:0",
    boto_session=session
)
```
## Open AI

```python
from strands.models.openai import OpenAIModel
model = OpenAIModel(
    client_args={
        "api_key": "<our_OPENAI_API_KEY>",
    # **model_config
    model_id="gpt-4o",
    params={
        "max_tokens": 1000,
        "temperature": 0.7,
}
)

from strands import Agent
from strands_tools import python_repl
agent = Agent(model=model,tools=[python_repl])
```
## Gemini

```python
import os
from langchain.chat_models import init_chat_model

# Use your Google API key to initialize the chat model
os.environ["GOOGLE_API_KEY"] = "..."

llm = init_chat_model("google_genai:gemini-2.0-flash")
```
## Fireworks AI

```python
from strands import Agent, tool
from strands_tools import file_read, file_write
from strands.models.openai import OpenAIModel
import os
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()

@tool
def code_python(user_prompt: str):
    """Generate Python code based on user requirements."""
    return f"Generate clean Python code for: {user_prompt}"

model = OpenAIModel(
    client_args={
        "api_key": os.getenv("FIREWORKS_API_KEY"),
        "base_url": "https://api.fireworks.ai/inference/v1",
    },
    model_id="accounts/fireworks/models/kimi-k2-instruct-0905",
    params={"max_tokens": 5000, "temperature": 0.0}
)

agent = Agent(
    model=model,
    tools=[file_read, file_write, code_python],
    system_prompt="You are a software engineer. You can read files, write files and generate python code."
)

@app.entrypoint
def strands_agent_fireworks_ai(payload):
    user_input = payload.get("prompt")
    if not isinstance(user_input, str) or not user_input:
        return "Error: 'prompt' must be a non-empty string"
    response = agent(user_input)
    return response.message['content'][0]['text']

if __name__ == "__main__":
    app.run()
```
