# Batch dataset runner - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations-batch.html

---

# Batch dataset runner

The `BatchEvaluationRunner` delegates span collection and evaluation entirely to the service via the `StartBatchEvaluation` and `GetBatchEvaluation` APIs. After invoking your agent for each scenario, the runner submits a batch job and polls until it completes, returning aggregate results.

Use the batch runner when you need aggregate scores across many sessions without managing span collection yourself; for baseline measurement, large datasets, and pre/post comparison.

## How it works

The runner processes scenarios in four phases:

  1. **Invoke:** All scenarios run concurrently using a thread pool. Each scenario gets a unique session ID, and turns within a scenario execute sequentially to maintain conversation context.

  2. **Wait:** A configurable ingestion delay (default: 180 seconds) allows CloudWatch to ingest the telemetry data. This delay is paid once, not per scenario.

  3. **Submit:** The runner calls `StartBatchEvaluation` with the CloudWatch log group, session IDs from the invocation phase, evaluator IDs, and ground truth from the dataset.

  4. **Poll:** The runner polls `GetBatchEvaluation` until the job reaches a terminal state and returns the aggregate results.


## Agent invoker

The runner requires an agent invoker, a callable that invokes your agent for a single turn. The invoker is framework-agnostic: you can call your agent via boto3 `invoke_agent_runtime`, a direct function call, HTTP request, or any other method.

```python
import json
import boto3
from bedrock_agentcore.evaluation import AgentInvokerInput, AgentInvokerOutput

REGION       = "<region-code>"
AGENT_ARN    = "arn:aws:bedrock-agentcore:<region-code>:<account-id>:runtime/<agent-id>"
LOG_GROUP    = "/aws/bedrock-agentcore/runtimes/<agent-id>-DEFAULT"
SERVICE_NAME = "<agent-id>.DEFAULT"

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

The following example loads a dataset from a JSON file and runs the batch evaluation. For the dataset format, see [Dataset schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-schema.html>).

```python
from bedrock_agentcore.evaluation import (
    BatchEvaluationRunner,
    BatchEvaluationRunConfig,
    BatchEvaluatorConfig,
    CloudWatchDataSourceConfig,
    FileDatasetProvider,
)

# Load dataset from a local file (see Dataset schema for format)
dataset = FileDatasetProvider("dataset.json").get_dataset()

# Or load from the Dataset Management service
from bedrock_agentcore.evaluation import DatasetClient, DatasetManagementServiceProvider
ds_client = DatasetClient(region_name=REGION)
dataset = DatasetManagementServiceProvider(dataset_id="my-dataset-id", client=ds_client).get_dataset()

# Configure the batch evaluation
config = BatchEvaluationRunConfig(
    batch_evaluation_name="dataset-batch-eval",
    evaluator_config=BatchEvaluatorConfig(
        evaluator_ids=[
            "Builtin.GoalSuccessRate",
            "Builtin.Correctness",
            "Builtin.TrajectoryExactOrderMatch",
            "Builtin.Helpfulness",
        ],
    ),
    data_source=CloudWatchDataSourceConfig(
        service_names=[SERVICE_NAME],
        log_group_names=[LOG_GROUP],
        ingestion_delay_seconds=180,
    ),
    polling_timeout_seconds=1800,
    polling_interval_seconds=30,
)

# Run
runner = BatchEvaluationRunner(region=REGION)
result = runner.run_dataset_evaluation(
    agent_invoker=agent_invoker,
    dataset=dataset,
    config=config,
)

# Display aggregate results
print(f"Status: {result.status}")
print(f"Batch evaluation ID: {result.batch_evaluation_id}")

if result.evaluation_results:
    er = result.evaluation_results
    print(f"Sessions completed: {er.number_of_sessions_completed}")
    print(f"Sessions failed:    {er.number_of_sessions_failed}")
    print(f"Total sessions:     {er.total_number_of_sessions}")

    for summary in er.evaluator_summaries or []:
        avg = summary.statistics.average_score if summary.statistics else None
        print(f"  {summary.evaluator_id}: avg={avg}")
