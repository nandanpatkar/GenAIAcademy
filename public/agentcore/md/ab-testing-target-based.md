# Run an A/B test with target-based routing - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ab-testing-target-based.html

---

# Run an A/B test with target-based routing

Use the target-based routing pattern when the change you are testing involves code changes, a framework upgrade, or an entirely different agent implementation. Target-based routing routes traffic between multiple versions of the same AgentCore Runtime (named endpoints), or between entirely different AgentCore Runtimes. The AgentCore Gateway registers each endpoint as a separate target and routes each session to one endpoint or the other based on the A/B test’s traffic weights.

Key configuration for target-based A/B tests:

  * Variant configuration: `variantConfiguration.target` with the AgentCore Gateway target name

  * Evaluation configuration: `perVariantOnlineEvaluationConfig` (one online evaluation config per variant, since each endpoint has its own log group)

  * Gateway filter: `gatewayFilter.targetPaths` scopes which AgentCore Gateway paths the A/B test intercepts


This walkthrough deploys two versions of the customer support agent — one using Claude Sonnet (control) and one using Claude Opus (treatment) — creates named endpoints for each version, creates an A/B test, sends traffic, reviews results, and deploys the winner.

###### Note

This walkthrough is for agents hosted on an AgentCore Runtime. If your agent runs **outside** an AgentCore Runtime (a third-party or self-hosted agent — for example on AWS Lambda), see [Run an A/B test for agents hosted outside of AgentCore](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-3p-agents.html>) instead.

