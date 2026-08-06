# Getting started with batch evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations-getting-started.html

---

# Getting started with batch evaluation

This walkthrough takes you from a deployed agent to batch evaluation results using an Acme Store customer support agent. You will create the agent, deploy it, generate sample sessions, run a batch evaluation, and read the results.

###### Topics

  * Before you begin

  * Step 1: Create and deploy the sample agent

  * Step 2: Generate sample sessions

  * Step 3: Run batch evaluation

  * Step 4: Read per-session detail

  * Next steps


## Before you begin

Make sure you have:

  * The AgentCore CLI installed (`agentcore --version`)

  * AWS credentials with permissions for `bedrock-agentcore` and `logs`

  * Transaction Search enabled in CloudWatch

  * Python 3.10+ (for boto3 examples)


For full details, see [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-prereqs.html>).

The following constants are used in the boto3 examples. Replace them with your own values after deploying the agent:

```text
REGION       = "us-west-2"
AGENT_ARN    = "arn:aws:bedrock-agentcore:us-west-2:123456789012:runtime/AcmeSupport-abc123"
SERVICE_NAME = "AcmeSupport-abc123.DEFAULT"
LOG_GROUP    = "/aws/bedrock-agentcore/runtimes/AcmeSupport-abc123-DEFAULT"
```
## Step 1: Create and deploy the sample agent

Create an AgentCore project and replace the default agent code with the Acme Store customer support agent. This agent has five tools for handling orders, returns, shipping, discounts, and escalations.

### Create the project

```bash
agentcore create --name AcmeSupport --framework Strands --model-provider Bedrock --memory none
cd AcmeSupport
```
### Replace the agent code

Open `app/AcmeSupport/main.py` and replace its contents with the following:

```python
"""Acme Store customer support agent."""
from strands import Agent, tool
from strands.models.bedrock import BedrockModel
from bedrock_agentcore.runtime import BedrockAgentCoreApp

app = BedrockAgentCoreApp()
MODEL_ID = "global.anthropic.claude-sonnet-4-6"
SYSTEM_PROMPT = (
    "You are a helpful customer support assistant for Acme Store. "
    "Help customers with their orders, returns, and shipping questions."
)

@tool
def lookup_order(order_id: str) -> str:
    """Look up an order by ID and return its status, item, and delivery details."""
    orders = {
        "ORD-1001": {
            "status": "delivered",
            "item": "Blue T-Shirt (L)",
            "delivered": "2026-03-28",
            "total": "$29.99",
        },
        "ORD-1002": {
            "status": "in_transit",
            "item": "Running Shoes (10)",
            "shipped": "2026-03-30",
            "est_delivery": "2026-04-05",
            "total": "$89.99",
        },
        "ORD-1003": {
            "status": "delayed",
            "item": "Wireless Headphones",
            "shipped": "2026-03-25",
            "est_delivery": "2026-03-29",
            "days_late": 5,
            "total": "$59.99",
        },
        "ORD-1004": {
            "status": "processing",
            "item": "Yoga Mat",
            "ordered": "2026-04-02",
            "total": "$34.99",
        },
        "ORD-1005": {
            "status": "delivered",
            "item": "Coffee Maker",
            "delivered": "2026-03-20",
            "total": "$149.99",
        },
    }
    return str(orders.get(order_id, {"error": f"Order {order_id} not found"}))

@tool
def initiate_return(order_id: str, reason: str) -> str:
    """Initiate a return for an order. Sends a return label to the customer."""
    return (
        f"Return initiated for {order_id}. Reason: {reason}. "
        "Return label sent to customer email. Please ship within 14 days."
    )

@tool
def check_shipping_status(order_id: str) -> str:
    """Check detailed shipping status including carrier location and delays."""
    statuses = {
        "ORD-1002": (
            "Package is with carrier, currently in Portland OR. "
            "On schedule for April 5."
        ),
        "ORD-1003": (
            "Package delayed at distribution center in Memphis TN. "
            "Original delivery was March 29. Now 5 days late. "
            "Acme Store policy: orders delayed 3+ days qualify for 15% discount."
        ),
    }
    return statuses.get(order_id, f"No active shipment found for {order_id}.")

@tool
def apply_discount(order_id: str, discount_percent: int, reason: str) -> str:
    """Apply a percentage discount to an order and issue a refund."""
    return (
        f"Applied {discount_percent}% discount to {order_id}. "
        f"Reason: {reason}. Refund will appear in 3-5 business days."
    )

@tool
def escalate_to_human(reason: str) -> str:
    """Escalate the conversation to a human support agent."""
    return (
        f"Escalated to human agent. Reason: {reason}. "
        "Estimated wait time: 3 minutes."
    )

agent = Agent(
    model=BedrockModel(model_id=MODEL_ID),
    tools=[lookup_order, initiate_return, check_shipping_status,
           apply_discount, escalate_to_human],
    system_prompt=SYSTEM_PROMPT,
)

@app.entrypoint
def invoke(payload, context):
    result = agent(str(payload.get("prompt", "Hello")))
    return {"response": str(result)}

if __name__ == "__main__":
    app.run()
```
### Deploy and verify

