# Stream agent responses - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/response-streaming.html

---

# Stream agent responses

The following Strands Agents example shows how an AgentCore Runtime agent can stream a response back to a client.

```python
from strands import Agent
from bedrock_agentcore import BedrockAgentCoreApp

app = BedrockAgentCoreApp()
agent = Agent()

@app.entrypoint
async def agent_invocation(payload):
    """Handler for agent invocation"""
    user_message = payload.get("prompt", "")
    if not isinstance(user_message, str) or not user_message.strip():
        yield {"error": "Invalid input: 'prompt' must be a non-empty string"}
        return
    stream = agent.stream_async(user_message)
    async for event in stream:
        print(event)
        yield (event)

if __name__ == "__main__":
    app.run()
```
