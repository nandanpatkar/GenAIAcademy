# Use configuration bundles at runtime - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-runtime.html

---

# Use configuration bundles at runtime  
  
Your agent reads configuration from a bundle at runtime to apply dynamic settings without redeploying code. The gateway and runtime propagate the bundle reference through W3C baggage headers, so your agent code never needs to know which version is active; it reads whatever configuration is in the current request context.

###### Note

Configuration bundle integration requires `bedrock-agentcore-sdk-python` version 1.8 or later. The `get_config_bundle()` method on `BedrockAgentCoreContext` is available from this version onward.

The gateway injects the bundle ARN and splits the incoming traffic with different bundle versions. The same agent code, running in the same runtime, behaves differently based on which bundle version it receives.

## Baggage header propagation

When an A/B test is active, the AgentCore Gateway assigns each session to a variant and injects the corresponding configuration bundle reference into the request as a [W3C Baggage](<https://www.w3.org/TR/baggage/>) header. The runtime parses this header automatically and makes the bundle configuration available to your agent code via `BedrockAgentCoreContext`.

The baggage contains two keys:

  * `aws.agentcore.configbundle_arn` — full ARN of the configuration bundle

  * `aws.agentcore.configbundle_version` — version ID of the bundle


You can also pass baggage manually when invoking the agent directly (for example, during testing):

```python
import boto3
import json
import uuid

rt_client = boto3.client("bedrock-agentcore", region_name="us-west-2")

BUNDLE_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/myAgentConfig-a1b2c3d4e5"
BUNDLE_VERSION = "12345678-1234-1234-1234-123456789012"

baggage = (
    f"aws.agentcore.configbundle_arn={BUNDLE_ARN},"
    f"aws.agentcore.configbundle_version={BUNDLE_VERSION}"
)

response = rt_client.invoke_agent_runtime(
    agentRuntimeArn="arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123",
    runtimeSessionId=str(uuid.uuid4()),
    payload=json.dumps({"prompt": "What is the status of order ORD-1001?"}).encode(),
    baggage=baggage,
)

print(response["response"].read().decode("utf-8"))
```
In production, you do not need to construct baggage manually. The gateway handles this automatically during A/B testing.

## BedrockAgentCoreContext integration

The `BedrockAgentCoreContext` class (from the `bedrock-agentcore` SDK) provides a `get_config_bundle()` method that returns the configuration for the current request. The `BedrockAgentCoreApp` automatically parses the baggage headers, resolves the bundle version from the control plane API, and caches the result.

```python
from bedrock_agentcore.runtime import BedrockAgentCoreContext

# Returns the configuration dict for your component, or {} if no bundle is in context
config = BedrockAgentCoreContext.get_config_bundle()

system_prompt = config.get("system_prompt", "You are a helpful assistant.")
model_id = config.get("model_id", "global.anthropic.claude-sonnet-4-5-20250929-v1:0")
```
`get_config_bundle()` returns the `configuration` object for the component matching your runtime ARN. If no bundle reference is present in the request (for example, when no A/B test is active and no baggage was passed), it returns an empty dict.

You can also inspect the raw bundle reference:

```python
ref = BedrockAgentCoreContext.get_config_bundle_ref()
if ref:
    print(f"Bundle ID: {ref.bundle_id}")
    print(f"Bundle ARN: {ref.bundle_arn}")
    print(f"Version: {ref.bundle_version}")
```
## Strands agent with BeforeModelCallEvent hook

The recommended pattern for Strands agents is to use a `BeforeModelCallEvent` hook that dynamically updates the agent’s system prompt before every model call. The agent is created once at module level, and the hook modifies it per-request:

```python
from strands import Agent
from strands.models.bedrock import BedrockModel
from strands.hooks.events import BeforeModelCallEvent
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()

DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

def dynamic_config_hook(event: BeforeModelCallEvent):
    """Read config bundle and apply system prompt before every model call."""
    config_bundle = BedrockAgentCoreContext.get_config_bundle()
    event.agent.system_prompt = config_bundle.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

agent = Agent(
    model=BedrockModel(model_id=DEFAULT_MODEL_ID),
    system_prompt=DEFAULT_SYSTEM_PROMPT,
)
agent.hooks.add_callback(BeforeModelCallEvent, dynamic_config_hook)

@app.entrypoint
def invoke(payload, context):
    result = agent(str(payload.get("prompt", "Hello")))
    return {"response": str(result)}

if __name__ == "__main__":
    app.run()
```
The `BeforeModelCallEvent` hook fires before every LLM call, so configuration bundle changes take effect immediately without restarting the runtime.

## Strands agent with per-request construction

If you need to apply more configuration fields (model ID, temperature, tools), build a fresh agent per request instead of using a hook:

```python
from strands import Agent
from strands.models.bedrock import BedrockModel
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()

DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

def build_agent() -> Agent:
    """Build a fresh agent per request with config bundle applied."""
    config = BedrockAgentCoreContext.get_config_bundle()
    model_id = config.get("model_id", DEFAULT_MODEL_ID)
    system_prompt = config.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

    model_kwargs = {"model_id": model_id}
    temperature = config.get("temperature")
    if temperature is not None:
        model_kwargs["temperature"] = temperature

    return Agent(
        model=BedrockModel(**model_kwargs),
        system_prompt=system_prompt,
    )

@app.entrypoint
def invoke(payload, context):
    agent = build_agent()
    result = agent(str(payload.get("prompt", "Hello")))
    return {"response": str(result)}

if __name__ == "__main__":
    app.run()
```
## LangGraph agent

For LangGraph agents, read the configuration bundle at the start of each invocation and pass the values to your graph:

```python
from langchain_aws import ChatBedrock
from langgraph.graph import StateGraph, MessagesState, START, END
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()

DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

def build_graph():
    """Build a LangGraph graph with config bundle applied."""
    config = BedrockAgentCoreContext.get_config_bundle()
    model_id = config.get("model_id", DEFAULT_MODEL_ID)
    system_prompt = config.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

    model = ChatBedrock(model_id=model_id)

    def call_model(state: MessagesState):
        messages = [{"role": "system", "content": system_prompt}] + state["messages"]
        response = model.invoke(messages)
        return {"messages": [response]}

    graph = StateGraph(MessagesState)
    graph.add_node("model", call_model)
    graph.add_edge(START, "model")
    graph.add_edge("model", END)
    return graph.compile()

@app.entrypoint
def invoke(payload, context):
    graph = build_graph()
    result = graph.invoke({"messages": [{"role": "user", "content": str(payload.get("prompt", "Hello"))}]})
    return {"response": result["messages"][-1].content}

if __name__ == "__main__":
    app.run()
```
## Google ADK agent

For agents built with Google’s Agent Development Kit (ADK), read the configuration bundle when constructing the agent:

```python
from google.adk.agents import LlmAgent
from google.adk.models.lite_llm import LiteLlm
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()

DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

def build_agent() -> LlmAgent:
    """Build an ADK agent with config bundle applied."""
    config = BedrockAgentCoreContext.get_config_bundle()
    model_id = config.get("model_id", DEFAULT_MODEL_ID)
    system_prompt = config.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

    return LlmAgent(
        name="my_agent",
        model=LiteLlm(model=f"bedrock/{model_id}"),
        instruction=system_prompt,
    )

@app.entrypoint
def invoke(payload, context):
    agent = build_agent()
    # ADK agent invocation logic
    result = agent.invoke(str(payload.get("prompt", "Hello")))
    return {"response": str(result)}

if __name__ == "__main__":
    app.run()
```
## OpenAI SDK agent

For agents using the OpenAI SDK with Amazon Bedrock, read the configuration bundle to set the model and system prompt:

```python
from openai import OpenAI
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()

DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful assistant."

client = OpenAI()

@app.entrypoint
def invoke(payload, context):
    config = BedrockAgentCoreContext.get_config_bundle()
    model_id = config.get("model_id", DEFAULT_MODEL_ID)
    system_prompt = config.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

    response = client.chat.completions.create(
        model=model_id,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": str(payload.get("prompt", "Hello"))},
        ],
    )
    return {"response": response.choices[0].message.content}

if __name__ == "__main__":
    app.run()
```
## Graceful fallback

Always provide default values when reading from the bundle configuration. This ensures your agent works correctly even when no A/B test is active, the bundle fetch fails, or the bundle does not contain the expected key.

`get_config_bundle()` returns an empty dict when no bundle reference is present. If the underlying API call fails, the exception propagates. Wrap the call in a try/except for graceful degradation:

```python
from bedrock_agentcore.runtime import BedrockAgentCoreContext

DEFAULT_SYSTEM_PROMPT = "You are a helpful customer support assistant."
DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"

def get_config_with_fallback():
    """Read config bundle with graceful fallback to defaults."""
    try:
        config = BedrockAgentCoreContext.get_config_bundle()
        if not config:
            return {"system_prompt": DEFAULT_SYSTEM_PROMPT, "model_id": DEFAULT_MODEL_ID}
        return config
    except Exception:
        return {"system_prompt": DEFAULT_SYSTEM_PROMPT, "model_id": DEFAULT_MODEL_ID}
```