```bash
agentcore deploy
```
After deployment, verify the agent is running:

```bash
agentcore invoke --prompt "What's the status of order ORD-1001?"
```
You should see a response with the order details. Note the runtime ARN, service name, and log group from `agentcore status --json` — you will need these for the boto3 examples.

###### Note

If you already have an agent deployed on AgentCore Runtime with observability enabled, skip this step and use your own agent for the rest of the walkthrough.

## Step 2: Generate sample sessions

Invoke the agent with varied prompts to create sessions for evaluation. These prompts cover different scenarios: order lookups, returns, shipping delays, discount requests, and multi-tool interactions.

###### Example

AgentCore CLI
     ```bash
     agentcore invoke --runtime AcmeSupport --prompt "What's the status of my order ORD-1001?"
     agentcore invoke --runtime AcmeSupport --prompt "I need to return order ORD-1001, the shirt doesn't fit."
     agentcore invoke --runtime AcmeSupport --prompt "What's the shipping status on ORD-1002?"
     agentcore invoke --runtime AcmeSupport --prompt "My order ORD-1003 is delayed, can you help?"
     agentcore invoke --runtime AcmeSupport --prompt "I'd like to check on order ORD-1004 please."
     agentcore invoke --runtime AcmeSupport --prompt "Can you look up order ORD-1005 for me?"
     agentcore invoke --runtime AcmeSupport --prompt "I want to return the coffee maker from order ORD-1005, it's defective."
     agentcore invoke --runtime AcmeSupport --prompt "Where is my order ORD-1002? It should have arrived by now."
     agentcore invoke --runtime AcmeSupport --prompt "ORD-1003 is really late, I want a discount."
     agentcore invoke --runtime AcmeSupport --prompt "Can you check order ORD-1001 and tell me when it was delivered?"
     ```
AWS SDK (boto3)
     ```python
     import boto3
     import json
     import uuid

     client = boto3.client("bedrock-agentcore", region_name=REGION)

     prompts = [
         "What's the status of my order ORD-1001?",
         "I need to return order ORD-1001, the shirt doesn't fit.",
         "What's the shipping status on ORD-1002?",
         "My order ORD-1003 is delayed, can you help?",
         "I'd like to check on order ORD-1004 please.",
         "Can you look up order ORD-1005 for me?",
         "I want to return the coffee maker from order ORD-1005, it's defective.",
         "Where is my order ORD-1002? It should have arrived by now.",
         "ORD-1003 is really late, I want a discount.",
         "Can you check order ORD-1001 and tell me when it was delivered?",
     ]

     for i, prompt in enumerate(prompts):
         session_id = f"acme-eval-{uuid.uuid4().hex[:12]}"
         print(f"[{i+1}/10] {prompt[:60]}...")

         response = client.invoke_agent_runtime(
             agentRuntimeArn=AGENT_ARN,
             runtimeSessionId=session_id,
             payload=json.dumps({"prompt": prompt}).encode(),
         )
         response_body = response["response"].read()
         print(f"  Done (session: {session_id})")

     print("\nAll sessions created.")
     ```
Wait 2–3 minutes after the last invocation for CloudWatch to ingest the telemetry before proceeding.

## Step 3: Run batch evaluation

Start a batch evaluation to score all recent sessions. The service discovers sessions from CloudWatch Logs, runs each evaluator against each session, and returns aggregate results.

###### Example

AgentCore CLI
     ```bash
     agentcore run batch-evaluation \
       --runtime AcmeSupport \
       --evaluator Builtin.GoalSuccessRate Builtin.Helpfulness Builtin.Faithfulness \
       --wait
     ```