```
## Fetching per-session detail

The aggregate results show averages across all sessions. To see per-session, per-evaluator scores, fetch the evaluation events from CloudWatch:

```python
if result.output_data_config:
    events = runner.fetch_evaluation_events(result)
    print(f"\nEvaluation events: {len(events)}")
    for ev in events:
        attrs = ev.get("attributes", {})
        print(f"  session: {attrs.get('session.id', '')[:40]}")
        print(f"  evaluator: {attrs.get('gen_ai.evaluation.name')}")
        print(f"  score: {attrs.get('gen_ai.evaluation.score.value')}")
        print(f"  label: {attrs.get('gen_ai.evaluation.score.label')}")
        print()
```
## Configuration reference

```text
BatchEvaluationRunConfig(
    batch_evaluation_name="my-batch-eval",   # Job name
    evaluator_config=BatchEvaluatorConfig(
        evaluator_ids=["Builtin.GoalSuccessRate"],
    ),
    data_source=CloudWatchDataSourceConfig(
        service_names=["MyAgent.DEFAULT"],   # Exactly 1 service name
        log_group_names=[LOG_GROUP],         # 1-5 log group names
        ingestion_delay_seconds=180,         # Wait for CW ingestion (default: 180)
    ),
    polling_timeout_seconds=1800,            # Max wait for job completion (default: 1800)
    polling_interval_seconds=30,             # Poll interval (default: 30)
    simulation_config=None,                  # Set SimulationConfig for simulated scenarios
)
```
Field | Default | Description  
---|---|---  
`batch_evaluation_name` |  — |  Name for the batch evaluation job.  
`evaluator_config.evaluator_ids` |  — |  List of evaluator IDs (built-in or custom).  
`data_source.service_names` |  — |  Service name identifying your agent’s traces in CloudWatch.  
`data_source.log_group_names` |  — |  CloudWatch log group names where agent telemetry is stored.  
`data_source.ingestion_delay_seconds` |  180 |  Seconds to wait after invocation for CloudWatch to ingest spans.  
`polling_timeout_seconds` |  1800 |  Maximum seconds to wait for the batch job to complete.  
`polling_interval_seconds` |  30 |  Seconds between poll requests.  
`simulation_config` |  None |  Configuration for simulated scenarios. Set `SimulationConfig(model_id="…​")` when the dataset contains `SimulatedScenario` instances. See [User simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./user-simulation.html>).  
  
## Result structure

The runner returns a `BatchEvaluationResult`:

```text
BatchEvaluationResult
  ├── batch_evaluation_id: str
  ├── batch_evaluation_arn: str
  ├── batch_evaluation_name: str
  ├── status: str
  ├── created_at: datetime
  ├── evaluation_results: Optional[BatchEvaluationSummary]
  │     ├── number_of_sessions_completed: int
  │     ├── number_of_sessions_in_progress: int
  │     ├── number_of_sessions_failed: int
  │     ├── number_of_sessions_ignored: int
  │     ├── total_number_of_sessions: int
  │     └── evaluator_summaries: List
  │           ├── evaluator_id: str
  │           ├── statistics.average_score: float
  │           ├── total_evaluated: int
  │           └── total_failed: int
  ├── error_details: Optional[List[str]]
  ├── agent_invocation_failures: List[FailedScenario]
  └── output_data_config: Optional[CloudWatchOutputDataConfig]
        ├── log_group_name: str
        └── log_stream_name: str
```
  * `agent_invocation_failures` lists scenarios where the agent invocation failed before the batch job was submitted. These sessions are not included in the batch evaluation.

  * `output_data_config` points to the CloudWatch log stream where per-session detail is written. Use `runner.fetch_evaluation_events(result)` to read it.


## Error handling

  * **Scenario invocation failures** are recorded as `FailedScenario` but do not block the batch job; only successful sessions are submitted.

  * If **all scenarios fail** , the runner raises `ValueError` before calling the API.

  * **Polling timeout:** `TimeoutError` if the job exceeds `polling_timeout_seconds`.

  * **Job failure:** `RuntimeError` if the batch evaluation status is `FAILED` or `STOPPED`.



