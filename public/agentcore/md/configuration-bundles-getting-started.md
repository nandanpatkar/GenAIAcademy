# Getting started with configuration bundles - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/configuration-bundles-getting-started.html

---

# Getting started with configuration bundles

This walkthrough takes you from zero to a versioned configuration bundle that your agent reads at runtime. You will create a bundle, update it to produce a new version, read the configuration, and view version history.

###### Topics

  * Before you begin

  * Step 1: Create a configuration bundle

  * Step 2: Update the bundle

  * Step 3: Read the bundle

  * Step 4: Compare versions

  * Next steps

  * Appendix: Agent code with config bundle integration


## Before you begin

Make sure you have:

  * An AgentCore CLI project with an agent deployed to AgentCore Runtime (or follow the Appendix below to create one with config bundle support)

  * AWS credentials with permissions for `bedrock-agentcore` and `bedrock-agentcore-control` (see [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-prereqs.html>))


The following constants are used in the boto3 examples. Replace them with your own values:

```text
REGION        = "us-west-2"
BUNDLE_ID     = "myAgentConfig-a1b2c3d4e5"  # from create response
COMPONENT_ARN = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123"
```
## Step 1: Create a configuration bundle

Create a bundle with your agent’s initial configuration. The bundle stores key-value pairs (system prompt, model ID, temperature, tool descriptions) keyed by the component ARN.

###### Example

AgentCore CLI
     ```bash
     agentcore add config-bundle \
       --name myAgentConfig \
       --components '{"arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/MyAgent-abc123": {"configuration": {"system_prompt": "You are a helpful customer support assistant for Acme Store.", "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0"}}}'

     agentcore deploy
     ```
After deployment, the CLI prints the bundle ID and initial version ID.

AWS SDK (boto3)
     ```python
     import boto3
     import uuid

     client = boto3.client("bedrock-agentcore-control", region_name=REGION)

     response = client.create_configuration_bundle(
         bundleName="myAgentConfig",
         components={
             COMPONENT_ARN: {
                 "configuration": {
                     "system_prompt": "You are a helpful customer support assistant for Acme Store.",
                     "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
                     "temperature": 0.7,
                 }
             }
         },
         description="Acme Store agent configuration",
         commitMessage="Initial configuration",
         clientToken=str(uuid.uuid4()),
     )

     bundle_id = response["bundleId"]
     version_id = response["versionId"]
     print(f"Created bundle: {bundle_id}")
     print(f"Initial version: {version_id}")
     ```
## Step 2: Update the bundle

After running a batch evaluation and identifying that your agent’s responses are too verbose, update the system prompt. Each update creates a new immutable version.

###### Example

AgentCore CLI
    

Edit the bundle configuration in `agentcore.json`, then redeploy:

```bash
# Edit the system_prompt in agentcore.json, then:
agentcore deploy
```
The CLI detects the existing bundle and creates a new version automatically.

AWS SDK (boto3)
     ```python
     response = client.update_configuration_bundle(
         bundleId=bundle_id,
         components={
             COMPONENT_ARN: {
                 "configuration": {
                     "system_prompt": (
                         "You are a helpful customer support assistant for Acme Store. "
                         "Be concise. Confirm actions taken in one sentence."
                     ),
                     "model_id": "global.anthropic.claude-sonnet-4-5-20250929-v1:0",
                     "temperature": 0.5,
                 }
             }
         },
         parentVersionIds=[version_id],
         commitMessage="Reduce verbosity: shorter prompt, lower temperature",
         clientToken=str(uuid.uuid4()),
     )

     new_version_id = response["versionId"]
     print(f"New version: {new_version_id}")
     ```
## Step 3: Read the bundle

Retrieve the current configuration to verify the update took effect.

###### Example

AgentCore CLI
     ```bash
     agentcore config-bundle versions --name myAgentConfig
     ```
Output shows the version history with commit messages:

