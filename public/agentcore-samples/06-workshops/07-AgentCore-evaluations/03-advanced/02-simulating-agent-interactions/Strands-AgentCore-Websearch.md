# AgentCore Online Evaluation with Actor Simulator

**Pipeline:** AgentCore Online Eval Setup → DatasetGenerator → ActorSimulator → Agent Invocation → AgentCore Evaluates via CloudWatch

This notebook:
1. Loads configuration from `eval_config.py`
2. Sets up AgentCore online evaluation with builtin metrics
3. Generates test cases using DatasetGenerator
4. Runs actor simulator to invoke agent with multi-turn conversations
5. AgentCore automatically captures and evaluates traces via CloudWatch

## 1. Imports and Configuration

```python
import boto3
import json
import os
from strands_evals import ActorSimulator, Case
from strands_evals.generators import DatasetGenerator
from strands_eval_config import *

os.environ["AWS_DEFAULT_REGION"] = AWS_REGION
print("Configuration loaded from eval_config.py")
```

## 2. AgentCore Online Evaluation Setup

```python
evaluation_client = boto3.client(
    "agentcore-evaluation-controlplane",
    region_name=AWS_REGION,
)

create_config_response = evaluation_client.create_online_evaluation_config(
    onlineEvaluationConfigName=EVAL_CONFIG_NAME + "_3",
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
    evaluators=[{"evaluatorId": evaluator_id} for evaluator_id in EVALUATORS],
    evaluationExecutionRoleArn=EVALUATION_ROLE_ARN,
    enableOnCreate=True,
)

config_id = create_config_response["onlineEvaluationConfigId"]
config_details = evaluation_client.get_online_evaluation_config(onlineEvaluationConfigId=config_id)

print(f"Created config: {config_id}")
print(f"Status: {config_details['status']}")
```

## 3. AgentCore Runtime Client

```python
agentcore_client = boto3.client("bedrock-agentcore", region_name=AWS_REGION)


def invoke_agentcore(user_message):
    boto3_response = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        qualifier=QUALIFIER,
        payload=json.dumps({"prompt": user_message}),
    )

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

## 4. Generate Test Cases

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

## 5. Preview Test Cases

```python
for i, case in enumerate(dataset.cases, 1):
    print(f"\nCase {i}: {case.input}")
    print(f"Expected: {case.expected_output}")
```

## 6. Define Task Function

```python
def task_function(case: Case) -> str:
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
        agent_response = invoke_agentcore(user_message)
        final_response = agent_response
        print(f"Agent: {agent_response[:200]}...")

        user_result = user_sim.act(agent_response)
        user_message = str(user_result.structured_output.message)
        turn += 1

    return final_response
```

## 7. Run Evaluations

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

## 8. View Results

```python
import pandas as pd

df = pd.DataFrame(results)
df
```

# End
