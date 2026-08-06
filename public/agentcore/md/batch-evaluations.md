# Batch evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/batch-evaluations.html

---

# Batch evaluation

Batch evaluation runs evaluators against multiple agent sessions in a single job with server-side orchestration. Unlike on-demand evaluation where you collect spans and call the Evaluate API yourself, batch evaluation handles session discovery, span collection, and scoring entirely on the service side. You submit a job, and the service processes all matching sessions and returns aggregate results.

Use batch evaluation when you need to:

  * **Measure a baseline** before making changes to your agent’s prompt, tools, or model.

  * **Validate improvements** by comparing scores before and after a configuration change.

  * **Run regression tests** across a curated set of sessions or scenarios.

  * **Monitor quality periodically** across production sessions from a specific time window.


**How it works**

A batch evaluation job follows this flow:

  1. **You start a job** by specifying a session source (where to find agent sessions) and an evaluation configuration (which evaluators to run). Optionally, you provide ground truth metadata for reference-based scoring.

  2. **The service discovers sessions** from CloudWatch Logs based on the log groups and filters you specify.

  3. **The service runs evaluators** against each discovered session. Each evaluator scores each session independently. If ground truth is provided, evaluators that support reference-based scoring use it.

  4. **You poll for results.** The job transitions through `PENDING` → `IN_PROGRESS` → `COMPLETED` (or `FAILED`). When complete, the response includes aggregate summaries with per-evaluator average scores, session counts, and token usage.

  5. **Per-session detail** is available in CloudWatch Logs at the location specified in `outputDataConfig` in the response.


**Comparison with other evaluation types**

Aspect | On-demand | Online | Batch  
---|---|---|---  
Trigger |  Caller-initiated, synchronous |  Continuous, event-driven |  Caller-initiated, asynchronous  
Session source |  Caller provides spans inline |  Watches a log group |  Service discovers from CloudWatch Logs  
Scope |  Single session |  All sessions matching sampling rules |  Multiple sessions (time range, session IDs, or full log group)  
Ground truth |  Via `evaluationReferenceInputs` |  Not supported |  Via `sessionMetadata` with inline ground truth  
Results |  Synchronous response |  CloudWatch metrics and dashboards |  Aggregate summaries with per-evaluator averages, plus per-session detail in CloudWatch  
Use case |  Dev-time spot checks, CI/CD |  Production monitoring |  Baseline measurement, pre/post comparison, regression testing  
  
###### Topics

  * [Prerequisites](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-prereqs.html>)

  * [Getting started with batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-getting-started.html>)

  * [Start batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-start.html>)

  * [Get batch evaluation results](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-get.html>)

  * [List batch evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-list.html>)

  * [Stop batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-stop.html>)

  * [Delete batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-delete.html>)

  * [Understanding results and output](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-results.html>)

  * [Batch evaluation encryption](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations-encryption.html>)



