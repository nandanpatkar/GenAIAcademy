# HR Assistant Agent: Ground Truth Evaluations

This notebook demonstrates evaluation of an agentic application with ground truth using Amazon Bedrock AgentCore Evaluations:

| Interface | When to use |
|---|---|
| **EvaluationClient** | You already have agent sessions in CloudWatch. Evaluate specific sessions against reference inputs. |
| **OnDemandEvaluationDatasetRunner** | You have a test dataset. You want to invoke the agent for every scenario and evaluate the results. |
| **BatchEvaluationRunner** | You want to evaluate many sessions at once with a single API call and get aggregate scores per evaluator. |

**Comparison with other evaluation types**

| Aspect | On-demand | Online | Batch |
|---|---|---|---|
| **Trigger** | Caller-initiated, synchronous | Continuous, event-driven | Caller-initiated, asynchronous |
| **Session source** | Caller provides spans inline | Watches a log group | Service discovers from CloudWatch Logs |
| **Scope** | Single session | All sessions matching sampling rules | Multiple sessions (time range, session IDs, or full log group) |
| **Ground truth** | Via `evaluationReferenceInputs` | Not supported | Via `sessionMetadata` with inline ground truth |
| **Results** | Synchronous response | CloudWatch metrics and dashboards | Aggregate summaries with per-evaluator averages, plus per-session detail in CloudWatch |
| **Use case** | Dev-time spot checks, CI/CD | Production monitoring | Baseline measurement, pre/post comparison, regression testing |

For a simulated multi-turn evaluation example using an actor LLM, see `03-advanced/02-simulating-agent-interactions/Strands-AgentCore-ShoppingConcierge.ipynb`.

### The HR Assistant Agent

We'll deploy an **HR Assistant** for Acme Corp, a Strands agent that helps employees with:
- PTO balance checks and time-off requests
- HR policy lookups (PTO, remote work, parental leave)
- Benefits information (health, dental, vision, 401k)
- Pay stub retrieval

### What You'll Learn
- How to use `EvaluationClient` to evaluate existing agent sessions logged in Amazon CloudWatch with ground-truth references
- How to use `OnDemandEvaluationDatasetRunner` to run automated dataset evaluations
- How to interpret evaluation results across built-in evaluators (Correctness, GoalSuccessRate, Trajectory)
- How to run a **batch evaluation** with `StartBatchEvaluation` to score many sessions at once

### Tutorial Details

| Information | Details |
|---|---|
| Agent framework | Strands Agents |
| Runtime | Amazon Bedrock AgentCore Runtime |
| Evaluation SDK | `bedrock-agentcore` |
| AWS services | AgentCore Runtime, AgentCore Evaluations, CloudWatch Logs |

### Prerequisites
- Python 3.10+
- AWS credentials with permissions for AgentCore, CloudWatch, CodeBuild, ECR, IAM

## Step 1: Install Dependencies

```python
!pip install -r requirements.txt -q --upgrade
```

## Step 2: Configuration

Import libraries and configure your AWS session.

```python
import boto3
import json
import time
import uuid
from datetime import timedelta
from boto3.session import Session
from IPython.display import display, Markdown

region = "aws_region"  # Add AWS region here
boto_session = Session(region_name=region)
REGION = boto_session.region_name

print(f"Region  : {REGION}")
```

## Step 3: Deploy the HR Assistant Agent

The deployment logic lives in `deploy_hr_assistant_agent.py` in this directory. It uses the `agentcore` CLI to:

1. **Configure** the agent with `agentcore configure` (entrypoint, name, region, requirements)
2. **Deploy** via `agentcore deploy` which handles CodeBuild image build, ECR push, OTel instrumentation, and runtime creation automatically
3. **Poll until READY**

The script sets `AGENT_ID`, `AGENT_ARN`, `CW_LOG_GROUP`, and `agentcore_client` in the notebook namespace.

