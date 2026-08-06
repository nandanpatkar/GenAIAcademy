# Evaluate agent performance with Amazon Bedrock AgentCore Evaluations - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/evaluations.html

---

# Evaluate agent performance with Amazon Bedrock AgentCore Evaluations

Amazon Bedrock AgentCore Evaluations provides automated assessment tools to measure how well your agent or tools perform specific tasks, handle edge cases, and maintain consistency across different inputs and contexts. The service enables data-driven optimization and ensures your agents meet quality standards before and after deployment.

AgentCore Evaluations integrates with popular agent frameworks including **Strands** and **LangGraph** with **OpenTelemetry** and **OpenInference** instrumentation libraries. Under the hood, traces from these agents are converted to a unified format and scored using LLM-as-a-Judge techniques for both built-in and custom evaluators.

Each evaluator has a unique Amazon Resource Name (ARN) and resource policy attached to it. Evaluator ARNs follow these formats:


```text
arn:aws:bedrock-agentcore:::evaluator/Builtin.Helpfulness (for built-in evaluators)
```

```text
arn:aws:bedrock-agentcore:region:account:evaluator/my-evaluator-id (for custom evaluators)
```


Built-in evaluators are public and accessible to all users. Custom evaluation resources are private and can only be accessed by users who are explicitly granted access. To grant access, you can use IAM resource-based policies for evaluators and evaluation configurations, and IAM identity-based policies for users and roles.

By default, you can create up to 1,000 evaluation configurations per AWS Region in an AWS account. The service supports up to 1 million input and output tokens per minute per account for large regions.

###### Topics

  * [How it works](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./how-it-works-evaluations.html>)

  * [Supported agent frameworks](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./supported-frameworks.html>)

  * [Built-in evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./built-in-evaluators-overview.html>)

  * [Custom evaluators](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./custom-evaluators.html>)

  * [Online evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./online-evaluations.html>)

  * [On-demand evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./on-demand-evaluations.html>)

  * [Batch evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./batch-evaluations.html>)

  * [Dataset evaluation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./dataset-evaluations.html>)

  * [Simulation](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./simulation.html>)

  * [Diagnose AgentCore Evaluation issues with an AI coding assistant](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./diagnose-evaluation-issues.html>)

  * [Encryption at rest for AgentCore Evaluations](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./evaluations-encryption.html>)