For a detailed comparison of A/B test patterns, see [Choosing a pattern](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing.html#ab-testing-pattern-comparison>).

## Step 1: Create the project

Create the project with the AgentCore CLI:

```bash
agentcore create --name ABTestTargetBased --no-agent
cd ABTestTargetBased
```
## Step 2: Add the runtime

Add the agent runtime. You will deploy two versions of this runtime — one for control and one for treatment — then create named endpoints to alias each version.

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
ABTestTargetBased/
├── agentcore/
│   ├── agentcore.json
│   ├── aws-targets.json
│   └── cdk/
└── app/
    └── csAgent/
        ├── main.py
        └── pyproject.toml
```
## Step 3: Deploy control and treatment versions

Replace `app/csAgent/main.py` with the control version (using Claude Sonnet):

```python
"""Customer support agent — control variant."""
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()
MODEL_ID = "global.anthropic.claude-sonnet-4-5-20250929-v1:0"
SYSTEM_PROMPT = "You are a helpful customer support assistant for Acme Store."

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

agent = Agent(
    model=BedrockModel(model_id=MODEL_ID),
    tools=[lookup_order, initiate_return, apply_discount],
    system_prompt=SYSTEM_PROMPT,
)

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
Deploy the control version (this creates version 1):

```bash
agentcore deploy
```
Now update `main.py` to use a different model for the treatment variant and deploy (this creates version 2):


```text
MODEL_ID = "global.anthropic.claude-opus-4-6-v1"
```
 
```bash
agentcore deploy
```
 

Create named endpoints for each version and deploy:

```bash
agentcore add runtime-endpoint \
  --runtime csAgent \
  --endpoint control \
  --version 1 \
  --description "Control variant — Claude Sonnet"

agentcore add runtime-endpoint \
  --runtime csAgent \
  --endpoint treatment \
  --version 2 \
  --description "Treatment variant — Claude Opus"

agentcore deploy
```
You now have:

  * Runtime endpoint `control` — serving version 1 with Claude Sonnet.

  * Runtime endpoint `treatment` — serving version 2 with Claude Opus.


Verify the runtime is working:

```bash
agentcore invoke --runtime csAgent --prompt "What is the status of order ORD-1003?"
```
You now have:

  * Runtime endpoint `control` — serving version 1 with Claude Sonnet.

  * Runtime endpoint `treatment` — serving version 2 with Claude Opus.


## Step 4: Create online evaluation configurations

Each endpoint has its own log group (the log group name ends with the endpoint name), so you need one online evaluation config per variant:

```bash
agentcore add online-eval \
  --name controlEvalTb \
  --runtime csAgent \
  --endpoint control \
  --evaluator "Builtin.Helpfulness" \
  --sampling-rate 100.0 \
  --enable-on-create

agentcore add online-eval \
  --name treatmentEvalTb \
  --runtime csAgent \
  --endpoint treatment \
  --evaluator "Builtin.Helpfulness" \
  --sampling-rate 100.0 \
  --enable-on-create

agentcore deploy
```
After each deployment, note the online evaluation config ARN — you will need both when creating the A/B test.

For more details on evaluator options and configuration, see [Create online evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./create-online-evaluations.html>).

## Step 5: Create the gateway and targets

A target-based A/B test routes traffic through an AgentCore Gateway, so the gateway and its two targets must already be deployed before you start the test. Add a gateway and register each runtime endpoint as an `http-runtime` target, then deploy:

```bash
agentcore add gateway --name csGateway

agentcore add gateway-target \
  --name customer-support-control \
  --gateway csGateway \
  --type http-runtime \
  --runtime csAgent \
  --runtime-endpoint control

agentcore add gateway-target \
  --name customer-support-treatment \
  --gateway csGateway \
  --type http-runtime \
  --runtime csAgent \
  --runtime-endpoint treatment

agentcore deploy
```
## Step 6: Create the A/B test

Start the A/B test with `agentcore run ab-test`. Each variant references one of the gateway targets you created and has its own online evaluation config. The command initiates the test directly on the service against the already-deployed gateway.

###### Example

AgentCore CLI
     ```bash
     agentcore run ab-test \
       --mode target-based \
       --name customerSupportTargetTest \
       --gateway csGateway \
       --runtime csAgent \
       --control-target customer-support-control \
       --treatment-target customer-support-treatment \
       --control-online-eval controlEvalTb \
       --treatment-online-eval treatmentEvalTb \
       --control-weight 80 \
       --treatment-weight 20
     ```
The test is RUNNING as soon as the command returns. Pass `--disable-on-create` to create it stopped. The `--gateway` flag is required and must reference the gateway you deployed in Step 5. Only one test can be RUNNING per gateway at a time. The command prints the test’s job ID, which is also available from `--json` as the `id` field. You need this ID for the lifecycle commands below.

AWS SDK (boto3)
     ```python
     import boto3
     import uuid

     REGION = "us-west-2"
     ACCOUNT_ID = "123456789012"

     # Runtime ARNs from Step 2 deployment output
     CONTROL_RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:runtime/ABTestTargetBased_CustomerSupportControl-abc123"
     TREATMENT_RUNTIME_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:runtime/ABTestTargetBased_CustomerSupportTreatment-def456"

     # Online evaluation config ARNs from Step 3
     CONTROL_EVAL_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:online-evaluation-config/controlEvalTb-abc123"
     TREATMENT_EVAL_ARN = f"arn:aws:bedrock-agentcore:{REGION}:{ACCOUNT_ID}:online-evaluation-config/treatmentEvalTb-def456"

     # IAM roles
     GATEWAY_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/AgentCoreGatewayRole"
     AB_TEST_ROLE_ARN = f"arn:aws:iam::{ACCOUNT_ID}:role/ABTestRole"

     cp_client = boto3.client("bedrock-agentcore-control", region_name=REGION)
     dp_client = boto3.client("bedrock-agentcore", region_name=REGION)

     # 1. Create an AgentCore Gateway
     gateway_response = cp_client.create_gateway(
         name="customerSupportTargetTest-gw",
         roleArn=GATEWAY_ROLE_ARN,
         authorizerType="AWS_IAM",
         clientToken=str(uuid.uuid4()),
     )
     gateway_id = gateway_response["gatewayId"]
     gateway_arn = gateway_response["gatewayArn"]
     print(f"Created AgentCore Gateway: {gateway_id}")

     # 2. Add control runtime as an AgentCore Gateway target
     cp_client.create_gateway_target(
         gatewayIdentifier=gateway_id,
         name="customer-support-control",
         targetConfiguration={
             "http": {
                 "agentcoreRuntime": {
                     "arn": CONTROL_RUNTIME_ARN,
                     "qualifier": "DEFAULT"
                 }
             }
         },
         clientToken=str(uuid.uuid4()),
     )
     print("Added target: customer-support-control")

     # 3. Add treatment runtime as an AgentCore Gateway target
     cp_client.create_gateway_target(
         gatewayIdentifier=gateway_id,
         name="customer-support-treatment",
         targetConfiguration={
             "http": {
                 "agentcoreRuntime": {
                     "arn": TREATMENT_RUNTIME_ARN,
                     "qualifier": "DEFAULT"
                 }
             }
         },
         clientToken=str(uuid.uuid4()),
     )
     print("Added target: customer-support-treatment")

     # 4. Create the A/B test
     response = dp_client.create_ab_test(
         name="customerSupportTargetTest",
         gatewayArn=gateway_arn,
         roleArn=AB_TEST_ROLE_ARN,
         evaluationConfig={
             "perVariantOnlineEvaluationConfig": [
                 {"name": "C", "onlineEvaluationConfigArn": CONTROL_EVAL_ARN},
                 {"name": "T1", "onlineEvaluationConfigArn": TREATMENT_EVAL_ARN}
             ]
         },
         gatewayFilter={
             "targetPaths": ["/customer-support-control/*"]
         },
         variants=[
             {
                 "name": "C",
                 "weight": 80,
                 "variantConfiguration": {
                     "target": {"name": "customer-support-control"}
                 }
             },
             {
                 "name": "T1",
                 "weight": 20,
                 "variantConfiguration": {
                     "target": {"name": "customer-support-treatment"}
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
## Step 7: Send traffic through the AgentCore Gateway

After the A/B test is running, send traffic through the AgentCore Gateway HTTP endpoint. The AgentCore Gateway assigns each request to a variant (control or treatment) based on the runtime session ID.

### How variant assignment works

The AgentCore Gateway uses the `X-Amzn-Bedrock-AgentCore-Runtime-Session-Id` header to determine which target to route traffic to. This header is **optional** — if you do not provide it, the runtime generates a session ID automatically. The AgentCore Gateway then uses the session ID (whether you provided it or the runtime generated it) to assign the request to a variant based on your configured traffic weights.

Session assignment is **sticky** : once a session ID is assigned to a variant, all subsequent requests with that same session ID route to the same target. This ensures a consistent experience within a session while still distributing new sessions across variants according to your traffic split.

### Generate traffic for testing

Save the following script as `loadgen.sh`, replacing `<gateway-id>` and `<target-name>` with the values from your deployment output. You can also copy the full invocation URL from `agentcore view ab-test <ab-test-id>`:

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
## Step 8: Get results

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

ab_test_id = "customerSupportTargetTest-Ab1Cd2Ef3G"

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

The time it takes for results to appear depends primarily on the session timeout configured in your online evaluation configs. A session is considered complete once no new requests arrive within the timeout window. After a session ends, results typically appear within 15 minutes. Results accumulate as more sessions complete — statistical significance improves with sample size.

###### Interpreting results

  * **p-value < 0.05 and positive `percentChange`:** The treatment is significantly better than control. Consider deploying the treatment.

  * **p-value < 0.05 and negative `percentChange`:** The treatment is significantly worse. Keep the control.

  * **p-value >= 0.05:** Not enough evidence to conclude a difference. Continue collecting samples or increase traffic to the treatment.

  * **Check all evaluators:** A treatment may improve one metric while regressing another. Review all evaluator results before deciding.


## Step 9: Confirm results and stop the A/B test

Once the A/B test reaches statistical significance, review the results and stop the experiment.

  1. **Confirm significance.** Verify that the target evaluator has `isSignificant: true` and a positive `percentChange` on the treatment variant (or confirm the control is the winner if the treatment regressed).

  2. **Stop the A/B test.** Run `agentcore stop ab-test -i <ab-test-id>`. Traffic routing ends immediately and all requests revert to the default target. See [View, pause, resume, and stop](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-manage.html#manage-ab-test-start-stop>).


## Step 10: Deploy the winner

After stopping the A/B test, route all traffic to the winning variant.

```bash
agentcore promote ab-test -i <ab-test-id>
agentcore deploy
```
`promote` stops the A/B test (if still running), updates the control endpoint to point to the treatment version (for example, updating `control` from version 1 to version 2), and removes the treatment endpoint. Run `agentcore deploy` to apply the changes.

Alternatively, you can manually deploy the winner by doing one of the following:

  * **Option A:** Use [AgentCore Gateway routing rules](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./gateway-rules.html>) to direct traffic from both targets to the winning target.

  * **Option B:** Remove the losing target from the AgentCore Gateway and route all traffic to the winner.

  * **Option C:** Update the losing target to point to the winning endpoint.


###### Next steps

After deploying the winner:

  * **Delete the A/B test** to clean up resources. See [Delete an A/B test](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ab-testing-manage.html#manage-ab-test-remove>).

  * **Monitor the new baseline.** Online evaluation continues scoring sessions on the winning configuration. Watch for regressions.

  * **Start the next iteration.** New traces from the winning configuration provide the foundation for the next recommendation cycle. See [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./optimization-how-it-works.html>).


## Understanding results

When you call `GetABTest`, the response includes a `results` object once the aggregation pipeline has processed enough sessions. The results contain per-evaluator metrics broken down by variant.

### Results structure

```json
{
  "results": {
    "analysisTimestamp": "2026-04-30T18:45:00Z",
    "evaluatorMetrics": [
      {
        "evaluatorArn": "arn:aws:bedrock-agentcore:us-west-2:123456789012:evaluator/Builtin.Helpfulness",
        "controlStats": {
          "variantName": "C",
          "sampleSize": 24,
          "mean": 0.72
        },
        "variantResults": [
          {
            "variantName": "T1",
            "sampleSize": 6,
            "mean": 0.85,
            "absoluteChange": 0.13,
            "percentChange": 18.1,
            "pValue": 0.032,
            "confidenceInterval": {
              "lower": 0.02,
              "upper": 0.24
            },
            "isSignificant": true
          }
        ]
      }
    ]
  }
}
```
### Field reference

Field | Description  
---|---  
`analysisTimestamp` |  When the service last computed statistics.  
`evaluatorMetrics` |  One entry per evaluator in the online evaluation config.  
`controlStats.mean` |  Average evaluator score across all control sessions.  
`controlStats.sampleSize` |  Number of scored sessions for the control variant.  
`variantResults[].mean` |  Average evaluator score across all treatment sessions.  
`variantResults[].sampleSize` |  Number of scored sessions for the treatment variant.  
`variantResults[].absoluteChange` |  Difference between treatment mean and control mean.  
`variantResults[].percentChange` |  Percent improvement (positive) or regression (negative) relative to control.  
`variantResults[].pValue` |  Probability the observed difference is due to chance. Below 0.05 indicates statistical significance.  
`variantResults[].confidenceInterval` |  95% confidence interval for the absolute change (`lower` and `upper` bounds).  
`variantResults[].isSignificant` |  `true` when p-value < 0.05 and sample sizes are sufficient.  
  
## Troubleshooting

### A/B test shows no results after sending traffic

Results do not appear immediately. The time it takes depends on the session timeout configured in your online evaluation config — a session is considered complete only after no new requests arrive within the timeout window. After a session ends, expect results within approximately 15 minutes.

If results still do not appear after this window:

  * **Verify the online eval log group.** The online evaluation configuration must point to the runtime agent’s output log group. If the online eval config references a different log group (or one that does not receive spans from your runtime), sessions will not be scored and the A/B test will never produce results.

  * **Check the log group name.** For target-based routing, each endpoint has its own log group (the log group name ends with the endpoint name). Ensure each online eval config references the correct endpoint’s log group.

  * **Confirm the runtime is emitting spans.** Check CloudWatch Logs for the expected log group. The key attributes you’re looking for on each span:

    * `aws.agentcore.gateway.routing_experiment_arn`

    * `aws.agentcore.gateway.routing_experiment_variant_name` (values: `C` or `T1`)

    * `session.id`

  * **Verify CLI-created vs manual configs.** If you used `agentcore add online-eval --runtime <name>`, the CLI automatically configures the correct log group. If you created the online eval config manually via the API, ensure the AgentCore Online Eval Config `dataSourceConfig.cloudWatchLogs.logGroupNames` matches your runtime’s span log group.



