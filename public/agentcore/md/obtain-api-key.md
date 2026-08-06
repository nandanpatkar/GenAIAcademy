# Obtain API key - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/obtain-api-key.html

---

# Obtain API key

Once you have stored your API keys in the AgentCore Identity vault, you can retrieve them directly in your agent using the AgentCore SDK and the `@requires_api_key` annotation. For example, the code below will retrieve the API key from the “your-service-name” API key provider so that you can use it in the `need_api_key` function.

```python
import asyncio
from bedrock_agentcore.identity.auth import requires_api_key

@requires_api_key(
    provider_name= "your-service-name" # replace with your own credential provider name
)
async def need_api_key(*, api_key: str):
    # Use the API key
    pass

# To invoke:
# asyncio.run(need_api_key())
```
