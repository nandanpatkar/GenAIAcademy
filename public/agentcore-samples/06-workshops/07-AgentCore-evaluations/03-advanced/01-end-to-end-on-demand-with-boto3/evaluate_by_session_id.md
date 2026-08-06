# AgentCore Evaluation - Example Usage

This notebook demonstrates helps you evaluate any Sessionid from AgentCore Observability that you want to evaluate.

## Setup

```python
import os
from utils import EvaluationClient

# AWS Credentials - Add your credentials here
os.environ["AWS_DEFAULT_REGION"] = "us-east-1"
# os.environ['AWS_ACCESS_KEY_ID'] = ''
# os.environ['AWS_SECRET_ACCESS_KEY'] = ''
# os.environ['AWS_SESSION_TOKEN'] = ''
```

## Configuration

```python
# AWS Configuration
REGION = "us-east-1"
AGENT_ID = "strands_claude_eval-YOUR_UNIQUE_ID"
SESSION_ID = "<YOUR_SESSION_ID_HERE>"  # pass the session id directly to evaluate

metadata = {
    "experiment": "evaluation_test",
    "description": "Testing all evaluator scopes",
}
```

## Initialize Client

```python
# Initialize evaluation client
eval_client = EvaluationClient(
    region=REGION,
)
```

## Run Evaluations

Evaluates session across all evaluator types and automatically generates dashboard.

```python
# Evaluator Groups
FLEXIBLE_EVALUATORS = [
    "Builtin.Correctness",
    "Builtin.Faithfulness",
    "Builtin.Helpfulness",
    "Builtin.ResponseRelevance",
    "Builtin.Conciseness",
    "Builtin.Coherence",
    "Builtin.InstructionFollowing",
    "Builtin.Refusal",
    "Builtin.Harmfulness",
    "Builtin.Stereotyping",
]

SESSION_ONLY_EVALUATORS = ["Builtin.GoalSuccessRate"]

SPAN_ONLY_EVALUATORS = [
    "Builtin.ToolSelectionAccuracy",
    "Builtin.ToolParameterAccuracy",
]
```

```python
test_groups = [
    {
        "name": "Flexible Evaluators (session scope)",
        "evaluators": FLEXIBLE_EVALUATORS,
        "scope": "session",
    },
    {
        "name": "Session-Only Evaluators",
        "evaluators": SESSION_ONLY_EVALUATORS,
        "scope": "session",
    },
    {
        "name": "Span-Only Evaluators",
        "evaluators": SPAN_ONLY_EVALUATORS,
        "scope": "span",
    },
]

all_results = []

for group in test_groups:
    try:
        results = eval_client.evaluate_session(
            session_id=SESSION_ID,
            evaluator_ids=group["evaluators"],
            agent_id=AGENT_ID,
            region=REGION,
            scope=group["scope"],
            auto_save_output=True,
            auto_create_dashboard=True,
            metadata=metadata,
        )

        print(f"\nCompleted: {len(results.results)} evaluations")
        for r in results.results:
            print(f"  {r.evaluator_name}: {r.value} - {r.label}")
            all_results.append(r)

    except Exception as e:
        print(f"\nError: {e}")
```

# End
