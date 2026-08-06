# On-demand dataset runner - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-on-demand.html

---

# On-demand dataset runner

The `OnDemandEvaluationDatasetRunner` orchestrates the entire evaluation lifecycle client-side: invoke the agent, wait for telemetry ingestion, collect spans from CloudWatch, and call the Evaluate API, all in a single `run()` call.

Use the on-demand runner for dev-time iteration, CI/CD pipelines, and small datasets where you need per-scenario, per-evaluator detail immediately in the response.

###### Note

The on-demand runner supports all AgentCore evaluators, including all built-in evaluators across session, trace, and tool-call levels, as well as custom evaluators. The runner automatically handles level-aware request construction, batching, and ground truth mapping for whichever evaluators you configure.

## How it works

The runner processes scenarios in three phases:

  1. **Invoke:** All scenarios run concurrently using a thread pool. Each scenario gets a unique session ID, and turns within a scenario execute sequentially to maintain conversation context.

  2. **Wait:** A configurable delay (default: 180 seconds) allows CloudWatch to ingest the telemetry data. This delay is paid once, not per scenario.

  3. **Evaluate:** Spans are collected from CloudWatch and evaluation requests are built for each evaluator. Ground truth fields from the dataset (`expected_response`, `assertions`, `expected_trajectory`) are automatically mapped to the correct API reference inputs.


## Agent invoker

The runner requires an agent invoker, a callable that invokes your agent for a single turn. The invoker is framework-agnostic: you can call your agent via boto3 `invoke_agent_runtime`, a direct function call, HTTP request, or any other method.

```python
import json
import boto3
from bedrock_agentcore.evaluation import AgentInvokerInput, AgentInvokerOutput

REGION       = "<region-code>"
AGENT_ARN    = "arn:aws:bedrock-agentcore:<region-code>:<account-id>:runtime/<agent-id>"
LOG_GROUP    = "/aws/bedrock-agentcore/runtimes/<agent-id>-DEFAULT"

agentcore_client = boto3.client("bedrock-agentcore", region_name=REGION)

def agent_invoker(invoker_input: AgentInvokerInput) -> AgentInvokerOutput:
    payload = invoker_input.payload
    if isinstance(payload, str):
        payload = json.dumps({"prompt": payload}).encode()
    elif isinstance(payload, dict):
        payload = json.dumps(payload).encode()

    print(f"[{invoker_input.session_id}] > sending payload: {payload.decode()}")
    response = agentcore_client.invoke_agent_runtime(
        agentRuntimeArn=AGENT_ARN,
        runtimeSessionId=invoker_input.session_id,
        payload=payload,
    )
    response_body = response["response"].read()
    print(f"[{invoker_input.session_id}] < received response: {response_body.decode()}")
    return AgentInvokerOutput(agent_output=json.loads(response_body))
```
Field | Type | Description  
---|---|---  
`AgentInvokerInput.payload` |  `str` or `dict` |  The turn input from the dataset.  
`AgentInvokerInput.session_id` |  `str` |  Stable across all turns in a scenario. Pass this to your agent to maintain conversation context.  
`AgentInvokerOutput.agent_output` |  `Any` |  The agent’s response.  
  
## Example

The following example loads a dataset from a JSON file and runs the on-demand evaluation. For the dataset format, see [Dataset schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-schema.html>).

```python
from bedrock_agentcore.evaluation import (
    OnDemandEvaluationDatasetRunner,
    EvaluationRunConfig,
    EvaluatorConfig,
    FileDatasetProvider,
    CloudWatchAgentSpanCollector,
)

# Load dataset from a local file (see Dataset schema for format)
dataset = FileDatasetProvider("dataset.json").get_dataset()

# Or load from the Dataset Management service
from bedrock_agentcore.evaluation import DatasetClient, DatasetManagementServiceProvider
ds_client = DatasetClient(region_name=REGION)
dataset = DatasetManagementServiceProvider(dataset_id="my-dataset-id", client=ds_client).get_dataset()

# Create span collector
span_collector = CloudWatchAgentSpanCollector(
    log_group_name=LOG_GROUP,
    region=REGION,
)

# Configure evaluators
config = EvaluationRunConfig(
    evaluator_config=EvaluatorConfig(
        evaluator_ids=[
            "Builtin.GoalSuccessRate",
            "Builtin.TrajectoryExactOrderMatch",
            "Builtin.Correctness",
            "Builtin.Helpfulness",
        ],
    ),
    evaluation_delay_seconds=180,
    max_concurrent_scenarios=5,
)

# Run
runner = OnDemandEvaluationDatasetRunner(region=REGION)
result = runner.run(
    agent_invoker=agent_invoker,
    dataset=dataset,
    span_collector=span_collector,
    config=config,
)

print(f"Completed: {len(result.scenario_results)} scenario(s)")
```
Process results:

