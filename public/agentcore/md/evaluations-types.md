# Evaluation types - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations-types.html

---

# Evaluation types

AgentCore Evaluations provides three evaluation types, which differ in when and how the evaluation is performed:

###### Topics

  * Online evaluation

  * On-demand evaluation

  * Batch evaluation


## Online evaluation

Online evaluation continuously monitors the quality of deployed agents using live production traffic. Unlike one-off evaluation in development environments, it provides continuous performance assessment across multiple criteria, enabling persistent monitoring in production.

Online evaluation consists of three main components. First, session sampling and filtering allows you to configure specific rules to evaluate agent interactions. You can set percentage-based sampling to evaluate a portion of all sessions (for example, 10%) or define conditional filters for more targeted evaluation. Second, you can choose from multiple evaluation methods including creating new [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>) , using existing custom evaluators, or selecting from [Built-in evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluators.html#built-in-evaluators>) . Finally, the monitoring and analysis capabilities lets you view aggregated scores in dashboards, track quality trends over time, investigate low-scoring sessions, and analyze complete interaction flows from input to output.

## On-demand evaluation

On-demand evaluation provides a flexible way to evaluate specific agent interactions by directly analyzing a chosen set of spans. Unlike online evaluation which continuously monitors production traffic, on-demand evaluation lets you perform targeted assessments of selected interactions at any time.

With on-demand evaluation, you specify the exact spans or traces you want to evaluate by providing their span or trace IDs. You can then apply the same comprehensive evaluation methods available in online evaluation, including [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>) or [Built-in evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluators.html#built-in-evaluators>) . This evaluation type is particularly useful when you need to try out your own custom evaluator, investigate specific customer interactions, validate fixes for reported issues, or analyze historical data for quality improvements. Once you submit the evaluation request, the service processes only the spans and traces you specify and returns detailed results for your analysis.

This evaluation type complements online evaluation by offering precise control over which interactions to assess, making it an effective tool for focused quality analysis and issue investigation. It is also well suited for early stages of the agent development lifecycle, such as build-time testing.

## Batch evaluation

Batch evaluation runs evaluators against multiple agent sessions in a single asynchronous job. Unlike on-demand evaluation where you collect spans and call the Evaluate API per session, batch evaluation handles session discovery, span collection, and scoring entirely on the service side. You submit a job specifying the CloudWatch Logs location of your agent sessions and which evaluators to run. The service processes all matching sessions and returns aggregate results with per-evaluator average scores.

Batch evaluation supports ground truth through session metadata, enabling reference-based scoring with expected responses, assertions, and expected tool trajectories. Results include both aggregate summaries (per-evaluator averages and session counts) and per-session detail written to CloudWatch Logs.

This evaluation type is designed for baseline measurement before making changes, pre/post comparison after applying prompt or model updates, regression testing across curated session sets, and periodic quality audits across production traffic from a specific time window.