By default, `agentcore run batch-evaluation` starts the job and returns immediately (without blocking). Pass `--wait` to block until the job reaches a terminal state. With `--wait`, the CLI resolves the CloudWatch log group and service name from your project configuration, starts the job, blocks until it reaches a terminal state, and then prints per-evaluator average scores:

```text
Batch evaluation completed: acme-eval-a1b2c3d4

Sessions: 10 completed, 0 failed, 10 total

Evaluator                           Avg Score
─────────────────────────────────────────────
Builtin.GoalSuccessRate             0.7200
Builtin.Helpfulness                 0.8100
Builtin.Faithfulness                0.8500

Results saved to .cli/jobs/batch-eval-results/
```
Add `--json` to emit machine-readable results (including `batchEvaluationId` and the per-evaluator `averageScore`) for scripting, and `-n <name>` to label the run so you can compare results across runs. For example:

```bash
agentcore run batch-evaluation \
  --runtime AcmeSupport \
  --evaluator Builtin.GoalSuccessRate Builtin.Helpfulness Builtin.Faithfulness \
  -n acme_baseline \
  --wait
```
AWS SDK (boto3)
     ```python
     import boto3
     import uuid
     import time
     import json

     eval_client = boto3.client("bedrock-agentcore", region_name=REGION)

     # Start the batch evaluation
     response = eval_client.start_batch_evaluation(
         batchEvaluationName=f"acme_baseline_{uuid.uuid4().hex[:8]}",
         evaluators=[
             {"evaluatorId": "Builtin.GoalSuccessRate"},
             {"evaluatorId": "Builtin.Helpfulness"},
             {"evaluatorId": "Builtin.Faithfulness"},
         ],
         dataSourceConfig={
             "cloudWatchLogs": {
                 "serviceNames": [SERVICE_NAME],
                 "logGroupNames": [LOG_GROUP],
             }
         },
         clientToken=str(uuid.uuid4()),
     )

     batch_eval_id = response["batchEvaluationId"]
     print(f"Started: {batch_eval_id}")

     # Poll until complete
     while True:
         result = eval_client.get_batch_evaluation(batchEvaluationId=batch_eval_id)
         status = result["status"]
         print(f"Status: {status}")

         if status in ("COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "STOPPED"):
             break
         time.sleep(30)

     print(json.dumps(result, indent=4, default=str))
     ```
## Step 4: Read per-session detail

The aggregate scores tell you the overall picture. To see per-turn, per-evaluator scores for individual sessions, use the built-in CLI viewing commands or read the evaluation events directly from CloudWatch Logs.

###### Example

AgentCore CLI
    

The CLI provides first-class commands to view completed batch evaluation jobs and their results. View a specific job by its batch evaluation job ID, or list past jobs:

```bash
# View a batch evaluation job and its results
agentcore view batch-evaluation acme-eval-a1b2c3d4

# List batch evaluation jobs
agentcore batch-evaluations history
```
These commands run interactively when no flags are given. Add `--json` for non-interactive, machine-readable output, for example `agentcore view batch-evaluation acme-eval-a1b2c3d4 --json`.

AWS SDK (boto3)
     ```bash
     # Get the output location from the batch evaluation result
     output = result["outputConfig"]["cloudWatchConfig"]
     log_group = output["logGroupName"]
     log_stream = output["logStreamName"]

     # Read the events
     logs_client = boto3.client("logs", region_name=REGION)
     response = logs_client.get_log_events(
         logGroupName=log_group,
         logStreamName=log_stream,
     )

     for event in response["events"]:
         event_attrs = json.loads(event["message"]).get("attributes", {})
         print(f"Score: {event_attrs.get('gen_ai.evaluation.score.value')}")
         print(f"Label: {event_attrs.get('gen_ai.evaluation.score.label')}")
         print(f"Explanation: {event_attrs.get('gen_ai.evaluation.explanation', '')[:200]}")
         print()
     ```
## Next steps

  * **Filter sessions** — Evaluate specific sessions by ID or time range. See [Start a batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-start.html>).

  * **Run against a dataset** — Invoke your agent against predefined scenarios and evaluate the results automatically. See [Dataset evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations.html>).

  * **Compare runs** — Run batch evaluation before and after a change and compare scores. See [Understanding results and output](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-results.html>).



