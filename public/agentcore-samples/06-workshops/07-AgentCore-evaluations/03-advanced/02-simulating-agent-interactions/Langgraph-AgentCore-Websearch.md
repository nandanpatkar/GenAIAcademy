# AgentCore Online Evaluation with Actor Simulator - Web Search Agent

**Pipeline:** AgentCore Online Eval Setup → DatasetGenerator → ActorSimulator → Agent Invocation → AgentCore Evaluates via CloudWatch

This notebook:
1. Loads configuration from `eval_config.py`
2. Creates a custom LLM-as-a-Judge evaluator for web search quality
3. Sets up AgentCore online evaluation with builtin + custom metrics
4. Generates test cases using DatasetGenerator for web search scenarios
5. Runs actor simulator to invoke agent with multi-turn conversations
6. AgentCore automatically captures and evaluates traces via CloudWatch

## 1. Imports and Configuration

```python
import boto3
import json
import os
import uuid
from strands_evals import ActorSimulator, Case
from strands_evals.generators import DatasetGenerator
from lg_eval_config import *

os.environ["AWS_DEFAULT_REGION"] = AWS_REGION
print("Configuration loaded from eval_config.py")
```

## 2. Create Custom Evaluator (LLM-as-a-Judge)

Create a custom evaluator to assess web search quality, including:
- Search result relevance
- Information synthesis quality
- Source attribution
- Information freshness

```python
evaluation_client = boto3.client(
    "agentcore-evaluation-controlplane",
    region_name=AWS_REGION,
)

# Create custom evaluator
try:
    custom_evaluator_response = evaluation_client.create_evaluator(
        evaluatorName=CUSTOM_EVALUATOR_NAME,
        level="TRACE",
        evaluatorConfig=CUSTOM_EVALUATOR_CONFIG,
    )
    print(f"✓ Created custom evaluator: {CUSTOM_EVALUATOR_NAME}")
    print(json.dumps(custom_evaluator_response, indent=2, default=str))
    custom_evaluator_id = custom_evaluator_response["evaluatorId"]
except Exception as e:
    if "ResourceConflictException" in str(e) or "already exists" in str(e):
        print(f"⚠ Custom evaluator '{CUSTOM_EVALUATOR_NAME}' already exists, using existing one")
        # List evaluators to get the existing ID
        list_response = evaluation_client.list_evaluators()
        for evaluator in list_response.get("evaluators", []):
            if evaluator["evaluatorName"] == CUSTOM_EVALUATOR_NAME:
                custom_evaluator_id = evaluator["evaluatorId"]
                print(f"✓ Found existing evaluator ID: {custom_evaluator_id}")
                break
    else:
        print(f"✗ Error creating custom evaluator: {e}")
        raise

create_config_response = evaluation_client.create_online_evaluation_config(
    onlineEvaluationConfigName="custom_web_search_quality_evaluator",
    description="Integration test config",
    rule={"samplingConfig": {"samplingPercentage": 100.0}},
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": [LOG_GROUP_NAME],
            "serviceNames": [SERVICE_NAME],
        }
    },
    evaluators=[{"evaluatorId": custom_evaluator_id}],
    evaluationExecutionRoleArn=EVALUATION_ROLE_ARN,
    enableOnCreate=True,
)
```

## 3. AgentCore Online Evaluation Setup

Configure online evaluation with both builtin and custom evaluators.

```python
# Combine builtin evaluators with custom evaluator
all_evaluators = [{"evaluatorId": evaluator_id} for evaluator_id in EVALUATORS]

print(f"Total evaluators: {len(all_evaluators)} (13 builtin + 1 custom)")

create_config_response = evaluation_client.create_online_evaluation_config(
    onlineEvaluationConfigName=EVAL_CONFIG_NAME,
    description=EVAL_DESCRIPTION,
    rule={
        "samplingConfig": {"samplingPercentage": SAMPLING_PERCENTAGE},
        "sessionConfig": {"sessionTimeoutMinutes": SESSION_TIMEOUT_MINUTES},
    },
    dataSourceConfig={
        "cloudWatchLogs": {
            "logGroupNames": [LOG_GROUP_NAME],
            "serviceNames": [SERVICE_NAME],
        }
    },
    evaluators=all_evaluators,
    evaluationExecutionRoleArn=EVALUATION_ROLE_ARN,
    enableOnCreate=True,
)

config_id = create_config_response["onlineEvaluationConfigId"]
config_details = evaluation_client.get_online_evaluation_config(onlineEvaluationConfigId=config_id)

print(f"\n✓ Created config: {config_id}")
print(f"Status: {config_details['status']}")
```

