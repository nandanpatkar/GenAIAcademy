# Ground truth evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/ground-truth-evaluations.html

---

# Ground truth evaluations

Ground truth is the known correct answer or expected behavior for a given input — the "gold standard" you compare actual results against. For agent evaluation, ground truth transforms subjective quality assessment into objective measurement, enabling regression detection, benchmark datasets, and domain-specific correctness that generic evaluators cannot provide on their own.

With ground truth evaluations, you provide reference inputs alongside your session spans when calling the Evaluate API. The service uses these reference inputs to score your agent’s actual behavior against the expected behavior. Evaluators that don’t use a particular ground truth field ignore it and report which fields were not used in the response.

###### Topics

  * Supported builtin evaluators and ground truth fields

  * Prerequisites

  * Correctness with expected response

  * GoalSuccessRate with assertions

  * Trajectory matching with expected trajectory

  * Combining all ground truth fields in one request

  * Understanding ignored reference input fields

  * Ground truth in custom evaluators


## Supported builtin evaluators and ground truth fields

The following table shows which built-in evaluators support ground truth and which fields they use.

Evaluator | Level | Ground truth field | Description  
---|---|---|---  
`Builtin.Correctness` |  Trace |  `expectedResponse` |  Measures how accurately the agent’s response matches the expected answer. Uses LLM-as-a-Judge scoring.  
`Builtin.GoalSuccessRate` |  Session |  `assertions` |  Validates whether the agent’s behavior satisfies natural language assertions across the entire session. Uses LLM-as-a-Judge scoring.  
`Builtin.TrajectoryExactOrderMatch` |  Session |  `expectedTrajectory` |  Checks that the actual tool call sequence matches the expected sequence exactly — same tools, same order, no extras. Programmatic scoring (no LLM calls).  
`Builtin.TrajectoryInOrderMatch` |  Session |  `expectedTrajectory` |  Checks that all expected tools appear in order within the actual sequence, but allows extra tools between them. Programmatic scoring.  
`Builtin.TrajectoryAnyOrderMatch` |  Session |  `expectedTrajectory` |  Checks that all expected tools are present in the actual sequence, regardless of order. Extra tools are allowed. Programmatic scoring.  
  
###### Note

Custom evaluators also support ground truth fields through placeholders in their evaluation instructions. See Ground truth in custom evaluators for details.

The following table describes the ground truth fields.

Field | Type | Scope | Description  
---|---|---|---  
`expectedResponse` |  String |  Trace |  The expected agent response for a specific turn. Scoped to a trace using `traceId` in the reference input context.  
`assertions` |  List of strings |  Session |  Natural language statements that should be true about the agent’s behavior across the session.  
`expectedTrajectory` |  List of tool names |  Session |  The expected sequence of tool calls for the session.  
  
  * Ground truth fields are optional. If you omit them, evaluators fall back to their ground truth-free mode (for example, `Builtin.Correctness` still works without `expectedResponse` , it just evaluates based on context alone).

  * You can provide all ground truth fields in a single request. The service picks the relevant fields for each evaluator and reports `ignoredReferenceInputFields` in the response for any fields that were not used.

  * You don’t need to provide `expectedResponse` for every trace. Traces without ground truth are evaluated using the ground truth-free variant of the evaluator.


## Prerequisites

  * Python 3.10+

  * An agent deployed on AgentCore Runtime with observability enabled, or an agent built with a supported framework configured with [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p>) . Supported frameworks:

    * Strands Agents

    * LangGraph with `opentelemetry-instrumentation-langchain` or `openinference-instrumentation-langchain`

  * Transaction Search enabled in CloudWatch — see [Enable Transaction Search](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search-getting-started.html>)

  * AWS credentials configured with permissions for `bedrock-agentcore` , `bedrock-agentcore-control` , and `logs` (CloudWatch)


For instructions on downloading session spans, see [Getting started with on-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./getting-started-on-demand.html>).

### About the examples

