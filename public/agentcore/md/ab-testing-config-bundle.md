# Run an A/B test with configuration bundles - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-config-bundle.html

---

# Run an A/B test with configuration bundles

Use the configuration bundle pattern when the change you are testing is purely configuration — a different system prompt, a different model ID, or different tool descriptions. Both variants run on the same AgentCore Runtime with different configuration bundle versions. The AgentCore Gateway injects the correct bundle reference into each request via W3C baggage headers, and your agent reads it at runtime. This means you deploy one AgentCore Runtime and one online evaluation config.

Key configuration for configuration bundle A/B tests:

  * Variant configuration: `variantConfiguration.configurationBundle` with bundle ARN and version

  * Evaluation configuration: a single shared `onlineEvaluationConfigArn`


If the change you are testing involves code changes, a framework upgrade, or an entirely different agent implementation, use target-based routing instead. See [Run an A/B test with target-based routing](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html>).

This walkthrough uses a customer support agent as an example. The agent handles order lookups, returns, and discount requests. You will deploy the agent, create two configuration bundles with different system prompts (control and treatment), create an A/B test, send traffic, review results, and deploy the winner.

## Step 1: Create the project

Create the project with the AgentCore CLI:

```bash
agentcore create --name ABTestConfigBased --no-agent
cd ABTestConfigBased
```
## Step 2: Add the runtime

Add the agent runtime:

```bash
agentcore add agent \
  --name csAgent \
  --language Python \
  --framework Strands \
  --model-provider Bedrock \
  --memory none \
  --build CodeZip
```
Project structure:

```text
ABTestConfigBased/
├── agentcore/
│   ├── agentcore.json      # Project and resource configuration
│   ├── aws-targets.json    # Deployment target (account and region)
│   └── cdk/                # CDK infrastructure (auto-managed)
└── app/
    └── csAgent/
        ├── main.py         # Agent entrypoint
        └── pyproject.toml  # Python dependencies
```
## Step 3: Update the agent code and deploy

Replace `app/csAgent/main.py` with the following. The key addition is the `BeforeModelCallEvent` hook that reads the active configuration bundle at runtime:

```python
"""Customer support agent with configuration bundle integration."""
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from strands.hooks.events import BeforeModelCallEvent
from bedrock_agentcore.runtime import BedrockAgentCoreApp, BedrockAgentCoreContext

app = BedrockAgentCoreApp()
DEFAULT_MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
DEFAULT_SYSTEM_PROMPT = "You are a helpful customer support assistant."

@tool
def lookup_order(order_id: str) -> str:
    """Look up an order by ID."""
    orders = {
        "ORD-1001": {"status": "delivered", "item": "Blue T-Shirt", "total": "$29.99"},
        "ORD-1002": {"status": "in_transit", "item": "Running Shoes", "est_delivery": "2026-04-05"},
        "ORD-1003": {"status": "delayed", "item": "Wireless Headphones", "days_late": 5},
    }
    return str(orders.get(order_id, {"error": f"Order {order_id} not found"}))

@tool
def initiate_return(order_id: str, reason: str) -> str:
    """Initiate a return for an order."""
    return f"Return initiated for {order_id}. Reason: {reason}. Return label sent to customer email."

@tool
def apply_discount(order_id: str, discount_percent: int, reason: str) -> str:
    """Apply a discount to an order."""
    return f"Applied {discount_percent}% discount to {order_id}. Reason: {reason}."

def dynamic_config_hook(event: BeforeModelCallEvent):
    """Read config bundle and apply system prompt before every model call."""
    config = BedrockAgentCoreContext.get_config_bundle()
    event.agent.system_prompt = config.get("system_prompt", DEFAULT_SYSTEM_PROMPT)

agent = Agent(
    model=BedrockModel(model_id=DEFAULT_MODEL_ID),
    tools=[lookup_order, initiate_return, apply_discount],
    system_prompt=DEFAULT_SYSTEM_PROMPT,
)
agent.hooks.add_callback(BeforeModelCallEvent, dynamic_config_hook)

@app.entrypoint
def invoke(payload, context):
    result = agent(str(payload.get("prompt", "Hello")))
    return {"response": result.message["content"][0]["text"]}

if __name__ == "__main__":
    app.run()
```
Update `app/csAgent/pyproject.toml` dependencies:

