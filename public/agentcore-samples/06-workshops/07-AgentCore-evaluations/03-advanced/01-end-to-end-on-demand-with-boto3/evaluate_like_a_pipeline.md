# AgentCore Online Evaluation

Agent invocation and evaluation workflow for programmatic testing.

## Imports

```python
import boto3
from IPython.display import Markdown, display
from utils import (
    EvaluationClient,
    generate_session_id,
    invoke_and_evaluate,
)

# Set your AWS Credentials

# os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'
# os.environ['AWS_ACCESS_KEY_ID'] = ''
# os.environ['AWS_SECRET_ACCESS_KEY'] = ''
# os.environ['AWS_SESSION_TOKEN'] = ''
```

## Configuration

```python
AGENT_ID = "strands_claude_eval"
AGENT_ARN = f"arn:aws:bedrock-agentcore:us-east-1:<YOUR_ACCOUNT_ID>:runtime/{AGENT_ID}"
REGION = "us-east-1"
```

## Experiment Setup

```python
EXPERIMENT_NAME = "my_experiment_v1"

# Set to None to run ALL 13 evaluators (comprehensive mode)
# Or set to a specific list like FLEXIBLE_EVALUATORS to run only those
EXPERIMENT_EVALUATORS = None  # Runs all 13 evaluators

EXPERIMENT_SCOPE = "session"  # Ignored when EXPERIMENT_EVALUATORS = None
EXPERIMENT_DELAY = 120  # atleast 120 seconds for the traces to hit AgentCore observability

planned_session = generate_session_id()

# metadata is optional but you would appreciate it for tracking
EXPERIMENT_PROMPTS = [
    {"prompt": "What is 2 + 2?", "session_id": "", "metadata": {"category": "math"}},
    {
        "prompt": "What is the capital of France?",
        "session_id": "",
        "metadata": {"category": "geography"},
    },
    {
        "prompt": "Tell me about quantum physics",
        "session_id": "",
        "metadata": {"category": "science"},
    },
    {
        "prompt": "Hello, can you help me with math?",
        "session_id": planned_session,
        "metadata": {"turn": 1},
    },
    {
        "prompt": "What is 15 * 23?",
        "session_id": planned_session,
        "metadata": {"turn": 2},
    },
]
```

## Initialize Clients

```python
# Initialize AgentCore client
agentcore_client = boto3.client("bedrock-agentcore", region_name=REGION)

# Initialize Evaluation client
eval_client = EvaluationClient(
    region=REGION,
)
```

## Run Experiment

```python
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
batch_results = []

eval_count = len(EXPERIMENT_EVALUATORS) if EXPERIMENT_EVALUATORS else 13
print(f"Experiment: {EXPERIMENT_NAME} | Prompts: {len(EXPERIMENT_PROMPTS)} | Evaluators: {eval_count}\n")

for i, config in enumerate(EXPERIMENT_PROMPTS, 1):
    prompt_text = config["prompt"]
    session_id = config.get("session_id", "")
    metadata = config.get("metadata", {})

    try:
        returned_session_id, content, results = invoke_and_evaluate(
            agentcore_client=agentcore_client,
            eval_client=eval_client,
            agent_arn=AGENT_ARN,
            agent_id=AGENT_ID,
            region=REGION,
            prompt=prompt_text,
            experiment_name=EXPERIMENT_NAME,
            session_id=session_id,
            metadata=metadata,
            evaluators=EXPERIMENT_EVALUATORS,
            scope=EXPERIMENT_SCOPE,
            delay=EXPERIMENT_DELAY,
            flexible_evaluators=FLEXIBLE_EVALUATORS,
            session_only_evaluators=SESSION_ONLY_EVALUATORS,
            span_only_evaluators=SPAN_ONLY_EVALUATORS,
        )

        if content:
            display(Markdown(str(content[0])))

        batch_results.append(
            {
                "session_id": returned_session_id,
                "prompt": prompt_text,
                "results": results,
            }
        )

    except Exception as e:
        print(f"Error: {e}\n")
        batch_results.append({"prompt": prompt_text, "error": str(e)})
```
