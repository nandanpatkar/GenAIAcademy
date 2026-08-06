# Amazon Bedrock AgentCore generated observability data - Amazon Bedrock AgentCore

Source: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-service-provided.html

---

# Amazon Bedrock AgentCore generated observability data

For agents running in the AgentCore runtime, AgentCore automatically generates a set of session metrics which you can view in the Amazon CloudWatch Logs generative AI observability page. You can also use AgentCore observability to monitor the performance of memory, gateway, and built-in tool resources, even if you’re not using the AgentCore runtime to host your agents. For memory, gateway, and built-in tool resources, AgentCore outputs a default set of data to CloudWatch.

The following table summarizes the default data provided for each resource type, and where the data is available.

Resource type | Service-provided data | Available in Amazon CloudWatch gen AI observability | Available in CloudWatch (Logs or metrics)  
---|---|---|---  
Agent |  Metrics, Spans*, Logs* |  Yes |  Yes  
Memory |  Metrics, Spans*, Logs* |  Yes |  Yes  
Payments |  Metrics, Spans, Logs |  Yes |  Yes  
Gateway |  Metrics, Spans, Logs* |  Yes |  Yes  
Tools |  Metrics, Spans*, Logs* |  Yes |  Yes  
Policy |  Metrics, Spans*, Logs |  Yes |  Yes  
  
  * Signals marked with an asterisk require explicit enablement. Metrics are provided by default for all resource types. See [Add observability to your Amazon Bedrock AgentCore resources](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html>) to learn more.


Policy related observability is displayed under the AgentCore Gateway tab in CloudWatch gen AI observability.

###### Note

To view metrics, spans, and traces for AgentCore, you need to perform a one-time setup process to enable CloudWatch Transaction Search. To learn more see [Enabling AgentCore observability](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-builtin>).

Refer to the following topics to learn about the default service-provided observability metrics for AgentCore runtime, memory, and gateway resources.

By instrumenting your agent code, you can also gather more detailed trace and span data as well as custom metrics. See [Enabling observability in agent code for AgentCore-hosted agents](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-configure.html#observability-configure-custom>) to learn more.

###### Topics

  * [AgentCore generated runtime observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-runtime-metrics.html>)

  * [AgentCore generate memory observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-memory-metrics.html>)

  * [AgentCore generated payments observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-payments-metrics.html>)

  * [AgentCore generated gateway observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-gateway-metrics.html>)

  * [AgentCore generated built-in tools observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-tool-metrics.html>)

  * [AgentCore generated identity observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-identity-metrics.html>)

  * [AgentCore generated Policy in AgentCore observability data](<https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/./observability-policy-metrics.html>)