```python
for scenario in result.scenario_results:
    print(f"\nScenario: {scenario.scenario_id} ({scenario.status})")
    if scenario.error:
        print(f"  Error: {scenario.error}")
        continue
    for evaluator in scenario.evaluator_results:
        print(f"  {evaluator.evaluator_id}:")
        for r in evaluator.results:
            print(f"    Score: {r.get('value')}, Label: {r.get('label')}")
            ignored = r.get("ignoredReferenceInputFields", [])
            if ignored:
                print(f"    Ignored fields: {ignored}")
```
To save results to a file:

```text
with open("results.json", "w") as f:
    f.write(result.model_dump_json(indent=2))
```
## Configuration reference

**Span collector**

An `AgentSpanCollector` that retrieves telemetry spans after agent invocation. The SDK ships `CloudWatchAgentSpanCollector`:

```python
from bedrock_agentcore.evaluation import CloudWatchAgentSpanCollector

span_collector = CloudWatchAgentSpanCollector(
    log_group_name="/aws/bedrock-agentcore/runtimes/<agent-id>-DEFAULT",
    region=REGION,
)
```
The collector queries two CloudWatch log groups (`aws/spans` for structural spans and the agent’s log group for conversation content), polls until spans appear, and returns them as a flat list.

**Evaluation config**

```python
from bedrock_agentcore.evaluation import EvaluationRunConfig, EvaluatorConfig

config = EvaluationRunConfig(
    evaluator_config=EvaluatorConfig(
        evaluator_ids=["Builtin.Correctness", "Builtin.GoalSuccessRate"],
    ),
    evaluation_delay_seconds=180,  # Wait for CloudWatch ingestion (default: 180)
    max_concurrent_scenarios=5,    # Thread pool size (default: 5)
    simulation_config=None,        # Set SimulationConfig for simulated scenarios
)
```
Field | Default | Description  
---|---|---  
`evaluator_config.evaluator_ids` |  — |  List of evaluator IDs (built-in names or custom evaluator IDs).  
`evaluation_delay_seconds` |  180 |  Seconds to wait after invocation for CloudWatch to ingest spans. Set to 0 if using a non-CloudWatch collector.  
`max_concurrent_scenarios` |  5 |  Maximum number of scenarios to invoke and evaluate in parallel.  
`simulation_config` |  None |  Configuration for simulated scenarios. Set `SimulationConfig(model_id="…​")` when the dataset contains `SimulatedScenario` instances. See [User simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./user-simulation.html>).  
  
## Result structure

The runner returns an `EvaluationResult` with the following structure:

```text
EvaluationResult
  └── scenario_results: List[ScenarioResult]
        ├── scenario_id: str
        ├── session_id: str
        ├── status: "COMPLETED" | "FAILED"
        ├── error: Optional[str]
        └── evaluator_results: List[EvaluatorResult]
              ├── evaluator_id: str
              └── results: List[Dict]   # Raw API responses
```
Each entry in `results` is a raw response dict from the Evaluate API, containing fields like `value`, `label`, `explanation`, `context`, `tokenUsage`, and `ignoredReferenceInputFields`. See [Getting started with on-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./getting-started-on-demand.html>) for the full response format.

A scenario with status `FAILED` means a structural problem occurred (agent invocation error, span collection failure). Individual evaluator errors within a `COMPLETED` scenario are recorded in the evaluator’s `results` list with `errorCode` and `errorMessage` fields.