## 4. AgentCore Runtime Client

```python
agentcore_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)


def invoke_agentcore(user_message, session_id=None):
    """
    Invoke agent with session management.

    Args:
        user_message: The prompt to send to the agent
        session_id: Optional session ID for maintaining conversation context

    Returns:
        Response text from the agent
    """
    # Build the request parameters
    request_params = {
        "agentRuntimeArn": AGENT_ARN,
        "qualifier": QUALIFIER,
        "payload": json.dumps({"prompt": user_message}),
    }

    # Add session_id if provided
    if session_id is not None:
        request_params["runtimeSessionId"] = session_id

    boto3_response = agentcore_client.invoke_agent_runtime(**request_params)

    content = []
    if "text/event-stream" in boto3_response.get("contentType", ""):
        for line in boto3_response["response"].iter_lines(chunk_size=1):
            if line:
                line = line.decode("utf-8")
                if line.startswith("data: "):
                    line = line[6:]
                    content.append(line)
    else:
        events = []
        for event in boto3_response.get("response", []):
            events.append(event)
        if events:
            content.append(json.loads(events[0].decode("utf-8")))

    return "\n".join(str(c) for c in content)
```

## 5. Generate Test Cases

```python
generator = DatasetGenerator[str, str](str, str)

task_description = f"""
Task: {AGENT_CAPABILITIES}
Limitations: {AGENT_LIMITATIONS}
Available tools: {", ".join(AGENT_TOOLS)}
Complexity: {AGENT_COMPLEXITY}
"""

dataset = await generator.from_scratch_async(
    topics=AGENT_TOPICS, task_description=task_description, num_cases=NUM_TEST_CASES
)

print(f"Generated {len(dataset.cases)} test cases")
```

## 6. Preview Test Cases

```python
for i, case in enumerate(dataset.cases, 1):
    print(f"\nCase {i}: {case.input}")
    print(f"Expected: {case.expected_output}")
```

## 7. Define Task Function

```python
def task_function(case: Case) -> str:
    # Create a new session for this test case
    session_id = str(uuid.uuid4())
    print(f"\n🆕 Started new session: {session_id}")

    user_sim = ActorSimulator.from_case_for_user_simulator(case=case, max_turns=MAX_TURNS)

    user_message = case.input
    final_response = ""

    print(f"\n{'=' * 80}")
    print(f"Test Case: {case.input}")
    print(f"Expected: {case.expected_output}")
    print(f"{'=' * 80}")

    turn = 1
    while user_sim.has_next():
        print(f"\nTurn {turn}: {user_message}")
        agent_response = invoke_agentcore(user_message, session_id=session_id)
        final_response = agent_response
        print(f"Agent: {agent_response[:200]}...")

        user_result = user_sim.act(agent_response)
        user_message = str(user_result.structured_output.message)
        turn += 1

    print(f"🔚 Ended session: {session_id}")

    return final_response
```

## 8. Run Evaluations

```python
results = []

for i, case in enumerate(dataset.cases, 1):
    print(f"\n\n{'#' * 80}")
    print(f"# Running Test Case {i}/{len(dataset.cases)}")
    print(f"{'#' * 80}")

    try:
        response = task_function(case)
        results.append(
            {
                "case_number": i,
                "input": case.input,
                "expected": case.expected_output,
                "actual": response,
                "status": "success",
            }
        )
    except Exception as e:
        print(f"ERROR: {e}")
        results.append(
            {
                "case_number": i,
                "input": case.input,
                "expected": case.expected_output,
                "actual": str(e),
                "status": "error",
            }
        )

print(f"\n\nCompleted {len(results)} test cases")
print(f"Successful: {sum(1 for r in results if r['status'] == 'success')}")
print(f"Errors: {sum(1 for r in results if r['status'] == 'error')}")
```

## 9. View Results

```python
import pandas as pd

df = pd.DataFrame(results)
df
```

## Summary

This evaluation tested your web search agent with:

**14 Total Evaluators:**
- 13 Builtin evaluators (Correctness, Faithfulness, Helpfulness, Relevance, Conciseness, Coherence, InstructionFollowing, Refusal, Harmfulness, Stereotyping, GoalSuccessRate, ToolSelectionAccuracy, ToolParameterAccuracy)
- 1 Custom LLM-as-a-Judge evaluator (Web Search Quality)

All traces and evaluations are captured in CloudWatch and available in the AgentCore dashboard.

# End
