# ShoppingConcierge: Simulated Multi-Turn Batch Evaluation

This notebook shows how to evaluate a deployed AgentCore agent against
a set of **simulated multi-turn conversations** using `boto3` and the
Bedrock Converse API.

A small "actor" LLM (Claude Haiku 4.5) role-plays a customer for each
scenario. For every turn it reads the agent's last response and
generates the next customer message, driving a realistic multi-turn
interaction against the deployed AgentCore runtime. When every scenario
has finished, all session IDs are submitted in a single
`start_batch_evaluation` call and scored by built-in evaluators.

Hand-authoring every user turn for every ground-truth scenario does not
scale, and brittle scripted conversations miss the realistic branching
that real users produce. An actor simulator gives you broad
conversational coverage for a fixed set of goals and assertions.

> **Note:** The `bedrock-agentcore` SDK also provides a built-in
> `SimulatedScenario` + `SimulationConfig` + `BatchEvaluationRunner`
> integration that handles the actor loop for you. See the
> [User simulation docs](https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/user-simulation.html)
> for details. This notebook implements the actor loop manually to
> show the mechanics so you can customize actor behavior, transcript
> handling, and stop conditions for your use case.

### The Shopping Concierge Agent

The agent source lives in `shopping_concierge_agent.py` in this
directory. It is a [Strands](https://strandsagents.com/) agent with
eight tools over a deterministic mock product catalog, mock shopping
carts, and mock orders, making evaluation results fully reproducible
across runs.

### Prerequisites

- **Python 3.10+**
- **`boto3 >= 1.43.0`** in the active kernel.
- **AWS credentials** available to the default boto3 session.
- **IAM permissions** for the principal running this notebook:
  - `bedrock-agentcore:InvokeAgentRuntime`
  - `bedrock-agentcore:Evaluate`
  - `bedrock-agentcore:StartBatchEvaluation`
  - `bedrock-agentcore:GetBatchEvaluation`
  - `bedrock-agentcore-control:CreateAgentRuntime`
  - `bedrock-agentcore-control:UpdateAgentRuntime`
  - `bedrock-agentcore-control:GetAgentRuntime`
  - `bedrock-agentcore-control:ListAgentRuntimes`
  - `bedrock:InvokeModel*` (for the actor LLM)
  - `s3:*` on the deploy S3 bucket
  - `logs:*` on the runtime's CloudWatch log group

## 1. Install Dependencies

```python
!pip install -q -r requirements.txt --upgrade
```

## 2. Imports and Configuration

Edit `REGION` below if you plan to deploy the agent into a different
region. The runtime-specific values (`RUNTIME_ARN`, `SERVICE_NAME`,
`LOG_GROUP`) are set after the deploy step.

```python
import json
import time
import uuid

import boto3
from botocore.config import Config
from IPython.display import display, Markdown

# ---- Edit this for your deployment ----------------------------------------
REGION = "aws_region"  # Add your AWS region here
# ----------------------------------------------------------------------------

# Built-in evaluators applied to every session in the batch run.
EVALUATOR_IDS = [
    "Builtin.GoalSuccessRate",
    "Builtin.Helpfulness",
    "Builtin.Correctness",
]

# Model used by the actor simulator to role-play the customer.
ACTOR_MODEL_ID = "us.anthropic.claude-haiku-4-5-20251001-v1:0"

# How long to wait for CloudWatch spans to land before the batch run.
INGESTION_DELAY_SECONDS = 180

# ---- Clients ---------------------------------------------------------------
# Control plane: manages agent runtimes.
cp = boto3.client("bedrock-agentcore-control", region_name=REGION)

# Data plane: runtime invoke + evaluation operations (start_batch_evaluation,
# get_batch_evaluation) all live on this single client in boto3 >= 1.43.0.
bac = boto3.client(
    "bedrock-agentcore",
    region_name=REGION,
    config=Config(read_timeout=120, connect_timeout=30),
)

# Separate client for the actor LLM (Converse API).
bedrock_runtime = boto3.client("bedrock-runtime", region_name=REGION)

print(f"REGION         : {REGION}")
print(f"ACTOR_MODEL_ID : {ACTOR_MODEL_ID}")
```

## 3. Deploy the Shopping Concierge Agent

The deployment logic lives in `deploy_shopping_concierge_agent.py` in this directory. It uses the `agentcore` CLI to:

1. **Configure** the agent with `agentcore configure` (entrypoint, name, region, requirements)
2. **Deploy** via `agentcore deploy` which handles CodeBuild image build, ECR push, OTel instrumentation, and runtime creation automatically
3. **Poll until READY**

The script sets `AGENT_ID`, `AGENT_ARN`, `RUNTIME_ARN`, `SERVICE_NAME`, `LOG_GROUP`, and `SPANS_LOG_GROUP`
in the notebook namespace.

```python
# Deploy the Shopping Concierge agent.
# See deploy_shopping_concierge_agent.py for the full deployment flow.
%run -i deploy_shopping_concierge_agent.py
```

## 4. Simulated Scenarios

Each scenario has these fields:

- `actor_profile`: traits, context, and goal the actor LLM uses to
  play the customer consistently across turns.
- `first_input`: the opening customer utterance that starts the
  conversation.
- `max_turns`: a cap on how many back-and-forth turns the simulation
  will run before it forces an end.
- `assertions`: the ground-truth claims that the built-in evaluators
  will verify against each session's trace.

These five scenarios cover headphones purchase, order tracking, a
return, a multi-item cart, and a budget-constrained fitness purchase.

```python
SCENARIOS = [
    {
        "scenario_id": "sim-headphones-buyer",
        "scenario_description": (
            "A remote worker wants to buy wireless noise-cancelling headphones under $100. "
            "The actor should search for products, ask about details, add to cart, and complete checkout."
        ),
        "actor_profile": {
            "traits": {
                "communication_style": "casual",
                "tech_savvy": "medium",
                "budget_conscious": True,
            },
            "context": "A remote worker looking for headphones for video calls and background music.",
            "goal": "Find and purchase wireless noise-cancelling headphones under $100.",
        },
        "first_input": "Hi! I'm looking for some good wireless headphones for working from home. Do you have any?",
        "max_turns": 6,
        "assertions": [
            "Agent searches for headphones or audio products",
            "Agent provides product details including price and rating",
            "Agent guides customer through checkout and provides order confirmation",
        ],
    },
    {
        "scenario_id": "sim-order-tracking",
        "scenario_description": (
            "A customer wants to track an existing in-transit order ORD-SC-002 (water bottles). "
            "The actor should ask for order status and shipment tracking details."
        ),
        "actor_profile": {
            "traits": {"impatient": True, "detail_oriented": True},
            "context": "Waiting for a water bottle order placed last week, wants to know exact delivery date.",
            "goal": "Find out where order ORD-SC-002 is and when it will arrive.",
        },
        "first_input": "I placed an order last week and I want to know where it is. The order number is ORD-SC-002.",
        "max_turns": 4,
        "assertions": [
            "Agent retrieves order status for ORD-SC-002",
            "Agent provides tracking number or tracking details",
            "Agent gives estimated delivery date",
        ],
    },
    {
        "scenario_id": "sim-return-request",
        "scenario_description": (
            "A customer received headphones (order ORD-SC-001) and wants to return them "
            "because the sound quality is disappointing. The actor should initiate a return."
        ),
        "actor_profile": {
            "traits": {"polite": True, "first_time_returner": True},
            "context": "Received headphones last week but the noise cancellation is not as advertised.",
            "goal": "Successfully initiate a return for ORD-SC-001 and understand when the refund arrives.",
        },
        "first_input": (
            "Hi, I received my headphones (order ORD-SC-001) last week "
            "but I'm disappointed with the sound quality. Can I return them?"
        ),
        "max_turns": 5,
        "assertions": [
            "Agent verifies the order ORD-SC-001 exists and is delivered",
            "Agent initiates the return successfully",
            "Agent explains the refund amount and timeline",
        ],
    },
    {
        "scenario_id": "sim-multi-item-cart",
        "scenario_description": (
            "A customer setting up a home office wants to buy a smart desk lamp and a USB-C hub. "
            "They want both items in the cart and to checkout in a single session."
        ),
        "actor_profile": {
            "traits": {"organized": True, "efficiency_focused": True},
            "context": "Moving into a new apartment and equipping a home office on a ~$100 budget.",
            "goal": "Purchase a desk lamp and USB-C hub, staying under $100 total.",
        },
        "first_input": (
            "I'm setting up a home office and need two things: a good desk lamp and a USB hub. "
            "What do you have in those categories?"
        ),
        "max_turns": 8,
        "assertions": [
            "Agent searches for desk lamps and USB hubs",
            "Agent adds both items to the shopping cart",
            "Agent shows cart total before checkout",
            "Agent completes checkout and provides order confirmation",
        ],
    },
    {
        "scenario_id": "sim-budget-fitness",
        "scenario_description": (
            "A budget-conscious customer wants to start a home workout routine. "
            "They compare yoga mats and resistance bands before purchasing the best-value option."
        ),
        "actor_profile": {
            "traits": {
                "price_sensitive": True,
                "comparison_shopper": True,
                "health_focused": True,
            },
            "context": "Starting a home workout routine on a tight budget, max $40 to spend.",
            "goal": "Find the best-value fitness equipment under $40 and purchase it.",
        },
        "first_input": (
            "I want to start working out at home but I'm on a tight budget, "
            "ideally under $40. What fitness equipment do you carry?"
        ),
        "max_turns": 6,
        "assertions": [
            "Agent searches for fitness or sports equipment",
            "Agent provides pricing for items within the $40 budget",
            "Agent helps customer compare options and complete a purchase",
        ],
    },
]

print(f"Loaded {len(SCENARIOS)} simulated scenarios")
```

## 5. Actor Simulator

Three small functions handle the simulation loop:

1. `invoke_agent`: one call to `bac.invoke_agent_runtime`, joining
   the streaming response back into a plain string.
2. `actor_next_message`: one call to `bedrock_runtime.converse` using
   the actor profile as the system prompt. Maps agent utterances to
   the `assistant` role and customer utterances to `user`.
3. `run_scenario_simulation`: the multi-turn loop that alternates
   between the agent and the actor until `max_turns` is reached or
   the actor signals the goal is accomplished.

Each scenario gets a fresh `runtimeSessionId`, so every session shows
up as its own trace in CloudWatch for the batch evaluator to score.

```python
def invoke_agent(prompt: str, session_id: str) -> str:
    """Send a single prompt to the deployed agent; return the text response."""
    resp = bac.invoke_agent_runtime(
        agentRuntimeArn=RUNTIME_ARN,
        qualifier="DEFAULT",
        runtimeSessionId=session_id,
        payload=json.dumps({"prompt": prompt}).encode("utf-8"),
        contentType="application/json",
        accept="application/json",
    )
    raw = resp["response"].read().decode("utf-8")
    parts = []
    for line in raw.splitlines():
        if line.startswith("data: "):
            chunk = line[len("data: ") :]
            try:
                chunk = json.loads(chunk)
            except Exception:
                pass
            parts.append(str(chunk))
    return "".join(parts) if parts else raw
```

```python
def build_actor_system_prompt(scenario: dict) -> str:
    p = scenario["actor_profile"]
    return (
        f"You are role-playing a customer interacting with an online Shopping Concierge agent.\n\n"
        f"Your profile:\n"
        f"  Context: {p['context']}\n"
        f"  Goal:    {p['goal']}\n"
        f"  Traits:  {p['traits']}\n\n"
        f"Rules for your messages:\n"
        f"- Stay in character. Be realistic, conversational, and consistent with your traits.\n"
        f"- Respond naturally to what the agent says. Ask follow-up questions, provide info when requested, make decisions based on your goal.\n"
        f"- Keep each message short (1-2 sentences typically).\n"
        f"- When you feel your goal is complete (e.g., you've successfully purchased, got your refund, got your tracking info), say so and end the conversation naturally.\n"
        f"- Do NOT pretend to be the agent or generate fake agent responses. ONLY speak as the customer.\n"
    )
```

```python
_FAREWELL_MARKERS = (
    "thanks, bye",
    "thanks bye",
    "all set",
    "goodbye",
    "that's all",
    "thats all",
    "i'm done",
    "im done",
    "end the conversation",
)


def actor_next_message(system_prompt: str, transcript: list[tuple[str, str]]) -> tuple[str, bool]:
    """Generate the next customer message using the actor LLM.

    transcript is a list of (speaker, text) tuples where speaker is
    either "agent" or "customer". The actor always speaks as the
    customer, so customer turns map to role="user" in Converse format
    and agent turns map to role="assistant".

    Returns (text, conversation_complete).
    """
    messages: list[dict] = []
    for speaker, text in transcript:
        role = "user" if speaker == "customer" else "assistant"
        # Converse requires alternating roles; collapse same-role runs.
        if messages and messages[-1]["role"] == role:
            messages[-1]["content"][0]["text"] += "\n\n" + text
        else:
            messages.append({"role": role, "content": [{"text": text}]})

    # If the next message should be the customer, the last entry must
    # be the agent (role=assistant). Ensure that: if the transcript
    # ends with the customer speaking, append a tiny agent ack so the
    # Converse call remains valid.
    if not messages or messages[-1]["role"] != "assistant":
        messages.append(
            {
                "role": "assistant",
                "content": [{"text": "(waiting for your next message)"}],
            }
        )

    resp = bedrock_runtime.converse(
        modelId=ACTOR_MODEL_ID,
        system=[{"text": system_prompt}],
        messages=messages,
        inferenceConfig={"maxTokens": 256, "temperature": 0.7},
    )

    content = resp.get("output", {}).get("message", {}).get("content", [])
    out = content[0]["text"].strip() if content else "Thanks, that's all I needed!"
    stop_reason = resp.get("stopReason", "")

    lowered = out.lower()
    complete = any(m in lowered for m in _FAREWELL_MARKERS)
    # If the model ended its turn with a short, conclusive message, treat as done.
    if stop_reason == "end_turn" and len(out) < 60 and ("thank" in lowered or "bye" in lowered):
        complete = True

    return out, complete
```

```python
def run_scenario_simulation(scenario: dict) -> dict:
    """Run one scenario and return its session record."""
    scenario_id = scenario["scenario_id"]
    session_id = str(uuid.uuid4())
    system_prompt = build_actor_system_prompt(scenario)
    transcript: list[tuple[str, str]] = []

    current_customer_message = scenario["first_input"]
    transcript.append(("customer", current_customer_message))
    print(f"[{scenario_id}] session={session_id}")
    print(f"  turn 1 customer > {current_customer_message[:80]}")

    turns_taken = 0
    for turn_idx in range(scenario["max_turns"]):
        turns_taken = turn_idx + 1
        agent_response = invoke_agent(current_customer_message, session_id)
        transcript.append(("agent", agent_response))
        print(f"  turn {turns_taken} agent    < {agent_response[:80]}")

        if turn_idx == scenario["max_turns"] - 1:
            break  # cap hit; no need to generate another actor turn

        next_customer_message, complete = actor_next_message(system_prompt, transcript)
        transcript.append(("customer", next_customer_message))
        print(f"  turn {turns_taken + 1} customer > {next_customer_message[:80]}")
        if complete:
            print(f"  [{scenario_id}] actor signalled goal complete; ending early")
            turns_taken += 1
            break
        current_customer_message = next_customer_message

    return {
        "scenario_id": scenario_id,
        "session_id": session_id,
        "num_turns": turns_taken,
        "transcript": transcript,
    }
```

## 6. Run All Scenarios

This is the step that actually consumes AWS resources. Each scenario
drives a real multi-turn conversation against the deployed runtime
and a few calls to the actor LLM. Expect it to take a few minutes.

After every session completes we wait `INGESTION_DELAY_SECONDS` for
OpenTelemetry spans to land in CloudWatch, which is what the batch
evaluator reads from.

```python
simulation_results = []
for scenario in SCENARIOS:
    result = run_scenario_simulation(scenario)
    simulation_results.append(result)
    print(f"[{result['scenario_id']}] session={result['session_id']} turns={result['num_turns']}\n")

print(f"\nWaiting {INGESTION_DELAY_SECONDS}s for CloudWatch span ingestion...")
time.sleep(INGESTION_DELAY_SECONDS)
print("Ready for batch evaluation.")
```

## 7. Batch Evaluation

Now that every scenario has produced a session with CloudWatch spans,
submit all of them in a single `start_batch_evaluation` call. We
attach each scenario's `assertions` as inline ground truth so the
built-in evaluators can check them against the trace.

Workflow:

1. `bac.start_batch_evaluation(...)` submits the batch with:
   - `batchEvaluationName`: alphanumeric + underscores, starts with a letter, max 48 chars
   - `evaluators`: list of `{"evaluatorId": "..."}` dicts (max 10)
   - `dataSourceConfig.cloudWatchLogs`: `serviceNames`, `logGroupNames`, optional `filterConfig.sessionIds`
   - `evaluationMetadata.sessionMetadata`: per-session ground truth (max 500 entries)
   - `clientToken`: idempotency token
2. `bac.get_batch_evaluation(batchEvaluationId=...)` polls until the
   status is one of `COMPLETED`, `COMPLETED_WITH_ERRORS`, `FAILED`, or `STOPPED`.
3. Read `evaluationResults.evaluatorSummaries[]` for per-evaluator
   `statistics.averageScore`, `totalEvaluated`, `totalFailed`.
4. Read `evaluationResults.numberOfSessionsCompleted` / `numberOfSessionsFailed`
   for session-level counts.

```python
# Build session metadata for ground truth.
session_ids = [r["session_id"] for r in simulation_results]
session_metadata = []
for result in simulation_results:
    scenario = next(s for s in SCENARIOS if s["scenario_id"] == result["scenario_id"])
    session_metadata.append(
        {
            "sessionId": result["session_id"],
            "testScenarioId": scenario["scenario_id"],
            "groundTruth": {
                "inline": {
                    "assertions": [{"text": a} for a in scenario["assertions"]],
                },
            },
        }
    )

batch_name = f"sc_simulated_{uuid.uuid4().hex[:8]}"
client_token = str(uuid.uuid4())

print(f"Submitting batch evaluation: {batch_name}")
start_resp = bac.start_batch_evaluation(
    batchEvaluationName=batch_name,
    evaluators=[{"evaluatorId": e} for e in EVALUATOR_IDS],
    dataSourceConfig={
        "cloudWatchLogs": {
            "serviceNames": [SERVICE_NAME],
            "logGroupNames": ["aws/spans", LOG_GROUP],
            "filterConfig": {"sessionIds": session_ids},
        },
    },
    evaluationMetadata={
        "sessionMetadata": session_metadata,
    },
    clientToken=client_token,
)

batch_id = start_resp["batchEvaluationId"]
print(f"batchEvaluationId : {batch_id}")
```

```python
# Poll until the batch reaches a terminal state.
TERMINAL_STATUSES = {"COMPLETED", "COMPLETED_WITH_ERRORS", "FAILED", "STOPPED"}
POLL_SECONDS = 30

print(f"Polling get_batch_evaluation every {POLL_SECONDS}s ...")
while True:
    resp = bac.get_batch_evaluation(batchEvaluationId=batch_id)
    status = resp["status"]
    print(f"  status = {status}")
    if status in TERMINAL_STATUSES:
        break
    time.sleep(POLL_SECONDS)

batch_final = resp
print(f"\nBatch evaluation finished: {batch_final['status']}")
```

## 8. Results

Render `evaluationResults.evaluatorSummaries` as a markdown table.
Each row is one built-in evaluator with its aggregate statistics
across all five simulated sessions.

```python
# Surface evaluatorSummaries: per-evaluator averageScore / totalEvaluated / totalFailed.
results = batch_final.get("evaluationResults", {})
summaries = results.get("evaluatorSummaries", [])

# Session-level counts (see GetBatchEvaluation response docs)
sessions_completed = results.get("numberOfSessionsCompleted", "N/A")
sessions_failed = results.get("numberOfSessionsFailed", "N/A")
total_sessions = results.get("totalNumberOfSessions", "N/A")
sessions_ignored = results.get("numberOfSessionsIgnored", "N/A")
print(f"Sessions completed: {sessions_completed}")
print(f"Sessions failed:    {sessions_failed}")
print(f"Total sessions:     {total_sessions}")
print(f"Sessions ignored:   {sessions_ignored}")

if not summaries:
    display(Markdown("_No evaluator summaries returned. Check the batch status and CloudWatch log groups._"))
else:
    rows = [
        "| Evaluator | Name | Avg Score | Total Evaluated | Total Failed |",
        "|---|---|---|---|---|",
    ]
    for s in summaries:
        evaluator_id = s.get("evaluatorId", "")
        name = s.get("evaluatorName", "")
        stats = s.get("statistics", {})
        avg = stats.get("averageScore", "N/A")
        total_eval = s.get("totalEvaluated", "N/A")
        total_failed = s.get("totalFailed", "N/A")
        rows.append(f"| `{evaluator_id}` | {name} | {avg} | {total_eval} | {total_failed} |")
    display(Markdown("### Batch Evaluation Summary\n\n" + "\n".join(rows)))

print("\nBatch evaluation complete.")
```

## 9. Clean Up (Optional)

Batch evaluation results persist until you delete them. Uncomment the
calls below to remove this batch run and/or the deployed agent runtime.

```python
# Uncomment to delete the batch evaluation record.
# bac.delete_batch_evaluation(batchEvaluationId=batch_id)
# print(f"Deleted batch evaluation {batch_id}")

# Uncomment to delete the agent runtime.
# cp.delete_agent_runtime(agentRuntimeId=AGENT_ID)
# print(f"Deleted agent runtime {AGENT_ID}")

# Uncomment to delete the ECR repository.
# ecr = boto3.client("ecr", region_name=REGION)
# ecr.delete_repository(repositoryName="shopping-concierge-eval", force=True)
# print("Deleted ECR repository")

# Uncomment to delete the CloudWatch log group.
# logs = boto3.client("logs", region_name=REGION)
# logs.delete_log_group(logGroupName=LOG_GROUP)
# print(f"Deleted log group {LOG_GROUP}")
```