```text
dependencies = [
    "aws-opentelemetry-distro",
    "bedrock-agentcore >= 1.8.0",
    "boto3",
    "botocore[crt] >= 1.35.0",
    "strands-agents[otel] >= 1.13.0",
    "opentelemetry-distro",
    "opentelemetry-instrumentation",
]
```
Deploy the customer support agent to AgentCore Runtime:

```bash
agentcore deploy
```
After deployment, note the runtime ARN from the output (for example, `arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/csAgent-abc123`). You will need it to create configuration bundles.

Verify the agent is running:

```bash
agentcore invoke --prompt "What is the status of order ORD-1003?"
```
The `BeforeModelCallEvent` hook fires before each LLM call, reading the active configuration bundle from the request context. During an A/B test, the AgentCore Gateway assigns each session to a variant and propagates the corresponding bundle reference via W3C baggage headers. The runtime makes this available through `BedrockAgentCoreContext`, so control sessions receive bundle v1 and treatment sessions receive bundle v2 — the agent applies whichever system prompt is in the bundle it receives.

For more details, see [Use configuration bundles at runtime](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./configuration-bundles-runtime.html>).

## Step 4: Create configuration bundles

Create two configuration bundles — one for control (current prompt) and one for treatment (optimized prompt). The A/B test will split traffic between these to measure which prompt yields better evaluator scores.

Control bundle — the current system prompt:

```bash
agentcore add config-bundle \
  --name customerSupportControl \
  --components '{
    "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/csAgent-abc123": {
      "configuration": {
        "system_prompt": "You are a helpful customer support assistant for Acme Store."
      }
    }
  }'

agentcore deploy
```
Treatment bundle — an optimized system prompt that instructs the agent to be more proactive:

```bash
agentcore add config-bundle \
  --name customerSupportTreatment \
  --components '{
    "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/csAgent-abc123": {
      "configuration": {
        "system_prompt": "You are a customer support assistant for Acme Store. Be proactive: check order status before the customer asks, offer discounts for delayed orders, and summarize actions taken at the end of each response."
      }
    }
  }'

agentcore deploy
```
After each deploy, note the bundle ARN and version ID from the output — you will need these when creating the A/B test.

## Step 5: Create an online evaluation configuration

An A/B test requires an online evaluation configuration to score sessions from both variants. The online evaluation runs evaluators against live traffic and feeds scores to the A/B test’s statistical engine.

For configuration bundle variants, create a single online evaluation config that monitors the shared AgentCore Runtime:

```bash
agentcore add online-eval \
  --name customerSupportEval \
  --runtime csAgent \
  --evaluator "Builtin.Helpfulness" \
  --sampling-rate 100.0 \
  --enable-on-create

agentcore deploy
```
After deployment, note the online evaluation config ARN from the output — you will need it when creating the A/B test.

###### Tip

Set `--sampling-rate 100.0` during A/B testing so every session is evaluated and results reach statistical significance faster. You can lower the rate after the test concludes.

For more details on evaluator options and configuration, see [Create online evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./create-online-evaluations.html>).

## Step 6: Create the gateway and target

A config-bundle A/B test routes traffic through an AgentCore Gateway, so the gateway and its target must already be deployed before you start the test. Add a gateway with the runtime as an `http-runtime` target, then deploy:

```bash
agentcore add gateway --name csGateway

agentcore add gateway-target \
  --name customer-support \
  --gateway csGateway \
  --type http-runtime \
  --runtime csAgent

agentcore deploy
```
## Step 7: Create the A/B test

Create an A/B test that splits traffic 80/20 between the control and treatment prompts. Both variants reference configuration bundles on the same AgentCore Runtime and share a single online evaluation config for scoring.

###### Example