```text
Version                               Branch     Created              Message
────────────────────────────────────────────────────────────────────────────────
a1b2c3d4-...                          mainline   2026-04-28 03:00     Reduce verbosity: shorter prompt, lower temperature
e5f6a7b8-...                          mainline   2026-04-28 02:30     Initial configuration
```
AWS SDK (boto3)
     ```python
     response = client.get_configuration_bundle(bundleId=bundle_id)

     config = response["components"][COMPONENT_ARN]["configuration"]
     print(f"Version: {response['versionId']}")
     print(f"System prompt: {config['system_prompt']}")
     print(f"Model: {config['model_id']}")
     print(f"Temperature: {config.get('temperature')}")
     ```
## Step 4: Compare versions

Diff two versions to see exactly what changed:

###### Example

AgentCore CLI
     ```bash
     agentcore config-bundle diff --name myAgentConfig --from <version-1> --to <version-2>
     ```
AWS SDK (boto3)
     ```bash
     # Fetch both versions
     v1 = client.get_configuration_bundle_version(bundleId=bundle_id, versionId=version_id)
     v2 = client.get_configuration_bundle_version(bundleId=bundle_id, versionId=new_version_id)

     # Compare
     v1_config = v1["components"][COMPONENT_ARN]["configuration"]
     v2_config = v2["components"][COMPONENT_ARN]["configuration"]

     for key in set(list(v1_config.keys()) + list(v2_config.keys())):
         if v1_config.get(key) != v2_config.get(key):
             print(f"{key}:")
             print(f"  before: {v1_config.get(key)}")
             print(f"  after:  {v2_config.get(key)}")
     ```
## Next steps

  * **Run a batch evaluation** to measure the impact of your configuration change. See [Batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations.html>).

  * **Use recommendations** to let the service generate optimized prompts automatically. See [Recommendations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-recommendations.html>).

  * **Set up A/B testing** to compare two bundle versions with live traffic. See [A/B testing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing.html>).

  * **Branch your configuration** for experiments without affecting the mainline. See [Update a configuration bundle](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./configuration-bundles-update.html>).


## Appendix: Agent code with config bundle integration

The following agent code reads the active configuration bundle at runtime using the `BeforeModelCallEvent` hook pattern. The agent is created once at module level, and the hook dynamically updates the system prompt before each model call. Configuration bundle changes take effect immediately without restarting.

  * **SDK requirement:** The `bedrock-agentcore-sdk-python` version 1.8 or later is required. The `get_config_bundle()` method on `BedrockAgentCoreContext` is available from this version onward.


Save this as your agent’s `main.py`:

```python
"""Agent with Configuration Bundle integration — hooks pattern."""
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from strands.hooks.events import BeforeModelCallEvent
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()
DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful customer support assistant for Acme Store. "
    "Help customers with their orders, returns, and shipping questions."
)

@tool
def lookup_order(order_id: str) -> str:
    """Look up an order by ID."""
    orders = {
        "ORD-1001": {"status": "delivered", "item": "Blue T-Shirt (L)", "total": "$29.99"},
        "ORD-1002": {"status": "in_transit", "item": "Running Shoes (10)", "total": "$89.99"},
        "ORD-1003": {"status": "delayed", "item": "Wireless Headphones", "days_late": 5, "total": "$59.99"},
    }
    return str(orders.get(order_id, {"error": f"Order {order_id} not found"}))

@tool
def check_shipping_status(order_id: str) -> str:
    """Check detailed shipping status for an order."""
    statuses = {
        "ORD-1002": "Package is with carrier, on schedule for April 5.",
        "ORD-1003": "Package delayed 5 days. Policy: 3+ days late qualifies for 15% discount.",
    }
    return statuses.get(order_id, f"No active shipment found for {order_id}.")

TOOLS = [lookup_order, check_shipping_status]

def dynamic_config_hook(event: BeforeModelCallEvent):
    """Read config bundle and apply system prompt before every model call."""
    config_bundle = BedrockAgentCoreContext.get_config_bundle()
    event.agent.system_prompt = config_bundle.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

agent = Agent(
    model=BedrockModel(model_id=DEFAULT_MODEL_ID),
    tools=TOOLS,
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