The examples on this page use the sample agent from the [AgentCore Evaluations tutorials](<https://github.com/awslabs/amazon-bedrock-agentcore-samples/tree/main/01-features/06-observe-evaluate-optimize-your-agent/02-evaluate>) . The agent has two tools — `calculator` and `weather` — and is deployed on AgentCore Runtime with observability enabled.

The examples assume a two-turn session:

  1. **Turn 1:** "What is 15 + 27?" — agent uses the `calculator` tool and responds with the result.

  2. **Turn 2:** "What’s the weather?" — agent uses the `weather` tool and responds with the current weather.


Before running evaluations, invoke your agent and wait 2–5 minutes for CloudWatch to ingest the telemetry data.

The following constants are used throughout the examples on this page. Replace them with your own values:

```text
REGION       = "<region-code>"
AGENT_ID     = "my-agent-id"
SESSION_ID   = "my-session-id"
TRACE_ID_1   = "<trace-id-1>"   # Turn 1: "What is 15 + 27?"
TRACE_ID_2   = "<trace-id-2>"   # Turn 2: "What's the weather?"
```
## Correctness with expected response

`Builtin.Correctness` is a trace-level evaluator that measures how accurately the agent’s response matches an expected answer. When you provide `expectedResponse` , the evaluator compares the agent’s actual response against your ground truth using LLM-as-a-Judge scoring.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import EvaluationClient, ReferenceInputs

client = EvaluationClient(region_name=REGION)

# String form — matched against the last trace in the session
results = client.run(
    evaluator_ids=["Builtin.Correctness"],
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    reference_inputs=ReferenceInputs(
        expected_response="The weather is sunny",
    ),
)

for r in results:
    print(f"Trace: {r['context']['spanContext'].get('traceId', 'session')}")
    print(f"Score: {r['value']}, Label: {r['label']}")
```
 

To target a specific trace, pass `expected_response` as a dict mapping trace IDs to expected answers:

```text
results = client.run(
    evaluator_ids=["Builtin.Correctness"],
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    reference_inputs=ReferenceInputs(
        expected_response={
            TRACE_ID_1: "15 + 27 = 42",
            TRACE_ID_2: "The weather is sunny",
        },
    ),
)
```
AgentCore CLI
    

  1. 
```bash
# Expected response matched against the last trace
agentcore run eval \
  --agent AGENT_NAME \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.Correctness" \
  --expected-response "The weather is sunny"

# Target a specific trace
agentcore run eval \
  --agent AGENT_NAME \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.Correctness" \
  --trace-id TRACE_ID_1 \
  --expected-response "15 + 27 = 42"

# ARN mode — evaluate an agent outside the CLI project
agentcore run eval \
  --runtime-arn arn:aws:bedrock-agentcore:<region-code>:<account-id>:runtime/<agent-id> \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.Correctness" \
  --expected-response "The weather is sunny"
```
 


Starter Toolkit SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation, ReferenceInputs

eval_client = Evaluation(region=REGION)

# String form — matched against the last trace
results = eval_client.run(
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    evaluators=["Builtin.Correctness"],
    reference_inputs=ReferenceInputs(
        expected_response="The weather is sunny",
    ),
)

for r in results.get_successful_results():
    print(f"Score: {r.value:.2f}, Label: {r.label}")
```
 

To target a specific trace, pass a tuple of `(trace_id, expected_response)` :

```text
results = eval_client.run(
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    evaluators=["Builtin.Correctness"],
    reference_inputs=ReferenceInputs(
        expected_response=(TRACE_ID_1, "15 + 27 = 42"),
    ),
)
```
Starter Toolkit CLI
    

  1. 
```bash
# Expected response matched against the last trace
agentcore eval run \
  --agent-id AGENT_ID \
  --session-id SESSION_ID \
  --evaluator "Builtin.Correctness" \
  --expected-response "The weather is sunny"

# Target a specific trace
agentcore eval run \
  --agent-id AGENT_ID \
  --session-id SESSION_ID \
  --trace-id TRACE_ID_1 \
  --evaluator "Builtin.Correctness" \
  --expected-response "15 + 27 = 42"

# Save results to a file
agentcore eval run \
  --agent-id AGENT_ID \
  --session-id SESSION_ID \
  --evaluator "Builtin.Correctness" \
  --expected-response "The weather is sunny" \
  --output results.json
```
 


AWS SDK (boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore", region_name=REGION)

response = client.evaluate(
    evaluatorId="Builtin.Correctness",
    evaluationInput={"sessionSpans": session_spans_and_log_events},
    evaluationReferenceInputs=[
        {
            "context": {
                "spanContext": {
                    "sessionId": SESSION_ID,
                    "traceId": TRACE_ID_1
                }
            },
            "expectedResponse": {"text": "15 + 27 = 42"}
        },
        {
            "context": {
                "spanContext": {
                    "sessionId": SESSION_ID,
                    "traceId": TRACE_ID_2
                }
            },
            "expectedResponse": {"text": "The weather is sunny"}
        }
    ]
)

for result in response["evaluationResults"]:
    print(f"Score: {result['value']}, Label: {result['label']}")
```
 


## GoalSuccessRate with assertions

`Builtin.GoalSuccessRate` is a session-level evaluator that validates whether the agent’s behavior satisfies a set of natural language assertions. Assertions can check tool usage, response content, ordering of actions, or any other observable behavior across the entire conversation.

###### Note

The examples below use assertions that validate tool usage, but assertions are free-form natural language — you can use them to assert on any aspect of agent behavior, such as response tone, factual accuracy, safety compliance, or business logic.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import EvaluationClient, ReferenceInputs

client = EvaluationClient(region_name=REGION)

results = client.run(
    evaluator_ids=["Builtin.GoalSuccessRate"],
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    reference_inputs=ReferenceInputs(
        assertions=[
            "Agent used the calculator tool to compute the result",
            "Agent returned the correct numerical answer of 42",
            "Agent used the weather tool when asked about weather",
        ],
    ),
)

for r in results:
    print(f"Score: {r['value']}, Label: {r['label']}")
    print(f"Explanation: {r['explanation'][:200]}")
```
 


AgentCore CLI
    

  1. 
```bash
agentcore run eval \
  --agent AGENT_NAME \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.GoalSuccessRate" \
  --assertion "Agent used the calculator tool to compute the result" \
  --assertion "Agent returned the correct numerical answer of 42" \
  --assertion "Agent used the weather tool when asked about weather"

# ARN mode — evaluate an agent outside the CLI project
agentcore run eval \
  --runtime-arn arn:aws:bedrock-agentcore:<region-code>:<account-id>:runtime/<agent-id> \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.GoalSuccessRate" \
  --assertion "Agent used the calculator tool to compute the result" \
  --assertion "Agent returned the correct numerical answer of 42"
```
 


Starter Toolkit SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation, ReferenceInputs

eval_client = Evaluation(region=REGION)

results = eval_client.run(
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    evaluators=["Builtin.GoalSuccessRate"],
    reference_inputs=ReferenceInputs(
        assertions=[
            "Agent used the calculator tool to compute the result",
            "Agent returned the correct numerical answer of 42",
            "Agent used the weather tool when asked about weather",
        ],
    ),
)

for r in results.get_successful_results():
    print(f"Score: {r.value:.2f}, Label: {r.label}")
```
 


Starter Toolkit CLI
    

  1. 
```bash
agentcore eval run \
  --agent-id AGENT_ID \
  --session-id SESSION_ID \
  --evaluator "Builtin.GoalSuccessRate" \
  --assertion "Agent used the calculator tool to compute the result" \
  --assertion "Agent returned the correct numerical answer of 42" \
  --assertion "Agent used the weather tool when asked about weather"
```
 


AWS SDK (boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore", region_name=REGION)

response = client.evaluate(
    evaluatorId="Builtin.GoalSuccessRate",
    evaluationInput={"sessionSpans": session_spans_and_log_events},
    evaluationReferenceInputs=[
        {
            "context": {
                "spanContext": {
                    "sessionId": SESSION_ID
                }
            },
            "assertions": [
                {"text": "Agent used the calculator tool to compute the result"},
                {"text": "Agent returned the correct numerical answer of 42"},
                {"text": "Agent used the weather tool when asked about weather"}
            ]
        }
    ]
)

for result in response["evaluationResults"]:
    print(f"Score: {result['value']}, Label: {result['label']}")
```
 


## Trajectory matching with expected trajectory

The trajectory evaluators compare the agent’s actual tool call sequence against an expected sequence of tool names. Three variants are available, each with different matching strictness. All three are session-level evaluators and use programmatic scoring (no LLM calls, so token usage is zero).

Evaluator | Matching rule | Example  
---|---|---  
`Builtin.TrajectoryExactOrderMatch` |  Actual must match expected exactly — same tools, same order, no extras |  Expected: `[calculator, weather]` , Actual: `[calculator, weather]` → Pass. Actual: `[calculator, weather, calculator]` → Fail.  
`Builtin.TrajectoryInOrderMatch` |  Expected tools must appear in order, but extra tools are allowed between them |  Expected: `[calculator, weather]` , Actual: `[calculator, some_tool, weather]` → Pass.  
`Builtin.TrajectoryAnyOrderMatch` |  All expected tools must be present, order doesn’t matter, extras allowed |  Expected: `[calculator, weather]` , Actual: `[weather, calculator]` → Pass.  
  
###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import EvaluationClient, ReferenceInputs

client = EvaluationClient(region_name=REGION)

results = client.run(
    evaluator_ids=[
        "Builtin.TrajectoryExactOrderMatch",
        "Builtin.TrajectoryInOrderMatch",
        "Builtin.TrajectoryAnyOrderMatch",
    ],
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    reference_inputs=ReferenceInputs(
        expected_trajectory=["calculator", "weather"],
    ),
)

for r in results:
    print(f"{r['evaluatorId']}: {r['value']} ({r['label']})")
    print(f"  {r['explanation'][:150]}")
```
 


AgentCore CLI
    

  1. Tool names are passed as a comma-separated list:

```bash
agentcore run eval \
  --agent AGENT_NAME \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.TrajectoryExactOrderMatch" \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.TrajectoryInOrderMatch" \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.TrajectoryAnyOrderMatch" \
  --expected-trajectory "calculator,weather"

# ARN mode — evaluate an agent outside the CLI project
agentcore run eval \
  --runtime-arn arn:aws:bedrock-agentcore:<region-code>:<account-id>:runtime/<agent-id> \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.TrajectoryExactOrderMatch" \
  --expected-trajectory "calculator,weather"
```
Starter Toolkit SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation, ReferenceInputs

eval_client = Evaluation(region=REGION)

results = eval_client.run(
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    evaluators=[
        "Builtin.TrajectoryExactOrderMatch",
        "Builtin.TrajectoryInOrderMatch",
        "Builtin.TrajectoryAnyOrderMatch",
    ],
    reference_inputs=ReferenceInputs(
        expected_trajectory=["calculator", "weather"],
    ),
)

for r in results.get_successful_results():
    print(f"{r.evaluator_name}: {r.value:.2f} ({r.label})")
```
 


Starter Toolkit CLI
    

  1. Tool names are passed as a comma-separated list:

```bash
agentcore eval run \
  --agent-id AGENT_ID \
  --session-id SESSION_ID \
  --evaluator "Builtin.TrajectoryExactOrderMatch" \
  --evaluator "Builtin.TrajectoryInOrderMatch" \
  --evaluator "Builtin.TrajectoryAnyOrderMatch" \
  --expected-trajectory "calculator,weather"
```
AWS SDK (boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore", region_name=REGION)

for evaluator in [
    "Builtin.TrajectoryExactOrderMatch",
    "Builtin.TrajectoryInOrderMatch",
    "Builtin.TrajectoryAnyOrderMatch",
]:
    response = client.evaluate(
        evaluatorId=evaluator,
        evaluationInput={"sessionSpans": session_spans_and_log_events},
        evaluationReferenceInputs=[
            {
                "context": {
                    "spanContext": {
                        "sessionId": SESSION_ID
                    }
                },
                "expectedTrajectory": {
                    "toolNames": ["calculator", "weather"]
                }
            }
        ]
    )

    for result in response["evaluationResults"]:
        print(f"{result['evaluatorId']}: {result['value']} ({result['label']})")
```
 


## Combining all ground truth fields in one request

You can pass all ground truth fields together in a single evaluation call. The service routes each field to the appropriate evaluator and ignores fields that a given evaluator doesn’t use. This means you can construct your reference inputs once and reuse them across different evaluators without modifying the payload.

###### Example

AgentCore SDK
    

  1. 
```python
from bedrock_agentcore.evaluation import EvaluationClient, ReferenceInputs

client = EvaluationClient(region_name=REGION)

results = client.run(
    evaluator_ids=[
        "Builtin.Correctness",
        "Builtin.GoalSuccessRate",
        "Builtin.TrajectoryExactOrderMatch",
        "Builtin.TrajectoryInOrderMatch",
        "Builtin.TrajectoryAnyOrderMatch",
    ],
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    reference_inputs=ReferenceInputs(
        expected_response="The weather is sunny",
        assertions=[
            "Agent used the calculator tool for math",
            "Agent used the weather tool when asked about weather",
        ],
        expected_trajectory=["calculator", "weather"],
    ),
)

for r in results:
    ignored = r.get("ignoredReferenceInputFields", [])
    print(f"{r['evaluatorId']}: {r['value']} ({r['label']})")
    if ignored:
        print(f"  Ignored fields: {ignored}")
```
 


AgentCore CLI
    

  1. 
```bash
agentcore run eval \
  --agent AGENT_NAME \
  --session-id SESSION_ID \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.Correctness" \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.GoalSuccessRate" \
  --evaluator-arn "arn:aws:bedrock-agentcore:::evaluator/Builtin.TrajectoryExactOrderMatch" \
  --assertion "Agent used the calculator tool for math" \
  --assertion "Agent used the weather tool when asked about weather" \
  --expected-trajectory "calculator,weather" \
  --expected-response "The weather is sunny" \
  --output results.json
```
 


Starter Toolkit SDK
    

  1. 
```python
from bedrock_agentcore_starter_toolkit import Evaluation, ReferenceInputs

eval_client = Evaluation(region=REGION)

results = eval_client.run(
    agent_id=AGENT_ID,
    session_id=SESSION_ID,
    evaluators=[
        "Builtin.Correctness",
        "Builtin.GoalSuccessRate",
        "Builtin.TrajectoryExactOrderMatch",
        "Builtin.TrajectoryInOrderMatch",
        "Builtin.TrajectoryAnyOrderMatch",
    ],
    reference_inputs=ReferenceInputs(
        expected_response="The weather is sunny",
        assertions=[
            "Agent used the calculator tool for math",
            "Agent used the weather tool when asked about weather",
        ],
        expected_trajectory=["calculator", "weather"],
    ),
)

for r in results.get_successful_results():
    print(f"{r.evaluator_name}: {r.value:.2f} ({r.label})")
```
 


AWS SDK (boto3)
    

  1. 
```python
import boto3

client = boto3.client("bedrock-agentcore", region_name=REGION)

reference_inputs = [
    {
        "context": {
            "spanContext": {"sessionId": SESSION_ID}
        },
        "assertions": [
            {"text": "Agent used the calculator tool for math"},
            {"text": "Agent used the weather tool when asked about weather"}
        ],
        "expectedTrajectory": {
            "toolNames": ["calculator", "weather"]
        }
    },
    {
        "context": {
            "spanContext": {
                "sessionId": SESSION_ID,
                "traceId": TRACE_ID_2
            }
        },
        "expectedResponse": {"text": "The weather is sunny"}
    }
]

for evaluator in ["Builtin.Correctness", "Builtin.GoalSuccessRate",
                   "Builtin.TrajectoryExactOrderMatch"]:
    response = client.evaluate(
        evaluatorId=evaluator,
        evaluationInput={"sessionSpans": session_spans_and_log_events},
        evaluationReferenceInputs=reference_inputs
    )
    for result in response["evaluationResults"]:
        ignored = result.get("ignoredReferenceInputFields", [])
        print(f"{result['evaluatorId']}: {result['value']} ({result['label']})")
        if ignored:
            print(f"  Ignored fields: {ignored}")
```
 


## Understanding ignored reference input fields

When you provide ground truth fields that an evaluator doesn’t use, the response includes an `ignoredReferenceInputFields` array listing the unused fields. This is informational, not an error — the evaluation still completes successfully.

For example, if you call `Builtin.Helpfulness` with `expectedResponse` provided, the evaluator ignores the ground truth (Helpfulness doesn’t use it) and returns:

```json
{
  "evaluatorId": "Builtin.Helpfulness",
  "value": 0.83,
  "label": "Very Helpful",
  "explanation": "...",
  "ignoredReferenceInputFields": ["expectedResponse"]
}
```
This behavior is by design — it allows you to construct a single set of reference inputs and use them across multiple evaluators without adjusting the payload for each one.

## Ground truth in custom evaluators

Custom evaluators can use ground truth fields through placeholders in their evaluation instructions. When you create a custom evaluator, you can reference the following placeholders:

  * Session-level custom evaluators: `{context}` , `{available_tools}` , `{actual_tool_trajectory}` , `{expected_tool_trajectory}` , `{assertions}`

  * Trace-level custom evaluators: `{context}` , `{assistant_turn}` , `{expected_response}`


For example, a custom trace-level evaluator that checks response similarity might use:

```text
Compare the agent's response with the expected response.
Agent response: {assistant_turn}
Expected response: {expected_response}
Rate how closely the agent's response matches the expected response on a scale of 0 to 1.
```
When this evaluator is called with `expectedResponse` in the reference inputs, the service substitutes the placeholder with the actual ground truth value before scoring.

For details on creating custom evaluators, see [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>).

###### Note

Custom evaluators that use ground truth placeholders ( `{assertions}` , `{expected_response}` , `{expected_tool_trajectory}` ) cannot be used in online evaluation configurations, because online evaluations monitor live production traffic where ground truth values are not available.