AgentCore CLI
     ```bash
     agentcore run ab-test \
       --mode config-bundle \
       --name customerSupportPromptTest \
       --gateway csGateway \
       --runtime csAgent \
       --control-bundle customerSupportControl \
       --control-version <control-bundle-version-id> \
       --treatment-bundle customerSupportTreatment \
       --treatment-version <treatment-bundle-version-id> \
       --online-eval customerSupportEval \
       --control-weight 80 \
       --treatment-weight 20
     ```
`agentcore run ab-test` initiates an A/B test job on the service. The test is RUNNING as soon as the command returns. Pass `--disable-on-create` to create it stopped. To review the job, run `agentcore view ab-test <id>`, or look in the job JSON under `.cli/jobs/ab-tests/`. The `--gateway` flag is required and must reference the gateway you deployed in Step 6. Only one test can be RUNNING per gateway at a time. The command prints the test’s job ID, which is also available from `--json` as the `id` field. You need this ID for the lifecycle commands below.

###### Note

The `--control-version` and `--treatment-version` values are the version IDs returned when you deployed the configuration bundles in Step 3.

AWS SDK (boto3)
     ```python
     import boto3
     import uuid

     client = boto3.client("bedrock-agentcore", region_name="us-west-2")

     response = client.create_ab_test(
         name="customerSupportPromptTest",
         gatewayArn="arn:aws:bedrock-agentcore:us-west-2:123456789012:gateway/gw-abc123",
         roleArn="arn:aws:iam::123456789012:role/ABTestRole",
         evaluationConfig={
             "onlineEvaluationConfigArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:online-evaluation-config/eval-abc123"
         },
         variants=[
             {
                 "name": "C",
                 "weight": 80,
                 "variantConfiguration": {
                     "configurationBundle": {
                         "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/customerSupportControl-Ab1Cd2Ef3G",
                         "bundleVersion": "12345678-1234-1234-1234-123456789012"
                     }
                 }
             },
             {
                 "name": "T1",
                 "weight": 20,
                 "variantConfiguration": {
                     "configurationBundle": {
                         "bundleArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:configuration-bundle/customerSupportTreatment-Ab1Cd2Ef3G",
                         "bundleVersion": "12345678-1234-5678-9abc-123456789012"
                     }
                 }
             }
         ],
         enableOnCreate=True,
         clientToken=str(uuid.uuid4()),
     )

     ab_test_id = response["abTestId"]
     print(f"Created A/B test: {ab_test_id}")
     print(f"Status: {response['status']}")
     print(f"Execution status: {response['executionStatus']}")
     ```
## Step 8: Send traffic through the AgentCore Gateway

After the A/B test is running, send traffic through the AgentCore Gateway HTTP endpoint. The AgentCore Gateway assigns each request to a variant (control or treatment) based on the runtime session ID.

### How variant assignment works

The AgentCore Gateway uses the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header to determine which configuration bundle variant to serve. This header is **optional** — if you do not provide it, the runtime generates a session ID automatically. The AgentCore Gateway then uses the session ID (whether you provided it or the runtime generated it) to assign the request to a variant based on your configured traffic weights.

Session assignment is **sticky** : once a session ID is assigned to a variant, all subsequent requests with that same session ID route to the same variant. This ensures a consistent experience within a session while still distributing new sessions across variants according to your traffic split.

### Generate traffic for testing

Save the following script as `loadgen.sh`, replacing `<gateway-id>` and `<target-name>` with the values from your deployment output:

