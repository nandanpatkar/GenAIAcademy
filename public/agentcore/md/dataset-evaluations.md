# Dataset evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/dataset-evaluations.html

---

# Dataset evaluation

###### Note

Dataset evaluation is in public preview. Features and APIs may change before general availability.

Dataset evaluations let you run your agent against a set of scenarios and automatically evaluate the results. Instead of manually invoking your agent, collecting spans, and calling the Evaluate API, a dataset runner orchestrates the entire lifecycle in a single call: invoke the agent, wait for telemetry ingestion, and evaluate.

This is useful for regression testing, benchmark datasets, CI/CD pipelines, baseline measurement, and pre/post comparison after configuration changes.

The AgentCore SDK provides two dataset runners that share the same [dataset schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-schema.html>) and ground truth format but differ in where evaluation happens:

  * **On-demand dataset runner** (`OnDemandEvaluationDatasetRunner`) — Collects spans and calls the Evaluate API client-side. Best for dev-time iteration and small datasets.

  * **Batch dataset runner** (`BatchEvaluationRunner`) — Delegates span collection and evaluation to the service via the batch evaluation API. Best for large datasets and production baselines.


**Choosing a runner**

Aspect | On-demand runner | Batch runner  
---|---|---  
Span collection |  SDK-side via `AgentSpanCollector` |  Server-side; service reads from CloudWatch directly  
Evaluate API calls |  SDK calls `evaluate()` per evaluator per scenario |  SDK calls `startBatchEvaluation()` once  
Execution model |  Synchronous three-phase pipeline (invoke, wait, evaluate) |  Asynchronous four-phase pipeline (invoke, wait, submit, poll)  
Results |  Structured `EvaluationResult` with per-scenario, per-evaluator detail |  Aggregate `BatchEvaluationSummary` with per-evaluator averages, plus per-session detail in CloudWatch  
Best for |  Dev-time iteration, CI/CD, small datasets, when you need per-scenario detail immediately |  Baseline measurement, large datasets, pre/post comparison, when aggregate scores are sufficient  
  
**Prerequisites**

Both runners require:

  * Python 3.10+

  * An agent deployed on AgentCore Runtime with observability enabled, or an agent built with a supported framework configured with [AgentCore Observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html#observability-configure-3p>). Supported frameworks:

    * Strands Agents

    * LangGraph with `opentelemetry-instrumentation-langchain` or `openinference-instrumentation-langchain`

  * Transaction Search enabled in CloudWatch; see [Enable Transaction Search](<https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search-getting-started.html>)

  * The AgentCore SDK installed: `pip install bedrock-agentcore`

  * AWS credentials configured with permissions for `bedrock-agentcore`, `bedrock-agentcore-control`, and `logs` (CloudWatch)


###### Topics

  * [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-prereqs.html>)

  * [Getting started](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-getting-started.html>)

  * [Dataset schema](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-schema.html>)

  * [Manage datasets](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-manage.html>)

  * [Manage dataset examples](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-examples.html>)

  * [Manage dataset versions](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-versions.html>)

  * [Dataset encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./datasets-encryption.html>)

  * [On-demand dataset runner](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-on-demand.html>)

  * [Batch dataset runner](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations-batch.html>)



