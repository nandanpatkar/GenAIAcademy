# On-demand evaluation - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/on-demand-evaluations.html

---

# On-demand evaluation

On-demand evaluation provides a flexible way to evaluate specific agent interactions by directly analyzing a chosen set of spans. Unlike online evaluation which continuously monitors production traffic, on-demand evaluation lets you perform targeted assessments of selected interactions at any time.

With on-demand evaluation, you specify the exact spans or traces you want to evaluate by providing their span or trace IDs. You can then apply the same comprehensive evaluation methods available in online evaluation, including [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>) or [Built-in evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./built-in-evaluators-overview.html>) . This evaluation type is particularly useful when you need to investigate specific customer interactions, validate fixes for reported issues, or analyze historical data for quality improvements. Once you submit the evaluation request, the service processes only the specified spans and provides detailed results for your analysis.

This evaluation type complements online evaluation by offering precise control over which interactions to evaluate, making it an effective tool for focused quality assessment and issue investigation.

###### Topics

  * [IAM permissions for on-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./iam-permissions-on-demand.html>)

  * [Getting started with on-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./getting-started-on-demand.html>)

  * [Ground truth evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./ground-truth-evaluations.html>)

  * [Understanding input spans](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./understanding-input-spans.html>)