```typescript
#!/bin/bash
export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)
export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)
export AWS_SESSION_TOKEN=$(aws configure get aws_session_token)

GATEWAY_URL="https://<gateway-id>.gateway.bedrock-agentcore.us-west-2.amazonaws.com/<target-name>/invocations"

PROMPTS=(
  "What is the status of order ORD-1003?"
  "I want to return order ORD-1001, it doesn't fit."
  "My order ORD-1003 is late. Can I get a discount?"
  "Where is my order ORD-1002?"
  "I need help with a return for order ORD-1001. The color is wrong."
  "Can you check on order ORD-1003? I've been waiting forever."
  "I'd like to cancel order ORD-1002 if it hasn't shipped yet."
  "Order ORD-1003 is delayed again. This is unacceptable."
  "What's your return policy for order ORD-1001?"
  "My headphones order ORD-1003 still hasn't arrived. What can you do?"
)

for i in $(seq 1 30); do
  PROMPT="${PROMPTS[$(( (i - 1) % ${#PROMPTS[@]} ))]}"
  echo "=== Request $i: $PROMPT ==="
  curl -s --aws-sigv4 "aws:amz:us-west-2:bedrock-agentcore" \
    --user "$AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY" \
    -H "x-amz-security-token: $AWS_SESSION_TOKEN" \
    -H "Content-Type: application/json" \
    -H "X-Amzn-Bedrock-AgentCore-Runtime-Session-Id: $(uuidgen)" \
    -d "{\"prompt\": \"$PROMPT\"}" \
    -X POST \
    "$GATEWAY_URL"
  echo ""
  sleep 2
done
```
Run the script:

```text
bash loadgen.sh
```
## Step 9: Get results

Poll the A/B test to monitor results as sample sizes grow. Polling does not affect statistical validity.

###### Example

AgentCore CLI
    

Get current results (replace `<ab-test-id>` with the job ID from Step 6):

```bash
agentcore view ab-test <ab-test-id>
```
Get results as JSON:

```bash
agentcore view ab-test <ab-test-id> --json
```
AWS SDK (boto3)
    

Poll until results reach statistical significance:

```python
import boto3
import time

client = boto3.client("bedrock-agentcore", region_name="us-west-2")

ab_test_id = "customerSupportPromptTest-Ab1Cd2Ef3G"

while True:
    response = client.get_ab_test(abTestId=ab_test_id)

    status = response["status"]
    exec_status = response["executionStatus"]
    print(f"Status: {status}, Execution: {exec_status}")

    results = response.get("results")
    if results:
        print(f"Analysis timestamp: {results.get('analysisTimestamp')}")
        for metric in results["evaluatorMetrics"]:
            evaluator = metric["evaluatorArn"]
            control = metric["controlStats"]
            print(f"\nEvaluator: {evaluator}")
            print(f"  Control: mean={control['mean']:.3f}, n={control['sampleSize']}")

            for variant in metric["variantResults"]:
                print(f"  {variant['variantName']}: mean={variant['mean']:.3f}, "
                      f"n={variant['sampleSize']}, "
                      f"pValue={variant.get('pValue', 'N/A')}, "
                      f"significant={variant['isSignificant']}")

                if variant["isSignificant"]:
                    print(f"  >>> Statistically significant! "
                          f"Change: {variant.get('percentChange', 0):.1f}%")

        # Check if any evaluator has reached significance
        all_significant = all(
            variant["isSignificant"]
            for metric in results["evaluatorMetrics"]
            for variant in metric["variantResults"]
        )
        if all_significant:
            print("\nAll evaluators have reached statistical significance.")
            break

    time.sleep(300)  # Poll every 5 minutes
```
###### Note

The time it takes for results to appear depends primarily on the session timeout configured in your online evaluation config. A session is considered complete once no new requests arrive within the timeout window. After a session ends, results typically appear within 15 minutes. Results accumulate as more sessions complete — statistical significance improves with sample size.

###### Interpreting results

  * **p-value < 0.05 and positive `percentChange`:** The treatment is significantly better than control. Consider deploying the treatment.

  * **p-value < 0.05 and negative `percentChange`:** The treatment is significantly worse. Keep the control.

  * **p-value >= 0.05:** Not enough evidence to conclude a difference. Continue collecting samples or increase traffic to the treatment.

  * **Check all evaluators:** A treatment may improve one metric while regressing another. Review all evaluator results before deciding.