The HR Assistant agent source lives in `hr_assistant_agent.py` in this directory.
It is a [Strands](https://strandsagents.com/) agent with five tools over deterministic mock data,
making evaluation results fully reproducible:

| Tool | Description |
|---|---|
| `get_pto_balance` | Remaining PTO days for an employee |
| `submit_pto_request` | Request time off |
| `lookup_hr_policy` | Company policy documents (PTO, remote work, parental leave, code of conduct) |
| `get_benefits_summary` | Health, dental, vision, 401k, life insurance details |
| `get_pay_stub` | Pay stub for a given period |

The agent uses `us.amazon.nova-lite-v1:0` as its model and caches conversation history
per session ID for multi-turn support.

```python
# Deploy the HR Assistant agent.
# See deploy_hr_assistant_agent.py for the full deployment flow.
%run -i deploy_hr_assistant_agent.py

# _REGION is used by the custom evaluator cell downstream
_REGION = REGION

print(f"AGENT_ID     : {AGENT_ID}")
print(f"AGENT_ARN    : {AGENT_ARN}")
print(f"CW_LOG_GROUP : {CW_LOG_GROUP}")
```

## Step 3: Invoke the Agent to Generate Sessions

Before we can evaluate, we need agent sessions with CloudWatch spans. We'll invoke the agent
for several scenarios and record the session IDs for use with `EvaluationClient`.

Each session corresponds to one evaluation scenario.

```python
def invoke_agent(prompt: str, session_id: str) -> str:
    """Send a single prompt to the HR assistant and return its text response."""
    resp = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        qualifier="DEFAULT",
        runtimeSessionId=session_id,
        payload=json.dumps({"prompt": prompt}).encode("utf-8"),
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


def run_session(turns: list[str], session_prefix: str) -> str:
    """Invoke a multi-turn session and return its session ID."""
    session_id = f"{session_prefix}-{uuid.uuid4()}"
    print(f"Session: {session_id}")
    for turn_input in turns:
        print(f"  > {turn_input[:70]}")
        response = invoke_agent(turn_input, session_id)
        print(f"  < {response[:100]}")
    return session_id
```

```python
# --- Single-turn sessions ---

print("=== Single-Turn Sessions ===")

session_pto_balance = run_session(["What is the current PTO balance for employee EMP-001?"], "pto-balance-check")

session_submit_pto = run_session(
    ["Please submit a PTO request for employee EMP-001 from 2026-04-14 to 2026-04-16 for a family vacation."],
    "submit-pto-request",
)

session_pay_stub = run_session(
    ["Can you pull up the January 2026 pay stub for employee EMP-001?"],
    "pay-stub-lookup",
)

print("\nSingle-turn sessions created.")
```

```python
# --- Multi-turn session: PTO planning ---

print("=== Multi-Turn Session: PTO Planning ===")

session_pto_planning = run_session(
    [
        "How many PTO days do I have left? My employee ID is EMP-001.",
        "Great. I'd like to take December 23 to December 25 off. Please submit a request.",
        "Remind me, what is the policy on rolling over unused PTO?",
    ],
    "pto-planning-session",
)

print("\nMulti-turn session created.")
```

```python
# --- Multi-turn session: New employee onboarding ---

print("=== Multi-Turn Session: New Employee Onboarding ===")

session_onboarding = run_session(
    [
        "I just joined the company. What is the remote work policy?",
        "How much PTO do I get as a new employee?",
        "What life insurance benefit does the company provide?",
        "Can you check the current PTO balance for employee EMP-042?",
    ],
    "new-employee-onboarding",
)

print("\nAll sessions created. Waiting 60s for CloudWatch log ingestion...")
time.sleep(60)
print("Ready to evaluate.")
```

## Step 5: EvaluationClient — Evaluate Existing Sessions

`EvaluationClient` is the right tool when you **already have agent sessions** logged in CloudWatch and you want to test them against your ground truth in a ad-hoc manner.
It looks up the agent's spans for a given `session_id` and runs evaluators against them. For these evaluations, you can pass in an expected response, assertions and expected trajectory. You can use the Built-in evaluators as well as the custom evaluators.

### Ground-Truth Reference Inputs

`ReferenceInputs` lets you supply optional ground truth:

| Field | Evaluators that use it | Description |
|---|---|---|
| `expected_response` | `Builtin.Correctness` | The ideal response text |
| `expected_trajectory` | `Builtin.TrajectoryExactOrderMatch`, `Builtin.TrajectoryInOrderMatch`, `Builtin.TrajectoryAnyOrderMatch` | Ordered list of tool names |
| `assertions` | `Builtin.GoalSuccessRate` | Free-text assertions the session should satisfy |

Evaluators that don't need ground truth (`Helpfulness`, `ResponseRelevance`) can be included in the same call.
Each evaluator only reads the fields it needs.

## Create Custom (LLM-as-a-Judge) Evaluators

In addition to built-in evaluators, you can define your own evaluation criteria using
**LLM-as-a-Judge custom evaluators**. These accept natural language instructions that
can reference **ground truth placeholders** automatically substituted at evaluation time.

### Ground truth placeholders

| Level | Available placeholders |
|---|---|
| **TRACE** | `{context}`, `{assistant_turn}`, `{expected_response}` |
| **SESSION** | `{context}`, `{available_tools}`, `{actual_tool_trajectory}`, `{expected_tool_trajectory}`, `{assertions}` |

For example, a trace-level evaluator comparing response similarity would include
`{assistant_turn}` and `{expected_response}` in its instructions. When the evaluator runs,
the service substitutes those placeholders with the actual agent output and the
`expectedResponse` from `ReferenceInputs`.

### What we'll create

| Evaluator | Level | Placeholders | Description |
|---|---|---|---|
| `HRResponseSimilarity` | TRACE | `{assistant_turn}`, `{expected_response}` | How closely the agent's response matches the expected answer |
| `HRAssertionChecker` | SESSION | `{actual_tool_trajectory}`, `{expected_tool_trajectory}`, `{assertions}` | Whether the agent called the right tools and satisfied all session assertions |

```python
_SUFFIX = uuid.uuid4().hex[:8]
_cp = boto3.client("bedrock-agentcore-control", region_name=_REGION)

# ---------------------------------------------------------------------------
# Trace-level: HRResponseSimilarity
# Compares the agent's response to the expected_response reference input.
# {assistant_turn} → actual agent output
# {expected_response} → expectedResponse field in ReferenceInputs
# ---------------------------------------------------------------------------
print("Creating HRResponseSimilarity (TRACE) ...")
_resp_sim = _cp.create_evaluator(
    evaluatorName=f"HRResponseSimilarity_{_SUFFIX}",
    level="TRACE",
    evaluatorConfig={
        "llmAsAJudge": {
            "instructions": (
                "Compare the agent's response with the expected response.\n"
                "Agent response: {assistant_turn}\n"
                "Expected response: {expected_response}\n\n"
                "Rate how closely the agent's response matches the expected response. "
                "Focus on whether the key facts, numbers, and conclusions agree."
            ),
            "ratingScale": {
                "numerical": [
                    {
                        "value": 0.0,
                        "label": "not_similar",
                        "definition": "Response is factually different or missing key information from the expected response.",
                    },
                    {
                        "value": 0.5,
                        "label": "partially_similar",
                        "definition": "Response captures some expected content but omits or misrepresents parts.",
                    },
                    {
                        "value": 1.0,
                        "label": "highly_similar",
                        "definition": "Response is semantically equivalent to the expected response — all key facts match.",
                    },
                ]
            },
            "modelConfig": {
                "bedrockEvaluatorModelConfig": {
                    "modelId": "us.amazon.nova-lite-v1:0",
                    "inferenceConfig": {"maxTokens": 512},
                }
            },
        }
    },
)
CUSTOM_RESPONSE_SIMILARITY_ID = _resp_sim["evaluatorId"]
print(f"  evaluatorId : {CUSTOM_RESPONSE_SIMILARITY_ID}")

# ---------------------------------------------------------------------------
# Session-level: HRAssertionChecker
# Evaluates tool trajectory compliance and assertion satisfaction.
# {actual_tool_trajectory}   → tools the agent actually called
# {expected_tool_trajectory} → expectedTrajectory from ReferenceInputs
# {assertions}               → assertions list from ReferenceInputs
# ---------------------------------------------------------------------------
print("\nCreating HRAssertionChecker (SESSION) ...")
_assert_chk = _cp.create_evaluator(
    evaluatorName=f"HRAssertionChecker_{_SUFFIX}",
    level="SESSION",
    evaluatorConfig={
        "llmAsAJudge": {
            "instructions": (
                "Evaluate whether the agent fulfilled the session requirements.\n\n"
                "Expected tool trajectory: {expected_tool_trajectory}\n"
                "Actual tool trajectory: {actual_tool_trajectory}\n"
                "Assertions to verify: {assertions}\n\n"
                "Score the agent on how well it followed the expected tool trajectory "
                "and satisfied every listed assertion."
            ),
            "ratingScale": {
                "numerical": [
                    {
                        "value": 0.0,
                        "label": "failed",
                        "definition": "Agent did not follow the trajectory and failed most assertions.",
                    },
                    {
                        "value": 0.5,
                        "label": "partial",
                        "definition": "Agent partially followed the trajectory or satisfied only some assertions.",
                    },
                    {
                        "value": 1.0,
                        "label": "passed",
                        "definition": "Agent followed the expected trajectory and satisfied all assertions.",
                    },
                ]
            },
            "modelConfig": {
                "bedrockEvaluatorModelConfig": {
                    "modelId": "us.amazon.nova-lite-v1:0",
                    "inferenceConfig": {"maxTokens": 512},
                }
            },
        }
    },
)
CUSTOM_ASSERTION_CHECKER_ID = _assert_chk["evaluatorId"]
print(f"  evaluatorId : {CUSTOM_ASSERTION_CHECKER_ID}")

print("\nCustom evaluators ready:")
print(f"  HRResponseSimilarity (TRACE)   : {CUSTOM_RESPONSE_SIMILARITY_ID}")
print(f"  HRAssertionChecker   (SESSION) : {CUSTOM_ASSERTION_CHECKER_ID}")
```

```python
from bedrock_agentcore.evaluation import EvaluationClient, ReferenceInputs

eval_client = EvaluationClient(region_name=REGION)

print(f"EvaluationClient initialised (region={REGION})")
print(f"  {CUSTOM_RESPONSE_SIMILARITY_ID} → TRACE  (custom: HRResponseSimilarity)")
print(f"  {CUSTOM_ASSERTION_CHECKER_ID} → SESSION (custom: HRAssertionChecker)")
```

```python
# Helper function for printing
def display_eval_results(label: str, results: list) -> None:
    """Pretty-print EvaluationClient results as a markdown table."""
    rows = ["| Evaluator | Value | Label | Explanation |", "|---|---|---|---|"]
    for r in results:
        evaluator = r.get("evaluatorId", "")[:40]
        value = str(r.get("value", r.get("score", "N/A")))
        lbl = str(r.get("label", r.get("rating", "")))
        explanation = (r.get("explanation", r.get("reason", "")) or "")[:120].replace("\n", " ")
        error_code = r.get("errorCode")
        if error_code:
            lbl = f"ERR:{error_code}"
            explanation = (r.get("errorMessage", "") or "")[:120]
        rows.append(f"| `{evaluator}` | {value} | {lbl} | {explanation} |")

    if len(rows) == 2:  # only header rows, no data
        rows.append("| No results — session may be too recent or spans not yet visible | | | |")

    md = f"### {label}\n\n" + "\n".join(rows)
    display(Markdown(md))
```

### 5a. Single-Turn: PTO Balance — Correctness + Helpfulness + Custom ResponseSimilarity

We evaluate the PTO balance response against a known expected answer using `Builtin.Correctness`
and the custom `HRResponseSimilarity` evaluator (which uses the `{assistant_turn}` and
`{expected_response}` placeholders). Both measure factual accuracy but use different scoring rubrics.

```python
pto_balance_results = eval_client.run(
    evaluator_ids=[
        "Builtin.Correctness",  # TRACE: compares with provided expected response
        "Builtin.Helpfulness",  # TRACE: no ground truth needed
        "Builtin.ResponseRelevance",  # TRACE: no ground truth needed
        CUSTOM_RESPONSE_SIMILARITY_ID,  # TRACE: custom — uses {assistant_turn} + {expected_response}
    ],
    session_id=session_pto_balance,
    agent_id=AGENT_ID,
    look_back_time=timedelta(hours=2),
    reference_inputs=ReferenceInputs(
        expected_response="Employee EMP-001 has 10 remaining PTO days out of 15 total (5 days used).",
    ),
)

display_eval_results(
    "PTO Balance — Correctness + Quality + Custom ResponseSimilarity",
    pto_balance_results,
)
```

### 5b. Single-Turn: PTO Submission — Assertions + Trajectory + Custom AssertionChecker

This cell runs both built-in trajectory evaluators **and** the custom `HRAssertionChecker`
(which uses `{actual_tool_trajectory}`, `{expected_tool_trajectory}`, and `{assertions}` placeholders)
plus the custom `HRResponseSimilarity` for the response. This lets you compare built-in vs. custom
scoring side by side.

```python
submit_pto_results = eval_client.run(
    evaluator_ids=[
        "Builtin.GoalSuccessRate",  # SESSION: built-in assertion evaluator
        "Builtin.TrajectoryExactOrderMatch",  # SESSION: built-in trajectory evaluator
        "Builtin.TrajectoryAnyOrderMatch",  # SESSION: built-in trajectory evaluator
        "Builtin.Correctness",  # TRACE: built-in response accuracy
        CUSTOM_RESPONSE_SIMILARITY_ID,  # TRACE (custom): {assistant_turn} + {expected_response}
    ],
    session_id=session_submit_pto,
    agent_id=AGENT_ID,
    look_back_time=timedelta(hours=2),
    reference_inputs=ReferenceInputs(
        expected_trajectory=["submit_pto_request"],
        assertions=[
            "Agent called submit_pto_request for employee EMP-001",
            "Agent confirmed the PTO request was approved",
            "Agent provided a request ID (e.g. PTO-2026-001)",
        ],
        expected_response="PTO request submitted and approved for EMP-001 from 2026-04-14 to 2026-04-16.",
    ),
)

display_eval_results("PTO Submission — Built-in + Custom ResponseSimilarity", submit_pto_results)
```

### 5c. Single-Turn: Pay Stub — Factual Correctness

Factual data retrieval scenarios are well-suited for `Builtin.Correctness` combined with
`Builtin.GoalSuccessRate`. The expected_response provides the ground truth figures.

```python
pay_stub_results = eval_client.run(
    evaluator_ids=[
        "Builtin.Correctness",
        "Builtin.GoalSuccessRate",
    ],
    session_id=session_pay_stub,
    agent_id=AGENT_ID,
    look_back_time=timedelta(hours=2),
    reference_inputs=ReferenceInputs(
        expected_response="EMP-001 January 2026: gross pay $8,333.33, net pay $5,362.50.",
        assertions=[
            "Agent called get_pay_stub for EMP-001 period 2026-01",
            "Agent reported the correct gross pay of $8,333.33",
            "Agent reported the correct net pay of $5,362.50",
        ],
    ),
)

display_eval_results("Pay Stub Lookup — Correctness + GoalSuccessRate", pay_stub_results)
```

### 5d. Multi-Turn: PTO Planning Session (3 turns) + Custom AssertionChecker

For multi-turn sessions, `EvaluationClient` fetches all spans for the session and evaluates
the complete conversation. The trajectory and assertions apply across all turns.

This scenario also exercises the custom `HRAssertionChecker` evaluator (SESSION level),
which uses `{actual_tool_trajectory}`, `{expected_tool_trajectory}`, and `{assertions}`
placeholders. A 3-turn session with distinct tool calls per turn gives the evaluator
a rich trajectory to compare against the expected sequence.

```python
pto_planning_results = eval_client.run(
    evaluator_ids=[
        "Builtin.GoalSuccessRate",
        "Builtin.TrajectoryExactOrderMatch",
        "Builtin.TrajectoryInOrderMatch",
        "Builtin.TrajectoryAnyOrderMatch",
        "Builtin.Helpfulness",
        CUSTOM_ASSERTION_CHECKER_ID,  # SESSION (custom): {actual_tool_trajectory} + {expected_tool_trajectory} + {assertions}
    ],
    session_id=session_pto_planning,
    agent_id=AGENT_ID,
    look_back_time=timedelta(hours=2),
    reference_inputs=ReferenceInputs(
        expected_trajectory=[
            "get_pto_balance",
            "submit_pto_request",
            "lookup_hr_policy",
        ],
        assertions=[
            "Agent correctly reported 10 remaining PTO days for EMP-001 in turn 1",
            "Agent submitted a PTO request for December 23-25, 2026 in turn 2",
            "Agent correctly stated the 5-day PTO rollover limit in turn 3",
        ],
    ),
)

display_eval_results(
    "PTO Planning — Multi-Turn (3 turns) + Custom AssertionChecker",
    pto_planning_results,
)
```

## Step 6: OnDemandEvaluationDatasetRunner — Automated Dataset Evaluation

`OnDemandEvaluationDatasetRunner` is the right tool when you have a **test dataset** and want to:
1. Automatically invoke your agent for each scenario
2. Collect CloudWatch spans
3. Run evaluators against each scenario's results

This is ideal for regression testing, CI/CD pipelines, and batch evaluation against curated datasets.

### Dataset structure

A dataset consists of **scenarios**, each with one or more **turns**. Optional ground-truth fields:
- `Turn.expected_response` — per-turn expected answer
- `PreDefinedScenario.expected_trajectory` — ordered list of tool names
- `PreDefinedScenario.assertions` — session-level assertions

### How OnDemandEvaluationDatasetRunner works

```
For each scenario:
  1. Create a new session ID
  2. Call your agent_invoker function for each turn
  3. Wait for CloudWatch spans to appear (evaluation_delay_seconds)
  4. Submit spans + ground truth to the evaluation service
  5. Collect and return results
```

```python
from bedrock_agentcore.evaluation import (
    AgentInvokerInput,
    AgentInvokerOutput,
    CloudWatchAgentSpanCollector,
    Dataset,
    EvaluationRunConfig,
    OnDemandEvaluationDatasetRunner,
    EvaluatorConfig,
    Turn,
    PredefinedScenario,
)
```

```python
def agent_invoker(invoker_input: AgentInvokerInput) -> AgentInvokerOutput:
    """
    Called by OnDemandEvaluationDatasetRunner once per turn. Invoke the HR assistant
    and return the text response.

    AgentInvokerInput fields:
      - payload:    The turn input (str or dict) from the dataset.
      - session_id: Framework-managed session ID, stable across all turns
                    in a scenario. Pass it to your agent for conversation continuity.
    """
    payload = invoker_input.payload
    body = {"prompt": payload} if isinstance(payload, str) else payload

    resp = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        qualifier="DEFAULT",
        runtimeSessionId=invoker_input.session_id,
        payload=json.dumps(body).encode("utf-8"),
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
    return AgentInvokerOutput(agent_output="".join(parts) if parts else raw)
```

### 6a. Define the Evaluation Dataset

We define scenarios inline. A mix of single-turn and multi-turn scenarios exercises
different aspects of the agent.

```python
dataset = Dataset(
    scenarios=[
        # --- Single-turn: PTO balance ---
        PredefinedScenario(
            scenario_id="pto-balance-check",
            turns=[
                Turn(
                    input="What is the current PTO balance for employee EMP-001?",
                    expected_response="Employee EMP-001 has 10 remaining PTO days out of 15 total (5 days used).",
                )
            ],
            expected_trajectory=["get_pto_balance"],
            assertions=[
                "Agent called get_pto_balance with employee_id=EMP-001",
                "Agent reported 10 remaining PTO days",
            ],
        ),
        # --- Single-turn: HR policy lookup ---
        PredefinedScenario(
            scenario_id="pto-policy-lookup",
            turns=[
                Turn(
                    input="What is the company PTO policy?",
                    expected_response="Full-time employees accrue 15 days of PTO per year. Requests must be submitted at least 2 business days in advance. Up to 5 unused days roll over each year.",
                )
            ],
            expected_trajectory=["lookup_hr_policy"],
            assertions=[
                "Agent called lookup_hr_policy with topic=pto",
                "Agent mentioned the 15-day annual accrual for full-time employees",
                "Agent mentioned the 2 business day advance notice requirement",
            ],
        ),
        # --- Single-turn: 401k benefits ---
        PredefinedScenario(
            scenario_id="401k-info",
            turns=[
                Turn(
                    input="How does the 401k match work?",
                    expected_response="The company matches 100% of contributions up to 4% of salary, plus 50% on the next 2%, for a total effective match of up to 5%. The match vests over 3 years.",
                )
            ],
            expected_trajectory=["get_benefits_summary"],
            assertions=[
                "Agent called get_benefits_summary with benefit_type=401k",
                "Agent correctly described the 4% full match and 50% match on next 2%",
                "Agent mentioned the 3-year vesting schedule",
            ],
        ),
        # --- Single-turn: check balance then submit PTO ---
        PredefinedScenario(
            scenario_id="check-and-submit-pto",
            turns=[
                Turn(
                    input="Check the PTO balance for EMP-002, and if they have at least 2 days, submit a request for 2026-05-26 to 2026-05-27.",
                    expected_response="EMP-002 has 3 remaining PTO days. PTO request submitted and approved for 2026-05-26 to 2026-05-27.",
                )
            ],
            expected_trajectory=["get_pto_balance", "submit_pto_request"],
            assertions=[
                "Agent first called get_pto_balance for EMP-002",
                "Agent confirmed 3 remaining days is sufficient",
                "Agent then called submit_pto_request for the correct dates",
            ],
        ),
        # --- Multi-turn: benefits exploration ---
        PredefinedScenario(
            scenario_id="benefits-exploration",
            turns=[
                Turn(
                    input="Can you walk me through the health insurance options?",
                    expected_response="The company covers 90% of premiums for employee-only coverage. Three plans are available: Blue Shield PPO, Kaiser HMO, and HDHP with HSA.",
                ),
                Turn(
                    input="What about dental?",
                    expected_response="The dental plan covers 100% of preventive care, 80% of basic restorative care, and 50% of major work, with a $2,000 annual maximum.",
                ),
                Turn(
                    input="And how much does the company contribute to the 401k?",
                    expected_response="The company matches 100% up to 4% of salary, plus 50% on the next 2%, for a total effective match of up to 5%.",
                ),
            ],
            expected_trajectory=[
                "get_benefits_summary",
                "get_benefits_summary",
                "get_benefits_summary",
            ],
            assertions=[
                "Agent called get_benefits_summary three times across the conversation",
                "Agent correctly described health, dental, and 401k benefits in their respective turns",
                "Agent maintained conversational context across all three turns",
            ],
        ),
    ]
)

print(f"Dataset contains {len(dataset.scenarios)} scenarios.")
```

### 6b. Configure and Run OnDemandEvaluationDatasetRunner

```python
# Span collector: polls CloudWatch for OTel spans emitted by the agent
span_collector = CloudWatchAgentSpanCollector(
    log_group_name=CW_LOG_GROUP,
    region=REGION,
    max_wait_seconds=180,
    poll_interval_seconds=15,
)

# Evaluator level cache — built-ins + custom evaluators
EVALUATOR_LEVELS = {
    "Builtin.GoalSuccessRate": "SESSION",
    "Builtin.TrajectoryExactOrderMatch": "SESSION",
    "Builtin.TrajectoryInOrderMatch": "SESSION",
    "Builtin.TrajectoryAnyOrderMatch": "SESSION",
    "Builtin.Correctness": "TRACE",
}
# Custom evaluators (These are the custom evaluators we created for HR Response Similarity and HRAssertionChecker)
EVALUATOR_LEVELS[CUSTOM_RESPONSE_SIMILARITY_ID] = "TRACE"
EVALUATOR_LEVELS[CUSTOM_ASSERTION_CHECKER_ID] = "SESSION"

# Evaluator configuration — mix of built-in and custom evaluators
config = EvaluationRunConfig(
    evaluator_config=EvaluatorConfig(
        evaluator_ids=[
            "Builtin.Correctness",  # TRACE — expected_response
            "Builtin.GoalSuccessRate",  # SESSION — assertions
            "Builtin.TrajectoryExactOrderMatch",  # SESSION — expected_trajectory
            "Builtin.TrajectoryInOrderMatch",  # SESSION — expected_trajectory
            "Builtin.TrajectoryAnyOrderMatch",  # SESSION — expected_trajectory
            CUSTOM_RESPONSE_SIMILARITY_ID,  # TRACE (custom) — {assistant_turn} + {expected_response}
            CUSTOM_ASSERTION_CHECKER_ID,  # SESSION (custom) — {actual_tool_trajectory} + {assertions}
        ]
    ),
    evaluation_delay_seconds=180,
    max_concurrent_scenarios=3,
)

runner = OnDemandEvaluationDatasetRunner(region=REGION)
runner._evaluator_level_cache.update(EVALUATOR_LEVELS)

print("OnDemandEvaluationDatasetRunner configured. Starting evaluation...")
print(f"  Scenarios : {len(dataset.scenarios)}")
print(f"  Evaluators: {len(config.evaluator_config.evaluator_ids)} (7 built-in + 2 custom)")
print(f"  Delay     : {config.evaluation_delay_seconds}s (waiting for CloudWatch ingestion)")
```

```python
# Run the evaluation.
# OnDemandEvaluationDatasetRunner will:
#   1. Invoke agent_invoker for each turn in each scenario
#   2. Wait evaluation_delay_seconds for CloudWatch ingestion
#   3. Submit spans to the evaluation service
#   4. Return aggregated results

eval_result = runner.run(
    config=config,
    dataset=dataset,
    agent_invoker=agent_invoker,
    span_collector=span_collector,
)

completed = sum(1 for sr in eval_result.scenario_results if sr.status == "COMPLETED")
failed = sum(1 for sr in eval_result.scenario_results if sr.status == "FAILED")
print(
    f"\nEvaluation complete: {completed} completed, {failed} failed out of {len(eval_result.scenario_results)} scenarios."
)
```

### 6c. Inspect Results

```python
def display_runner_results(eval_result) -> None:
    """Display OnDemandEvaluationDatasetRunner results as a markdown table per scenario."""
    for sr in eval_result.scenario_results:
        if sr.status == "FAILED":
            display(Markdown(f"**Scenario `{sr.scenario_id}`** — FAILED: {sr.error}"))
            continue

        rows = ["| Evaluator | Value | Label | Explanation |", "|---|---|---|---|"]
        for er in sr.evaluator_results:
            for res in er.results:
                value = str(res.get("value", res.get("score", "N/A")))
                lbl = str(res.get("label", res.get("rating", "")))
                explanation = (res.get("explanation", "") or "")[:130].replace("\n", " ")
                error_code = res.get("errorCode")
                if error_code:
                    lbl = f"ERR:{error_code}"
                    explanation = (res.get("errorMessage", "") or "")[:130]
                rows.append(f"| `{er.evaluator_id[:40]}` | {value} | {lbl} | {explanation} |")

        md = f"### Scenario: `{sr.scenario_id}`\n\n" + "\n".join(rows)
        display(Markdown(md))


display_runner_results(eval_result)
```

```python
# Aggregate summary: average score per evaluator across all scenarios
from collections import defaultdict

scores_by_evaluator = defaultdict(list)
for sr in eval_result.scenario_results:
    if sr.status != "COMPLETED":
        continue
    for er in sr.evaluator_results:
        for res in er.results:
            if "value" in res and res["value"] is not None and not res.get("errorCode"):
                scores_by_evaluator[er.evaluator_id].append(float(res["value"]))

print("\nEvaluator Summary (average score across all scenarios)")
print("=" * 60)
for evaluator_id, scores in sorted(scores_by_evaluator.items()):
    avg = sum(scores) / len(scores)
    print(f"  {evaluator_id:<45} avg={avg:.2f}  (n={len(scores)})")
```

### 6d. Save Results to File

```python
import os
from datetime import datetime

os.makedirs("results", exist_ok=True)
timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
results_path = f"results/groundtruth_eval_{timestamp}.json"

with open(results_path, "w") as f:
    json.dump(eval_result.model_dump(), f, indent=2, default=str)

print(f"Results saved to: {results_path}")
```

## Step 7: Batch Evaluation

`BatchEvaluationRunner` is the right tool when you want to **evaluate many sessions in a single API call** and get aggregate scores per evaluator. Unlike `OnDemandEvaluationDatasetRunner` which runs evaluation client-side, batch evaluation submits all session IDs to the service and polls for completion.

This is ideal for:
- Baseline measurement across a large number of sessions
- Pre/post comparison after prompt or tool changes
- Production monitoring where you want aggregate metrics, not per-scenario detail

We reuse the same `dataset` and `agent_invoker` from Step 6. The runner invokes the agent for each scenario, waits for CloudWatch ingestion, then submits a batch evaluation job and polls until completion.

```python
from bedrock_agentcore.evaluation.runner.batch.batch_evaluation_runner import (
    BatchEvaluationRunner,
)
from bedrock_agentcore.evaluation.runner.batch.batch_evaluation_models import (
    BatchEvaluationRunConfig,
    BatchEvaluatorConfig,
    CloudWatchDataSourceConfig,
)

# Reuse the agent config from earlier cells
SERVICE_NAME = f"{AGENT_ID}.DEFAULT"
CW_LOG_GROUP_BATCH = f"/aws/bedrock-agentcore/runtimes/{AGENT_ID}-DEFAULT"
SPANS_LOG_GROUP = "aws/spans"

print(f"SERVICE_NAME : {SERVICE_NAME}")
print(f"CW_LOG_GROUP : {CW_LOG_GROUP_BATCH}")
```

```python
import uuid

batch_data_source = CloudWatchDataSourceConfig(
    service_names=[SERVICE_NAME],
    log_group_names=[SPANS_LOG_GROUP, CW_LOG_GROUP_BATCH],
    ingestion_delay_seconds=180,
)

batch_config = BatchEvaluationRunConfig(
    batch_evaluation_name=f"gt_batch_{uuid.uuid4().hex[:8]}",
    evaluator_config=BatchEvaluatorConfig(
        evaluator_ids=[
            "Builtin.Correctness",
            "Builtin.GoalSuccessRate",
            "Builtin.TrajectoryExactOrderMatch",
        ]
    ),
    data_source=batch_data_source,
    polling_timeout_seconds=1800,
    polling_interval_seconds=30,
)

# Reuse the same dataset and agent_invoker from Step 6
print(f"Batch evaluation name: {batch_config.batch_evaluation_name}")
print(f"Evaluators: {batch_config.evaluator_config.evaluator_ids}")
print(f"Dataset scenarios: {len(dataset.scenarios)}")
print("Starting batch evaluation (this may take several minutes) ...")

batch_runner = BatchEvaluationRunner(region=REGION)
batch_result = batch_runner.run_dataset_evaluation(
    config=batch_config,
    dataset=dataset,
    agent_invoker=agent_invoker,
)

print(f"\nBatch ID : {batch_result.batch_evaluation_id}")
print(f"Status   : {batch_result.status}")
```

```python
# --- Batch Evaluation Results ---
print(f"Batch ID:  {batch_result.batch_evaluation_id}")
print(f"ARN:       {batch_result.batch_evaluation_arn}")
print(f"Status:    {batch_result.status}")
print(f"Created:   {batch_result.created_at}")

if batch_result.evaluation_results:
    ev = batch_result.evaluation_results
    # Session-level counts
    print(f"\nSessions completed: {ev.number_of_sessions_completed}")
    print(f"Sessions failed:    {ev.number_of_sessions_failed}")
    print(f"Total sessions:     {ev.total_number_of_sessions}")
    if ev.evaluator_summaries:
        print("\nPer-evaluator scores:")
        for es in ev.evaluator_summaries:
            eid = es.evaluator_id or "unknown"
            score = (
                f"{es.statistics.average_score:.3f}"
                if es.statistics and es.statistics.average_score is not None
                else "N/A"
            )
            evaluated = es.total_evaluated or 0
            failed = es.total_failed or 0
            print(f"  {eid:<40} score={score}  (evaluated={evaluated}, failed={failed})")
else:
    print("\nNo aggregated evaluation results returned.")

if batch_result.error_details:
    print(f"\nError details: {batch_result.error_details}")

# Fetch per-session detail from CloudWatch (optional)
if batch_result.output_data_config:
    events = batch_runner.fetch_evaluation_events(batch_result)
    print(f"\nPer-session evaluation events: {len(events)}")
    for ev in events[:5]:  # Show first 5
        attrs = ev.get("attributes", {})
        print(f"  session: {attrs.get('session.id', '')[:40]}")
        print(f"  evaluator: {attrs.get('gen_ai.evaluation.name')}")
        print(f"  score: {attrs.get('gen_ai.evaluation.score.value')}")
        print(f"  label: {attrs.get('gen_ai.evaluation.score.label')}")
        print()
```

## Simulated Multi-Turn Evaluation

The evaluation techniques above use predefined scenarios with scripted user inputs.
Another option of constructing the dataset with lesser manual effort is simulating
the user and constructing a simulated dataset. User simulation uses an LLM-backed
actor to play the role of an end user interacting with your agent. You define the
actor's profile and goal, and the actor drives a multi-turn conversation with your
agent until the goal is met or the turn limit is reached. To learn more and test
this, see the companion notebook:

**[`Strands-AgentCore-ShoppingConcierge.ipynb`](../03-advanced/02-simulating-agent-interactions/Strands-AgentCore-ShoppingConcierge.ipynb)**

That notebook deploys a Shopping Concierge agent, runs five simulated customer
scenarios (headphones purchase, order tracking, returns, multi-item cart, budget
fitness), and scores all sessions in a single `StartBatchEvaluation` call, using
only `boto3 >= 1.43.0` and the Bedrock Converse API for the actor.

## Step 8: Cleanup

Delete the agent runtime endpoint when you're done to avoid ongoing costs.

```python
# Uncomment to delete the agent runtime
# cp = boto3.client("bedrock-agentcore-control", region_name=REGION)
# cp.delete_agent_runtime(agentRuntimeId=AGENT_ID)
# print("Agent runtime deleted.")

print("Cleanup skipped. Uncomment the cell above to delete the agent runtime.")
```

### Key takeaways

| | EvaluationClient | OnDemandEvaluationDatasetRunner |
|---|---|---|
| **When to use** | You have existing sessions | You have a test dataset |
| **Best for** | Post-hoc analysis, debugging | Regression testing, CI/CD |
| **Input** | session_id | Dataset of scenarios |

- **Batch evaluation** (`BatchEvaluationRunner`) scores many sessions in a single service-side job, ideal for aggregate metrics and pre/post comparison

### Built-in evaluator reference

| Evaluator | Level | Ground truth required |
|---|---|---|
| `Builtin.Correctness` | TRACE | `expected_response` |
| `Builtin.GoalSuccessRate` | SESSION | `assertions` |
| `Builtin.TrajectoryExactOrderMatch` | SESSION | `expected_trajectory` |
| `Builtin.TrajectoryInOrderMatch` | SESSION | `expected_trajectory` |
| `Builtin.TrajectoryAnyOrderMatch` | SESSION | `expected_trajectory` |


### Custom evaluator ground truth placeholders

Custom (LLM-as-a-judge) evaluators reference ground truth via placeholders in their `instructions`.

| Level | Placeholder | Filled from |
|---|---|---|
| TRACE | `{assistant_turn}` | Agent's actual response |
| TRACE | `{expected_response}` | `ReferenceInputs.expected_response` |
| TRACE | `{context}` | Session context |
| SESSION | `{actual_tool_trajectory}` | Tools called by the agent |
| SESSION | `{expected_tool_trajectory}` | `ReferenceInputs.expected_trajectory` |
| SESSION | `{assertions}` | `ReferenceInputs.assertions` |
| SESSION | `{available_tools}` | Tools available to the agent |