For a detailed explanation of the results structure and field definitions, see [Understanding results](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html#target-based-results-shape>) in the target-based routing guide.

## Step 10: Confirm results and stop the A/B test

Once the A/B test reaches statistical significance, review the results and stop the experiment.

  1. **Confirm significance.** Verify that the target evaluator has `isSignificant: true` and a positive `percentChange` on the treatment variant (or confirm the control is the winner if the treatment regressed).

  2. **Stop the A/B test.** Run `agentcore stop ab-test -i <ab-test-id>`. Traffic routing ends immediately and all requests revert to the default configuration. See [View, pause, resume, and stop](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-manage.html#manage-ab-test-start-stop>).


## Step 11: Deploy the winner

After stopping the A/B test, route all traffic to the winning configuration bundle version.

```bash
agentcore promote ab-test -i <ab-test-id>
agentcore deploy
```
`promote` stops the A/B test (if still running) and updates the control configuration bundle to use the treatment version. Run `agentcore deploy` to apply the changes.

Alternatively, you can manually deploy the winner by doing one of the following:

  * **Option A:** Use [AgentCore Gateway routing rules](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-rules.html>) to route all traffic with the winning configuration bundle version.

  * **Option B:** Update the control configuration bundle to use the winning system prompt and redeploy.

  * **Option C:** Set the winning bundle version as the default in your agent code and remove the A/B test configuration.


###### Next steps

After deploying the winner:

  * **Delete the A/B test** to clean up resources. See [Delete an A/B test](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-manage.html#manage-ab-test-remove>).

  * **Monitor the new baseline.** Online evaluation continues scoring sessions on the winning configuration. Watch for regressions.

  * **Start the next iteration.** New traces from the winning configuration provide the foundation for the next recommendation cycle. See [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-how-it-works.html>).


## Example: A/B testing tool descriptions

You can use the same configuration bundle pattern to test optimized tool descriptions. Unlike system prompt A/B tests where the agent reads the bundle directly, tool description overrides are applied by the AgentCore Gateway. When the agent calls `tools/list` through the gateway, the gateway reads the configuration bundle and returns tool descriptions with overrides applied. No agent code changes are needed.

For details on how the gateway applies tool description overrides, see [Behavior on MCP targets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-rules-propagation.html#gateway-rules-propagation-mcp>).

### Configuration bundles

Control bundle — current tool descriptions:

```bash
agentcore add config-bundle \
  --name toolDescControl \
  --components '{
    "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/csAgent-abc123": {
      "configuration": {
        "tools": {
          "lookup_order": {
            "description": "Look up an order by ID."
          },
          "initiate_return": {
            "description": "Initiate a return for an order."
          },
          "apply_discount": {
            "description": "Apply a discount to an order."
          }
        }
      }
    }
  }'

agentcore deploy
```
Treatment bundle — optimized tool descriptions from a recommendation:

```bash
agentcore add config-bundle \
  --name toolDescTreatment \
  --components '{
    "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/csAgent-abc123": {
      "configuration": {
        "tools": {
          "lookup_order": {
            "description": "Look up order details including status, item, and total by order ID. Use when the customer asks about an order or references an order number."
          },
          "initiate_return": {
            "description": "Start a return process for an order. Use only when the customer explicitly requests a return or exchange, not for order status inquiries."
          },
          "apply_discount": {
            "description": "Apply a percentage discount to an order. Use when compensating for service issues such as delivery delays. Requires a reason."
          }
        }
      }
    }
  }'

agentcore deploy
```
### How it works

  1. When the agent calls `tools/list` through the gateway (MCP targets), the A/B test assigns each session to a variant (control or treatment) on the gateway and resolves the corresponding configuration bundle.

  2. Gateway reads the configuration bundle and returns tool descriptions with overrides applied.

  3. The agent uses the returned descriptions for tool selection — no agent code changes required.


### Create the A/B test

```bash
agentcore run ab-test \
  --mode config-bundle \
  --name toolDescTest \
  --gateway csGateway \
  --runtime csAgent \
  --control-bundle toolDescControl \
  --control-version <control-bundle-version-id> \
  --treatment-bundle toolDescTreatment \
  --treatment-version <treatment-bundle-version-id> \
  --online-eval customerSupportEval \
  --control-weight 80 \
  --treatment-weight 20
```
The remaining steps (send traffic, get results, deploy the winner) are identical to the preceding system prompt example.

## Troubleshooting

For troubleshooting A/B test issues (such as missing results after sending traffic), see [Troubleshooting](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-target-based.html#target-based-troubleshooting>) in the target-based routing guide.

